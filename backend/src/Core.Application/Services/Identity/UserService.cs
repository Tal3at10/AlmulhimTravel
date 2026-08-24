using System;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Core.Application.Abstraction.DTOs.Common;
using Core.Application.Abstraction.DTOs.Identity;
using Core.Application.Abstraction.Interfaces;
using Core.Application.Abstraction.Services.Identity;

namespace Core.Application.Services.Identity
{
    public class UserService : IUserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IPasswordHasher _passwordHasher;

        public UserService(IUnitOfWork unitOfWork, IMapper mapper, IPasswordHasher passwordHasher)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _passwordHasher = passwordHasher;
        }

        public async Task<Result<List<UserDto>>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            try
            {
                var users = await _unitOfWork.Users.GetAllAsync(cancellationToken);
                var userDtos = _mapper.Map<List<UserDto>>(users.OrderByDescending(u => u.CreatedAt).ToList());
                return Result<List<UserDto>>.Success(userDtos);
            }
            catch (Exception ex)
            {
                return Result<List<UserDto>>.Failure($"Failed to retrieve users: {ex.Message}");
            }
        }

        public async Task<Result<UserDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            try
            {
                var user = await _unitOfWork.Users.GetByIdAsync(id, cancellationToken);
                if (user == null)
                    return Result<UserDto>.Failure("User not found");

                var userDto = _mapper.Map<UserDto>(user);
                return Result<UserDto>.Success(userDto);
            }
            catch (Exception ex)
            {
                return Result<UserDto>.Failure($"Failed to retrieve user: {ex.Message}");
            }
        }

        public async Task<Result<UserDto>> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
        {
            try
            {
                var user = await _unitOfWork.Users.FindAsync(
                    u => u.Email == email,
                    cancellationToken
                );

                if (user == null)
                    return Result<UserDto>.Failure("User not found");

                var userDto = _mapper.Map<UserDto>(user);
                return Result<UserDto>.Success(userDto);
            }
            catch (Exception ex)
            {
                return Result<UserDto>.Failure($"Failed to retrieve user: {ex.Message}");
            }
        }

        public async Task<Result<UserDto>> UpdateProfileAsync(Guid id, UpdateProfileDto dto, CancellationToken cancellationToken = default)
        {
            try
            {
                var user = await _unitOfWork.Users.GetByIdAsync(id, cancellationToken);
                if (user == null)
                    return Result<UserDto>.Failure("User not found");

                // Update user profile
                var nameParts = dto.FullName.Split(' ', 2);
                user.FirstName = nameParts.Length > 0 ? nameParts[0] : dto.FullName;
                user.LastName = nameParts.Length > 1 ? nameParts[1] : "";
                user.Phone = dto.PhoneNumber;

                _unitOfWork.Users.Update(user);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                var userDto = _mapper.Map<UserDto>(user);
                return Result<UserDto>.Success(userDto);
            }
            catch (Exception ex)
            {
                return Result<UserDto>.Failure($"Failed to update profile: {ex.Message}");
            }
        }

        public async Task<Result> ChangePasswordAsync(Guid id, ChangePasswordDto dto, CancellationToken cancellationToken = default)
        {
            try
            {
                var user = await _unitOfWork.Users.GetByIdAsync(id, cancellationToken);
                if (user == null)
                    return Result.Failure("User not found");

                // Verify current password
                if (!_passwordHasher.VerifyPassword(dto.CurrentPassword, user.PasswordHash))
                    return Result.Failure("Current password is incorrect");

                // Hash and update new password
                user.PasswordHash = _passwordHasher.HashPassword(dto.NewPassword);
                _unitOfWork.Users.Update(user);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                return Result.Success();
            }
            catch (Exception ex)
            {
                return Result.Failure($"Failed to change password: {ex.Message}");
            }
        }

        public async Task<Result> DeactivateAccountAsync(Guid id, CancellationToken cancellationToken = default)
        {
            try
            {
                var user = await _unitOfWork.Users.GetByIdAsync(id, cancellationToken);
                if (user == null)
                    return Result.Failure("User not found");

                user.IsActive = false;
                _unitOfWork.Users.Update(user);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                return Result.Success();
            }
            catch (Exception ex)
            {
                return Result.Failure($"Failed to deactivate account: {ex.Message}");
            }
        }
    }
}
