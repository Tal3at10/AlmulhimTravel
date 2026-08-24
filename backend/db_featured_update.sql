BEGIN TRANSACTION;
GO

ALTER TABLE [WhatsAppConversations] ADD [LastAgentMessageAt] datetime2 NULL;
GO

ALTER TABLE [Packages] ADD [FeaturedOrder] int NOT NULL DEFAULT 0;
GO

ALTER TABLE [Packages] ADD [IsFeatured] bit NOT NULL DEFAULT CAST(0 AS bit);
GO

ALTER TABLE [Destinations] ADD [FeaturedOrder] int NOT NULL DEFAULT 0;
GO

ALTER TABLE [Destinations] ADD [IsFeatured] bit NOT NULL DEFAULT CAST(0 AS bit);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260628193238_AddFeaturedToDestinationsAndPackages', N'8.0.11');
GO

COMMIT;
GO

