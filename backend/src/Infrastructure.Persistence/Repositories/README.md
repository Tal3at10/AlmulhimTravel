# Repository Pattern Implementation

This folder contains the implementation of the **Generic Repository Pattern** and **Unit of Work Pattern** following Clean Architecture principles.

## 📁 Structure

```
Repositories/
├── GenericRepository.cs    - Generic repository implementation
└── UnitOfWork.cs           - Unit of Work implementation
```

## 🎯 Design Patterns Used

### 1. Generic Repository Pattern

The Generic Repository provides a standard set of CRUD operations for all entities without code duplication.

**Interface**: `IGenericRepository<T>` (in `Core.Application.Abstraction/Interfaces/`)

**Implementation**: `GenericRepository<T>`

**Benefits**:
- ✅ Eliminates code duplication
- ✅ Provides consistent API across all entities
- ✅ Easy to test and mock
- ✅ Supports eager loading with includes
- ✅ Built-in pagination support

### 2. Unit of Work Pattern

The Unit of Work pattern maintains a list of objects affected by a business transaction and coordinates the writing out of changes.

**Interface**: `IUnitOfWork` (in `Core.Application.Abstraction/Interfaces/`)

**Implementation**: `UnitOfWork`

**Benefits**:
- ✅ Single point of transaction management
- ✅ Ensures data consistency
- ✅ Reduces database round trips
- ✅ Lazy initialization of repositories
- ✅ Automatic transaction rollback on errors

---

## 📚 Available Operations

### Get Operations
```csharp
// Get by ID
var entity = await repository.GetByIdAsync(id);

// Get by ID with includes
var entity = await repository.GetByIdAsync(id, 
    x => x.RelatedEntity1, 
    x => x.RelatedEntity2);

// Get all
var entities = await repository.GetAllAsync();

// Get all with includes
var entities = await repository.GetAllAsync(
    x => x.RelatedEntity);
```

### Find Operations
```csharp
// Find single entity
var entity = await repository.FindAsync(x => x.Name == "Test");

// Find single with includes
var entity = await repository.FindAsync(
    x => x.Name == "Test",
    x => x.RelatedEntity);

// Find multiple
var entities = await repository.FindAllAsync(x => x.IsActive);

// Find multiple with includes
var entities = await repository.FindAllAsync(
    x => x.IsActive,
    x => x.RelatedEntity);
```

### Pagination
```csharp
var (items, totalCount) = await repository.GetPagedAsync(
    pageNumber: 1,
    pageSize: 20,
    predicate: x => x.IsActive,
    orderBy: q => q.OrderBy(x => x.Name),
    includes: x => x.RelatedEntity);
```

### Count Operations
```csharp
// Count all
var count = await repository.CountAsync();

// Count with filter
var count = await repository.CountAsync(x => x.IsActive);
```

### Exists Operations
```csharp
// Check by ID
var exists = await repository.ExistsAsync(id);

// Check with predicate
var exists = await repository.ExistsAsync(x => x.Email == "test@test.com");
```

### Add Operations
```csharp
// Add single
var entity = await repository.AddAsync(newEntity);
await unitOfWork.SaveChangesAsync();

// Add multiple
await repository.AddRangeAsync(entities);
await unitOfWork.SaveChangesAsync();
```

### Update Operations
```csharp
// Update single
repository.Update(entity);
await unitOfWork.SaveChangesAsync();

// Update multiple
repository.UpdateRange(entities);
await unitOfWork.SaveChangesAsync();
```

### Delete Operations
```csharp
// Delete entity
repository.Delete(entity);
await unitOfWork.SaveChangesAsync();

// Delete by ID
await repository.DeleteByIdAsync(id);
await unitOfWork.SaveChangesAsync();

// Delete multiple
repository.DeleteRange(entities);
await unitOfWork.SaveChangesAsync();
```

### Query Operations
```csharp
// Get queryable for complex queries
var query = repository.Query()
    .Where(x => x.IsActive)
    .OrderBy(x => x.Name)
    .Select(x => new { x.Id, x.Name });

var result = await query.ToListAsync();
```

