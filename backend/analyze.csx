using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence.Data;

var optionsBuilder = new DbContextOptionsBuilder<AlmulhemDbContext>();
optionsBuilder.UseSqlServer("Server=db41528.public.databaseasp.net; Database=db41528; User Id=db41528; Password=5f_Zb+A49y@H; Encrypt=True; TrustServerCertificate=True; MultipleActiveResultSets=True;");

using var context = new AlmulhemDbContext(optionsBuilder.Options);

var conversation = context.WhatsAppConversations
    .Include(c => c.Messages)
    .Where(c => c.PhoneNumber.Contains("966559890991"))
    .OrderByDescending(c => c.StartedAt)
    .FirstOrDefault();

if (conversation != null)
{
    Console.WriteLine($"\n--- Conversation: {conversation.PhoneNumber} (IsBotActive: {conversation.IsBotActive}, State: {conversation.State}) ---");
    foreach (var msg in conversation.Messages.OrderBy(m => m.Timestamp).TakeLast(20))
    {
        var sender = msg.IsFromBot ? "[BOT]" : "[CUSTOMER]";
        Console.WriteLine($"{msg.Timestamp:HH:mm:ss} {sender}: {msg.Content}");
    }
}
else
{
    Console.WriteLine("Conversation not found.");
}
