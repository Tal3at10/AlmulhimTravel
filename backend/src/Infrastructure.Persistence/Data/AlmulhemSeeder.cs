using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Core.Domain.Entities.Accommodation;
using Core.Domain.Entities.Catalog;
using Core.Domain.Entities.Content;
using Core.Domain.Entities.Identity;
using Core.Domain.Entities.Reservations;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Persistence.Data;

public static class AlmulhemSeeder
{
	private class DynamicDestinationDto
	{
		public string Slug { get; set; } = string.Empty;


		public string NameAr { get; set; } = string.Empty;


		public string NameEn { get; set; } = string.Empty;


		public string Country { get; set; } = string.Empty;


		public string ImageUrl { get; set; } = string.Empty;


		public string Description { get; set; } = string.Empty;


		public List<DynamicPackageDto>? Packages { get; set; }
	}

	private class DynamicPackageDto
	{
		public string PackageId { get; set; } = string.Empty;


		public string TitleAr { get; set; } = string.Empty;


		public string TitleEn { get; set; } = string.Empty;


		public string Subtitle { get; set; } = string.Empty;


		public int DurationDays { get; set; }

		public int DurationNights { get; set; }

		public string Duration { get; set; } = string.Empty;


		public decimal Price { get; set; }

		public string Currency { get; set; } = string.Empty;


		public string ImageUrl { get; set; } = string.Empty;


		public string Vibe { get; set; } = string.Empty;


		public decimal Rating { get; set; }

		public bool IsOffer { get; set; }

		public bool IsActive { get; set; }

		public List<DynamicItineraryDto>? Itineraries { get; set; }

		public List<DynamicHotelDto>? Hotels { get; set; }
	}

	private class DynamicHotelDto
	{
		public string HotelName { get; set; } = string.Empty;


		public int Rating { get; set; }

		public string ImageUrl { get; set; } = string.Empty;

	}

	private class DynamicItineraryDto
	{
		public int Day { get; set; }

		public string Title { get; set; } = string.Empty;


		public string Description { get; set; } = string.Empty;


		public string ImageUrl { get; set; } = string.Empty;

	}

	public static async Task SeedAsync(AlmulhemDbContext context, ILogger logger)
	{
		try
		{
			await SeedAdminUserAsync(context, logger);
			await SeedContentAsync(context, logger);
			await SeedCouponsAsync(context, logger);
			await context.SaveChangesAsync();
			if (await context.Packages.AnyAsync())
			{
				logger.LogInformation("Database already seeded. Skipping package seeding.");
				return;
			}
			logger.LogInformation("Starting database seeding...");
			await SeedDestinationsAsync(context, logger);
			await SeedCitiesAsync(context, logger);
			await SeedHotelsAsync(context, logger);
			await SeedPackagesAsync(context, logger);
			await context.SaveChangesAsync();
			logger.LogInformation("Database seeding completed successfully.");
		}
		catch (Exception ex2)
		{
			Exception ex = ex2;
			logger.LogError(ex, "An error occurred while seeding the database.");
			throw;
		}
	}

	private static async Task SeedCouponsAsync(AlmulhemDbContext context, ILogger logger)
	{
		if (!(await context.Coupons.AnyAsync()))
		{
			List<Coupon> coupons = new List<Coupon>
			{
				new Coupon
				{
					Id = Guid.NewGuid(),
					Code = "ALMATAR",
					DiscountType = "Percentage",
					Value = 10.00m,
					MaxDiscount = 100.00m,
					MinBookingAmount = 300.00m,
					ValidFrom = DateTime.UtcNow.AddDays(-1.0),
					ValidTo = DateTime.UtcNow.AddDays(90.0),
					UsageLimit = 1000,
					UsageCount = 0,
					IsActive = true,
					CreatedAt = DateTime.UtcNow
				},
				new Coupon
				{
					Id = Guid.NewGuid(),
					Code = "ALMULHIM",
					DiscountType = "Flat",
					Value = 50.00m,
					MaxDiscount = null,
					MinBookingAmount = 250.00m,
					ValidFrom = DateTime.UtcNow.AddDays(-1.0),
					ValidTo = DateTime.UtcNow.AddDays(90.0),
					UsageLimit = 1000,
					UsageCount = 0,
					IsActive = true,
					CreatedAt = DateTime.UtcNow
				},
				new Coupon
				{
					Id = Guid.NewGuid(),
					Code = "WELCOME",
					DiscountType = "Percentage",
					Value = 15.00m,
					MaxDiscount = 150.00m,
					MinBookingAmount = 500.00m,
					ValidFrom = DateTime.UtcNow.AddDays(-1.0),
					ValidTo = DateTime.UtcNow.AddDays(90.0),
					UsageLimit = 1000,
					UsageCount = 0,
					IsActive = true,
					CreatedAt = DateTime.UtcNow
				}
			};
			await context.Coupons.AddRangeAsync(coupons);
			logger.LogInformation("Seeded coupons: ALMATAR, ALMULHIM, WELCOME.");
		}
	}

	private static async Task SeedAdminUserAsync(AlmulhemDbContext context, ILogger logger)
	{
		if (await context.Users.AnyAsync((User u) => u.Role == "Admin"))
		{
			logger.LogInformation("Admin user already exists. Skipping admin seeding.");
			return;
		}
		logger.LogInformation("Creating admin user...");
		string password = "Admin@2024";
		using SHA256 sha256 = SHA256.Create();
		byte[] hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
		string passwordHash = Convert.ToBase64String(hashedBytes);
		User adminUser = new User
		{
			Id = Guid.NewGuid(),
			FirstName = "????",
			LastName = "??????",
			Email = "admin@almulhemtravel.com",
			PasswordHash = passwordHash,
			Phone = "0500000000",
			CountryCode = "+966",
			Role = "Admin",
			IsActive = true,
			CreatedAt = DateTime.UtcNow
		};
		await context.Users.AddAsync(adminUser);
		await context.SaveChangesAsync();
		logger.LogInformation("Admin user created successfully. Email: admin@almulhemtravel.com");
	}

	private static async Task SeedContentAsync(AlmulhemDbContext context, ILogger logger)
	{
		logger.LogInformation("Seeding Content (CMS)...");
		await SeedHeroSlidesAsync(context);
		await SeedPartnersAsync(context);
		await SeedTestimonialsAsync(context);
		await SeedBoardMembersAsync(context);
		await SeedCompanySettingsAsync(context);
		await context.SaveChangesAsync();
		logger.LogInformation("Content seeding completed.");
	}

	private static async Task SeedHeroSlidesAsync(AlmulhemDbContext context)
	{
		List<HeroSlide> existingSlides = await context.HeroSlides.ToListAsync();
		if (existingSlides.Any())
		{
			foreach (HeroSlide slide in existingSlides)
			{
				if (string.IsNullOrEmpty(slide.VideoUrl))
				{
					HeroSlide heroSlide = slide;
					string titleAr = slide.TitleAr;
					if (1 == 0)
					{
					}
					string videoUrl = titleAr switch
					{
						"????? ????" => "https://res.cloudinary.com/dlkxftysy/video/upload/q_auto,f_auto,w_1920/v1779236352/13550049_3840_2160_60fps_optimized_cqtcqw.mp4", 
						"????? ????????" => "https://res.cloudinary.com/dlkxftysy/video/upload/q_auto,f_auto,w_1920/v1779236321/13446157_3840_2160_60fps_optimized_qqar8p.mp4", 
						"??? ????????" => "https://res.cloudinary.com/dlkxftysy/video/upload/q_auto,f_auto,w_1920/v1779236303/13874845_3840_2160_30fps_optimized_turylc.mp4", 
						_ => null, 
					};
					if (1 == 0)
					{
					}
					heroSlide.VideoUrl = videoUrl;
				}
				if (string.IsNullOrEmpty(slide.SubtitleAr))
				{
					HeroSlide heroSlide2 = slide;
					string titleAr2 = slide.TitleAr;
					if (1 == 0)
					{
					}
					string videoUrl = titleAr2 switch
					{
						"????? ????" => "?????? ?????? ?? ?\u064f???", 
						"????? ????????" => "????? ???? ??????? ?? ??????", 
						"??? ????????" => "??? ??? ?????", 
						"??????? ?? ?\u064f???" => "?? ????? ????? ?? ?????", 
						"????? ??? ??????" => "????? ????? ?????", 
						_ => "????? ?????? ????", 
					};
					if (1 == 0)
					{
					}
					heroSlide2.SubtitleAr = videoUrl;
				}
				if (string.IsNullOrEmpty(slide.SubtitleEn))
				{
					HeroSlide heroSlide3 = slide;
					string titleEn = slide.TitleEn;
					if (1 == 0)
					{
					}
					string videoUrl = titleEn switch
					{
						"Luxury Resort" => "Enjoy an unforgettable stay", 
						"Tropical Beaches" => "Discover the world's most beautiful beaches", 
						"Maldives Islands" => "Paradise on Earth", 
						"Unforgettable Adventures" => "Live a unique experience", 
						"Travel Around the World" => "Discover new destinations", 
						_ => "Discover the world with us", 
					};
					if (1 == 0)
					{
					}
					heroSlide3.SubtitleEn = videoUrl;
				}
			}
			await context.SaveChangesAsync();
		}
		else
		{
			List<HeroSlide> heroSlides = new List<HeroSlide>
			{
				new HeroSlide
				{
					Id = Guid.NewGuid(),
					ImageUrl = "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1920&q=80",
					TitleAr = "????? ????",
					TitleEn = "Luxury Resort",
					SubtitleAr = "?????? ?????? ?? ?\u064f???",
					SubtitleEn = "Enjoy an unforgettable stay",
					VideoUrl = "https://res.cloudinary.com/dlkxftysy/video/upload/q_auto,f_auto,w_1920/v1779236352/13550049_3840_2160_60fps_optimized_cqtcqw.mp4",
					SortOrder = 1,
					IsActive = true
				},
				new HeroSlide
				{
					Id = Guid.NewGuid(),
					ImageUrl = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80",
					TitleAr = "????? ????????",
					TitleEn = "Tropical Beaches",
					SubtitleAr = "????? ???? ??????? ?? ??????",
					SubtitleEn = "Discover the world's most beautiful beaches",
					VideoUrl = "https://res.cloudinary.com/dlkxftysy/video/upload/q_auto,f_auto,w_1920/v1779236321/13446157_3840_2160_60fps_optimized_qqar8p.mp4",
					SortOrder = 2,
					IsActive = true
				},
				new HeroSlide
				{
					Id = Guid.NewGuid(),
					ImageUrl = "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1920&q=80",
					TitleAr = "??? ????????",
					TitleEn = "Maldives Islands",
					SubtitleAr = "??? ??? ?????",
					SubtitleEn = "Paradise on Earth",
					VideoUrl = "https://res.cloudinary.com/dlkxftysy/video/upload/q_auto,f_auto,w_1920/v1779236303/13874845_3840_2160_30fps_optimized_turylc.mp4",
					SortOrder = 3,
					IsActive = true
				},
				new HeroSlide
				{
					Id = Guid.NewGuid(),
					ImageUrl = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80",
					TitleAr = "??????? ?? ?\u064f???",
					TitleEn = "Unforgettable Adventures",
					SubtitleAr = "?? ????? ????? ?? ?????",
					SubtitleEn = "Live a unique experience",
					SortOrder = 4,
					IsActive = true
				},
				new HeroSlide
				{
					Id = Guid.NewGuid(),
					ImageUrl = "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&q=80",
					TitleAr = "????? ??? ??????",
					TitleEn = "Travel Around the World",
					SubtitleAr = "????? ????? ?????",
					SubtitleEn = "Discover new destinations",
					SortOrder = 5,
					IsActive = true
				}
			};
			await context.HeroSlides.AddRangeAsync(heroSlides);
		}
	}

