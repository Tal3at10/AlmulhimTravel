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
    /// Hugging Face AI Service - Fourth fallback provider (Free, no harsh limits)
    /// Uses Llama 3.2 3B Instruct model via Inference API
    /// </summary>
    public class HuggingFaceAiService : IAiService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;
        private readonly string _model;

        public HuggingFaceAiService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _apiKey = configuration["AiSettings:HuggingFaceApiKey"] ?? string.Empty;
            _model = configuration["AiSettings:HuggingFaceModel"] ?? "meta-llama/Llama-3.2-3B-Instruct";

            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);
            _httpClient.Timeout = TimeSpan.FromSeconds(60); // HF can be slower
        }

        public async Task<AiResponse> GenerateResponseAsync(string customerMessage, List<ChatMessage> conversationHistory, string systemPrompt)
        {
            // Use correct Hugging Face Inference API endpoint (not the router)
            var url = $"https://api-inference.huggingface.co/models/{_model}";

            var messages = new List<object>
            {
                new { role = "system", content = systemPrompt }
            };

            foreach (var msg in conversationHistory)
            {
                messages.Add(new { role = msg.Role, content = msg.Content });
            }

            messages.Add(new { role = "user", content = customerMessage });

            var requestBody = new
            {
                inputs = $"{systemPrompt}\n\nUser: {customerMessage}",
                parameters = new
                {
                    temperature = 0.7,
                    max_new_tokens = 4096,
                    return_full_text = false
                }
            };

            var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync(url, content);
            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                throw new Exception($"Hugging Face API Error: {response.StatusCode} - {errorContent}");
            }

            var responseString = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(responseString);

            // Hugging Face returns array with generated_text
            var aiText = doc.RootElement[0]
                .GetProperty("generated_text")
                .GetString() ?? string.Empty;

            // Return raw response - let AiOrchestratorService handle all parsing
            return new AiResponse { Text = aiText };
        }
    }
}
