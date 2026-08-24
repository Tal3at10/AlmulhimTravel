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
    /// GPT-4o-mini AI Service - Second fallback provider.
    /// </summary>
    public class Gpt4oMiniAiService : IAiService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;
        private readonly string _model = "openai/gpt-4o-mini";

        public Gpt4oMiniAiService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _apiKey = configuration["AiSettings:OpenRouterApiKey"] ?? string.Empty;

            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);
            _httpClient.DefaultRequestHeaders.Add("X-Title", "Almulhim Travel Bot");
        }

        public async Task<AiResponse> GenerateResponseAsync(string customerMessage, List<ChatMessage> conversationHistory, string systemPrompt)
        {
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
                model = _model,
                messages = messages,
                temperature = 0.3,
                max_tokens = 800
            };

            var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync("https://openrouter.ai/api/v1/chat/completions", content);
            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                throw new Exception($"GPT-4o-mini API Error: {response.StatusCode} - {errorContent}");
            }

            var responseString = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(responseString);

            var messageElement = doc.RootElement
                .GetProperty("choices")[0]
                .GetProperty("message");

            var aiText = messageElement.GetProperty("content").GetString() ?? string.Empty;

            if (string.IsNullOrWhiteSpace(aiText))
            {
                throw new Exception("GPT-4o-mini returned an empty message content.");
            }

            return new AiResponse { Text = aiText };
        }
    }
}
