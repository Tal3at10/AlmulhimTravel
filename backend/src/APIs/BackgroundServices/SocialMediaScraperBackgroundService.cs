using Core.Application.Abstraction.Services;
using Core.Domain.Entities;
using Core.Application.Abstraction.Models;
using Infrastructure.Persistence.Data;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace APIs.BackgroundServices
{
    public class SocialMediaScraperBackgroundService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<SocialMediaScraperBackgroundService> _logger;
        private readonly HttpClient _httpClient;

        // Apify API Token should be configured via environment variables or configuration
        private readonly string _apifyApiUrl = "https://api.apify.com/v2/actors/apify~instagram-scraper/run-sync-get-dataset-items?token=YOUR_APIFY_TOKEN";

        public SocialMediaScraperBackgroundService(IServiceProvider serviceProvider, ILogger<SocialMediaScraperBackgroundService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
            _httpClient = new HttpClient();
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("SocialMediaScraperBackgroundService is starting.");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    _logger.LogInformation("Waking up to check for new social media ads...");
                    await ProcessNewPostsAsync(stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred while processing social media ads.");
                }

                // Wait 2 hours before checking again
                await Task.Delay(TimeSpan.FromHours(2), stoppingToken);
            }
        }

        private async Task ProcessNewPostsAsync(CancellationToken stoppingToken)
        {
            using var scope = _serviceProvider.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<AlmulhemDbContext>();
            var aiService = scope.ServiceProvider.GetRequiredService<IAiService>();
            var vectorDbService = scope.ServiceProvider.GetRequiredService<IVectorDbService>();

            // 1. Fetch from Apify
            var recentPosts = await GetPostsFromApiAsync();

            foreach (var post in recentPosts)
            {
                // 2. Deduplication check
                bool exists = await dbContext.PromotionalAds.AnyAsync(a => a.SocialMediaId == post.SocialMediaId, stoppingToken);
                
                if (!exists)
                {
                    _logger.LogInformation($"Found new ad! Processing ID: {post.SocialMediaId}");

                    // 3. Vision AI Extraction
                    string prompt = $"[IMAGE: {post.ImageUrl}] Please analyze this travel agency promotional ad image. Extract the exact Destination City/Country, the Price (if mentioned), and all text written on the image. Return it as structured text.";
                    var aiResponse = await aiService.GenerateResponseAsync(prompt, new List<ChatMessage>(), "أنت محلل بيانات. أعد JSON فقط.");
                    string extractedJson = aiResponse.Text ?? "";

                    // 4. Save to DB
                    var newAd = new PromotionalAd
                    {
                        Id = Guid.NewGuid(),
                        SocialMediaId = post.SocialMediaId,
                        Platform = "Instagram",
                        ImageUrl = post.ImageUrl,
                        ExtractedText = extractedJson,
                        IsActive = true
                    };

                    dbContext.PromotionalAds.Add(newAd);
                    await dbContext.SaveChangesAsync(stoppingToken);
                    _logger.LogInformation($"Successfully saved ad {newAd.Id} to database.");
                    
                    // 5. Inject into Vector DB
                    var vectorDocument = new VectorDocument
                    {
                        Id = Guid.NewGuid().ToString(),
                        Text = $"عرض انستجرام سياحي: {extractedJson}",
                        Type = "SocialMediaAd",
                        ReferenceId = newAd.Id.ToString()
                    };
                    
                    await vectorDbService.UpsertAsync(vectorDocument);
                    _logger.LogInformation($"Ad {post.SocialMediaId} injected into VectorDB successfully.");
                }
            }
        }

        private async Task<List<ScrapedPost>> GetPostsFromApiAsync()
        {
            try
            {
                var payload = new 
                {
                    addParentData = false,
                    directUrls = new[] { "https://www.instagram.com/almulhimtravel" },
                    enhanceUserSearchWithFacebookPage = false,
                    isUserReelFeedURL = false,
                    isUserTaggedFeedURL = false,
                    resultsLimit = 5,
                    resultsType = "posts",
                    searchLimit = 1,
                    searchType = "hashtag"
                };

                var content = new StringContent(System.Text.Json.JsonSerializer.Serialize(payload), System.Text.Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync(_apifyApiUrl, content);
                
                var jsonResponse = await response.Content.ReadAsStringAsync();
                
                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError($"Apify Error: {response.StatusCode}. Body: {jsonResponse}");
                    return new List<ScrapedPost>();
                }
                
                // Parse the response
                using var doc = System.Text.Json.JsonDocument.Parse(jsonResponse);
                var posts = new List<ScrapedPost>();
                
                if (doc.RootElement.ValueKind == System.Text.Json.JsonValueKind.Array)
                {
                    foreach (var element in doc.RootElement.EnumerateArray())
                    {
                        string id = "";
                        if (element.TryGetProperty("id", out var idProp)) id = idProp.GetString() ?? "";

                        string url = "";
                        if (element.TryGetProperty("displayUrl", out var displayProp)) url = displayProp.GetString() ?? "";
                        else if (element.TryGetProperty("videoUrl", out var videoProp)) url = videoProp.GetString() ?? "";
                        
                        if (!string.IsNullOrEmpty(id) && !string.IsNullOrEmpty(url))
                        {
                            posts.Add(new ScrapedPost { SocialMediaId = id, ImageUrl = url });
                        }
                    }
                }
                
                _logger.LogInformation($"Extracted {posts.Count} valid posts from Apify response.");
                return posts;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Failed to fetch from Apify");
                return new List<ScrapedPost>();
            }
        }
    }

    public class ScrapedPost
    {
        public string SocialMediaId { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
    }
}
