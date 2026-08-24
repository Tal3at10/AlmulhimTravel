IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
GO

CREATE TABLE [Airlines] (
    [Id] uniqueidentifier NOT NULL,
    [Code] nvarchar(10) NOT NULL,
    [NameAr] nvarchar(200) NOT NULL,
    [NameEn] nvarchar(200) NOT NULL,
    [LogoUrl] nvarchar(500) NOT NULL,
    [IsActive] bit NOT NULL DEFAULT CAST(1 AS bit),
    CONSTRAINT [PK_Airlines] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [Airports] (
    [Id] uniqueidentifier NOT NULL,
    [Code] nvarchar(10) NOT NULL,
    [NameAr] nvarchar(300) NOT NULL,
    [NameEn] nvarchar(300) NOT NULL,
    [CityAr] nvarchar(200) NOT NULL,
    [CityEn] nvarchar(200) NOT NULL,
    [Country] nvarchar(100) NOT NULL,
    [IsActive] bit NOT NULL DEFAULT CAST(1 AS bit),
    CONSTRAINT [PK_Airports] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [Amenities] (
    [Id] uniqueidentifier NOT NULL,
    [Name] nvarchar(100) NOT NULL,
    [Icon] nvarchar(50) NOT NULL,
    CONSTRAINT [PK_Amenities] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [BoardMembers] (
    [Id] uniqueidentifier NOT NULL,
    [Name] nvarchar(200) NOT NULL,
    [Title] nvarchar(200) NOT NULL,
    [ImageUrl] nvarchar(500) NOT NULL,
    [SortOrder] int NOT NULL DEFAULT 0,
    [IsChairman] bit NOT NULL DEFAULT CAST(0 AS bit),
    [IsCEO] bit NOT NULL DEFAULT CAST(0 AS bit),
    CONSTRAINT [PK_BoardMembers] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [Cities] (
    [Id] uniqueidentifier NOT NULL,
    [NameAr] nvarchar(200) NOT NULL,
    [NameEn] nvarchar(200) NOT NULL,
    [Country] nvarchar(100) NOT NULL,
    CONSTRAINT [PK_Cities] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [CompanySettings] (
    [Id] uniqueidentifier NOT NULL,
    [Key] nvarchar(100) NOT NULL,
    [Value] nvarchar(max) NOT NULL,
    [ValueEn] nvarchar(max) NOT NULL,
    CONSTRAINT [PK_CompanySettings] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [Destinations] (
    [Id] uniqueidentifier NOT NULL,
    [NameAr] nvarchar(200) NOT NULL,
    [NameEn] nvarchar(200) NOT NULL,
    [Slug] nvarchar(100) NOT NULL,
    [Country] nvarchar(100) NOT NULL,
    [ImageUrl] nvarchar(500) NOT NULL,
    [Description] nvarchar(2000) NOT NULL,
    [IsActive] bit NOT NULL DEFAULT CAST(1 AS bit),
    [SortOrder] int NOT NULL DEFAULT 0,
    CONSTRAINT [PK_Destinations] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [HeroSlides] (
    [Id] uniqueidentifier NOT NULL,
    [ImageUrl] nvarchar(500) NOT NULL,
    [TitleAr] nvarchar(300) NOT NULL,
    [TitleEn] nvarchar(300) NOT NULL,
    [SortOrder] int NOT NULL DEFAULT 0,
    [IsActive] bit NOT NULL DEFAULT CAST(1 AS bit),
    CONSTRAINT [PK_HeroSlides] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [Partners] (
    [Id] uniqueidentifier NOT NULL,
    [Name] nvarchar(200) NOT NULL,
    [LogoUrl] nvarchar(500) NOT NULL,
    [WebsiteUrl] nvarchar(500) NOT NULL,
    [SortOrder] int NOT NULL DEFAULT 0,
    [IsActive] bit NOT NULL DEFAULT CAST(1 AS bit),
    CONSTRAINT [PK_Partners] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [Testimonials] (
    [Id] uniqueidentifier NOT NULL,
    [Name] nvarchar(200) NOT NULL,
    [ImageUrl] nvarchar(500) NOT NULL,
    [Text] nvarchar(1000) NOT NULL,
    [Rating] int NOT NULL,
    [Destination] nvarchar(200) NOT NULL,
    [IsActive] bit NOT NULL DEFAULT CAST(1 AS bit),
    [SortOrder] int NOT NULL DEFAULT 0,
    CONSTRAINT [PK_Testimonials] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [Users] (
    [Id] uniqueidentifier NOT NULL,
    [FirstName] nvarchar(100) NOT NULL,
    [LastName] nvarchar(100) NOT NULL,
    [Email] nvarchar(255) NOT NULL,
    [PasswordHash] nvarchar(500) NOT NULL,
    [Phone] nvarchar(20) NOT NULL,
    [CountryCode] nvarchar(10) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [LastLoginAt] datetime2 NULL,
    [IsActive] bit NOT NULL DEFAULT CAST(1 AS bit),
    CONSTRAINT [PK_Users] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [Flights] (
    [Id] uniqueidentifier NOT NULL,
    [FlightNumber] nvarchar(20) NOT NULL,
    [AirlineId] uniqueidentifier NOT NULL,
    [DepartureAirportId] uniqueidentifier NOT NULL,
    [ArrivalAirportId] uniqueidentifier NOT NULL,
    [DepartureTime] time NOT NULL,
    [ArrivalTime] time NOT NULL,
    [Duration] nvarchar(50) NOT NULL,
    [DurationMinutes] int NOT NULL,
    [Stops] int NOT NULL,
    [StopCity] nvarchar(100) NOT NULL,
    [EconomyPrice] decimal(18,2) NOT NULL,
    [EconomyOriginalPrice] decimal(18,2) NULL,
    [BusinessPrice] decimal(18,2) NOT NULL,
    [BusinessOriginalPrice] decimal(18,2) NULL,
    [IsActive] bit NOT NULL DEFAULT CAST(1 AS bit),
    CONSTRAINT [PK_Flights] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Flights_Airlines_AirlineId] FOREIGN KEY ([AirlineId]) REFERENCES [Airlines] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_Flights_Airports_ArrivalAirportId] FOREIGN KEY ([ArrivalAirportId]) REFERENCES [Airports] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_Flights_Airports_DepartureAirportId] FOREIGN KEY ([DepartureAirportId]) REFERENCES [Airports] ([Id]) ON DELETE NO ACTION
);
GO

CREATE TABLE [Hotels] (
    [Id] uniqueidentifier NOT NULL,
    [HotelId] nvarchar(100) NOT NULL,
    [Name] nvarchar(300) NOT NULL,
    [NameEn] nvarchar(300) NOT NULL,
    [Stars] int NOT NULL,
    [Rating] decimal(3,2) NOT NULL,
    [ReviewCount] int NOT NULL DEFAULT 0,
    [RatingText] nvarchar(50) NOT NULL,
    [Address] nvarchar(500) NOT NULL,
    [Location] nvarchar(200) NOT NULL,
    [Distance] nvarchar(100) NOT NULL,
    [CityId] uniqueidentifier NULL,
    [Description] nvarchar(3000) NOT NULL,
    [MainImageUrl] nvarchar(500) NOT NULL,
    [DayImageUrl] nvarchar(500) NOT NULL,
    [NightImageUrl] nvarchar(500) NOT NULL,
    [Latitude] decimal(10,8) NULL,
    [Longitude] decimal(11,8) NULL,
    [IsActive] bit NOT NULL DEFAULT CAST(1 AS bit),
    CONSTRAINT [PK_Hotels] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Hotels_Cities_CityId] FOREIGN KEY ([CityId]) REFERENCES [Cities] ([Id]) ON DELETE SET NULL
);
GO

CREATE TABLE [CustomerVideos] (
    [Id] uniqueidentifier NOT NULL,
    [DestinationId] uniqueidentifier NOT NULL,
    [ThumbnailUrl] nvarchar(500) NOT NULL,
    [VideoUrl] nvarchar(500) NOT NULL,
    [CustomerName] nvarchar(200) NOT NULL,
    [Location] nvarchar(200) NOT NULL,
    [Date] nvarchar(50) NOT NULL,
    [IsActive] bit NOT NULL DEFAULT CAST(1 AS bit),
    [SortOrder] int NOT NULL DEFAULT 0,
    CONSTRAINT [PK_CustomerVideos] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_CustomerVideos_Destinations_DestinationId] FOREIGN KEY ([DestinationId]) REFERENCES [Destinations] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [Packages] (
    [Id] uniqueidentifier NOT NULL,
    [PackageId] nvarchar(100) NOT NULL,
    [DestinationId] uniqueidentifier NOT NULL,
    [TitleAr] nvarchar(300) NOT NULL,
    [TitleEn] nvarchar(300) NOT NULL,
    [Subtitle] nvarchar(500) NOT NULL,
    [Price] decimal(18,2) NOT NULL,
    [Currency] nvarchar(10) NOT NULL,
    [Duration] nvarchar(100) NOT NULL,
    [DurationDays] int NOT NULL,
    [DurationNights] int NOT NULL,
    [VideoUrl] nvarchar(500) NOT NULL,
    [Vibe] nvarchar(50) NOT NULL,
    [Rating] decimal(3,2) NOT NULL,
    [IsOffer] bit NOT NULL DEFAULT CAST(0 AS bit),
    [IsActive] bit NOT NULL DEFAULT CAST(1 AS bit),
    [CreatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_Packages] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Packages_Destinations_DestinationId] FOREIGN KEY ([DestinationId]) REFERENCES [Destinations] ([Id]) ON DELETE NO ACTION
);
GO

CREATE TABLE [Bookings] (
    [Id] uniqueidentifier NOT NULL,
    [ReferenceNumber] nvarchar(50) NOT NULL,
    [UserId] uniqueidentifier NULL,
    [Type] int NOT NULL,
    [Status] int NOT NULL,
    [TotalAmount] decimal(18,2) NOT NULL,
    [TaxAmount] decimal(18,2) NOT NULL,
    [ServiceFee] decimal(18,2) NOT NULL,
    [Currency] nvarchar(10) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [ConfirmedAt] datetime2 NULL,
    [CancelledAt] datetime2 NULL,
    [GuestFirstName] nvarchar(100) NOT NULL,
    [GuestLastName] nvarchar(100) NOT NULL,
    [GuestEmail] nvarchar(255) NOT NULL,
    [GuestPhone] nvarchar(20) NOT NULL,
    [GuestCountryCode] nvarchar(10) NOT NULL,
    [SpecialRequests] nvarchar(1000) NOT NULL,
    [LateCheckIn] bit NOT NULL DEFAULT CAST(0 AS bit),
    [AirportTransfer] bit NOT NULL DEFAULT CAST(0 AS bit),
    CONSTRAINT [PK_Bookings] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Bookings_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE SET NULL
);
GO

CREATE TABLE [FlightSchedules] (
    [Id] uniqueidentifier NOT NULL,
    [FlightId] uniqueidentifier NOT NULL,
    [Date] datetime2 NOT NULL,
    [EconomySeatsAvailable] int NOT NULL,
    [BusinessSeatsAvailable] int NOT NULL,
    [IsActive] bit NOT NULL DEFAULT CAST(1 AS bit),
    CONSTRAINT [PK_FlightSchedules] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_FlightSchedules_Flights_FlightId] FOREIGN KEY ([FlightId]) REFERENCES [Flights] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [DestinationHotels] (
    [DestinationId] uniqueidentifier NOT NULL,
    [HotelsId] uniqueidentifier NOT NULL,
    CONSTRAINT [PK_DestinationHotels] PRIMARY KEY ([DestinationId], [HotelsId]),
    CONSTRAINT [FK_DestinationHotels_Destinations_DestinationId] FOREIGN KEY ([DestinationId]) REFERENCES [Destinations] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_DestinationHotels_Hotels_HotelsId] FOREIGN KEY ([HotelsId]) REFERENCES [Hotels] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [HotelAmenities] (
    [HotelId] uniqueidentifier NOT NULL,
    [AmenityId] uniqueidentifier NOT NULL,
    CONSTRAINT [PK_HotelAmenities] PRIMARY KEY ([HotelId], [AmenityId]),
    CONSTRAINT [FK_HotelAmenities_Amenities_AmenityId] FOREIGN KEY ([AmenityId]) REFERENCES [Amenities] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_HotelAmenities_Hotels_HotelId] FOREIGN KEY ([HotelId]) REFERENCES [Hotels] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [HotelBadges] (
    [Id] uniqueidentifier NOT NULL,
    [HotelId] uniqueidentifier NOT NULL,
    [Text] nvarchar(100) NOT NULL,
    [Type] nvarchar(50) NOT NULL,
    CONSTRAINT [PK_HotelBadges] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_HotelBadges_Hotels_HotelId] FOREIGN KEY ([HotelId]) REFERENCES [Hotels] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [HotelHighlights] (
    [Id] uniqueidentifier NOT NULL,
    [HotelId] uniqueidentifier NOT NULL,
    [Text] nvarchar(300) NOT NULL,
    CONSTRAINT [PK_HotelHighlights] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_HotelHighlights_Hotels_HotelId] FOREIGN KEY ([HotelId]) REFERENCES [Hotels] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [HotelImages] (
    [Id] uniqueidentifier NOT NULL,
    [HotelId] uniqueidentifier NOT NULL,
    [ImageUrl] nvarchar(500) NOT NULL,
    [SortOrder] int NOT NULL DEFAULT 0,
    CONSTRAINT [PK_HotelImages] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_HotelImages_Hotels_HotelId] FOREIGN KEY ([HotelId]) REFERENCES [Hotels] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [Rooms] (
    [Id] uniqueidentifier NOT NULL,
    [HotelId] uniqueidentifier NOT NULL,
    [Name] nvarchar(200) NOT NULL,
    [NameEn] nvarchar(200) NOT NULL,
    [ImageUrl] nvarchar(500) NOT NULL,
    [MaxGuests] int NOT NULL,
    [BedType] nvarchar(100) NOT NULL,
    [Size] nvarchar(50) NOT NULL,
    [AvailableCount] int NOT NULL DEFAULT 0,
    [IsActive] bit NOT NULL DEFAULT CAST(1 AS bit),
    CONSTRAINT [PK_Rooms] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Rooms_Hotels_HotelId] FOREIGN KEY ([HotelId]) REFERENCES [Hotels] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [PackageFeatures] (
    [Id] uniqueidentifier NOT NULL,
    [PackageId] uniqueidentifier NOT NULL,
    [Text] nvarchar(200) NOT NULL,
    CONSTRAINT [PK_PackageFeatures] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_PackageFeatures_Packages_PackageId] FOREIGN KEY ([PackageId]) REFERENCES [Packages] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [PackageHotels] (
    [PackageId] uniqueidentifier NOT NULL,
    [HotelId] uniqueidentifier NOT NULL,
    [NightsCount] int NOT NULL,
    [SortOrder] int NOT NULL DEFAULT 0,
    CONSTRAINT [PK_PackageHotels] PRIMARY KEY ([PackageId], [HotelId]),
    CONSTRAINT [FK_PackageHotels_Hotels_HotelId] FOREIGN KEY ([HotelId]) REFERENCES [Hotels] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_PackageHotels_Packages_PackageId] FOREIGN KEY ([PackageId]) REFERENCES [Packages] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [PackageItineraries] (
    [Id] uniqueidentifier NOT NULL,
    [PackageId] uniqueidentifier NOT NULL,
    [Day] int NOT NULL,
    [Title] nvarchar(300) NOT NULL,
    [Description] nvarchar(2000) NOT NULL,
    [ImageUrl] nvarchar(500) NOT NULL,
    [Latitude] decimal(10,8) NULL,
    [Longitude] decimal(11,8) NULL,
    CONSTRAINT [PK_PackageItineraries] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_PackageItineraries_Packages_PackageId] FOREIGN KEY ([PackageId]) REFERENCES [Packages] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [UserFavorites] (
    [Id] uniqueidentifier NOT NULL,
    [UserId] uniqueidentifier NOT NULL,
    [Type] int NOT NULL,
    [HotelId] uniqueidentifier NULL,
    [PackageId] uniqueidentifier NULL,
    [CreatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_UserFavorites] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_UserFavorites_Hotels_HotelId] FOREIGN KEY ([HotelId]) REFERENCES [Hotels] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_UserFavorites_Packages_PackageId] FOREIGN KEY ([PackageId]) REFERENCES [Packages] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_UserFavorites_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [PackageBookings] (
    [Id] uniqueidentifier NOT NULL,
    [BookingId] uniqueidentifier NOT NULL,
    [PackageId] uniqueidentifier NOT NULL,
    [StartDate] datetime2 NOT NULL,
    [Adults] int NOT NULL,
    [Children] int NOT NULL DEFAULT 0,
    CONSTRAINT [PK_PackageBookings] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_PackageBookings_Bookings_BookingId] FOREIGN KEY ([BookingId]) REFERENCES [Bookings] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_PackageBookings_Packages_PackageId] FOREIGN KEY ([PackageId]) REFERENCES [Packages] ([Id]) ON DELETE NO ACTION
);
GO

CREATE TABLE [Payments] (
    [Id] uniqueidentifier NOT NULL,
    [BookingId] uniqueidentifier NOT NULL,
    [Method] int NOT NULL,
    [Status] int NOT NULL,
    [Amount] decimal(18,2) NOT NULL,
    [Currency] nvarchar(10) NOT NULL,
    [TransactionId] nvarchar(200) NOT NULL,
    [CardLast4] nvarchar(4) NOT NULL,
    [CardBrand] nvarchar(50) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [PaidAt] datetime2 NULL,
    CONSTRAINT [PK_Payments] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Payments_Bookings_BookingId] FOREIGN KEY ([BookingId]) REFERENCES [Bookings] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [FlightBookings] (
    [Id] uniqueidentifier NOT NULL,
    [BookingId] uniqueidentifier NOT NULL,
    [FlightScheduleId] uniqueidentifier NOT NULL,
    [Class] nvarchar(20) NOT NULL,
    [DepartureDate] datetime2 NOT NULL,
    [ReturnDate] datetime2 NULL,
    CONSTRAINT [PK_FlightBookings] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_FlightBookings_Bookings_BookingId] FOREIGN KEY ([BookingId]) REFERENCES [Bookings] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_FlightBookings_FlightSchedules_FlightScheduleId] FOREIGN KEY ([FlightScheduleId]) REFERENCES [FlightSchedules] ([Id]) ON DELETE NO ACTION
);
GO

CREATE TABLE [Seats] (
    [Id] uniqueidentifier NOT NULL,
    [FlightScheduleId] uniqueidentifier NOT NULL,
    [SeatNumber] nvarchar(10) NOT NULL,
    [Row] int NOT NULL,
    [Column] nvarchar(5) NOT NULL,
    [Class] nvarchar(20) NOT NULL,
    [ExtraPrice] decimal(18,2) NOT NULL DEFAULT 0.0,
    [IsOccupied] bit NOT NULL DEFAULT CAST(0 AS bit),
    [IsWindow] bit NOT NULL DEFAULT CAST(0 AS bit),
    [IsAisle] bit NOT NULL DEFAULT CAST(0 AS bit),
    CONSTRAINT [PK_Seats] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Seats_FlightSchedules_FlightScheduleId] FOREIGN KEY ([FlightScheduleId]) REFERENCES [FlightSchedules] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [HotelBookings] (
    [Id] uniqueidentifier NOT NULL,
    [BookingId] uniqueidentifier NOT NULL,
    [HotelId] uniqueidentifier NOT NULL,
    [RoomId] uniqueidentifier NOT NULL,
    [CheckInDate] datetime2 NOT NULL,
    [CheckOutDate] datetime2 NOT NULL,
    [Nights] int NOT NULL,
    [Guests] int NOT NULL,
    [RoomQuantity] int NOT NULL DEFAULT 1,
    CONSTRAINT [PK_HotelBookings] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_HotelBookings_Bookings_BookingId] FOREIGN KEY ([BookingId]) REFERENCES [Bookings] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_HotelBookings_Hotels_HotelId] FOREIGN KEY ([HotelId]) REFERENCES [Hotels] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_HotelBookings_Rooms_RoomId] FOREIGN KEY ([RoomId]) REFERENCES [Rooms] ([Id]) ON DELETE NO ACTION
);
GO

