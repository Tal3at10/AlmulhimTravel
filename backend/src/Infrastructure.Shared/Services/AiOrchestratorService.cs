using System;
using Microsoft.Extensions.Caching.Memory;
using System.Collections.Generic;
using System.Threading.Tasks;
using Core.Application.Abstraction.Services;
using Microsoft.Extensions.Configuration;

namespace Infrastructure.Shared.Services
{
    /// <summary>
    /// AI Orchestrator - Manages failover between multiple AI providers + response caching.
    /// Chain: Gemini 1.5 → Groq (fastest) → OpenRouter (backup)
    /// </summary>
    public class AiOrchestratorService : IAiService
    {
        private readonly GroqAiService _groqAiService;
        private readonly GeminiAiService _geminiAiService;
        private readonly OpenRouterAiService _openRouterAiService;
        private readonly IConfiguration _configuration;
        private readonly IMemoryCache _cache;
        private static readonly TimeSpan CacheExpiry = TimeSpan.FromHours(6);

        public AiOrchestratorService(
            GroqAiService groqAiService,
            GeminiAiService geminiAiService,
            OpenRouterAiService openRouterAiService,
            IConfiguration configuration,
            IMemoryCache cache)
        {
            _groqAiService = groqAiService;
            _geminiAiService = geminiAiService;
            _openRouterAiService = openRouterAiService;
            _configuration = configuration;
            _cache = cache;
        }

        public async Task<AiResponse> GenerateResponseAsync(string customerMessage, List<ChatMessage> conversationHistory, string systemPrompt)
        {
            if (conversationHistory.Count <= 2)
            {
                var cached = TryGetCachedResponse(customerMessage, systemPrompt);
                if (cached != null) return cached;
            }

            var response = await ExecuteFallbackChainAsync(customerMessage, conversationHistory, systemPrompt);
            PostProcessAiResponse(response);

            if (!response.ShouldHandoff && (response.SuggestedImageUrls == null || response.SuggestedImageUrls.Count == 0) && conversationHistory.Count <= 2)
            {
                CacheResponse(customerMessage, response, systemPrompt);
            }

            return response;
        }

        private void PostProcessAiResponse(AiResponse response)
        {
            if (string.IsNullOrEmpty(response.Text)) return;

            if (response.Text.Contains("[[HANDOFF]]", StringComparison.OrdinalIgnoreCase) || response.Text.Contains("[HANDOFF]", StringComparison.OrdinalIgnoreCase))
            {
                response.ShouldHandoff = true;
                response.Text = response.Text.Replace("[[HANDOFF]]", "", StringComparison.OrdinalIgnoreCase)
                                             .Replace("[HANDOFF]", "", StringComparison.OrdinalIgnoreCase).Trim();
            }

            var imageRegex = new System.Text.RegularExpressions.Regex(
                @"\[{1,2}IMAGE:\s*([^\]]+?)\s*\]{1,2}", 
                System.Text.RegularExpressions.RegexOptions.Singleline | System.Text.RegularExpressions.RegexOptions.IgnoreCase
            );
            var matches = imageRegex.Matches(response.Text);
            
            response.SuggestedImageUrls = new List<string>();
            foreach (System.Text.RegularExpressions.Match match in matches)
            {
                var url = match.Groups[1].Value.Trim();
                if (!string.IsNullOrEmpty(url))
                {
                    url = url.Split(new[] { '\r', '\n', ' ', ']' }, StringSplitOptions.RemoveEmptyEntries)[0].Trim();
                    if (url.StartsWith("http", StringComparison.OrdinalIgnoreCase))
                    {
                        response.SuggestedImageUrls.Add(url);
                    }
                }
            }

            response.Text = imageRegex.Replace(response.Text, "").Trim();
            response.Text = System.Text.RegularExpressions.Regex.Replace(
                response.Text, 
                @"\[{0,2}IMAGE:.*?\]{0,2}", 
                "", 
                System.Text.RegularExpressions.RegexOptions.IgnoreCase
            ).Trim();

            if (response.SuggestedImageUrls.Count > 0)
            {
                response.SuggestedImageUrl = response.SuggestedImageUrls[0];
            }

            // Strip Markdown formatting (WhatsApp doesn't render it)
            var text = response.Text;
            // Removed **bold** and *italic* markers stripping as WhatsApp supports it
            // Remove ## headers
            text = System.Text.RegularExpressions.Regex.Replace(text, @"^#{1,3}\s*", "", System.Text.RegularExpressions.RegexOptions.Multiline);
            // Remove --- horizontal rules
            text = System.Text.RegularExpressions.Regex.Replace(text, @"^-{3,}$", "", System.Text.RegularExpressions.RegexOptions.Multiline);
            // Clean up excessive blank lines (more than 2 consecutive)
            text = System.Text.RegularExpressions.Regex.Replace(text, @"\n{3,}", "\n\n");
            response.Text = text.Trim();
        }