---

## 🔧 Usage Examples

### Example 1: Simple CRUD Operations

```csharp
public class PackageService
{
    private readonly IUnitOfWork _unitOfWork;

    public PackageService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Package?> GetPackageByIdAsync(Guid id)
    {
        return await _unitOfWork.Packages.GetByIdAsync(id,
            p => p.Destination,
            p => p.Itineraries,
            p => p.PackageHotels);
    }

    public async Task<IEnumerable<Package>> GetActivePackagesAsync()
    {
        return await _unitOfWork.Packages.FindAllAsync(
            p => p.IsActive,
            p => p.Destination);
    }

    public async Task<Package> CreatePackageAsync(Package package)
    {
        await _unitOfWork.Packages.AddAsync(package);
        await _unitOfWork.SaveChangesAsync();
        return package;
    }

    public async Task UpdatePackageAsync(Package package)
    {
        _unitOfWork.Packages.Update(package);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task DeletePackageAsync(Guid id)
    {
        await _unitOfWork.Packages.DeleteByIdAsync(id);
        await _unitOfWork.SaveChangesAsync();
    }
}
```

### Example 2: Pagination

```csharp
public async Task<PaginatedResult<PackageCardDto>> SearchPackagesAsync(
    PackageSearchQuery query)
{
    // Build predicate
    Expression<Func<Package, bool>> predicate = p => p.IsActive;
    
    if (!string.IsNullOrEmpty(query.DestinationSlug))
    {
        predicate = predicate.And(p => p.Destination.Slug == query.DestinationSlug);
    }
    
    if (query.IsOffer.HasValue)
    {
        predicate = predicate.And(p => p.IsOffer == query.IsOffer.Value);
    }

    // Build ordering
    Func<IQueryable<Package>, IOrderedQueryable<Package>> orderBy = null;
    
    if (query.SortBy == "price")
    {
        orderBy = q => query.SortDescending 
            ? q.OrderByDescending(p => p.Price)
            : q.OrderBy(p => p.Price);
    }

    // Get paged data
    var (items, totalCount) = await _unitOfWork.Packages.GetPagedAsync(
        query.PageNumber,
        query.PageSize,
        predicate,
        orderBy,
        p => p.Destination);

    // Map to DTOs
    var dtos = items.Select(p => MapToCardDto(p)).ToList();

    return new PaginatedResult<PackageCardDto>(
        dtos, 
        totalCount, 
        query.PageNumber, 
        query.PageSize);
}
```

### Example 3: Transaction Management

```csharp
public async Task<Booking> CreateBookingWithPaymentAsync(
    CreateBookingDto dto, 
    CreatePaymentDto paymentDto)
{
    try
    {
        // Begin transaction
        await _unitOfWork.BeginTransactionAsync();

        // Create booking
        var booking = MapToEntity(dto);
        await _unitOfWork.Bookings.AddAsync(booking);
        await _unitOfWork.SaveChangesAsync();

        // Create payment
        var payment = new Payment
        {
            BookingId = booking.Id,
            Amount = paymentDto.Amount,
            PaymentMethod = paymentDto.PaymentMethod,
            Status = PaymentStatus.Pending
        };
        await _unitOfWork.Payments.AddAsync(payment);
        await _unitOfWork.SaveChangesAsync();

        // Process payment (external service)
        var paymentResult = await _paymentService.ProcessPaymentAsync(payment);
        
        if (!paymentResult.IsSuccess)
        {
            // Rollback on payment failure
            await _unitOfWork.RollbackTransactionAsync();
            throw new Exception("Payment failed");
        }

        // Update payment status
        payment.Status = PaymentStatus.Completed;
        payment.TransactionId = paymentResult.TransactionId;
        _unitOfWork.Payments.Update(payment);

        // Update booking status
        booking.Status = BookingStatus.Confirmed;
        _unitOfWork.Bookings.Update(booking);

        // Commit transaction
        await _unitOfWork.CommitTransactionAsync();

        return booking;
    }
    catch
    {
        await _unitOfWork.RollbackTransactionAsync();
        throw;
    }
}
```

