-- ====================================================================
-- AlMulhim Travel - Wallet & Loyalty System Database Schema
-- سكريبت تهيئة نظام المحفظة الإلكترونية ونقاط الولاء بقاعدة البيانات
-- ====================================================================

-- 1. إضافة حقول المحفظة والولاء لجدول المستخدمين (Users)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('dbo.Users') AND name = 'WalletBalance')
BEGIN
    ALTER TABLE dbo.Users ADD WalletBalance DECIMAL(18, 2) NOT NULL DEFAULT 0.00;
END;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('dbo.Users') AND name = 'LoyaltyPoints')
BEGIN
    ALTER TABLE dbo.Users ADD LoyaltyPoints INT NOT NULL DEFAULT 0;
END;

-- 2. إنشاء جدول حركات المحفظة الإلكترونية (WalletTransactions)
IF OBJECT_ID('dbo.WalletTransactions', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.WalletTransactions (
        Id UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
        UserId UNIQUEIDENTIFIER NOT NULL,
        Amount DECIMAL(18, 2) NOT NULL,
        Type NVARCHAR(50) NOT NULL, -- (Purchase, Refund, Deposit, PointsConversion)
        Description NVARCHAR(500) NOT NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
        CONSTRAINT PK_WalletTransactions PRIMARY KEY (Id),
        CONSTRAINT FK_WalletTransactions_Users_UserId FOREIGN KEY (UserId) REFERENCES dbo.Users (Id) ON DELETE CASCADE
    );
    
    -- إنشاء فهرس لتسريع استعلامات المحفظة للمستخدم
    CREATE NONCLUSTERED INDEX IX_WalletTransactions_UserId ON dbo.WalletTransactions (UserId);
END;

-- 3. إنشاء جدول تاريخ نقاط الولاء (LoyaltyTransactions)
IF OBJECT_ID('dbo.LoyaltyTransactions', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.LoyaltyTransactions (
        Id UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
        UserId UNIQUEIDENTIFIER NOT NULL,
        Points INT NOT NULL,
        Type NVARCHAR(50) NOT NULL, -- (Earned, Redeemed, Expired)
        Description NVARCHAR(500) NOT NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
        CONSTRAINT PK_LoyaltyTransactions PRIMARY KEY (Id),
        CONSTRAINT FK_LoyaltyTransactions_Users_UserId FOREIGN KEY (UserId) REFERENCES dbo.Users (Id) ON DELETE CASCADE
    );
    
    -- إنشاء فهرس لتسريع استعلامات النقاط للمستخدم
    CREATE NONCLUSTERED INDEX IX_LoyaltyTransactions_UserId ON dbo.LoyaltyTransactions (UserId);
END;

-- 4. تعديل طول عمود رقم جواز السفر ليستوعب التشفير (FlightPassengers)
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('dbo.FlightPassengers') AND name = 'PassportNumber')
BEGIN
    ALTER TABLE dbo.FlightPassengers ALTER COLUMN PassportNumber NVARCHAR(200) NOT NULL;
END;
