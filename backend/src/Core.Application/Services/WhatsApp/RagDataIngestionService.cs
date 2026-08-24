using Core.Application.Abstraction.Models;
using Core.Application.Abstraction.Interfaces;
using Core.Application.Abstraction.Services;

namespace Core.Application.Services.WhatsApp;

public class RagDataIngestionService : IRagDataIngestionService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IEmbeddingService _embeddingService;
    private readonly IVectorDbService _vectorDbService;

    public RagDataIngestionService(
        IUnitOfWork unitOfWork,
        IEmbeddingService embeddingService,
        IVectorDbService vectorDbService)
    {
        _unitOfWork = unitOfWork;
        _embeddingService = embeddingService;
        _vectorDbService = vectorDbService;
    }

    public async Task SyncPackagesKnowledgeAsync()
    {
        // 1. Get all active packages and knowledge base
        var packages = await _unitOfWork.Packages.FindAllAsync(p => p.IsActive, p => p.Destination, p => p.Features, p => p.Itineraries);
        var knowledgeBase = await _unitOfWork.WhatsAppKnowledge.FindAllAsync(k => k.IsActive);
        
        var documents = new List<VectorDocument>();

        // 2. Clear old vectors
        await _vectorDbService.ClearAllAsync();

        foreach (var package in packages)
        {
            var featuresText = package.Features != null && package.Features.Any() 
                ? string.Join(", ", package.Features.Select(f => f.Text)) 
                : "لا يوجد جولات محددة";
                
            var itinerariesText = package.Itineraries != null && package.Itineraries.Any()
                ? string.Join(" | ", package.Itineraries.OrderBy(i => i.Day).Select(i => $"يوم {i.Day}: {i.Title} - {i.Description}"))
                : "";

            var textToEmbed = $"باقة سياحية: {package.TitleAr}. " +
                              $"الوجهة: {package.Destination?.NameAr}. " +
                              $"المدة: {package.DurationDays} أيام. " +
                              $"السعر لشخصين: {package.Price} {package.Currency}. " +
                              $"رابط الباقة: https://almulhimtravel.com/package/{package.PackageId.Replace(" ", "-")}. " +
                              $"تشمل الجولات والمميزات التالية: {featuresText}. " +
                              $"خطة الرحلة: {itinerariesText}";

            var vector = await _embeddingService.GetEmbeddingAsync(textToEmbed);

            documents.Add(new VectorDocument
            {
                Id = $"pkg_{package.Id}",
                Text = textToEmbed,
                Vector = vector,
                Type = "Package",
                ReferenceId = package.Id.ToString()
            });
            
            // To prevent hitting rate limits
            await Task.Delay(500);
        }

        // Process Knowledge Base (Visas, FAQs, Policies)
        foreach (var knowledge in knowledgeBase)
        {
            var textToEmbed = $"معلومة ({knowledge.Category}): {knowledge.Title}. التفاصيل: {knowledge.Content}";

            var vector = await _embeddingService.GetEmbeddingAsync(textToEmbed);

            documents.Add(new VectorDocument
            {
                Id = $"know_{knowledge.Id}",
                Text = textToEmbed,
                Vector = vector,
                Type = "Knowledge",
                ReferenceId = knowledge.Id.ToString()
            });

            await Task.Delay(500);
        }

        // Process Blog Posts (Tourism Guides, Recommendations)
        var blogPosts = await _unitOfWork.BlogPosts.FindAllAsync(b => b.IsPublished);
        foreach (var blog in blogPosts)
        {
            var cleanContent = System.Text.RegularExpressions.Regex.Replace(blog.Content ?? "", "<.*?>", string.Empty);
            
            // Chunking the blog content if it's too long (simple chunking by paragraphs or just taking the first 3000 chars for simplicity)
            var contentToEmbed = cleanContent.Length > 4000 ? cleanContent.Substring(0, 4000) : cleanContent;
            
            var textToEmbed = $"مقال سياحي: {blog.Title}. الوصف: {blog.ShortDescription}. المحتوى: {contentToEmbed}";

            var vector = await _embeddingService.GetEmbeddingAsync(textToEmbed);

            documents.Add(new VectorDocument
            {
                Id = $"blog_{blog.Id}",
                Text = textToEmbed,
                Vector = vector,
                Type = "Blog",
                ReferenceId = blog.Id.ToString()
            });

            await Task.Delay(500);
        }

        // 3. Upsert to VectorDB
        if (documents.Any())
        {
            await _vectorDbService.UpsertBatchAsync(documents);
        }
    }
}
