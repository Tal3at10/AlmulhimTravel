BEGIN TRANSACTION;
GO

ALTER TABLE [FlightSchedules] ADD [RowVersion] rowversion NULL;
GO

ALTER TABLE [Bookings] ADD [ExtractedJsonData] nvarchar(max) NULL;
GO

ALTER TABLE [Bookings] ADD [VoucherProRequestId] int NULL;
GO

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
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260618003307_AddSystemAuditLog', N'8.0.11');
GO

COMMIT;
GO

