using System;
using System.Net.Http;
using System.Threading.Tasks;
using Infrastructure.Shared.Services;
using Microsoft.Extensions.Configuration;

namespace TestAiProviders
{
    class Program
    {
        static async Task Main(string[] args)
        {
            Console.OutputEncoding = System.Text.Encoding.UTF8;
            Console.WriteLine("========================================");
            Console.WriteLine(" 🎙️ اختبار تفريغ الصوت المباشر (Groq Whisper)");
            Console.WriteLine("========================================\n");

            var config = new ConfigurationBuilder()
                .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
                .AddJsonFile("appsettings.json", optional: true)
                .Build();

            string audioPath = @"E:\Projects\AlMulhim-Travel\WhatsApp Ptt 2026-07-25 at 8.30.29 AM.ogg";
            Console.WriteLine($"مسار الملف الصوتي: {audioPath}");

            if (!System.IO.File.Exists(audioPath))
            {
                Console.WriteLine("⚠️ الملف الصوتي التجريبي غير موجود، جاهز للتشغيل.");
                return;
            }

            var bytes = await System.IO.File.ReadAllBytesAsync(audioPath);
            Console.WriteLine($"حجم الصوت: {bytes.Length} bytes");

            var groq = new GroqAiService(new HttpClient(), config);
            Console.WriteLine("جاري إرسال البصمة الصوتية لمكالمة Groq Whisper API...");

            try
            {
                var transcript = await groq.TranscribeAudioAsync(bytes, System.IO.Path.GetFileName(audioPath));
                Console.ForegroundColor = ConsoleColor.Green;
                Console.WriteLine("\n✅ تم التفريغ النصي بنجاح:");
                Console.WriteLine($"النص المستخرج: \"{transcript}\"\n");
                Console.ResetColor();
            }
            catch (Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine($"❌ خطأ في تفريغ الصوت: {ex.Message}");
                Console.ResetColor();
            }
        }
    }
}
