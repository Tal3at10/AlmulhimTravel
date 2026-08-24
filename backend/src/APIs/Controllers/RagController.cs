using Core.Application.Abstraction.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using Core.Application.Services.WhatsApp;

namespace APIs.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RagController : ControllerBase
{
    private readonly IRagDataIngestionService _ragDataIngestionService;
    private readonly Core.Application.Abstraction.Interfaces.IUnitOfWork _unitOfWork;
    private readonly IEmbeddingService _embeddingService;
    private readonly IVectorDbService _vectorDbService;
    private readonly WhatsAppAgentService _whatsAppAgentService;

    public RagController(
        IRagDataIngestionService ragDataIngestionService,
        Core.Application.Abstraction.Interfaces.IUnitOfWork unitOfWork,
        IEmbeddingService embeddingService,
        IVectorDbService vectorDbService,
        WhatsAppAgentService whatsAppAgentService)
    {
        _ragDataIngestionService = ragDataIngestionService;
        _unitOfWork = unitOfWork;
        _embeddingService = embeddingService;
        _vectorDbService = vectorDbService;
        _whatsAppAgentService = whatsAppAgentService;
    }

    [HttpPost("sync-knowledge")]
    public async Task<IActionResult> SyncKnowledge()
    {
        try
        {
            await _ragDataIngestionService.SyncPackagesKnowledgeAsync();
            return Ok(new { message = "تم مزامنة باقات سياحية مع محرك الذكاء الاصطناعي (RAG) بنجاح." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "حدث خطأ أثناء المزامنة.", details = ex.Message });
        }
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string q)
    {
        var vector = await _embeddingService.GetEmbeddingAsync(q);
        var res = await _vectorDbService.SearchAsync(vector, topK: 3, filterType: null, queryText: q);
        return Ok(res.Select(r => r.Text));
    }

    [HttpGet("db-search/{word}")]
    public async Task<IActionResult> DbSearch(string word)
    {
        var pkgs = await _unitOfWork.Packages.FindAllAsync(p => 
            (p.Destination != null && p.Destination.NameAr != null && p.Destination.NameAr.Contains(word)) || 
            (p.Features != null && p.Features.Any(f => f.Text != null && f.Text.Contains(word)))
        );
        return Ok(pkgs.Select(p => new { p.TitleAr, Destination = p.Destination?.NameAr, Features = p.Features?.Select(f => f.Text) }));
    }

    [HttpGet("test-40")]
    public async Task<IActionResult> TestLast40Messages()
    {
        try
        {
            var pagedResult = await _unitOfWork.WhatsAppMessages.GetPagedAsync(
                pageNumber: 1,
                pageSize: 40,
                predicate: m => m.Direction == Core.Domain.Enums.MessageDirection.Inbound,
                orderBy: q => q.OrderByDescending(m => m.SentAt)
            );
            var recentMessages = pagedResult.Items;

            var results = new List<object>();

            foreach (var msg in recentMessages)
            {
                var conversation = await _unitOfWork.WhatsAppConversations.GetByIdAsync(msg.ConversationId);
                if (conversation == null) continue;

                var currentState = "GeneralInquiry";
                
                // Get AI Supervisor response
                var aiResponse = await _whatsAppAgentService.ProcessWithAISupervisorAsync(msg.Content, currentState, conversation);
                
                results.Add(new
                {
                    ConversationId = msg.ConversationId,
                    Message = msg.Content,
                    AiReply = aiResponse.Response
                });
                
                await Task.Delay(200); // Prevent rate limits
            }

            return Ok(results);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "حدث خطأ أثناء الاختبار.", details = ex.Message });
        }
    }
}
