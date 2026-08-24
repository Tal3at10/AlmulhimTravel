using APIs.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace APIs.Controllers
{
    [ApiController]
    [Route("api/bot-logs")]
    public class BotLogsController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetLogs()
        {
            var logs = BotLogger.GetLogs();
            var html = "<html><head><meta charset='utf-8'><title>Bot Logs</title>"
                + "<meta http-equiv='refresh' content='5'>"
                + "<style>body{background:#1a1a2e;color:#0f0;font-family:monospace;padding:20px;font-size:14px;}"
                + "h1{color:#e94560;}pre{white-space:pre-wrap;}</style></head>"
                + "<body><h1>🤖 Bot Logs (Auto-refresh 5s)</h1>"
                + $"<p style='color:#888;'>Total: {logs.Count} entries | UTC Time: {System.DateTime.UtcNow:yyyy-MM-dd HH:mm:ss}</p>"
                + "<pre>" + string.Join("\n", logs) + "</pre></body></html>";
            return Content(html, "text/html");
        }

        [HttpGet("clear")]
        public IActionResult ClearLogs()
        {
            BotLogger.Clear();
            return Ok("Logs cleared");
        }
    }
}
