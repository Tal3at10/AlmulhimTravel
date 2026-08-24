using System.Threading;
using System.Threading.Tasks;

namespace Core.Application.Abstraction.Services;

public interface IEmailService
{
    Task<bool> SendEmailAsync(string to, string subject, string htmlContent, CancellationToken cancellationToken = default);
}
