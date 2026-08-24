using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

var configuration = new ConfigurationBuilder()
    .SetBasePath(Path.Combine(Directory.GetCurrentDirectory(), "src/APIs"))
    .AddJsonFile("appsettings.json")
    .AddEnvironmentVariables()
    .Build();

var connectionString = configuration.GetConnectionString("DefaultConnection");

if (string.IsNullOrWhiteSpace(connectionString))
{
    Console.WriteLine("❌ Connection string is empty!");
    return;
}

var sqlScript = @"
-- Clear old hero slides to start fresh
DELETE FROM HeroSlides;

-- Insert 3 beautiful premium slides with Cloudinary video URLs
INSERT INTO HeroSlides (Id, ImageUrl, TitleAr, TitleEn, SubtitleAr, SubtitleEn, VideoUrl, SortOrder, IsActive)
VALUES 
(
    NEWID(), 
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1920&q=80', 
    N'منتجع فاخر في المالديف', 
    'Luxury Maldives Resort', 
    N'استمتع بإقامة لا تُنسى في أرقى المنتجعات العالمية', 
    'Enjoy an unforgettable stay in world-class resorts', 
    'https://res.cloudinary.com/dlkxftysy/video/upload/q_auto,f_auto,w_1920/v1779236352/13550049_3840_2160_60fps_optimized_cqtcqw.mp4', 
    1, 
    1
),
(
    NEWID(), 
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80', 
    N'شواطئ استوائية خلابة', 
    'Tropical Beaches', 
    N'اكتشف سحر الطبيعة الاستوائية المدهش وأجمل الشواطئ', 
    'Discover the magic of tropical beaches', 
    'https://res.cloudinary.com/dlkxftysy/video/upload/q_auto,f_auto,w_1920/v1779236321/13446157_3840_2160_60fps_optimized_qqar8p.mp4', 
    2, 
    1
),
(
    NEWID(), 
    'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1920&q=80', 
    N'جزر المالديف الساحرة', 
    'Maldives Islands', 
    N'جنة على الأرض وتجربة سياحية فاخرة تفوق الخيال', 
    'Paradise on Earth and a luxury travel experience', 
    'https://res.cloudinary.com/dlkxftysy/video/upload/q_auto,f_auto,w_1920/v1779236303/13874845_3840_2160_30fps_optimized_turylc.mp4', 
    3, 
    1
);

-- Update BoardMembers with IsActive = 1 to show the chairman correctly
UPDATE BoardMembers SET IsActive = 1;
";

try
{
    using var connection = new SqlConnection(connectionString);
    await connection.OpenAsync();
    
    using var command = new SqlCommand(sqlScript, connection);
    var rowsAffected = await command.ExecuteNonQueryAsync();
    
    Console.WriteLine($"✅ SQL script executed successfully! Rows affected: {rowsAffected}");
}
catch (Exception ex)
{
    Console.WriteLine($"❌ Error: {ex.Message}");
}
