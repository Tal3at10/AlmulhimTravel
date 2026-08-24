using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace APIs.Helpers
{
    /// <summary>
    /// Thread-safe in-memory and persistent file logger for debugging WhatsApp media & bot messages.
    /// </summary>
    public static class BotLogger
    {
        private static readonly ConcurrentQueue<string> _logs = new();
        private const int MaxEntries = 500;
        private static readonly object _fileLock = new();
        private static readonly string LogFilePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "media_audit.log");

        public static void Log(string message)
        {
            var entry = $"[{DateTime.UtcNow:yyyy-MM-dd HH:mm:ss}] {message}";
            _logs.Enqueue(entry);

            // Keep only last MaxEntries in memory
            while (_logs.Count > MaxEntries)
                _logs.TryDequeue(out _);

            // Append to persistent log file safely
            try
            {
                lock (_fileLock)
                {
                    File.AppendAllText(LogFilePath, entry + Environment.NewLine);
                }
            }
            catch { }
        }

        public static List<string> GetLogs()
        {
            return _logs.ToList();
        }

        public static void Clear()
        {
            _logs.Clear();
        }
    }
}