        private async Task<AiResponse> ExecuteFallbackChainAsync(string message, List<ChatMessage> history, string prompt)
        {
            FileLogger.Log($"=== New AI Request ===");
            FileLogger.Log($"Customer Message: {message}");
            FileLogger.Log($"Prompt Size: {prompt.Length} chars");
            FileLogger.Log($"History Count: {history.Count} messages");

            var errors = new System.Text.StringBuilder();

            // Provider 1: OpenRouter/GPT-4o-mini (PRIMARY - cheapest with prompt caching)
            if (!string.IsNullOrEmpty(_configuration["AiSettings:OpenRouterApiKey"]))
            {
                try 
                { 
                    FileLogger.Log($"[1/3] Trying OpenRouter (GPT-4o-mini)...");
                    var result = await _openRouterAiService.GenerateResponseAsync(message, history, prompt);
                    FileLogger.Log($"[1/3] OpenRouter SUCCESS! Response: {result.Text?.Length ?? 0} chars");
                    return result; 
                }
                catch (Exception ex) 
                { 
                    FileLogger.Log($"[1/3] OpenRouter FAILED: {ex.Message}");
                    errors.AppendLine($"OpenRouter Error: {ex.Message}"); 
                }
            }

            // Provider 2: Gemini Flash (FALLBACK)
            if (!string.IsNullOrEmpty(_configuration["AiSettings:GeminiApiKey"]))
            {
                try 
                { 
                    var model = _configuration["AiSettings:GeminiFlashModel"] ?? "gemini-1.5-flash";
                    FileLogger.Log($"[2/3] Trying Gemini Flash ({model})...");
                    var result = await _geminiAiService.GenerateResponseAsync(message, history, prompt, model);
                    FileLogger.Log($"[2/3] Gemini Flash SUCCESS! Response: {result.Text?.Length ?? 0} chars");
                    return result; 
                }
                catch (Exception ex) 
                { 
                    FileLogger.Log($"[2/3] Gemini Flash FAILED: {ex.Message}");
                    errors.AppendLine($"Gemini Flash Error: {ex.Message}"); 
                }
            }

            // Provider 3: Groq (Last Resort)
            if (!string.IsNullOrEmpty(_configuration["AiSettings:ApiKey"]))
            {
                try 
                { 
                    FileLogger.Log($"[3/3] Trying Groq...");
                    var result = await _groqAiService.GenerateResponseAsync(message, history, prompt);
                    FileLogger.Log($"[3/3] Groq SUCCESS! Response: {result.Text?.Length ?? 0} chars");
                    return result; 
                }
                catch (Exception ex) 
                { 
                    FileLogger.Log($"[3/3] Groq FAILED: {ex.Message}");
                    errors.AppendLine($"Groq Error: {ex.Message}"); 
                }
            }

            FileLogger.Log($"[CRITICAL] ALL PROVIDERS FAILED OR SKIPPED - Handing off to human");

            // Log Errors
            try { System.IO.File.AppendAllText("ai_errors.txt", $"{DateTime.UtcNow}: {errors.ToString()}\n"); } catch { }

            // All providers down
            Console.WriteLine("[AI Fallback] ALL PROVIDERS DOWN. Handing off to human.");
            return new AiResponse
            {
                Text = "معك 'سفر' وكيلك الذكي.. أعتذر منك، يبدو أن هناك ضغطاً تقنياً بسيطاً حالياً. قمت بتحويلك فوراً لزملائي المختصين ليقوموا بخدمتك بأفضل شكل! 🚀",
                ShouldHandoff = true
            };
        }

        private AiResponse? TryGetCachedResponse(string question, string systemPrompt)
        {
            var key = $"AiResponse_{NormalizeQuestion(question)}_{GetStableHash(systemPrompt)}";
            if (_cache.TryGetValue(key, out AiResponse? cachedResponse))
            {
                return cachedResponse;
            }
            return null;
        }

        private void CacheResponse(string question, AiResponse response, string systemPrompt)
        {
            var key = $"AiResponse_{NormalizeQuestion(question)}_{GetStableHash(systemPrompt)}";
            _cache.Set(key, response, CacheExpiry);
        }

        private static string NormalizeQuestion(string q)
        {
            return q.Trim().ToLowerInvariant().Replace("؟", "").Replace("?", "");
        }

        private static string GetStableHash(string input)
        {
            if (string.IsNullOrEmpty(input)) return "empty";
            using (var sha256 = System.Security.Cryptography.SHA256.Create())
            {
                var bytes = System.Text.Encoding.UTF8.GetBytes(input);
                var hash = sha256.ComputeHash(bytes);
                return Convert.ToBase64String(hash).Replace("/", "_").Replace("+", "-").TrimEnd('=');
            }
        }
    }
}
