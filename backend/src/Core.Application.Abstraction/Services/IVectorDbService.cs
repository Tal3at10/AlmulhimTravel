using Core.Application.Abstraction.Models;

namespace Core.Application.Abstraction.Services;

public interface IVectorDbService
{
    Task UpsertAsync(VectorDocument document);
    Task UpsertBatchAsync(IEnumerable<VectorDocument> documents);
    Task<List<VectorDocument>> SearchAsync(float[] queryVector, int topK = 5, string? filterType = null, string? queryText = null);
    Task DeleteAsync(string id);
    Task ClearAllAsync();
}