	private static async Task SeedPartnersAsync(AlmulhemDbContext context)
	{
		if (!(await context.Partners.AnyAsync()))
		{
			List<Partner> partners = new List<Partner>
			{
				new Partner
				{
					Id = Guid.NewGuid(),
					Name = "?????? ????????",
					LogoUrl = "https://www.saudia.com/resources/images/logo.svg",
					WebsiteUrl = "https://www.saudia.com",
					SortOrder = 1,
					IsActive = true
				},
				new Partner
				{
					Id = Guid.NewGuid(),
					Name = "????? ????????",
					LogoUrl = "https://www.emirates.com/content/dam/emirates/images/logo.png",
					WebsiteUrl = "https://www.emirates.com",
					SortOrder = 2,
					IsActive = true
				},
				new Partner
				{
					Id = Guid.NewGuid(),
					Name = "?????? ???????",
					LogoUrl = "https://www.qatarairways.com/content/dam/images/renditions/horizontal/logo.svg",
					WebsiteUrl = "https://www.qatarairways.com",
					SortOrder = 3,
					IsActive = true
				},
				new Partner
				{
					Id = Guid.NewGuid(),
					Name = "??????",
					LogoUrl = "https://www.hilton.com/etc/designs/hilton/clientlibs/resources/img/hilton-logo.svg",
					WebsiteUrl = "https://www.hilton.com",
					SortOrder = 4,
					IsActive = true
				},
				new Partner
				{
					Id = Guid.NewGuid(),
					Name = "??????",
					LogoUrl = "https://cache.marriott.com/content/dam/marriott-digital/marriott-logos/marriott-logo.svg",
					WebsiteUrl = "https://www.marriott.com",
					SortOrder = 5,
					IsActive = true
				},
				new Partner
				{
					Id = Guid.NewGuid(),
					Name = "???? ???????",
					LogoUrl = "https://cache.marriott.com/content/dam/marriott-digital/marriott-logos/ritz-carlton-logo.svg",
					WebsiteUrl = "https://www.ritzcarlton.com",
					SortOrder = 6,
					IsActive = true
				},
				new Partner
				{
					Id = Guid.NewGuid(),
					Name = "??? ??????",
					LogoUrl = "https://www.fourseasons.com/alt/img-opt/~70.1530.0,0000-0,0000-3000,0000-1687,5000/publish/content/dam/fourseasons/images/web/FSH/FSH_logo.png",
					WebsiteUrl = "https://www.fourseasons.com",
					SortOrder = 7,
					IsActive = true
				},
				new Partner
				{
					Id = Guid.NewGuid(),
					Name = "????",
					LogoUrl = "https://www.hyatt.com/hds/brands/hyatt/logo.svg",
					WebsiteUrl = "https://www.hyatt.com",
					SortOrder = 8,
					IsActive = true
				}
			};
			await context.Partners.AddRangeAsync(partners);
		}
	}

	private static async Task SeedTestimonialsAsync(AlmulhemDbContext context)
	{
		if (!(await context.Testimonials.AnyAsync()))
		{
			List<Testimonial> testimonials = new List<Testimonial>
			{
				new Testimonial
				{
					Id = Guid.NewGuid(),
					Name = "???? ????",
					ImageUrl = "https://ui-avatars.com/api/?name=Happy+Customer&background=C9A227&color=fff&size=200",
					Text = "???????? ??? ?????? ???\u064b ?????? ????? ???? ????? ?? ?????",
					Rating = 5,
					Destination = "??????",
					IsActive = true,
					SortOrder = 1
				},
				new Testimonial
				{
					Id = Guid.NewGuid(),
					Name = "????? ?????",
					ImageUrl = "https://ui-avatars.com/api/?name=Satisfied+Client&background=C9A227&color=fff&size=200",
					Text = "?????? ???? ????? ?????? ???? ????? ??????? ??? ??????? ?????",
					Rating = 5,
					Destination = "??????",
					IsActive = true,
					SortOrder = 2
				},
				new Testimonial
				{
					Id = Guid.NewGuid(),
					Name = "????? ????",
					ImageUrl = "https://ui-avatars.com/api/?name=Grateful+Traveler&background=C9A227&color=fff&size=200",
					Text = "????? ????? ????? ??? ?????? ??????? ???????? ???? ??? ??????? ???? ????? ?? ????",
					Rating = 5,
					Destination = "?????",
					IsActive = true,
					SortOrder = 3
				},
				new Testimonial
				{
					Id = Guid.NewGuid(),
					Name = "?. ????? ?? ???????",
					ImageUrl = "https://ui-avatars.com/api/?name=Salman+Abdullah&background=C9A227&color=fff&size=200",
					Text = "?????? ?????? ??? ?? ????? ??? ??????? ????? ???? ???? ???? ??????? ????????",
					Rating = 5,
					Destination = "?????",
					IsActive = true,
					SortOrder = 4
				},
				new Testimonial
				{
					Id = Guid.NewGuid(),
					Name = "????? ?????",
					ImageUrl = "https://ui-avatars.com/api/?name=Happy+Family&background=C9A227&color=fff&size=200",
					Text = "???? ????? ????? ????? ???? ?? ????? ????? ???\u064b ???????? ?? ??????",
					Rating = 5,
					Destination = "?????",
					IsActive = true,
					SortOrder = 5
				},
				new Testimonial
				{
					Id = Guid.NewGuid(),
					Name = "???? ????",
					ImageUrl = "https://ui-avatars.com/api/?name=Satisfied+Customer&background=C9A227&color=fff&size=200",
					Text = "?? ?????? ???? ???????? ???????? ????? ?? ???? ?????? ??????",
					Rating = 5,
					Destination = "??????",
					IsActive = true,
					SortOrder = 6
				},
				new Testimonial
				{
					Id = Guid.NewGuid(),
					Name = "????? ????",
					ImageUrl = "https://ui-avatars.com/api/?name=Happy+Traveler&background=C9A227&color=fff&size=200",
					Text = "???????? ??? ??? ??? ??????? ????????? ???????? ?? ?\u064f??? ????",
					Rating = 5,
					Destination = "???????",
					IsActive = true,
					SortOrder = 7
				},
				new Testimonial
				{
					Id = Guid.NewGuid(),
					Name = "???? ????",
					ImageUrl = "https://ui-avatars.com/api/?name=London+Visitor&background=C9A227&color=fff&size=200",
					Text = "?????? ????? ??????? ???????? ??????? ???? ???? ??????? ?? ??????",
					Rating = 5,
					Destination = "????",
					IsActive = true,
					SortOrder = 8
				},
				new Testimonial
				{
					Id = Guid.NewGuid(),
					Name = "???? ????",
					ImageUrl = "https://ui-avatars.com/api/?name=Regular+Client&background=C9A227&color=fff&size=200",
					Text = "?????? ???? ???? ?? ????? ???? ?????? ??? ??? ???? ??? ?????? ?????",
					Rating = 5,
					Destination = "?????? ??????",
					IsActive = true,
					SortOrder = 9
				},
				new Testimonial
				{
					Id = Guid.NewGuid(),
					Name = "????? ????",
					ImageUrl = "https://ui-avatars.com/api/?name=Thankful+Traveler&background=C9A227&color=fff&size=200",
					Text = "???? ???? ????? ??????? ?? ????? ????? ????? ?????? ???? ?????",
					Rating = 5,
					Destination = "?????? ??????",
					IsActive = true,
					SortOrder = 10
				},
				new Testimonial
				{
					Id = Guid.NewGuid(),
					Name = "????? ?????",
					ImageUrl = "https://ui-avatars.com/api/?name=Satisfied+Family&background=C9A227&color=fff&size=200",
					Text = "????? ???? ???? ???? ???? ?????? ?????? ??????? ?? ??????",
					Rating = 5,
					Destination = "?????? ??????",
					IsActive = true,
					SortOrder = 11
				},
				new Testimonial
				{
					Id = Guid.NewGuid(),
					Name = "???? ??????",
					ImageUrl = "https://ui-avatars.com/api/?name=Thailand+Visitor&background=C9A227&color=fff&size=200",
					Text = "??????? ???? ???? ????? ??????? ????\u064b ?? ?? ????? ????",
					Rating = 5,
					Destination = "??????",
					IsActive = true,
					SortOrder = 12
				}
			};
			await context.Testimonials.AddRangeAsync(testimonials);
		}
	}

