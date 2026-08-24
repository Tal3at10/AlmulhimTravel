BEGIN TRANSACTION;
GO

-- 1. Check and add RowVersion to Payments
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[Payments]') AND name = 'RowVersion')
BEGIN
    ALTER TABLE [Payments] ADD [RowVersion] rowversion NOT NULL;
END
GO

-- 2. Check and add RowVersion to Bookings
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[Bookings]') AND name = 'RowVersion')
BEGIN
    ALTER TABLE [Bookings] ADD [RowVersion] rowversion NOT NULL;
END
GO

-- 3. Add History for Migration 1 if missing
IF NOT EXISTS (SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20260615221544_AddConcurrencyAndIndexesToReservations')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260615221544_AddConcurrencyAndIndexesToReservations', N'8.0.11');
END
GO

-- 4. Check and add RowVersion to FlightSchedules
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[FlightSchedules]') AND name = 'RowVersion')
BEGIN
    ALTER TABLE [FlightSchedules] ADD [RowVersion] rowversion NULL;
END
GO

-- 5. Check and add ExtractedJsonData to Bookings
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[Bookings]') AND name = 'ExtractedJsonData')
BEGIN
    ALTER TABLE [Bookings] ADD [ExtractedJsonData] nvarchar(max) NULL;
END
GO

-- 6. Check and add VoucherProRequestId to Bookings
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[Bookings]') AND name = 'VoucherProRequestId')
BEGIN
    ALTER TABLE [Bookings] ADD [VoucherProRequestId] int NULL;
END
GO

-- 7. Check and create AuditLogs table
IF OBJECT_ID(N'[AuditLogs]') IS NULL
BEGIN
    CREATE TABLE [AuditLogs] (
        [Id] uniqueidentifier NOT NULL,
        [UserId] nvarchar(max) NULL,
        [Action] nvarchar(max) NOT NULL,
        [EntityName] nvarchar(max) NOT NULL,
        [EntityId] nvarchar(max) NOT NULL,
        [OldValues] nvarchar(max) NULL,
        [NewValues] nvarchar(max) NULL,
        [Timestamp] datetime2 NOT NULL,
        CONSTRAINT [PK_AuditLogs] PRIMARY KEY ([Id])
    );
END
GO

-- 8. Add History for Migration 2 if missing
IF NOT EXISTS (SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20260618003307_AddSystemAuditLog')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260618003307_AddSystemAuditLog', N'8.0.11');
END
GO

COMMIT;
GO