CREATE TABLE [RatePlans] (
    [Id] uniqueidentifier NOT NULL,
    [RoomId] uniqueidentifier NOT NULL,
    [Name] nvarchar(200) NOT NULL,
    [Price] decimal(18,2) NOT NULL,
    [OriginalPrice] decimal(18,2) NULL,
    [TaxInfo] nvarchar(200) NOT NULL,
    [ValidFrom] datetime2 NOT NULL,
    [ValidTo] datetime2 NOT NULL,
    [IsActive] bit NOT NULL DEFAULT CAST(1 AS bit),
    CONSTRAINT [PK_RatePlans] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_RatePlans_Rooms_RoomId] FOREIGN KEY ([RoomId]) REFERENCES [Rooms] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [RoomFeatures] (
    [Id] uniqueidentifier NOT NULL,
    [RoomId] uniqueidentifier NOT NULL,
    [Text] nvarchar(200) NOT NULL,
    CONSTRAINT [PK_RoomFeatures] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_RoomFeatures_Rooms_RoomId] FOREIGN KEY ([RoomId]) REFERENCES [Rooms] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [FlightPassengers] (
    [Id] uniqueidentifier NOT NULL,
    [FlightBookingId] uniqueidentifier NOT NULL,
    [Title] nvarchar(20) NOT NULL,
    [FirstName] nvarchar(100) NOT NULL,
    [LastName] nvarchar(100) NOT NULL,
    [PassportNumber] nvarchar(50) NOT NULL,
    [Nationality] nvarchar(100) NOT NULL,
    [PassportExpiry] datetime2 NOT NULL,
    [DateOfBirth] datetime2 NOT NULL,
    [SeatNumber] nvarchar(10) NOT NULL,
    CONSTRAINT [PK_FlightPassengers] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_FlightPassengers_FlightBookings_FlightBookingId] FOREIGN KEY ([FlightBookingId]) REFERENCES [FlightBookings] ([Id]) ON DELETE CASCADE
);
GO

