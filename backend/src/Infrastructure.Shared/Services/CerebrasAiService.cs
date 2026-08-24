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
    public class CerebrasAiService : IAiService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;
        private readonly string _model;

        public CerebrasAiService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _apiKey = configuration["AiSettings:CerebrasApiKey"] ?? string.Empty;
            _model = configuration["AiSettings:CerebrasModel"] ?? "llama3.1-8b";

            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);
        }

        public async Task<AiResponse> GenerateResponseAsync(string customerMessage, List<ChatMessage> conversationHistory, string systemPrompt)
        {
            if (string.IsNullOrWhiteSpace(_apiKey))
            {
                throw new InvalidOperationException("Cerebras API key is missing. Set AiSettings:CerebrasApiKey.");
            }

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
                temperature = 0.7,
                max_tokens = 4096
            };

            var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync("https://api.cerebras.ai/v1/chat/completions", content);
            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                throw new Exception($"Cerebras API Error: {response.StatusCode} - {errorContent}");
            }

            var responseString = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(responseString);

            var aiText = doc.RootElement
                .GetProperty("choices")[0]
                .GetProperty("message")
                .GetProperty("content")
                .GetString() ?? string.Empty;

            return new AiResponse { Text = aiText };
        }
    }
}
