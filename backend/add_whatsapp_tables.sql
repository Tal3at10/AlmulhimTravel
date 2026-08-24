-- =======================================================================================
-- سكريبت إنشاء جداول نظام وكيل الواتساب (امن جداً للتنفيذ في بيئة الـ Production)
-- يقوم السكريبت بالتأكد من عدم وجود الجدول قبل إنشائه لتجنب أي أخطاء.
-- =======================================================================================

-- 1. جدول المحادثات (WhatsAppConversations)
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[WhatsAppConversations]') AND type in (N'U'))
BEGIN
    PRINT 'Creating table WhatsAppConversations...'
    CREATE TABLE [dbo].[WhatsAppConversations] (
        [Id] uniqueidentifier NOT NULL,
        [CustomerPhone] nvarchar(50) NOT NULL,
        [CustomerName] nvarchar(255) NULL,
        [Mode] int NOT NULL, -- 0: Bot, 1: Human, 2: Closed
        [AssignedAgentName] nvarchar(255) NULL,
        [StartedAt] datetime2(7) NOT NULL,
        [LastMessageAt] datetime2(7) NOT NULL,
        [ClosedAt] datetime2(7) NULL,
        [Notes] nvarchar(max) NULL,
        CONSTRAINT [PK_WhatsAppConversations] PRIMARY KEY CLUSTERED ([Id] ASC)
    );
    PRINT 'Table WhatsAppConversations created successfully.'
END
ELSE
BEGIN
    PRINT 'Table WhatsAppConversations already exists. Skipping.'
END
GO

-- 2. جدول الرسائل (WhatsAppMessages)
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[WhatsAppMessages]') AND type in (N'U'))
BEGIN
    PRINT 'Creating table WhatsAppMessages...'
    CREATE TABLE [dbo].[WhatsAppMessages] (
        [Id] uniqueidentifier NOT NULL,
        [ConversationId] uniqueidentifier NOT NULL,
        [Direction] int NOT NULL, -- 0: Inbound, 1: Outbound
        [SenderType] int NOT NULL, -- 0: Customer, 1: Bot, 2: Human
        [Content] nvarchar(max) NOT NULL,
        [MediaUrl] nvarchar(max) NULL,
        [MediaType] nvarchar(50) NULL,
        [SentAt] datetime2(7) NOT NULL,
        [IsRead] bit NOT NULL,
        CONSTRAINT [PK_WhatsAppMessages] PRIMARY KEY CLUSTERED ([Id] ASC),
        CONSTRAINT [FK_WhatsAppMessages_WhatsAppConversations_ConversationId] FOREIGN KEY ([ConversationId]) REFERENCES [dbo].[WhatsAppConversations] ([Id]) ON DELETE CASCADE
    );
    
    -- إنشاء Index لتسريع البحث بالـ ConversationId
    CREATE NONCLUSTERED INDEX [IX_WhatsAppMessages_ConversationId] ON [dbo].[WhatsAppMessages] ([ConversationId] ASC);
    PRINT 'Table WhatsAppMessages created successfully.'
END
ELSE
BEGIN
    PRINT 'Table WhatsAppMessages already exists. Skipping.'
END
GO

-- 3. جدول قاعدة المعرفة (WhatsAppKnowledge)
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[WhatsAppKnowledge]') AND type in (N'U'))
BEGIN
    PRINT 'Creating table WhatsAppKnowledge...'
    CREATE TABLE [dbo].[WhatsAppKnowledge] (
        [Id] uniqueidentifier NOT NULL,
        [Category] nvarchar(100) NOT NULL,
        [Title] nvarchar(255) NOT NULL,
        [Content] nvarchar(max) NOT NULL,
        [ImageUrl] nvarchar(max) NULL,
        [IsActive] bit NOT NULL,
        [Priority] int NOT NULL,
        [CreatedAt] datetime2(7) NOT NULL,
        [UpdatedAt] datetime2(7) NOT NULL,
        CONSTRAINT [PK_WhatsAppKnowledge] PRIMARY KEY CLUSTERED ([Id] ASC)
    );
    PRINT 'Table WhatsAppKnowledge created successfully.'
END
ELSE
BEGIN
    PRINT 'Table WhatsAppKnowledge already exists. Skipping.'
END
GO

PRINT 'All tables checked/created successfully.'
