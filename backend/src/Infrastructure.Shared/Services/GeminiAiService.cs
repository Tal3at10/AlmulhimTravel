using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Core.Application.Abstraction.Services;
using Microsoft.Extensions.Configuration;

namespace Infrastructure.Shared.Services
{
    public class GeminiAiService : IAiService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;
        public string Model { get; set; } = "gemini-1.5-flash";

        public GeminiAiService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _apiKey = configuration["AiSettings:GeminiApiKey"] ?? string.Empty;
        }

        public Task<AiResponse> GenerateResponseAsync(string customerMessage, List<ChatMessage> conversationHistory, string systemPrompt)
        {
            return GenerateResponseAsync(customerMessage, conversationHistory, systemPrompt, Model);
        }

        public async Task<AiResponse> GenerateResponseAsync(string customerMessage, List<ChatMessage> conversationHistory, string systemPrompt, string modelOverride)
        {
            var url = $"https://generativelanguage.googleapis.com/v1beta/models/{modelOverride}:generateContent?key={_apiKey}";

            var contents = new List<object>();

            // Parse for image url
            string? imageUrl = null;
            string cleanMessage = customerMessage;
            
            var imgMatch = System.Text.RegularExpressions.Regex.Match(customerMessage, @"\[IMAGE:\s*(.*?)\]", System.Text.RegularExpressions.RegexOptions.Singleline);
            if (imgMatch.Success)
            {
                imageUrl = imgMatch.Groups[1].Value.Trim();
                cleanMessage = System.Text.RegularExpressions.Regex.Replace(customerMessage, @"\[IMAGE:\s*.*?\]", "[صورة مرفقة]", System.Text.RegularExpressions.RegexOptions.Singleline).Trim();
            }

            if (!string.IsNullOrEmpty(imageUrl))
            {
                cleanMessage += "\n\n(ملاحظة هامة جداً: أرسل العميل هذه الصورة كمرفق ببيانات رحلته أو عروض سياحية أو بروشور. يرجى تحليل وقراءة كل النص والتفاصيل الموجودة داخل الصورة بدقة واستخلاص الدولة والوجهة وباقي الشروط، ثم اتخاذ القرار المناسب بحسب الخيارات المتاحة.)";
            }

            // Collapse consecutive messages of the same role for Gemini
            string lastRole = "";
            System.Text.StringBuilder currentText = new System.Text.StringBuilder();

            foreach (var msg in conversationHistory)
            {
                var role = msg.Role == "user" ? "user" : "model";
                
                if (role == lastRole)
                {
                    currentText.AppendLine(msg.Content);
                }
                else
                {
                    if (!string.IsNullOrEmpty(lastRole))
                    {
                        contents.Add(new { role = lastRole, parts = new object[] { new { text = currentText.ToString() } } });
                    }
                    lastRole = role;
                    currentText.Clear();
                    currentText.AppendLine(msg.Content);
                }
            }

            // Prepare the final user message parts
            var finalUserParts = new List<object>();
            
            if (lastRole == "user")
            {
                currentText.AppendLine(cleanMessage);
                finalUserParts.Add(new { text = currentText.ToString() });
            }
            else
            {
                if (!string.IsNullOrEmpty(lastRole))
                {
                    contents.Add(new { role = lastRole, parts = new object[] { new { text = currentText.ToString() } } });
                }
                finalUserParts.Add(new { text = cleanMessage });
            }

            // Append Image if it exists
            if (!string.IsNullOrEmpty(imageUrl))
            {
                try
                {
                    string base64Data;
                    string mimeType = "image/jpeg"; // default

                    if (imageUrl.StartsWith("data:image/"))
                    {
                        // Base64 string directly from simulator
                        var commaIdx = imageUrl.IndexOf(',');
                        if (commaIdx > 0)
                        {
                            var header = imageUrl.Substring(0, commaIdx);
                            var match = System.Text.RegularExpressions.Regex.Match(header, @"data:(image/.*?);base64");
                            if (match.Success) mimeType = match.Groups[1].Value;
                            base64Data = imageUrl.Substring(commaIdx + 1);
                        }
                        else
                        {
                            base64Data = imageUrl;
                        }
                    }
                    else
                    {
                        if (!imageUrl.StartsWith("https://", StringComparison.OrdinalIgnoreCase))
                        {
                            throw new Exception("Only HTTPS URLs are allowed for image downloads.");
                        }
                        
                        // Download the image using injected httpClient
                        var imageBytes = await _httpClient.GetByteArrayAsync(imageUrl);
                        base64Data = Convert.ToBase64String(imageBytes);
                        
                        if (imageUrl.ToLower().EndsWith(".png")) mimeType = "image/png";
                        else if (imageUrl.ToLower().EndsWith(".webp")) mimeType = "image/webp";
                    }

                    finalUserParts.Add(new 
                    { 
                        inline_data = new 
                        { 
                            mime_type = mimeType, 
                            data = base64Data 
                        } 
                    });
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Failed to load image for Gemini: {ex.Message}");
                    finalUserParts.Add(new { text = "\n[SYSTEM: Failed to load the user's image. Proceed without it.]" });
                }
            }

            contents.Add(new { role = "user", parts = finalUserParts.ToArray() });

            var requestBody = new
            {
                system_instruction = new { parts = new { text = systemPrompt } },
                contents = contents,
                generationConfig = new
                {
                    temperature = 0.3,
                    maxOutputTokens = 1200
                }
            };

            var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
            
            var response = await _httpClient.PostAsync(url, content);
            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                throw new Exception($"Gemini API Error: {response.StatusCode} - {errorContent}");
            }

            var responseString = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(responseString);
            
            var aiText = doc.RootElement
                .GetProperty("candidates")[0]
                .GetProperty("content")
                .GetProperty("parts")[0]
                .GetProperty("text")
                .GetString() ?? string.Empty;

            // Return raw response - let AiOrchestratorService handle all parsing
            return new AiResponse { Text = aiText };
        }
    }
}