	private static async Task SeedBoardMembersAsync(AlmulhemDbContext context)
	{
		List<BoardMember> existingMembers = await context.BoardMembers.ToListAsync();
		if (existingMembers.Any())
		{
			foreach (BoardMember member in existingMembers)
			{
				member.IsActive = true;
			}
			await context.SaveChangesAsync();
			return;
		}
		List<BoardMember> boardMembers = new List<BoardMember>
		{
			new BoardMember
			{
				Id = Guid.NewGuid(),
				Name = "???????/ ????????? ??????",
				Title = "??? ???? ???????",
				ImageUrl = "/snaplytics.io_X_Azizmulhem86_profile_picture.jpg",
				SortOrder = 1,
				IsChairman = false,
				IsCEO = false,
				IsActive = true
			},
			new BoardMember
			{
				Id = Guid.NewGuid(),
				Name = "???????/ ????? ??????",
				Title = "??? ???? ???????",
				ImageUrl = "/snaplytics.io_X_bo_dhem_profile_picture.jpg",
				SortOrder = 2,
				IsChairman = false,
				IsCEO = false,
				IsActive = true
			},
			new BoardMember
			{
				Id = Guid.NewGuid(),
				Name = "???????/ ??? ???? ??????",
				Title = "??? ???? ???????",
				ImageUrl = "/snaplytics.io_X_fahadnasser15_profile_picture.jpg",
				SortOrder = 3,
				IsChairman = false,
				IsCEO = false,
				IsActive = true
			},
			new BoardMember
			{
				Id = Guid.NewGuid(),
				Name = "???????/ ??? ??????",
				Title = "??? ???? ???????",
				ImageUrl = "/snaplytics.io_X_FahadNFM_profile_picture.jpg",
				SortOrder = 4,
				IsChairman = false,
				IsCEO = false,
				IsActive = true
			}
		};
		await context.BoardMembers.AddRangeAsync(boardMembers);
	}

	private static async Task SeedCompanySettingsAsync(AlmulhemDbContext context)
	{
		if (!(await context.CompanySettings.AnyAsync()))
		{
			List<CompanySetting> settings = new List<CompanySetting>
			{
				new CompanySetting
				{
					Id = Guid.NewGuid(),
					Key = "chairman_message",
					Value = "???? ??? ?? ???? ?????? ????? ????????? ??? ???? ?????? ???? ????? ??? ???????? ?????? ??? ??? 1993.",
					ValueEn = "Welcome to Almulhem Travel Platform, where we strive to provide the best travel experience for our valued customers since 1993."
				},
				new CompanySetting
				{
					Id = Guid.NewGuid(),
					Key = "vision",
					Value = "?? ???? ?????? ????? ????????? ?? ??????? ??????? ???????? ???? ??????.",
					ValueEn = "To be the first choice for travelers in the Kingdom of Saudi Arabia and the Gulf countries."
				},
				new CompanySetting
				{
					Id = Guid.NewGuid(),
					Key = "mission",
					Value = "????? ????? ??? ?????? ?????? ???? ?????? ??????? ?? ???? ???????? ??????? ???????????.",
					ValueEn = "Providing distinguished travel and tourism services that exceed our customers' expectations through innovation, quality, and professionalism."
				}
			};
			await context.CompanySettings.AddRangeAsync(settings);
		}
	}

	private static async Task SeedDestinationsAsync(AlmulhemDbContext context, ILogger logger)
	{
		logger.LogInformation("Seeding Destinations...");
		List<Destination> destinations = new List<Destination>
		{
			new Destination
			{
				Id = Guid.NewGuid(),
				NameAr = "???????",
				NameEn = "Malaysia",
				Slug = "malaysia",
				Country = "Malaysia",
				ImageUrl = "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&q=80",
				Description = "???? ???????? ????? ???? ??? ??????? ??????? ???????? ???????",
				IsActive = true,
				SortOrder = 1
			},
			new Destination
			{
				Id = Guid.NewGuid(),
				NameAr = "?????",
				NameEn = "Turkey",
				Slug = "turkey",
				Country = "Turkey",
				ImageUrl = "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80",
				Description = "??? ??????? ???????? ??????? ???????",
				IsActive = true,
				SortOrder = 2
			},
			new Destination
			{
				Id = Guid.NewGuid(),
				NameAr = "???",
				NameEn = "Dubai",
				Slug = "dubai",
				Country = "UAE",
				ImageUrl = "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80",
				Description = "????? ???????? ???????? ????????",
				IsActive = true,
				SortOrder = 3
			},
			new Destination
			{
				Id = Guid.NewGuid(),
				NameAr = "????",
				NameEn = "London",
				Slug = "london",
				Country = "UK",
				ImageUrl = "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
				Description = "????? ?????? ???????? ??????",
				IsActive = true,
				SortOrder = 4
			},
			new Destination
			{
				Id = Guid.NewGuid(),
				NameAr = "??????",
				NameEn = "Georgia",
				Slug = "georgia",
				Country = "Georgia",
				ImageUrl = "https://images.unsplash.com/photo-1585856262797-5e5c0e0e8e0e?w=800&q=80",
				Description = "????? ??????? ???????? ???????",
				IsActive = true,
				SortOrder = 5
			},
			new Destination
			{
				Id = Guid.NewGuid(),
				NameAr = "??????",
				NameEn = "Thailand",
				Slug = "thailand",
				Country = "Thailand",
				ImageUrl = "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80",
				Description = "??? ?????????? ???????? ???????",
				IsActive = true,
				SortOrder = 6
			},
			new Destination
			{
				Id = Guid.NewGuid(),
				NameAr = "??????",
				NameEn = "Vietnam",
				Slug = "vietnam",
				Country = "Vietnam",
				ImageUrl = "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80",
				Description = "???? ?????? ????? ???????? ??????",
				IsActive = true,
				SortOrder = 7
			},
			new Destination
			{
				Id = Guid.NewGuid(),
				NameAr = "?????",
				NameEn = "Moscow",
				Slug = "moscow",
				Country = "Russia",
				ImageUrl = "https://images.unsplash.com/photo-1513326738677-b964603b136d?w=800&q=80",
				Description = "????? ????? ???????? ??????",
				IsActive = true,
				SortOrder = 8
			}
		};
		string jsonPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Extracted", "db_seeder_data.json");
		if (!File.Exists(jsonPath))
		{
			jsonPath = Path.Combine(Directory.GetCurrentDirectory(), "src", "Infrastructure.Persistence", "Data", "Extracted", "db_seeder_data.json");
		}
		if (File.Exists(jsonPath))
		{
			logger.LogInformation("Found dynamic PDF parsed data map: " + jsonPath);
			string jsonData = await File.ReadAllTextAsync(jsonPath);
			try
			{
				List<DynamicDestinationDto> parsedDataList = JsonSerializer.Deserialize<List<DynamicDestinationDto>>(jsonData, new JsonSerializerOptions
				{
					PropertyNameCaseInsensitive = true
				});
				if (parsedDataList != null)
				{
					int orderCounter = destinations.Count + 1;
					foreach (DynamicDestinationDto parsedDest in parsedDataList)
					{
						Destination exists = destinations.FirstOrDefault((Destination x) => x.Slug == parsedDest.Slug);
						if (exists == null)
						{
							destinations.Add(new Destination
							{
								Id = Guid.NewGuid(),
								NameAr = parsedDest.NameAr,
								NameEn = parsedDest.NameEn,
								Slug = parsedDest.Slug,
								Country = parsedDest.Country,
								ImageUrl = parsedDest.ImageUrl,
								Description = parsedDest.Description,
								IsActive = true,
								SortOrder = orderCounter++
							});
						}
					}
				}
			}
			catch (Exception ex2)
			{
				Exception ex = ex2;
				logger.LogError(ex, "Failed to parse Extracted PDF Data JSON map in Destinations");
			}
		}
		else
		{
			logger.LogWarning("PDF Extracted JSON Map file not found at: " + jsonPath);
		}
		await context.Destinations.AddRangeAsync(destinations);
		await context.SaveChangesAsync();
		logger.LogInformation($"Seeded {destinations.Count} destinations.");
	}

	private static async Task SeedCitiesAsync(AlmulhemDbContext context, ILogger logger)
	{
		logger.LogInformation("Seeding Cities...");
		List<City> cities = new List<City>
		{
			new City
			{
				Id = Guid.NewGuid(),
				NameAr = "??????????",
				NameEn = "Kuala Lumpur",
				Country = "Malaysia"
			},
			new City
			{
				Id = Guid.NewGuid(),
				NameAr = "??????",
				NameEn = "Langkawi",
				Country = "Malaysia"
			},
			new City
			{
				Id = Guid.NewGuid(),
				NameAr = "???????",
				NameEn = "Istanbul",
				Country = "Turkey"
			},
			new City
			{
				Id = Guid.NewGuid(),
				NameAr = "???????",
				NameEn = "Antalya",
				Country = "Turkey"
			},
			new City
			{
				Id = Guid.NewGuid(),
				NameAr = "???????",
				NameEn = "Trabzon",
				Country = "Turkey"
			},
			new City
			{
				Id = Guid.NewGuid(),
				NameAr = "???",
				NameEn = "Dubai",
				Country = "UAE"
			},
			new City
			{
				Id = Guid.NewGuid(),
				NameAr = "??????",
				NameEn = "Abu Dhabi",
				Country = "UAE"
			},
			new City
			{
				Id = Guid.NewGuid(),
				NameAr = "????",
				NameEn = "London",
				Country = "UK"
			},
			new City
			{
				Id = Guid.NewGuid(),
				NameAr = "??????",
				NameEn = "Tbilisi",
				Country = "Georgia"
			},
			new City
			{
				Id = Guid.NewGuid(),
				NameAr = "??????",
				NameEn = "Batumi",
				Country = "Georgia"
			},
			new City
			{
				Id = Guid.NewGuid(),
				NameAr = "??????",
				NameEn = "Bangkok",
				Country = "Thailand"
			},
			new City
			{
				Id = Guid.NewGuid(),
				NameAr = "?????",
				NameEn = "Phuket",
				Country = "Thailand"
			},
			new City
			{
				Id = Guid.NewGuid(),
				NameAr = "?????",
				NameEn = "Hanoi",
				Country = "Vietnam"
			},
			new City
			{
				Id = Guid.NewGuid(),
				NameAr = "???? ???",
				NameEn = "Ho Chi Minh",
				Country = "Vietnam"
			},
			new City
			{
				Id = Guid.NewGuid(),
				NameAr = "?????",
				NameEn = "Moscow",
				Country = "Russia"
			},
			new City
			{
				Id = Guid.NewGuid(),
				NameAr = "????",
				NameEn = "Rome",
				Country = "Italy"
			}
		};
		await context.Cities.AddRangeAsync(cities);
		await context.SaveChangesAsync();
		logger.LogInformation($"Seeded {cities.Count} cities.");
	}

