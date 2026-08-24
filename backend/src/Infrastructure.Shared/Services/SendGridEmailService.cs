using System;
using System.Threading;
using System.Threading.Tasks;
using Core.Application.Abstraction.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace Infrastructure.Shared.Services;

public class SendGridEmailService : IEmailService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<SendGridEmailService> _logger;
    private readonly string _apiKey;
    private readonly string _fromEmail;
    private readonly string _fromName;

    public SendGridEmailService(IConfiguration configuration, ILogger<SendGridEmailService> logger)
    {
        _configuration = configuration;
        _logger = logger;
        
        _apiKey = _configuration["SendGrid:ApiKey"] ?? string.Empty;
        _fromEmail = _configuration["SendGrid:FromEmail"] ?? "no-reply@almulhimtravel.com";
        _fromName = _configuration["SendGrid:FromName"] ?? "Al-Mulhim Travel";
    }

    public async Task<bool> SendEmailAsync(string to, string subject, string htmlContent, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrEmpty(_apiKey))
        {
            _logger.LogWarning("SendGrid API key is not configured. Email will not be sent to {To}", to);
            return false;
        }

        try
        {
            var client = new SendGridClient(_apiKey);
            var from = new EmailAddress(_fromEmail, _fromName);
            var toEmail = new EmailAddress(to);
            var msg = MailHelper.CreateSingleEmail(from, toEmail, subject, string.Empty, htmlContent);
            
            var response = await client.SendEmailAsync(msg, cancellationToken);
            
            if (response.IsSuccessStatusCode)
            {
                _logger.LogInformation("Email sent successfully to {To}", to);
                return true;
            }
            
            var body = await response.Body.ReadAsStringAsync(cancellationToken);
            _logger.LogError("Failed to send email to {To}. Status Code: {StatusCode}. Body: {Body}", to, response.StatusCode, body);
            return false;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception occurred while sending email to {To}", to);
            return false;
        }
    }
}
