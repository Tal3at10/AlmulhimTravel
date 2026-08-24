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
    public class GroqAiService : IAiService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly string _apiKey;
        private readonly string _model;

        public GroqAiService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _apiKey = configuration["AiSettings:ApiKey"] ?? string.Empty;
            _model = configuration["AiSettings:Model"] ?? "llama-3.3-70b-versatile";
            if (_model == "llama3-70b-8192" || _model == "llama-3.1-70b-versatile")
            {
                _model = "llama-3.3-70b-versatile";
            }
            
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);
        }

        public async Task<AiResponse> GenerateResponseAsync(string customerMessage, List<ChatMessage> conversationHistory, string systemPrompt)
        {
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
                temperature = 0.3,
                max_tokens = 800  // Bot responses are 1-2 lines max (~200 tokens)
            };

            var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
            using var cts = new System.Threading.CancellationTokenSource(TimeSpan.FromSeconds(10));
            var response = await _httpClient.PostAsync("https://api.groq.com/openai/v1/chat/completions", content, cts.Token);
            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                throw new Exception($"Groq API Error: {response.StatusCode} - {errorContent}");
            }

            var responseString = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(responseString);
            
            var aiText = doc.RootElement
                .GetProperty("choices")[0]
                .GetProperty("message")
                .GetProperty("content")
                .GetString() ?? string.Empty;

            // Return raw response - let AiOrchestratorService handle all parsing
            return new AiResponse { Text = aiText };
        }

        public async Task<string> TranscribeAudioAsync(byte[] audioBytes, string fileName)
        {
            // 1. Try Groq Whisper if ApiKey exists
            if (!string.IsNullOrEmpty(_apiKey))
            {
                try
                {
                    using var content = new MultipartFormDataContent();
                    var audioContent = new ByteArrayContent(audioBytes);
                    var ext = Path.GetExtension(fileName).ToLower();
                    var mimeType = ext switch
                    {
                        ".ogg" or ".opus" => "audio/ogg",
                        ".mp3" => "audio/mpeg",
                        ".m4a" => "audio/m4a",
                        ".wav" => "audio/wav",
                        ".mp4" => "audio/mp4",
                        _ => "audio/ogg"
                    };
                    var safeFileName = (ext == ".opus" || string.IsNullOrEmpty(ext)) ? "audio.ogg" : fileName;
                    
                    audioContent.Headers.ContentType = MediaTypeHeaderValue.Parse(mimeType);
                    content.Add(audioContent, "file", safeFileName);
                    content.Add(new StringContent("whisper-large-v3"), "model");
                    content.Add(new StringContent("ar"), "language");
                    content.Add(new StringContent("محادثة واتساب لسفريات وحجوزات سياحية. الوجهات: تايلاند، ماليزيا، البوسنة، جورجيا، أذربيجان، تركيا، إندونيسيا، روسيا، اليابان، أوروبا، لندن، دبي، مصر، الشنغن، فيزا."), "prompt");

                    var response = await _httpClient.PostAsync("https://api.groq.com/openai/v1/audio/transcriptions", content);
                    if (response.IsSuccessStatusCode)
                    {
                        var responseString = await response.Content.ReadAsStringAsync();
                        using var doc = JsonDocument.Parse(responseString);
                        var text = doc.RootElement.GetProperty("text").GetString();
                        if (!string.IsNullOrWhiteSpace(text)) return text.Trim();
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"⚠️ Groq Whisper error: {ex.Message}");
                }
            }

            // 2. Fallback A: Direct Google Gemini API if GeminiApiKey exists
            var geminiKey = _configuration["AiSettings:GeminiApiKey"];
            if (!string.IsNullOrEmpty(geminiKey))
            {
                try
                {
                    var ext = Path.GetExtension(fileName).ToLower();
                    var mimeType = ext switch
                    {
                        ".ogg" or ".opus" => "audio/ogg",
                        ".mp3" => "audio/mp3",
                        ".m4a" => "audio/m4a",
                        ".wav" => "audio/wav",
                        _ => "audio/ogg"
                    };

                    var b64Audio = Convert.ToBase64String(audioBytes);
                    var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={geminiKey}";
                    
                    var requestBody = new
                    {
                        contents = new object[]
                        {
                            new
                            {
                                parts = new object[]
                                {
                                    new { text = "قم بتفريغ هذا التسجيل الصوتي بالكامل باللغة العربية بدقة عالية وبدون أي إضافة أو مقدمات. اكتب النص المسموع فقط." },
                                    new { inline_data = new { mime_type = mimeType, data = b64Audio } }
                                }
                            }
                        }
                    };

                    using var client = new HttpClient();
                    var jsonContent = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
                    var res = await client.PostAsync(url, jsonContent);
                    if (res.IsSuccessStatusCode)
                    {
                        var resStr = await res.Content.ReadAsStringAsync();
                        using var doc = JsonDocument.Parse(resStr);
                        var text = doc.RootElement
                            .GetProperty("candidates")[0]
                            .GetProperty("content")
                            .GetProperty("parts")[0]
                            .GetProperty("text")
                            .GetString() ?? string.Empty;

                        Console.WriteLine($"🎤 [Gemini Audio Transcription] Result: '{text.Trim()}'");
                        return text.Trim();
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"⚠️ Gemini Audio transcription error: {ex.Message}");
                }
            }

            // 3. Fallback B: OpenRouter API using google/gemini-2.5-flash with OpenRouterApiKey & input_audio payload
            var openRouterKey = _configuration["AiSettings:OpenRouterApiKey"];
            if (!string.IsNullOrEmpty(openRouterKey))
            {
                try
                {
                    var ext = Path.GetExtension(fileName).ToLower();
                    var audioFormat = ext switch
                    {
                        ".ogg" or ".opus" => "ogg",
                        ".mp3" => "mp3",
                        ".m4a" => "m4a",
                        ".wav" => "wav",
                        _ => "ogg"
                    };

                    var b64Audio = Convert.ToBase64String(audioBytes);
                    var requestBody = new
                    {
                        model = "google/gemini-2.5-flash",
                        messages = new object[]
                        {
                            new
                            {
                                role = "user",
                                content = new object[]
                                {
                                    new { type = "text", text = "قم بتفريغ هذا التسجيل الصوتي بالكامل باللغة العربية بدقة عالية وبدون أي إضافة أو مقدمات. اكتب النص المسموع فقط." },
                                    new { type = "input_audio", input_audio = new { data = b64Audio, format = audioFormat } }
                                }
                            }
                        }
                    };

                    using var client = new HttpClient();
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", openRouterKey);
                    client.DefaultRequestHeaders.Add("X-Title", "Almulhim Travel Bot");
                    client.DefaultRequestHeaders.Add("HTTP-Referer", "https://almulhimtravel.com");
                    var jsonContent = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
                    var res = await client.PostAsync("https://openrouter.ai/api/v1/chat/completions", jsonContent);
                    if (res.IsSuccessStatusCode)
                    {
                        var resStr = await res.Content.ReadAsStringAsync();
                        using var doc = JsonDocument.Parse(resStr);
                        var text = doc.RootElement
                            .GetProperty("choices")[0]
                            .GetProperty("message")
                            .GetProperty("content")
                            .GetString() ?? string.Empty;

                        Console.WriteLine($"🎤 [OpenRouter Audio Success] Result: '{text.Trim()}'");
                        if (!string.IsNullOrWhiteSpace(text)) return text.Trim();
                    }
                    else
                    {
                        var errStr = await res.Content.ReadAsStringAsync();
                        Console.WriteLine($"⚠️ OpenRouter Audio error: {res.StatusCode} - {errStr}");
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"⚠️ OpenRouter Audio transcription exception: {ex.Message}");
                }
            }

            return string.Empty;
        }
    }
}
