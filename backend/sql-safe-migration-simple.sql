-- ============================================================================
-- SAFE PRODUCTION MIGRATION: Make Package Fields Nullable
-- Date: 2025-04-16
-- Note: Simplified for restricted SQL execution environment
-- ============================================================================

-- STEP 1: CREATE FULL BACKUP (Run this first separately to verify)
-- If backup table exists, drop it first
IF OBJECT_ID('Packages_FullBackup_20250416', 'U') IS NOT NULL
    DROP TABLE Packages_FullBackup_20250416;

-- Create backup
SELECT * INTO Packages_FullBackup_20250416 FROM Packages;

-- Add metadata
ALTER TABLE Packages_FullBackup_20250416 ADD BackupCreatedAt DATETIME2 DEFAULT GETDATE();
ALTER TABLE Packages_FullBackup_20250416 ADD BackupCreatedBy NVARCHAR(100) DEFAULT SUSER_SNAME();

-- STEP 2: MAKE COLUMNS NULLABLE (Run after confirming backup)
-- Check and modify TitleEn
IF EXISTS(SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Packages' AND COLUMN_NAME = 'TitleEn' AND IS_NULLABLE = 'NO')
    ALTER TABLE Packages ALTER COLUMN TitleEn NVARCHAR(300) NULL;

-- Check and modify Subtitle  
IF EXISTS(SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Packages' AND COLUMN_NAME = 'Subtitle' AND IS_NULLABLE = 'NO')
    ALTER TABLE Packages ALTER COLUMN Subtitle NVARCHAR(500) NULL;

-- Check and modify VideoUrl
IF EXISTS(SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Packages' AND COLUMN_NAME = 'VideoUrl' AND IS_NULLABLE = 'NO')
    ALTER TABLE Packages ALTER COLUMN VideoUrl NVARCHAR(500) NULL;

-- Check and modify Vibe
IF EXISTS(SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Packages' AND COLUMN_NAME = 'Vibe' AND IS_NULLABLE = 'NO')
    ALTER TABLE Packages ALTER COLUMN Vibe NVARCHAR(50) NULL;

-- VERIFICATION: Check the columns are now nullable
SELECT COLUMN_NAME, IS_NULLABLE, DATA_TYPE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'Packages' 
  AND COLUMN_NAME IN ('TitleEn', 'Subtitle', 'VideoUrl', 'Vibe');

-- Check row counts match
SELECT 
    (SELECT COUNT(*) FROM Packages) AS Current_Count,
    (SELECT COUNT(*) FROM Packages_FullBackup_20250416) AS Backup_Count;
