using System;
using System.IO;
using System.Linq;
using System.Collections.Generic;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence.Data;

var optionsBuilder = new DbContextOptionsBuilder<AlmulhemDbContext>();
optionsBuilder.UseSqlServer("Server=db41528.public.databaseasp.net; Database=db41528; User Id=db41528; Password=5f_Zb+A49y@H; Encrypt=True; TrustServerCertificate=True; MultipleActiveResultSets=True;");

using var db = new AlmulhemDbContext(optionsBuilder.Options);

var cutoff = DateTime.UtcNow.AddDays(-7);
Console.WriteLine($"Querying conversations since {cutoff:yyyy-MM-dd HH:mm:ss} UTC...");

var conversations = db.WhatsAppConversations
    .Where(c => c.StartedAt >= cutoff)
    .OrderByDescending(c => c.StartedAt)
    .ToList();

Console.WriteLine($"Total conversations found in last 7 days: {conversations.Count}");

var convoIds = conversations.Select(c => c.Id).ToHashSet();

// Fetch all messages for these conversations
var allMessages = db.WhatsAppMessages
    .Where(m => convoIds.Contains(m.ConversationId))
    .OrderBy(m => m.SentAt)
    .ToList();

Console.WriteLine($"Total messages found: {allMessages.Count}");

var messagesByConvo = allMessages
    .GroupBy(m => m.ConversationId)
    .ToDictionary(g => g.Key, g => g.OrderBy(m => m.SentAt).ToList());

var structuredConvos = new List<object>();

foreach (var conv in conversations)
{
    var msgs = messagesByConvo.TryGetValue(conv.Id, out var mList) ? mList : new List<Core.Domain.Entities.WhatsApp.WhatsAppMessage>();
    
    var formattedMsgs = msgs.Select(m => new {
        Id = m.Id,
        Sender = m.SenderType.ToString(),
        Direction = m.Direction.ToString(),
        Time = m.SentAt.ToLocalTime().ToString("yyyy-MM-dd HH:mm:ss"),
        Content = m.Content
    }).ToList();

    structuredConvos.Add(new {
        Id = conv.Id,
        FreshchatConversationId = conv.FreshchatConversationId,
        CustomerPhone = conv.CustomerPhone,
        CustomerName = conv.CustomerName,
        Mode = conv.Mode.ToString(),
        AssignedAgentName = conv.AssignedAgentName,
        StartedAt = conv.StartedAt.ToLocalTime().ToString("yyyy-MM-dd HH:mm:ss"),
        LastMessageAt = conv.LastMessageAt.ToLocalTime().ToString("yyyy-MM-dd HH:mm:ss"),
        Notes = conv.Notes,
        MessageCount = formattedMsgs.Count,
        Messages = formattedMsgs
    });
}

// Ensure output directories exist
var outputDir = @"C:\Users\7oda\.gemini\antigravity\brain\8639df1b-3ed9-481b-9065-db6b8ab42df0\scratch";
if (!Directory.Exists(outputDir))
{
    Directory.CreateDirectory(outputDir);
}

// Split into 7 chunks
int numChunks = 7;
int total = structuredConvos.Count;
int chunkSize = (int)Math.Ceiling((double)total / numChunks);

for (int i = 0; i < numChunks; i++)
{
    var chunk = structuredConvos.Skip(i * chunkSize).Take(chunkSize).ToList();
    var chunkFilePath = Path.Combine(outputDir, $"chunk_{i + 1}.json");
    var json = JsonSerializer.Serialize(chunk, new JsonSerializerOptions { WriteIndented = true });
    File.WriteAllText(chunkFilePath, json);
    Console.WriteLine($"Chunk {i + 1}: {chunk.Count} conversations written to {chunkFilePath}");
}

// Summary overview file
var summaryOverview = new {
    TotalConversations = total,
    TotalMessages = allMessages.Count,
    CutoffDateUtc = cutoff.ToString("yyyy-MM-dd HH:mm:ss"),
    ChunksCount = numChunks,
    ChunkSizes = Enumerable.Range(0, numChunks).Select(i => structuredConvos.Skip(i * chunkSize).Take(chunkSize).Count()).ToList()
};

File.WriteAllText(Path.Combine(outputDir, "summary_overview.json"), JsonSerializer.Serialize(summaryOverview, new JsonSerializerOptions { WriteIndented = true }));
Console.WriteLine("All 7 chunks successfully generated!");
