# Data Transfer Objects (DTOs)

This folder contains all DTOs organized by domain modules following Clean Architecture principles.

## 📁 Module Structure

### 1. **Common** (3 files)
Base classes and patterns used across all modules:
- `PagedQuery.cs` - Base class for pagination queries (PageNumber, PageSize, SortBy, SortDescending)
- `Result.cs` - Result pattern for Success/Failure responses (generic and non-generic)
- `PaginatedResult.cs` - Wrapper for paginated data with metadata (TotalCount, TotalPages, HasNext/PreviousPage)

### 2. **Catalog** (3 files)
Travel packages and destinations:
- `PackageDto.cs` - PackageCardDto, PackageDetailDto, PackageItineraryDto, PackageHotelDto, PackageSearchQuery
- `DestinationDto.cs` - DestinationDto, DestinationListDto
- `CustomerVideoDto.cs` - Customer testimonial videos

### 3. **Accommodation** (5 files)
Hotels, rooms, and amenities:
- `HotelDto.cs` - HotelCardDto, HotelDetailDto, HotelSearchQuery, HotelImageDto, HotelBadgeDto, HotelHighlightDto
- `CityDto.cs` - CityDto, CityListDto
- `RoomDto.cs` - RoomCardDto, RoomDetailDto, RoomFeatureDto
- `RatePlanDto.cs` - Room pricing and availability
- `AmenityDto.cs` - Hotel amenities (WiFi, Pool, Gym, etc.)

### 4. **Aviation** (4 files)
Flights, airlines, and seats:
- `FlightDto.cs` - FlightCardDto, FlightDetailDto, FlightSearchQuery, FlightScheduleDto
- `AirlineDto.cs` - Airline information
- `AirportDto.cs` - Airport information
- `SeatDto.cs` - SeatDto, SeatMapDto, SeatRowDto

### 5. **Reservations** (5 files)
Bookings and payments:
- `BookingDto.cs` - BookingListDto, BookingDetailDto, CreateBookingDto, BookingSearchQuery
- `HotelBookingDto.cs` - HotelBookingDto, CreateHotelBookingDto
- `FlightBookingDto.cs` - FlightBookingDto, CreateFlightBookingDto, FlightPassengerDto, CreateFlightPassengerDto
- `PackageBookingDto.cs` - PackageBookingDto, CreatePackageBookingDto
- `PaymentDto.cs` - PaymentDto, CreatePaymentDto, PaymentResultDto

### 6. **Identity** (2 files)
User authentication and favorites:
- `UserDto.cs` - UserDto, RegisterDto, LoginDto, LoginResultDto, ChangePasswordDto, UpdateProfileDto
- `UserFavoriteDto.cs` - UserFavoriteDto, AddFavoriteDto

### 7. **Content** (5 files)
Website content management:
- `HeroSlideDto.cs` - Homepage hero slider
- `TestimonialDto.cs` - Customer testimonials
- `PartnerDto.cs` - Partner logos
- `BoardMemberDto.cs` - Company board members
- `CompanySettingDto.cs` - Company information and settings

## 📊 DTO Statistics

- **Total Files**: 27 files
- **Total Modules**: 7 modules
- **DTO Types**:
  - List/Card DTOs: For displaying items in lists/grids
  - Detail DTOs: For displaying full item details
  - Create DTOs: For creating new items
  - Update DTOs: For updating existing items
  - Search/Query DTOs: For filtering and pagination
  - Result DTOs: For operation results

## 🎯 Naming Conventions

- **CardDto**: Lightweight DTO for list/grid views (e.g., `HotelCardDto`, `PackageCardDto`)
- **DetailDto**: Complete DTO with all related data (e.g., `HotelDetailDto`, `PackageDetailDto`)
- **ListDto**: Simple DTO for dropdown lists (e.g., `DestinationListDto`, `CityListDto`)
- **CreateDto**: DTO for creating new entities (e.g., `CreateBookingDto`, `CreatePaymentDto`)
- **UpdateDto**: DTO for updating entities (e.g., `UpdateProfileDto`, `UpdateCompanySettingDto`)
- **SearchQuery**: DTO for search/filter parameters (e.g., `HotelSearchQuery`, `FlightSearchQuery`)
- **ResultDto**: DTO for operation results (e.g., `LoginResultDto`, `PaymentResultDto`)

## 🔄 Common Patterns

### 1. Result Pattern
```csharp
var result = Result<UserDto>.Success(userDto, "Login successful");
var error = Result<UserDto>.Failure("Invalid credentials");
```

### 2. Pagination Pattern
```csharp
public class HotelSearchQuery : PagedQuery
{
    public Guid? CityId { get; set; }
    public DateTime? CheckInDate { get; set; }
    // ... other filters
}

var result = new PaginatedResult<HotelCardDto>(items, totalCount, pageNumber, pageSize);
```

### 3. Card vs Detail Pattern
- **Card**: Used in search results, lists, grids (minimal data)
- **Detail**: Used in detail pages (complete data with relationships)

## 🚀 Next Steps

1. ✅ DTOs Created
2. ⏳ Create Repository Interfaces
3. ⏳ Implement Repositories
4. ⏳ Create Service Interfaces
5. ⏳ Implement Services
6. ⏳ Create API Controllers
7. ⏳ Add Validation Attributes
8. ⏳ Add AutoMapper Profiles

## 📝 Notes

- All DTOs use `Guid` for IDs (matching entity design)
- All DTOs have proper default values (empty strings, empty lists)
- Search queries inherit from `PagedQuery` for consistent pagination
- Result pattern provides consistent error handling
- DTOs are organized by domain module for better maintainability