CREATE UNIQUE INDEX [IX_Airlines_Code] ON [Airlines] ([Code]);
GO

CREATE INDEX [IX_Airports_CityEn_Country] ON [Airports] ([CityEn], [Country]);
GO

CREATE UNIQUE INDEX [IX_Airports_Code] ON [Airports] ([Code]);
GO

CREATE INDEX [IX_Amenities_Name] ON [Amenities] ([Name]);
GO

CREATE INDEX [IX_BoardMembers_SortOrder] ON [BoardMembers] ([SortOrder]);
GO

CREATE INDEX [IX_Bookings_CreatedAt] ON [Bookings] ([CreatedAt]);
GO

CREATE INDEX [IX_Bookings_GuestEmail] ON [Bookings] ([GuestEmail]);
GO

CREATE UNIQUE INDEX [IX_Bookings_ReferenceNumber] ON [Bookings] ([ReferenceNumber]);
GO

CREATE INDEX [IX_Bookings_Status] ON [Bookings] ([Status]);
GO

CREATE INDEX [IX_Bookings_UserId] ON [Bookings] ([UserId]);
GO

CREATE INDEX [IX_Cities_NameEn_Country] ON [Cities] ([NameEn], [Country]);
GO

CREATE UNIQUE INDEX [IX_CompanySettings_Key] ON [CompanySettings] ([Key]);
GO

