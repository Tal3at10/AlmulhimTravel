namespace Core.Application.Abstraction.Services;

public interface IEmbeddingService
{
    Task<float[]> GetEmbeddingAsync(string text);
}
