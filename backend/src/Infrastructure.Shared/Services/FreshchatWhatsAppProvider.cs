using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Core.Application.Abstraction.Services;
using Microsoft.Extensions.Configuration;

namespace Infrastructure.Shared.Services
{
    public class FreshchatWhatsAppProvider : IWhatsAppProvider
    {
        private readonly HttpClient _httpClient;
        private readonly string _baseUrl;
        private readonly string _apiKey;
        private readonly string? _botAgentName;
        private string? _agentId; // Cached agent ID fetched from Freshchat API

        public FreshchatWhatsAppProvider(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            var domain = configuration["WhatsAppSettings:FreshchatDomain"] ?? string.Empty;
            _baseUrl = $"https://{domain}";
            _apiKey = configuration["WhatsAppSettings:FreshchatApiKey"] ?? string.Empty;
            _botAgentName = configuration["WhatsAppSettings:BotAgentName"];

            _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_apiKey}");
            _httpClient.DefaultRequestHeaders.Add("Accept", "application/json");
        }

        /// <summary>
        /// Fetches the first active agent ID from Freshchat to use as actor_id when sending messages.
        /// This is required by Freshchat API - messages sent with an invalid actor_id return 400.
        /// </summary>
        public async Task<string> GetAgentIdAsync()
        {
            if (!string.IsNullOrEmpty(_agentId))
                return _agentId;

            try
            {
                var response = await _httpClient.GetAsync($"{_baseUrl}/agents");
                if (response.IsSuccessStatusCode)
                {
                    var json = await response.Content.ReadAsStringAsync();
                    var doc = JsonDocument.Parse(json);
                    var agents = doc.RootElement.GetProperty("agents");
                    
                    string? fallbackAgentId = null;
                    string? fallbackAgentName = null;
                    
                    // Find the agent with the specified name, or fallback to the first active agent
                    foreach (var agent in agents.EnumerateArray())
                    {
                        var isDeactivated = agent.TryGetProperty("is_deactivated", out var deact) && deact.GetBoolean();
                        var isDeleted = agent.TryGetProperty("is_deleted", out var del) && del.GetBoolean();
                        if (!isDeactivated && !isDeleted)
                        {
                            var firstName = agent.GetProperty("first_name").GetString() ?? string.Empty;
                            var lastName = agent.TryGetProperty("last_name", out var ln) ? ln.GetString() : string.Empty;
                            var fullName = $"{firstName} {lastName}".Trim();

                            if (!string.IsNullOrEmpty(_botAgentName) && 
                                (string.Equals(firstName, _botAgentName, StringComparison.OrdinalIgnoreCase) || 
                                 string.Equals(fullName, _botAgentName, StringComparison.OrdinalIgnoreCase)))
                            {
                                _agentId = agent.GetProperty("id").GetString();
                                Console.WriteLine($"Freshchat: Using configured agent '{firstName}' (ID: {_agentId})");
                                return _agentId!;
                            }

                            if (fallbackAgentId == null)
                            {
                                fallbackAgentId = agent.GetProperty("id").GetString();
                                fallbackAgentName = firstName;
                            }
                        }
                    }

                    if (fallbackAgentId != null)
                    {
                        _agentId = fallbackAgentId;
                        Console.WriteLine($"Freshchat: Using fallback agent '{fallbackAgentName}' (ID: {_agentId})");
                        return _agentId!;
                    }
                }
                
                Console.WriteLine($"Freshchat: Could not fetch agents, falling back to JWT sub");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Freshchat: Error fetching agents: {ex.Message}");
            }

            // Fallback: extract from JWT token
            var payloadBase64 = _apiKey.Split('.')[1];
            payloadBase64 = payloadBase64.PadRight(payloadBase64.Length + (4 - payloadBase64.Length % 4) % 4, '=');
            var payloadJson = Encoding.UTF8.GetString(Convert.FromBase64String(payloadBase64));
            var payloadDoc = JsonDocument.Parse(payloadJson);
            _agentId = payloadDoc.RootElement.GetProperty("sub").GetString();
            return _agentId!;
        }