CREATE INDEX [IX_CustomerVideos_DestinationId_SortOrder] ON [CustomerVideos] ([DestinationId], [SortOrder]);
GO

CREATE INDEX [IX_DestinationHotels_HotelsId] ON [DestinationHotels] ([HotelsId]);
GO

CREATE UNIQUE INDEX [IX_Destinations_Slug] ON [Destinations] ([Slug]);
GO

CREATE INDEX [IX_Destinations_SortOrder] ON [Destinations] ([SortOrder]);
GO

CREATE UNIQUE INDEX [IX_FlightBookings_BookingId] ON [FlightBookings] ([BookingId]);
GO

CREATE INDEX [IX_FlightBookings_FlightScheduleId] ON [FlightBookings] ([FlightScheduleId]);
GO

CREATE INDEX [IX_FlightPassengers_FlightBookingId] ON [FlightPassengers] ([FlightBookingId]);
GO

CREATE INDEX [IX_Flights_AirlineId] ON [Flights] ([AirlineId]);
GO

CREATE INDEX [IX_Flights_ArrivalAirportId] ON [Flights] ([ArrivalAirportId]);
GO

CREATE INDEX [IX_Flights_DepartureAirportId_ArrivalAirportId] ON [Flights] ([DepartureAirportId], [ArrivalAirportId]);
GO

