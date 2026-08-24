using System;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.Extensions.Caching.Distributed;
using Core.Application.Abstraction.DTOs.Common;
using Core.Application.Abstraction.DTOs.Identity;
using Core.Application.Abstraction.Interfaces;
using Core.Application.Abstraction.Services.Identity;
using Core.Domain.Entities.Identity;
using Core.Domain.Exceptions;

namespace Core.Application.Services.Identity
{
    public class AuthService : IAuthService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IJwtTokenService _jwtTokenService;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IDistributedCache _cache;

        public AuthService(
            IUnitOfWork unitOfWork, 
            IMapper mapper,
            IJwtTokenService jwtTokenService,
            IPasswordHasher passwordHasher,
            IDistributedCache cache)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _jwtTokenService = jwtTokenService;
            _passwordHasher = passwordHasher;
            _cache = cache;
        }

        public async Task<Result<AuthResponseDto>> RegisterAsync(RegisterDto dto, CancellationToken cancellationToken = default)
        {
            try
            {
                // Check if email already exists
                var existingUser = await _unitOfWork.Users.FindAsync(
                    u => u.Email == dto.Email,
                    cancellationToken
                );

                if (existingUser != null)
                    throw new DuplicateEntityException("User", "Email", dto.Email);

                // Hash password
                var passwordHash = _passwordHasher.HashPassword(dto.Password);

                // Create user
                var user = new User
                {
                    Id = Guid.NewGuid(),
                    FirstName = dto.FullName.Split(' ').FirstOrDefault() ?? dto.FullName,
                    LastName = dto.FullName.Split(' ').Skip(1).FirstOrDefault() ?? "",
                    Email = dto.Email,
                    PasswordHash = passwordHash,
                    Phone = dto.PhoneNumber,
                    CountryCode = "+966",
                    CreatedAt = DateTime.UtcNow,
                    IsActive = true
                };

                await _unitOfWork.Users.AddAsync(user, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                // Generate JWT token
                var token = _jwtTokenService.GenerateAccessToken(user);
                var expiresAt = DateTime.UtcNow.AddDays(7);

                var userDto = _mapper.Map<UserDto>(user);

                var refreshToken = _jwtTokenService.GenerateRefreshToken();
                user.RefreshToken = refreshToken;
                user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(30);
                _unitOfWork.Users.Update(user);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                return Result<AuthResponseDto>.Success(new AuthResponseDto
                {
                    Token = token,
                    RefreshToken = refreshToken,
                    User = userDto,
                    ExpiresAt = expiresAt
                }, "Registration successful");
            }
            catch (DuplicateEntityException)
            {
                throw;
            }
            catch (Exception ex)
            {
                return Result<AuthResponseDto>.Failure($"Registration failed: {ex.Message}");
            }
        }

        public async Task<Result<AuthResponseDto>> LoginAsync(LoginDto dto, CancellationToken cancellationToken = default)
        {
            try
            {
                // Find user by email
                var user = await _unitOfWork.Users.FindAsync(
                    u => u.Email == dto.Email,
                    cancellationToken
                );

                if (user == null)
                    throw new EntityNotFoundException("Invalid email or password");

                // Verify password
                if (!_passwordHasher.VerifyPassword(dto.Password, user.PasswordHash))
                    throw new BusinessRuleViolationException("Invalid email or password");

                // Check if account is active
                if (!user.IsActive)
                    throw new BusinessRuleViolationException("Account is deactivated. Please contact support.");

                // Update last login
                user.LastLoginAt = DateTime.UtcNow;
                _unitOfWork.Users.Update(user);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                // Generate JWT token
                var token = _jwtTokenService.GenerateAccessToken(user);
                var expiresAt = DateTime.UtcNow.AddDays(7);

                var userDto = _mapper.Map<UserDto>(user);

                var refreshToken = _jwtTokenService.GenerateRefreshToken();
                user.RefreshToken = refreshToken;
                user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(30);
                _unitOfWork.Users.Update(user);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                return Result<AuthResponseDto>.Success(new AuthResponseDto
                {
                    Token = token,
                    RefreshToken = refreshToken,
                    User = userDto,
                    ExpiresAt = expiresAt
                }, "Login successful");
            }
            catch (EntityNotFoundException)
            {
                throw;
            }
            catch (BusinessRuleViolationException)
            {
                throw;
            }
            catch (Exception ex)
            {
                return Result<AuthResponseDto>.Failure($"Login failed: {ex.Message}");
            }
        }

        public async Task<Result<AuthResponseDto>> AdminLoginAsync(LoginDto dto, CancellationToken cancellationToken = default)
        {
            try
            {
                // Find user by email
                var user = await _unitOfWork.Users.FindAsync(
                    u => u.Email == dto.Email,
                    cancellationToken
                );

                if (user == null)
                    throw new EntityNotFoundException("بيانات الدخول غير صحيحة");

                // Verify password
                if (!_passwordHasher.VerifyPassword(dto.Password, user.PasswordHash))
                    throw new BusinessRuleViolationException("بيانات الدخول غير صحيحة");

                // Check if user is Admin
                if (user.Role != "Admin")
                    throw new BusinessRuleViolationException("غير مصرح لك بالدخول إلى لوحة التحكم");

                // Check if account is active
                if (!user.IsActive)
                    throw new BusinessRuleViolationException("الحساب معطل. يرجى التواصل مع الدعم الفني.");

                // Update last login
                user.LastLoginAt = DateTime.UtcNow;
                _unitOfWork.Users.Update(user);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                // Generate JWT token
                var token = _jwtTokenService.GenerateAccessToken(user);
                var expiresAt = DateTime.UtcNow.AddDays(7);

                var userDto = _mapper.Map<UserDto>(user);

                var refreshToken = _jwtTokenService.GenerateRefreshToken();
                user.RefreshToken = refreshToken;
                user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(30);
                _unitOfWork.Users.Update(user);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                return Result<AuthResponseDto>.Success(new AuthResponseDto
                {
                    Token = token,
                    RefreshToken = refreshToken,
                    User = userDto,
                    ExpiresAt = expiresAt
                }, "تم تسجيل الدخول بنجاح");
            }
            catch (EntityNotFoundException)
            {
                throw;
            }
            catch (BusinessRuleViolationException)
            {
                throw;
            }
            catch (Exception ex)
            {
                return Result<AuthResponseDto>.Failure($"فشل تسجيل الدخول: {ex.Message}");
            }
        }

        public async Task<Result<AuthResponseDto>> RefreshTokenAsync(RefreshTokenDto dto, CancellationToken cancellationToken = default)
        {
            try
            {
                var principal = _jwtTokenService.ValidateToken(dto.AccessToken);
                if (principal == null)
                    throw new BusinessRuleViolationException("Invalid access token");

                var userIdStr = principal.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                if (!Guid.TryParse(userIdStr, out var userId))
                    throw new BusinessRuleViolationException("Invalid token claims");

                var user = await _unitOfWork.Users.GetByIdAsync(userId, cancellationToken);
                if (user == null || user.RefreshToken != dto.RefreshToken || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
                    throw new BusinessRuleViolationException("Invalid or expired refresh token");

                var newAccessToken = _jwtTokenService.GenerateAccessToken(user);
                var newRefreshToken = _jwtTokenService.GenerateRefreshToken();

                user.RefreshToken = newRefreshToken;
                user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(30);
                _unitOfWork.Users.Update(user);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                return Result<AuthResponseDto>.Success(new AuthResponseDto
                {
                    Token = newAccessToken,
                    RefreshToken = newRefreshToken,
                    User = _mapper.Map<UserDto>(user),
                    ExpiresAt = DateTime.UtcNow.AddDays(7)
                }, "Token refreshed successfully");
            }
            catch (Exception ex)
            {
                return Result<AuthResponseDto>.Failure($"Token refresh failed: {ex.Message}");
            }
        }

        public async Task<Result> LogoutAsync(Guid userId, CancellationToken cancellationToken = default)
        {
            try
            {
                var user = await _unitOfWork.Users.GetByIdAsync(userId, cancellationToken);
                if (user == null)
                    throw new EntityNotFoundException("User", userId);

                return Result.Success("Logged out successfully");
            }
            catch (EntityNotFoundException)
            {
                throw;
            }
            catch (Exception ex)
            {
                return Result.Failure($"Logout failed: {ex.Message}");
            }
        }

        public async Task<Result> ChangePasswordAndRevokeAllSessionsAsync(Guid userId, ChangePasswordDto dto, CancellationToken cancellationToken = default)
        {
            try
            {
                var user = await _unitOfWork.Users.GetByIdAsync(userId, cancellationToken);
                if (user == null)
                    throw new EntityNotFoundException("User", userId);

                if (!_passwordHasher.VerifyPassword(dto.CurrentPassword, user.PasswordHash))
                    throw new BusinessRuleViolationException("كلمة المرور الحالية غير صحيحة");

                // Update password and rotate SecurityStamp to invalidate ALL existing tokens
                user.PasswordHash = _passwordHasher.HashPassword(dto.NewPassword);
                user.SecurityStamp = Guid.NewGuid().ToString();

                _unitOfWork.Users.Update(user);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                return Result.Success("تم تغيير كلمة المرور وتسجيل الخروج من جميع الأجهزة");
            }
            catch (EntityNotFoundException) { throw; }
            catch (BusinessRuleViolationException) { throw; }
            catch (Exception ex)
            {
                return Result.Failure($"فشل تغيير كلمة المرور: {ex.Message}");
            }
        }

        public async Task<Result<string>> GeneratePasswordResetTokenAsync(string email, CancellationToken cancellationToken = default)
        {
            try
            {
                var user = await _unitOfWork.Users.FindAsync(
                    u => u.Email == email,
                    cancellationToken
                );

                if (user == null)
                    throw new EntityNotFoundException("User with this email not found");

                // Generate secure reset token
                var rawToken = Convert.ToHexString(RandomNumberGenerator.GetBytes(32));
                var tokenHash = Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(rawToken)));

                // Store this token hash with expiration (15 minutes) in Cache
                var cacheOptions = new DistributedCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(15)
                };
                
                // Key format: ResetPassword_Email
                await _cache.SetStringAsync($"ResetPassword_{email.ToLower()}", tokenHash, cacheOptions, cancellationToken);

                return Result<string>.Success(rawToken, "تم إنشاء رابط إعادة التعيين بنجاح. صالح لمدة 15 دقيقة.");
            }
            catch (EntityNotFoundException)
            {
                throw;
            }
            catch (Exception ex)
            {
                return Result<string>.Failure($"Failed to generate reset token: {ex.Message}");
            }
        }

        public async Task<Result> ResetPasswordAsync(ResetPasswordDto dto, CancellationToken cancellationToken = default)
        {
            try
            {
                var user = await _unitOfWork.Users.FindAsync(
                    u => u.Email == dto.Email,
                    cancellationToken
                );

                if (user == null)
                    throw new EntityNotFoundException("User not found");

                // Verify the reset token:
                var storedTokenHash = await _cache.GetStringAsync($"ResetPassword_{dto.Email.ToLower()}", cancellationToken);
                if (string.IsNullOrEmpty(storedTokenHash))
                {
                    throw new BusinessRuleViolationException("الرابط غير صالح أو انتهت صلاحيته.");
                }

                // Verify the token hash
                var inputTokenHash = Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(dto.Token)));
                if (storedTokenHash != inputTokenHash)
                {
                    throw new BusinessRuleViolationException("رمز التحقق غير صحيح.");
                }

                // Hash new password and invalidate all previous sessions
                user.PasswordHash = _passwordHasher.HashPassword(dto.NewPassword);
                user.SecurityStamp = Guid.NewGuid().ToString();

                _unitOfWork.Users.Update(user);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                // Remove the token from cache so it cannot be reused
                _cache.Remove($"ResetPassword_{dto.Email.ToLower()}");

                return Result.Success("تم تغيير كلمة المرور بنجاح.");
            }
            catch (EntityNotFoundException)
            {
                throw;
            }
            catch (BusinessRuleViolationException)
            {
                throw;
            }
            catch (Exception ex)
            {
                return Result.Failure($"Password reset failed: {ex.Message}");
            }
        }
    }
}
