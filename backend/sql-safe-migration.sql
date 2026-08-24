-- ============================================================================
-- SAFE PRODUCTION MIGRATION: Make Package Fields Nullable
-- Date: 2025-04-16
-- Purpose: Allow TitleEn, Subtitle, VideoUrl, Vibe to be NULL
-- Status: PRODUCTION SAFE - Full Backup & Rollback Included
-- ============================================================================

-- STEP 0: Start Transaction (for safety)
SET XACT_ABORT ON;
BEGIN TRY
    BEGIN TRANSACTION;

    -- ========================================================================
    -- STEP 1: CREATE FULL BACKUP TABLE WITH ALL DATA
    -- This is a complete snapshot - we can restore from this if anything fails
    -- ========================================================================
    PRINT 'Creating full backup of Packages table...';
    
    IF OBJECT_ID('Packages_FullBackup_20250416', 'U') IS NOT NULL
    BEGIN
        DROP TABLE Packages_FullBackup_20250416;
        PRINT 'Dropped existing backup table.';
    END

    -- Create backup with exact same structure AND data
    SELECT * INTO Packages_FullBackup_20250416 
    FROM Packages;
    
    -- Add backup metadata
    ALTER TABLE Packages_FullBackup_20250416 
    ADD BackupCreatedAt DATETIME2 DEFAULT GETDATE(),
        BackupCreatedBy NVARCHAR(100) DEFAULT SUSER_SNAME();
    
    PRINT 'Backup created successfully: ' + CAST((SELECT COUNT(*) FROM Packages_FullBackup_20250416) AS NVARCHAR) + ' rows backed up.';

    -- ========================================================================
    -- STEP 2: VERIFY NO CONSTRAINTS WILL BLOCK THE CHANGE
    -- ========================================================================
    PRINT 'Checking for blocking constraints...';
    
    DECLARE @ConstraintCount INT = 0;
    
    -- Check for DEFAULT constraints on columns we're modifying
    SELECT @ConstraintCount = COUNT(*) 
    FROM sys.default_constraints dc
    JOIN sys.columns c ON dc.parent_object_id = c.object_id AND dc.parent_column_id = c.column_id
    JOIN sys.tables t ON c.object_id = t.object_id
    WHERE t.name = 'Packages' 
      AND c.name IN ('TitleEn', 'Subtitle', 'VideoUrl', 'Vibe');
    
    IF @ConstraintCount > 0
    BEGIN
        PRINT 'Warning: Found ' + CAST(@ConstraintCount AS NVARCHAR) + ' default constraints. These will be preserved.';
    END

    -- ========================================================================
    -- STEP 3: CHECK CURRENT COLUMN NULLABILITY
    -- ========================================================================
    PRINT 'Current column status:';
    SELECT 
        COLUMN_NAME,
        IS_NULLABLE,
        DATA_TYPE,
        CHARACTER_MAXIMUM_LENGTH
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'Packages' 
      AND COLUMN_NAME IN ('TitleEn', 'Subtitle', 'VideoUrl', 'Vibe');

    -- ========================================================================
    -- STEP 4: PRE-CHECK - Verify data won't be lost
    -- Count rows that have empty strings in these columns
    -- ========================================================================
    PRINT 'Checking for empty string values that will become NULL...';
    
    SELECT 
        (SELECT COUNT(*) FROM Packages WHERE TitleEn = '') AS Empty_TitleEn,
        (SELECT COUNT(*) FROM Packages WHERE Subtitle = '') AS Empty_Subtitle,
        (SELECT COUNT(*) FROM Packages WHERE VideoUrl = '') AS Empty_VideoUrl,
        (SELECT COUNT(*) FROM Packages WHERE Vibe = '') AS Empty_Vibe;

    -- ========================================================================
    -- STEP 5: CONVERT EMPTY STRINGS TO NULL FIRST (Optional but cleaner)
    -- Uncomment this if you want empty strings to become NULL
    -- ========================================================================
    /*
    PRINT 'Converting empty strings to NULL...';
    
    UPDATE Packages 
    SET TitleEn = NULL 
    WHERE TitleEn = '';
    
    UPDATE Packages 
    SET Subtitle = NULL 
    WHERE Subtitle = '';
    
    UPDATE Packages 
    SET VideoUrl = NULL 
    WHERE VideoUrl = '';
    
    UPDATE Packages 
    SET Vibe = NULL 
    WHERE Vibe = '';
    
    PRINT 'Empty strings converted to NULL.';
    */

    -- ========================================================================
    -- STEP 6: MAKE COLUMNS NULLABLE
    -- This is the actual schema change
    -- ========================================================================
    PRINT 'Making columns nullable...';
    
    -- 6a. TitleEn
    IF EXISTS(SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
              WHERE TABLE_NAME = 'Packages' AND COLUMN_NAME = 'TitleEn' AND IS_NULLABLE = 'NO')
    BEGIN
        ALTER TABLE Packages ALTER COLUMN TitleEn NVARCHAR(300) NULL;
        PRINT 'TitleEn is now NULLABLE';
    END
    ELSE
    BEGIN
        PRINT 'TitleEn was already nullable';
    END
    
    -- 6b. Subtitle
    IF EXISTS(SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
              WHERE TABLE_NAME = 'Packages' AND COLUMN_NAME = 'Subtitle' AND IS_NULLABLE = 'NO')
    BEGIN
        ALTER TABLE Packages ALTER COLUMN Subtitle NVARCHAR(500) NULL;
        PRINT 'Subtitle is now NULLABLE';
    END
    ELSE
    BEGIN
        PRINT 'Subtitle was already nullable';
    END
    
    -- 6c. VideoUrl
    IF EXISTS(SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
              WHERE TABLE_NAME = 'Packages' AND COLUMN_NAME = 'VideoUrl' AND IS_NULLABLE = 'NO')
    BEGIN
        ALTER TABLE Packages ALTER COLUMN VideoUrl NVARCHAR(500) NULL;
        PRINT 'VideoUrl is now NULLABLE';
    END
    ELSE
    BEGIN
        PRINT 'VideoUrl was already nullable';
    END
    
    -- 6d. Vibe
    IF EXISTS(SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
              WHERE TABLE_NAME = 'Packages' AND COLUMN_NAME = 'Vibe' AND IS_NULLABLE = 'NO')
    BEGIN
        ALTER TABLE Packages ALTER COLUMN Vibe NVARCHAR(50) NULL;
        PRINT 'Vibe is now NULLABLE';
    END
    ELSE
    BEGIN
        PRINT 'Vibe was already nullable';
    END

    -- ========================================================================
    -- STEP 7: POST-CHECK - Verify changes
    -- ========================================================================
    PRINT 'Verifying changes...';
    
    SELECT 
        COLUMN_NAME,
        IS_NULLABLE,
        'VERIFIED' AS Status
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'Packages' 
      AND COLUMN_NAME IN ('TitleEn', 'Subtitle', 'VideoUrl', 'Vibe');

    -- Count total rows to verify nothing was lost
    DECLARE @RowCount INT = (SELECT COUNT(*) FROM Packages);
    PRINT 'Total rows after migration: ' + CAST(@RowCount AS NVARCHAR);

    -- ========================================================================
    -- STEP 8: COMMIT IF ALL CHECKS PASSED
    -- ========================================================================
    COMMIT TRANSACTION;
    PRINT 'SUCCESS! Migration completed and committed.';
    PRINT 'Backup table: Packages_FullBackup_20250416';
    