CREATE INDEX [IX_Flights_EconomyPrice] ON [Flights] ([EconomyPrice]);
GO

CREATE INDEX [IX_Flights_FlightNumber] ON [Flights] ([FlightNumber]);
GO

CREATE INDEX [IX_Flights_Stops] ON [Flights] ([Stops]);
GO

CREATE INDEX [IX_FlightSchedules_FlightId_Date_IsActive] ON [FlightSchedules] ([FlightId], [Date], [IsActive]);
GO

CREATE INDEX [IX_HeroSlides_SortOrder] ON [HeroSlides] ([SortOrder]);
GO

CREATE INDEX [IX_HotelAmenities_AmenityId] ON [HotelAmenities] ([AmenityId]);
GO

CREATE INDEX [IX_HotelBadges_HotelId] ON [HotelBadges] ([HotelId]);
GO

CREATE UNIQUE INDEX [IX_HotelBookings_BookingId] ON [HotelBookings] ([BookingId]);
GO

CREATE INDEX [IX_HotelBookings_HotelId] ON [HotelBookings] ([HotelId]);
GO

CREATE INDEX [IX_HotelBookings_RoomId] ON [HotelBookings] ([RoomId]);
GO

CREATE INDEX [IX_HotelHighlights_HotelId] ON [HotelHighlights] ([HotelId]);
GO

