using System;
using System.IO;

namespace Infrastructure.Shared.Services
{
    /// <summary>
    /// Simple file logger for debugging AI provider failures
    /// Logs are written to: wwwroot/logs/ai-debug.log
    /// </summary>
    public static class FileLogger
    {
        private static readonly string LogDirectory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "logs");
        private static readonly string LogFile = Path.Combine(LogDirectory, "ai-debug.log");
        private static readonly object _lock = new object();
        private static bool _initialized = false;

        private static void EnsureInitialized()
        {
            if (_initialized) return;
            
            try
            {
                if (!Directory.Exists(LogDirectory))
                {
                    Directory.CreateDirectory(LogDirectory);
                    Console.WriteLine($"[FileLogger] Created log directory: {LogDirectory}");
                }
                
                // Test write to ensure we have permissions
                File.AppendAllText(LogFile, $"[{DateTime.UtcNow:yyyy-MM-dd HH:mm:ss}] FileLogger initialized{Environment.NewLine}");
                _initialized = true;
                Console.WriteLine($"[FileLogger] Log file ready: {LogFile}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[FileLogger] FAILED to initialize: {ex.Message}");
                Console.WriteLine($"[FileLogger] Attempted path: {LogFile}");
            }
        }

        public static void Log(string message)
        {
            try
            {
                EnsureInitialized();
                
                lock (_lock)
                {
                    var timestamp = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss");
                    var logMessage = $"[{timestamp}] {message}{Environment.NewLine}";
                    File.AppendAllText(LogFile, logMessage);
                    
                    // Also log to console for debugging
                    Console.WriteLine($"[AI-LOG] {message}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[FileLogger] Failed to write log: {ex.Message}");
            }
        }

        public static void LogError(string provider, Exception ex)
        {
            var message = $"[ERROR] {provider} FAILED: {ex.Message}";
            if (ex.InnerException != null)
            {
                message += $" | Inner: {ex.InnerException.Message}";
            }
            message += $" | StackTrace: {ex.StackTrace}";
            Log(message);
        }
    }
}
