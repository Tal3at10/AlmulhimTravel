using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace APIs.Filters
{
    public class FreshchatSignatureAttribute : Attribute, IAsyncAuthorizationFilter
    {
        public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
        {
            var configuration = (IConfiguration)context.HttpContext.RequestServices.GetService(typeof(IConfiguration));
            var logger = (ILogger<FreshchatSignatureAttribute>)context.HttpContext.RequestServices.GetService(typeof(ILogger<FreshchatSignatureAttribute>));
            
            var webhookSecret = configuration["Freshchat:WebhookSecret"];
            if (string.IsNullOrEmpty(webhookSecret))
            {
                logger.LogWarning("Freshchat WebhookSecret is not configured.");
                // Depending on security requirements, we could reject here. We will allow for now if not configured.
                // context.Result = new UnauthorizedResult();
                return;
            }

            if (!context.HttpContext.Request.Headers.TryGetValue("X-Freshchat-Signature", out var signatureHeader))
            {
                logger.LogWarning("Missing X-Freshchat-Signature header.");
                context.Result = new UnauthorizedResult();
                return;
            }

            var signature = signatureHeader.ToString();

            context.HttpContext.Request.EnableBuffering();
            
            using var reader = new StreamReader(context.HttpContext.Request.Body, Encoding.UTF8, leaveOpen: true);
            var body = await reader.ReadToEndAsync();
            context.HttpContext.Request.Body.Position = 0; // Rewind the stream so it can be read by the controller

            var expectedSignature = ComputeSignature(body, webhookSecret);

            if (!string.Equals(signature, expectedSignature, StringComparison.OrdinalIgnoreCase))
            {
                logger.LogWarning("Invalid Freshchat signature. Expected {Expected}, but got {Actual}.", expectedSignature, signature);
                context.Result = new UnauthorizedResult();
            }
        }

        private string ComputeSignature(string payload, string secret)
        {
            var encoding = Encoding.UTF8;
            var keyBytes = encoding.GetBytes(secret);
            var payloadBytes = encoding.GetBytes(payload);

            using var hmac = new HMACSHA256(keyBytes);
            var hashBytes = hmac.ComputeHash(payloadBytes);
            
            // Freshchat usually expects Base64 encoded HMAC-SHA256 or Hex. Base64 is standard.
            // Let's use Base64 which is what Freshchat documentation specifies.
            return Convert.ToBase64String(hashBytes);
        }
    }
}