CREATE INDEX [IX_HotelImages_HotelId_SortOrder] ON [HotelImages] ([HotelId], [SortOrder]);
GO

CREATE INDEX [IX_Hotels_CityId] ON [Hotels] ([CityId]);
GO

CREATE UNIQUE INDEX [IX_Hotels_HotelId] ON [Hotels] ([HotelId]);
GO

CREATE INDEX [IX_Hotels_Rating] ON [Hotels] ([Rating]);
GO

CREATE INDEX [IX_Hotels_Stars] ON [Hotels] ([Stars]);
GO

CREATE UNIQUE INDEX [IX_PackageBookings_BookingId] ON [PackageBookings] ([BookingId]);
GO

CREATE INDEX [IX_PackageBookings_PackageId] ON [PackageBookings] ([PackageId]);
GO

CREATE INDEX [IX_PackageFeatures_PackageId] ON [PackageFeatures] ([PackageId]);
GO

CREATE INDEX [IX_PackageHotels_HotelId] ON [PackageHotels] ([HotelId]);
GO

CREATE INDEX [IX_PackageItineraries_PackageId_Day] ON [PackageItineraries] ([PackageId], [Day]);
GO

CREATE INDEX [IX_Packages_DestinationId] ON [Packages] ([DestinationId]);
GO

