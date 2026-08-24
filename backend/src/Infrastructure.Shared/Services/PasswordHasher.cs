using System.Security.Cryptography;
using System.Text;
using Core.Application.Abstraction.Services.Identity;

namespace Infrastructure.Shared.Services
{
    /// <summary>
    /// Password Hashing Service Implementation
    /// Uses SHA256 for password hashing
    /// NOTE: In production, consider using BCrypt, Argon2, or PBKDF2 for better security
    /// </summary>
    public class PasswordHasher : IPasswordHasher
    {
        public string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(hashedBytes);
        }

        public bool VerifyPassword(string password, string passwordHash)
        {
            var hashedInput = HashPassword(password);
            return hashedInput == passwordHash;
        }
    }
}
