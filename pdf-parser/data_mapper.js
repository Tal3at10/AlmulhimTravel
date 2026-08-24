const fs = require('fs');
const path = require('path');

const inputJsonFile = path.join(__dirname, 'extracted_packages_data.json');
const outputMapperFile = path.join(__dirname, 'db_seeder_data.json');

// Unsplash high quality placeholders per destination (acting as our generic image filler for now)
const destImages = {
    'ماليزيا': 'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop',
    'المالديف': 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop',
    'اندونيسيا': 'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop',
    'بانكوك': 'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop',
    'بوكيت': 'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop',
    'تركيا': 'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop',
    'روسيا': 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop',
    'فيتنام': 'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop',
    'أذربيجان': 'https://images.unsplash.com/photo-1601004126442-f8c7e0cce89a?q=80&w=1920&auto=format&fit=crop',
    'اوربا': 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=1920&auto=format&fit=crop',
    'default': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1920&auto=format&fit=crop'
};

function generateSlug(str) {
    return str.toLowerCase().replace(/[^a-zA-Z0-9\u0600-\u06FF]+/g, '-').replace(/(^-|-$)/g, '');
}

function processData() {
    console.log("🚀 Transforming RAW PDF Data into Database Map...");
    if (!fs.existsSync(inputJsonFile)) {
        console.error(`❌ Input file not found: ${inputJsonFile}`);
        return;
    }

    const rawData = JSON.parse(fs.readFileSync(inputJsonFile, 'utf8'));
    const destinationsMap = {};

    rawData.forEach(item => {
        // Find destination name from folder
        let destName = item.destinationFolder.split('-')[0].trim();
        
        let coverImg = destImages['default'];
        for(let key in destImages) {
            if(destName.includes(key)) { coverImg = destImages[key]; break; }
        }

        if (!destinationsMap[destName]) {
            destinationsMap[destName] = {
                Slug: generateSlug(destName),
                NameAr: destName,
                NameEn: 'Destination En', // Needs DB update later or via translation
                Country: destName,
                ImageUrl: coverImg,
                Description: `اكتشف جمال وعراقة ${destName} مع برامج الملحم السياحية الفاخرة المميزة.`,
                Packages: []
            };
        }

        // Parse package info from PDF file name
        // Example: عرض 10 ايام - 9 ليالي.pdf
        const fileName = item.pdfFileName.replace('.pdf', '');
        let days = 0, nights = 0;
        
        // Regex to extract numbers for days/nights. Often "10 ايام"
        const numbers = fileName.match(/\d+/g);
        if (numbers && numbers.length >= 2) {
            // Usually the bigger number is days
            let n1 = parseInt(numbers[0]);
            let n2 = parseInt(numbers[1]);
            days = Math.max(n1, n2);
            nights = Math.min(n1, n2);
        } else if (numbers && numbers.length === 1) {
            days = parseInt(numbers[0]);
            nights = days - 1 > 0 ? days - 1 : 1;
        }

        if(days === 0) { days = 5; nights = 4; } // Default fallback

        // Itineraries Generation based on days
        const itineraries = [];
        for (let i = 1; i <= days; i++) {
            itineraries.push({
                Day: i,
                Title: `اليوم ${i}`,
                Description: `وصف تفصيلي لجولات اليوم رقم ${i} في ${destName}. الإفطار في الفندق والانطلاق للفعاليات.`,
                ImageUrl: coverImg
            });
        }

        // A fake but realistic price based on days
        const price = days * 450 + 1500; // Formula for Saudi Riyal approx

        const pack = {
            PackageId: generateSlug(`pkg-${destName}-${days}-days`),
            TitleAr: `بكج ${destName} الساحرة - ${fileName.replace(/[0-9()\-]/g, '').trim()} ${days} أيام`,
            TitleEn: `Amazing ${destName} ${days} Days Package`,
            Subtitle: `استمتع بـ ${nights} ليالي من الرفاهية في أفضل فنادق ${destName}`,
            DurationDays: days,
            DurationNights: nights,
            Duration: `${days} أيام / ${nights} ليالي`,
            Price: price,
            Currency: "ر.س",
            ImageUrl: coverImg, // We can replace this with specific URLs later
            Vibe: "tropical",
            Rating: 4.8,
            IsOffer: fileName.includes('عرض') || fileName.includes('عروض'),
            IsActive: true,
            Itineraries: itineraries,
            Hotels: [
                { HotelName: `فندق الملحم الفاخر - ${destName}`, Rating: 5, ImageUrl: coverImg }
            ]
        };

        // Don't add duplicate package names for identical pdf variations
        if (!destinationsMap[destName].Packages.find(p => p.DurationDays === days && p.DurationNights === nights)) {
             destinationsMap[destName].Packages.push(pack);
        }
    });

    const finalResult = Object.values(destinationsMap);
    fs.writeFileSync(outputMapperFile, JSON.stringify(finalResult, null, 2));

    console.log(`\n✅ Generated DB Seeding Map! Created ${finalResult.length} Destinations with a total of ${rawData.length} packages.`);
    console.log(`\n📁 File saved to: ${outputMapperFile}`);
}

processData();