	private static async Task SeedPackagesAsync(AlmulhemDbContext context, ILogger logger)
	{
		logger.LogInformation("Seeding Packages...");
		List<Destination> destinations = await context.Destinations.ToListAsync();
		Destination malaysia = destinations.FirstOrDefault((Destination d) => d.Slug == "malaysia");
		Destination turkey = destinations.FirstOrDefault((Destination d) => d.Slug == "turkey");
		Destination dubai = destinations.FirstOrDefault((Destination d) => d.Slug == "dubai");
		Destination london = destinations.FirstOrDefault((Destination d) => d.Slug == "london");
		Destination georgia = destinations.FirstOrDefault((Destination d) => d.Slug == "georgia");
		Destination thailand = destinations.FirstOrDefault((Destination d) => d.Slug == "thailand");
		Destination vietnam = destinations.FirstOrDefault((Destination d) => d.Slug == "vietnam");
		Destination moscow = destinations.FirstOrDefault((Destination d) => d.Slug == "moscow");
		List<Package> packages = new List<Package>();
		if (malaysia != null)
		{
			Package pkg1 = new Package
			{
				Id = Guid.NewGuid(),
				PackageId = "malaysia-luxury-8d",
				DestinationId = malaysia.Id,
				TitleAr = "??????? ???????",
				TitleEn = "Luxury Malaysia",
				Subtitle = "?????? ????? ??????? ?? ?????????? ???????",
				Price = 4500m,
				Currency = "?.?",
				Duration = "8 ???? / 7 ?????",
				DurationDays = 8,
				DurationNights = 7,
				ImageUrl = "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1200&q=80",
				VideoUrl = "https://videos.pexels.com/video-files/3196036/3196036-uhd_2560_1440_25fps.mp4",
				Vibe = "tropical",
				Rating = 4.8m,
				IsOffer = true,
				IsActive = true,
				CreatedAt = DateTime.UtcNow
			};
			packages.Add(pkg1);
			List<PackageItinerary> itinerary1 = new List<PackageItinerary>
			{
				new PackageItinerary
				{
					Id = Guid.NewGuid(),
					PackageId = pkg1.Id,
					Day = 1,
					Title = "?????? ??? ??????????",
					Description = "??????? ?? ?????? ??????? ??????? ???? ??? ?? ???????",
					ImageUrl = "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&q=80"
				},
				new PackageItinerary
				{
					Id = Guid.NewGuid(),
					PackageId = pkg1.Id,
					Day = 2,
					Title = "???? ?? ??????????",
					Description = "????? ???? ???????? ??? ?????? ???? ??????",
					ImageUrl = "https://images.unsplash.com/photo-1508062878650-88b52897f298?w=800&q=80"
				},
				new PackageItinerary
				{
					Id = Guid.NewGuid(),
					PackageId = pkg1.Id,
					Day = 3,
					Title = "????? ???????",
					Description = "???? ??? ????? ??????? ?????????? ???????? ????????",
					ImageUrl = "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80"
				},
				new PackageItinerary
				{
					Id = Guid.NewGuid(),
					PackageId = pkg1.Id,
					Day = 4,
					Title = "???????? ??? ??????",
					Description = "????? ????? ??? ?????? ?????????? ?? ???????",
					ImageUrl = "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80"
				},
				new PackageItinerary
				{
					Id = Guid.NewGuid(),
					PackageId = pkg1.Id,
					Day = 5,
					Title = "???? ?? ??????",
					Description = "????? ????????? ???????? ????? ??????",
					ImageUrl = "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80"
				},
				new PackageItinerary
				{
					Id = Guid.NewGuid(),
					PackageId = pkg1.Id,
					Day = 6,
					Title = "??? ?? ?? ??????",
					Description = "??? ?? ????????? ??????? ????????",
					ImageUrl = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80"
				},
				new PackageItinerary
				{
					Id = Guid.NewGuid(),
					PackageId = pkg1.Id,
					Day = 7,
					Title = "?????? ??? ??????????",
					Description = "????? ????? ??? ??????????? ???? ????? ???",
					ImageUrl = "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&q=80"
				},
				new PackageItinerary
				{
					Id = Guid.NewGuid(),
					PackageId = pkg1.Id,
					Day = 8,
					Title = "????????",
					Description = "?????? ?????? ??????? ?????",
					ImageUrl = "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80"
				}
			};
			await context.PackageItineraries.AddRangeAsync(itinerary1);
			List<PackageFeature> features1 = new List<PackageFeature>
			{
				new PackageFeature
				{
					Id = Guid.NewGuid(),
					PackageId = pkg1.Id,
					Text = "????? ?????"
				},
				new PackageFeature
				{
					Id = Guid.NewGuid(),
					PackageId = pkg1.Id,
					Text = "????? 5 ????"
				},
				new PackageFeature
				{
					Id = Guid.NewGuid(),
					PackageId = pkg1.Id,
					Text = "????? ????"
				},
				new PackageFeature
				{
					Id = Guid.NewGuid(),
					PackageId = pkg1.Id,
					Text = "????? ??????"
				},
				new PackageFeature
				{
					Id = Guid.NewGuid(),
					PackageId = pkg1.Id,
					Text = "???? ?????"
				}
			};
			await context.PackageFeatures.AddRangeAsync(features1);
		}
		if (turkey != null)
		{
			Package pkg2 = new Package
			{
				Id = Guid.NewGuid(),
				PackageId = "turkey-cultural-10d",
				DestinationId = turkey.Id,
				TitleAr = "????? ????????",
				TitleEn = "Cultural Turkey",
				Subtitle = "????? ???? ??????? ???????? ????????",
				Price = 5200m,
				Currency = "?.?",
				Duration = "10 ???? / 9 ?????",
				DurationDays = 10,
				DurationNights = 9,
				ImageUrl = "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&q=80",
				VideoUrl = "https://videos.pexels.com/video-files/4009409/4009409-uhd_2560_1440_30fps.mp4",
				Vibe = "cultural",
				Rating = 4.9m,
				IsOffer = false,
				IsActive = true,
				CreatedAt = DateTime.UtcNow
			};
			packages.Add(pkg2);
			List<PackageItinerary> itinerary2 = new List<PackageItinerary>
			{
				new PackageItinerary
				{
					Id = Guid.NewGuid(),
					PackageId = pkg2.Id,
					Day = 1,
					Title = "?????? ??? ???????",
					Description = "??????? ?? ?????? ??????? ??????",
					ImageUrl = "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80"
				},
				new PackageItinerary
				{
					Id = Guid.NewGuid(),
					PackageId = pkg2.Id,
					Day = 2,
					Title = "???? ?? ??????? ???????",
					Description = "????? ??? ?????? ?????? ??????? ??? ??? ????",
					ImageUrl = "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800&q=80"
				},
				new PackageItinerary
				{
					Id = Guid.NewGuid(),
					PackageId = pkg2.Id,
					Day = 3,
					Title = "???????? ?????? ???????",
					Description = "???? ????? ?? ???????? ?????? ????? ???????",
					ImageUrl = "https://images.unsplash.com/photo-1527838832700-5059252407fa?w=800&q=80"
				},
				new PackageItinerary
				{
					Id = Guid.NewGuid(),
					PackageId = pkg2.Id,
					Day = 4,
					Title = "???????? ??? ???????",
					Description = "????? ????? ??? ???????",
					ImageUrl = "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800&q=80"
				},
				new PackageItinerary
				{
					Id = Guid.NewGuid(),
					PackageId = pkg2.Id,
					Day = 5,
					Title = "???? ?? ???????",
					Description = "????? ??????? ??????? ?????????",
					ImageUrl = "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800&q=80"
				},
				new PackageItinerary
				{
					Id = Guid.NewGuid(),
					PackageId = pkg2.Id,
					Day = 6,
					Title = "??? ?? ?? ???????",
					Description = "??? ?? ????????? ???????",
					ImageUrl = "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800&q=80"
				},
				new PackageItinerary
				{
					Id = Guid.NewGuid(),
					PackageId = pkg2.Id,
					Day = 7,
					Title = "???????? ??? ???????",
					Description = "????? ????? ??? ???????",
					ImageUrl = "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800&q=80"
				},
				new PackageItinerary
				{
					Id = Guid.NewGuid(),
					PackageId = pkg2.Id,
					Day = 8,
					Title = "???? ?? ???????",
					Description = "????? ??? ?????? ?????? ???????",
					ImageUrl = "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800&q=80"
				},
				new PackageItinerary
				{
					Id = Guid.NewGuid(),
					PackageId = pkg2.Id,
					Day = 9,
					Title = "?????? ??? ???????",
					Description = "????? ????? ??? ???????? ???? ??",
					ImageUrl = "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80"
				},
				new PackageItinerary
				{
					Id = Guid.NewGuid(),
					PackageId = pkg2.Id,
					Day = 10,
					Title = "????????",
					Description = "?????? ?????? ??????? ?????",
					ImageUrl = "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80"
				}
			};
			await context.PackageItineraries.AddRangeAsync(itinerary2);
			List<PackageFeature> features2 = new List<PackageFeature>
			{
				new PackageFeature
				{
					Id = Guid.NewGuid(),
					PackageId = pkg2.Id,
					Text = "????? ?????"
				},
				new PackageFeature
				{
					Id = Guid.NewGuid(),
					PackageId = pkg2.Id,
					Text = "????? 4-5 ????"
				},
				new PackageFeature
				{
					Id = Guid.NewGuid(),
					PackageId = pkg2.Id,
					Text = "????? ????"
				},
				new PackageFeature
				{
					Id = Guid.NewGuid(),
					PackageId = pkg2.Id,
					Text = "????? ?????? ?????"
				},
				new PackageFeature
				{
					Id = Guid.NewGuid(),
					PackageId = pkg2.Id,
					Text = "???? ????"
				}
			};
			await context.PackageFeatures.AddRangeAsync(features2);
		}
		if (dubai != null)
		{
			Package pkg3 = new Package
			{
				Id = Guid.NewGuid(),
				PackageId = "dubai-luxury-5d",
				DestinationId = dubai.Id,
				TitleAr = "??? ???????",
				TitleEn = "Luxury Dubai",
				Subtitle = "????? ????? ?? ????? ????????",
				Price = 3800m,
				Currency = "?.?",
				Duration = "5 ???? / 4 ?????",
				DurationDays = 5,
				DurationNights = 4,
				ImageUrl = "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80",
				VideoUrl = "https://videos.pexels.com/video-files/3015511/3015511-uhd_2560_1440_24fps.mp4",
				Vibe = "luxury",
				Rating = 4.7m,
				IsOffer = true,
				IsActive = true,
				CreatedAt = DateTime.UtcNow
			};
			packages.Add(pkg3);
			List<PackageItinerary> itinerary3 = new List<PackageItinerary>
			{
				new PackageItinerary
				{
					Id = Guid.NewGuid(),
					PackageId = pkg3.Id,
					Day = 1,
					Title = "?????? ??? ???",
					Description = "??????? ?? ?????? ??????? ??????? ???? ??? ?? ??? ???",
					ImageUrl = "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80"
				},
				new PackageItinerary
				{
					Id = Guid.NewGuid(),
					PackageId = pkg3.Id,
					Day = 2,
					Title = "??? ????? ???? ???",
					Description = "????? ??? ?????? ?????? ?? ??? ???? ?????? ??? ???????",
					ImageUrl = "https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=800&q=80"
				},
				new PackageItinerary
				{
					Id = Guid.NewGuid(),
					PackageId = pkg3.Id,
					Day = 3,
					Title = "????? ???????",
					Description = "???? ????? ?? ???????? ???? ????? ???? ???????",
					ImageUrl = "https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=800&q=80"
				},
				new PackageItinerary
				{
					Id = Guid.NewGuid(),
					PackageId = pkg3.Id,
					Day = 4,
					Title = "???? ?? ???",
					Description = "????? ???? ?????? ???????? ?????? ???? ??? ?????",
					ImageUrl = "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&q=80"
				},
				new PackageItinerary
				{
					Id = Guid.NewGuid(),
					PackageId = pkg3.Id,
					Day = 5,
					Title = "????????",
					Description = "???? ?? ??????? ??????",
					ImageUrl = "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80"
				}
			};
			await context.PackageItineraries.AddRangeAsync(itinerary3);
			List<PackageFeature> features3 = new List<PackageFeature>
			{
				new PackageFeature
				{
					Id = Guid.NewGuid(),
					PackageId = pkg3.Id,
					Text = "????? 5 ???? ?????"
				},
				new PackageFeature
				{
					Id = Guid.NewGuid(),
					PackageId = pkg3.Id,
					Text = "????? ??? ?????"
				},
				new PackageFeature
				{
					Id = Guid.NewGuid(),
					PackageId = pkg3.Id,
					Text = "???? ????? ???????"
				},
				new PackageFeature
				{
					Id = Guid.NewGuid(),
					PackageId = pkg3.Id,
					Text = "???? ?? ??? ???"
				}
			};
			await context.PackageFeatures.AddRangeAsync(features3);
		}
		if (london != null)
		{
			Package pkg4 = new Package
			{
				Id = Guid.NewGuid(),
				PackageId = "london-classic-7d",
				DestinationId = london.Id,
				TitleAr = "???? ??????????",
				TitleEn = "Classic London",
				Subtitle = "?????? ????? ?????? ????????",
				Price = 6500m,
				Currency = "?.?",
				Duration = "7 ???? / 6 ?????",
				DurationDays = 7,
				DurationNights = 6,
				ImageUrl = "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&q=80",
				VideoUrl = "https://videos.pexels.com/video-files/2611250/2611250-uhd_2560_1440_25fps.mp4",
				Vibe = "urban",
				Rating = 4.6m,
				IsOffer = false,
				IsActive = true,
				CreatedAt = DateTime.UtcNow
			};
			packages.Add(pkg4);
			List<PackageItinerary> itinerary4 = new List<PackageItinerary>
			{
				new PackageItinerary
				{
					Id = Guid.NewGuid(),
					PackageId = pkg4.Id,
					Day = 1,
					Title = "?????? ??? ????",
					Description = "??????? ?? ?????? ??????? ??????? ???? ??? ?? ???????",
					ImageUrl = "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80"
				},
				new PackageItinerary
				{
					Id = Guid.NewGuid(),
					PackageId = pkg4.Id,
					Day = 2,
					Title = "???? ?? ???? ?????????",
					Description = "????? ??? ????????? ??? ????? ??? ?????? ??? ????",
					ImageUrl = "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=800&q=80"
				},
				new PackageItinerary
				{
					Id = Guid.NewGuid(),
					PackageId = pkg4.Id,
					Day = 3,
					Title = "??????? ????????",
					Description = "????? ?????? ?????????? ???? ??????? ???????? ???? ????",
					ImageUrl = "https://images.unsplash.com/photo-1543832923-44667a44c804?w=800&q=80"
				},
				new PackageItinerary
				{
					Id = Guid.NewGuid(),
					PackageId = pkg4.Id,
					Day = 4,
					Title = "???? ??? ??????",
					Description = "????? ???? ?????? ??????? ?????? ?????",
					ImageUrl = "https://images.unsplash.com/photo-1599933975690-3f0f8b5f8f8f?w=800&q=80"
				},
				new PackageItinerary
				{
					Id = Guid.NewGuid(),
					PackageId = pkg4.Id,
					Day = 5,
					Title = "?????? ????????",
					Description = "??????? ?????? ????? ?????? ?????? ?? ???? ???",
					ImageUrl = "https://images.unsplash.com/photo-1520986606214-8b456906c813?w=800&q=80"
				},
				new PackageItinerary
				{
					Id = Guid.NewGuid(),
					PackageId = pkg4.Id,
					Day = 6,
					Title = "??? ?? ?? ????",
					Description = "??? ?? ?????? ?????????? ??????",
					ImageUrl = "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80"
				},
				new PackageItinerary
				{
					Id = Guid.NewGuid(),
					PackageId = pkg4.Id,
					Day = 7,
					Title = "????????",
					Description = "?????? ?????? ??????? ?????",
					ImageUrl = "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80"
				}
			};
			await context.PackageItineraries.AddRangeAsync(itinerary4);
			List<PackageFeature> features4 = new List<PackageFeature>
			{
				new PackageFeature
				{
					Id = Guid.NewGuid(),
					PackageId = pkg4.Id,
					Text = "????? 4 ???? ??? ???????"
				},
				new PackageFeature
				{
					Id = Guid.NewGuid(),
					PackageId = pkg4.Id,
					Text = "????? ??????"
				},
				new PackageFeature
				{
					Id = Guid.NewGuid(),
					PackageId = pkg4.Id,
					Text = "????? ???????"
				},
				new PackageFeature
				{
					Id = Guid.NewGuid(),
					PackageId = pkg4.Id,
					Text = "??????? ??????"
				}
			};
			await context.PackageFeatures.AddRangeAsync(features4);
		}
		if (georgia != null)
		{
			Package pkg5 = new Package
			{
				Id = Guid.NewGuid(),
				PackageId = "georgia-nature-8d",
				DestinationId = georgia.Id,
				TitleAr = "?????? ????????",
				TitleEn = "Nature Georgia",
				Subtitle = "????? ??????? ???????? ???????",
				Price = 4200m,
				Currency = "?.?",
				Duration = "8 ???? / 7 ?????",
				DurationDays = 8,
				DurationNights = 7,
				ImageUrl = "https://images.unsplash.com/photo-1585856262797-5e5c0e0e8e0e?w=1200&q=80",
				VideoUrl = "https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4",
				Vibe = "mountain",
				Rating = 4.8m,
				IsOffer = true,
				IsActive = true,
				CreatedAt = DateTime.UtcNow
			};
			packages.Add(pkg5);
			List<PackageItinerary> itinerary5 = new List<PackageItinerary>
			{
				new PackageItinerary
				{
					Id = Guid.NewGuid(),
					PackageId = pkg5.Id,
					Day = 1,
					Title = "?????? ??? ??????",
					Description = "??????? ?? ?????? ??????? ??????? ???? ?? ??????? ???????",
					ImageUrl = "https://images.unsplash.com/photo-1585856262797-5e5c0e0e8e0e?w=800&q=80"
				},
				new PackageItinerary
				{
					Id = Guid.NewGuid(),
					PackageId = pkg5.Id,
					Day = 2,
					Title = "???? ?? ??????",
					Description = "????? ???? ????????? ???????? ?????????? ??? ??????",
					ImageUrl = "https://images.unsplash.com/photo-1563622116-f9d3e8b9346f?w=800&q=80"
				},
				new PackageItinerary
				{
					Id = Guid.NewGuid(),
					PackageId = pkg5.Id,
					Day = 3,
					Title = "???? ??? ???????",
					Description = "???? ????? ??? ???????? ????? ??????? ??????",
					ImageUrl = "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80"
				},
				new PackageItinerary
				{
					Id = Guid.NewGuid(),
					PackageId = pkg5.Id,
					Day = 4,
					Title = "???????? ??? ??????",
					Description = "????? ??? ?????? ??? ????? ??????",
					ImageUrl = "https://images.unsplash.com/photo-1599933975690-3f0f8b5f8f8f?w=800&q=80"
				},
				new PackageItinerary
				{
					Id = Guid.NewGuid(),
					PackageId = pkg5.Id,
					Day = 5,
					Title = "???? ?? ??????",
					Description = "????? ??????? ????????? ??? ?????? ????????? ????????",
					ImageUrl = "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80"
				},
				new PackageItinerary
				{
					Id = Guid.NewGuid(),
					PackageId = pkg5.Id,
					Day = 6,
					Title = "??? ?? ?? ??????",
					Description = "??? ?? ????????? ??????? ????????",
					ImageUrl = "https://images.unsplash.com/photo-1599933975690-3f0f8b5f8f8f?w=800&q=80"
				},
				new PackageItinerary
				{
					Id = Guid.NewGuid(),
					PackageId = pkg5.Id,
					Day = 7,
					Title = "?????? ??? ??????",
					Description = "?????? ??? ??????? ???? ??",
					ImageUrl = "https://images.unsplash.com/photo-1585856262797-5e5c0e0e8e0e?w=800&q=80"
				},
				new PackageItinerary
				{
					Id = Guid.NewGuid(),
					PackageId = pkg5.Id,
					Day = 8,
					Title = "????????",
					Description = "?????? ?????? ??????? ?????",
					ImageUrl = "https://images.unsplash.com/photo-1585856262797-5e5c0e0e8e0e?w=800&q=80"
				}
			};
			await context.PackageItineraries.AddRangeAsync(itinerary5);
			List<PackageFeature> features5 = new List<PackageFeature>
			{
				new PackageFeature
				{
					Id = Guid.NewGuid(),
					PackageId = pkg5.Id,
					Text = "????? 4 ????"
				},
				new PackageFeature
				{
					Id = Guid.NewGuid(),
					PackageId = pkg5.Id,
					Text = "????? ?????"
				},
				new PackageFeature
				{
					Id = Guid.NewGuid(),
					PackageId = pkg5.Id,
					Text = "????? ?????"
				},
				new PackageFeature
				{
					Id = Guid.NewGuid(),
					PackageId = pkg5.Id,
					Text = "???? ????"
				}
			};
			await context.PackageFeatures.AddRangeAsync(features5);
		}
		if (thailand != null)
		{
			Package pkg6 = new Package
			{
				Id = Guid.NewGuid(),
				PackageId = "thailand-beach-9d",
				DestinationId = thailand.Id,
				TitleAr = "?????? ????????",
				TitleEn = "Beach Thailand",
				Subtitle = "??? ?????????? ???????? ???????",
				Price = 4800m,
				Currency = "?.?",
				Duration = "9 ???? / 8 ?????",
				DurationDays = 9,
				DurationNights = 8,
				ImageUrl = "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1200&q=80",
				VideoUrl = "https://videos.pexels.com/video-files/2169880/2169880-uhd_2560_1440_30fps.mp4",
				Vibe = "tropical",
				Rating = 4.7m,
				IsOffer = false,
				IsActive = true,
				CreatedAt = DateTime.UtcNow
			};
			packages.Add(pkg6);
			List<PackageItinerary> itinerary6 = new List<PackageItinerary>
			{
				new PackageItinerary
				{
					Id = Guid.NewGuid(),
					PackageId = pkg6.Id,
					Day = 1,
					Title = "?????? ??? ??????",
					Description = "??????? ?? ?????? ??????? ??????? ???? ???",
					ImageUrl = "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80"
				},
				new PackageItinerary
				{
					Id = Guid.NewGuid(),
					PackageId = pkg6.Id,
					Day = 2,
					Title = "???? ?? ??????",
					Description = "????? ????? ??????? ???? ?????? ????? ??????",
					ImageUrl = "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80"
				},
				new PackageItinerary
				{
					Id = Guid.NewGuid(),
					PackageId = pkg6.Id,
					Day = 3,
					Title = "???????? ??? ?????",
					Description = "????? ????? ??? ?????? ????????? ?? ??????? ???????",
					ImageUrl = "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=800&q=80"
				},
				new PackageItinerary
				{
					Id = Guid.NewGuid(),
					PackageId = pkg6.Id,
					Day = 4,
					Title = "???? ?? ??? ?????",
					Description = "???? ????? ??? ??? ?? ??? ??????? ??????",
					ImageUrl = "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80"
				},
				new PackageItinerary
				{
					Id = Guid.NewGuid(),
					PackageId = pkg6.Id,
					Day = 5,
					Title = "??? ?? ?? ?????",
					Description = "??? ?? ????????? ??????? ????????",
					ImageUrl = "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=800&q=80"
				},
				new PackageItinerary
				{
					Id = Guid.NewGuid(),
					PackageId = pkg6.Id,
					Day = 6,
					Title = "???? ?? ??????",
					Description = "????? ???? ??????? ????? ??????? ???? ???????",
					ImageUrl = "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80"
				},
				new PackageItinerary
				{
					Id = Guid.NewGuid(),
					PackageId = pkg6.Id,
					Day = 7,
					Title = "???? ??? ????? ???? ????",
					Description = "???? ????? ??? ???? ??? ??? ?????? ???? ????",
					ImageUrl = "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80"
				},
				new PackageItinerary
				{
					Id = Guid.NewGuid(),
					PackageId = pkg6.Id,
					Day = 8,
					Title = "?????? ??? ??????",
					Description = "????? ????? ??? ??????? ???? ??",
					ImageUrl = "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80"
				},
				new PackageItinerary
				{
					Id = Guid.NewGuid(),
					PackageId = pkg6.Id,
					Day = 9,
					Title = "????????",
					Description = "?????? ?????? ??????? ?????",
					ImageUrl = "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80"
				}
			};
			await context.PackageItineraries.AddRangeAsync(itinerary6);
			List<PackageFeature> features6 = new List<PackageFeature>
			{
				new PackageFeature
				{
					Id = Guid.NewGuid(),
					PackageId = pkg6.Id,
					Text = "??????? ??????"
				},
				new PackageFeature
				{
					Id = Guid.NewGuid(),
					PackageId = pkg6.Id,
					Text = "????? ?????"
				},
				new PackageFeature
				{
					Id = Guid.NewGuid(),
					PackageId = pkg6.Id,
					Text = "????? ??????"
				},
				new PackageFeature
				{
					Id = Guid.NewGuid(),
					PackageId = pkg6.Id,
					Text = "????? ????"
				}
			};
			await context.PackageFeatures.AddRangeAsync(features6);
		}
		if (vietnam != null)
		{
			Package pkg7 = new Package
			{
				Id = Guid.NewGuid(),
				PackageId = "vietnam-discovery-10d",
				DestinationId = vietnam.Id,
				TitleAr = "????? ??????",
				TitleEn = "Discover Vietnam",
				Subtitle = "???? ?????? ????? ???????? ??????",
				Price = 5000m,
				Currency = "?.?",
				Duration = "10 ???? / 9 ?????",
				DurationDays = 10,
				DurationNights = 9,
				ImageUrl = "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1200&q=80",
				VideoUrl = "https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4",
				Vibe = "cultural",
				Rating = 4.5m,
				IsOffer = false,
				IsActive = true,
				CreatedAt = DateTime.UtcNow
			};
			packages.Add(pkg7);
			List<PackageItinerary> itinerary7 = new List<PackageItinerary>
			{
				new PackageItinerary
				{
					Id = Guid.NewGuid(),
					PackageId = pkg7.Id,
					Day = 1,
					Title = "?????? ??? ?????",
					Description = "??????? ?? ?????? ??????? ??????? ???? ?? ???????",
					ImageUrl = "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80"
				},
				new PackageItinerary
				{
					Id = Guid.NewGuid(),
					PackageId = pkg7.Id,
					Day = 2,
					Title = "???? ?? ?????",
					Description = "????? ???? ?????? ???? ???? ???? ???? ??????",
					ImageUrl = "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80"
				},
				new PackageItinerary
				{
					Id = Guid.NewGuid(),
					PackageId = pkg7.Id,
					Day = 3,
					Title = "???? ??? ???? ??????",
					Description = "???? ????? ?? ???? ??????? ?????? ??? ??? ??????",
					ImageUrl = "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80"
				},
				new PackageItinerary
				{
					Id = Guid.NewGuid(),
					PackageId = pkg7.Id,
					Day = 4,
					Title = "?????? ??? ?????",
					Description = "?????? ?? ???? ?????? ??? ?????",
					ImageUrl = "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80"
				},
				new PackageItinerary
				{
					Id = Guid.NewGuid(),
					PackageId = pkg7.Id,
					Day = 5,
					Title = "???????? ??? ??? ??",
					Description = "????? ????? ??? ?? ????? ???????? ??? ??? ??",
					ImageUrl = "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80"
				},
				new PackageItinerary
				{
					Id = Guid.NewGuid(),
					PackageId = pkg7.Id,
					Day = 6,
					Title = "???? ?? ??? ??",
					Description = "????? ??????? ???????? ????? ????????? ????? ??????",
					ImageUrl = "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80"
				},
				new PackageItinerary
				{
					Id = Guid.NewGuid(),
					PackageId = pkg7.Id,
					Day = 7,
					Title = "???????? ??? ???? ???",
					Description = "????? ????? ??? ???? ??? (??????)",
					ImageUrl = "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80"
				},
				new PackageItinerary
				{
					Id = Guid.NewGuid(),
					PackageId = pkg7.Id,
					Day = 8,
					Title = "???? ?? ???? ???",
					Description = "????? ??? ?????????? ????????? ???????? ????? ???????",
					ImageUrl = "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80"
				},
				new PackageItinerary
				{
					Id = Guid.NewGuid(),
					PackageId = pkg7.Id,
					Day = 9,
					Title = "???? ??? ???? ??????",
					Description = "???? ????? ?? ???? ??????? ????? ??????? ???????",
					ImageUrl = "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80"
				},
				new PackageItinerary
				{
					Id = Guid.NewGuid(),
					PackageId = pkg7.Id,
					Day = 10,
					Title = "????????",
					Description = "?????? ?????? ??????? ?????",
					ImageUrl = "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80"
				}
			};
			await context.PackageItineraries.AddRangeAsync(itinerary7);
			List<PackageFeature> features7 = new List<PackageFeature>
			{
				new PackageFeature
				{
					Id = Guid.NewGuid(),
					PackageId = pkg7.Id,
					Text = "????? 4 ????"
				},
				new PackageFeature
				{
					Id = Guid.NewGuid(),
					PackageId = pkg7.Id,
					Text = "????? ??????"
				},
				new PackageFeature
				{
					Id = Guid.NewGuid(),
					PackageId = pkg7.Id,
					Text = "???? ?? ???? ??????"
				},
				new PackageFeature
				{
					Id = Guid.NewGuid(),
					PackageId = pkg7.Id,
					Text = "????? ????"
				}
			};
			await context.PackageFeatures.AddRangeAsync(features7);
		}
		if (moscow != null)
		{
			Package pkg8 = new Package
			{
				Id = Guid.NewGuid(),
				PackageId = "moscow-winter-6d",
				DestinationId = moscow.Id,
				TitleAr = "????? ???????",
				TitleEn = "Winter Moscow",
				Subtitle = "????? ????? ???????? ??????",
				Price = 5500m,
				Currency = "?.?",
				Duration = "6 ???? / 5 ?????",
				DurationDays = 6,
				DurationNights = 5,
				ImageUrl = "https://images.unsplash.com/photo-1513326738677-b964603b136d?w=1200&q=80",
				VideoUrl = "https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4",
				Vibe = "arctic",
				Rating = 4.6m,
				IsOffer = true,
				IsActive = true,
				CreatedAt = DateTime.UtcNow
			};
			packages.Add(pkg8);
			List<PackageItinerary> itinerary8 = new List<PackageItinerary>
			{
				new PackageItinerary
				{
					Id = Guid.NewGuid(),
					PackageId = pkg8.Id,
					Day = 1,
					Title = "?????? ??? ?????",
					Description = "??????? ?? ?????? ??????? ??????? ???? ?? ??????? ??????",
					ImageUrl = "https://images.unsplash.com/photo-1513326738677-b964603b136d?w=800&q=80"
				},
				new PackageItinerary
				{
					Id = Guid.NewGuid(),
					PackageId = pkg8.Id,
					Day = 2,
					Title = "???? ?? ????????",
					Description = "????? ????????? ????????? ?????? ?????? ???? ???????",
					ImageUrl = "https://images.unsplash.com/photo-1547448415-e9f5b28e570d?w=800&q=80"
				},
				new PackageItinerary
				{
					Id = Guid.NewGuid(),
					PackageId = pkg8.Id,
					Day = 3,
					Title = "??????? ????????",
					Description = "????? ???? ?????????? ???? ????? ??????? ???? ?????",
					ImageUrl = "https://images.unsplash.com/photo-1520106212299-d99c443e4568?w=800&q=80"
				},
				new PackageItinerary
				{
					Id = Guid.NewGuid(),
					PackageId = pkg8.Id,
					Day = 4,
					Title = "???? ?? ????? ???????",
					Description = "????? ??? ??????????? ???? ????? ????? ????? ?????",
					ImageUrl = "https://images.unsplash.com/photo-1513326738677-b964603b136d?w=800&q=80"
				},
				new PackageItinerary
				{
					Id = Guid.NewGuid(),
					PackageId = pkg8.Id,
					Day = 5,
					Title = "??? ?? ?? ?????",
					Description = "??? ?? ?????? ?????????? ??????",
					ImageUrl = "https://images.unsplash.com/photo-1513326738677-b964603b136d?w=800&q=80"
				},
				new PackageItinerary
				{
					Id = Guid.NewGuid(),
					PackageId = pkg8.Id,
					Day = 6,
					Title = "????????",
					Description = "?????? ?????? ??????? ?????",
					ImageUrl = "https://images.unsplash.com/photo-1513326738677-b964603b136d?w=800&q=80"
				}
			};
			await context.PackageItineraries.AddRangeAsync(itinerary8);
			List<PackageFeature> features8 = new List<PackageFeature>
			{
				new PackageFeature
				{
					Id = Guid.NewGuid(),
					PackageId = pkg8.Id,
					Text = "????? 4 ????"
				},
				new PackageFeature
				{
					Id = Guid.NewGuid(),
					PackageId = pkg8.Id,
					Text = "????? ???????"
				},
				new PackageFeature
				{
					Id = Guid.NewGuid(),
					PackageId = pkg8.Id,
					Text = "????? ????????"
				},
				new PackageFeature
				{
					Id = Guid.NewGuid(),
					PackageId = pkg8.Id,
					Text = "???? ????"
				}
			};
			await context.PackageFeatures.AddRangeAsync(features8);
		}
		string jsonPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Extracted", "db_seeder_data.json");
		if (!File.Exists(jsonPath))
		{
			jsonPath = Path.Combine(Directory.GetCurrentDirectory(), "src", "Infrastructure.Persistence", "Data", "Extracted", "db_seeder_data.json");
		}
		if (File.Exists(jsonPath))
		{
			logger.LogInformation("Injecting parsed packages from " + jsonPath);
			string jsonData = await File.ReadAllTextAsync(jsonPath);
			try
			{
				List<DynamicDestinationDto> parsedDataList = JsonSerializer.Deserialize<List<DynamicDestinationDto>>(jsonData, new JsonSerializerOptions
				{
					PropertyNameCaseInsensitive = true
				});
				if (parsedDataList != null)
				{
					Dictionary<string, Destination> allDestinationsMap = destinations.ToDictionary((Destination d) => d.NameAr);
					foreach (DynamicDestinationDto parsedDest in parsedDataList)
					{
						if (!allDestinationsMap.ContainsKey(parsedDest.NameAr))
						{
							continue;
						}
						Guid destDbId = allDestinationsMap[parsedDest.NameAr].Id;
						if (parsedDest.Packages == null)
						{
							continue;
						}
						foreach (DynamicPackageDto parsedPkg in parsedDest.Packages)
						{
							Package newPackage = new Package
							{
								Id = Guid.NewGuid(),
								PackageId = parsedPkg.PackageId,
								DestinationId = destDbId,
								TitleAr = parsedPkg.TitleAr,
								TitleEn = parsedPkg.TitleEn,
								Subtitle = parsedPkg.Subtitle,
								Price = parsedPkg.Price,
								Currency = parsedPkg.Currency,
								Duration = parsedPkg.Duration,
								DurationDays = parsedPkg.DurationDays,
								DurationNights = parsedPkg.DurationNights,
								ImageUrl = parsedPkg.ImageUrl,
								Vibe = parsedPkg.Vibe,
								Rating = parsedPkg.Rating,
								IsOffer = parsedPkg.IsOffer,
								IsActive = parsedPkg.IsActive,
								CreatedAt = DateTime.UtcNow
							};
							packages.Add(newPackage);
							if (parsedPkg.Itineraries != null)
							{
								List<PackageItinerary> itinerariesToInsert = new List<PackageItinerary>();
								foreach (DynamicItineraryDto it in parsedPkg.Itineraries)
								{
									itinerariesToInsert.Add(new PackageItinerary
									{
										Id = Guid.NewGuid(),
										PackageId = newPackage.Id,
										Day = it.Day,
										Title = it.Title,
										Description = it.Description,
										ImageUrl = it.ImageUrl
									});
								}
								await context.PackageItineraries.AddRangeAsync(itinerariesToInsert);
							}
							if (parsedPkg.Hotels != null)
							{
								List<PackageHotel> hotelsToInsert = new List<PackageHotel>();
								int sortOrder = 1;
								foreach (DynamicHotelDto h in parsedPkg.Hotels)
								{
									string hotelLocation = "";
									if (h.HotelName.Contains("-"))
									{
										hotelLocation = h.HotelName.Split('-').Last().Trim();
									}
									hotelsToInsert.Add(new PackageHotel
									{
										Id = Guid.NewGuid(),
										PackageId = newPackage.Id,
										Name = h.HotelName,
										Location = hotelLocation,
										Stars = h.Rating,
										NightsCount = 0,
										DayImageUrl = h.ImageUrl,
										NightImageUrl = h.ImageUrl,
										SortOrder = sortOrder++
									});
								}
								await context.PackageHotels.AddRangeAsync(hotelsToInsert);
							}
							await context.PackageFeatures.AddAsync(new PackageFeature
							{
								Id = Guid.NewGuid(),
								PackageId = newPackage.Id,
								Text = "???? ???? ????? ??????? ???"
							});
						}
					}
				}
			}
			catch (Exception ex2)
			{
				Exception ex = ex2;
				logger.LogError(ex, "Failed to parse Extracted PDF Data JSON map in Packages");
			}
		}
		await context.Packages.AddRangeAsync(packages);
		await context.SaveChangesAsync();
		logger.LogInformation($"Seeded {packages.Count} packages with itineraries and features.");
	}

