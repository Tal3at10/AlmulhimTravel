BEGIN TRANSACTION;
GO

ALTER TABLE [Payments] ADD [RowVersion] rowversion NOT NULL;
GO

ALTER TABLE [Bookings] ADD [RowVersion] rowversion NOT NULL;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260615221544_AddConcurrencyAndIndexesToReservations', N'8.0.11');
GO

COMMIT;
GO

