const fs = require('fs');
const path = require('path');

const dbSeederFile = path.join(__dirname, 'db_seeder_data.json');
const outputFile = path.join(__dirname, 'production_update_80_packages.sql');

try {
    const data = JSON.parse(fs.readFileSync(dbSeederFile, 'utf8'));

    let sql = `-- ==========================================================\n`;
    sql += `-- AlMulhim Travel Production UPDATE Script (80 Packages)\n`;
    sql += `-- ==========================================================\n\n`;

    // We will do an UPDATE for the package fields.
    // And for Itineraries/Features, we will DELETE the old ones for the package and INSERT the new ones.

    data.forEach((dest, dIndex) => {
        dest.Packages.forEach(pack => {
            const packageIdStr = pack.PackageId.replace(/'/g, "''");
            const titleEnStr = pack.TitleEn.replace(/'/g, "''");
            const subtitleStr = pack.Subtitle.replace(/'/g, "''");
            
            // 1. UPDATE Package
            sql += `UPDATE Packages \n`;
            sql += `SET Price = ${pack.Price}, \n`;
            sql += `    TitleEn = N'${titleEnStr}', \n`;
            sql += `    Subtitle = N'${subtitleStr}' \n`;
            sql += `WHERE PackageId = N'${packageIdStr}';\n\n`;

            // 2. We need the internal GUID to delete/insert related items. 
            // In SQL we can declare a variable
            let varName = `PackId_${pack.PackageId.replace(/-/g, '_')}`;
            sql += `DECLARE @${varName} UNIQUEIDENTIFIER;\n`;
            sql += `SELECT @${varName} = Id FROM Packages WHERE PackageId = N'${packageIdStr}';\n`;
            sql += `IF @${varName} IS NOT NULL\n`;
            sql += `BEGIN\n`;
            
            // Delete old itineraries and features
            sql += `    DELETE FROM PackageHotels WHERE PackageId = @${varName};\n`;
            sql += `    DELETE FROM PackageItineraries WHERE PackageId = @${varName};\n`;
            sql += `    DELETE FROM PackageFeatures WHERE PackageId = @${varName};\n\n`;

            if (pack.Hotels && pack.Hotels.length > 0) {
                pack.Hotels.forEach((h, hIdx) => {
                    const nameStr = (h.HotelName || 'فندق متميز').replace(/'/g, "''");
                    const imgStr = (h.ImageUrl || pack.ImageUrl).replace(/'/g, "''");
                    const stars = h.Rating > 0 ? h.Rating : 4;
                    const nights = pack.DurationNights || 1;

                    sql += `    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)\n`;
                    sql += `    VALUES (NEWID(), @${varName}, N'${nameStr}', N'', ${stars}, ${nights}, N'${imgStr}', N'${imgStr}', ${hIdx});\n`;
                });
            }

            // Insert new itineraries
            pack.Itineraries.forEach(iti => {
                const titleStr = iti.Title.replace(/'/g, "''");
                const descStr = iti.Description.replace(/'/g, "''");
                const imgStr = iti.ImageUrl.replace(/'/g, "''");

                sql += `    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)\n`;
                sql += `    VALUES (NEWID(), @${varName}, ${iti.Day}, N'${titleStr}', N'${descStr}', N'${imgStr}');\n`;
            });

            // Insert new features
            sql += `\n    INSERT INTO PackageFeatures (Id, PackageId, Text)\n`;
            sql += `    VALUES (NEWID(), @${varName}, N'مسار رحلة ممتاز');\n`;
            
            sql += `END\n\n`;
            sql += `GO\n\n`; // using GO to separate batches to avoid variable redeclaration overlaps if we used the same name, but since name is unique it's fine.
        });
    });

    fs.writeFileSync(outputFile, '\uFEFF' + sql, 'utf8');
    console.log(`✅ Created production update script: ${outputFile}`);

} catch (err) {
    console.error('Error generating update SQL:', err);
}
