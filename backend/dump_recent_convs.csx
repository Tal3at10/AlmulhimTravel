using System;
using System.Linq;
using System.IO;
using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence.Data;

var optionsBuilder = new DbContextOptionsBuilder<AlmulhemDbContext>();
optionsBuilder.UseSqlServer("Server=db41528.public.databaseasp.net; Database=db41528; User Id=db41528; Password=5f_Zb+A49y@H; Encrypt=True; TrustServerCertificate=True; MultipleActiveResultSets=True;");

using var db = new AlmulhemDbContext(optionsBuilder.Options);

var startDate = new DateTime(2026, 7, 15, 2, 0, 0, DateTimeKind.Utc); // 5 AM KSA is 2 AM UTC
var endDate = new DateTime(2026, 7, 15, 22, 0, 0, DateTimeKind.Utc); // 1 AM KSA (July 16) is 10 PM UTC (July 15)

var conversations = db.WhatsAppConversations
    .Where(c => c.StartedAt >= startDate && c.StartedAt <= endDate)
    .OrderByDescending(c => c.StartedAt)
    .Take(100)
    .ToList();

var dumpPath = "e:\\Projects\\AlMulhim-Travel\\backend\\recent_conversations_dump.txt";
using var writer = new StreamWriter(dumpPath);

foreach (var conv in conversations)
{
    writer.WriteLine($"==================================================");
    writer.WriteLine($"Conversation ID: {conv.Id} (Freshchat: {conv.FreshchatConversationId})");
    writer.WriteLine($"Phone: {conv.CustomerPhone} | Mode: {conv.Mode} | State: {conv.State}");
    writer.WriteLine($"Started: {conv.StartedAt.ToLocalTime()}");
    writer.WriteLine($"Notes: {conv.Notes}");
    writer.WriteLine($"--------------------------------------------------");

    var messages = db.WhatsAppMessages
        .Where(m => m.ConversationId == conv.Id)
        .OrderBy(m => m.SentAt)
        .ToList();

    foreach (var msg in messages)
    {
        var sender = msg.SenderType == Core.Domain.Enums.MessageSender.Customer ? "Customer" : "Bot";
        var time = msg.SentAt.ToLocalTime().ToString("HH:mm:ss");
        writer.WriteLine($"[{time}] {sender}: {msg.Content}");
    }
    writer.WriteLine();
}

Console.WriteLine($"Dumped {conversations.Count} conversations to {dumpPath}");