	private static async Task SeedHotelsAsync(AlmulhemDbContext context, ILogger logger)
	{
		logger.LogInformation("Seeding Hotels...");
		City kualaLumpur = await context.Cities.FirstOrDefaultAsync((City c) => c.NameEn == "Kuala Lumpur");
		City langkawi = await context.Cities.FirstOrDefaultAsync((City c) => c.NameEn == "Langkawi");
		City istanbul = await context.Cities.FirstOrDefaultAsync((City c) => c.NameEn == "Istanbul");
		City antalya = await context.Cities.FirstOrDefaultAsync((City c) => c.NameEn == "Antalya");
		City trabzon = await context.Cities.FirstOrDefaultAsync((City c) => c.NameEn == "Trabzon");
		City dubai = await context.Cities.FirstOrDefaultAsync((City c) => c.NameEn == "Dubai");
		City london = await context.Cities.FirstOrDefaultAsync((City c) => c.NameEn == "London");
		City tbilisi = await context.Cities.FirstOrDefaultAsync((City c) => c.NameEn == "Tbilisi");
		City batumi = await context.Cities.FirstOrDefaultAsync((City c) => c.NameEn == "Batumi");
		City bangkok = await context.Cities.FirstOrDefaultAsync((City c) => c.NameEn == "Bangkok");
		City phuket = await context.Cities.FirstOrDefaultAsync((City c) => c.NameEn == "Phuket");
		City hanoi = await context.Cities.FirstOrDefaultAsync((City c) => c.NameEn == "Hanoi");
		City hochiminh = await context.Cities.FirstOrDefaultAsync((City c) => c.NameEn == "Ho Chi Minh");
		City moscow = await context.Cities.FirstOrDefaultAsync((City c) => c.NameEn == "Moscow");
		List<Hotel> hotels = new List<Hotel>();
		if (kualaLumpur != null)
		{
			hotels.Add(new Hotel
			{
				Id = Guid.NewGuid(),
				HotelId = "mandarin-oriental-kl",
				Name = "???????? ???????? ??????????",
				NameEn = "Mandarin Oriental Kuala Lumpur",
				Stars = 5,
				Rating = 9.2m,
				ReviewCount = 1250,
				RatingText = "?????",
				Address = "Kuala Lumpur City Centre",
				Location = "??? ???????",
				Distance = "0.5 ?? ?? ???? ???????",
				CityId = kualaLumpur.Id,
				Description = "???? ???? 5 ???? ?? ??? ??????????",
				MainImageUrl = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
				IsActive = true
			});
		}
		if (langkawi != null)
		{
			hotels.Add(new Hotel
			{
				Id = Guid.NewGuid(),
				HotelId = "four-seasons-langkawi",
				Name = "??? ?????? ??????",
				NameEn = "Four Seasons Resort Langkawi",
				Stars = 5,
				Rating = 9.5m,
				ReviewCount = 980,
				RatingText = "????????",
				Address = "Tanjung Rhu Beach",
				Location = "???? ??????? ??",
				Distance = "??? ?????? ??????",
				CityId = langkawi.Id,
				Description = "????? ????? ???? ?? ??????? ?????",
				MainImageUrl = "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
				IsActive = true
			});
		}
		if (istanbul != null)
		{
			hotels.Add(new Hotel
			{
				Id = Guid.NewGuid(),
				HotelId = "ciragan-palace-istanbul",
				Name = "??? ??????? ???????",
				NameEn = "Ciragan Palace Kempinski Istanbul",
				Stars = 5,
				Rating = 9.3m,
				ReviewCount = 1450,
				RatingText = "????? ???\u064b",
				Address = "Besiktas, Bosphorus",
				Location = "??? ????????",
				Distance = "3 ?? ?? ?????",
				CityId = istanbul.Id,
				Description = "??? ?????? ?????? ???? ??? ???? ????",
				MainImageUrl = "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80",
				IsActive = true
			});
		}
		if (antalya != null)
		{
			hotels.Add(new Hotel
			{
				Id = Guid.NewGuid(),
				HotelId = "rixos-premium-belek",
				Name = "?????? ??????? ?????",
				NameEn = "Rixos Premium Belek",
				Stars = 5,
				Rating = 9.1m,
				ReviewCount = 2100,
				RatingText = "?????",
				Address = "Belek, Antalya",
				Location = "????? ?????",
				Distance = "??? ??????",
				CityId = antalya.Id,
				Description = "????? ???? ????\u064b ?? ????? ??????",
				MainImageUrl = "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800&q=80",
				IsActive = true
			});
		}
		if (trabzon != null)
		{
			hotels.Add(new Hotel
			{
				Id = Guid.NewGuid(),
				HotelId = "zorlu-grand-trabzon",
				Name = "????? ????? ???????",
				NameEn = "Zorlu Grand Hotel Trabzon",
				Stars = 5,
				Rating = 8.9m,
				ReviewCount = 850,
				RatingText = "??? ???\u064b",
				Address = "City Center, Trabzon",
				Location = "??? ???????",
				Distance = "1 ?? ?? ???????",
				CityId = trabzon.Id,
				Description = "???? ???? ?? ??? ???????",
				MainImageUrl = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
				IsActive = true
			});
		}
		if (dubai != null)
		{
			hotels.Add(new Hotel
			{
				Id = Guid.NewGuid(),
				HotelId = "burj-al-arab",
				Name = "??? ?????",
				NameEn = "Burj Al Arab Jumeirah",
				Stars = 5,
				Rating = 9.6m,
				ReviewCount = 3200,
				RatingText = "????????",
				Address = "Jumeirah Beach",
				Location = "???? ?????",
				Distance = "15 ?? ?? ??? ?????",
				CityId = dubai.Id,
				Description = "?????? ??????? ?? ???",
				MainImageUrl = "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80",
				IsActive = true
			});
			hotels.Add(new Hotel
			{
				Id = Guid.NewGuid(),
				HotelId = "atlantis-the-palm",
				Name = "??????? ??????",
				NameEn = "Atlantis The Palm",
				Stars = 5,
				Rating = 9.0m,
				ReviewCount = 4500,
				RatingText = "?????",
				Address = "Palm Jumeirah",
				Location = "???? ?????",
				Distance = "20 ?? ?? ??????",
				CityId = dubai.Id,
				Description = "????? ????? ???? ?? ????? ?????",
				MainImageUrl = "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&q=80",
				IsActive = true
			});
		}
		if (london != null)
		{
			hotels.Add(new Hotel
			{
				Id = Guid.NewGuid(),
				HotelId = "the-savoy-london",
				Name = "?? ????? ????",
				NameEn = "The Savoy London",
				Stars = 5,
				Rating = 9.4m,
				ReviewCount = 2800,
				RatingText = "????? ???\u064b",
				Address = "Strand, Westminster",
				Location = "??? ????",
				Distance = "0.5 ?? ?? ??? ???????",
				CityId = london.Id,
				Description = "???? ?????? ???? ?? ??? ????",
				MainImageUrl = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
				IsActive = true
			});
		}
		if (tbilisi != null)
		{
			hotels.Add(new Hotel
			{
				Id = Guid.NewGuid(),
				HotelId = "rooms-hotel-tbilisi",
				Name = "???? ????? ??????",
				NameEn = "Rooms Hotel Tbilisi",
				Stars = 5,
				Rating = 9.2m,
				ReviewCount = 1100,
				RatingText = "?????",
				Address = "Vera District",
				Location = "????? ????",
				Distance = "2 ?? ?? ??????? ???????",
				CityId = tbilisi.Id,
				Description = "???? ????? ???? ?? ??????",
				MainImageUrl = "https://images.unsplash.com/photo-1585856262797-5e5c0e0e8e0e?w=800&q=80",
				IsActive = true
			});
		}
		if (batumi != null)
		{
			hotels.Add(new Hotel
			{
				Id = Guid.NewGuid(),
				HotelId = "sheraton-batumi",
				Name = "??????? ??????",
				NameEn = "Sheraton Batumi Hotel",
				Stars = 5,
				Rating = 8.8m,
				ReviewCount = 950,
				RatingText = "??? ???\u064b",
				Address = "Batumi Boulevard",
				Location = "?????? ??????",
				Distance = "??? ????? ??????",
				CityId = batumi.Id,
				Description = "???? ???? ??? ????? ??????",
				MainImageUrl = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
				IsActive = true
			});
		}
		if (bangkok != null)
		{
			hotels.Add(new Hotel
			{
				Id = Guid.NewGuid(),
				HotelId = "mandarin-oriental-bangkok",
				Name = "???????? ???????? ??????",
				NameEn = "Mandarin Oriental Bangkok",
				Stars = 5,
				Rating = 9.5m,
				ReviewCount = 2400,
				RatingText = "????????",
				Address = "Riverside, Bangkok",
				Location = "??? ??? ???? ?????",
				Distance = "5 ?? ?? ????? ??????",
				CityId = bangkok.Id,
				Description = "???? ?????? ??? ???? ?????",
				MainImageUrl = "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80",
				IsActive = true
			});
		}
		if (phuket != null)
		{
			hotels.Add(new Hotel
			{
				Id = Guid.NewGuid(),
				HotelId = "amanpuri-phuket",
				Name = "???????? ?????",
				NameEn = "Amanpuri Phuket",
				Stars = 5,
				Rating = 9.7m,
				ReviewCount = 680,
				RatingText = "????????",
				Address = "Pansea Beach",
				Location = "???? ?????",
				Distance = "??? ?????? ?????",
				CityId = phuket.Id,
				Description = "????? ???? ?????? ?? ?????? ????",
				MainImageUrl = "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=800&q=80",
				IsActive = true
			});
		}
		if (hanoi != null)
		{
			hotels.Add(new Hotel
			{
				Id = Guid.NewGuid(),
				HotelId = "sofitel-legend-metropole-hanoi",
				Name = "??????? ????? ??????? ?????",
				NameEn = "Sofitel Legend Metropole Hanoi",
				Stars = 5,
				Rating = 9.3m,
				ReviewCount = 1800,
				RatingText = "????? ???\u064b",
				Address = "French Quarter, Hanoi",
				Location = "???? ???????",
				Distance = "1 ?? ?? ????? ???? ???",
				CityId = hanoi.Id,
				Description = "???? ?????? ????? ????",
				MainImageUrl = "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80",
				IsActive = true
			});
		}
		if (hochiminh != null)
		{
			hotels.Add(new Hotel
			{
				Id = Guid.NewGuid(),
				HotelId = "park-hyatt-saigon",
				Name = "???? ???? ??????",
				NameEn = "Park Hyatt Saigon",
				Stars = 5,
				Rating = 9.1m,
				ReviewCount = 1500,
				RatingText = "?????",
				Address = "District 1, Ho Chi Minh",
				Location = "??????? ??????",
				Distance = "0.3 ?? ?? ??? ???????",
				CityId = hochiminh.Id,
				Description = "???? ???? ?? ??? ??????",
				MainImageUrl = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
				IsActive = true
			});
		}
		if (moscow != null)
		{
			hotels.Add(new Hotel
			{
				Id = Guid.NewGuid(),
				HotelId = "four-seasons-moscow",
				Name = "??? ?????? ?????",
				NameEn = "Four Seasons Hotel Moscow",
				Stars = 5,
				Rating = 9.4m,
				ReviewCount = 1650,
				RatingText = "????? ???\u064b",
				Address = "Manezhnaya Square",
				Location = "????? ?????????",
				Distance = "0.2 ?? ?? ????????",
				CityId = moscow.Id,
				Description = "???? ???? ??????? ??? ????????",
				MainImageUrl = "https://images.unsplash.com/photo-1513326738677-b964603b136d?w=800&q=80",
				IsActive = true
			});
		}
		await context.Hotels.AddRangeAsync(hotels);
		await context.SaveChangesAsync();
		logger.LogInformation($"Seeded {hotels.Count} hotels.");
	}
}
