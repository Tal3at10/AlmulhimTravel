namespace Core.Application.Abstraction.Services;

public interface IRagDataIngestionService
{
    Task SyncPackagesKnowledgeAsync();
}
