using System;
using System.Linq;
using Infrastructure.Persistence.Data;
using Microsoft.EntityFrameworkCore;

var optionsBuilder = new DbContextOptionsBuilder<AlmulhemDbContext>();
optionsBuilder.UseSqlServer("Server=(localdb)\\mssqllocaldb;Database=AlmulhemTravelDB;Trusted_Connection=True;MultipleActiveResultSets=true");

using var context = new AlmulhemDbContext(optionsBuilder.Options);
var convs = context.WhatsAppConversations.OrderByDescending(c => c.StartedAt).Take(5).ToList();

foreach (var c in convs)
{
    Console.WriteLine($"Conv: {c.FreshchatConversationId}, Notes: '{c.Notes}', Started: {c.StartedAt}");
    var msgs = context.WhatsAppMessages.Where(m => m.ConversationId == c.Id).OrderBy(m => m.SentAt).ToList();
    foreach(var m in msgs)
    {
        Console.WriteLine($"  [{m.Direction}] {m.Content}");
    }
}
