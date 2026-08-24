-- Update existing HeroSlides with subtitles and video URLs
UPDATE HeroSlides SET SubtitleAr = N'استمتع بإقامة لا تُنسى', SubtitleEn = N'Enjoy an unforgettable stay', VideoUrl = 'https://res.cloudinary.com/dlkxftysy/video/upload/q_auto,f_auto,w_1920/v1779236352/13550049_3840_2160_60fps_optimized_cqtcqw.mp4' WHERE TitleAr = N'منتجع فاخر';
UPDATE HeroSlides SET SubtitleAr = N'اكتشف أجمل الشواطئ في العالم', SubtitleEn = N'Discover the world''s most beautiful beaches', VideoUrl = 'https://res.cloudinary.com/dlkxftysy/video/upload/q_auto,f_auto,w_1920/v1779236321/13446157_3840_2160_60fps_optimized_qqar8p.mp4' WHERE TitleAr = N'شواطئ استوائية';
UPDATE HeroSlides SET SubtitleAr = N'جنة على الأرض', SubtitleEn = N'Paradise on Earth', VideoUrl = 'https://res.cloudinary.com/dlkxftysy/video/upload/q_auto,f_auto,w_1920/v1779236303/13874845_3840_2160_30fps_optimized_turylc.mp4' WHERE TitleAr = N'جزر المالديف';
UPDATE HeroSlides SET SubtitleAr = N'عش تجربة فريدة من نوعها', SubtitleEn = N'Live a unique experience' WHERE TitleAr = N'مغامرات لا تُنسى';
UPDATE HeroSlides SET SubtitleAr = N'اكتشف وجهات جديدة', SubtitleEn = N'Discover new destinations' WHERE TitleAr = N'رحلات حول العالم';

-- Update BoardMembers with IsActive = 1
UPDATE BoardMembers SET IsActive = 1;
