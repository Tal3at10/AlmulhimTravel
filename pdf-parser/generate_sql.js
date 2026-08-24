const fs = require('fs');
const crypto = require('crypto');

const data = JSON.parse(fs.readFileSync('e:/Projects/AlMulhim-Travel/pdf-parser/db_seeder_data.json', 'utf8'));

let sql = `
-- ==========================================================
-- AlMulhim Travel Production Seeder Script (80 PDF Packages)
-- ==========================================================
`;

data.forEach((dest, dIndex) => {
    const destVar = `@Dest_${dIndex}`;
    sql += `
DECLARE ${destVar} UNIQUEIDENTIFIER;
SELECT ${destVar} = Id FROM Destinations WHERE NameAr = N'${dest.NameAr.replace(/'/g, "''")}';
IF ${destVar} IS NULL
BEGIN
    SET ${destVar} = NEWID();
    INSERT INTO Destinations (Id, NameAr, NameEn, Slug, Country, ImageUrl, Description, IsActive, SortOrder)
    VALUES (${destVar}, N'${dest.NameAr.replace(/'/g, "''")}', N'${dest.NameEn.replace(/'/g, "''")}', N'${dest.Slug.replace(/'/g, "''")}', N'${dest.Country.replace(/'/g, "''")}', N'${dest.ImageUrl.replace(/'/g, "''")}', N'${dest.Description.replace(/'/g, "''")}', 1, 100);
END
`;
    if (dest.Packages) {
        dest.Packages.forEach(pkg => {
            const pkgId = crypto.randomUUID();
            sql += `
IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'${pkg.PackageId.replace(/'/g, "''")}')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('${pkgId}', N'${pkg.PackageId.replace(/'/g, "''")}', ${destVar}, N'${pkg.TitleAr.replace(/'/g, "''")}', N'${pkg.TitleEn.replace(/'/g, "''")}', N'${pkg.Subtitle.replace(/'/g, "''")}', ${pkg.Price}, N'${pkg.Currency.replace(/'/g, "''")}', N'${pkg.Duration.replace(/'/g, "''")}', ${pkg.DurationDays}, ${pkg.DurationNights}, N'${pkg.ImageUrl.replace(/'/g, "''")}', N'', N'${pkg.Vibe.replace(/'/g, "''")}', ${pkg.Rating}, ${(pkg.IsOffer ? 1 : 0)}, ${(pkg.IsActive ? 1 : 0)}, GETUTCDATE());
`;
            if (pkg.Itineraries) {
                pkg.Itineraries.forEach(it => {
                    const itId = crypto.randomUUID();
                    sql += `
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('${itId}', '${pkgId}', ${it.Day}, N'${it.Title.replace(/'/g, "''")}', N'${it.Description.replace(/'/g, "''")}', N'${it.ImageUrl.replace(/'/g, "''")}');
`;
                });
            }

            if (pkg.Hotels) {
                pkg.Hotels.forEach((hotel, hIndex) => {
                    const hotelId = crypto.randomUUID();
                    let hotelLocation = "";
                    if (hotel.HotelName.includes("-")) {
                        hotelLocation = hotel.HotelName.split("-").pop().trim();
                    }
                    sql += `
    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('${hotelId}', '${pkgId}', N'${hotel.HotelName.replace(/'/g, "''")}', N'${hotelLocation.replace(/'/g, "''")}', ${hotel.Rating || 0}, 0, N'${hotel.ImageUrl.replace(/'/g, "''")}', N'${hotel.ImageUrl.replace(/'/g, "''")}', ${hIndex + 1});
`;
                });
            }

            const featureId = crypto.randomUUID();
            sql += `
    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('${featureId}', '${pkgId}', N'مسار رحلة ممتاز');
END
`;
        });
    }
});

fs.writeFileSync('e:/Projects/AlMulhim-Travel/pdf-parser/production_seed_80_packages.sql', sql, 'utf8');
console.log('✅ Created production_seed_80_packages.sql');
