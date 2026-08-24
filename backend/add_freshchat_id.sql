ALTER TABLE WhatsAppConversations
ADD FreshchatConversationId NVARCHAR(100) NULL;

-- Optional: Create an index to speed up lookups by Freshchat ID
CREATE INDEX IX_WhatsAppConversations_FreshchatConversationId 
ON WhatsAppConversations (FreshchatConversationId);
