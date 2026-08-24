-- ============================================================================
-- SIMPLE PRODUCTION MIGRATION: All Entities
-- Date: 2025-04-16
-- ============================================================================

-- STEP 1: BACKUP ALL TABLES (Run these one by one if needed)
IF OBJECT_ID('HeroSlides_Backup_20250416', 'U') IS NOT NULL DROP TABLE HeroSlides_Backup_20250416;
SELECT * INTO HeroSlides_Backup_20250416 FROM HeroSlides;

IF OBJECT_ID('Testimonials_Backup_20250416', 'U') IS NOT NULL DROP TABLE Testimonials_Backup_20250416;
SELECT * INTO Testimonials_Backup_20250416 FROM Testimonials;

IF OBJECT_ID('CustomerVideos_Backup_20250416', 'U') IS NOT NULL DROP TABLE CustomerVideos_Backup_20250416;
SELECT * INTO CustomerVideos_Backup_20250416 FROM CustomerVideos;

IF OBJECT_ID('Destinations_Backup_20250416', 'U') IS NOT NULL DROP TABLE Destinations_Backup_20250416;
SELECT * INTO Destinations_Backup_20250416 FROM Destinations;

-- STEP 2: HERO SLIDES
ALTER TABLE HeroSlides ALTER COLUMN TitleAr NVARCHAR(300) NULL;
ALTER TABLE HeroSlides ALTER COLUMN TitleEn NVARCHAR(300) NULL;

-- STEP 3: TESTIMONIALS
ALTER TABLE Testimonials ALTER COLUMN ImageUrl NVARCHAR(500) NULL;

-- STEP 4: CUSTOMER VIDEOS
ALTER TABLE CustomerVideos ALTER COLUMN ThumbnailUrl NVARCHAR(500) NULL;
ALTER TABLE CustomerVideos ALTER COLUMN Location NVARCHAR(200) NULL;
ALTER TABLE CustomerVideos ALTER COLUMN Date NVARCHAR(50) NULL;

-- STEP 5: DESTINATIONS
-- Drop unique index on Slug if exists
IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Destinations_Slug' AND object_id = OBJECT_ID('Destinations'))
    DROP INDEX IX_Destinations_Slug ON Destinations;

-- Make columns nullable
ALTER TABLE Destinations ALTER COLUMN NameEn NVARCHAR(200) NULL;
ALTER TABLE Destinations ALTER COLUMN Slug NVARCHAR(100) NULL;
ALTER TABLE Destinations ALTER COLUMN Description NVARCHAR(2000) NULL;

-- Recreate as non-unique index
CREATE NONCLUSTERED INDEX IX_Destinations_Slug ON Destinations(Slug);

-- STEP 6: SIMPLE VERIFICATION (No subqueries)
SELECT 'BackupComplete' AS Status, GETDATE() AS Timestamp;