CREATE INDEX [IX_Packages_IsOffer] ON [Packages] ([IsOffer]);
GO

CREATE UNIQUE INDEX [IX_Packages_PackageId] ON [Packages] ([PackageId]);
GO

CREATE INDEX [IX_Packages_Price] ON [Packages] ([Price]);
GO

CREATE INDEX [IX_Packages_Rating] ON [Packages] ([Rating]);
GO

CREATE INDEX [IX_Partners_SortOrder] ON [Partners] ([SortOrder]);
GO

CREATE UNIQUE INDEX [IX_Payments_BookingId] ON [Payments] ([BookingId]);
GO

CREATE INDEX [IX_Payments_CreatedAt] ON [Payments] ([CreatedAt]);
GO

CREATE INDEX [IX_Payments_Status] ON [Payments] ([Status]);
GO

CREATE UNIQUE INDEX [IX_Payments_TransactionId] ON [Payments] ([TransactionId]);
GO

CREATE INDEX [IX_RatePlans_Price] ON [RatePlans] ([Price]);
GO

CREATE INDEX [IX_RatePlans_RoomId_ValidFrom_ValidTo_IsActive] ON [RatePlans] ([RoomId], [ValidFrom], [ValidTo], [IsActive]);
GO

CREATE INDEX [IX_RoomFeatures_RoomId] ON [RoomFeatures] ([RoomId]);
GO

CREATE INDEX [IX_Rooms_HotelId] ON [Rooms] ([HotelId]);
GO

CREATE UNIQUE INDEX [IX_Seats_FlightScheduleId_SeatNumber] ON [Seats] ([FlightScheduleId], [SeatNumber]);
GO

CREATE INDEX [IX_Testimonials_SortOrder] ON [Testimonials] ([SortOrder]);
GO

CREATE INDEX [IX_UserFavorites_HotelId] ON [UserFavorites] ([HotelId]);
GO

CREATE INDEX [IX_UserFavorites_PackageId] ON [UserFavorites] ([PackageId]);
GO

CREATE INDEX [IX_UserFavorites_UserId_Type_HotelId] ON [UserFavorites] ([UserId], [Type], [HotelId]);
GO

CREATE INDEX [IX_UserFavorites_UserId_Type_PackageId] ON [UserFavorites] ([UserId], [Type], [PackageId]);
GO

CREATE UNIQUE INDEX [IX_Users_Email] ON [Users] ([Email]);
GO

