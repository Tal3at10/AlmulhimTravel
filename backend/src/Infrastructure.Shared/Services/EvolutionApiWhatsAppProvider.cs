using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Core.Application.Abstraction.Services;
using Microsoft.Extensions.Configuration;

namespace Infrastructure.Shared.Services
{
    public class EvolutionApiWhatsAppProvider : IWhatsAppProvider
    {
        private readonly HttpClient _httpClient;
        private readonly string _baseUrl;
        private readonly string _apiKey;
        private readonly string _instanceName;

        public EvolutionApiWhatsAppProvider(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _baseUrl = configuration["WhatsAppSettings:EvolutionApiUrl"] ?? string.Empty;
            _apiKey = configuration["WhatsAppSettings:EvolutionApiKey"] ?? string.Empty;
            _instanceName = configuration["WhatsAppSettings:EvolutionInstanceName"] ?? "AlMulhim";

            _httpClient.DefaultRequestHeaders.Add("apikey", _apiKey);
        }

        public Task<string> GetAgentIdAsync()
        {
            return Task.FromResult("Evolution");
        }

        public async Task SendTextMessageAsync(string phoneNumber, string message)
        {
            var url = $"{_baseUrl}/message/sendText/{_instanceName}";
            var requestBody = new
            {
                number = phoneNumber,
                options = new
                {
                    delay = 1200,
                    presence = "composing",
                    linkPreview = false
                },
                textMessage = new
                {
                    text = message
                }
            };

            var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync(url, content);
            
            if (!response.IsSuccessStatusCode)
            {
                Console.WriteLine($"Evolution API Error: {await response.Content.ReadAsStringAsync()}");
            }
        }

        public async Task SendImageMessageAsync(string phoneNumber, string imageUrl, string? caption)
        {
            var url = $"{_baseUrl}/message/sendMedia/{_instanceName}";
            var requestBody = new
            {
                number = phoneNumber,
                options = new
                {
                    delay = 1200,
                    presence = "composing"
                },
                mediaMessage = new
                {
                    mediatype = "image",
                    caption = caption ?? "",
                    media = imageUrl
                }
            };

            var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync(url, content);
            
            if (!response.IsSuccessStatusCode)
            {
                Console.WriteLine($"Evolution API Media Error: {await response.Content.ReadAsStringAsync()}");
            }
        }

        public async Task SendDocumentMessageAsync(string phoneNumber, string documentUrl, string? caption)
        {
             var url = $"{_baseUrl}/message/sendMedia/{_instanceName}";
            var requestBody = new
            {
                number = phoneNumber,
                options = new
                {
                    delay = 1200,
                    presence = "composing"
                },
                mediaMessage = new
                {
                    mediatype = "document",
                    caption = caption ?? "",
                    media = documentUrl
                }
            };

            var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync(url, content);
            
            if (!response.IsSuccessStatusCode)
            {
                Console.WriteLine($"Evolution API Document Error: {await response.Content.ReadAsStringAsync()}");
            }
        }

        public Task AssignConversationToGroupAsync(string conversationId, string groupId)
        {
            // Not applicable for Evolution API
            return Task.CompletedTask;
        }

        public Task SendPrivateNoteAsync(string conversationId, string note)
        {
            // Not supported in Evolution API
            return Task.CompletedTask;
        }



        public async Task SendQuickReplyButtonsAsync(string conversationId, string bodyText, List<(string Label, string ReplyText)> buttons)
        {
            await SendTextMessageAsync(conversationId, bodyText);
        }

        public async Task SendListMessageAsync(string conversationId, string bodyText, string buttonLabel, List<(string Label, string ReplyText)> items)
        {
            await SendTextMessageAsync(conversationId, bodyText);
        }
    }
}