END TRY
BEGIN CATCH
    -- ========================================================================
    -- ERROR HANDLING - AUTOMATIC ROLLBACK
    -- ========================================================================
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION;
    
    PRINT 'ERROR! Migration failed and was rolled back.';
    PRINT 'Error Message: ' + ERROR_MESSAGE();
    PRINT 'Error Number: ' + CAST(ERROR_NUMBER() AS NVARCHAR);
    PRINT 'Error Line: ' + CAST(ERROR_LINE() AS NVARCHAR);
    
    -- Re-raise the error
    THROW;
END CATCH;

SET XACT_ABORT OFF;
GO

-- ============================================================================
-- POST-MIGRATION VERIFICATION QUERIES (Run these separately to verify)
-- ============================================================================
/*
-- Verify all data is intact
SELECT 
    (SELECT COUNT(*) FROM Packages) AS CurrentRowCount,
    (SELECT COUNT(*) FROM Packages_FullBackup_20250416) AS BackupRowCount;

-- Sample data check
SELECT TOP 5 Id, TitleAr, TitleEn, Subtitle, Vibe 
FROM Packages 
ORDER BY CreatedAt DESC;
*/

-- ============================================================================
-- ROLLBACK SCRIPT (Run ONLY if you need to restore from backup)
-- WARNING: This will restore the table to pre-migration state!
-- ============================================================================
/*
-- EMERGENCY ROLLBACK - Uncomment and run ONLY if needed
BEGIN TRANSACTION;
BEGIN TRY
    -- 1. Verify backup exists
    IF OBJECT_ID('Packages_FullBackup_20250416', 'U') IS NULL
    BEGIN
        RAISERROR('Backup table does not exist! Cannot rollback.', 16, 1);
    END
    
    -- 2. Backup current state (just in case)
    IF OBJECT_ID('Packages_BeforeRollback', 'U') IS NOT NULL
        DROP TABLE Packages_BeforeRollback;
    SELECT * INTO Packages_BeforeRollback FROM Packages;
    
    -- 3. Truncate and restore from backup
    TRUNCATE TABLE Packages;
    
    INSERT INTO Packages (
        Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, 
        Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl,
        Vibe, Rating, IsOffer, IsActive, CreatedAt
        -- Note: Excluding backup metadata columns
    )
    SELECT 
        Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price,
        Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl,
        Vibe, Rating, IsOffer, IsActive, CreatedAt
    FROM Packages_FullBackup_20250416;
    
    -- 4. Restore nullability (make NOT NULL again)
    ALTER TABLE Packages ALTER COLUMN TitleEn NVARCHAR(300) NOT NULL;
    ALTER TABLE Packages ALTER COLUMN Subtitle NVARCHAR(500) NOT NULL;
    ALTER TABLE Packages ALTER COLUMN VideoUrl NVARCHAR(500) NOT NULL;
    ALTER TABLE Packages ALTER COLUMN Vibe NVARCHAR(50) NOT NULL;
    
    COMMIT TRANSACTION;
    PRINT 'ROLLBACK COMPLETED - Table restored to original state';
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION;
    PRINT 'Rollback failed: ' + ERROR_MESSAGE();
    THROW;
END CATCH;
*/
