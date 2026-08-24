namespace Core.Application.Abstraction.Services.Identity
{
    /// <summary>
    /// Password Hashing Service Interface
    /// Provides secure password hashing and verification
    /// </summary>
    public interface IPasswordHasher
    {
        /// <summary>
        /// Hash a password using SHA256
        /// </summary>
        string HashPassword(string password);

        /// <summary>
        /// Verify a password against its hash
        /// </summary>
        bool VerifyPassword(string password, string passwordHash);
    }
}
