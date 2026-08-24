using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Core.Application.Abstraction.Services;
using Microsoft.Extensions.Configuration;

namespace Infrastructure.Shared.Services
{
    /// <summary>
    /// OpenRouter AI Service - Third fallback provider.
    /// Uses free models like Meta Llama 3.1 8B or Mistral 7B.
    /// </summary>
    public class OpenRouterAiService : IAiService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly string _apiKey;

        public OpenRouterAiService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _apiKey = configuration["AiSettings:OpenRouterApiKey"] ?? string.Empty;

            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);
            _httpClient.DefaultRequestHeaders.Add("X-Title", "Almulhim Travel Bot");
            if (!_httpClient.DefaultRequestHeaders.Contains("HTTP-Referer"))
            {
                _httpClient.DefaultRequestHeaders.Add("HTTP-Referer", "https://almulhimtravel.com");
            }
        }

        public async Task<AiResponse> GenerateResponseAsync(string customerMessage, List<ChatMessage> conversationHistory, string systemPrompt)
        {
            var activeModel = _configuration["AiSettings:OpenRouterModel"];
            if (string.IsNullOrWhiteSpace(activeModel)) activeModel = "google/gemini-2.5-flash";

            FileLogger.Log($"OpenRouter model: {activeModel}");
            Console.WriteLine($"OpenRouter model: {activeModel}");

            var messages = new List<object>
            {
                new { role = "system", content = systemPrompt }
            };

            foreach (var msg in conversationHistory)
            {
                messages.Add(new { role = msg.Role, content = msg.Content });
            }

            // Extract [IMAGE: URL]
            string cleanMessage = customerMessage;
            string? imageUrl = null;
            
            int imgStart = customerMessage.LastIndexOf("[IMAGE:");
            if (imgStart >= 0)
            {
                int imgEnd = customerMessage.LastIndexOf("]");
                if (imgEnd <= imgStart)
                {
                    // Tag was truncated in DB/log - take everything to end of message
                    imgEnd = customerMessage.Length - 1;
                }
                string fullTag = customerMessage.Substring(imgStart, imgEnd - imgStart + 1);
                imageUrl = customerMessage.Substring(imgStart + 7, imgEnd - (imgStart + 7)).Trim('"', '\'', ' ', ']', '\r', '\n');
                cleanMessage = customerMessage.Replace(fullTag, "[صورة مرفقة]").Trim();
                FileLogger.Log($"OpenRouter - Image extracted via LastIndexOf, length: {imageUrl.Length}, starts with: {imageUrl.Substring(0, Math.Min(50, imageUrl.Length))}");
            }
            
            FileLogger.Log($"OpenRouter - Message length: {cleanMessage.Length}, Contains image URL: {!string.IsNullOrEmpty(imageUrl)}");

            if (!string.IsNullOrEmpty(imageUrl))
            {
                cleanMessage += "\n\n(ملاحظة هامة جداً: أرسل العميل هذه الصورة كمرفق ببيانات رحلته أو عروض سياحية أو بروشور. يرجى تحليل وقراءة كل النص والتفاصيل الموجودة داخل الصورة بدقة واستخلاص الدولة والوجهة وباقي الشروط، ثم اتخاذ القرار المناسب بحسب الخيارات المتاحة.)";

                // OpenRouter/OpenAI Vision format
                messages.Add(new 
                { 
                    role = "user", 
                    content = new object[] 
                    {
                        new { type = "text", text = cleanMessage },
                        new { type = "image_url", image_url = new { url = imageUrl } }
                    }
                });
            }
            else
            {
                messages.Add(new { role = "user", content = customerMessage });
            }

            var requestBody = new
            {
                model = activeModel,
                messages = messages,
                temperature = 0.2,
                max_tokens = 1000
            };

            var apiKey = _configuration["AiSettings:OpenRouterApiKey"];
            if (string.IsNullOrWhiteSpace(apiKey)) apiKey = _apiKey;

            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
            if (!_httpClient.DefaultRequestHeaders.Contains("X-Title"))
                _httpClient.DefaultRequestHeaders.Add("X-Title", "Almulhim Travel Bot");
            if (!_httpClient.DefaultRequestHeaders.Contains("HTTP-Referer"))
                _httpClient.DefaultRequestHeaders.Add("HTTP-Referer", "https://almulhimtravel.com");

            var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
            using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(12));
            var response = await _httpClient.PostAsync("https://openrouter.ai/api/v1/chat/completions", content, cts.Token);
            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync(cts.Token);
                throw new Exception($"OpenRouter API Error: {response.StatusCode} - {errorContent}");
            }

            var responseString = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(responseString);

            var messageElement = doc.RootElement
                .GetProperty("choices")[0]
                .GetProperty("message");

            var aiText = messageElement.GetProperty("content").GetString() ?? string.Empty;

            if (string.IsNullOrWhiteSpace(aiText))
            {
                throw new Exception("OpenRouter returned an empty message content.");
            }

            // Return raw response - let AiOrchestratorService handle all parsing
            return new AiResponse { Text = aiText };
        }
    }
}
