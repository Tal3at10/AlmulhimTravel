using System;
using System.Linq;
using System.IO;
using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence.Data;

var optionsBuilder = new DbContextOptionsBuilder<AlmulhemDbContext>();
optionsBuilder.UseSqlServer("Server=db41528.public.databaseasp.net; Database=db41528; User Id=db41528; Password=5f_Zb+A49y@H; Encrypt=True; TrustServerCertificate=True; MultipleActiveResultSets=True;");

using var db = new AlmulhemDbContext(optionsBuilder.Options);

var conversations = db.WhatsAppConversations
    .OrderByDescending(c => c.StartedAt)
    .Take(250)
    .ToList();

var dumpPathTxt = @"e:\Projects\AlMulhim-Travel\backend\recent_250_conversations.txt";
var dumpPathJson = @"e:\Projects\AlMulhim-Travel\backend\recent_250_conversations.json";

using var writer = new StreamWriter(dumpPathTxt);
var jsonList = new System.Collections.Generic.List<object>();

foreach (var conv in conversations)
{
    writer.WriteLine($"==================================================");
    writer.WriteLine($"Conversation ID: {conv.Id} (Freshchat: {conv.FreshchatConversationId})");
    writer.WriteLine($"Phone: {conv.CustomerPhone} | Mode: {conv.Mode}");
    writer.WriteLine($"Started: {conv.StartedAt.ToLocalTime()}");
    writer.WriteLine($"Notes: {conv.Notes}");
    writer.WriteLine($"--------------------------------------------------");

    var messages = db.WhatsAppMessages
        .Where(m => m.ConversationId == conv.Id)
        .OrderBy(m => m.SentAt)
        .Select(m => new {
            Sender = m.SenderType.ToString(),
            Time = m.SentAt.ToLocalTime().ToString("yyyy-MM-dd HH:mm:ss"),
            Content = m.Content
        })
        .ToList();

    foreach (var msg in messages)
    {
        writer.WriteLine($"[{msg.Time}] {msg.Sender}: {msg.Content}");
    }
    writer.WriteLine();

    jsonList.Add(new {
        Id = conv.Id,
        FreshchatConversationId = conv.FreshchatConversationId,
        Phone = conv.CustomerPhone,
        Mode = conv.Mode.ToString(),
        StartedAt = conv.StartedAt.ToLocalTime().ToString("yyyy-MM-dd HH:mm:ss"),
        Notes = conv.Notes,
        Messages = messages
    });
}

var jsonString = System.Text.Json.JsonSerializer.Serialize(jsonList, new System.Text.Json.JsonSerializerOptions { WriteIndented = true });
File.WriteAllText(dumpPathJson, jsonString);

Console.WriteLine($"Dumped {conversations.Count} conversations to {dumpPathTxt} and {dumpPathJson}");