CREATE INDEX [IX_Users_Phone] ON [Users] ([Phone]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260117001558_InitialCreate', N'8.0.11');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

CREATE INDEX [IX_Hotels_CityId_Stars_Rating_IsActive] ON [Hotels] ([CityId], [Stars], [Rating], [IsActive]);
GO

CREATE INDEX [IX_Hotels_IsActive] ON [Hotels] ([IsActive]) WHERE IsActive = 1;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260117050422_AddMissingPerformanceIndexes', N'8.0.11');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [Packages] ADD [ImageUrl] nvarchar(max) NOT NULL DEFAULT N'';
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260215041831_AddImageUrlToPackage', N'8.0.11');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [Users] ADD [Role] nvarchar(20) NOT NULL DEFAULT N'User';
GO

CREATE INDEX [IX_Users_Role] ON [Users] ([Role]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260215055130_AddUserRole', N'8.0.11');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [HeroSlides] ADD [ButtonLink] nvarchar(max) NULL;
GO

ALTER TABLE [HeroSlides] ADD [ButtonText] nvarchar(max) NULL;
GO

ALTER TABLE [HeroSlides] ADD [SubtitleAr] nvarchar(max) NOT NULL DEFAULT N'';
GO

ALTER TABLE [HeroSlides] ADD [SubtitleEn] nvarchar(max) NOT NULL DEFAULT N'';
GO

ALTER TABLE [HeroSlides] ADD [VideoUrl] nvarchar(max) NULL;
GO

ALTER TABLE [BoardMembers] ADD [Bio] nvarchar(max) NULL;
GO

ALTER TABLE [BoardMembers] ADD [IsActive] bit NOT NULL DEFAULT CAST(0 AS bit);
GO

ALTER TABLE [BoardMembers] ADD [NameEn] nvarchar(max) NULL;
GO

ALTER TABLE [BoardMembers] ADD [TitleEn] nvarchar(max) NULL;
GO

ALTER TABLE [BoardMembers] ADD [TwitterHandle] nvarchar(max) NULL;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260217015750_AddHeroSlideNewColumns', N'8.0.11');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [PackageHotels] DROP CONSTRAINT [FK_PackageHotels_Hotels_HotelId];
GO

ALTER TABLE [PackageHotels] DROP CONSTRAINT [PK_PackageHotels];
GO

DECLARE @var0 sysname;
SELECT @var0 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PackageHotels]') AND [c].[name] = N'HotelId');
IF @var0 IS NOT NULL EXEC(N'ALTER TABLE [PackageHotels] DROP CONSTRAINT [' + @var0 + '];');
ALTER TABLE [PackageHotels] ALTER COLUMN [HotelId] uniqueidentifier NULL;
GO

ALTER TABLE [PackageHotels] ADD [Id] uniqueidentifier NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';
GO

ALTER TABLE [PackageHotels] ADD [DayImageUrl] nvarchar(500) NOT NULL DEFAULT N'';
GO

ALTER TABLE [PackageHotels] ADD [Location] nvarchar(200) NOT NULL DEFAULT N'';
GO

ALTER TABLE [PackageHotels] ADD [Name] nvarchar(200) NOT NULL DEFAULT N'';
GO

ALTER TABLE [PackageHotels] ADD [NightImageUrl] nvarchar(500) NOT NULL DEFAULT N'';
GO

ALTER TABLE [PackageHotels] ADD [Stars] int NOT NULL DEFAULT 0;
GO

ALTER TABLE [PackageHotels] ADD CONSTRAINT [PK_PackageHotels] PRIMARY KEY ([Id]);
GO

CREATE INDEX [IX_PackageHotels_PackageId] ON [PackageHotels] ([PackageId]);
GO

ALTER TABLE [PackageHotels] ADD CONSTRAINT [FK_PackageHotels_Hotels_HotelId] FOREIGN KEY ([HotelId]) REFERENCES [Hotels] ([Id]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260217093116_UpdatePackageHotelsToEmbeddedData', N'8.0.11');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

CREATE TABLE [BlogPosts] (
    [Id] uniqueidentifier NOT NULL,
    [Title] nvarchar(max) NOT NULL,
    [Slug] nvarchar(max) NOT NULL,
    [CoverImageUrl] nvarchar(max) NOT NULL,
    [Content] nvarchar(max) NOT NULL,
    [ShortDescription] nvarchar(max) NOT NULL,
    [Tags] nvarchar(max) NOT NULL,
    [MetaTitle] nvarchar(max) NOT NULL,
    [MetaDescription] nvarchar(max) NOT NULL,
    [IsPublished] bit NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_BlogPosts] PRIMARY KEY ([Id])
);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260221073349_AddBlogPosts', N'8.0.11');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [Bookings] ADD [VoucherReference] nvarchar(max) NULL;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260615051524_AddVoucherReferenceToBooking', N'8.0.11');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [Users] ADD [RefreshToken] nvarchar(max) NULL;
GO

ALTER TABLE [Users] ADD [RefreshTokenExpiryTime] datetime2 NULL;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260615194129_AddRefreshTokenToUser', N'8.0.11');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [Payments] ADD [RowVersion] rowversion NOT NULL;
GO

ALTER TABLE [Bookings] ADD [RowVersion] rowversion NOT NULL;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260615221544_AddConcurrencyAndIndexesToReservations', N'8.0.11');
GO

COMMIT;
GO

