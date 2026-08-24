using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Core.Application.Abstraction.Services;
using Microsoft.Extensions.Configuration;

namespace Infrastructure.Shared.Services;

public class OpenRouterEmbeddingService : IEmbeddingService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;
    private readonly string _model;

    public OpenRouterEmbeddingService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _apiKey = configuration["AiSettings:OpenRouterApiKey"] ?? string.Empty;
        
        // Use text-embedding-3-small via OpenRouter if possible, or fallback to nomic-embed-text
        // Actually, we will hardcode openai/text-embedding-3-small since OpenRouter routes it directly.
        _model = "openai/text-embedding-3-small"; 

        if (!string.IsNullOrEmpty(_apiKey))
        {
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);
            _httpClient.DefaultRequestHeaders.Add("X-Title", "Almulhim RAG System");
        }
    }

    public async Task<float[]> GetEmbeddingAsync(string text)
    {
        if (string.IsNullOrWhiteSpace(text)) return Array.Empty<float>();

        var requestBody = new
        {
            model = _model,
            input = text
        };

        var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");

        // The endpoint for embeddings in OpenAI / OpenRouter is usually /v1/embeddings
        var response = await _httpClient.PostAsync("https://openrouter.ai/api/v1/embeddings", content);
        
        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
            FileLogger.Log($"Embedding Error: {response.StatusCode} - {errorContent}");
            throw new Exception($"Embedding API Error: {response.StatusCode} - {errorContent}");
        }

        var responseString = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(responseString);
        
        var embeddingArray = doc.RootElement
            .GetProperty("data")[0]
            .GetProperty("embedding");

        var vector = new float[embeddingArray.GetArrayLength()];
        int i = 0;
        foreach (var element in embeddingArray.EnumerateArray())
        {
            vector[i++] = element.GetSingle();
        }

        return vector;
    }
}
