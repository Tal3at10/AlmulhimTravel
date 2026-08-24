using System;
using System.IO;
using System.Text;
using System.Text.Json;

class Program
{
    static void Main()
    {
        string json = File.ReadAllText("conversations_report.json");
        var doc = JsonDocument.Parse(json);
        
        var sb = new StringBuilder();
        int count = 0;
        
        foreach (var item in doc.RootElement.EnumerateArray())
        {
            if (count >= 30) break;
            
            var conv = item.GetProperty("Conversation");
            var msgs = item.GetProperty("Messages");
            
            sb.AppendLine($"\n## Conversation {count + 1} - Customer: {conv.GetProperty("CustomerName").GetString()}");
            sb.AppendLine($"- **Started At:** {conv.GetProperty("StartedAt").GetDateTime()}");
            sb.AppendLine($"- **Last Message At:** {conv.GetProperty("LastMessageAt").GetDateTime()}");
            sb.AppendLine($"- **Mode:** {(conv.GetProperty("Mode").GetInt32() == 0 ? "Bot" : "Human")}");
            sb.AppendLine($"- **Notes:** {conv.GetProperty("Notes").GetString()}");
            sb.AppendLine("### Messages:");
            
            foreach (var msg in msgs.EnumerateArray())
            {
                var sender = msg.GetProperty("SenderType").GetInt32() == 0 ? "USER" : "BOT";
                var content = msg.GetProperty("Content").GetString()?.Replace("\n", " ");
                sb.AppendLine($"**[{sender}]** {content}");
            }
            sb.AppendLine("---");
            count++;
        }
        
        File.WriteAllText("top_30_conversations.md", sb.ToString());
        Console.WriteLine("Done. Wrote to top_30_conversations.md");
    }
}