        public async Task SendTextMessageAsync(string conversationId, string message)
        {
            var url = $"{_baseUrl}/conversations/{conversationId}/messages";
            var agentId = await GetAgentIdAsync();

            var body = new
            {
                message_parts = new[]
                {
                    new { text = new { content = message } }
                },
                message_type = "normal",
                actor_type = "bot"
            };

            var content = new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync(url, content);
            
            if (!response.IsSuccessStatusCode)
            {
                var err = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"Freshchat API Error ({response.StatusCode}): {err}");
                throw new Exception($"Freshchat API Error ({response.StatusCode}): {err}");
            }
            else
            {
                Console.WriteLine($"Freshchat: Message sent successfully to conversation {conversationId}");
            }
        }

        public async Task SendImageMessageAsync(string conversationId, string imageUrl, string? caption)
        {
            var url = $"{_baseUrl}/conversations/{conversationId}/messages";
            var agentId = await GetAgentIdAsync();

            var body = new
            {
                message_parts = new object[]
                {
                    new { image = new { url = imageUrl } },
                    new { text = new { content = caption ?? "" } }
                },
                message_type = "normal",
                actor_type = "agent",
                actor_id = agentId
            };

            var content = new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync(url, content);
            
            if (!response.IsSuccessStatusCode)
            {
                var err = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"Freshchat API Media Error ({response.StatusCode}): {err}");
                throw new Exception($"Freshchat API Media Error ({response.StatusCode}): {err}");
            }
        }

        public async Task SendDocumentMessageAsync(string conversationId, string documentUrl, string? caption)
        {
            await SendImageMessageAsync(conversationId, documentUrl, caption);
        }

        public async Task AssignConversationToGroupAsync(string conversationId, string groupId)
        {
            var url = $"{_baseUrl}/conversations/{conversationId}";
            var body = new
            {
                assigned_group_id = groupId,
                status = "new"
            };

            var content = new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json");
            var request = new HttpRequestMessage(HttpMethod.Put, url) { Content = content };
            
            var response = await _httpClient.SendAsync(request);
            
            if (!response.IsSuccessStatusCode)
            {
                var err = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"Freshchat API Assign Group Error ({response.StatusCode}): {err}");
            }
            else
            {
                Console.WriteLine($"Freshchat API: Conversation {conversationId} assigned to group {groupId}");
            }
        }

        public async Task SendPrivateNoteAsync(string conversationId, string note)
        {
            var url = $"{_baseUrl}/conversations/{conversationId}/messages";
            var actorId = await GetAgentIdAsync();
            
            var payload = new
            {
                actor_type = "agent",
                actor_id = actorId,
                message_type = "private",
                message_parts = new[]
                {
                    new { text = new { content = note } }
                }
            };

            var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
            var request = new HttpRequestMessage(HttpMethod.Post, url) { Content = content };

            var response = await _httpClient.SendAsync(request);

            if (!response.IsSuccessStatusCode)
            {
                var err = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"Freshchat API SendPrivateNote Error ({response.StatusCode}): {err}");
            }
        }


        public async Task SendQuickReplyButtonsAsync(string conversationId, string bodyText, List<(string Label, string ReplyText)> buttons)
        {
            if (buttons.Count > 3)
            {
                Console.WriteLine($"⚠️ WhatsApp Quick Reply: Max 3 buttons allowed, got {buttons.Count}. Falling back to text.");
                await SendTextMessageAsync(conversationId, bodyText);
                return;
            }

            var url = $"{_baseUrl}/conversations/{conversationId}/messages";
            var agentId = await GetAgentIdAsync();

            var subParts = new List<object>();
            for (int i = 0; i < buttons.Count; i++)
            {
                subParts.Add(new
                {
                    quick_reply_button = new
                    {
                        label = buttons[i].Label,
                        custom_reply_text = buttons[i].ReplyText
                    }
                });
            }

            var body = new
            {
                message_parts = new object[]
                {
                    new { text = new { content = bodyText } }
                },
                reply_parts = new object[]
                {
                    new
                    {
                        collection = new { sub_parts = subParts }
                    }
                },
                message_type = "normal",
                actor_type = "bot"
            };

            var content = new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync(url, content);

            if (!response.IsSuccessStatusCode)
            {
                var err = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"Freshchat Quick Reply Error ({response.StatusCode}): {err}. Falling back to text.");
                // Fallback to plain text
                await SendTextMessageAsync(conversationId, bodyText);
            }
            else
            {
                Console.WriteLine($"Freshchat: Quick Reply buttons sent to {conversationId}");
            }
        }

        public async Task SendListMessageAsync(string conversationId, string bodyText, string buttonLabel, List<(string Label, string ReplyText)> items)
        {
            if (items.Count > 10)
            {
                Console.WriteLine($"⚠️ WhatsApp List Message: Max 10 items allowed, got {items.Count}. Falling back to text.");
                await SendTextMessageAsync(conversationId, bodyText);
                return;
            }

            var url = $"{_baseUrl}/conversations/{conversationId}/messages";
            var agentId = await GetAgentIdAsync();

            // Build dropdown sections
            var sectionParts = new List<object>();
            foreach (var item in items)
            {
                sectionParts.Add(new
                {
                    quick_reply_button = new
                    {
                        label = item.Label,
                        custom_reply_text = item.ReplyText
                    }
                });
            }

            var body = new
            {
                message_parts = new object[]
                {
                    new { text = new { content = bodyText } }
                },
                reply_parts = new object[]
                {
                    new
                    {
                        template_content = new
                        {
                            type = "quick_reply_dropdown",
                            sections = new object[]
                            {
                                new
                                {
                                    name = buttonLabel,
                                    parts = sectionParts
                                }
                            }
                        }
                    }
                },
                message_type = "normal",
                actor_type = "bot"
            };

            var content = new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync(url, content);

            if (!response.IsSuccessStatusCode)
            {
                var err = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"Freshchat List Message Error ({response.StatusCode}): {err}. Falling back to text.");
                // Fallback to plain text
                await SendTextMessageAsync(conversationId, bodyText);
            }
            else
            {
                Console.WriteLine($"Freshchat: List message sent to {conversationId}");
            }
        }
    }
}
