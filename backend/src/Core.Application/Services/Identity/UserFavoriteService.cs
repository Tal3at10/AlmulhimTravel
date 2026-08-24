using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Core.Application.Abstraction.DTOs.Common;
using Core.Application.Abstraction.DTOs.Identity;
using Core.Application.Abstraction.Interfaces;
using Core.Application.Abstraction.Services.Identity;
using Core.Domain.Entities.Identity;
using Core.Domain.Enums;

namespace Core.Application.Services.Identity
{
    public class UserFavoriteService : IUserFavoriteService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public UserFavoriteService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<Result<List<UserFavoriteDto>>> GetUserFavoritesAsync(Guid userId, CancellationToken cancellationToken = default)
        {
            try
            {
                var favorites = await _unitOfWork.UserFavorites.FindAllAsync(
                    f => f.UserId == userId,
                    f => f.Hotel,
                    f => f.Package
                );

                var favoriteDtos = new List<UserFavoriteDto>();

                foreach (var favorite in favorites)
                {
                    var dto = new UserFavoriteDto
                    {
                        Id = favorite.Id,
                        FavoriteType = favorite.Type,
                        AddedAt = favorite.CreatedAt
                    };

                    if (favorite.Type == FavoriteType.Hotel && favorite.Hotel != null)
                    {
                        dto.ItemId = favorite.HotelId ?? Guid.Empty;
                        dto.ItemName = favorite.Hotel.Name;
                        dto.ItemImageUrl = favorite.Hotel.MainImageUrl ?? "";
                        dto.ItemPrice = null; // Hotel prices vary by room and rate plan
                    }
                    else if (favorite.Type == FavoriteType.Package && favorite.Package != null)
                    {
                        dto.ItemId = favorite.PackageId ?? Guid.Empty;
                        dto.ItemName = favorite.Package.TitleEn;
                        dto.ItemImageUrl = favorite.Package.VideoUrl ?? "";
                        dto.ItemPrice = favorite.Package.Price;
                    }

                    favoriteDtos.Add(dto);
                }

                return Result<List<UserFavoriteDto>>.Success(favoriteDtos.OrderByDescending(f => f.AddedAt).ToList());
            }
            catch (Exception ex)
            {
                return Result<List<UserFavoriteDto>>.Failure($"Failed to retrieve favorites: {ex.Message}");
            }
        }

        public async Task<Result<UserFavoriteDto>> AddFavoriteAsync(Guid userId, AddFavoriteDto dto, CancellationToken cancellationToken = default)
        {
            try
            {
                // Check if already favorited
                var existingFavorite = await _unitOfWork.UserFavorites.FindAsync(
                    f => f.UserId == userId && 
                         f.Type == dto.FavoriteType &&
                         ((dto.FavoriteType == FavoriteType.Hotel && f.HotelId == dto.ItemId) ||
                          (dto.FavoriteType == FavoriteType.Package && f.PackageId == dto.ItemId)),
                    cancellationToken
                );

                if (existingFavorite != null)
                    return Result<UserFavoriteDto>.Failure("Item is already in favorites");

                // Validate item exists
                if (dto.FavoriteType == FavoriteType.Hotel)
                {
                    var hotel = await _unitOfWork.Hotels.GetByIdAsync(dto.ItemId, cancellationToken);
                    if (hotel == null)
                        return Result<UserFavoriteDto>.Failure("Hotel not found");
                }
                else if (dto.FavoriteType == FavoriteType.Package)
                {
                    var package = await _unitOfWork.Packages.GetByIdAsync(dto.ItemId, cancellationToken);
                    if (package == null)
                        return Result<UserFavoriteDto>.Failure("Package not found");
                }

                // Create favorite
                var favorite = new UserFavorite
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    Type = dto.FavoriteType,
                    HotelId = dto.FavoriteType == FavoriteType.Hotel ? dto.ItemId : null,
                    PackageId = dto.FavoriteType == FavoriteType.Package ? dto.ItemId : null,
                    CreatedAt = DateTime.UtcNow
                };

                await _unitOfWork.UserFavorites.AddAsync(favorite, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                // Retrieve with related data
                var createdFavorite = await _unitOfWork.UserFavorites.GetByIdAsync(
                    favorite.Id,
                    f => f.Hotel,
                    f => f.Package
                );

                var favoriteDto = new UserFavoriteDto
                {
                    Id = createdFavorite.Id,
                    FavoriteType = createdFavorite.Type,
                    AddedAt = createdFavorite.CreatedAt
                };

                if (createdFavorite.Type == FavoriteType.Hotel && createdFavorite.Hotel != null)
                {
                    favoriteDto.ItemId = createdFavorite.HotelId ?? Guid.Empty;
                    favoriteDto.ItemName = createdFavorite.Hotel.Name;
                    favoriteDto.ItemImageUrl = createdFavorite.Hotel.MainImageUrl ?? "";
                    favoriteDto.ItemPrice = null; // Hotel prices vary by room and rate plan
                }
                else if (createdFavorite.Type == FavoriteType.Package && createdFavorite.Package != null)
                {
                    favoriteDto.ItemId = createdFavorite.PackageId ?? Guid.Empty;
                    favoriteDto.ItemName = createdFavorite.Package.TitleEn;
                    favoriteDto.ItemImageUrl = createdFavorite.Package.VideoUrl ?? "";
                    favoriteDto.ItemPrice = createdFavorite.Package.Price;
                }

                return Result<UserFavoriteDto>.Success(favoriteDto);
            }
            catch (Exception ex)
            {
                return Result<UserFavoriteDto>.Failure($"Failed to add favorite: {ex.Message}");
            }
        }

        public async Task<Result> RemoveFavoriteAsync(Guid userId, Guid favoriteId, CancellationToken cancellationToken = default)
        {
            try
            {
                var favorite = await _unitOfWork.UserFavorites.FindAsync(
                    f => f.Id == favoriteId && f.UserId == userId,
                    cancellationToken
                );

                if (favorite == null)
                    return Result.Failure("Favorite not found");

                _unitOfWork.UserFavorites.Delete(favorite);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                return Result.Success();
            }
            catch (Exception ex)
            {
                return Result.Failure($"Failed to remove favorite: {ex.Message}");
            }
        }

        public async Task<Result<bool>> IsFavoriteAsync(Guid userId, Guid itemId, CancellationToken cancellationToken = default)
        {
            try
            {
                var exists = await _unitOfWork.UserFavorites.ExistsAsync(
                    f => f.UserId == userId && 
                         ((f.HotelId == itemId) || (f.PackageId == itemId)),
                    cancellationToken
                );

                return Result<bool>.Success(exists);
            }
            catch (Exception ex)
            {
                return Result<bool>.Failure($"Failed to check favorite status: {ex.Message}");
            }
        }
    }
}
