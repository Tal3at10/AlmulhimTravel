using System.Collections.Concurrent;
using System.Text.Json;
using Core.Application.Abstraction.Models;
using Core.Application.Abstraction.Services;
using Microsoft.Extensions.Hosting;

namespace Infrastructure.Shared.Services;

public class InMemoryVectorDbService : IVectorDbService
{
    private readonly ConcurrentDictionary<string, VectorDocument> _store = new();
    private readonly string _storagePath;
    private bool _isLoaded = false;

    public InMemoryVectorDbService(IHostEnvironment env)
    {
        // Save the embeddings in the application root directory
        var dataPath = Path.Combine(env.ContentRootPath, "App_Data");
        if (!Directory.Exists(dataPath))
        {
            Directory.CreateDirectory(dataPath);
        }
        _storagePath = Path.Combine(dataPath, "embeddings.json");
    }

    private async Task EnsureLoadedAsync()
    {
        if (_isLoaded) return;

        if (File.Exists(_storagePath))
        {
            try
            {
                var json = await File.ReadAllTextAsync(_storagePath);
                var items = JsonSerializer.Deserialize<List<VectorDocument>>(json);
                if (items != null)
                {
                    foreach (var item in items)
                    {
                        _store[item.Id] = item;
                    }
                }
            }
            catch (Exception ex)
            {
                FileLogger.Log($"Error loading embeddings: {ex.Message}");
            }
        }
        _isLoaded = true;
    }

    private async Task SaveChangesAsync()
    {
        try
        {
            var items = _store.Values.ToList();
            var json = JsonSerializer.Serialize(items);
            await File.WriteAllTextAsync(_storagePath, json);
        }
        catch (Exception ex)
        {
            FileLogger.Log($"Error saving embeddings: {ex.Message}");
        }
    }

    public async Task UpsertAsync(VectorDocument document)
    {
        await EnsureLoadedAsync();
        _store[document.Id] = document;
        await SaveChangesAsync();
    }

    public async Task UpsertBatchAsync(IEnumerable<VectorDocument> documents)
    {
        await EnsureLoadedAsync();
        foreach (var doc in documents)
        {
            _store[doc.Id] = doc;
        }
        await SaveChangesAsync();
    }

    public async Task DeleteAsync(string id)
    {
        await EnsureLoadedAsync();
        if (_store.TryRemove(id, out _))
        {
            await SaveChangesAsync();
        }
    }

    public async Task ClearAllAsync()
    {
        _store.Clear();
        await SaveChangesAsync();
    }

    public async Task<List<VectorDocument>> SearchAsync(float[] queryVector, int topK = 5, string? filterType = null, string? queryText = null)
    {
        await EnsureLoadedAsync();

        var queryWords = string.IsNullOrWhiteSpace(queryText) 
            ? new List<string>() 
            : queryText.Split(new[] { ' ', '\n', '\r', '\t', '?', '!', ',', '.' }, StringSplitOptions.RemoveEmptyEntries)
                       .Where(w => w.Length > 2)
                       .Select(w => w.ToLower())
                       .ToList();

        var results = _store.Values
            .Where(d => string.IsNullOrEmpty(filterType) || d.Type == filterType)
            .Select(d => 
            {
                float sim = CosineSimilarity(queryVector, d.Vector);
                
                // Keyword boost for hybrid search
                if (queryWords.Any())
                {
                    string docTextLower = d.Text.ToLower();
                    foreach (var word in queryWords)
                    {
                        if (docTextLower.Contains(word))
                        {
                            sim += 0.15f; // Significant boost for exact word match
                        }
                    }
                }
                
                return new
                {
                    Document = d,
                    Similarity = sim
                };
            })
            .OrderByDescending(r => r.Similarity)
            .Take(topK)
            .Select(r => r.Document)
            .ToList();

        return results;
    }

    private float CosineSimilarity(float[] vectorA, float[] vectorB)
    {
        if (vectorA.Length != vectorB.Length)
            return 0;

        float dotProduct = 0;
        float normA = 0;
        float normB = 0;

        for (int i = 0; i < vectorA.Length; i++)
        {
            dotProduct += vectorA[i] * vectorB[i];
            normA += vectorA[i] * vectorA[i];
            normB += vectorB[i] * vectorB[i];
        }

        if (normA == 0 || normB == 0)
            return 0;

        return (float)(dotProduct / (Math.Sqrt(normA) * Math.Sqrt(normB)));
    }
}
