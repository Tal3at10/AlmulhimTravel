-- SQL Script to add LastAgentMessageAt column to WhatsAppConversations table
-- This script should be run manually on the SQL Server database.

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID(N'[dbo].[WhatsAppConversations]') 
    AND name = N'LastAgentMessageAt'
)
BEGIN
    ALTER TABLE [dbo].[WhatsAppConversations] 
    ADD [LastAgentMessageAt] DATETIME2 NULL;
    
    PRINT 'Column LastAgentMessageAt added successfully.';
END
ELSE
BEGIN
    PRINT 'Column LastAgentMessageAt already exists.';
END
