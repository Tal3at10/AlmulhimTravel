const fs = require('fs');
const path = require('path');

const dbSeederFile = path.join(__dirname, 'db_seeder_data.json');
const aiFile = path.join(__dirname, 'ai_extracted_packages.json');

try {
    const dbSeederObj = JSON.parse(fs.readFileSync(dbSeederFile, 'utf8'));
    const aiPackages = JSON.parse(fs.readFileSync(aiFile, 'utf8'));

    let matchedPackages = 0;

    dbSeederObj.forEach(dest => {
        dest.Packages.forEach(pack => {
            let days = pack.DurationDays;
            let nights = pack.DurationNights;
            let destSearchTerm = dest.NameAr;

            let possibleAI = aiPackages.filter(ai => {
                let destClean = destSearchTerm.replace(" مدن ", " ").replace(" جزيرة ", " ").trim();
                let aiDestClean = ai.Destination.replace(" مدن ", " ").replace(" جزيرة ", " ").trim();
                let isMatch = destClean.includes(aiDestClean) || aiDestClean.includes(destClean);
                
                if (!isMatch) {
                    if (destClean.includes("تايلاند") && (aiDestClean.includes("بوكيت") || aiDestClean.includes("بانكوك"))) isMatch = true;
                    if (destClean.includes("مالديف") && aiDestClean.includes("مالديف")) isMatch = true;
                    if (destClean.includes("جورجيا") && aiDestClean.includes("جورجيا")) isMatch = true;
                    if (destClean.includes("اذربيجان") && (aiDestClean.includes("أذربيجان") || aiDestClean.includes("اذربيجان"))) isMatch = true;
                }
                return isMatch;
            });

            let preciseMatches = possibleAI.filter(ai => ai.Days == days && ai.Nights == nights);
            let aiMatch = null;

            if(preciseMatches.length > 0) {
                aiMatch = preciseMatches[0];
            } else {
                let globalMatches = possibleAI.filter(ai => ai.Days == days && pack.TitleAr.includes(ai.Days.toString()));
                if(globalMatches.length > 0) {
                     aiMatch = globalMatches[0];
                }
            }

            if(aiMatch) {
                matchedPackages++;

                if(aiMatch.Price && aiMatch.Price > 0) {
                    pack.Price = aiMatch.Price;
                }

                if(aiMatch.Hotels && aiMatch.Hotels.length > 0) {
                    pack.Hotels = aiMatch.Hotels.map(h => {
                        return {
                            HotelName: h.HotelName || "فندق سياحي مميز",
                            Rating: h.Rating > 0 ? h.Rating : 4,
                            ImageUrl: pack.ImageUrl
                        };
                    });
                }

                if (aiMatch.Itineraries && aiMatch.Itineraries.length > 0) {
                    pack.Itineraries = aiMatch.Itineraries.map((iti, idx) => {
                        let dayNum = iti.Day || (idx + 1);
                        return {
                            Day: dayNum,
                            Title: "اليوم " + dayNum,
                            Description: iti.Description || "جولة سياحية حرة",
                            ImageUrl: pack.ImageUrl
                        };
                    });
                }

                if(pack.Hotels.length > 0) {
                     pack.Subtitle = "استمتع بـ " + pack.DurationNights + " ليالي من الرفاهية في " + pack.Hotels[0].HotelName + " وغيرها";
                }

                pack.TitleEn = "Amazing " + (aiMatch.Destination || dest.NameEn) + " " + days + " Days Deal";
            }
        });
    });

    console.log("Successfully matched and injected real AI data into " + matchedPackages + " packages!");

    fs.writeFileSync(dbSeederFile, JSON.stringify(dbSeederObj, null, 2), 'utf8');
    console.log("Database map updated successfully!");

} catch (e) {
    console.error("Error during injection:", e);
}