### Example 4: Complex Queries

```csharp
public async Task<IEnumerable<HotelCardDto>> SearchHotelsAsync(
    HotelSearchQuery query)
{
    // Start with base query
    var queryable = _unitOfWork.Hotels.Query()
        .Include(h => h.City)
        .Include(h => h.Images)
        .Include(h => h.Amenities)
        .ThenInclude(ha => ha.Amenity)
        .Where(h => h.IsActive);

    // Apply filters
    if (query.CityId.HasValue)
    {
        queryable = queryable.Where(h => h.CityId == query.CityId.Value);
    }

    if (query.MinStars.HasValue)
    {
        queryable = queryable.Where(h => h.Stars >= query.MinStars.Value);
    }

    if (query.MinRating.HasValue)
    {
        queryable = queryable.Where(h => h.Rating >= query.MinRating.Value);
    }

    if (query.AmenityIds != null && query.AmenityIds.Any())
    {
        queryable = queryable.Where(h => 
            h.Amenities.Any(ha => query.AmenityIds.Contains(ha.AmenityId)));
    }

    // Apply ordering
    queryable = query.SortBy switch
    {
        "price" => queryable.OrderBy(h => h.StartingPrice),
        "rating" => queryable.OrderByDescending(h => h.Rating),
        "stars" => queryable.OrderByDescending(h => h.Stars),
        _ => queryable.OrderBy(h => h.Name)
    };

    // Apply pagination
    var hotels = await queryable
        .Skip((query.PageNumber - 1) * query.PageSize)
        .Take(query.PageSize)
        .ToListAsync();

    // Map to DTOs
    return hotels.Select(h => MapToCardDto(h));
}
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      APIs Layer                              │
│                    (Controllers)                             │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                 Application Layer                            │
│                    (Services)                                │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│          Application.Abstraction Layer                       │
│         (IUnitOfWork, IGenericRepository)                    │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│           Infrastructure.Persistence Layer                   │
│         (UnitOfWork, GenericRepository)                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    Database                                  │
│                 (SQL Server)                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Available Repositories

All 34 entities have repositories accessible through `IUnitOfWork`:

### Identity Module
- `Users`
- `UserFavorites`

### Catalog Module
- `Destinations`
- `Packages`
- `PackageItineraries`
- `PackageFeatures`
- `PackageHotels`
- `CustomerVideos`

### Accommodation Module
- `Cities`
- `Hotels`
- `Rooms`
- `RatePlans`
- `HotelImages`
- `Amenities`
- `HotelAmenities`
- `HotelBadges`
- `HotelHighlights`
- `RoomFeatures`

### Aviation Module
- `Airlines`
- `Airports`
- `Flights`
- `FlightSchedules`
- `Seats`

### Reservations Module
- `Bookings`
- `HotelBookings`
- `FlightBookings`
- `FlightPassengers`
- `PackageBookings`
- `Payments`

### Content Module
- `HeroSlides`
- `Testimonials`
- `Partners`
- `BoardMembers`
- `CompanySettings`

---

## ✅ Best Practices

1. **Always use IUnitOfWork in services** - Never use repositories directly
2. **Call SaveChangesAsync after modifications** - Changes are not persisted until you call this
3. **Use transactions for multi-step operations** - Ensures data consistency
4. **Use includes for eager loading** - Avoid N+1 query problems
5. **Use Query() for complex queries** - When generic methods are not enough
6. **Dispose properly** - IUnitOfWork implements IDisposable

---

## 🚀 Next Steps

1. ✅ Generic Repository Pattern - Completed
2. ✅ Unit of Work Pattern - Completed
3. ⏳ Service Layer - Create business logic services
4. ⏳ AutoMapper - Map entities to DTOs
5. ⏳ API Controllers - Expose endpoints
6. ⏳ Validation - Add FluentValidation
7. ⏳ Authentication & Authorization - Add JWT

---

## 📝 Notes

- All repositories use `Guid` as the primary key type
- Repositories are lazily initialized in UnitOfWork
- Transaction support is built-in
- CancellationToken support for async operations
- Thread-safe implementation
