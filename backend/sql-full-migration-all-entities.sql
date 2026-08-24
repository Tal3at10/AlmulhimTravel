-- ============================================================================
-- COMPREHENSIVE PRODUCTION MIGRATION: All Entities
-- Date: 2025-04-16
-- Purpose: Make hidden/optional fields nullable across all CMS entities
-- WARNING: Run backup first!
-- ============================================================================

-- ============================================================================
-- STEP 1: BACKUP ALL TABLES
-- ============================================================================

-- Backup HeroSlides
IF OBJECT_ID('HeroSlides_Backup_20250416', 'U') IS NOT NULL DROP TABLE HeroSlides_Backup_20250416;
SELECT * INTO HeroSlides_Backup_20250416 FROM HeroSlides;

-- Backup Testimonials  
IF OBJECT_ID('Testimonials_Backup_20250416', 'U') IS NOT NULL DROP TABLE Testimonials_Backup_20250416;
SELECT * INTO Testimonials_Backup_20250416 FROM Testimonials;

-- Backup CustomerVideos
IF OBJECT_ID('CustomerVideos_Backup_20250416', 'U') IS NOT NULL DROP TABLE CustomerVideos_Backup_20250416;
SELECT * INTO CustomerVideos_Backup_20250416 FROM CustomerVideos;

-- Backup Destinations
IF OBJECT_ID('Destinations_Backup_20250416', 'U') IS NOT NULL DROP TABLE Destinations_Backup_20250416;
SELECT * INTO Destinations_Backup_20250416 FROM Destinations;

-- ============================================================================
-- STEP 2: HERO SLIDES - Make TitleAr, TitleEn nullable
-- ============================================================================
ALTER TABLE HeroSlides ALTER COLUMN TitleAr NVARCHAR(300) NULL;
ALTER TABLE HeroSlides ALTER COLUMN TitleEn NVARCHAR(300) NULL;

-- ============================================================================
-- STEP 3: TESTIMONIALS - Make ImageUrl nullable  
-- ============================================================================
ALTER TABLE Testimonials ALTER COLUMN ImageUrl NVARCHAR(500) NULL;

-- ============================================================================
-- STEP 4: CUSTOMER VIDEOS - Make ThumbnailUrl, Location, Date nullable
-- ============================================================================
ALTER TABLE CustomerVideos ALTER COLUMN ThumbnailUrl NVARCHAR(500) NULL;
ALTER TABLE CustomerVideos ALTER COLUMN Location NVARCHAR(200) NULL;
ALTER TABLE CustomerVideos ALTER COLUMN Date NVARCHAR(50) NULL;

-- ============================================================================
-- STEP 5: DESTINATIONS - Make NameEn, Slug, Description nullable
-- ============================================================================
-- Note: We need to drop the unique index on Slug first if it exists
IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Destinations_Slug' AND object_id = OBJECT_ID('Destinations'))
BEGIN
    DROP INDEX IX_Destinations_Slug ON Destinations;
    PRINT 'Dropped unique index on Slug';
END

-- Now make columns nullable
ALTER TABLE Destinations ALTER COLUMN NameEn NVARCHAR(200) NULL;
ALTER TABLE Destinations ALTER COLUMN Slug NVARCHAR(100) NULL;
ALTER TABLE Destinations ALTER COLUMN Description NVARCHAR(2000) NULL;

-- Recreate index as non-unique (to allow multiple NULLs)
CREATE NONCLUSTERED INDEX IX_Destinations_Slug ON Destinations(Slug);

-- ============================================================================
-- STEP 6: VERIFICATION
-- ============================================================================
SELECT 
    'HeroSlides' AS TableName,
    (SELECT COUNT(*) FROM HeroSlides) AS RowCount,
    (SELECT COUNT(*) FROM HeroSlides_Backup_20250416) AS BackupCount
UNION ALL
SELECT 
    'Testimonials',
    (SELECT COUNT(*) FROM Testimonials),
    (SELECT COUNT(*) FROM Testimonials_Backup_20250416)
UNION ALL
SELECT 
    'CustomerVideos',
    (SELECT COUNT(*) FROM CustomerVideos),
    (SELECT COUNT(*) FROM CustomerVideos_Backup_20250416)
UNION ALL
SELECT 
    'Destinations',
    (SELECT COUNT(*) FROM Destinations),
    (SELECT COUNT(*) FROM Destinations_Backup_20250416);

-- Show nullable status
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    IS_NULLABLE,
    DATA_TYPE
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME IN ('HeroSlides', 'Testimonials', 'CustomerVideos', 'Destinations')
  AND COLUMN_NAME IN ('TitleAr', 'TitleEn', 'ImageUrl', 'ThumbnailUrl', 'Location', 'Date', 'NameEn', 'Slug', 'Description')
ORDER BY TABLE_NAME, COLUMN_NAME;

PRINT 'Migration complete! All optional fields are now nullable.';
