
-- ==========================================================
-- AlMulhim Travel Production Seeder Script (80 PDF Packages)
-- ==========================================================

DECLARE @Dest_0 UNIQUEIDENTIFIER;
SELECT @Dest_0 = Id FROM Destinations WHERE NameAr = N'المالديف رونق ترافل 2026';
IF @Dest_0 IS NULL
BEGIN
    SET @Dest_0 = NEWID();
    INSERT INTO Destinations (Id, NameAr, NameEn, Slug, Country, ImageUrl, Description, IsActive, SortOrder)
    VALUES (@Dest_0, N'المالديف رونق ترافل 2026', N'Destination En', N'المالديف-رونق-ترافل-2026', N'المالديف رونق ترافل 2026', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop', N'اكتشف جمال وعراقة المالديف رونق ترافل 2026 مع برامج الملحم السياحية الفاخرة المميزة.', 1, 100);
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-المالديف-رونق-ترافل-2026-30-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('be696f43-8541-4eb4-a838-dedd5db30db0', N'pkg-المالديف-رونق-ترافل-2026-30-days', @Dest_0, N'بكج المالديف رونق ترافل 2026 الساحرة - كانديما الى  يونيو 30 أيام', N'Amazing المالديف رونق ترافل 2026 30 Days Package', N'استمتع بـ 29 ليالي من الرفاهية في أفضل فنادق المالديف رونق ترافل 2026', 15000, N'ر.س', N'30 أيام / 29 ليالي', 30, 29, N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 0, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('f80c4ce5-065c-4122-89b6-304c8dcb0855', 'be696f43-8541-4eb4-a838-dedd5db30db0', 1, N'اليوم 1', N'وصف تفصيلي لجولات اليوم رقم 1 في المالديف رونق ترافل 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('89894a7b-98c4-4375-9920-d8dd0cf8a9f1', 'be696f43-8541-4eb4-a838-dedd5db30db0', 2, N'اليوم 2', N'وصف تفصيلي لجولات اليوم رقم 2 في المالديف رونق ترافل 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('6b1db6cb-45f4-4070-a233-605d638708e9', 'be696f43-8541-4eb4-a838-dedd5db30db0', 3, N'اليوم 3', N'وصف تفصيلي لجولات اليوم رقم 3 في المالديف رونق ترافل 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('4ebcf135-6974-4078-85b8-f8520c5bdff4', 'be696f43-8541-4eb4-a838-dedd5db30db0', 4, N'اليوم 4', N'وصف تفصيلي لجولات اليوم رقم 4 في المالديف رونق ترافل 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('b697443c-f48a-4f3f-ab93-15ae174653f9', 'be696f43-8541-4eb4-a838-dedd5db30db0', 5, N'اليوم 5', N'وصف تفصيلي لجولات اليوم رقم 5 في المالديف رونق ترافل 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('48fbb3de-63a7-43cb-86ef-85ce75058d75', 'be696f43-8541-4eb4-a838-dedd5db30db0', 6, N'اليوم 6', N'وصف تفصيلي لجولات اليوم رقم 6 في المالديف رونق ترافل 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('bbd92fdd-3413-4df0-89f9-47a2176362cc', 'be696f43-8541-4eb4-a838-dedd5db30db0', 7, N'اليوم 7', N'وصف تفصيلي لجولات اليوم رقم 7 في المالديف رونق ترافل 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('17ff7c2a-f598-4813-87e3-6f1eecb1f63d', 'be696f43-8541-4eb4-a838-dedd5db30db0', 8, N'اليوم 8', N'وصف تفصيلي لجولات اليوم رقم 8 في المالديف رونق ترافل 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('b20c172a-c533-4fe5-b482-a195a2964366', 'be696f43-8541-4eb4-a838-dedd5db30db0', 9, N'اليوم 9', N'وصف تفصيلي لجولات اليوم رقم 9 في المالديف رونق ترافل 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('dda7c369-488f-46d6-9697-bb92bd935020', 'be696f43-8541-4eb4-a838-dedd5db30db0', 10, N'اليوم 10', N'وصف تفصيلي لجولات اليوم رقم 10 في المالديف رونق ترافل 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('ac56c227-8fce-489d-a8ec-c40e93eb64e9', 'be696f43-8541-4eb4-a838-dedd5db30db0', 11, N'اليوم 11', N'وصف تفصيلي لجولات اليوم رقم 11 في المالديف رونق ترافل 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('2a3d7c4d-7133-4919-9697-f8ea624e11ff', 'be696f43-8541-4eb4-a838-dedd5db30db0', 12, N'اليوم 12', N'وصف تفصيلي لجولات اليوم رقم 12 في المالديف رونق ترافل 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('7aa6d97d-7ddc-4136-94f7-5d1cf0508e12', 'be696f43-8541-4eb4-a838-dedd5db30db0', 13, N'اليوم 13', N'وصف تفصيلي لجولات اليوم رقم 13 في المالديف رونق ترافل 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('e122f8c1-f356-4d3b-a9c8-c96076997838', 'be696f43-8541-4eb4-a838-dedd5db30db0', 14, N'اليوم 14', N'وصف تفصيلي لجولات اليوم رقم 14 في المالديف رونق ترافل 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('db82c755-7d71-450a-92f6-27b9d11fe854', 'be696f43-8541-4eb4-a838-dedd5db30db0', 15, N'اليوم 15', N'وصف تفصيلي لجولات اليوم رقم 15 في المالديف رونق ترافل 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('f96dcd0b-44f0-42fc-8d13-508b1f59da44', 'be696f43-8541-4eb4-a838-dedd5db30db0', 16, N'اليوم 16', N'وصف تفصيلي لجولات اليوم رقم 16 في المالديف رونق ترافل 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('0d55283c-7d4a-4667-9837-51173f48be10', 'be696f43-8541-4eb4-a838-dedd5db30db0', 17, N'اليوم 17', N'وصف تفصيلي لجولات اليوم رقم 17 في المالديف رونق ترافل 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('24924b6e-1c51-42e3-a920-b9a60c987de4', 'be696f43-8541-4eb4-a838-dedd5db30db0', 18, N'اليوم 18', N'وصف تفصيلي لجولات اليوم رقم 18 في المالديف رونق ترافل 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('31c92200-1af4-40fe-b465-ae499cc30c7f', 'be696f43-8541-4eb4-a838-dedd5db30db0', 19, N'اليوم 19', N'وصف تفصيلي لجولات اليوم رقم 19 في المالديف رونق ترافل 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('c523261e-af7c-4164-805f-863b1476e8d3', 'be696f43-8541-4eb4-a838-dedd5db30db0', 20, N'اليوم 20', N'وصف تفصيلي لجولات اليوم رقم 20 في المالديف رونق ترافل 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('0214f1d0-3eb9-4de6-bab9-e8a55c0bc691', 'be696f43-8541-4eb4-a838-dedd5db30db0', 21, N'اليوم 21', N'وصف تفصيلي لجولات اليوم رقم 21 في المالديف رونق ترافل 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('5c42b66b-22cc-4d98-b7bd-241c66f12350', 'be696f43-8541-4eb4-a838-dedd5db30db0', 22, N'اليوم 22', N'وصف تفصيلي لجولات اليوم رقم 22 في المالديف رونق ترافل 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('a8caea28-0491-4b6b-8929-a4778bbc3524', 'be696f43-8541-4eb4-a838-dedd5db30db0', 23, N'اليوم 23', N'وصف تفصيلي لجولات اليوم رقم 23 في المالديف رونق ترافل 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('c520a418-df80-44ae-a615-5e2075140232', 'be696f43-8541-4eb4-a838-dedd5db30db0', 24, N'اليوم 24', N'وصف تفصيلي لجولات اليوم رقم 24 في المالديف رونق ترافل 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('d0f283ea-af29-444f-94c6-f62c3b849663', 'be696f43-8541-4eb4-a838-dedd5db30db0', 25, N'اليوم 25', N'وصف تفصيلي لجولات اليوم رقم 25 في المالديف رونق ترافل 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('767f4ef4-d7d7-408f-8228-80584b5ad2db', 'be696f43-8541-4eb4-a838-dedd5db30db0', 26, N'اليوم 26', N'وصف تفصيلي لجولات اليوم رقم 26 في المالديف رونق ترافل 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('d7757961-277d-4179-8335-724f1fe276c9', 'be696f43-8541-4eb4-a838-dedd5db30db0', 27, N'اليوم 27', N'وصف تفصيلي لجولات اليوم رقم 27 في المالديف رونق ترافل 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('abb54609-5906-4a57-81e4-d4f2949252cb', 'be696f43-8541-4eb4-a838-dedd5db30db0', 28, N'اليوم 28', N'وصف تفصيلي لجولات اليوم رقم 28 في المالديف رونق ترافل 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('12c65d02-cbd8-4e66-a895-7e0aca8c8db3', 'be696f43-8541-4eb4-a838-dedd5db30db0', 29, N'اليوم 29', N'وصف تفصيلي لجولات اليوم رقم 29 في المالديف رونق ترافل 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('63e13f3f-b5c3-4a82-bb76-e0702c90eacb', 'be696f43-8541-4eb4-a838-dedd5db30db0', 30, N'اليوم 30', N'وصف تفصيلي لجولات اليوم رقم 30 في المالديف رونق ترافل 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('d4818a0d-beba-4716-aff6-52285d27ed25', 'be696f43-8541-4eb4-a838-dedd5db30db0', N'فندق الملحم الفاخر - المالديف رونق ترافل 2026', N'المالديف رونق ترافل 2026', 5, 0, N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('6394b83c-368f-47ef-b1c3-ecda7c7a36cf', 'be696f43-8541-4eb4-a838-dedd5db30db0', N'مسار رحلة ممتاز');
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-المالديف-رونق-ترافل-2026-5-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('bb8dd1f9-1cc7-44cb-b1f8-a9d063396ca5', N'pkg-المالديف-رونق-ترافل-2026-5-days', @Dest_0, N'بكج المالديف رونق ترافل 2026 الساحرة - منتجع برينيا المالديف 5 أيام', N'Amazing جزر المالديف 5 Days Deal', N'استمتع بـ 4 ليالي من الرفاهية في منتجع كانديما وغيرها', 3750, N'ر.س', N'5 أيام / 4 ليالي', 5, 4, N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 0, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('b9bc273c-1a4a-468d-a0db-59a78892b77a', 'bb8dd1f9-1cc7-44cb-b1f8-a9d063396ca5', 1, N'اليوم 1', N'الاستقبال في مطار المالديف، والانتقال عبر الطيران الداخلي والقارب السريع إلى منتجع كانديما وتسجيل الدخول للبدء في إقامة مميزة تشمل وجبتي الإفطار والعشاء.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('d67c3de4-2b20-49c0-8935-7e2c6716c84d', 'bb8dd1f9-1cc7-44cb-b1f8-a9d063396ca5', 2, N'اليوم 2', N'الاستمتاع بجلسة تصوير مجانية لمدة 20 دقيقة في استوديو ''Snap'' لتوثيق أجمل الذكريات، وتجربة الإفطار العائم الاستثنائية لضيوف الفلل التي تحتوي على مسبح.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('bf246a15-cc43-475b-81c1-dd14e0c90e6d', 'bb8dd1f9-1cc7-44cb-b1f8-a9d063396ca5', 3, N'اليوم 3', N'الانطلاق في رحلة قارب (صباحية أو مسائية) إلى الشعاب المرجانية الخاصة بالفندق لتجربة غوص (سنوركلينج) لا تُنسى وسط الحياة البحرية الخلابة.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('c3e51de3-834f-4808-91d2-d94620b178e6', 'bb8dd1f9-1cc7-44cb-b1f8-a9d063396ca5', 4, N'اليوم 4', N'الاستمتاع برحلة كروز استكشافية لمدة ساعة كاملة، وقضاء أمسية ساحرة مع ليلة السينما الجماعية تحت النجوم.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('3d7a6216-dc81-49f6-9bcf-d662c9c3a61d', 'bb8dd1f9-1cc7-44cb-b1f8-a9d063396ca5', 5, N'اليوم 5', N'تسجيل الخروج من المنتجع مع الاستفادة من الخصومات الإضافية على المطاعم، ثم الانتقال للمطار لرحلة العودة.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('793dba33-958c-4623-b764-20719cb88caf', 'bb8dd1f9-1cc7-44cb-b1f8-a9d063396ca5', N'منتجع كانديما', N'', 4, 0, N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('11364834-d848-4a52-a23e-6e8f4a671066', 'bb8dd1f9-1cc7-44cb-b1f8-a9d063396ca5', N'مسار رحلة ممتاز');
END

DECLARE @Dest_1 UNIQUEIDENTIFIER;
SELECT @Dest_1 = Id FROM Destinations WHERE NameAr = N'اندونيسيا FLY 29';
IF @Dest_1 IS NULL
BEGIN
    SET @Dest_1 = NEWID();
    INSERT INTO Destinations (Id, NameAr, NameEn, Slug, Country, ImageUrl, Description, IsActive, SortOrder)
    VALUES (@Dest_1, N'اندونيسيا FLY 29', N'Destination En', N'اندونيسيا-fly-29', N'اندونيسيا FLY 29', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop', N'اكتشف جمال وعراقة اندونيسيا FLY 29 مع برامج الملحم السياحية الفاخرة المميزة.', 1, 100);
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-اندونيسيا-fly-29-12-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('e617abe7-6375-4cdd-ac72-e7aea63604f1', N'pkg-اندونيسيا-fly-29-12-days', @Dest_1, N'بكج اندونيسيا FLY 29 الساحرة - عرض  يوم   ليليه 12 أيام', N'Amazing اندونيسيا FLY 29 12 Days Package', N'استمتع بـ 11 ليالي من الرفاهية في أفضل فنادق اندونيسيا FLY 29', 6900, N'ر.س', N'12 أيام / 11 ليالي', 12, 11, N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 1, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('168fc1f4-9fb1-4492-ac76-8889328f001b', 'e617abe7-6375-4cdd-ac72-e7aea63604f1', 1, N'اليوم 1', N'وصف تفصيلي لجولات اليوم رقم 1 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('91b6f3fc-ce1b-4327-afb5-424e96960a90', 'e617abe7-6375-4cdd-ac72-e7aea63604f1', 2, N'اليوم 2', N'وصف تفصيلي لجولات اليوم رقم 2 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('c80612a0-a2c0-4f34-ad2e-6fe1172a88cd', 'e617abe7-6375-4cdd-ac72-e7aea63604f1', 3, N'اليوم 3', N'وصف تفصيلي لجولات اليوم رقم 3 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('93f92c99-db23-408a-8963-eaffaee0478e', 'e617abe7-6375-4cdd-ac72-e7aea63604f1', 4, N'اليوم 4', N'وصف تفصيلي لجولات اليوم رقم 4 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('c9769133-f56b-4468-909f-7d0b452cd828', 'e617abe7-6375-4cdd-ac72-e7aea63604f1', 5, N'اليوم 5', N'وصف تفصيلي لجولات اليوم رقم 5 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('cbe3891b-cde5-4816-9684-e74d40e744c2', 'e617abe7-6375-4cdd-ac72-e7aea63604f1', 6, N'اليوم 6', N'وصف تفصيلي لجولات اليوم رقم 6 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('4ce49913-9b02-4827-9902-76ec22d7509b', 'e617abe7-6375-4cdd-ac72-e7aea63604f1', 7, N'اليوم 7', N'وصف تفصيلي لجولات اليوم رقم 7 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('223e32e7-5b59-445d-b26d-6a10155487eb', 'e617abe7-6375-4cdd-ac72-e7aea63604f1', 8, N'اليوم 8', N'وصف تفصيلي لجولات اليوم رقم 8 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('e120b28e-0e0f-4bed-82cb-bb69ceb50972', 'e617abe7-6375-4cdd-ac72-e7aea63604f1', 9, N'اليوم 9', N'وصف تفصيلي لجولات اليوم رقم 9 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('e3668729-23bc-4334-8d4f-10dae55e62c7', 'e617abe7-6375-4cdd-ac72-e7aea63604f1', 10, N'اليوم 10', N'وصف تفصيلي لجولات اليوم رقم 10 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('8efe2645-f809-49a0-a9a8-2e3a2ad43eb6', 'e617abe7-6375-4cdd-ac72-e7aea63604f1', 11, N'اليوم 11', N'وصف تفصيلي لجولات اليوم رقم 11 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('e1b6121b-1c42-4e90-922b-bd54d058bc9b', 'e617abe7-6375-4cdd-ac72-e7aea63604f1', 12, N'اليوم 12', N'وصف تفصيلي لجولات اليوم رقم 12 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('15acdfaa-f417-42fa-abd2-21d6e28fe1f9', 'e617abe7-6375-4cdd-ac72-e7aea63604f1', N'فندق الملحم الفاخر - اندونيسيا FLY 29', N'اندونيسيا FLY 29', 5, 0, N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('807a97eb-8669-40a6-8d49-cc7765e182ad', 'e617abe7-6375-4cdd-ac72-e7aea63604f1', N'مسار رحلة ممتاز');
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-اندونيسيا-fly-29-10-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('3d9ee873-d907-4e99-8ccb-fcb57b31e06e', N'pkg-اندونيسيا-fly-29-10-days', @Dest_1, N'بكج اندونيسيا FLY 29 الساحرة - عرض اندونيسيا  ايام   ليالي 10 أيام', N'Amazing اندونيسيا FLY 29 10 Days Package', N'استمتع بـ 9 ليالي من الرفاهية في أفضل فنادق اندونيسيا FLY 29', 6000, N'ر.س', N'10 أيام / 9 ليالي', 10, 9, N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 1, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('e48b22a7-58cb-432b-80bb-710ad72a0210', '3d9ee873-d907-4e99-8ccb-fcb57b31e06e', 1, N'اليوم 1', N'وصف تفصيلي لجولات اليوم رقم 1 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('ffb658da-4348-416a-8b75-19df70c3d7ac', '3d9ee873-d907-4e99-8ccb-fcb57b31e06e', 2, N'اليوم 2', N'وصف تفصيلي لجولات اليوم رقم 2 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('61fd435e-dfbc-4108-b1e5-8134633b9770', '3d9ee873-d907-4e99-8ccb-fcb57b31e06e', 3, N'اليوم 3', N'وصف تفصيلي لجولات اليوم رقم 3 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('a1ead117-7776-4be7-98cf-5836c4a8bde3', '3d9ee873-d907-4e99-8ccb-fcb57b31e06e', 4, N'اليوم 4', N'وصف تفصيلي لجولات اليوم رقم 4 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('3096df42-b3cd-44fb-92d4-380db679d295', '3d9ee873-d907-4e99-8ccb-fcb57b31e06e', 5, N'اليوم 5', N'وصف تفصيلي لجولات اليوم رقم 5 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('0fda46ca-b510-4400-88d6-355a01d36233', '3d9ee873-d907-4e99-8ccb-fcb57b31e06e', 6, N'اليوم 6', N'وصف تفصيلي لجولات اليوم رقم 6 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('6b20912c-ef9f-4745-97e7-54f11608d3da', '3d9ee873-d907-4e99-8ccb-fcb57b31e06e', 7, N'اليوم 7', N'وصف تفصيلي لجولات اليوم رقم 7 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('427ca3e9-8fb1-4fe0-be7f-11f9bf697e3a', '3d9ee873-d907-4e99-8ccb-fcb57b31e06e', 8, N'اليوم 8', N'وصف تفصيلي لجولات اليوم رقم 8 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('07531a97-cf92-4c0a-9ce3-ef3c7b7e70e4', '3d9ee873-d907-4e99-8ccb-fcb57b31e06e', 9, N'اليوم 9', N'وصف تفصيلي لجولات اليوم رقم 9 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('dd9420b9-502c-44c0-8d5e-ea3dd13538e1', '3d9ee873-d907-4e99-8ccb-fcb57b31e06e', 10, N'اليوم 10', N'وصف تفصيلي لجولات اليوم رقم 10 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('db0cff4e-7a90-4edc-85f7-2c10ffcfd788', '3d9ee873-d907-4e99-8ccb-fcb57b31e06e', N'فندق الملحم الفاخر - اندونيسيا FLY 29', N'اندونيسيا FLY 29', 5, 0, N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('6b67ba23-5e75-4486-8788-cf2e129437b3', '3d9ee873-d907-4e99-8ccb-fcb57b31e06e', N'مسار رحلة ممتاز');
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-اندونيسيا-fly-29-11-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('2a0ecdab-fc30-4573-befa-0d48cdf2ddd9', N'pkg-اندونيسيا-fly-29-11-days', @Dest_1, N'بكج اندونيسيا FLY 29 الساحرة - عرض اندونيسيا  يوم   ليالي 11 أيام', N'Amazing اندونيسيا FLY 29 11 Days Package', N'استمتع بـ 10 ليالي من الرفاهية في أفضل فنادق اندونيسيا FLY 29', 6450, N'ر.س', N'11 أيام / 10 ليالي', 11, 10, N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 1, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('78466f02-1ded-4254-a590-645b80ca244a', '2a0ecdab-fc30-4573-befa-0d48cdf2ddd9', 1, N'اليوم 1', N'وصف تفصيلي لجولات اليوم رقم 1 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('90fc87e7-5f77-47dc-b3d3-a70faefa8b3a', '2a0ecdab-fc30-4573-befa-0d48cdf2ddd9', 2, N'اليوم 2', N'وصف تفصيلي لجولات اليوم رقم 2 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('af1db9d5-7990-49b6-ad7f-35dd5f44a130', '2a0ecdab-fc30-4573-befa-0d48cdf2ddd9', 3, N'اليوم 3', N'وصف تفصيلي لجولات اليوم رقم 3 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('dd459556-35ab-4010-ac09-f44500bdbef5', '2a0ecdab-fc30-4573-befa-0d48cdf2ddd9', 4, N'اليوم 4', N'وصف تفصيلي لجولات اليوم رقم 4 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('b5ce8aa4-dd44-4c33-9436-42bd08772155', '2a0ecdab-fc30-4573-befa-0d48cdf2ddd9', 5, N'اليوم 5', N'وصف تفصيلي لجولات اليوم رقم 5 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('d6dab489-8da3-4f87-960e-ef8d91131d20', '2a0ecdab-fc30-4573-befa-0d48cdf2ddd9', 6, N'اليوم 6', N'وصف تفصيلي لجولات اليوم رقم 6 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('de9d8bd3-b875-4ae7-b5ab-e3fd16ef509d', '2a0ecdab-fc30-4573-befa-0d48cdf2ddd9', 7, N'اليوم 7', N'وصف تفصيلي لجولات اليوم رقم 7 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('970b9fd7-6eb2-4330-a9d3-e7458583d11a', '2a0ecdab-fc30-4573-befa-0d48cdf2ddd9', 8, N'اليوم 8', N'وصف تفصيلي لجولات اليوم رقم 8 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('8a0cb039-e03d-4e3d-abf6-feb1389ef839', '2a0ecdab-fc30-4573-befa-0d48cdf2ddd9', 9, N'اليوم 9', N'وصف تفصيلي لجولات اليوم رقم 9 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('4bef8fa0-35da-43d2-824d-1969c5b5f221', '2a0ecdab-fc30-4573-befa-0d48cdf2ddd9', 10, N'اليوم 10', N'وصف تفصيلي لجولات اليوم رقم 10 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('635c9d9d-52e9-44d9-a647-e5c1ef914413', '2a0ecdab-fc30-4573-befa-0d48cdf2ddd9', 11, N'اليوم 11', N'وصف تفصيلي لجولات اليوم رقم 11 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('81c98474-9e97-4a0c-81c0-9019f68e2b74', '2a0ecdab-fc30-4573-befa-0d48cdf2ddd9', N'فندق الملحم الفاخر - اندونيسيا FLY 29', N'اندونيسيا FLY 29', 5, 0, N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('8b0d697e-4dfc-4581-afcb-2a9dc226cddb', '2a0ecdab-fc30-4573-befa-0d48cdf2ddd9', N'مسار رحلة ممتاز');
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-اندونيسيا-fly-29-13-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('3091d614-547f-4274-98eb-74ddb0a654ce', N'pkg-اندونيسيا-fly-29-13-days', @Dest_1, N'بكج اندونيسيا FLY 29 الساحرة - عرض اندونيسيا  يوم   ليلة 13 أيام', N'Amazing اندونيسيا FLY 29 13 Days Package', N'استمتع بـ 12 ليالي من الرفاهية في أفضل فنادق اندونيسيا FLY 29', 7350, N'ر.س', N'13 أيام / 12 ليالي', 13, 12, N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 1, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('3333a208-bb9c-4e3a-938d-7017c4102941', '3091d614-547f-4274-98eb-74ddb0a654ce', 1, N'اليوم 1', N'وصف تفصيلي لجولات اليوم رقم 1 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('25db7649-e965-495d-b2a4-a4d6d9f6d40a', '3091d614-547f-4274-98eb-74ddb0a654ce', 2, N'اليوم 2', N'وصف تفصيلي لجولات اليوم رقم 2 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('a67e63cd-38fa-419a-9b9b-fc2d529686de', '3091d614-547f-4274-98eb-74ddb0a654ce', 3, N'اليوم 3', N'وصف تفصيلي لجولات اليوم رقم 3 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('34ffd6e7-71ac-46d1-afb0-fcb301f31249', '3091d614-547f-4274-98eb-74ddb0a654ce', 4, N'اليوم 4', N'وصف تفصيلي لجولات اليوم رقم 4 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('39c02a3d-8a7f-45d7-85c4-f9fe499f205b', '3091d614-547f-4274-98eb-74ddb0a654ce', 5, N'اليوم 5', N'وصف تفصيلي لجولات اليوم رقم 5 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('9c3b84c5-681c-4db1-b202-6ad222a4a2e2', '3091d614-547f-4274-98eb-74ddb0a654ce', 6, N'اليوم 6', N'وصف تفصيلي لجولات اليوم رقم 6 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('2a9efb8c-3987-45ab-ba72-04c8ceaec0f4', '3091d614-547f-4274-98eb-74ddb0a654ce', 7, N'اليوم 7', N'وصف تفصيلي لجولات اليوم رقم 7 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('b7591d3d-c1b0-4331-b422-69121cbc1093', '3091d614-547f-4274-98eb-74ddb0a654ce', 8, N'اليوم 8', N'وصف تفصيلي لجولات اليوم رقم 8 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('96e84784-c54c-432e-8df8-3bc920b5f101', '3091d614-547f-4274-98eb-74ddb0a654ce', 9, N'اليوم 9', N'وصف تفصيلي لجولات اليوم رقم 9 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('d4478917-962a-4722-9e0a-4dc83d6c0fe6', '3091d614-547f-4274-98eb-74ddb0a654ce', 10, N'اليوم 10', N'وصف تفصيلي لجولات اليوم رقم 10 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('df783c20-10e5-4d65-822c-afd4903dad0b', '3091d614-547f-4274-98eb-74ddb0a654ce', 11, N'اليوم 11', N'وصف تفصيلي لجولات اليوم رقم 11 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('8049ae23-6997-4eec-9e13-1d562c9a1b6e', '3091d614-547f-4274-98eb-74ddb0a654ce', 12, N'اليوم 12', N'وصف تفصيلي لجولات اليوم رقم 12 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('94605046-209c-412c-a961-c4c813e039a7', '3091d614-547f-4274-98eb-74ddb0a654ce', 13, N'اليوم 13', N'وصف تفصيلي لجولات اليوم رقم 13 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('6c5a22e9-03f4-4d08-b6ed-51ac05423540', '3091d614-547f-4274-98eb-74ddb0a654ce', N'فندق الملحم الفاخر - اندونيسيا FLY 29', N'اندونيسيا FLY 29', 5, 0, N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('5ae7b774-2908-4344-98eb-5980683ed51e', '3091d614-547f-4274-98eb-74ddb0a654ce', N'مسار رحلة ممتاز');
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-اندونيسيا-fly-29-14-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('637e7a91-b5f3-40db-a495-9cad4adbe258', N'pkg-اندونيسيا-fly-29-14-days', @Dest_1, N'بكج اندونيسيا FLY 29 الساحرة - عرض اندونيسيا  يوم   ليلة 14 أيام', N'Amazing اندونيسيا FLY 29 14 Days Package', N'استمتع بـ 13 ليالي من الرفاهية في أفضل فنادق اندونيسيا FLY 29', 7800, N'ر.س', N'14 أيام / 13 ليالي', 14, 13, N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 1, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('44ee4bca-1033-4b5b-a9e7-35f94b7a84a9', '637e7a91-b5f3-40db-a495-9cad4adbe258', 1, N'اليوم 1', N'وصف تفصيلي لجولات اليوم رقم 1 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('38afef7d-e016-4770-b4f8-9f6807721eec', '637e7a91-b5f3-40db-a495-9cad4adbe258', 2, N'اليوم 2', N'وصف تفصيلي لجولات اليوم رقم 2 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('36f2504d-9822-4cde-9548-988b8a9e798f', '637e7a91-b5f3-40db-a495-9cad4adbe258', 3, N'اليوم 3', N'وصف تفصيلي لجولات اليوم رقم 3 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('7099579a-af92-4b0e-b029-a1ac57b728b2', '637e7a91-b5f3-40db-a495-9cad4adbe258', 4, N'اليوم 4', N'وصف تفصيلي لجولات اليوم رقم 4 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('9fe658eb-449c-476c-80d6-8080780a43dd', '637e7a91-b5f3-40db-a495-9cad4adbe258', 5, N'اليوم 5', N'وصف تفصيلي لجولات اليوم رقم 5 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('9e94c351-eecb-410f-ae71-f35098718d0a', '637e7a91-b5f3-40db-a495-9cad4adbe258', 6, N'اليوم 6', N'وصف تفصيلي لجولات اليوم رقم 6 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('cde2937a-0957-4cab-911f-815d18ff15dd', '637e7a91-b5f3-40db-a495-9cad4adbe258', 7, N'اليوم 7', N'وصف تفصيلي لجولات اليوم رقم 7 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('517212fc-67a5-402d-ab7c-27220dea43ae', '637e7a91-b5f3-40db-a495-9cad4adbe258', 8, N'اليوم 8', N'وصف تفصيلي لجولات اليوم رقم 8 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('4cd821ad-a9d4-4c9d-9c32-2d438c8a972f', '637e7a91-b5f3-40db-a495-9cad4adbe258', 9, N'اليوم 9', N'وصف تفصيلي لجولات اليوم رقم 9 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('06a5ab65-a03b-4656-8bf7-b7292a29d5c4', '637e7a91-b5f3-40db-a495-9cad4adbe258', 10, N'اليوم 10', N'وصف تفصيلي لجولات اليوم رقم 10 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('b906278a-dd2e-4b92-92f2-40d1a368568d', '637e7a91-b5f3-40db-a495-9cad4adbe258', 11, N'اليوم 11', N'وصف تفصيلي لجولات اليوم رقم 11 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('dae122a1-305f-4843-b3c4-121dc7741bf0', '637e7a91-b5f3-40db-a495-9cad4adbe258', 12, N'اليوم 12', N'وصف تفصيلي لجولات اليوم رقم 12 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('1d860256-09bb-4b5d-9a6c-50d85f787517', '637e7a91-b5f3-40db-a495-9cad4adbe258', 13, N'اليوم 13', N'وصف تفصيلي لجولات اليوم رقم 13 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('aa610cff-c142-4d57-87cd-1c3fe36f2ebf', '637e7a91-b5f3-40db-a495-9cad4adbe258', 14, N'اليوم 14', N'وصف تفصيلي لجولات اليوم رقم 14 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('837650f7-bb8e-4a3a-8f10-ac13556da3cf', '637e7a91-b5f3-40db-a495-9cad4adbe258', N'فندق الملحم الفاخر - اندونيسيا FLY 29', N'اندونيسيا FLY 29', 5, 0, N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('27528e1c-156b-4e71-9083-2dcd9c90f7ef', '637e7a91-b5f3-40db-a495-9cad4adbe258', N'مسار رحلة ممتاز');
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-اندونيسيا-fly-29-15-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('97c06601-9560-4bc1-9b74-91a50160647d', N'pkg-اندونيسيا-fly-29-15-days', @Dest_1, N'بكج اندونيسيا FLY 29 الساحرة - عرض اندونيسيا  يوم   ليلة 15 أيام', N'Amazing اندونيسيا FLY 29 15 Days Package', N'استمتع بـ 14 ليالي من الرفاهية في أفضل فنادق اندونيسيا FLY 29', 8250, N'ر.س', N'15 أيام / 14 ليالي', 15, 14, N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 1, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('c0345020-9f2b-4437-9469-113527cefda5', '97c06601-9560-4bc1-9b74-91a50160647d', 1, N'اليوم 1', N'وصف تفصيلي لجولات اليوم رقم 1 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('259dfca2-8d8c-47a7-9375-46d7d0f27bfe', '97c06601-9560-4bc1-9b74-91a50160647d', 2, N'اليوم 2', N'وصف تفصيلي لجولات اليوم رقم 2 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('481a74e2-cc38-47a6-8e8c-a9d0b6fead94', '97c06601-9560-4bc1-9b74-91a50160647d', 3, N'اليوم 3', N'وصف تفصيلي لجولات اليوم رقم 3 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('ab82a770-fd69-49b6-ad95-6cb19ce2d72c', '97c06601-9560-4bc1-9b74-91a50160647d', 4, N'اليوم 4', N'وصف تفصيلي لجولات اليوم رقم 4 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('232228bc-b879-48bc-985c-7f7e6e5558e4', '97c06601-9560-4bc1-9b74-91a50160647d', 5, N'اليوم 5', N'وصف تفصيلي لجولات اليوم رقم 5 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('920d4c6e-1621-4e53-a962-d91c8cb986bd', '97c06601-9560-4bc1-9b74-91a50160647d', 6, N'اليوم 6', N'وصف تفصيلي لجولات اليوم رقم 6 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('937f2cec-2e6a-4421-b43f-06be644d45b2', '97c06601-9560-4bc1-9b74-91a50160647d', 7, N'اليوم 7', N'وصف تفصيلي لجولات اليوم رقم 7 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('c57642cc-000b-4f02-9ac8-26391f86b01b', '97c06601-9560-4bc1-9b74-91a50160647d', 8, N'اليوم 8', N'وصف تفصيلي لجولات اليوم رقم 8 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('99d9cd40-fb20-4b50-ae2d-886c0d128d64', '97c06601-9560-4bc1-9b74-91a50160647d', 9, N'اليوم 9', N'وصف تفصيلي لجولات اليوم رقم 9 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('3add066d-fe3a-41ca-9775-60d51eb462dd', '97c06601-9560-4bc1-9b74-91a50160647d', 10, N'اليوم 10', N'وصف تفصيلي لجولات اليوم رقم 10 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('162fee65-6913-4c14-bb32-b25e08e35f1d', '97c06601-9560-4bc1-9b74-91a50160647d', 11, N'اليوم 11', N'وصف تفصيلي لجولات اليوم رقم 11 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('610dfeb6-8a26-4c35-9f40-c006daf575f0', '97c06601-9560-4bc1-9b74-91a50160647d', 12, N'اليوم 12', N'وصف تفصيلي لجولات اليوم رقم 12 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('3fc99b75-7a90-4e74-be4a-5c9c9340029f', '97c06601-9560-4bc1-9b74-91a50160647d', 13, N'اليوم 13', N'وصف تفصيلي لجولات اليوم رقم 13 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('e5827d33-dcf4-4ba5-b0c7-e3a1c59f5e26', '97c06601-9560-4bc1-9b74-91a50160647d', 14, N'اليوم 14', N'وصف تفصيلي لجولات اليوم رقم 14 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('54b7555e-30fa-47e8-ab9b-0d76d6c82c48', '97c06601-9560-4bc1-9b74-91a50160647d', 15, N'اليوم 15', N'وصف تفصيلي لجولات اليوم رقم 15 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('05233f88-5c96-4aeb-9bab-e6f49153379c', '97c06601-9560-4bc1-9b74-91a50160647d', N'فندق الملحم الفاخر - اندونيسيا FLY 29', N'اندونيسيا FLY 29', 5, 0, N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('30c7c091-1f90-4cd8-99cf-c5734d5df5cc', '97c06601-9560-4bc1-9b74-91a50160647d', N'مسار رحلة ممتاز');
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-اندونيسيا-fly-29-6-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('2f3ac435-4035-42b3-9642-69a3500d1b43', N'pkg-اندونيسيا-fly-29-6-days', @Dest_1, N'بكج اندونيسيا FLY 29 الساحرة - عرض اندونيسيا  ايام   ليالي 6 أيام', N'Amazing اندونيسيا  6 Days Deal', N'استمتع بـ 5 ليالي من الرفاهية في فندق و منتجع جراند استون - بونشاك  وغيرها', 4200, N'ر.س', N'6 أيام / 5 ليالي', 6, 5, N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 1, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('29167cff-fc5d-43c6-b733-438f586dc9a0', '2f3ac435-4035-42b3-9642-69a3500d1b43', 1, N'اليوم 1', N'استقبال دولي في مطار جاكرتا والتوصيل المريح والآمن إلى فندق الإقامة في بونشاك لتسجيل الدخول والراحة.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('20cad785-8be2-4c34-abe6-933b3beb4f7f', '2f3ac435-4035-42b3-9642-69a3500d1b43', 2, N'اليوم 2', N'جولة رائعة لاستكشاف أهم المعالم السياحية في بونشاك، تتضمن زيارة حديقة الزهور، حديقة تشيبوادس، بحيرة فينيسيا، الاستمتاع بتجربة البارشوت، وزيارة حديقة مرليبا ومزارع الشاي الخضراء.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('e078014e-f6e8-43f7-8aa7-fe466917b10a', '2f3ac435-4035-42b3-9642-69a3500d1b43', 3, N'اليوم 3', N'تسجيل الخروج والانتقال البري المريح بسيارة وسائق خاص من طبيعة بونشاك الخلابة إلى العاصمة جاكرتا.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('6837ac4d-0c21-4ba2-8e81-efa2e56ad7cd', '2f3ac435-4035-42b3-9642-69a3500d1b43', 4, N'اليوم 4', N'جولة سياحية ممتعة في جاكرتا لزيارة برج موناس الشهير، وقضاء وقت ترفيهي في متنزه أنشول لمشاهدة عروض الدلافين المذهلة وزيارة عالم ما تحت البحار.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('007834ac-5264-4ecb-9281-03b336baac81', '2f3ac435-4035-42b3-9642-69a3500d1b43', 5, N'اليوم 5', N'يوم حر بالكامل مخصص للراحة والاستجمام أو لاكتشاف المدينة بحرية (بدون سائق).', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('657694a2-bd2e-428d-9437-bd60f2369654', '2f3ac435-4035-42b3-9642-69a3500d1b43', 6, N'اليوم 6', N'نهاية الرحلة الممتعة، حيث يتم التوديع والتوصيل إلى المطار في العاصمة جاكرتا للعودة إلى الديار بسلامة الله.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('45f932fd-763f-406e-af16-bd92f7f7a05c', '2f3ac435-4035-42b3-9642-69a3500d1b43', N'فندق و منتجع جراند استون - بونشاك ', N'بونشاك', 4, 0, N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('bed651ad-98bb-45a8-bc84-8061f8792453', '2f3ac435-4035-42b3-9642-69a3500d1b43', N'مارلين بارك هوتيل جاكرتا - جاكرتا ', N'جاكرتا', 4, 0, N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop', 2);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('2b822c88-32ae-41a3-972e-23794421e0c9', '2f3ac435-4035-42b3-9642-69a3500d1b43', N'مسار رحلة ممتاز');
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-اندونيسيا-fly-29-7-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('3982c8e5-1c6d-4029-8bd2-2ebec9a91e5c', N'pkg-اندونيسيا-fly-29-7-days', @Dest_1, N'بكج اندونيسيا FLY 29 الساحرة - عرض اندونيسيا  ايام   ليالي 7 أيام', N'Amazing اندونيسيا FLY 29 7 Days Package', N'استمتع بـ 6 ليالي من الرفاهية في أفضل فنادق اندونيسيا FLY 29', 4650, N'ر.س', N'7 أيام / 6 ليالي', 7, 6, N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 1, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('9166f9b4-9ed7-4f3a-81ff-b13943cda97c', '3982c8e5-1c6d-4029-8bd2-2ebec9a91e5c', 1, N'اليوم 1', N'وصف تفصيلي لجولات اليوم رقم 1 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('7f86c012-f4c1-47a6-b7a7-45a74ad0bb86', '3982c8e5-1c6d-4029-8bd2-2ebec9a91e5c', 2, N'اليوم 2', N'وصف تفصيلي لجولات اليوم رقم 2 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('0996aa30-6bcb-4ebe-8709-44df683d2bea', '3982c8e5-1c6d-4029-8bd2-2ebec9a91e5c', 3, N'اليوم 3', N'وصف تفصيلي لجولات اليوم رقم 3 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('fe82a297-71bc-4d2c-98bb-311fd87b92a4', '3982c8e5-1c6d-4029-8bd2-2ebec9a91e5c', 4, N'اليوم 4', N'وصف تفصيلي لجولات اليوم رقم 4 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('483c165a-335b-4b76-ac50-d6410e09ff85', '3982c8e5-1c6d-4029-8bd2-2ebec9a91e5c', 5, N'اليوم 5', N'وصف تفصيلي لجولات اليوم رقم 5 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('102c5d90-ae44-456c-a7b3-2a6967a474c7', '3982c8e5-1c6d-4029-8bd2-2ebec9a91e5c', 6, N'اليوم 6', N'وصف تفصيلي لجولات اليوم رقم 6 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('9c482565-5927-4c23-a427-177fa42d9f1d', '3982c8e5-1c6d-4029-8bd2-2ebec9a91e5c', 7, N'اليوم 7', N'وصف تفصيلي لجولات اليوم رقم 7 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('d5865fb2-e43c-4b61-9b9c-16a95a9a036c', '3982c8e5-1c6d-4029-8bd2-2ebec9a91e5c', N'فندق الملحم الفاخر - اندونيسيا FLY 29', N'اندونيسيا FLY 29', 5, 0, N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('37b8c73f-a1e8-4fed-915b-14e95b46b6cc', '3982c8e5-1c6d-4029-8bd2-2ebec9a91e5c', N'مسار رحلة ممتاز');
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-اندونيسيا-fly-29-8-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('2d624176-b069-4598-b6ae-01e90838c2ef', N'pkg-اندونيسيا-fly-29-8-days', @Dest_1, N'بكج اندونيسيا FLY 29 الساحرة - عرض اندونيسيا  ايام   ليالي 8 أيام', N'Amazing اندونيسيا FLY 29 8 Days Package', N'استمتع بـ 7 ليالي من الرفاهية في أفضل فنادق اندونيسيا FLY 29', 5100, N'ر.س', N'8 أيام / 7 ليالي', 8, 7, N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 1, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('58cd1a8c-1db4-477d-9b34-42fccd0222ad', '2d624176-b069-4598-b6ae-01e90838c2ef', 1, N'اليوم 1', N'وصف تفصيلي لجولات اليوم رقم 1 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('7e16bb14-12f8-4b9d-ab02-b717c448e615', '2d624176-b069-4598-b6ae-01e90838c2ef', 2, N'اليوم 2', N'وصف تفصيلي لجولات اليوم رقم 2 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('5dfca5a5-cc81-4536-83f9-8831ab09b24c', '2d624176-b069-4598-b6ae-01e90838c2ef', 3, N'اليوم 3', N'وصف تفصيلي لجولات اليوم رقم 3 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('93c934d3-2837-45de-8cd4-f0d34e0f797f', '2d624176-b069-4598-b6ae-01e90838c2ef', 4, N'اليوم 4', N'وصف تفصيلي لجولات اليوم رقم 4 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('b67b0639-56cd-4b4c-9b49-68b6839367df', '2d624176-b069-4598-b6ae-01e90838c2ef', 5, N'اليوم 5', N'وصف تفصيلي لجولات اليوم رقم 5 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('8ca2c2a0-8051-4271-acc3-70e40993a8f3', '2d624176-b069-4598-b6ae-01e90838c2ef', 6, N'اليوم 6', N'وصف تفصيلي لجولات اليوم رقم 6 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('6f5a7287-72ff-411a-a024-8c6f281a02a7', '2d624176-b069-4598-b6ae-01e90838c2ef', 7, N'اليوم 7', N'وصف تفصيلي لجولات اليوم رقم 7 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('acd2f8b2-7d91-44ca-a4b4-d3aeda87f286', '2d624176-b069-4598-b6ae-01e90838c2ef', 8, N'اليوم 8', N'وصف تفصيلي لجولات اليوم رقم 8 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('5440e607-1d0e-44cc-a3be-bf4146e5528c', '2d624176-b069-4598-b6ae-01e90838c2ef', N'فندق الملحم الفاخر - اندونيسيا FLY 29', N'اندونيسيا FLY 29', 5, 0, N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('8663bb28-473f-4ab6-906e-17cb472bd2e4', '2d624176-b069-4598-b6ae-01e90838c2ef', N'مسار رحلة ممتاز');
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-اندونيسيا-fly-29-9-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('0e4f6615-0dd2-4c95-91f6-3ef432147acf', N'pkg-اندونيسيا-fly-29-9-days', @Dest_1, N'بكج اندونيسيا FLY 29 الساحرة - عرض اندونيسيا  ايام   ليالي 9 أيام', N'Amazing اندونيسيا FLY 29 9 Days Package', N'استمتع بـ 8 ليالي من الرفاهية في أفضل فنادق اندونيسيا FLY 29', 5550, N'ر.س', N'9 أيام / 8 ليالي', 9, 8, N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 1, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('b9ea879f-5981-4307-8030-8a19256d7bc8', '0e4f6615-0dd2-4c95-91f6-3ef432147acf', 1, N'اليوم 1', N'وصف تفصيلي لجولات اليوم رقم 1 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('456fd269-c0e4-4249-a811-2922312c9b74', '0e4f6615-0dd2-4c95-91f6-3ef432147acf', 2, N'اليوم 2', N'وصف تفصيلي لجولات اليوم رقم 2 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('ccba364e-75ce-452a-a284-e63ade5c6e21', '0e4f6615-0dd2-4c95-91f6-3ef432147acf', 3, N'اليوم 3', N'وصف تفصيلي لجولات اليوم رقم 3 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('77b4bdc8-bfdd-425d-a934-dab997e388f1', '0e4f6615-0dd2-4c95-91f6-3ef432147acf', 4, N'اليوم 4', N'وصف تفصيلي لجولات اليوم رقم 4 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('ceee0227-aeb0-4c17-8ea6-de479747efe2', '0e4f6615-0dd2-4c95-91f6-3ef432147acf', 5, N'اليوم 5', N'وصف تفصيلي لجولات اليوم رقم 5 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('fd01907b-6afa-4dde-947e-03fc2a42984b', '0e4f6615-0dd2-4c95-91f6-3ef432147acf', 6, N'اليوم 6', N'وصف تفصيلي لجولات اليوم رقم 6 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('aefd12b8-50bc-4639-a06c-661409636716', '0e4f6615-0dd2-4c95-91f6-3ef432147acf', 7, N'اليوم 7', N'وصف تفصيلي لجولات اليوم رقم 7 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('41ac4764-04eb-48a7-bbe5-6b9dd28b6952', '0e4f6615-0dd2-4c95-91f6-3ef432147acf', 8, N'اليوم 8', N'وصف تفصيلي لجولات اليوم رقم 8 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('7f5341e9-e7a5-4ddc-aba7-951c0772f99d', '0e4f6615-0dd2-4c95-91f6-3ef432147acf', 9, N'اليوم 9', N'وصف تفصيلي لجولات اليوم رقم 9 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('60ab7255-40a6-4f15-9c9d-f2a62292b1ef', '0e4f6615-0dd2-4c95-91f6-3ef432147acf', N'فندق الملحم الفاخر - اندونيسيا FLY 29', N'اندونيسيا FLY 29', 5, 0, N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('7dc6c099-094d-4629-8537-b43674abd764', '0e4f6615-0dd2-4c95-91f6-3ef432147acf', N'مسار رحلة ممتاز');
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-اندونيسيا-fly-29-5-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('9ed3be1a-9bda-467b-93f2-f1d8b4192fca', N'pkg-اندونيسيا-fly-29-5-days', @Dest_1, N'بكج اندونيسيا FLY 29 الساحرة - عروض اندونيسيا بالريال السعودي 5 أيام', N'Amazing اندونيسيا FLY 29 5 Days Package', N'استمتع بـ 4 ليالي من الرفاهية في أفضل فنادق اندونيسيا FLY 29', 3750, N'ر.س', N'5 أيام / 4 ليالي', 5, 4, N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 1, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('bc91705a-5b16-4f71-aab6-e066d34da00b', '9ed3be1a-9bda-467b-93f2-f1d8b4192fca', 1, N'اليوم 1', N'وصف تفصيلي لجولات اليوم رقم 1 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('b777f418-980c-476b-8eb9-6fea357c0591', '9ed3be1a-9bda-467b-93f2-f1d8b4192fca', 2, N'اليوم 2', N'وصف تفصيلي لجولات اليوم رقم 2 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('a18ac0da-727d-4629-8c55-4f91add3bf33', '9ed3be1a-9bda-467b-93f2-f1d8b4192fca', 3, N'اليوم 3', N'وصف تفصيلي لجولات اليوم رقم 3 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('394c7ea9-d5b3-4779-b29a-838c01c0b20c', '9ed3be1a-9bda-467b-93f2-f1d8b4192fca', 4, N'اليوم 4', N'وصف تفصيلي لجولات اليوم رقم 4 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('66be6f48-60b9-4980-8cdd-88bd734b058c', '9ed3be1a-9bda-467b-93f2-f1d8b4192fca', 5, N'اليوم 5', N'وصف تفصيلي لجولات اليوم رقم 5 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('dbea7b73-857d-4abc-b353-8b5954100e3b', '9ed3be1a-9bda-467b-93f2-f1d8b4192fca', N'فندق الملحم الفاخر - اندونيسيا FLY 29', N'اندونيسيا FLY 29', 5, 0, N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('05d18620-f036-4023-8f21-60d2b80fcc65', '9ed3be1a-9bda-467b-93f2-f1d8b4192fca', N'مسار رحلة ممتاز');
END

DECLARE @Dest_2 UNIQUEIDENTIFIER;
SELECT @Dest_2 = Id FROM Destinations WHERE NameAr = N'بانكوك مع بوكيت 2026 FLY 29';
IF @Dest_2 IS NULL
BEGIN
    SET @Dest_2 = NEWID();
    INSERT INTO Destinations (Id, NameAr, NameEn, Slug, Country, ImageUrl, Description, IsActive, SortOrder)
    VALUES (@Dest_2, N'بانكوك مع بوكيت 2026 FLY 29', N'Destination En', N'بانكوك-مع-بوكيت-2026-fly-29', N'بانكوك مع بوكيت 2026 FLY 29', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop', N'اكتشف جمال وعراقة بانكوك مع بوكيت 2026 FLY 29 مع برامج الملحم السياحية الفاخرة المميزة.', 1, 100);
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-بانكوك-مع-بوكيت-2026-fly-29-10-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('709ad9bb-f4c4-4290-83f3-d7ceed5c993e', N'pkg-بانكوك-مع-بوكيت-2026-fly-29-10-days', @Dest_2, N'بكج بانكوك مع بوكيت 2026 FLY 29 الساحرة - عرض بوكيت  بانكوك  ايام  ليالي 10 أيام', N'Amazing بوكيت 10 Days Deal', N'استمتع بـ 9 ليالي من الرفاهية في منتجع دياموند بوكيت - جزيرة بوكيت وغيرها', 4700, N'ر.س', N'10 أيام / 9 ليالي', 10, 9, N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 1, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('cc613f05-bb1d-44db-a4b2-1234c99eee9a', '709ad9bb-f4c4-4290-83f3-d7ceed5c993e', 1, N'اليوم 1', N'الوصول بالسلامة إلى مطار بوكيت والانتقال المريح إلى المنتجع الفاخر لبدء الإجازة.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('b1de82d4-764f-4eb7-bebc-15b65c8c98e2', '709ad9bb-f4c4-4290-83f3-d7ceed5c993e', 2, N'اليوم 2', N'جولة سياحية لمعالم بوكيت تتضمن خليج بان ناه، شلال بانغ باي، الحديقة المائية جنقل سبلاش، وعالم المحيط والنمور.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('11c00e62-49f5-43fc-a177-73ce05dab7d6', '709ad9bb-f4c4-4290-83f3-d7ceed5c993e', 3, N'اليوم 3', N'جولة تشمل تمثال بوذا العملاق، بوكيت أكواريوم، حديقة الحيوانات، واستكشاف سحر المدينة القديمة.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('21d77581-a0c5-4600-9c2f-757b72d338f9', '709ad9bb-f4c4-4290-83f3-d7ceed5c993e', 4, N'اليوم 4', N'مغامرة بحرية متكاملة لجزر جيمس بوند والجزر الأربعة، مع زيارة كاتا بيتش وكهف الخفافيس.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('a49c664d-b0fe-447c-aab8-d07fa608da5a', '709ad9bb-f4c4-4290-83f3-d7ceed5c993e', 5, N'اليوم 5', N'زيارة المدينة المائية الأفضل في بوكيت لقضاء أوقات عائلية مليئة بالمرح والألعاب المائية.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('13ba4e2e-7fe7-4d1a-8ceb-d7fff4bf9885', '709ad9bb-f4c4-4290-83f3-d7ceed5c993e', 6, N'اليوم 6', N'يوم حر ومميز للاستمتاع بالطبيعة الساحرة والاسترخاء التام في جزيرة بوكيت.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('469d0a6b-336e-4db9-9bae-bcc04b7d9efa', '709ad9bb-f4c4-4290-83f3-d7ceed5c993e', 7, N'اليوم 7', N'جولة تسوق ممتعة بسيارة خاصة لاستكشاف أفضل الأسواق واقتناء المشتريات المحلية.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('c23512cd-b801-4fd6-88ca-5212d92c4ce0', '709ad9bb-f4c4-4290-83f3-d7ceed5c993e', 8, N'اليوم 8', N'جولة سياحية خاصة لزيارة محمية الفيلة الطبيعية والاستمتاع بمشاهدة عروض القرود والأفاعي المشوقة.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('6b20e9fd-f11a-486c-b005-79f5b8efc200', '709ad9bb-f4c4-4290-83f3-d7ceed5c993e', 9, N'اليوم 9', N'يوم حر للاستجمام والسباحة أو تجربة المطاعم المحلية في الجزيرة (بدون سائق).', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('af1ae2c8-55c2-4e12-80bc-703dc933c236', '709ad9bb-f4c4-4290-83f3-d7ceed5c993e', 10, N'اليوم 10', N'ختام العطلة السعيدة والتوصيل من الفندق إلى مطار بوكيت لرحلة العودة بسلامة الله.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('9ed088ed-d0da-4d24-b7f8-c6bcf79515aa', '709ad9bb-f4c4-4290-83f3-d7ceed5c993e', N'منتجع دياموند بوكيت - جزيرة بوكيت', N'جزيرة بوكيت', 4, 0, N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('41119bbc-cb85-4ef5-b123-222b5844d946', '709ad9bb-f4c4-4290-83f3-d7ceed5c993e', N'مسار رحلة ممتاز');
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-بانكوك-مع-بوكيت-2026-fly-29-11-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('e787cf4d-f13d-410a-b8b0-93b953e02e0c', N'pkg-بانكوك-مع-بوكيت-2026-fly-29-11-days', @Dest_2, N'بكج بانكوك مع بوكيت 2026 FLY 29 الساحرة - عرض بوكيت  بانكوك  يوم  ليالي 11 أيام', N'Amazing بوكيت 11 Days Deal', N'استمتع بـ 10 ليالي من الرفاهية في منتجع دياموند بوكيت - جزيرة بوكيت وغيرها', 5100, N'ر.س', N'11 أيام / 10 ليالي', 11, 10, N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 1, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('22607cf5-031c-4f81-9feb-7e0c3e9a9033', 'e787cf4d-f13d-410a-b8b0-93b953e02e0c', 1, N'اليوم 1', N'الاستقبال المميز في مطار بوكيت والتوصيل إلى فندق الإقامة للراحة والاستعداد للرحلة.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('c4a054ad-1839-4fce-99cc-3fc424a1ee79', 'e787cf4d-f13d-410a-b8b0-93b953e02e0c', 2, N'اليوم 2', N'جولة سياحية في بوكيت تشمل خليج بان ناه، الحديقة المائية، شلال بانغ باي، عالم المحيط وتل القرود.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('3949dafc-4929-417e-8fa1-627d7167a23e', 'e787cf4d-f13d-410a-b8b0-93b953e02e0c', 3, N'اليوم 3', N'استكشاف تمثال بوذا العملاق، الأكواريوم المدهش، حديقة الحيوانات، والمدينة القديمة ذات الطابع الخاص.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('76954eab-1c41-4b86-a48c-cd383dc041a9', 'e787cf4d-f13d-410a-b8b0-93b953e02e0c', 4, N'اليوم 4', N'رحلة استكشافية بحرية لجزيرة جيمس بوند الرائعة والجزر الأربعة مع تجربة سفاري استثنائية.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('7e53b7c1-dead-4958-8a40-1629062f31c7', 'e787cf4d-f13d-410a-b8b0-93b953e02e0c', 5, N'اليوم 5', N'يوم ترفيهي مليء بالنشاط في المدينة المائية الكبرى والتي تحاكي في تصميمها 7 حضارات مختلفة.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('7012fc8a-f19f-4299-98a6-22513d7bac29', 'e787cf4d-f13d-410a-b8b0-93b953e02e0c', 6, N'اليوم 6', N'يوم حر للاستمتاع بالرمال الذهبية والأنشطة البحرية على شواطئ بوكيت.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('33c36608-75e5-47c1-a346-0c71b073eb71', 'e787cf4d-f13d-410a-b8b0-93b953e02e0c', 7, N'اليوم 7', N'جولة تسوق حرة بسيارة وسائق خاص لاكتشاف أسواق بوكيت الرائعة.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('7d0a290d-2aa5-4dd4-a4ab-67321798af96', 'e787cf4d-f13d-410a-b8b0-93b953e02e0c', 8, N'اليوم 8', N'جولة ممتعة للتعرف على الحياة البرية من خلال زيارة محمية الفيلة ومشاهدة العروض الترفيهية.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('2f747a70-d2e6-41e7-9952-52c5c845f60c', 'e787cf4d-f13d-410a-b8b0-93b953e02e0c', 9, N'اليوم 9', N'يوم المغامرات والتشويق عبر تجربة الزيبلاين (ركوب الحبل)، زيارة مصنع اللؤلؤ والفضة، وتجربة ركوب الخيل.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('4a86ddb8-a34a-46b8-a0e9-45c60461399f', 'e787cf4d-f13d-410a-b8b0-93b953e02e0c', 10, N'اليوم 10', N'يوم حر تماماً للاسترخاء في الجزيرة والاستمتاع بمرافق المنتجع (بدون سائق).', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('81568160-de0a-4729-bc32-c8c840fb19ad', 'e787cf4d-f13d-410a-b8b0-93b953e02e0c', 11, N'اليوم 11', N'توديع بوكيت الساحرة والانتقال بالسيارة الخاصة إلى المطار للعودة إلى أرض الوطن.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('fd85253f-6f4a-408b-80ec-70157f796319', 'e787cf4d-f13d-410a-b8b0-93b953e02e0c', N'منتجع دياموند بوكيت - جزيرة بوكيت', N'جزيرة بوكيت', 4, 0, N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('d678fda6-f77c-4aa9-8907-7fdac6e9ec07', 'e787cf4d-f13d-410a-b8b0-93b953e02e0c', N'مسار رحلة ممتاز');
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-بانكوك-مع-بوكيت-2026-fly-29-12-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('1fcc1aae-a77a-4e94-a322-8664b2a246d2', N'pkg-بانكوك-مع-بوكيت-2026-fly-29-12-days', @Dest_2, N'بكج بانكوك مع بوكيت 2026 FLY 29 الساحرة - عرض بوكيت  بانكوك  يوم  ليلة 12 أيام', N'Amazing بانكوك مع بوكيت 2026 FLY 29 12 Days Package', N'استمتع بـ 11 ليالي من الرفاهية في أفضل فنادق بانكوك مع بوكيت 2026 FLY 29', 6900, N'ر.س', N'12 أيام / 11 ليالي', 12, 11, N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 1, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('671f2dcf-1ee6-4d6e-a40c-c79178a771a7', '1fcc1aae-a77a-4e94-a322-8664b2a246d2', 1, N'اليوم 1', N'وصف تفصيلي لجولات اليوم رقم 1 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('a9622a2a-4b82-45aa-bce7-f1440e967c78', '1fcc1aae-a77a-4e94-a322-8664b2a246d2', 2, N'اليوم 2', N'وصف تفصيلي لجولات اليوم رقم 2 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('bc2b5a31-95ef-4bd9-b5c3-bdf7d7b8eeef', '1fcc1aae-a77a-4e94-a322-8664b2a246d2', 3, N'اليوم 3', N'وصف تفصيلي لجولات اليوم رقم 3 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('a5367bce-674c-49c6-9276-880e394bc2e6', '1fcc1aae-a77a-4e94-a322-8664b2a246d2', 4, N'اليوم 4', N'وصف تفصيلي لجولات اليوم رقم 4 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('63514858-4910-458e-a81c-80210fb3ac4b', '1fcc1aae-a77a-4e94-a322-8664b2a246d2', 5, N'اليوم 5', N'وصف تفصيلي لجولات اليوم رقم 5 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('0cc8bcb8-e5a7-45b3-a655-ca969ca1ed5c', '1fcc1aae-a77a-4e94-a322-8664b2a246d2', 6, N'اليوم 6', N'وصف تفصيلي لجولات اليوم رقم 6 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('e66e2f5b-867a-4a94-914d-43bfbbd6eb7a', '1fcc1aae-a77a-4e94-a322-8664b2a246d2', 7, N'اليوم 7', N'وصف تفصيلي لجولات اليوم رقم 7 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('debefbac-a21e-4093-bcfb-6cc36430f665', '1fcc1aae-a77a-4e94-a322-8664b2a246d2', 8, N'اليوم 8', N'وصف تفصيلي لجولات اليوم رقم 8 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('ca49d4b0-568c-4940-8966-1e83c5cfa6b8', '1fcc1aae-a77a-4e94-a322-8664b2a246d2', 9, N'اليوم 9', N'وصف تفصيلي لجولات اليوم رقم 9 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('2a8c5254-6985-4f6b-8d40-ee2627315d3c', '1fcc1aae-a77a-4e94-a322-8664b2a246d2', 10, N'اليوم 10', N'وصف تفصيلي لجولات اليوم رقم 10 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('b70794c6-a4e3-4087-a401-76c1f3c90867', '1fcc1aae-a77a-4e94-a322-8664b2a246d2', 11, N'اليوم 11', N'وصف تفصيلي لجولات اليوم رقم 11 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('ab85c422-f931-4384-9296-f996bef16e62', '1fcc1aae-a77a-4e94-a322-8664b2a246d2', 12, N'اليوم 12', N'وصف تفصيلي لجولات اليوم رقم 12 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('4f41ea1d-bea8-433d-a5c2-b5d8bb95b1cd', '1fcc1aae-a77a-4e94-a322-8664b2a246d2', N'فندق الملحم الفاخر - بانكوك مع بوكيت 2026 FLY 29', N'بانكوك مع بوكيت 2026 FLY 29', 5, 0, N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('3e8d069d-96be-45fb-9098-4f985713e0c6', '1fcc1aae-a77a-4e94-a322-8664b2a246d2', N'مسار رحلة ممتاز');
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-بانكوك-مع-بوكيت-2026-fly-29-13-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('dd4aa5b1-7c5d-49ca-8a00-490e01d09534', N'pkg-بانكوك-مع-بوكيت-2026-fly-29-13-days', @Dest_2, N'بكج بانكوك مع بوكيت 2026 FLY 29 الساحرة - عرض بوكيت  بانكوك  يوم  ليلة 13 أيام', N'Amazing بانكوك مع بوكيت 2026 FLY 29 13 Days Package', N'استمتع بـ 12 ليالي من الرفاهية في أفضل فنادق بانكوك مع بوكيت 2026 FLY 29', 7350, N'ر.س', N'13 أيام / 12 ليالي', 13, 12, N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 1, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('eb1ad609-4ca8-438d-b19c-16404c1cbe01', 'dd4aa5b1-7c5d-49ca-8a00-490e01d09534', 1, N'اليوم 1', N'وصف تفصيلي لجولات اليوم رقم 1 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('0f1cc35d-5e99-4435-a2c2-111a2a1fea6c', 'dd4aa5b1-7c5d-49ca-8a00-490e01d09534', 2, N'اليوم 2', N'وصف تفصيلي لجولات اليوم رقم 2 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('a2d9cfd8-57c0-40eb-97c3-dad0402b6a9f', 'dd4aa5b1-7c5d-49ca-8a00-490e01d09534', 3, N'اليوم 3', N'وصف تفصيلي لجولات اليوم رقم 3 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('d9413b20-9090-4f68-8fb4-9ccfcd485de4', 'dd4aa5b1-7c5d-49ca-8a00-490e01d09534', 4, N'اليوم 4', N'وصف تفصيلي لجولات اليوم رقم 4 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('daadc024-084a-4956-a22e-0d119d327cf6', 'dd4aa5b1-7c5d-49ca-8a00-490e01d09534', 5, N'اليوم 5', N'وصف تفصيلي لجولات اليوم رقم 5 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('c7c6f36a-e024-403f-8c1c-8f6b824c8afb', 'dd4aa5b1-7c5d-49ca-8a00-490e01d09534', 6, N'اليوم 6', N'وصف تفصيلي لجولات اليوم رقم 6 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('4db317be-5ed6-4b0c-bb32-bd98aeb11b64', 'dd4aa5b1-7c5d-49ca-8a00-490e01d09534', 7, N'اليوم 7', N'وصف تفصيلي لجولات اليوم رقم 7 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('3dedceae-e822-4fc9-8edb-a35d5dae69b8', 'dd4aa5b1-7c5d-49ca-8a00-490e01d09534', 8, N'اليوم 8', N'وصف تفصيلي لجولات اليوم رقم 8 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('8927cc44-cd65-4f07-9553-02468c347357', 'dd4aa5b1-7c5d-49ca-8a00-490e01d09534', 9, N'اليوم 9', N'وصف تفصيلي لجولات اليوم رقم 9 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('37cb73c0-45ec-4e96-8bab-21b313108d87', 'dd4aa5b1-7c5d-49ca-8a00-490e01d09534', 10, N'اليوم 10', N'وصف تفصيلي لجولات اليوم رقم 10 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('53e7c8c8-52ef-4a1c-b34c-6db3d26f7654', 'dd4aa5b1-7c5d-49ca-8a00-490e01d09534', 11, N'اليوم 11', N'وصف تفصيلي لجولات اليوم رقم 11 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('fc27163f-3e74-40b6-93f1-9b06de0a43ff', 'dd4aa5b1-7c5d-49ca-8a00-490e01d09534', 12, N'اليوم 12', N'وصف تفصيلي لجولات اليوم رقم 12 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('35375cce-d4e7-46c9-8857-7526c779e275', 'dd4aa5b1-7c5d-49ca-8a00-490e01d09534', 13, N'اليوم 13', N'وصف تفصيلي لجولات اليوم رقم 13 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('8c5432ab-e0a2-44fc-bc5d-028e17a04365', 'dd4aa5b1-7c5d-49ca-8a00-490e01d09534', N'فندق الملحم الفاخر - بانكوك مع بوكيت 2026 FLY 29', N'بانكوك مع بوكيت 2026 FLY 29', 5, 0, N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('0c98cab8-d46b-490e-bc1c-b224c84dae6a', 'dd4aa5b1-7c5d-49ca-8a00-490e01d09534', N'مسار رحلة ممتاز');
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-بانكوك-مع-بوكيت-2026-fly-29-14-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('1089d7a8-5007-42ce-b050-1cb3c2e2dc7c', N'pkg-بانكوك-مع-بوكيت-2026-fly-29-14-days', @Dest_2, N'بكج بانكوك مع بوكيت 2026 FLY 29 الساحرة - عرض بوكيت  بانكوك  يوم  ليلة 14 أيام', N'Amazing بانكوك مع بوكيت 2026 FLY 29 14 Days Package', N'استمتع بـ 13 ليالي من الرفاهية في أفضل فنادق بانكوك مع بوكيت 2026 FLY 29', 7800, N'ر.س', N'14 أيام / 13 ليالي', 14, 13, N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 1, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('8256abcd-4b40-4788-8687-64802cc2d301', '1089d7a8-5007-42ce-b050-1cb3c2e2dc7c', 1, N'اليوم 1', N'وصف تفصيلي لجولات اليوم رقم 1 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('cbf8e7a4-5cf0-4f17-840c-6d8be27ab6e4', '1089d7a8-5007-42ce-b050-1cb3c2e2dc7c', 2, N'اليوم 2', N'وصف تفصيلي لجولات اليوم رقم 2 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('79c755dd-5d1b-47f3-b924-6411b659ee5c', '1089d7a8-5007-42ce-b050-1cb3c2e2dc7c', 3, N'اليوم 3', N'وصف تفصيلي لجولات اليوم رقم 3 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('f30739b9-3471-451a-9d8b-ca1186050ab7', '1089d7a8-5007-42ce-b050-1cb3c2e2dc7c', 4, N'اليوم 4', N'وصف تفصيلي لجولات اليوم رقم 4 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('c870acee-f968-4ad9-ab4b-44572163061d', '1089d7a8-5007-42ce-b050-1cb3c2e2dc7c', 5, N'اليوم 5', N'وصف تفصيلي لجولات اليوم رقم 5 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('2247cc77-0526-41b6-af20-3e0a5eeb979c', '1089d7a8-5007-42ce-b050-1cb3c2e2dc7c', 6, N'اليوم 6', N'وصف تفصيلي لجولات اليوم رقم 6 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('e6b513d1-5e04-49e3-b1d2-30f33a6132fa', '1089d7a8-5007-42ce-b050-1cb3c2e2dc7c', 7, N'اليوم 7', N'وصف تفصيلي لجولات اليوم رقم 7 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('ed4dc0e6-2464-419f-aa7d-7538c6946065', '1089d7a8-5007-42ce-b050-1cb3c2e2dc7c', 8, N'اليوم 8', N'وصف تفصيلي لجولات اليوم رقم 8 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('56027873-8a65-4255-8f40-0cafe639ef90', '1089d7a8-5007-42ce-b050-1cb3c2e2dc7c', 9, N'اليوم 9', N'وصف تفصيلي لجولات اليوم رقم 9 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('6461f233-a273-41f5-a362-ed7debc518f3', '1089d7a8-5007-42ce-b050-1cb3c2e2dc7c', 10, N'اليوم 10', N'وصف تفصيلي لجولات اليوم رقم 10 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('a5bc5bca-a090-498d-a2c4-45be2ba61c4a', '1089d7a8-5007-42ce-b050-1cb3c2e2dc7c', 11, N'اليوم 11', N'وصف تفصيلي لجولات اليوم رقم 11 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('03f83884-3a91-445c-8db3-084fdfdccdcd', '1089d7a8-5007-42ce-b050-1cb3c2e2dc7c', 12, N'اليوم 12', N'وصف تفصيلي لجولات اليوم رقم 12 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('3e6f158b-7025-46e6-95ce-07500a1146cf', '1089d7a8-5007-42ce-b050-1cb3c2e2dc7c', 13, N'اليوم 13', N'وصف تفصيلي لجولات اليوم رقم 13 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('b3199b1a-7cdc-4d28-ac2e-890770edc583', '1089d7a8-5007-42ce-b050-1cb3c2e2dc7c', 14, N'اليوم 14', N'وصف تفصيلي لجولات اليوم رقم 14 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('f631963f-c8a3-4011-adb5-e13ccb10d48d', '1089d7a8-5007-42ce-b050-1cb3c2e2dc7c', N'فندق الملحم الفاخر - بانكوك مع بوكيت 2026 FLY 29', N'بانكوك مع بوكيت 2026 FLY 29', 5, 0, N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('d4f25d88-b2a2-49db-984d-8e2e98dcc657', '1089d7a8-5007-42ce-b050-1cb3c2e2dc7c', N'مسار رحلة ممتاز');
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-بانكوك-مع-بوكيت-2026-fly-29-8-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('0c50384b-55a0-4a01-8e1c-758a7addf07f', N'pkg-بانكوك-مع-بوكيت-2026-fly-29-8-days', @Dest_2, N'بكج بانكوك مع بوكيت 2026 FLY 29 الساحرة - عرض بوكيت  بانكوك  ايام  ليالي 8 أيام', N'Amazing بوكيت 8 Days Deal', N'استمتع بـ 7 ليالي من الرفاهية في منتجع دياموند بوكيت - جزيرة بوكيت وغيرها', 3650, N'ر.س', N'8 أيام / 7 ليالي', 8, 7, N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 1, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('4f7b4790-dc20-487d-b731-f731c2d01909', '0c50384b-55a0-4a01-8e1c-758a7addf07f', 1, N'اليوم 1', N'ترحيب حار في مطار بوكيت الدولي والانتقال بكل راحة إلى المنتجع لتسجيل الدخول.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('72cd1016-657c-44c6-a2a1-216ed8c89167', '0c50384b-55a0-4a01-8e1c-758a7addf07f', 2, N'اليوم 2', N'بدء المغامرات بجولة لخليج بان ناه، الحديقة المائية، شلال بانغ باي، عالم المحيط، ومملكة النمور.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('9e0607f9-377a-477a-b646-3b30e7277a01', '0c50384b-55a0-4a01-8e1c-758a7addf07f', 3, N'اليوم 3', N'جولة ثقافية وترفيهية تشمل تمثال بوذا العملاق، الأكواريوم المائي، حديقة الحيوانات، والمدينة القديمة التراثية.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('372c1b5a-3560-4623-9bf6-2dcf03a5aa2a', '0c50384b-55a0-4a01-8e1c-758a7addf07f', 4, N'اليوم 4', N'قضاء يوم كامل في رحلة بحرية إلى جزيرة جيمس بوند، الجزر الأربعة، الاستمتاع بكاتا بيتش، وتجربة السفاري.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('b3fd321f-fb22-4e07-91c2-c47139b58ba0', '0c50384b-55a0-4a01-8e1c-758a7addf07f', 5, N'اليوم 5', N'يوم من المرح والإثارة في المدينة المائية الكبرى ببوكيت ذات التصميم العالمي المستوحى من حضارات العالم.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('679932a7-ef75-4aa3-902c-3c8c91b3d9a0', '0c50384b-55a0-4a01-8e1c-758a7addf07f', 6, N'اليوم 6', N'جولة تسوق خاصة بالسيارة لزيارة أشهر أسواق بوكيت واقتناء أروع الهدايا التذكارية.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('06d41cac-a931-4f80-943c-7fa1818e3ff9', '0c50384b-55a0-4a01-8e1c-758a7addf07f', 7, N'اليوم 7', N'يوم حر مخصص للاسترخاء على الشواطئ والاستمتاع بالمرافق الفندقية الفاخرة (بدون سائق).', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('60ba070e-947b-48b0-8e1c-2a13ac9b0e3b', '0c50384b-55a0-4a01-8e1c-758a7addf07f', 8, N'اليوم 8', N'نهاية الرحلة الممتعة، التوديع والتوصيل إلى المطار متمنين لكم رحلة عودة آمنة.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('791d127b-b7d7-4169-b06c-c6926dcb6b28', '0c50384b-55a0-4a01-8e1c-758a7addf07f', N'منتجع دياموند بوكيت - جزيرة بوكيت', N'جزيرة بوكيت', 4, 0, N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('bba480c8-72dd-4683-a212-cc8c2243a6ee', '0c50384b-55a0-4a01-8e1c-758a7addf07f', N'مسار رحلة ممتاز');
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-بانكوك-مع-بوكيت-2026-fly-29-9-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('5ad0259a-2c6f-43da-9285-f2d2a5689550', N'pkg-بانكوك-مع-بوكيت-2026-fly-29-9-days', @Dest_2, N'بكج بانكوك مع بوكيت 2026 FLY 29 الساحرة - عرض بوكيت  بانكوك  ايام  ليالي 9 أيام', N'Amazing بانكوك مع بوكيت 2026 FLY 29 9 Days Package', N'استمتع بـ 8 ليالي من الرفاهية في أفضل فنادق بانكوك مع بوكيت 2026 FLY 29', 5550, N'ر.س', N'9 أيام / 8 ليالي', 9, 8, N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 1, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('fa957c45-a3bf-461b-9c50-b22a9bb7f736', '5ad0259a-2c6f-43da-9285-f2d2a5689550', 1, N'اليوم 1', N'وصف تفصيلي لجولات اليوم رقم 1 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('14c472c8-1673-4f68-9097-96d115621e89', '5ad0259a-2c6f-43da-9285-f2d2a5689550', 2, N'اليوم 2', N'وصف تفصيلي لجولات اليوم رقم 2 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('bd5c36b4-060e-4a52-b7f9-8e2dbceaf4c1', '5ad0259a-2c6f-43da-9285-f2d2a5689550', 3, N'اليوم 3', N'وصف تفصيلي لجولات اليوم رقم 3 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('305ee052-b0ac-4f62-9529-37101a118adb', '5ad0259a-2c6f-43da-9285-f2d2a5689550', 4, N'اليوم 4', N'وصف تفصيلي لجولات اليوم رقم 4 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('f525954a-bdc6-4045-a0f0-549e79d5b8aa', '5ad0259a-2c6f-43da-9285-f2d2a5689550', 5, N'اليوم 5', N'وصف تفصيلي لجولات اليوم رقم 5 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('9241ebc2-332d-4f36-8cdd-8b68b451c9b9', '5ad0259a-2c6f-43da-9285-f2d2a5689550', 6, N'اليوم 6', N'وصف تفصيلي لجولات اليوم رقم 6 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('5932829a-386b-45ef-8e82-2c115ca7bf42', '5ad0259a-2c6f-43da-9285-f2d2a5689550', 7, N'اليوم 7', N'وصف تفصيلي لجولات اليوم رقم 7 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('5f46a5a8-20a0-458c-9b36-23433065d184', '5ad0259a-2c6f-43da-9285-f2d2a5689550', 8, N'اليوم 8', N'وصف تفصيلي لجولات اليوم رقم 8 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('7181b559-5d82-4425-915b-1ca6cccb3ec7', '5ad0259a-2c6f-43da-9285-f2d2a5689550', 9, N'اليوم 9', N'وصف تفصيلي لجولات اليوم رقم 9 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('07c53c6e-2e91-4840-93ca-18f0eebe0eea', '5ad0259a-2c6f-43da-9285-f2d2a5689550', N'فندق الملحم الفاخر - بانكوك مع بوكيت 2026 FLY 29', N'بانكوك مع بوكيت 2026 FLY 29', 5, 0, N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('9acc1427-7685-43f7-9b5c-014864d836e1', '5ad0259a-2c6f-43da-9285-f2d2a5689550', N'مسار رحلة ممتاز');
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-بانكوك-مع-بوكيت-2026-fly-29-6-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('7deb381d-3627-438f-8a33-a58aa8c8dd47', N'pkg-بانكوك-مع-بوكيت-2026-fly-29-6-days', @Dest_2, N'بكج بانكوك مع بوكيت 2026 FLY 29 الساحرة - عرض تايلند  بانكوك  ايام  ليالي 6 أيام', N'Amazing بوكيت 6 Days Deal', N'استمتع بـ 5 ليالي من الرفاهية في منتجع دياموند بوكيت - جزيرة بوكيت وغيرها', 2800, N'ر.س', N'6 أيام / 5 ليالي', 6, 5, N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 1, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('7c419b8e-85b6-40cd-87a6-807f1d57c671', '7deb381d-3627-438f-8a33-a58aa8c8dd47', 1, N'اليوم 1', N'الاستقبال والترحيب في مطار جزيرة بوكيت، والانتقال المريح بسيارة خاصة وسائق إلى الفندق لتسجيل الدخول والراحة.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('dca61461-56b3-4301-a048-1f4f48c76274', '7deb381d-3627-438f-8a33-a58aa8c8dd47', 2, N'اليوم 2', N'جولة سياحية لاكتشاف أهم معالم بوكيت تشمل خليج بان ناه، شلال بانغ باي، الحديقة المائية جنقل سبلاش، معبد وات تشالونج، بالإضافة إلى حديقة سيرينات الوطنية، عالم المحيط، ومملكة النمور.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('7e64bec1-e096-4045-b8a5-3605b942801e', '7deb381d-3627-438f-8a33-a58aa8c8dd47', 3, N'اليوم 3', N'استكمال الجولات الممتعة بزيارة تمثال بوذا العملاق، مملكة النمور في بوكيت، الأكواريوم المائي، حديقة الحيوانات، والمدينة القديمة ذات الطابع التاريخي.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('d6649a02-abde-4809-a146-e7dc6a2e9de1', '7deb381d-3627-438f-8a33-a58aa8c8dd47', 4, N'اليوم 4', N'رحلة بحرية خيالية ليوم كامل إلى منطقة فاتح نجا وجزيرة جيمس بوند، تتضمن زيارة الجزر الأربعة، الاستمتاع بشاطئ كاتا بيتش، استكشاف كهف الخفافيس، وقضاء وقت ممتع في رحلة سفاري.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('9cfbcecf-a070-4fd6-a4a9-dbf49a6b5740', '7deb381d-3627-438f-8a33-a58aa8c8dd47', 5, N'اليوم 5', N'يوم حر مخصص للراحة والاستجمام التام في الفندق، أو لاستكشاف الشواطئ المحيطة بحرية (بدون سائق).', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('baa18265-0632-4249-91bc-2c3e84fea0eb', '7deb381d-3627-438f-8a33-a58aa8c8dd47', 6, N'اليوم 6', N'ختام الرحلة الجميلة بتوديع جزيرة بوكيت والانتقال من الفندق إلى المطار بسيارة خاصة لرحلة العودة بسلامة الله.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('93db06dc-7e38-41dc-a847-c17bc983ca34', '7deb381d-3627-438f-8a33-a58aa8c8dd47', N'منتجع دياموند بوكيت - جزيرة بوكيت', N'جزيرة بوكيت', 4, 0, N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('6368ecc4-2210-4a20-9c9e-6d9ddb6194b3', '7deb381d-3627-438f-8a33-a58aa8c8dd47', N'مسار رحلة ممتاز');
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-بانكوك-مع-بوكيت-2026-fly-29-7-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('05a6ba4d-c5c2-41df-9279-ec524c0cddf7', N'pkg-بانكوك-مع-بوكيت-2026-fly-29-7-days', @Dest_2, N'بكج بانكوك مع بوكيت 2026 FLY 29 الساحرة - عرض تايلند بانكوك  ايام  ليالي 7 أيام', N'Amazing بوكيت 7 Days Deal', N'استمتع بـ 6 ليالي من الرفاهية في منتجع دياموند بوكيت - جزيرة بوكيت وغيرها', 3400, N'ر.س', N'7 أيام / 6 ليالي', 7, 6, N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 1, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('9427cd7d-742c-46ea-a174-fc7bbba112d2', '05a6ba4d-c5c2-41df-9279-ec524c0cddf7', 1, N'اليوم 1', N'الاستقبال في مطار جزيرة بوكيت والتوصيل بسيارة خاصة وسائق إلى فندق الإقامة لبدء عطلتكم الاستوائية.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('59cbb20b-f1e6-4941-8771-206dad721e1c', '05a6ba4d-c5c2-41df-9279-ec524c0cddf7', 2, N'اليوم 2', N'جولة سياحية مذهلة لزيارة خليج بان ناه، شلال بانغ باي، الحديقة المائية جنقل سبلاش، معبد وات تشالونج، وعالم المحيط ومملكة النمور.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('87520816-c63e-4109-abde-24797849f379', '05a6ba4d-c5c2-41df-9279-ec524c0cddf7', 3, N'اليوم 3', N'جولة لاستكشاف تمثال بوذا العملاق، مملكة النمور، بوكيت أكواريوم، حديقة الحيوانات، والتجول في المدينة القديمة.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('616e786c-2a91-42d4-9a14-3ac9449f7fdb', '05a6ba4d-c5c2-41df-9279-ec524c0cddf7', 4, N'اليوم 4', N'رحلة بحرية لا تُنسى لجزيرة جيمس بوند وفاتح نجا، مع زيارة الجزر الأربعة، شاطئ كاتا بيتش، وكهف الخفافيس ورحلة السفاري الممتعة.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('ddd208b3-f63a-4f27-9c89-d08a56a7460f', '05a6ba4d-c5c2-41df-9279-ec524c0cddf7', 5, N'اليوم 5', N'يوم ترفيهي عائلي بامتياز في المدينة المائية الأكبر في بوكيت، والمصممة لتعكس 7 حضارات عالمية، حيث المسابح والألعاب المائية الرائعة.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('1d1308f2-48d6-41ed-a6f8-caba3b9aaf4d', '05a6ba4d-c5c2-41df-9279-ec524c0cddf7', 6, N'اليوم 6', N'يوم حر للاسترخاء التام في مرافق الفندق أو للاستمتاع برمال شواطئ بوكيت الذهبية (بدون سائق).', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('af219eed-6069-4a45-b5a6-f2feeb21bf90', '05a6ba4d-c5c2-41df-9279-ec524c0cddf7', 7, N'اليوم 7', N'توديع جزيرة بوكيت الساحرة، والتوصيل المريح من الفندق إلى المطار للعودة إلى الديار بسلامة الله.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('b1c41834-0edf-4378-9e6e-4cdc43149997', '05a6ba4d-c5c2-41df-9279-ec524c0cddf7', N'منتجع دياموند بوكيت - جزيرة بوكيت', N'جزيرة بوكيت', 4, 0, N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('beb6ed1c-7276-4ba5-9b90-da88194b7fa7', '05a6ba4d-c5c2-41df-9279-ec524c0cddf7', N'مسار رحلة ممتاز');
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-بانكوك-مع-بوكيت-2026-fly-29-5-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('5c68fac5-9117-4fa5-b39d-fdf4443842b3', N'pkg-بانكوك-مع-بوكيت-2026-fly-29-5-days', @Dest_2, N'بكج بانكوك مع بوكيت 2026 FLY 29 الساحرة - عروض بوكيت بانكوك بالريال السعودي 5 أيام', N'Amazing بانكوك مع بوكيت 2026 FLY 29 5 Days Package', N'استمتع بـ 4 ليالي من الرفاهية في أفضل فنادق بانكوك مع بوكيت 2026 FLY 29', 3750, N'ر.س', N'5 أيام / 4 ليالي', 5, 4, N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 1, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('f0c64b59-12bc-432e-aacc-f752f2f74f97', '5c68fac5-9117-4fa5-b39d-fdf4443842b3', 1, N'اليوم 1', N'وصف تفصيلي لجولات اليوم رقم 1 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('b0b87740-1024-4e5f-ac31-8a122e50f71c', '5c68fac5-9117-4fa5-b39d-fdf4443842b3', 2, N'اليوم 2', N'وصف تفصيلي لجولات اليوم رقم 2 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('77f6b5a1-0c6d-4419-b665-53b0baed81f4', '5c68fac5-9117-4fa5-b39d-fdf4443842b3', 3, N'اليوم 3', N'وصف تفصيلي لجولات اليوم رقم 3 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('32363909-9dac-4131-a3f6-0669ede7daa3', '5c68fac5-9117-4fa5-b39d-fdf4443842b3', 4, N'اليوم 4', N'وصف تفصيلي لجولات اليوم رقم 4 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('99245426-daa7-413d-8619-da3937b4381e', '5c68fac5-9117-4fa5-b39d-fdf4443842b3', 5, N'اليوم 5', N'وصف تفصيلي لجولات اليوم رقم 5 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('ecd8edd9-0728-4b27-aaa4-04caf785fb70', '5c68fac5-9117-4fa5-b39d-fdf4443842b3', N'فندق الملحم الفاخر - بانكوك مع بوكيت 2026 FLY 29', N'بانكوك مع بوكيت 2026 FLY 29', 5, 0, N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('03f5e82c-d45f-4783-b5b0-0955567ad354', '5c68fac5-9117-4fa5-b39d-fdf4443842b3', N'مسار رحلة ممتاز');
END

DECLARE @Dest_3 UNIQUEIDENTIFIER;
SELECT @Dest_3 = Id FROM Destinations WHERE NameAr = N'بوكيت 2026 FLY 29';
IF @Dest_3 IS NULL
BEGIN
    SET @Dest_3 = NEWID();
    INSERT INTO Destinations (Id, NameAr, NameEn, Slug, Country, ImageUrl, Description, IsActive, SortOrder)
    VALUES (@Dest_3, N'بوكيت 2026 FLY 29', N'Destination En', N'بوكيت-2026-fly-29', N'بوكيت 2026 FLY 29', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop', N'اكتشف جمال وعراقة بوكيت 2026 FLY 29 مع برامج الملحم السياحية الفاخرة المميزة.', 1, 100);
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-بوكيت-2026-fly-29-10-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('74787349-bd80-488a-9c7b-3e949accd708', N'pkg-بوكيت-2026-fly-29-10-days', @Dest_3, N'بكج بوكيت 2026 FLY 29 الساحرة - عرض بوكيت  ايام  ليالي 10 أيام', N'Amazing بوكيت 10 Days Deal', N'استمتع بـ 9 ليالي من الرفاهية في منتجع دياموند بوكيت - جزيرة بوكيت وغيرها', 4700, N'ر.س', N'10 أيام / 9 ليالي', 10, 9, N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 1, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('c8d517a5-e5a9-4468-85e9-5b13631c1cf5', '74787349-bd80-488a-9c7b-3e949accd708', 1, N'اليوم 1', N'الوصول بالسلامة إلى مطار بوكيت والانتقال المريح إلى المنتجع الفاخر لبدء الإجازة.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('3a36b417-35ec-49e3-bbe6-80ad3e6ccca9', '74787349-bd80-488a-9c7b-3e949accd708', 2, N'اليوم 2', N'جولة سياحية لمعالم بوكيت تتضمن خليج بان ناه، شلال بانغ باي، الحديقة المائية جنقل سبلاش، وعالم المحيط والنمور.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('25328d83-6586-44a7-9652-6e0a261f0f09', '74787349-bd80-488a-9c7b-3e949accd708', 3, N'اليوم 3', N'جولة تشمل تمثال بوذا العملاق، بوكيت أكواريوم، حديقة الحيوانات، واستكشاف سحر المدينة القديمة.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('e3856553-1b5d-4a54-8ec0-8402e2290f24', '74787349-bd80-488a-9c7b-3e949accd708', 4, N'اليوم 4', N'مغامرة بحرية متكاملة لجزر جيمس بوند والجزر الأربعة، مع زيارة كاتا بيتش وكهف الخفافيس.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('109dd747-32c7-407a-89dd-0e1f302cf4df', '74787349-bd80-488a-9c7b-3e949accd708', 5, N'اليوم 5', N'زيارة المدينة المائية الأفضل في بوكيت لقضاء أوقات عائلية مليئة بالمرح والألعاب المائية.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('dc618c71-6051-42f4-a6c7-db6c8ad3fd5f', '74787349-bd80-488a-9c7b-3e949accd708', 6, N'اليوم 6', N'يوم حر ومميز للاستمتاع بالطبيعة الساحرة والاسترخاء التام في جزيرة بوكيت.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('7dacb8b9-9761-45d3-8afe-1b067b1421ba', '74787349-bd80-488a-9c7b-3e949accd708', 7, N'اليوم 7', N'جولة تسوق ممتعة بسيارة خاصة لاستكشاف أفضل الأسواق واقتناء المشتريات المحلية.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('50f997d9-300b-4144-835c-722c6ea1d4e9', '74787349-bd80-488a-9c7b-3e949accd708', 8, N'اليوم 8', N'جولة سياحية خاصة لزيارة محمية الفيلة الطبيعية والاستمتاع بمشاهدة عروض القرود والأفاعي المشوقة.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('d5252a81-d537-4c2a-b543-81ffb36d810e', '74787349-bd80-488a-9c7b-3e949accd708', 9, N'اليوم 9', N'يوم حر للاستجمام والسباحة أو تجربة المطاعم المحلية في الجزيرة (بدون سائق).', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('660548c9-9a94-43ab-9684-5ed1a6536c47', '74787349-bd80-488a-9c7b-3e949accd708', 10, N'اليوم 10', N'ختام العطلة السعيدة والتوصيل من الفندق إلى مطار بوكيت لرحلة العودة بسلامة الله.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('40cb7580-d0d7-4f85-aea1-f5d5273c1ebf', '74787349-bd80-488a-9c7b-3e949accd708', N'منتجع دياموند بوكيت - جزيرة بوكيت', N'جزيرة بوكيت', 4, 0, N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('59344151-3eb2-479e-8d71-58cfbf3cebd8', '74787349-bd80-488a-9c7b-3e949accd708', N'مسار رحلة ممتاز');
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-بوكيت-2026-fly-29-11-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('5ca4d3fd-081d-4f99-8e13-beed12f3fb55', N'pkg-بوكيت-2026-fly-29-11-days', @Dest_3, N'بكج بوكيت 2026 FLY 29 الساحرة - عرض بوكيت  يوم  ليالي 11 أيام', N'Amazing بوكيت 11 Days Deal', N'استمتع بـ 10 ليالي من الرفاهية في منتجع دياموند بوكيت - جزيرة بوكيت وغيرها', 5100, N'ر.س', N'11 أيام / 10 ليالي', 11, 10, N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 1, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('1b782ec5-c230-47ee-a520-d43cb3d0fdc1', '5ca4d3fd-081d-4f99-8e13-beed12f3fb55', 1, N'اليوم 1', N'الاستقبال المميز في مطار بوكيت والتوصيل إلى فندق الإقامة للراحة والاستعداد للرحلة.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('5f8a3f1f-a857-4bce-be5c-53e5014ec69c', '5ca4d3fd-081d-4f99-8e13-beed12f3fb55', 2, N'اليوم 2', N'جولة سياحية في بوكيت تشمل خليج بان ناه، الحديقة المائية، شلال بانغ باي، عالم المحيط وتل القرود.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('e3e70701-5f27-4838-bfea-40e630236e3c', '5ca4d3fd-081d-4f99-8e13-beed12f3fb55', 3, N'اليوم 3', N'استكشاف تمثال بوذا العملاق، الأكواريوم المدهش، حديقة الحيوانات، والمدينة القديمة ذات الطابع الخاص.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('51c6b35b-8b0e-42fd-8995-5b9264d18642', '5ca4d3fd-081d-4f99-8e13-beed12f3fb55', 4, N'اليوم 4', N'رحلة استكشافية بحرية لجزيرة جيمس بوند الرائعة والجزر الأربعة مع تجربة سفاري استثنائية.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('fca8bcd2-9a84-4905-a58d-74907da35d09', '5ca4d3fd-081d-4f99-8e13-beed12f3fb55', 5, N'اليوم 5', N'يوم ترفيهي مليء بالنشاط في المدينة المائية الكبرى والتي تحاكي في تصميمها 7 حضارات مختلفة.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('1f3129e1-8eff-43d0-8aea-d7b8e2e40796', '5ca4d3fd-081d-4f99-8e13-beed12f3fb55', 6, N'اليوم 6', N'يوم حر للاستمتاع بالرمال الذهبية والأنشطة البحرية على شواطئ بوكيت.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('f4b055dd-484b-4d85-ad7f-7cb0c6ab12ba', '5ca4d3fd-081d-4f99-8e13-beed12f3fb55', 7, N'اليوم 7', N'جولة تسوق حرة بسيارة وسائق خاص لاكتشاف أسواق بوكيت الرائعة.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('152ae198-80eb-4f13-ba2c-4154b836399a', '5ca4d3fd-081d-4f99-8e13-beed12f3fb55', 8, N'اليوم 8', N'جولة ممتعة للتعرف على الحياة البرية من خلال زيارة محمية الفيلة ومشاهدة العروض الترفيهية.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('e73894ef-0a87-4b28-a0e2-734253084eea', '5ca4d3fd-081d-4f99-8e13-beed12f3fb55', 9, N'اليوم 9', N'يوم المغامرات والتشويق عبر تجربة الزيبلاين (ركوب الحبل)، زيارة مصنع اللؤلؤ والفضة، وتجربة ركوب الخيل.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('dfea9494-6622-4077-bf7d-bb55fcb9ec25', '5ca4d3fd-081d-4f99-8e13-beed12f3fb55', 10, N'اليوم 10', N'يوم حر تماماً للاسترخاء في الجزيرة والاستمتاع بمرافق المنتجع (بدون سائق).', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('3da0d813-4a7e-4b6f-9110-dbb19b2af3bf', '5ca4d3fd-081d-4f99-8e13-beed12f3fb55', 11, N'اليوم 11', N'توديع بوكيت الساحرة والانتقال بالسيارة الخاصة إلى المطار للعودة إلى أرض الوطن.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('274e1b9b-274c-43dc-9b6c-f696cbc11d3f', '5ca4d3fd-081d-4f99-8e13-beed12f3fb55', N'منتجع دياموند بوكيت - جزيرة بوكيت', N'جزيرة بوكيت', 4, 0, N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('e0b2e38b-c6e4-443c-a256-e32fcdd6c8c5', '5ca4d3fd-081d-4f99-8e13-beed12f3fb55', N'مسار رحلة ممتاز');
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-بوكيت-2026-fly-29-6-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('719df4d3-1655-4925-a74a-87813275137a', N'pkg-بوكيت-2026-fly-29-6-days', @Dest_3, N'بكج بوكيت 2026 FLY 29 الساحرة - عرض بوكيت  ايام  ليالي 6 أيام', N'Amazing بوكيت 6 Days Deal', N'استمتع بـ 5 ليالي من الرفاهية في منتجع دياموند بوكيت - جزيرة بوكيت وغيرها', 2800, N'ر.س', N'6 أيام / 5 ليالي', 6, 5, N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 1, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('e7524a1b-ecfe-43e8-8d29-dae2d516a563', '719df4d3-1655-4925-a74a-87813275137a', 1, N'اليوم 1', N'الاستقبال والترحيب في مطار جزيرة بوكيت، والانتقال المريح بسيارة خاصة وسائق إلى الفندق لتسجيل الدخول والراحة.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('001ee25b-cf1b-428d-b0d4-05e0f6bc8e9e', '719df4d3-1655-4925-a74a-87813275137a', 2, N'اليوم 2', N'جولة سياحية لاكتشاف أهم معالم بوكيت تشمل خليج بان ناه، شلال بانغ باي، الحديقة المائية جنقل سبلاش، معبد وات تشالونج، بالإضافة إلى حديقة سيرينات الوطنية، عالم المحيط، ومملكة النمور.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('1b1b0465-25a0-42ae-91a5-ae3edefcbb47', '719df4d3-1655-4925-a74a-87813275137a', 3, N'اليوم 3', N'استكمال الجولات الممتعة بزيارة تمثال بوذا العملاق، مملكة النمور في بوكيت، الأكواريوم المائي، حديقة الحيوانات، والمدينة القديمة ذات الطابع التاريخي.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('20852d13-4a3a-4455-9f60-8c9f83cb9032', '719df4d3-1655-4925-a74a-87813275137a', 4, N'اليوم 4', N'رحلة بحرية خيالية ليوم كامل إلى منطقة فاتح نجا وجزيرة جيمس بوند، تتضمن زيارة الجزر الأربعة، الاستمتاع بشاطئ كاتا بيتش، استكشاف كهف الخفافيس، وقضاء وقت ممتع في رحلة سفاري.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('25234743-58aa-4ad8-bb45-fd12c7f9f196', '719df4d3-1655-4925-a74a-87813275137a', 5, N'اليوم 5', N'يوم حر مخصص للراحة والاستجمام التام في الفندق، أو لاستكشاف الشواطئ المحيطة بحرية (بدون سائق).', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('43b6696c-653a-4c91-a333-00fe9ca71f2d', '719df4d3-1655-4925-a74a-87813275137a', 6, N'اليوم 6', N'ختام الرحلة الجميلة بتوديع جزيرة بوكيت والانتقال من الفندق إلى المطار بسيارة خاصة لرحلة العودة بسلامة الله.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('b81d1c44-4a5b-44b3-ad4c-0ca99b71f65c', '719df4d3-1655-4925-a74a-87813275137a', N'منتجع دياموند بوكيت - جزيرة بوكيت', N'جزيرة بوكيت', 4, 0, N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('62caff10-07f3-4d63-8c4f-026cd1c1480a', '719df4d3-1655-4925-a74a-87813275137a', N'مسار رحلة ممتاز');
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-بوكيت-2026-fly-29-7-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('332548a8-f9a5-494b-8ad3-5c51771a3379', N'pkg-بوكيت-2026-fly-29-7-days', @Dest_3, N'بكج بوكيت 2026 FLY 29 الساحرة - عرض بوكيت  ايام  ليالي 7 أيام', N'Amazing بوكيت 7 Days Deal', N'استمتع بـ 6 ليالي من الرفاهية في منتجع دياموند بوكيت - جزيرة بوكيت وغيرها', 3400, N'ر.س', N'7 أيام / 6 ليالي', 7, 6, N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 1, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('9b88e2e3-1df9-4800-93a6-45e2bf4654c4', '332548a8-f9a5-494b-8ad3-5c51771a3379', 1, N'اليوم 1', N'الاستقبال في مطار جزيرة بوكيت والتوصيل بسيارة خاصة وسائق إلى فندق الإقامة لبدء عطلتكم الاستوائية.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('a4f76165-72f1-441a-8ae7-356a355d8b26', '332548a8-f9a5-494b-8ad3-5c51771a3379', 2, N'اليوم 2', N'جولة سياحية مذهلة لزيارة خليج بان ناه، شلال بانغ باي، الحديقة المائية جنقل سبلاش، معبد وات تشالونج، وعالم المحيط ومملكة النمور.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('0c8d0477-bc86-40a0-851d-ce8d201ba286', '332548a8-f9a5-494b-8ad3-5c51771a3379', 3, N'اليوم 3', N'جولة لاستكشاف تمثال بوذا العملاق، مملكة النمور، بوكيت أكواريوم، حديقة الحيوانات، والتجول في المدينة القديمة.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('603ed3a9-3e6a-451d-91ca-0e2ec1f8c785', '332548a8-f9a5-494b-8ad3-5c51771a3379', 4, N'اليوم 4', N'رحلة بحرية لا تُنسى لجزيرة جيمس بوند وفاتح نجا، مع زيارة الجزر الأربعة، شاطئ كاتا بيتش، وكهف الخفافيس ورحلة السفاري الممتعة.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('76074945-9bd1-4858-b85b-7fa9522ed565', '332548a8-f9a5-494b-8ad3-5c51771a3379', 5, N'اليوم 5', N'يوم ترفيهي عائلي بامتياز في المدينة المائية الأكبر في بوكيت، والمصممة لتعكس 7 حضارات عالمية، حيث المسابح والألعاب المائية الرائعة.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('bcd514ae-b192-4355-bf60-c7d791d7b5db', '332548a8-f9a5-494b-8ad3-5c51771a3379', 6, N'اليوم 6', N'يوم حر للاسترخاء التام في مرافق الفندق أو للاستمتاع برمال شواطئ بوكيت الذهبية (بدون سائق).', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('aba81d98-3998-48fc-964a-3761029c9e01', '332548a8-f9a5-494b-8ad3-5c51771a3379', 7, N'اليوم 7', N'توديع جزيرة بوكيت الساحرة، والتوصيل المريح من الفندق إلى المطار للعودة إلى الديار بسلامة الله.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('98d16390-1b98-4bc7-8931-8c2b1c382706', '332548a8-f9a5-494b-8ad3-5c51771a3379', N'منتجع دياموند بوكيت - جزيرة بوكيت', N'جزيرة بوكيت', 4, 0, N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('f0c13dc2-2f62-4f8c-bdc1-15c0965171fc', '332548a8-f9a5-494b-8ad3-5c51771a3379', N'مسار رحلة ممتاز');
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-بوكيت-2026-fly-29-8-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('42b402ce-c3e0-44f2-b208-dee12cfb1811', N'pkg-بوكيت-2026-fly-29-8-days', @Dest_3, N'بكج بوكيت 2026 FLY 29 الساحرة - عرض بوكيت  ايام  ليالي 8 أيام', N'Amazing بوكيت 8 Days Deal', N'استمتع بـ 7 ليالي من الرفاهية في منتجع دياموند بوكيت - جزيرة بوكيت وغيرها', 3650, N'ر.س', N'8 أيام / 7 ليالي', 8, 7, N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 1, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('3ada118f-305f-4487-ab3c-03ccba666ec6', '42b402ce-c3e0-44f2-b208-dee12cfb1811', 1, N'اليوم 1', N'ترحيب حار في مطار بوكيت الدولي والانتقال بكل راحة إلى المنتجع لتسجيل الدخول.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('adae160b-78d7-4d5d-8dad-2e658e0e0134', '42b402ce-c3e0-44f2-b208-dee12cfb1811', 2, N'اليوم 2', N'بدء المغامرات بجولة لخليج بان ناه، الحديقة المائية، شلال بانغ باي، عالم المحيط، ومملكة النمور.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('36994baf-6ed1-41c4-8d4f-0963939dc157', '42b402ce-c3e0-44f2-b208-dee12cfb1811', 3, N'اليوم 3', N'جولة ثقافية وترفيهية تشمل تمثال بوذا العملاق، الأكواريوم المائي، حديقة الحيوانات، والمدينة القديمة التراثية.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('9a2093e4-b212-4463-9dae-c55f45e4b645', '42b402ce-c3e0-44f2-b208-dee12cfb1811', 4, N'اليوم 4', N'قضاء يوم كامل في رحلة بحرية إلى جزيرة جيمس بوند، الجزر الأربعة، الاستمتاع بكاتا بيتش، وتجربة السفاري.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('b0a0c937-f708-4666-b254-63888ab1ccc2', '42b402ce-c3e0-44f2-b208-dee12cfb1811', 5, N'اليوم 5', N'يوم من المرح والإثارة في المدينة المائية الكبرى ببوكيت ذات التصميم العالمي المستوحى من حضارات العالم.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('c55e5947-35dc-4d59-b2e5-d4dd297b6475', '42b402ce-c3e0-44f2-b208-dee12cfb1811', 6, N'اليوم 6', N'جولة تسوق خاصة بالسيارة لزيارة أشهر أسواق بوكيت واقتناء أروع الهدايا التذكارية.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('c7990e2d-2e42-4d4d-a1ee-36ab622bda38', '42b402ce-c3e0-44f2-b208-dee12cfb1811', 7, N'اليوم 7', N'يوم حر مخصص للاسترخاء على الشواطئ والاستمتاع بالمرافق الفندقية الفاخرة (بدون سائق).', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('b7ed5449-9cab-4279-8fb0-c9683b901063', '42b402ce-c3e0-44f2-b208-dee12cfb1811', 8, N'اليوم 8', N'نهاية الرحلة الممتعة، التوديع والتوصيل إلى المطار متمنين لكم رحلة عودة آمنة.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('7cfcce3e-3755-46e3-b1d1-71ee17839ee8', '42b402ce-c3e0-44f2-b208-dee12cfb1811', N'منتجع دياموند بوكيت - جزيرة بوكيت', N'جزيرة بوكيت', 4, 0, N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('7ec02198-da1e-4153-b138-8cd1cf803149', '42b402ce-c3e0-44f2-b208-dee12cfb1811', N'مسار رحلة ممتاز');
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-بوكيت-2026-fly-29-5-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('5dcafaf3-d61b-4ed1-a60d-ac9d5db93a17', N'pkg-بوكيت-2026-fly-29-5-days', @Dest_3, N'بكج بوكيت 2026 FLY 29 الساحرة - عروض فوكيت بالربال السعودي 5 أيام', N'Amazing بوكيت 2026 FLY 29 5 Days Package', N'استمتع بـ 4 ليالي من الرفاهية في أفضل فنادق بوكيت 2026 FLY 29', 3750, N'ر.س', N'5 أيام / 4 ليالي', 5, 4, N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 1, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('d9f1e947-f3f6-4784-8017-dc934d0f92c9', '5dcafaf3-d61b-4ed1-a60d-ac9d5db93a17', 1, N'اليوم 1', N'وصف تفصيلي لجولات اليوم رقم 1 في بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('7619037e-7f79-4f0d-85ce-a22b5ae1aff3', '5dcafaf3-d61b-4ed1-a60d-ac9d5db93a17', 2, N'اليوم 2', N'وصف تفصيلي لجولات اليوم رقم 2 في بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('6d35d41b-7d70-4b73-840f-42b6d8c6c753', '5dcafaf3-d61b-4ed1-a60d-ac9d5db93a17', 3, N'اليوم 3', N'وصف تفصيلي لجولات اليوم رقم 3 في بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('79b653a3-2245-401a-af97-e9dabaf9fd80', '5dcafaf3-d61b-4ed1-a60d-ac9d5db93a17', 4, N'اليوم 4', N'وصف تفصيلي لجولات اليوم رقم 4 في بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('b97d2f3c-3e3c-435d-b295-19a8b725ef2c', '5dcafaf3-d61b-4ed1-a60d-ac9d5db93a17', 5, N'اليوم 5', N'وصف تفصيلي لجولات اليوم رقم 5 في بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('ee429b6a-aa70-4ad4-82b3-c3def5b1d08d', '5dcafaf3-d61b-4ed1-a60d-ac9d5db93a17', N'فندق الملحم الفاخر - بوكيت 2026 FLY 29', N'بوكيت 2026 FLY 29', 5, 0, N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('7e3a22b5-a01c-482f-922b-5b557b9149e4', '5dcafaf3-d61b-4ed1-a60d-ac9d5db93a17', N'مسار رحلة ممتاز');
END

DECLARE @Dest_4 UNIQUEIDENTIFIER;
SELECT @Dest_4 = Id FROM Destinations WHERE NameAr = N'تركيا 2026 FLY 29';
IF @Dest_4 IS NULL
BEGIN
    SET @Dest_4 = NEWID();
    INSERT INTO Destinations (Id, NameAr, NameEn, Slug, Country, ImageUrl, Description, IsActive, SortOrder)
    VALUES (@Dest_4, N'تركيا 2026 FLY 29', N'Destination En', N'تركيا-2026-fly-29', N'تركيا 2026 FLY 29', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop', N'اكتشف جمال وعراقة تركيا 2026 FLY 29 مع برامج الملحم السياحية الفاخرة المميزة.', 1, 100);
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-تركيا-2026-fly-29-10-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('9eaeefab-0d40-4dfd-b0bd-945273fb4c96', N'pkg-تركيا-2026-fly-29-10-days', @Dest_4, N'بكج تركيا 2026 FLY 29 الساحرة - عرض اسطنبول  ايام  ليالي 10 أيام', N'Amazing تركيا 2026 FLY 29 10 Days Package', N'استمتع بـ 9 ليالي من الرفاهية في أفضل فنادق تركيا 2026 FLY 29', 6000, N'ر.س', N'10 أيام / 9 ليالي', 10, 9, N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 1, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('55e49ce5-68e2-46db-8fef-4965581f1159', '9eaeefab-0d40-4dfd-b0bd-945273fb4c96', 1, N'اليوم 1', N'وصف تفصيلي لجولات اليوم رقم 1 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('05049d04-c50f-44dd-8d6f-5c9c5477e3f4', '9eaeefab-0d40-4dfd-b0bd-945273fb4c96', 2, N'اليوم 2', N'وصف تفصيلي لجولات اليوم رقم 2 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('f4e77929-4586-477d-a3d2-95eaf918fca2', '9eaeefab-0d40-4dfd-b0bd-945273fb4c96', 3, N'اليوم 3', N'وصف تفصيلي لجولات اليوم رقم 3 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('5dd1b55d-872f-4fa5-a8d8-2e0bb6f93fbd', '9eaeefab-0d40-4dfd-b0bd-945273fb4c96', 4, N'اليوم 4', N'وصف تفصيلي لجولات اليوم رقم 4 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('6b15fadf-dd24-4900-99c9-c01a4707c8dc', '9eaeefab-0d40-4dfd-b0bd-945273fb4c96', 5, N'اليوم 5', N'وصف تفصيلي لجولات اليوم رقم 5 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('d20e56c4-2d1f-4b3d-869f-b7c91bdb6765', '9eaeefab-0d40-4dfd-b0bd-945273fb4c96', 6, N'اليوم 6', N'وصف تفصيلي لجولات اليوم رقم 6 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('3de0db32-721b-4be2-b381-8cc0e8ab7bf5', '9eaeefab-0d40-4dfd-b0bd-945273fb4c96', 7, N'اليوم 7', N'وصف تفصيلي لجولات اليوم رقم 7 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('1dd8db98-e794-413a-a34d-9fe70b4c4fa1', '9eaeefab-0d40-4dfd-b0bd-945273fb4c96', 8, N'اليوم 8', N'وصف تفصيلي لجولات اليوم رقم 8 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('9578d7e5-040f-43cf-845f-a3fd7ed170bf', '9eaeefab-0d40-4dfd-b0bd-945273fb4c96', 9, N'اليوم 9', N'وصف تفصيلي لجولات اليوم رقم 9 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('116ad17a-c34b-4378-80e4-f440ede4bfda', '9eaeefab-0d40-4dfd-b0bd-945273fb4c96', 10, N'اليوم 10', N'وصف تفصيلي لجولات اليوم رقم 10 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('bc47a3d7-d916-43d0-bc66-51f73310045e', '9eaeefab-0d40-4dfd-b0bd-945273fb4c96', N'فندق الملحم الفاخر - تركيا 2026 FLY 29', N'تركيا 2026 FLY 29', 5, 0, N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('0c7d5c54-0b36-408d-9245-f838894768fe', '9eaeefab-0d40-4dfd-b0bd-945273fb4c96', N'مسار رحلة ممتاز');
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-تركيا-2026-fly-29-5-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('95e3f3d7-5606-4a16-951b-7a9a527e6031', N'pkg-تركيا-2026-fly-29-5-days', @Dest_4, N'بكج تركيا 2026 FLY 29 الساحرة - عرض اسطنبول  يوم  ليالي 5 أيام', N'Amazing تركيا 2026 FLY 29 5 Days Package', N'استمتع بـ 4 ليالي من الرفاهية في أفضل فنادق تركيا 2026 FLY 29', 3750, N'ر.س', N'5 أيام / 4 ليالي', 5, 4, N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 1, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('3f556d42-cec1-4580-856f-1f725b15129c', '95e3f3d7-5606-4a16-951b-7a9a527e6031', 1, N'اليوم 1', N'وصف تفصيلي لجولات اليوم رقم 1 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('49e909ab-d539-4bec-a311-68350227e539', '95e3f3d7-5606-4a16-951b-7a9a527e6031', 2, N'اليوم 2', N'وصف تفصيلي لجولات اليوم رقم 2 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('f50b8701-5333-4334-b0f3-e0db0b2b63f7', '95e3f3d7-5606-4a16-951b-7a9a527e6031', 3, N'اليوم 3', N'وصف تفصيلي لجولات اليوم رقم 3 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('ba61425e-969a-4c37-a7b4-4ea5ebbcc080', '95e3f3d7-5606-4a16-951b-7a9a527e6031', 4, N'اليوم 4', N'وصف تفصيلي لجولات اليوم رقم 4 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('04edfd41-9387-411e-87a6-78c3caa8313e', '95e3f3d7-5606-4a16-951b-7a9a527e6031', 5, N'اليوم 5', N'وصف تفصيلي لجولات اليوم رقم 5 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('1fb2feca-6e49-4762-8948-49a90b0563b2', '95e3f3d7-5606-4a16-951b-7a9a527e6031', N'فندق الملحم الفاخر - تركيا 2026 FLY 29', N'تركيا 2026 FLY 29', 5, 0, N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('fe4d047d-0948-4c7a-98c2-06d06395710b', '95e3f3d7-5606-4a16-951b-7a9a527e6031', N'مسار رحلة ممتاز');
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-تركيا-2026-fly-29-6-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('cc2d633d-11dd-478d-b419-9e90389e6474', N'pkg-تركيا-2026-fly-29-6-days', @Dest_4, N'بكج تركيا 2026 FLY 29 الساحرة - عرض اسطنبول  ايام  ليالي 6 أيام', N'Amazing تركيا 2026 FLY 29 6 Days Package', N'استمتع بـ 5 ليالي من الرفاهية في أفضل فنادق تركيا 2026 FLY 29', 4200, N'ر.س', N'6 أيام / 5 ليالي', 6, 5, N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 1, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('22920f21-403d-4dc1-b366-a0dd4c4828d5', 'cc2d633d-11dd-478d-b419-9e90389e6474', 1, N'اليوم 1', N'وصف تفصيلي لجولات اليوم رقم 1 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('5c475b15-14d5-4ccd-9a4c-e2af537fb4bd', 'cc2d633d-11dd-478d-b419-9e90389e6474', 2, N'اليوم 2', N'وصف تفصيلي لجولات اليوم رقم 2 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('4393ba6c-49fe-4ea2-8ec4-43b2a1332a08', 'cc2d633d-11dd-478d-b419-9e90389e6474', 3, N'اليوم 3', N'وصف تفصيلي لجولات اليوم رقم 3 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('35b57caa-f364-4fa4-9ce2-104fed983e7d', 'cc2d633d-11dd-478d-b419-9e90389e6474', 4, N'اليوم 4', N'وصف تفصيلي لجولات اليوم رقم 4 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('5c0ce1ac-ef91-44a8-8080-d582ff225839', 'cc2d633d-11dd-478d-b419-9e90389e6474', 5, N'اليوم 5', N'وصف تفصيلي لجولات اليوم رقم 5 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('0d6aa060-155b-4b37-9a9e-a2904026a87a', 'cc2d633d-11dd-478d-b419-9e90389e6474', 6, N'اليوم 6', N'وصف تفصيلي لجولات اليوم رقم 6 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('5730314d-4733-4089-b8f5-d1e6b57011d9', 'cc2d633d-11dd-478d-b419-9e90389e6474', N'فندق الملحم الفاخر - تركيا 2026 FLY 29', N'تركيا 2026 FLY 29', 5, 0, N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('97cd889b-63a5-4efe-80ff-630b28f53399', 'cc2d633d-11dd-478d-b419-9e90389e6474', N'مسار رحلة ممتاز');
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-تركيا-2026-fly-29-7-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('a457d7b5-a460-4124-b99e-def6dafc0a46', N'pkg-تركيا-2026-fly-29-7-days', @Dest_4, N'بكج تركيا 2026 FLY 29 الساحرة - عرض اسطنبول  ايام  ليالي 7 أيام', N'Amazing تركيا 2026 FLY 29 7 Days Package', N'استمتع بـ 6 ليالي من الرفاهية في أفضل فنادق تركيا 2026 FLY 29', 4650, N'ر.س', N'7 أيام / 6 ليالي', 7, 6, N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 1, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('e9bf14b9-68f2-4d97-8684-3049ea78c16e', 'a457d7b5-a460-4124-b99e-def6dafc0a46', 1, N'اليوم 1', N'وصف تفصيلي لجولات اليوم رقم 1 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('b8724315-d0b7-455e-a4b1-91cbfef8e36e', 'a457d7b5-a460-4124-b99e-def6dafc0a46', 2, N'اليوم 2', N'وصف تفصيلي لجولات اليوم رقم 2 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('5b609a0e-51e1-4fb4-82fa-8f1d6a915f2a', 'a457d7b5-a460-4124-b99e-def6dafc0a46', 3, N'اليوم 3', N'وصف تفصيلي لجولات اليوم رقم 3 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('2fa9edf5-ecb4-4e51-8602-a3e05e41e9b8', 'a457d7b5-a460-4124-b99e-def6dafc0a46', 4, N'اليوم 4', N'وصف تفصيلي لجولات اليوم رقم 4 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('2562e473-f6ed-42ef-9a9b-22ac92ac8524', 'a457d7b5-a460-4124-b99e-def6dafc0a46', 5, N'اليوم 5', N'وصف تفصيلي لجولات اليوم رقم 5 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('0ac8499f-94e1-41ce-91ea-dc720ffd840d', 'a457d7b5-a460-4124-b99e-def6dafc0a46', 6, N'اليوم 6', N'وصف تفصيلي لجولات اليوم رقم 6 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('0229302c-6fcf-4c17-9762-913a674e3713', 'a457d7b5-a460-4124-b99e-def6dafc0a46', 7, N'اليوم 7', N'وصف تفصيلي لجولات اليوم رقم 7 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('79686e9b-4dba-4a12-9b53-7b0b738a30cc', 'a457d7b5-a460-4124-b99e-def6dafc0a46', N'فندق الملحم الفاخر - تركيا 2026 FLY 29', N'تركيا 2026 FLY 29', 5, 0, N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('4f975bb9-510c-46d6-b6da-4240dc461606', 'a457d7b5-a460-4124-b99e-def6dafc0a46', N'مسار رحلة ممتاز');
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-تركيا-2026-fly-29-8-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('4d44ac7e-6f50-468f-baff-eeb7026d154c', N'pkg-تركيا-2026-fly-29-8-days', @Dest_4, N'بكج تركيا 2026 FLY 29 الساحرة - عرض اسطنبول  ايام  ليالي 8 أيام', N'Amazing تركيا 2026 FLY 29 8 Days Package', N'استمتع بـ 7 ليالي من الرفاهية في أفضل فنادق تركيا 2026 FLY 29', 5100, N'ر.س', N'8 أيام / 7 ليالي', 8, 7, N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 1, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('721ff03e-d9f9-4174-90bc-d48b7e5be511', '4d44ac7e-6f50-468f-baff-eeb7026d154c', 1, N'اليوم 1', N'وصف تفصيلي لجولات اليوم رقم 1 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('d094baf3-d0e6-45c3-ae15-52c1d12cb07d', '4d44ac7e-6f50-468f-baff-eeb7026d154c', 2, N'اليوم 2', N'وصف تفصيلي لجولات اليوم رقم 2 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('52a70f37-bcbc-4ef2-ab92-d8151e02d9ef', '4d44ac7e-6f50-468f-baff-eeb7026d154c', 3, N'اليوم 3', N'وصف تفصيلي لجولات اليوم رقم 3 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('b29c292e-083b-459d-a520-00b5dadea670', '4d44ac7e-6f50-468f-baff-eeb7026d154c', 4, N'اليوم 4', N'وصف تفصيلي لجولات اليوم رقم 4 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('ab5e3263-b70c-476d-aaf7-5260d955b77c', '4d44ac7e-6f50-468f-baff-eeb7026d154c', 5, N'اليوم 5', N'وصف تفصيلي لجولات اليوم رقم 5 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('164d4a27-42ea-4427-8f24-9b7e364be807', '4d44ac7e-6f50-468f-baff-eeb7026d154c', 6, N'اليوم 6', N'وصف تفصيلي لجولات اليوم رقم 6 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('1aecf39f-43e2-460a-be6e-d98b70280797', '4d44ac7e-6f50-468f-baff-eeb7026d154c', 7, N'اليوم 7', N'وصف تفصيلي لجولات اليوم رقم 7 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('def3cd12-9869-4260-be39-98a7a2d68c19', '4d44ac7e-6f50-468f-baff-eeb7026d154c', 8, N'اليوم 8', N'وصف تفصيلي لجولات اليوم رقم 8 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('54865eae-9ad8-43ff-b6b6-9f81d09f7030', '4d44ac7e-6f50-468f-baff-eeb7026d154c', N'فندق الملحم الفاخر - تركيا 2026 FLY 29', N'تركيا 2026 FLY 29', 5, 0, N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('0735b444-61ce-43ff-97cd-e9b1ba4e5636', '4d44ac7e-6f50-468f-baff-eeb7026d154c', N'مسار رحلة ممتاز');
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-تركيا-2026-fly-29-9-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('cda7d728-5f97-4e9a-82f3-b29b992b416a', N'pkg-تركيا-2026-fly-29-9-days', @Dest_4, N'بكج تركيا 2026 FLY 29 الساحرة - عرض اسطنبول  ايام  ليالي 9 أيام', N'Amazing تركيا 2026 FLY 29 9 Days Package', N'استمتع بـ 8 ليالي من الرفاهية في أفضل فنادق تركيا 2026 FLY 29', 5550, N'ر.س', N'9 أيام / 8 ليالي', 9, 8, N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 1, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('2c06e752-8613-44fc-b2df-e74b13a9b97f', 'cda7d728-5f97-4e9a-82f3-b29b992b416a', 1, N'اليوم 1', N'وصف تفصيلي لجولات اليوم رقم 1 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('a17403ed-f854-409b-a265-b061b5bea99a', 'cda7d728-5f97-4e9a-82f3-b29b992b416a', 2, N'اليوم 2', N'وصف تفصيلي لجولات اليوم رقم 2 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('fa441ef9-6366-4b39-86a4-86c2a690158f', 'cda7d728-5f97-4e9a-82f3-b29b992b416a', 3, N'اليوم 3', N'وصف تفصيلي لجولات اليوم رقم 3 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('0e2a67a9-c710-41d3-94f3-0ddbc503e789', 'cda7d728-5f97-4e9a-82f3-b29b992b416a', 4, N'اليوم 4', N'وصف تفصيلي لجولات اليوم رقم 4 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('87bcb43d-9f6e-46ed-b4ce-9171ac179e28', 'cda7d728-5f97-4e9a-82f3-b29b992b416a', 5, N'اليوم 5', N'وصف تفصيلي لجولات اليوم رقم 5 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('15b97cff-ab99-4e8f-ae1b-fbd27d65343c', 'cda7d728-5f97-4e9a-82f3-b29b992b416a', 6, N'اليوم 6', N'وصف تفصيلي لجولات اليوم رقم 6 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('d623c567-992c-472e-b4ea-e1df5d25b36a', 'cda7d728-5f97-4e9a-82f3-b29b992b416a', 7, N'اليوم 7', N'وصف تفصيلي لجولات اليوم رقم 7 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('6f1545d2-2a54-4b37-a527-849282bf7bea', 'cda7d728-5f97-4e9a-82f3-b29b992b416a', 8, N'اليوم 8', N'وصف تفصيلي لجولات اليوم رقم 8 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('7058b376-951c-4830-a13b-29192e22a51e', 'cda7d728-5f97-4e9a-82f3-b29b992b416a', 9, N'اليوم 9', N'وصف تفصيلي لجولات اليوم رقم 9 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('f4dffb97-4132-43a6-b52e-730216d30efe', 'cda7d728-5f97-4e9a-82f3-b29b992b416a', N'فندق الملحم الفاخر - تركيا 2026 FLY 29', N'تركيا 2026 FLY 29', 5, 0, N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('60968758-d1d0-4593-92f3-516361095658', 'cda7d728-5f97-4e9a-82f3-b29b992b416a', N'مسار رحلة ممتاز');
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-تركيا-2026-fly-29-12-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('23bd14f9-12fd-4df2-99a1-089eaddc1aba', N'pkg-تركيا-2026-fly-29-12-days', @Dest_4, N'بكج تركيا 2026 FLY 29 الساحرة - عرض اسطنبول بالريال السعودي_ 12 أيام', N'Amazing تركيا 2026 FLY 29 12 Days Package', N'استمتع بـ 1 ليالي من الرفاهية في أفضل فنادق تركيا 2026 FLY 29', 6900, N'ر.س', N'12 أيام / 1 ليالي', 12, 1, N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 1, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('ef5d5be2-8f37-468f-b514-b94c2e893d86', '23bd14f9-12fd-4df2-99a1-089eaddc1aba', 1, N'اليوم 1', N'وصف تفصيلي لجولات اليوم رقم 1 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('818a6557-c526-49f9-9e59-84fbdf23ae22', '23bd14f9-12fd-4df2-99a1-089eaddc1aba', 2, N'اليوم 2', N'وصف تفصيلي لجولات اليوم رقم 2 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('ac2a9722-1351-4007-b07c-86ec8376fa18', '23bd14f9-12fd-4df2-99a1-089eaddc1aba', 3, N'اليوم 3', N'وصف تفصيلي لجولات اليوم رقم 3 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('b74ea9e6-3956-4b4f-8e05-ccd0f690aad8', '23bd14f9-12fd-4df2-99a1-089eaddc1aba', 4, N'اليوم 4', N'وصف تفصيلي لجولات اليوم رقم 4 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('338e0dbb-f1ac-4dda-9489-f8b1003e2505', '23bd14f9-12fd-4df2-99a1-089eaddc1aba', 5, N'اليوم 5', N'وصف تفصيلي لجولات اليوم رقم 5 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('b76319b9-5f24-4c29-9e31-0d200aa72511', '23bd14f9-12fd-4df2-99a1-089eaddc1aba', 6, N'اليوم 6', N'وصف تفصيلي لجولات اليوم رقم 6 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('b4c79cf3-65ee-4ca0-a9e9-29d7e30fcf28', '23bd14f9-12fd-4df2-99a1-089eaddc1aba', 7, N'اليوم 7', N'وصف تفصيلي لجولات اليوم رقم 7 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('8277a1c8-8290-46a5-910f-50ba330b4e6c', '23bd14f9-12fd-4df2-99a1-089eaddc1aba', 8, N'اليوم 8', N'وصف تفصيلي لجولات اليوم رقم 8 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('24ee92e1-59bf-4a55-a140-cef6d4f90cfb', '23bd14f9-12fd-4df2-99a1-089eaddc1aba', 9, N'اليوم 9', N'وصف تفصيلي لجولات اليوم رقم 9 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('90db1247-c85d-4b6f-90df-3cade8a5bd01', '23bd14f9-12fd-4df2-99a1-089eaddc1aba', 10, N'اليوم 10', N'وصف تفصيلي لجولات اليوم رقم 10 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('81cb0abe-c3ad-4498-b31c-636fd2b80f2a', '23bd14f9-12fd-4df2-99a1-089eaddc1aba', 11, N'اليوم 11', N'وصف تفصيلي لجولات اليوم رقم 11 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('a9647bc8-08a0-499a-8b0e-a9592876033c', '23bd14f9-12fd-4df2-99a1-089eaddc1aba', 12, N'اليوم 12', N'وصف تفصيلي لجولات اليوم رقم 12 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('ba269016-459d-433f-92fc-a3aaabffe7f2', '23bd14f9-12fd-4df2-99a1-089eaddc1aba', N'فندق الملحم الفاخر - تركيا 2026 FLY 29', N'تركيا 2026 FLY 29', 5, 0, N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('ecce4e61-cab8-4871-b6f7-9ae2ba1bc6aa', '23bd14f9-12fd-4df2-99a1-089eaddc1aba', N'مسار رحلة ممتاز');
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-تركيا-2026-fly-29-12-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('1c926c38-993f-492d-a8e1-c6e83da5b280', N'pkg-تركيا-2026-fly-29-12-days', @Dest_4, N'بكج تركيا 2026 FLY 29 الساحرة - عرض اسطنبول بالريال السعودي_ 12 أيام', N'Amazing تركيا 2026 FLY 29 12 Days Package', N'استمتع بـ 11 ليالي من الرفاهية في أفضل فنادق تركيا 2026 FLY 29', 6900, N'ر.س', N'12 أيام / 11 ليالي', 12, 11, N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 1, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('4946f8b5-228b-4a38-b6a9-158fe4d4eab8', '1c926c38-993f-492d-a8e1-c6e83da5b280', 1, N'اليوم 1', N'وصف تفصيلي لجولات اليوم رقم 1 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('c850566c-576e-4642-a6f7-adb08532e506', '1c926c38-993f-492d-a8e1-c6e83da5b280', 2, N'اليوم 2', N'وصف تفصيلي لجولات اليوم رقم 2 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('f4f3e9a6-14c1-46fa-a712-36486b33d2f4', '1c926c38-993f-492d-a8e1-c6e83da5b280', 3, N'اليوم 3', N'وصف تفصيلي لجولات اليوم رقم 3 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('f8774d08-6b2d-43a7-a879-ffbc67475d0c', '1c926c38-993f-492d-a8e1-c6e83da5b280', 4, N'اليوم 4', N'وصف تفصيلي لجولات اليوم رقم 4 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('06ecc133-9cd4-4a60-896b-b155d41217b2', '1c926c38-993f-492d-a8e1-c6e83da5b280', 5, N'اليوم 5', N'وصف تفصيلي لجولات اليوم رقم 5 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('cf2c6937-bacd-43b4-802b-9aaa9b08d351', '1c926c38-993f-492d-a8e1-c6e83da5b280', 6, N'اليوم 6', N'وصف تفصيلي لجولات اليوم رقم 6 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('319e35c5-bd34-4f1d-92f2-092048210842', '1c926c38-993f-492d-a8e1-c6e83da5b280', 7, N'اليوم 7', N'وصف تفصيلي لجولات اليوم رقم 7 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('1fab7f05-1f8d-4133-85a1-6e13f0be4255', '1c926c38-993f-492d-a8e1-c6e83da5b280', 8, N'اليوم 8', N'وصف تفصيلي لجولات اليوم رقم 8 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('986158be-6ac0-43f7-964a-0da60ac505cd', '1c926c38-993f-492d-a8e1-c6e83da5b280', 9, N'اليوم 9', N'وصف تفصيلي لجولات اليوم رقم 9 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('0e080cd1-e4f7-45f6-8c4d-7a760ebed253', '1c926c38-993f-492d-a8e1-c6e83da5b280', 10, N'اليوم 10', N'وصف تفصيلي لجولات اليوم رقم 10 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('1ba56344-3988-466b-a25a-7365fead3b5e', '1c926c38-993f-492d-a8e1-c6e83da5b280', 11, N'اليوم 11', N'وصف تفصيلي لجولات اليوم رقم 11 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('0adbe5b6-a8ef-4cca-8695-d52f5ebc7333', '1c926c38-993f-492d-a8e1-c6e83da5b280', 12, N'اليوم 12', N'وصف تفصيلي لجولات اليوم رقم 12 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('78db3347-4572-4a9b-845f-7d5db6e6f832', '1c926c38-993f-492d-a8e1-c6e83da5b280', N'فندق الملحم الفاخر - تركيا 2026 FLY 29', N'تركيا 2026 FLY 29', 5, 0, N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('f04b7e1d-942b-4d32-9f4e-f59b30dab65c', '1c926c38-993f-492d-a8e1-c6e83da5b280', N'مسار رحلة ممتاز');
END

DECLARE @Dest_5 UNIQUEIDENTIFIER;
SELECT @Dest_5 = Id FROM Destinations WHERE NameAr = N'روسيا قديم';
IF @Dest_5 IS NULL
BEGIN
    SET @Dest_5 = NEWID();
    INSERT INTO Destinations (Id, NameAr, NameEn, Slug, Country, ImageUrl, Description, IsActive, SortOrder)
    VALUES (@Dest_5, N'روسيا قديم', N'Destination En', N'روسيا-قديم', N'روسيا قديم', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', N'اكتشف جمال وعراقة روسيا قديم مع برامج الملحم السياحية الفاخرة المميزة.', 1, 100);
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-روسيا-قديم-5-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('c022b31f-9bd0-4431-a432-adbae9edb45a', N'pkg-روسيا-قديم-5-days', @Dest_5, N'بكج روسيا قديم الساحرة - اسعار روسيا بالريال السعودي 5 أيام', N'Amazing روسيا قديم 5 Days Package', N'استمتع بـ 4 ليالي من الرفاهية في أفضل فنادق روسيا قديم', 3750, N'ر.س', N'5 أيام / 4 ليالي', 5, 4, N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 0, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('a05dde19-2cd2-4c4e-922c-11e8b1b2dc12', 'c022b31f-9bd0-4431-a432-adbae9edb45a', 1, N'اليوم 1', N'وصف تفصيلي لجولات اليوم رقم 1 في روسيا قديم. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('4424c732-a4b5-4bf0-8fff-4329efc7256d', 'c022b31f-9bd0-4431-a432-adbae9edb45a', 2, N'اليوم 2', N'وصف تفصيلي لجولات اليوم رقم 2 في روسيا قديم. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('11965417-dc33-4e2d-98c4-5781a8857d08', 'c022b31f-9bd0-4431-a432-adbae9edb45a', 3, N'اليوم 3', N'وصف تفصيلي لجولات اليوم رقم 3 في روسيا قديم. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('0f89506f-cb08-4af9-a94f-d61056e1ca4c', 'c022b31f-9bd0-4431-a432-adbae9edb45a', 4, N'اليوم 4', N'وصف تفصيلي لجولات اليوم رقم 4 في روسيا قديم. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('1412464a-e90d-46ad-a926-afdc06783a25', 'c022b31f-9bd0-4431-a432-adbae9edb45a', 5, N'اليوم 5', N'وصف تفصيلي لجولات اليوم رقم 5 في روسيا قديم. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('a7ba0013-eb27-4a2d-b4c6-dac6fc1db16e', 'c022b31f-9bd0-4431-a432-adbae9edb45a', N'فندق الملحم الفاخر - روسيا قديم', N'روسيا قديم', 5, 0, N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('6b2f7bf2-ef4e-4379-ad90-eede8f3702ef', 'c022b31f-9bd0-4431-a432-adbae9edb45a', N'مسار رحلة ممتاز');
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-روسيا-قديم-10-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('9a2dc2b8-8b18-4433-99c5-93cee36813ed', N'pkg-روسيا-قديم-10-days', @Dest_5, N'بكج روسيا قديم الساحرة - عرض روسيا  ايام  ليالي 10 أيام', N'Amazing روسيا 10 Days Deal', N'استمتع بـ 9 ليالي من الرفاهية في فندق بينتا موسكو اربات - موسكو وغيرها', 10350, N'ر.س', N'10 أيام / 9 ليالي', 10, 9, N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 1, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('9c7367ed-f8c9-48bd-b80e-5d7966d44364', '9a2dc2b8-8b18-4433-99c5-93cee36813ed', 1, N'اليوم 1', N'الاستقبال والترحيب في المطار الدولي في موسكو، والتوصيل المباشر والمريح إلى الفندق لتسجيل الدخول والراحة.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('408f7f75-bdf6-4024-a585-5a2c65da97fe', '9a2dc2b8-8b18-4433-99c5-93cee36813ed', 2, N'اليوم 2', N'الانطلاق في جولة ممتعة لزيارة الكرملين إزميلوفو، والذي يعتبر أهم مجمع ثقافي وترفيهي لمشاهدة المعارض والمهرجانات، وزيارة سوق الهدايا التذكارية. ثم التوجه لزيارة حديقة فادنخا واستكشاف المتحف التاريخي، تليها زيارة لأشهر المولات الأوروبية للتسوق.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('1de3a639-72ca-498c-9f3c-020f5aef676c', '9a2dc2b8-8b18-4433-99c5-93cee36813ed', 3, N'اليوم 3', N'جولة استكشافية لمعالم موسكو تشمل زيارة برج كوتافيا لدخول الكرملين، وعمل جولة حول الساحة الحمراء، حديقة الكسندر، كاتدرائية قازان، ضريح لينين، وحديقة زاريادي. بعدها ننتقل إلى ساحة سمولينسكايا للتجول في شارع أربات العريق، ونختتم اليوم بحضور أروع العروض العالمية في سيرك موسكو الشهير.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('9ccef0bf-6d37-4da8-a48a-bec986faf1f3', '9a2dc2b8-8b18-4433-99c5-93cee36813ed', 4, N'اليوم 4', N'رحلة مميزة لزيارة تلال سبارو وركوب التلفريك فوق نهر موسكو للاستمتاع بأجمل المناظر لالتقاط الصور. ثم التوجه لزيارة الداون تاون ومول أفيمال، ونختتم اليوم برحلة كروز ساحرة في نهر موسكو للاستمتاع بجمال الطبيعة والمباني التاريخية.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('8e52814b-024e-47b2-aeb6-fcca1d98a02b', '9a2dc2b8-8b18-4433-99c5-93cee36813ed', 5, N'اليوم 5', N'يوم حر مخصص للاسترخاء التام في الفندق، أو الانطلاق في جولة حرة لاستكشاف شوارع وأسواق المدينة على طريقتك الخاصة (بدون سائق).', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('80f30777-a4ec-47f0-9671-72ed14612ce7', '9a2dc2b8-8b18-4433-99c5-93cee36813ed', 6, N'اليوم 6', N'يوم مليء بالمرح والتشويق في مدينة الأحلام (دريم لاند)، أكبر مدينة ترفيهية في موسكو والمناسبة لجميع الأعمار، حيث نقضي يوماً كاملاً في الاستمتاع بالألعاب والفعاليات المذهلة.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('8e8d1da0-75b4-48da-a3a8-c2716833f4e4', '9a2dc2b8-8b18-4433-99c5-93cee36813ed', 7, N'اليوم 7', N'مغامرة استثنائية لتجربة عربة كلاب الهاسكي الشهيرة، وركوب الخيل، والاستمتاع بقيادة الدراجات الرباعية وسط الطبيعة الخلابة، تليها جولة استكشافية في قصر تساريتسنو التاريخي.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('a4c0389f-d1da-44b6-9492-99df560ce18e', '9a2dc2b8-8b18-4433-99c5-93cee36813ed', 8, N'اليوم 8', N'زيارة رائعة إلى القرية الهولندية للتعرف على الطابع الأوروبي الفريد والتقاط أجمل الصور التذكارية. ثم التوجه لزيارة مركز موسكو التجاري الجديد للاستمتاع بالتسوق في أفخم المولات.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('af7dd0a7-a2dc-4063-bcb1-465ca2c7fa47', '9a2dc2b8-8b18-4433-99c5-93cee36813ed', 9, N'اليوم 9', N'يوم حر مخصص للاسترخاء التام في الفندق، أو الانطلاق في جولة حرة لاستكشاف شوارع وأسواق المدينة على طريقتك الخاصة (بدون سائق).', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('1b22771f-ae00-47c6-988c-343c32f4de2e', '9a2dc2b8-8b18-4433-99c5-93cee36813ed', 10, N'اليوم 10', N'ختام الرحلة الجميلة وتوديع روسيا، حيث يتم التوصيل من مكان الإقامة في موسكو إلى المطار الدولي للعودة بسلامة الله إلى أرض الوطن.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('000c737d-5d39-46b5-a038-690b07fd3c5a', '9a2dc2b8-8b18-4433-99c5-93cee36813ed', N'فندق بينتا موسكو اربات - موسكو', N'موسكو', 4, 0, N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('deed320b-cd39-48c9-9acb-d798a9ee009d', '9a2dc2b8-8b18-4433-99c5-93cee36813ed', N'مسار رحلة ممتاز');
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-روسيا-قديم-11-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('bc16c5f9-0994-4ee9-8de1-8bf2807de573', N'pkg-روسيا-قديم-11-days', @Dest_5, N'بكج روسيا قديم الساحرة - عرض روسيا  ايام  ليالي 11 أيام', N'Amazing روسيا 11 Days Deal', N'استمتع بـ 10 ليالي من الرفاهية في فندق بينتا موسكو اربات - موسكو وغيرها', 13150, N'ر.س', N'11 أيام / 10 ليالي', 11, 10, N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 1, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('5db6ae06-d2a3-4084-a01d-d4da8271e549', 'bc16c5f9-0994-4ee9-8de1-8bf2807de573', 1, N'اليوم 1', N'الاستقبال والترحيب في المطار الدولي في موسكو، والتوصيل المباشر والمريح إلى الفندق لتسجيل الدخول والراحة.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('869dcafd-6059-4026-b3fe-6dcd57645096', 'bc16c5f9-0994-4ee9-8de1-8bf2807de573', 2, N'اليوم 2', N'الانطلاق في جولة ممتعة لزيارة الكرملين إزميلوفو، والذي يعتبر أهم مجمع ثقافي وترفيهي لمشاهدة المعارض والمهرجانات، وزيارة سوق الهدايا التذكارية. ثم التوجه لزيارة حديقة فادنخا واستكشاف المتحف التاريخي، تليها زيارة لأشهر المولات الأوروبية للتسوق.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('8fff15cf-1a74-4119-a099-bea75f06f10f', 'bc16c5f9-0994-4ee9-8de1-8bf2807de573', 3, N'اليوم 3', N'يوم حر مخصص للاسترخاء التام في الفندق، أو الانطلاق في جولة حرة لاستكشاف شوارع وأسواق المدينة على طريقتك الخاصة (بدون سائق).', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('5a18ea00-61e5-45bc-8742-3d2ce0f0e9b5', 'bc16c5f9-0994-4ee9-8de1-8bf2807de573', 4, N'اليوم 4', N'تسجيل الخروج من الفندق في موسكو والانتقال المريح إلى محطة القطار للتوجه إلى سانت بطرسبرغ، وعند الوصول يتم الاستقبال والتوصيل إلى الفندق المحجوز.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('f3745a24-d657-4da3-a7b8-587411a85e85', 'bc16c5f9-0994-4ee9-8de1-8bf2807de573', 5, N'اليوم 5', N'جولة سياحية لاستكشاف سحر سانت بطرسبرغ، تشمل قلعة بطرس وبولس، شارع نيفسكي بروسبكت، كاتدرائية سمولني، وساحة القصر. ثم التوجه لزيارة قصر بيترهوف للاستمتاع بالحديقة السفلى والشلالات والمتحف الوطني.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('56031ee1-8a37-4103-9904-3b787438748e', 'bc16c5f9-0994-4ee9-8de1-8bf2807de573', 6, N'اليوم 6', N'تسجيل الخروج والانتقال من سانت بطرسبرغ إلى محطة القطار للعودة إلى العاصمة موسكو، وعند الوصول يتم الاستقبال والتوصيل المباشر إلى الفندق.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('f3b7a73b-64ab-467f-8c24-4d6315600016', 'bc16c5f9-0994-4ee9-8de1-8bf2807de573', 7, N'اليوم 7', N'جولة استكشافية لمعالم موسكو تشمل زيارة برج كوتافيا لدخول الكرملين، وعمل جولة حول الساحة الحمراء، حديقة الكسندر، كاتدرائية قازان، ضريح لينين، وحديقة زاريادي. بعدها ننتقل إلى ساحة سمولينسكايا للتجول في شارع أربات العريق، ونختتم اليوم بحضور أروع العروض العالمية في سيرك موسكو الشهير.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('4f8fbf75-547a-476f-9b8e-6d686e63c898', 'bc16c5f9-0994-4ee9-8de1-8bf2807de573', 8, N'اليوم 8', N'رحلة مميزة لزيارة تلال سبارو وركوب التلفريك فوق نهر موسكو للاستمتاع بأجمل المناظر لالتقاط الصور. ثم التوجه لزيارة الداون تاون ومول أفيمال، ونختتم اليوم برحلة كروز ساحرة في نهر موسكو للاستمتاع بجمال الطبيعة والمباني التاريخية.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('f767239e-e93d-4282-b707-96e3519621f2', 'bc16c5f9-0994-4ee9-8de1-8bf2807de573', 9, N'اليوم 9', N'يوم مليء بالمرح والتشويق في مدينة الأحلام (دريم لاند)، أكبر مدينة ترفيهية في موسكو والمناسبة لجميع الأعمار، حيث نقضي يوماً كاملاً في الاستمتاع بالألعاب والفعاليات المذهلة.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('1634f173-15a3-4b66-903d-d68e67b1eb86', 'bc16c5f9-0994-4ee9-8de1-8bf2807de573', 10, N'اليوم 10', N'يوم حر مخصص للاسترخاء التام في الفندق، أو الانطلاق في جولة حرة لاستكشاف شوارع وأسواق المدينة على طريقتك الخاصة (بدون سائق).', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('7e2b3850-7f68-403e-a9ed-08c3742f1ec8', 'bc16c5f9-0994-4ee9-8de1-8bf2807de573', 11, N'اليوم 11', N'ختام الرحلة الجميلة وتوديع روسيا، حيث يتم التوصيل من مكان الإقامة في موسكو إلى المطار الدولي للعودة بسلامة الله إلى أرض الوطن.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('b74026cb-40b4-45b7-8e89-151d4d63ebdf', 'bc16c5f9-0994-4ee9-8de1-8bf2807de573', N'فندق بينتا موسكو اربات - موسكو', N'موسكو', 4, 0, N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('0bf57a33-2bf2-4b94-86a5-d8196fbe107b', 'bc16c5f9-0994-4ee9-8de1-8bf2807de573', N'نوفوتيل سانت بترسبرج - سانت بطرسبرغ', N'سانت بطرسبرغ', 4, 0, N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', 2);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('34a183ad-3238-48db-a39c-b9f7bb4bd0e3', 'bc16c5f9-0994-4ee9-8de1-8bf2807de573', N'مسار رحلة ممتاز');
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-روسيا-قديم-12-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('b82270e1-d7d2-49b5-a490-9aab289612f3', N'pkg-روسيا-قديم-12-days', @Dest_5, N'بكج روسيا قديم الساحرة - عرض روسيا  ايام  ليلة 12 أيام', N'Amazing روسيا 12 Days Deal', N'استمتع بـ 11 ليالي من الرفاهية في فندق بينتا موسكو اربات - موسكو وغيرها', 14600, N'ر.س', N'12 أيام / 11 ليالي', 12, 11, N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 1, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('ccb18699-acbe-4e68-9dde-2c1d0049c807', 'b82270e1-d7d2-49b5-a490-9aab289612f3', 1, N'اليوم 1', N'الاستقبال والترحيب في المطار الدولي في موسكو، والتوصيل المباشر والمريح إلى الفندق لتسجيل الدخول والراحة.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('e87f80da-e8d8-4805-b16a-3f89adfc997c', 'b82270e1-d7d2-49b5-a490-9aab289612f3', 2, N'اليوم 2', N'الانطلاق في جولة ممتعة لزيارة الكرملين إزميلوفو، والذي يعتبر أهم مجمع ثقافي وترفيهي لمشاهدة المعارض والمهرجانات، وزيارة سوق الهدايا التذكارية. ثم التوجه لزيارة حديقة فادنخا واستكشاف المتحف التاريخي، تليها زيارة لأشهر المولات الأوروبية للتسوق.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('41c11d0a-da2b-4fcf-b182-f0974a9b8fd4', 'b82270e1-d7d2-49b5-a490-9aab289612f3', 3, N'اليوم 3', N'يوم حر مخصص للاسترخاء التام في الفندق، أو الانطلاق في جولة حرة لاستكشاف شوارع وأسواق المدينة على طريقتك الخاصة (بدون سائق).', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('236ac3e6-4306-4187-a083-730f243805dd', 'b82270e1-d7d2-49b5-a490-9aab289612f3', 4, N'اليوم 4', N'تسجيل الخروج من الفندق في موسكو والانتقال المريح إلى محطة القطار للتوجه إلى سانت بطرسبرغ، وعند الوصول يتم الاستقبال والتوصيل إلى الفندق المحجوز.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('10660a39-45ab-460a-8834-0a8d4dbd8fe8', 'b82270e1-d7d2-49b5-a490-9aab289612f3', 5, N'اليوم 5', N'جولة سياحية لاستكشاف سحر سانت بطرسبرغ، تشمل قلعة بطرس وبولس، شارع نيفسكي بروسبكت، كاتدرائية سمولني، وساحة القصر. ثم التوجه لزيارة قصر بيترهوف للاستمتاع بالحديقة السفلى والشلالات والمتحف الوطني.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('13e23d2b-6833-4005-b1b6-38adb950c205', 'b82270e1-d7d2-49b5-a490-9aab289612f3', 6, N'اليوم 6', N'رحلة تاريخية لزيارة مدينة بوشكين (تسارسكوي سيلو) واستكشاف المقر الإمبراطوري في قصر كاترين المذهل. ثم التوجه للتسوق في مول جاليريا الشهير والتمتع بأجواء المدينة.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('315d9ef7-d75e-4995-a58b-f36fc9aa612f', 'b82270e1-d7d2-49b5-a490-9aab289612f3', 7, N'اليوم 7', N'تسجيل الخروج والانتقال من سانت بطرسبرغ إلى محطة القطار للعودة إلى العاصمة موسكو، وعند الوصول يتم الاستقبال والتوصيل المباشر إلى الفندق.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('88f975a6-025f-4142-96a5-6d2f66aed9aa', 'b82270e1-d7d2-49b5-a490-9aab289612f3', 8, N'اليوم 8', N'جولة استكشافية لمعالم موسكو تشمل زيارة برج كوتافيا لدخول الكرملين، وعمل جولة حول الساحة الحمراء، حديقة الكسندر، كاتدرائية قازان، ضريح لينين، وحديقة زاريادي. بعدها ننتقل إلى ساحة سمولينسكايا للتجول في شارع أربات العريق، ونختتم اليوم بحضور أروع العروض العالمية في سيرك موسكو الشهير.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('e47b26bf-898f-4c7b-80dc-e5d953d03a2f', 'b82270e1-d7d2-49b5-a490-9aab289612f3', 9, N'اليوم 9', N'رحلة مميزة لزيارة تلال سبارو وركوب التلفريك فوق نهر موسكو للاستمتاع بأجمل المناظر لالتقاط الصور. ثم التوجه لزيارة الداون تاون ومول أفيمال، ونختتم اليوم برحلة كروز ساحرة في نهر موسكو للاستمتاع بجمال الطبيعة والمباني التاريخية.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('57298434-672f-476b-9653-accb251ff5c3', 'b82270e1-d7d2-49b5-a490-9aab289612f3', 10, N'اليوم 10', N'يوم مليء بالمرح والتشويق في مدينة الأحلام (دريم لاند)، أكبر مدينة ترفيهية في موسكو والمناسبة لجميع الأعمار، حيث نقضي يوماً كاملاً في الاستمتاع بالألعاب والفعاليات المذهلة.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('f56c5835-3963-42eb-a581-f35f26d7d480', 'b82270e1-d7d2-49b5-a490-9aab289612f3', 11, N'اليوم 11', N'يوم حر مخصص للاسترخاء التام في الفندق، أو الانطلاق في جولة حرة لاستكشاف شوارع وأسواق المدينة على طريقتك الخاصة (بدون سائق).', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('ba5c9dfa-5b27-4b16-aac4-dcf8fdb5e1f8', 'b82270e1-d7d2-49b5-a490-9aab289612f3', 12, N'اليوم 12', N'ختام الرحلة الجميلة وتوديع روسيا، حيث يتم التوصيل من مكان الإقامة في موسكو إلى المطار الدولي للعودة بسلامة الله إلى أرض الوطن.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('39b038ff-0e6d-42a2-b935-e505a7bf0619', 'b82270e1-d7d2-49b5-a490-9aab289612f3', N'فندق بينتا موسكو اربات - موسكو', N'موسكو', 4, 0, N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('ebd5092a-0292-4d56-b2e2-73a0d72d3011', 'b82270e1-d7d2-49b5-a490-9aab289612f3', N'نوفوتيل سانت بترسبرج - سانت بطرسبرغ', N'سانت بطرسبرغ', 4, 0, N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', 2);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('2eb14132-bc03-4f9d-bcc6-2bf37c125b42', 'b82270e1-d7d2-49b5-a490-9aab289612f3', N'مسار رحلة ممتاز');
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-روسيا-قديم-13-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('f6c2df05-d90a-47cd-a3df-fc760eb6087a', N'pkg-روسيا-قديم-13-days', @Dest_5, N'بكج روسيا قديم الساحرة - عرض روسيا  ايام  ليلة 13 أيام', N'Amazing روسيا 13 Days Deal', N'استمتع بـ 12 ليالي من الرفاهية في فندق بينتا موسكو اربات - موسكو وغيرها', 15800, N'ر.س', N'13 أيام / 12 ليالي', 13, 12, N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 1, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('a52e76a6-c89e-4dc9-8ea7-4b8bcdae0713', 'f6c2df05-d90a-47cd-a3df-fc760eb6087a', 1, N'اليوم 1', N'الاستقبال والترحيب في المطار الدولي في موسكو، والتوصيل المباشر والمريح إلى الفندق لتسجيل الدخول والراحة.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('a756d01f-b070-434f-8e16-8f2af61aa557', 'f6c2df05-d90a-47cd-a3df-fc760eb6087a', 2, N'اليوم 2', N'الانطلاق في جولة ممتعة لزيارة الكرملين إزميلوفو، والذي يعتبر أهم مجمع ثقافي وترفيهي لمشاهدة المعارض والمهرجانات، وزيارة سوق الهدايا التذكارية. ثم التوجه لزيارة حديقة فادنخا واستكشاف المتحف التاريخي، تليها زيارة لأشهر المولات الأوروبية للتسوق.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('c038bb40-1eab-4fa4-b200-f1f8b7dace62', 'f6c2df05-d90a-47cd-a3df-fc760eb6087a', 3, N'اليوم 3', N'يوم حر مخصص للاسترخاء التام في الفندق، أو الانطلاق في جولة حرة لاستكشاف شوارع وأسواق المدينة على طريقتك الخاصة (بدون سائق).', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('97997587-1cb0-4489-9504-bc0571a78b51', 'f6c2df05-d90a-47cd-a3df-fc760eb6087a', 4, N'اليوم 4', N'تسجيل الخروج من الفندق في موسكو والانتقال المريح إلى محطة القطار للتوجه إلى سانت بطرسبرغ، وعند الوصول يتم الاستقبال والتوصيل إلى الفندق المحجوز.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('ba36929d-1bc6-4e4c-af3e-f3eef3f0b5cb', 'f6c2df05-d90a-47cd-a3df-fc760eb6087a', 5, N'اليوم 5', N'جولة سياحية لاستكشاف سحر سانت بطرسبرغ، تشمل قلعة بطرس وبولس، شارع نيفسكي بروسبكت، كاتدرائية سمولني، وساحة القصر. ثم التوجه لزيارة قصر بيترهوف للاستمتاع بالحديقة السفلى والشلالات والمتحف الوطني.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('2a462b80-61e1-4b6d-8de1-f2a867b81c9e', 'f6c2df05-d90a-47cd-a3df-fc760eb6087a', 6, N'اليوم 6', N'رحلة تاريخية لزيارة مدينة بوشكين (تسارسكوي سيلو) واستكشاف المقر الإمبراطوري في قصر كاترين المذهل. ثم التوجه للتسوق في مول جاليريا الشهير والتمتع بأجواء المدينة.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('aa34c6be-aca9-4b87-a27e-ea9b70db6748', 'f6c2df05-d90a-47cd-a3df-fc760eb6087a', 7, N'اليوم 7', N'تسجيل الخروج والانتقال من سانت بطرسبرغ إلى محطة القطار للعودة إلى العاصمة موسكو، وعند الوصول يتم الاستقبال والتوصيل المباشر إلى الفندق.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('86f6ba8c-e247-43df-bfc9-42cb621a8f17', 'f6c2df05-d90a-47cd-a3df-fc760eb6087a', 8, N'اليوم 8', N'جولة استكشافية لمعالم موسكو تشمل زيارة برج كوتافيا لدخول الكرملين، وعمل جولة حول الساحة الحمراء، حديقة الكسندر، كاتدرائية قازان، ضريح لينين، وحديقة زاريادي. بعدها ننتقل إلى ساحة سمولينسكايا للتجول في شارع أربات العريق، ونختتم اليوم بحضور أروع العروض العالمية في سيرك موسكو الشهير.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('138c6bc6-273c-4ae1-8978-b59ac080ce92', 'f6c2df05-d90a-47cd-a3df-fc760eb6087a', 9, N'اليوم 9', N'رحلة مميزة لزيارة تلال سبارو وركوب التلفريك فوق نهر موسكو للاستمتاع بأجمل المناظر لالتقاط الصور. ثم التوجه لزيارة الداون تاون ومول أفيمال، ونختتم اليوم برحلة كروز ساحرة في نهر موسكو للاستمتاع بجمال الطبيعة والمباني التاريخية.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('9347cb03-0aa8-4235-9d40-dc1fb9f2ef28', 'f6c2df05-d90a-47cd-a3df-fc760eb6087a', 10, N'اليوم 10', N'يوم مليء بالمرح والتشويق في مدينة الأحلام (دريم لاند)، أكبر مدينة ترفيهية في موسكو والمناسبة لجميع الأعمار، حيث نقضي يوماً كاملاً في الاستمتاع بالألعاب والفعاليات المذهلة.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('171f063f-43b8-49aa-a24a-c0c248d4cc89', 'f6c2df05-d90a-47cd-a3df-fc760eb6087a', 11, N'اليوم 11', N'مغامرة استثنائية لتجربة عربة كلاب الهاسكي الشهيرة، وركوب الخيل، والاستمتاع بقيادة الدراجات الرباعية وسط الطبيعة الخلابة، تليها جولة استكشافية في قصر تساريتسنو التاريخي.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('69613763-4256-4599-bd4b-98c34744b6ef', 'f6c2df05-d90a-47cd-a3df-fc760eb6087a', 12, N'اليوم 12', N'يوم حر مخصص للاسترخاء التام في الفندق، أو الانطلاق في جولة حرة لاستكشاف شوارع وأسواق المدينة على طريقتك الخاصة (بدون سائق).', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('a7c0b8e8-1223-4cda-b86a-dadc9b5de634', 'f6c2df05-d90a-47cd-a3df-fc760eb6087a', 13, N'اليوم 13', N'ختام الرحلة الجميلة وتوديع روسيا، حيث يتم التوصيل من مكان الإقامة في موسكو إلى المطار الدولي للعودة بسلامة الله إلى أرض الوطن.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('a583afbf-094f-4658-b642-3dcd27a44252', 'f6c2df05-d90a-47cd-a3df-fc760eb6087a', N'فندق بينتا موسكو اربات - موسكو', N'موسكو', 4, 0, N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('263e82e7-1bc1-4851-bbf9-73a38605a9d0', 'f6c2df05-d90a-47cd-a3df-fc760eb6087a', N'نوفوتيل سانت بترسبرج - سانت بطرسبرغ', N'سانت بطرسبرغ', 4, 0, N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', 2);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('29e5e3e1-54de-4ae5-adaf-13336729201a', 'f6c2df05-d90a-47cd-a3df-fc760eb6087a', N'مسار رحلة ممتاز');
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-روسيا-قديم-14-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('c75c98ba-9b49-42d7-a107-2884e20ba5f0', N'pkg-روسيا-قديم-14-days', @Dest_5, N'بكج روسيا قديم الساحرة - عرض روسيا  ايام  ليلة 14 أيام', N'Amazing روسيا 14 Days Deal', N'استمتع بـ 13 ليالي من الرفاهية في فندق بينتا موسكو اربات - موسكو وغيرها', 17250, N'ر.س', N'14 أيام / 13 ليالي', 14, 13, N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 1, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('00d517bb-a665-4023-87d5-a95a6627ad3d', 'c75c98ba-9b49-42d7-a107-2884e20ba5f0', 1, N'اليوم 1', N'الاستقبال والترحيب في المطار الدولي في موسكو، والتوصيل المباشر والمريح إلى الفندق لتسجيل الدخول والراحة.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('da43edef-0d22-4865-94f7-db6aa97c9129', 'c75c98ba-9b49-42d7-a107-2884e20ba5f0', 2, N'اليوم 2', N'الانطلاق في جولة ممتعة لزيارة الكرملين إزميلوفو، والذي يعتبر أهم مجمع ثقافي وترفيهي لمشاهدة المعارض والمهرجانات، وزيارة سوق الهدايا التذكارية. ثم التوجه لزيارة حديقة فادنخا واستكشاف المتحف التاريخي، تليها زيارة لأشهر المولات الأوروبية للتسوق.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('fd7afce6-cc2d-4d67-872b-886ba72877f7', 'c75c98ba-9b49-42d7-a107-2884e20ba5f0', 3, N'اليوم 3', N'يوم حر مخصص للاسترخاء التام في الفندق، أو الانطلاق في جولة حرة لاستكشاف شوارع وأسواق المدينة على طريقتك الخاصة (بدون سائق).', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('89971500-4ee2-4b31-8b94-5075689dfd49', 'c75c98ba-9b49-42d7-a107-2884e20ba5f0', 4, N'اليوم 4', N'تسجيل الخروج من الفندق في موسكو والانتقال المريح إلى محطة القطار للتوجه إلى سانت بطرسبرغ، وعند الوصول يتم الاستقبال والتوصيل إلى الفندق المحجوز.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('362f701b-e860-4a58-83d8-96d12428832f', 'c75c98ba-9b49-42d7-a107-2884e20ba5f0', 5, N'اليوم 5', N'جولة سياحية لاستكشاف سحر سانت بطرسبرغ، تشمل قلعة بطرس وبولس، شارع نيفسكي بروسبكت، كاتدرائية سمولني، وساحة القصر. ثم التوجه لزيارة قصر بيترهوف للاستمتاع بالحديقة السفلى والشلالات والمتحف الوطني.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('96a4f0c3-3777-47e5-8ec6-364bc58d5a0d', 'c75c98ba-9b49-42d7-a107-2884e20ba5f0', 6, N'اليوم 6', N'رحلة تاريخية لزيارة مدينة بوشكين (تسارسكوي سيلو) واستكشاف المقر الإمبراطوري في قصر كاترين المذهل. ثم التوجه للتسوق في مول جاليريا الشهير والتمتع بأجواء المدينة.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('48c0e008-4bba-4765-a216-d89d60f32948', 'c75c98ba-9b49-42d7-a107-2884e20ba5f0', 7, N'اليوم 7', N'تسجيل الخروج والانتقال من سانت بطرسبرغ إلى محطة القطار للعودة إلى العاصمة موسكو، وعند الوصول يتم الاستقبال والتوصيل المباشر إلى الفندق.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('3a88c5dd-60d0-4424-b9be-de5308e2ef16', 'c75c98ba-9b49-42d7-a107-2884e20ba5f0', 8, N'اليوم 8', N'جولة استكشافية لمعالم موسكو تشمل زيارة برج كوتافيا لدخول الكرملين، وعمل جولة حول الساحة الحمراء، حديقة الكسندر، كاتدرائية قازان، ضريح لينين، وحديقة زاريادي. بعدها ننتقل إلى ساحة سمولينسكايا للتجول في شارع أربات العريق، ونختتم اليوم بحضور أروع العروض العالمية في سيرك موسكو الشهير.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('87eac4c4-df8a-4a99-b2bd-1abd2886460e', 'c75c98ba-9b49-42d7-a107-2884e20ba5f0', 9, N'اليوم 9', N'رحلة مميزة لزيارة تلال سبارو وركوب التلفريك فوق نهر موسكو للاستمتاع بأجمل المناظر لالتقاط الصور. ثم التوجه لزيارة الداون تاون ومول أفيمال، ونختتم اليوم برحلة كروز ساحرة في نهر موسكو للاستمتاع بجمال الطبيعة والمباني التاريخية.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('e8e6fd35-8850-4703-9ef7-b373b8db46a9', 'c75c98ba-9b49-42d7-a107-2884e20ba5f0', 10, N'اليوم 10', N'يوم حر مخصص للاسترخاء التام في الفندق، أو الانطلاق في جولة حرة لاستكشاف شوارع وأسواق المدينة على طريقتك الخاصة (بدون سائق).', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('6ca4e3df-667a-4509-bd6f-16bc9668120f', 'c75c98ba-9b49-42d7-a107-2884e20ba5f0', 11, N'اليوم 11', N'يوم مليء بالمرح والتشويق في مدينة الأحلام (دريم لاند)، أكبر مدينة ترفيهية في موسكو والمناسبة لجميع الأعمار، حيث نقضي يوماً كاملاً في الاستمتاع بالألعاب والفعاليات المذهلة.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('aeaf5f86-23d5-466b-a0a7-e917b349316c', 'c75c98ba-9b49-42d7-a107-2884e20ba5f0', 12, N'اليوم 12', N'مغامرة استثنائية لتجربة عربة كلاب الهاسكي الشهيرة، وركوب الخيل، والاستمتاع بقيادة الدراجات الرباعية وسط الطبيعة الخلابة، تليها جولة استكشافية في قصر تساريتسنو التاريخي.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('54abf32e-1adc-4f6e-a7ba-caeabea9667a', 'c75c98ba-9b49-42d7-a107-2884e20ba5f0', 13, N'اليوم 13', N'يوم حر مخصص للاسترخاء التام في الفندق، أو الانطلاق في جولة حرة لاستكشاف شوارع وأسواق المدينة على طريقتك الخاصة (بدون سائق).', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('b3a2c56a-e528-4f03-ae4d-1444c43729ac', 'c75c98ba-9b49-42d7-a107-2884e20ba5f0', 14, N'اليوم 14', N'ختام الرحلة الجميلة وتوديع روسيا، حيث يتم التوصيل من مكان الإقامة في موسكو إلى المطار الدولي للعودة بسلامة الله إلى أرض الوطن.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('8617bda8-b07e-4499-81b6-dff43cdc98d8', 'c75c98ba-9b49-42d7-a107-2884e20ba5f0', N'فندق بينتا موسكو اربات - موسكو', N'موسكو', 4, 0, N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('ef7d8fd0-fe92-453c-a6c2-b195f28b71e3', 'c75c98ba-9b49-42d7-a107-2884e20ba5f0', N'نوفوتيل سانت بترسبرج - سانت بطرسبرغ', N'سانت بطرسبرغ', 4, 0, N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', 2);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('d88fb47a-38f8-43a0-bf4b-492a20b0291e', 'c75c98ba-9b49-42d7-a107-2884e20ba5f0', N'مسار رحلة ممتاز');
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-روسيا-قديم-6-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('261869e1-10ab-46dd-b817-320a2df744a1', N'pkg-روسيا-قديم-6-days', @Dest_5, N'بكج روسيا قديم الساحرة - عرض روسيا  ايام  ليالي 6 أيام', N'Amazing روسيا 6 Days Deal', N'استمتع بـ 5 ليالي من الرفاهية في فندق بينتا موسكو اربات - موسكو وغيرها', 5750, N'ر.س', N'6 أيام / 5 ليالي', 6, 5, N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 1, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('8646ff61-44f5-485c-9517-f1ee76868b3e', '261869e1-10ab-46dd-b817-320a2df744a1', 1, N'اليوم 1', N'الاستقبال والترحيب في المطار الدولي في موسكو، والتوصيل المباشر والمريح إلى الفندق لتسجيل الدخول والراحة.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('3b51819b-9743-40d1-a233-dcbb10e3b2cc', '261869e1-10ab-46dd-b817-320a2df744a1', 2, N'اليوم 2', N'الانطلاق في جولة ممتعة لزيارة الكرملين إزميلوفو، والذي يعتبر أهم مجمع ثقافي وترفيهي لمشاهدة المعارض والمهرجانات، وزيارة سوق الهدايا التذكارية. ثم التوجه لزيارة حديقة فادنخا واستكشاف المتحف التاريخي، تليها زيارة لأشهر المولات الأوروبية للتسوق.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('3b63e40d-7a7d-433a-b67e-47b6e43a924d', '261869e1-10ab-46dd-b817-320a2df744a1', 3, N'اليوم 3', N'جولة استكشافية لمعالم موسكو تشمل زيارة برج كوتافيا لدخول الكرملين، وعمل جولة حول الساحة الحمراء، حديقة الكسندر، كاتدرائية قازان، ضريح لينين، وحديقة زاريادي. بعدها ننتقل إلى ساحة سمولينسكايا للتجول في شارع أربات العريق، ونختتم اليوم بحضور أروع العروض العالمية في سيرك موسكو الشهير.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('0684cea8-c859-4e41-b269-576640c775db', '261869e1-10ab-46dd-b817-320a2df744a1', 4, N'اليوم 4', N'رحلة مميزة لزيارة تلال سبارو وركوب التلفريك فوق نهر موسكو للاستمتاع بأجمل المناظر لالتقاط الصور. ثم التوجه لزيارة الداون تاون ومول أفيمال، ونختتم اليوم برحلة كروز ساحرة في نهر موسكو للاستمتاع بجمال الطبيعة والمباني التاريخية.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('e343ade0-eb24-4581-886a-33334b6497dc', '261869e1-10ab-46dd-b817-320a2df744a1', 5, N'اليوم 5', N'يوم حر مخصص للاسترخاء التام في الفندق، أو الانطلاق في جولة حرة لاستكشاف شوارع وأسواق المدينة على طريقتك الخاصة (بدون سائق).', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('7ac671ce-c681-43de-9faf-768cdfa81413', '261869e1-10ab-46dd-b817-320a2df744a1', 6, N'اليوم 6', N'ختام الرحلة الجميلة وتوديع روسيا، حيث يتم التوصيل من مكان الإقامة في موسكو إلى المطار الدولي للعودة بسلامة الله إلى أرض الوطن.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('940987c2-f090-41a5-95da-f9bcbcb16bad', '261869e1-10ab-46dd-b817-320a2df744a1', N'فندق بينتا موسكو اربات - موسكو', N'موسكو', 4, 0, N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('5df46407-36a1-4270-a48a-7aa4e6eb4856', '261869e1-10ab-46dd-b817-320a2df744a1', N'مسار رحلة ممتاز');
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-روسيا-قديم-7-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('0dff7ede-4af5-4ed2-a3d7-944519f08b49', N'pkg-روسيا-قديم-7-days', @Dest_5, N'بكج روسيا قديم الساحرة - عرض روسيا  ايام  ليالي 7 أيام', N'Amazing روسيا 7 Days Deal', N'استمتع بـ 6 ليالي من الرفاهية في فندق بينتا موسكو اربات - موسكو وغيرها', 7200, N'ر.س', N'7 أيام / 6 ليالي', 7, 6, N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 1, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('677bad9a-a6f3-4a39-99d6-dfb4129ee5f1', '0dff7ede-4af5-4ed2-a3d7-944519f08b49', 1, N'اليوم 1', N'الاستقبال والترحيب في المطار الدولي في موسكو، والتوصيل المباشر والمريح إلى الفندق لتسجيل الدخول والراحة.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('aaea728d-d3f8-4ead-8427-adac9a10a454', '0dff7ede-4af5-4ed2-a3d7-944519f08b49', 2, N'اليوم 2', N'الانطلاق في جولة ممتعة لزيارة الكرملين إزميلوفو، والذي يعتبر أهم مجمع ثقافي وترفيهي لمشاهدة المعارض والمهرجانات، وزيارة سوق الهدايا التذكارية. ثم التوجه لزيارة حديقة فادنخا واستكشاف المتحف التاريخي، تليها زيارة لأشهر المولات الأوروبية للتسوق.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('852f3063-20f9-47db-a412-730c8164d420', '0dff7ede-4af5-4ed2-a3d7-944519f08b49', 3, N'اليوم 3', N'جولة استكشافية لمعالم موسكو تشمل زيارة برج كوتافيا لدخول الكرملين، وعمل جولة حول الساحة الحمراء، حديقة الكسندر، كاتدرائية قازان، ضريح لينين، وحديقة زاريادي. بعدها ننتقل إلى ساحة سمولينسكايا للتجول في شارع أربات العريق، ونختتم اليوم بحضور أروع العروض العالمية في سيرك موسكو الشهير.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('49d5030a-5312-47ee-bd84-f35a14205766', '0dff7ede-4af5-4ed2-a3d7-944519f08b49', 4, N'اليوم 4', N'رحلة مميزة لزيارة تلال سبارو وركوب التلفريك فوق نهر موسكو للاستمتاع بأجمل المناظر لالتقاط الصور. ثم التوجه لزيارة الداون تاون ومول أفيمال، ونختتم اليوم برحلة كروز ساحرة في نهر موسكو للاستمتاع بجمال الطبيعة والمباني التاريخية.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('3cbbe4dd-03b8-409c-aeb4-3e1db67385a4', '0dff7ede-4af5-4ed2-a3d7-944519f08b49', 5, N'اليوم 5', N'يوم مليء بالمرح والتشويق في مدينة الأحلام (دريم لاند)، أكبر مدينة ترفيهية في موسكو والمناسبة لجميع الأعمار، حيث نقضي يوماً كاملاً في الاستمتاع بالألعاب والفعاليات المذهلة.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('7333bbd4-85ef-4246-ad6d-63da484dbef2', '0dff7ede-4af5-4ed2-a3d7-944519f08b49', 6, N'اليوم 6', N'يوم حر مخصص للاسترخاء التام في الفندق، أو الانطلاق في جولة حرة لاستكشاف شوارع وأسواق المدينة على طريقتك الخاصة (بدون سائق).', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('2a659359-fd46-4adb-8dd1-0c05e8ab3f9c', '0dff7ede-4af5-4ed2-a3d7-944519f08b49', 7, N'اليوم 7', N'ختام الرحلة الجميلة وتوديع روسيا، حيث يتم التوصيل من مكان الإقامة في موسكو إلى المطار الدولي للعودة بسلامة الله إلى أرض الوطن.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('94b0e931-7a86-411b-9802-c6136ac5ffc5', '0dff7ede-4af5-4ed2-a3d7-944519f08b49', N'فندق بينتا موسكو اربات - موسكو', N'موسكو', 4, 0, N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('656c937a-848e-4e1e-9afa-2c621b602e6e', '0dff7ede-4af5-4ed2-a3d7-944519f08b49', N'مسار رحلة ممتاز');
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-روسيا-قديم-8-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('f6e9dd55-daab-469f-b7e4-97ea473d4c8f', N'pkg-روسيا-قديم-8-days', @Dest_5, N'بكج روسيا قديم الساحرة - عرض روسيا  ايام  ليالي 8 أيام', N'Amazing روسيا 8 Days Deal', N'استمتع بـ 7 ليالي من الرفاهية في فندق بينتا موسكو اربات - موسكو وغيرها', 7850, N'ر.س', N'8 أيام / 7 ليالي', 8, 7, N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 1, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('e1134ceb-a3c7-4347-a315-529043de6871', 'f6e9dd55-daab-469f-b7e4-97ea473d4c8f', 1, N'اليوم 1', N'الاستقبال والترحيب في المطار الدولي في موسكو، والتوصيل المباشر والمريح إلى الفندق لتسجيل الدخول والراحة.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('195c15be-dd26-4baa-8f80-a07db84fd121', 'f6e9dd55-daab-469f-b7e4-97ea473d4c8f', 2, N'اليوم 2', N'الانطلاق في جولة ممتعة لزيارة الكرملين إزميلوفو، والذي يعتبر أهم مجمع ثقافي وترفيهي لمشاهدة المعارض والمهرجانات، وزيارة سوق الهدايا التذكارية. ثم التوجه لزيارة حديقة فادنخا واستكشاف المتحف التاريخي، تليها زيارة لأشهر المولات الأوروبية للتسوق.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('e1528337-23f6-450a-b2ed-c066d5339edf', 'f6e9dd55-daab-469f-b7e4-97ea473d4c8f', 3, N'اليوم 3', N'جولة استكشافية لمعالم موسكو تشمل زيارة برج كوتافيا لدخول الكرملين، وعمل جولة حول الساحة الحمراء، حديقة الكسندر، كاتدرائية قازان، ضريح لينين، وحديقة زاريادي. بعدها ننتقل إلى ساحة سمولينسكايا للتجول في شارع أربات العريق، ونختتم اليوم بحضور أروع العروض العالمية في سيرك موسكو الشهير.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('c189faa6-1fcb-4952-87ab-42cfc766265d', 'f6e9dd55-daab-469f-b7e4-97ea473d4c8f', 4, N'اليوم 4', N'يوم حر مخصص للاسترخاء التام في الفندق، أو الانطلاق في جولة حرة لاستكشاف شوارع وأسواق المدينة على طريقتك الخاصة (بدون سائق).', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('7b9d1ef6-5fee-413c-8933-20cd517236c6', 'f6e9dd55-daab-469f-b7e4-97ea473d4c8f', 5, N'اليوم 5', N'رحلة مميزة لزيارة تلال سبارو وركوب التلفريك فوق نهر موسكو للاستمتاع بأجمل المناظر لالتقاط الصور. ثم التوجه لزيارة الداون تاون ومول أفيمال، ونختتم اليوم برحلة كروز ساحرة في نهر موسكو للاستمتاع بجمال الطبيعة والمباني التاريخية.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('843f8a7a-c286-4cd2-8ccc-dbdd6df9c3d8', 'f6e9dd55-daab-469f-b7e4-97ea473d4c8f', 6, N'اليوم 6', N'يوم مليء بالمرح والتشويق في مدينة الأحلام (دريم لاند)، أكبر مدينة ترفيهية في موسكو والمناسبة لجميع الأعمار، حيث نقضي يوماً كاملاً في الاستمتاع بالألعاب والفعاليات المذهلة.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('27f26e43-10bb-444e-955c-4344df65e13e', 'f6e9dd55-daab-469f-b7e4-97ea473d4c8f', 7, N'اليوم 7', N'يوم حر مخصص للاسترخاء التام في الفندق، أو الانطلاق في جولة حرة لاستكشاف شوارع وأسواق المدينة على طريقتك الخاصة (بدون سائق).', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('9e93a518-f675-495d-be30-df5565878e06', 'f6e9dd55-daab-469f-b7e4-97ea473d4c8f', 8, N'اليوم 8', N'ختام الرحلة الجميلة وتوديع روسيا، حيث يتم التوصيل من مكان الإقامة في موسكو إلى المطار الدولي للعودة بسلامة الله إلى أرض الوطن.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('2ec986fe-474e-4d8b-b0c2-c04a05a04a53', 'f6e9dd55-daab-469f-b7e4-97ea473d4c8f', N'فندق بينتا موسكو اربات - موسكو', N'موسكو', 4, 0, N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('c3cbda5a-6c03-46c6-8162-8e189852e379', 'f6e9dd55-daab-469f-b7e4-97ea473d4c8f', N'مسار رحلة ممتاز');
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-روسيا-قديم-9-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('c6b29044-c10a-476e-9973-835d68a1e0b9', N'pkg-روسيا-قديم-9-days', @Dest_5, N'بكج روسيا قديم الساحرة - عرض روسيا  ايام  ليالي 9 أيام', N'Amazing روسيا 9 Days Deal', N'استمتع بـ 8 ليالي من الرفاهية في فندق بينتا موسكو اربات - موسكو وغيرها', 9100, N'ر.س', N'9 أيام / 8 ليالي', 9, 8, N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 1, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('36269e14-64ef-43ff-a089-b6afcf7bd9e4', 'c6b29044-c10a-476e-9973-835d68a1e0b9', 1, N'اليوم 1', N'الاستقبال والترحيب في المطار الدولي في موسكو، والتوصيل المباشر والمريح إلى الفندق لتسجيل الدخول والراحة.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('f38f4e66-af0f-444c-8074-219de703d8ba', 'c6b29044-c10a-476e-9973-835d68a1e0b9', 2, N'اليوم 2', N'الانطلاق في جولة ممتعة لزيارة الكرملين إزميلوفو، والذي يعتبر أهم مجمع ثقافي وترفيهي لمشاهدة المعارض والمهرجانات، وزيارة سوق الهدايا التذكارية. ثم التوجه لزيارة حديقة فادنخا واستكشاف المتحف التاريخي، تليها زيارة لأشهر المولات الأوروبية للتسوق.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('0996673e-3afa-4dd4-a1b7-21b58e659966', 'c6b29044-c10a-476e-9973-835d68a1e0b9', 3, N'اليوم 3', N'جولة استكشافية لمعالم موسكو تشمل زيارة برج كوتافيا لدخول الكرملين، وعمل جولة حول الساحة الحمراء، حديقة الكسندر، كاتدرائية قازان، ضريح لينين، وحديقة زاريادي. بعدها ننتقل إلى ساحة سمولينسكايا للتجول في شارع أربات العريق، ونختتم اليوم بحضور أروع العروض العالمية في سيرك موسكو الشهير.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('d424b26e-5149-4faf-995b-ab468ef83a8a', 'c6b29044-c10a-476e-9973-835d68a1e0b9', 4, N'اليوم 4', N'رحلة مميزة لزيارة تلال سبارو وركوب التلفريك فوق نهر موسكو للاستمتاع بأجمل المناظر لالتقاط الصور. ثم التوجه لزيارة الداون تاون ومول أفيمال، ونختتم اليوم برحلة كروز ساحرة في نهر موسكو للاستمتاع بجمال الطبيعة والمباني التاريخية.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('9dd1b3ff-61c7-4c78-9559-6032e4f6d97d', 'c6b29044-c10a-476e-9973-835d68a1e0b9', 5, N'اليوم 5', N'يوم حر مخصص للاسترخاء التام في الفندق، أو الانطلاق في جولة حرة لاستكشاف شوارع وأسواق المدينة على طريقتك الخاصة (بدون سائق).', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('b312d193-225f-413f-854f-0f935807dd68', 'c6b29044-c10a-476e-9973-835d68a1e0b9', 6, N'اليوم 6', N'يوم مليء بالمرح والتشويق في مدينة الأحلام (دريم لاند)، أكبر مدينة ترفيهية في موسكو والمناسبة لجميع الأعمار، حيث نقضي يوماً كاملاً في الاستمتاع بالألعاب والفعاليات المذهلة.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('354eddf5-526b-43b8-a399-69fe34c1a152', 'c6b29044-c10a-476e-9973-835d68a1e0b9', 7, N'اليوم 7', N'مغامرة استثنائية لتجربة عربة كلاب الهاسكي الشهيرة، وركوب الخيل، والاستمتاع بقيادة الدراجات الرباعية وسط الطبيعة الخلابة، تليها جولة استكشافية في قصر تساريتسنو التاريخي.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('1c8742a4-26c8-4978-a105-e081809d4bc0', 'c6b29044-c10a-476e-9973-835d68a1e0b9', 8, N'اليوم 8', N'يوم حر مخصص للاسترخاء التام في الفندق، أو الانطلاق في جولة حرة لاستكشاف شوارع وأسواق المدينة على طريقتك الخاصة (بدون سائق).', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('0aa25b21-443d-4be4-b851-3e890d67757d', 'c6b29044-c10a-476e-9973-835d68a1e0b9', 9, N'اليوم 9', N'ختام الرحلة الجميلة وتوديع روسيا، حيث يتم التوصيل من مكان الإقامة في موسكو إلى المطار الدولي للعودة بسلامة الله إلى أرض الوطن.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('7b9924bc-5ae4-4c91-a859-c5ab3a7dfc37', 'c6b29044-c10a-476e-9973-835d68a1e0b9', N'فندق بينتا موسكو اربات - موسكو', N'موسكو', 4, 0, N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('bf996511-a0b5-4dba-85f8-184c1f27232c', 'c6b29044-c10a-476e-9973-835d68a1e0b9', N'مسار رحلة ممتاز');
END

DECLARE @Dest_6 UNIQUEIDENTIFIER;
SELECT @Dest_6 = Id FROM Destinations WHERE NameAr = N'فيتنام 2026';
IF @Dest_6 IS NULL
BEGIN
    SET @Dest_6 = NEWID();
    INSERT INTO Destinations (Id, NameAr, NameEn, Slug, Country, ImageUrl, Description, IsActive, SortOrder)
    VALUES (@Dest_6, N'فيتنام 2026', N'Destination En', N'فيتنام-2026', N'فيتنام 2026', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', N'اكتشف جمال وعراقة فيتنام 2026 مع برامج الملحم السياحية الفاخرة المميزة.', 1, 100);
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-فيتنام-2026-10-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('10804ecb-2e07-47b1-b6ae-39058b356b1e', N'pkg-فيتنام-2026-10-days', @Dest_6, N'بكج فيتنام 2026 الساحرة - عرض فيتنام  ايام   ليالي 10 أيام', N'Amazing فيتنام 10 Days Deal', N'استمتع بـ 9 ليالي من الرفاهية في فندق سيلك باث هانواي - هانوي وغيرها', 5500, N'ر.س', N'10 أيام / 9 ليالي', 10, 9, N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 1, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('99155bba-3a52-45c3-9a24-4760fcfc4357', '10804ecb-2e07-47b1-b6ae-39058b356b1e', 1, N'اليوم 1', N'الاستقبال والترحيب في مطار هانوي الدولي والانتقال المريح إلى الفندق لبدء عطلتكم الساحرة.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('3a7da264-85e2-4229-9f1d-4f1bbb4a14a1', '10804ecb-2e07-47b1-b6ae-39058b356b1e', 2, N'اليوم 2', N'جولة طبيعية خلابة في ''نينه بينه''، تتضمن الإبحار بقوارب السامبان في رصيف تام كوك وسط الجبال وحقول الأرز والكهوف المدهشة.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('810a7db6-8be5-4879-acba-3d6323fb1bd5', '10804ecb-2e07-47b1-b6ae-39058b356b1e', 3, N'اليوم 3', N'يوم حر بالكامل في هانوي للاستجمام والراحة، أو لاستكشاف أسواق ومطاعم المدينة بحرية تامة.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('abf39082-0f00-47ef-892d-57d5aec00047', '10804ecb-2e07-47b1-b6ae-39058b356b1e', 4, N'اليوم 4', N'مغادرة هانوي والانتقال المريح إلى مرتفعات سابا ذات الأجواء الباردة عبر باص النوم الفاخر.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('54782808-2cc0-4482-a4b6-d7ecbf4d3a83', '10804ecb-2e07-47b1-b6ae-39058b356b1e', 5, N'اليوم 5', N'استكشاف سابا بزيارة قرية ''كات كات'' للتعرف على تراث الهومونج، ثم الصعود بالتلفريك المذهل لمعانقة السحاب فوق القمم الخضراء.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('a9f408e4-d098-4dca-8e97-e1a88f15be53', '10804ecb-2e07-47b1-b6ae-39058b356b1e', 6, N'اليوم 6', N'يوم سياحي متكامل في سابا لزيارة الشلالات المنعشة، الجسر الزجاجي، ومنطقة ''موانا سابا'' ذات المناظر الفريدة لعشاق التصوير.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('a330ff9f-4488-44f3-b610-ab2d36331adc', '10804ecb-2e07-47b1-b6ae-39058b356b1e', 7, N'اليوم 7', N'رحلة انتقال من طبيعة سابا الجبلية عبر هانوي وصولاً إلى فندق الإقامة في خليج هالونج الساحر.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('abaf8552-2859-452f-9e1e-027c3739361b', '10804ecb-2e07-47b1-b6ae-39058b356b1e', 8, N'اليوم 8', N'يوم مخصص للاسترخاء والجمال في رحلة بحرية فاخرة وسط مياه وجزر خليج هالونج الاستثنائية.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('e313b18a-42af-4e29-b8db-bab7b7dd8791', '10804ecb-2e07-47b1-b6ae-39058b356b1e', 9, N'اليوم 9', N'مغادرة خليج هالونج والعودة بالسيارة الخاصة إلى العاصمة هانوي لقضاء الليلة الأخيرة.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('cb0fc47a-9800-4282-bd15-425be535f91f', '10804ecb-2e07-47b1-b6ae-39058b356b1e', 10, N'اليوم 10', N'نهاية الرحلة السعيدة، والتوصيل المريح من الفندق إلى مطار هانوي للعودة إلى الديار بسلامة الله.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('fc90665b-908a-4d06-bd07-629b4afa1641', '10804ecb-2e07-47b1-b6ae-39058b356b1e', N'فندق سيلك باث هانواي - هانوي', N'هانوي', 4, 0, N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('b62328a9-3e29-42b0-80ea-9ff15f9dec19', '10804ecb-2e07-47b1-b6ae-39058b356b1e', N'فندق باو سابا - مرتفعات سابا', N'مرتفعات سابا', 4, 0, N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', 2);

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('9c127281-1d81-43dc-98a7-7e9827a01d19', '10804ecb-2e07-47b1-b6ae-39058b356b1e', N'فندق سوليل هالونج - خليج الهالونج', N'خليج الهالونج', 4, 0, N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', 3);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('cb6be8df-73ba-411d-b7a0-5feae07c8e1b', '10804ecb-2e07-47b1-b6ae-39058b356b1e', N'مسار رحلة ممتاز');
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-فيتنام-2026-11-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('cb631fe7-7e17-4edf-baa6-bad009d192a6', N'pkg-فيتنام-2026-11-days', @Dest_6, N'بكج فيتنام 2026 الساحرة - عرض فيتنام  يوم   ليالي 11 أيام', N'Amazing فيتنام 11 Days Deal', N'استمتع بـ 10 ليالي من الرفاهية في فندق سيلك باث هانواي - هانوي وغيرها', 5900, N'ر.س', N'11 أيام / 10 ليالي', 11, 10, N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 1, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('70124dc2-f2f3-4d1a-99ed-a0a683fa3f39', 'cb631fe7-7e17-4edf-baa6-bad009d192a6', 1, N'اليوم 1', N'الترحيب الحار في مطار هانوي الدولي والانتقال السلس إلى الفندق للراحة والتجهيز لبدء المغامرة.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('b7e09192-0f7c-4795-a0e5-c263ec8184c9', 'cb631fe7-7e17-4edf-baa6-bad009d192a6', 2, N'اليوم 2', N'رحلة استكشافية إلى جنة ''نينه بينه'' والإبحار بقوارب السامبان وسط الجبال الصخرية وحقول الأرز البديعة في تام كوك.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('ebdd3094-ec51-4a39-8bcd-6b1e567269ad', 'cb631fe7-7e17-4edf-baa6-bad009d192a6', 3, N'اليوم 3', N'جولة سياحية غنية لمدة 8 ساعات للتعرف على أهم المعالم التاريخية والثقافية في العاصمة هانوي.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('d6ff70d9-4419-4e58-9e37-05a327bd775e', 'cb631fe7-7e17-4edf-baa6-bad009d192a6', 4, N'اليوم 4', N'تجربة انتقال مميزة عبر باص النوم من هانوي صعوداً إلى مرتفعات سابا ذات الطبيعة الخلابة.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('9b18d3fb-c233-477d-99da-7e264c41d6f7', 'cb631fe7-7e17-4edf-baa6-bad009d192a6', 5, N'اليوم 5', N'جولة في سابا تشمل زيارة قرية ''كات كات'' ومدرجات الأرز، وتجربة ركوب التلفريك الأطول للوصول إلى قمة الجبل بين السحاب.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('02dbc7d7-4fb6-4742-b00c-10d295bd68fb', 'cb631fe7-7e17-4edf-baa6-bad009d192a6', 6, N'اليوم 6', N'زيارة أجمل المعالم الطبيعية في سابا، وتتضمن الشلالات، الجسر الزجاجي، ومنطقة ''موانا سابا'' لالتقاط صور بانورامية ساحرة.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('5fd7defb-0d50-4abb-a7a9-beeaf1bf93fc', 'cb631fe7-7e17-4edf-baa6-bad009d192a6', 7, N'اليوم 7', N'مغادرة أجواء سابا الباردة والانتقال بالسيارة مروراً بهانوي وصولاً إلى فندق الإقامة في خليج هالونج.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('607d24bd-0a7e-4f7a-a9c6-0bd8da09b279', 'cb631fe7-7e17-4edf-baa6-bad009d192a6', 8, N'اليوم 8', N'يوم مليء بالاسترخاء والمتعة عبر رحلة بحرية فاخرة لاستكشاف جزر وكهوف خليج هالونج المذهل.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('4839b54b-627b-441f-9262-fae18afe92f1', 'cb631fe7-7e17-4edf-baa6-bad009d192a6', 9, N'اليوم 9', N'العودة بالسيارة الخاصة من طبيعة هالونج إلى قلب العاصمة هانوي لتسجيل الدخول بالفندق.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('9dee337f-8831-48a1-afa9-f1388b376a85', 'cb631fe7-7e17-4edf-baa6-bad009d192a6', 10, N'اليوم 10', N'يوم حر ومميز للتسوق واقتناء أروع الهدايا التذكارية من أسواق هانوي النابضة بالحياة.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('a53914d4-321c-43b0-ab46-1ddc839c8c87', 'cb631fe7-7e17-4edf-baa6-bad009d192a6', 11, N'اليوم 11', N'ختام رحلتكم الفيتنامية الممتعة، والانتقال من الفندق إلى مطار هانوي للعودة إلى أرض الوطن بسلام.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('f5416eca-8781-44b3-9ed6-0eab2f6e78e0', 'cb631fe7-7e17-4edf-baa6-bad009d192a6', N'فندق سيلك باث هانواي - هانوي', N'هانوي', 4, 0, N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('6808ba66-0e3a-44f7-99f4-0410d4a93f05', 'cb631fe7-7e17-4edf-baa6-bad009d192a6', N'فندق باو سابا - مرتفعات سابا', N'مرتفعات سابا', 4, 0, N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', 2);

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('b81b5153-834d-4b18-abbe-53433a219d35', 'cb631fe7-7e17-4edf-baa6-bad009d192a6', N'فندق سوليل هالونج - خليج الهالونج', N'خليج الهالونج', 4, 0, N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', 3);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('8c50af5f-7073-4198-af38-f1ac55fe7f55', 'cb631fe7-7e17-4edf-baa6-bad009d192a6', N'مسار رحلة ممتاز');
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-فيتنام-2026-12-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('3ed0ac96-a01e-463a-ad31-9727a08f8529', N'pkg-فيتنام-2026-12-days', @Dest_6, N'بكج فيتنام 2026 الساحرة - عرض فيتنام  يوم   ليلة 12 أيام', N'Amazing فيتنام 12 Days Deal', N'استمتع بـ 11 ليالي من الرفاهية في فندق سيلك باث هانواي - هانوي وغيرها', 7000, N'ر.س', N'12 أيام / 11 ليالي', 12, 11, N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 1, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('bb760ae9-040d-4af2-b8d3-363a2d9f2d87', '3ed0ac96-a01e-463a-ad31-9727a08f8529', 1, N'اليوم 1', N'الاستقبال في مطار هانوي الدولي والتوجه المباشر إلى الفندق لبدء عطلة استثنائية في فيتنام.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('a5ff162f-770e-40fb-957d-dc2b4eadbfd6', '3ed0ac96-a01e-463a-ad31-9727a08f8529', 2, N'اليوم 2', N'يوم مخصص للطبيعة الساحرة في ''نينه بينه''، والإبحار بالقوارب التقليدية وسط الجبال والكهوف في رصيف تام كوك.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('9bad9a32-d123-4722-bec6-d5b01e9a8266', '3ed0ac96-a01e-463a-ad31-9727a08f8529', 3, N'اليوم 3', N'جولة سياحية متكاملة لاكتشاف أهم المعالم الثقافية والسياحية البارزة في العاصمة هانوي.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('203bf321-e6d8-443c-bbeb-ea5305d2d10d', '3ed0ac96-a01e-463a-ad31-9727a08f8529', 4, N'اليوم 4', N'توديع هانوي والانتقال بالطيران الداخلي إلى مدينة دانانج الساحلية، ليتم استقبالكم هناك والتوصيل للفندق.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('57ebf13b-b732-489d-8548-39dfc2f7df14', '3ed0ac96-a01e-463a-ad31-9727a08f8529', 5, N'اليوم 5', N'يوم سياحي خيالي في ''بانا هيلز''، يشمل ركوب أطول تلفريك، المشي على الجسر الذهبي الشهير، وزيارة الملاهي وحديقة الديناصورات.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('b03933d1-ca0c-41ca-a0ec-842d10f4940d', '3ed0ac96-a01e-463a-ad31-9727a08f8529', 6, N'اليوم 6', N'رحلة ممتعة إلى قرية ''كام ثانه'' المائية، لتجربة ركوب قوارب سلة الخيزران الدائرية واصطياد السرطانات، يليها زيارة جبل ماربل.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('ee3e719b-8cf4-41a4-be29-bd579d885f83', '3ed0ac96-a01e-463a-ad31-9727a08f8529', 7, N'اليوم 7', N'يوم حر للاسترخاء التام على شواطئ دانانج الجميلة أو التجول في أسواقها بحرية تامة.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('f81a245c-0d5c-4289-b4e7-934cbead249c', '3ed0ac96-a01e-463a-ad31-9727a08f8529', 8, N'اليوم 8', N'توديع دانانج والعودة بالطيران إلى هانوي، ومن ثم الانتقال المباشر بالسيارة إلى فندقكم في خليج هالونج.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('32e7eb15-7365-4a6b-89a5-33eb5bc9adef', '3ed0ac96-a01e-463a-ad31-9727a08f8529', 9, N'اليوم 9', N'الاستمتاع برحلة بحرية فاخرة وسط المناظر الطبيعية الخلابة والجزر الصخرية المنتشرة في خليج هالونج.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('227f9597-12d3-4271-b8e4-b5bc7117f057', '3ed0ac96-a01e-463a-ad31-9727a08f8529', 10, N'اليوم 10', N'تسجيل الخروج من هالونج والعودة المريحة بالسيارة الخاصة إلى العاصمة هانوي.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('ff32e23b-8305-48cb-bf6f-d58004d452f2', '3ed0ac96-a01e-463a-ad31-9727a08f8529', 11, N'اليوم 11', N'يوم حر أخير للتسوق وشراء أجمل الهدايا التذكارية من أسواق هانوي العريقة.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('d61d1e6e-ee68-469b-a36b-f0eb64d47bd3', '3ed0ac96-a01e-463a-ad31-9727a08f8529', 12, N'اليوم 12', N'انتهاء الرحلة الممتعة والتوصيل من الفندق إلى مطار هانوي الدولي لرحلة العودة بسلامة الله.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('39f8b82f-00dd-4148-b8ce-57e1d669058d', '3ed0ac96-a01e-463a-ad31-9727a08f8529', N'فندق سيلك باث هانواي - هانوي', N'هانوي', 4, 0, N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('f0df8aec-09d7-4006-beb0-48bf60325cbe', '3ed0ac96-a01e-463a-ad31-9727a08f8529', N'سيتادنس بيرل هوي ان - دانانج - دانانج', N'دانانج', 4, 0, N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', 2);

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('7a00df6e-e772-416b-9741-8666358e9063', '3ed0ac96-a01e-463a-ad31-9727a08f8529', N'فندق سوليل هالونج - خليج الهالونج', N'خليج الهالونج', 4, 0, N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', 3);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('c05f2d01-f650-4052-8813-d9df59ab63a3', '3ed0ac96-a01e-463a-ad31-9727a08f8529', N'مسار رحلة ممتاز');
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-فيتنام-2026-13-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('eaff5c20-efab-41a1-9699-60c839e41ea8', N'pkg-فيتنام-2026-13-days', @Dest_6, N'بكج فيتنام 2026 الساحرة - عرض فيتنام  يوم  ليلة 13 أيام', N'Amazing فيتنام 13 Days Deal', N'استمتع بـ 12 ليالي من الرفاهية في فندق سيلك باث هانواي - هانوي وغيرها', 7700, N'ر.س', N'13 أيام / 12 ليالي', 13, 12, N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 1, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('46851681-8673-4320-9032-5c3741c81360', 'eaff5c20-efab-41a1-9699-60c839e41ea8', 1, N'اليوم 1', N'الاستقبال والترحيب في مطار هانوي الدولي، والانتقال السلس إلى الفندق لتسجيل الدخول وأخذ قسط من الراحة.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('74479f6c-7a2f-42e6-a7cc-07e789c32d85', 'eaff5c20-efab-41a1-9699-60c839e41ea8', 2, N'اليوم 2', N'يوم استكشافي رائع في ''نينه بينه''، يتضمن جولة بقوارب السامبان للإبحار وسط الجبال الصخرية وحقول الأرز الخضراء.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('b573d05d-2aca-4416-a654-c2ebf897b434', 'eaff5c20-efab-41a1-9699-60c839e41ea8', 3, N'اليوم 3', N'جولة سياحية للتعرف على أسرار العاصمة هانوي وزيارة أبرز معالمها التاريخية والسياحية.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('be2a1e23-6e87-40c8-94f0-62d2ffd015f3', 'eaff5c20-efab-41a1-9699-60c839e41ea8', 4, N'اليوم 4', N'التوجه لمطار هانوي للسفر داخلياً إلى مدينة دانانج الساحرة، حيث يتم استقبالكم هناك وتوصيلكم للفندق.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('a3edfddf-e75a-40c9-b922-b5619c42e8fd', 'eaff5c20-efab-41a1-9699-60c839e41ea8', 5, N'اليوم 5', N'يوم من الخيال في ''بانا هيلز'' يتضمن ركوب التلفريك، السير على الجسر الذهبي المذهل، والاستمتاع بألعاب فانتازيا بارك الكبرى.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('e494674c-5981-4592-a049-3da490d43a8b', 'eaff5c20-efab-41a1-9699-60c839e41ea8', 6, N'اليوم 6', N'رحلة تفاعلية ممتعة في قرية جوز الهند المائية ''كام ثانه''، لتجربة قوارب الخيزران الدائرية واصطياد السرطانات، وزيارة جبل ماربل.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('c7af907a-5e76-45e7-b974-e2ab4a9ca260', 'eaff5c20-efab-41a1-9699-60c839e41ea8', 7, N'اليوم 7', N'يوم حر ومخصص للاستمتاع بشواطئ دانانج الذهبية أو الاسترخاء في مرافق الفندق الرائعة.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('ea960cbe-b368-43cc-9bbf-3c85bd64e5f5', 'eaff5c20-efab-41a1-9699-60c839e41ea8', 8, N'اليوم 8', N'مغادرة دانانج والعودة جواً إلى هانوي، لتبدأ رحلة برية ممتعة نحو فندق الإقامة في خليج هالونج.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('4ac63b55-b0a4-41cd-bea0-6fe79fb309e7', 'eaff5c20-efab-41a1-9699-60c839e41ea8', 9, N'اليوم 9', N'يوم ساحر على متن رحلة بحرية فاخرة لاكتشاف جماليات وجزر وكهوف خليج هالونج الاستثنائي.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('fefd301f-d1b0-4d9b-a1b3-2b3eff83fe69', 'eaff5c20-efab-41a1-9699-60c839e41ea8', 10, N'اليوم 10', N'توديع خليج هالونج والعودة بكل أريحية بسيارة خاصة إلى الفندق في مدينة هانوي.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('92d1b132-a5c1-4b4d-9114-d3f7d975c2bf', 'eaff5c20-efab-41a1-9699-60c839e41ea8', 11, N'اليوم 11', N'يوم سياحي مخصص للتسوق بسيارة خاصة لزيارة أشهر وأفضل الأسواق والمولات في هانوي.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('16cf9ae9-51ab-489f-8bf4-d8637f2f4723', 'eaff5c20-efab-41a1-9699-60c839e41ea8', 12, N'اليوم 12', N'يوم حر للاستجمام أو استكشاف المزيد من معالم هانوي المحلية على طريقتك الخاصة.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('c9256442-ed5d-4fc7-8891-9e30ec47efe5', 'eaff5c20-efab-41a1-9699-60c839e41ea8', 13, N'اليوم 13', N'نهاية الرحلة، والتوديع من الفندق إلى مطار هانوي متمنين لكم رحلة عودة سعيدة وآمنة.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('f9ecf831-9916-4903-af1a-0db9b619ab7f', 'eaff5c20-efab-41a1-9699-60c839e41ea8', N'فندق سيلك باث هانواي - هانوي', N'هانوي', 4, 0, N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('a9f36d04-1122-4ab9-99d5-df922925a3ff', 'eaff5c20-efab-41a1-9699-60c839e41ea8', N'سيتادنس بيرل هوي ان - دانانج - دانانج', N'دانانج', 4, 0, N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', 2);

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('774e35be-5325-4de9-b90a-bc973b6342e9', 'eaff5c20-efab-41a1-9699-60c839e41ea8', N'فندق سوليل هالونج - خليج الهالونج', N'خليج الهالونج', 4, 0, N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', 3);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('71e7993c-98ca-4d88-8d4a-2272471c7a37', 'eaff5c20-efab-41a1-9699-60c839e41ea8', N'مسار رحلة ممتاز');
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-فيتنام-2026-14-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('09f33ca9-661a-4854-9395-4156ebb2ab41', N'pkg-فيتنام-2026-14-days', @Dest_6, N'بكج فيتنام 2026 الساحرة - عرض فيتنام  يوم  ليلة 14 أيام', N'Amazing فيتنام 14 Days Deal', N'استمتع بـ 13 ليالي من الرفاهية في فندق سيلك باث هانواي - هانوي وغيرها', 8900, N'ر.س', N'14 أيام / 13 ليالي', 14, 13, N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 1, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('270a5fe0-4b1d-45ed-a25f-efbd27c51fc2', '09f33ca9-661a-4854-9395-4156ebb2ab41', 1, N'اليوم 1', N'استقبال مميز في مطار هانوي الدولي والتوجه بالسيارة الخاصة إلى الفندق لترتيب الأمتعة والراحة.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('bc37ebf7-576d-4cb8-9f95-51e9d69ef70b', '09f33ca9-661a-4854-9395-4156ebb2ab41', 2, N'اليوم 2', N'جولة طبيعية لا تُنسى في منطقة ''نينه بينه''، والإبحار بالقوارب بين الجبال الصخرية وحقول الأرز والمرور بالكهوف الخلابة.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('89cb1bfa-9b8c-4217-848a-564735b0f754', '09f33ca9-661a-4854-9395-4156ebb2ab41', 3, N'اليوم 3', N'جولة استكشافية متكاملة لزيارة المعالم السياحية والتاريخية العريقة في مدينة هانوي.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('311b60be-351e-421a-9003-c4cec76aacd1', '09f33ca9-661a-4854-9395-4156ebb2ab41', 4, N'اليوم 4', N'مغادرة هانوي في رحلة ممتعة ومريحة عبر باص النوم الفاخر متوجهين إلى طبيعة سابا الجبلية الساحرة.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('ff8f8229-93d8-4f87-ba3e-b5f21604c6af', '09f33ca9-661a-4854-9395-4156ebb2ab41', 5, N'اليوم 5', N'يوم سياحي في سابا للتعرف على قرية ''كات كات'' وتراث قبائل الهومونج، والقيام برحلة بانورامية عبر التلفريك للوصول إلى القمة المرتفعة.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('22dc1c68-4a80-42e6-abcc-3ae3b065248d', '09f33ca9-661a-4854-9395-4156ebb2ab41', 6, N'اليوم 6', N'النزول بالسيارة من سابا إلى مطار هانوي، ثم الطيران الداخلي إلى مدينة دانانج الساحلية ليكون المندوب في استقبالكم وتوصيلكم للفندق.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('809a96b5-4027-451c-b374-b251a2151b8c', '09f33ca9-661a-4854-9395-4156ebb2ab41', 7, N'اليوم 7', N'مغامرة استثنائية في ''بانا هيلز'' وتجربة التلفريك المذهل، التقاط الصور على الجسر الذهبي، وقضاء وقت ممتع في ملاهي فانتازيا بارك.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('6978d645-0153-4064-9404-33064f812249', '09f33ca9-661a-4854-9395-4156ebb2ab41', 8, N'اليوم 8', N'جولة تراثية في قرية جوز الهند ''كام ثانه''، وتجربة التجديف بقوارب السلة الدائرية الممتعة، تليها زيارة جبل ماربل الشهير.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('9cbb5d29-4097-48ba-aabd-b25cba6cd65b', '09f33ca9-661a-4854-9395-4156ebb2ab41', 9, N'اليوم 9', N'يوم حر ومخصص للاسترخاء التام على شواطئ دانانج أو الاستمتاع بمرافق الفندق الفاخرة.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('4284777d-9f20-48bf-84b2-0b1c87cece4a', '09f33ca9-661a-4854-9395-4156ebb2ab41', 10, N'اليوم 10', N'توديع دانانج والعودة بالطيران إلى هانوي، ومنها الانتقال البري المباشر إلى خليج هالونج لتسجيل الدخول في الفندق.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('6d045ccd-3f12-40d9-a02e-f1bfc2603974', '09f33ca9-661a-4854-9395-4156ebb2ab41', 11, N'اليوم 11', N'الاستمتاع بيوم هادئ وجميل في رحلة بحرية فاخرة وسط طبيعة خليج هالونج ومياهه الفيروزية.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('7de7f2b1-ff75-4532-a90a-b6788a8f02c8', '09f33ca9-661a-4854-9395-4156ebb2ab41', 12, N'اليوم 12', N'العودة المريحة بالسيارة الخاصة من خليج هالونج إلى العاصمة هانوي لقضاء الأيام الأخيرة من الرحلة.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('594281fe-d587-443e-9af5-dada87acc908', '09f33ca9-661a-4854-9395-4156ebb2ab41', 13, N'اليوم 13', N'يوم حر في مدينة هانوي لتسوق الهدايا التذكارية وتجربة المطاعم الفيتنامية الشهيرة بحرية تامة.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('004ce88a-a898-4be6-b57c-aa4bf866877b', '09f33ca9-661a-4854-9395-4156ebb2ab41', 14, N'اليوم 14', N'ختام عطلتكم السعيدة في فيتنام، والتوصيل من الفندق إلى مطار هانوي الدولي للعودة إلى الديار بسلامة الله.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('70a9e987-e41b-48f4-9f08-d8fd4b7e55c8', '09f33ca9-661a-4854-9395-4156ebb2ab41', N'فندق سيلك باث هانواي - هانوي', N'هانوي', 4, 0, N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('f5bcb418-3380-462d-9a48-00ac874bdf9a', '09f33ca9-661a-4854-9395-4156ebb2ab41', N'فندق باو سابا - مرتفعات سابا', N'مرتفعات سابا', 4, 0, N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', 2);

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('3cb34b0f-fa46-4835-99bb-d77406785e6b', '09f33ca9-661a-4854-9395-4156ebb2ab41', N'سيتادنس بيرل هوي ان - دانانج - دانانج', N'دانانج', 4, 0, N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', 3);

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('e2599564-1b68-408f-889a-2f15636a9382', '09f33ca9-661a-4854-9395-4156ebb2ab41', N'فندق سوليل هالونج - خليج الهالونج', N'خليج الهالونج', 4, 0, N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', 4);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('5b57f129-5c46-403d-80f7-2391af2547ef', '09f33ca9-661a-4854-9395-4156ebb2ab41', N'مسار رحلة ممتاز');
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-فيتنام-2026-7-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('7ca6c167-e843-4179-b33e-4bd0277f6137', N'pkg-فيتنام-2026-7-days', @Dest_6, N'بكج فيتنام 2026 الساحرة - عرض فيتنام  ايام   ليالي 7 أيام', N'Amazing فيتنام 7 Days Deal', N'استمتع بـ 6 ليالي من الرفاهية في فندق سيلك باث هانواي - هانوي وغيرها', 3400, N'ر.س', N'7 أيام / 6 ليالي', 7, 6, N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 1, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('c1e5c196-cef0-4ac2-b4f8-c84db848d9aa', '7ca6c167-e843-4179-b33e-4bd0277f6137', 1, N'اليوم 1', N'الاستقبال والترحيب في مطار هانوي الدولي والتوصيل المباشر والمريح بسيارة خاصة إلى الفندق لتسجيل الدخول وأخذ قسط من الراحة لبدء عطلتكم الساحرة.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('1d662974-121a-4ee4-a921-8d9b842a5b42', '7ca6c167-e843-4179-b33e-4bd0277f6137', 2, N'اليوم 2', N'يوم سياحي ممتع لاستكشاف ''نينه بينه'' الهادئة والساحرة، تشمل جولة بقوارب السامبان في رصيف تام كوك الشهير للإبحار عبر القرى، حقول الأرز الخضراء، والجبال الصخرية المهيبة، مع المرور بثلاثة كهوف وسط طبيعة خلابة.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('d7bc4d9d-49a9-4633-90f4-117d807ceacf', '7ca6c167-e843-4179-b33e-4bd0277f6137', 3, N'اليوم 3', N'تسجيل الخروج والانتقال المريح بسيارة خاصة من الفندق في هانوي إلى فندق الإقامة الجديد في خليج هالونج الساحر.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('df570b9a-f953-43fb-85be-71e7c98e48e4', '7ca6c167-e843-4179-b33e-4bd0277f6137', 4, N'اليوم 4', N'الاستمتاع برحلة بحرية فاخرة واستثنائية لاستكشاف عجائب وجمال خليج هالونج ذي الطبيعة الآسرة.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('78d07877-cfaf-4698-b555-795be5e7a462', '7ca6c167-e843-4179-b33e-4bd0277f6137', 5, N'اليوم 5', N'العودة بالسيارة الخاصة من خليج هالونج إلى العاصمة هانوي لتسجيل الدخول في الفندق والاسترخاء.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('099617fd-8905-46ee-88a8-540d7b253ea8', '7ca6c167-e843-4179-b33e-4bd0277f6137', 6, N'اليوم 6', N'يوم حر مخصص لك بالكامل لاستكشاف مدينة هانوي النابضة بالحياة، والتجول في أسواقها والاستمتاع بأجوائها على طريقتك الخاصة (بدون سائق).', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('35d1cfc9-21d0-477e-95a5-bf0db003a7d5', '7ca6c167-e843-4179-b33e-4bd0277f6137', 7, N'اليوم 7', N'ختام الرحلة السعيدة وتوديع فيتنام، حيث سيتم توصيلكم من الفندق إلى مطار هانوي الدولي للعودة بسلامة الله.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('aa123359-ca87-4596-9409-276a56c2816d', '7ca6c167-e843-4179-b33e-4bd0277f6137', N'فندق سيلك باث هانواي - هانوي', N'هانوي', 4, 0, N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('fc60bac8-7e21-44ff-b61b-47a090d33a42', '7ca6c167-e843-4179-b33e-4bd0277f6137', N'فندق سوليل هالونج - خليج الهالونج', N'خليج الهالونج', 4, 0, N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', 2);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('840330af-c561-46ba-aaf9-2d10993d0077', '7ca6c167-e843-4179-b33e-4bd0277f6137', N'مسار رحلة ممتاز');
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-فيتنام-2026-8-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('c7974c0f-cfa4-4ae0-a0c3-4c3094cdf571', N'pkg-فيتنام-2026-8-days', @Dest_6, N'بكج فيتنام 2026 الساحرة - عرض فيتنام  ايام   ليالي 8 أيام', N'Amazing فيتنام 8 Days Deal', N'استمتع بـ 7 ليالي من الرفاهية في فندق سيلك باث هانواي - هانوي وغيرها', 4000, N'ر.س', N'8 أيام / 7 ليالي', 8, 7, N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 1, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('8fe2dc9b-411f-4561-b196-ae50ee14d1ff', 'c7974c0f-cfa4-4ae0-a0c3-4c3094cdf571', 1, N'اليوم 1', N'الاستقبال والترحيب في مطار هانوي الدولي، والانتقال المريح بسيارة خاصة إلى الفندق لتسجيل الدخول والراحة.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('ba6c81dd-5694-4754-9cb9-e339dcdbae49', 'c7974c0f-cfa4-4ae0-a0c3-4c3094cdf571', 2, N'اليوم 2', N'يوم سياحي مذهل لزيارة ''نينه بينه'' ذات الطبيعة الساحرة، يتخلله ركوب قوارب السامبان في رصيف تام كوك، للإبحار وسط الجبال وحقول الأرز والمرور بثلاثة كهوف رائعة.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('2cb969ef-66a6-4535-8340-53808963a076', 'c7974c0f-cfa4-4ae0-a0c3-4c3094cdf571', 3, N'اليوم 3', N'جولة سياحية ممتعة لمدة 8 ساعات لاستكشاف أهم المعالم السياحية والتاريخية البارزة في مدينة هانوي.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('7e685ee2-7cdc-4ea6-a864-112c0e9bb310', 'c7974c0f-cfa4-4ae0-a0c3-4c3094cdf571', 4, N'اليوم 4', N'مغادرة هانوي والانتقال المريح بسيارة خاصة إلى فندق الإقامة في خليج هالونج الخلاب.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('76c4baa3-159c-46a4-9b01-5d7a13ebf64c', 'c7974c0f-cfa4-4ae0-a0c3-4c3094cdf571', 5, N'اليوم 5', N'قضاء يوم لا يُنسى في رحلة بحرية فاخرة لاستكشاف سحر وجمال خليج هالونج المذهل.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('0a6e97c3-b3c7-4849-9f29-206380660f73', 'c7974c0f-cfa4-4ae0-a0c3-4c3094cdf571', 6, N'اليوم 6', N'تسجيل الخروج والانتقال بسيارة خاصة من خليج هالونج للعودة إلى مدينة هانوي.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('ad65a297-6c1c-4aff-b73e-d28f1b72300d', 'c7974c0f-cfa4-4ae0-a0c3-4c3094cdf571', 7, N'اليوم 7', N'يوم حر بالكامل للاستجمام أو الانطلاق في جولة تسوق حرة لاستكشاف شوارع هانوي وأسواقها المحلية الممتعة.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('fd2d33e8-1d21-4e00-af2e-20f2cdbe1807', 'c7974c0f-cfa4-4ae0-a0c3-4c3094cdf571', 8, N'اليوم 8', N'نهاية العطلة والتوديع من الفندق والانتقال إلى مطار هانوي الدولي متمنين لكم رحلة عودة آمنة.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('c17ce159-f0c6-49fa-98cc-15fab0fbbc3b', 'c7974c0f-cfa4-4ae0-a0c3-4c3094cdf571', N'فندق سيلك باث هانواي - هانوي', N'هانوي', 4, 0, N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('348cf5da-75ac-4d22-84a0-f532d4bd2dc3', 'c7974c0f-cfa4-4ae0-a0c3-4c3094cdf571', N'فندق سوليل هالونج - خليج الهالونج', N'خليج الهالونج', 4, 0, N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', 2);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('18619f91-560d-4b71-b1ce-ea25cb3a0e27', 'c7974c0f-cfa4-4ae0-a0c3-4c3094cdf571', N'مسار رحلة ممتاز');
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-فيتنام-2026-9-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('4da733e6-d07d-4c46-9939-e6cc6c7f0286', N'pkg-فيتنام-2026-9-days', @Dest_6, N'بكج فيتنام 2026 الساحرة - عرض فيتنام  ايام   ليالي 9 أيام', N'Amazing فيتنام 9 Days Deal', N'استمتع بـ 8 ليالي من الرفاهية في فندق سيلك باث هانواي - هانوي وغيرها', 5200, N'ر.س', N'9 أيام / 8 ليالي', 9, 8, N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 1, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('3c15d0a2-65d9-4c94-b1a0-800075f7a204', '4da733e6-d07d-4c46-9939-e6cc6c7f0286', 1, N'اليوم 1', N'استقبال مميز في مطار هانوي الدولي، والتوصيل المباشر بسيارة خاصة إلى الفندق للاستراحة من عناء السفر.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('a4f71dc3-a019-418c-a126-828bcf439ff2', '4da733e6-d07d-4c46-9939-e6cc6c7f0286', 2, N'اليوم 2', N'رحلة استكشافية إلى ''نينه بينه'' للاستمتاع بالطبيعة العذراء، وركوب قوارب السامبان في تام كوك للإبحار عبر الكهوف والجبال وحقول الأرز الخضراء.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('0d550642-775d-4dbd-a19a-20771d777937', '4da733e6-d07d-4c46-9939-e6cc6c7f0286', 3, N'اليوم 3', N'الانطلاق في رحلة برية إلى خليج هالونج الساحر للاستمتاع برحلة بحرية مدهشة واستكشاف جمال الخليج، ثم العودة إلى هانوي.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('c5807a6e-adbc-4fb5-8553-3814de56fb47', '4da733e6-d07d-4c46-9939-e6cc6c7f0286', 4, N'اليوم 4', N'تجربة فريدة للانتقال من هانوي إلى مرتفعات سابا الساحرة عبر باص النوم المريح والمجهز.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('f4e7cb10-f9f9-41c4-9f67-69759688cd9c', '4da733e6-d07d-4c46-9939-e6cc6c7f0286', 5, N'اليوم 5', N'جولة سياحية في سابا لزيارة قرية ''كات كات'' الرائعة والتعرف على ثقافة قبائل الهومونج بين حقول الأرز، تليها تجربة ركوب التلفريك الأجمل في العالم للصعود فوق السحاب والتقاط أروع الصور.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('9f87d611-4b6a-4507-943a-779cab510441', '4da733e6-d07d-4c46-9939-e6cc6c7f0286', 6, N'اليوم 6', N'يوم مليء بالجمال في سابا لزيارة الشلالات الطبيعية، الجسر الزجاجي المثير، ومنطقة ''موانا سابا'' المثالية لالتقاط أجمل الصور التذكارية.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('29544875-7d67-422d-a2fd-a04de170be15', '4da733e6-d07d-4c46-9939-e6cc6c7f0286', 7, N'اليوم 7', N'توديع مرتفعات سابا والعودة إلى مدينة هانوي عبر باص النوم المريح لتسجيل الدخول في الفندق.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('85cf08e6-0535-452c-8bb1-2026a1b5f963', '4da733e6-d07d-4c46-9939-e6cc6c7f0286', 8, N'اليوم 8', N'يوم حر مخصص لكم للاستمتاع بأجواء هانوي، التسوق وشراء الهدايا، أو تجربة المقاهي المحلية الرائعة.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('97218c89-cecf-4b23-ba1f-d13bfb2e5e9a', '4da733e6-d07d-4c46-9939-e6cc6c7f0286', 9, N'اليوم 9', N'ختام الرحلة الجميلة، والتوصيل من الفندق إلى مطار هانوي للعودة إلى أرض الوطن بسلامة الله.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('0c964735-74d6-44e5-aede-2351b4dab88f', '4da733e6-d07d-4c46-9939-e6cc6c7f0286', N'فندق سيلك باث هانواي - هانوي', N'هانوي', 4, 0, N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('5e806bcf-f14d-455d-b899-b6af9a411972', '4da733e6-d07d-4c46-9939-e6cc6c7f0286', N'فندق باو سابا - مرتفعات سابا', N'مرتفعات سابا', 4, 0, N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', 2);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('f4b74a80-560c-4081-b5a4-d335d717895c', '4da733e6-d07d-4c46-9939-e6cc6c7f0286', N'مسار رحلة ممتاز');
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-فيتنام-2026-5-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('0eea5b65-f9d0-4c72-a715-92a4252c5821', N'pkg-فيتنام-2026-5-days', @Dest_6, N'بكج فيتنام 2026 الساحرة - عروض فيتام بالريال السعودي 5 أيام', N'Amazing فيتنام 2026 5 Days Package', N'استمتع بـ 4 ليالي من الرفاهية في أفضل فنادق فيتنام 2026', 3750, N'ر.س', N'5 أيام / 4 ليالي', 5, 4, N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 1, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('82d54e94-bf99-496f-bebe-9afee4e252f5', '0eea5b65-f9d0-4c72-a715-92a4252c5821', 1, N'اليوم 1', N'وصف تفصيلي لجولات اليوم رقم 1 في فيتنام 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('29b9618c-a5af-4294-b629-4ba3d7b0d07b', '0eea5b65-f9d0-4c72-a715-92a4252c5821', 2, N'اليوم 2', N'وصف تفصيلي لجولات اليوم رقم 2 في فيتنام 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('5e01023c-2a0a-4784-a13f-0a993139cdd1', '0eea5b65-f9d0-4c72-a715-92a4252c5821', 3, N'اليوم 3', N'وصف تفصيلي لجولات اليوم رقم 3 في فيتنام 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('1a2b0d77-fce0-4d5b-b684-b926f3049b4b', '0eea5b65-f9d0-4c72-a715-92a4252c5821', 4, N'اليوم 4', N'وصف تفصيلي لجولات اليوم رقم 4 في فيتنام 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('6955383b-aa13-47ef-bd47-ca7519b088bd', '0eea5b65-f9d0-4c72-a715-92a4252c5821', 5, N'اليوم 5', N'وصف تفصيلي لجولات اليوم رقم 5 في فيتنام 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('aec78d7e-3009-4b6a-976a-dcdf89a3be31', '0eea5b65-f9d0-4c72-a715-92a4252c5821', N'فندق الملحم الفاخر - فيتنام 2026', N'فيتنام 2026', 5, 0, N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('f5c624de-08d2-49c9-92ca-557bafb46bc4', '0eea5b65-f9d0-4c72-a715-92a4252c5821', N'مسار رحلة ممتاز');
END

DECLARE @Dest_7 UNIQUEIDENTIFIER;
SELECT @Dest_7 = Id FROM Destinations WHERE NameAr = N'ماليزيا 2026 FLY 29';
IF @Dest_7 IS NULL
BEGIN
    SET @Dest_7 = NEWID();
    INSERT INTO Destinations (Id, NameAr, NameEn, Slug, Country, ImageUrl, Description, IsActive, SortOrder)
    VALUES (@Dest_7, N'ماليزيا 2026 FLY 29', N'Destination En', N'ماليزيا-2026-fly-29', N'ماليزيا 2026 FLY 29', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'اكتشف جمال وعراقة ماليزيا 2026 FLY 29 مع برامج الملحم السياحية الفاخرة المميزة.', 1, 100);
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-ماليزيا-2026-fly-29-10-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('2c32d0a2-ba2b-4f17-8498-1b20747b723f', N'pkg-ماليزيا-2026-fly-29-10-days', @Dest_7, N'بكج ماليزيا 2026 FLY 29 الساحرة - عرض  ايام   ليالي 10 أيام', N'Amazing ماليزيا 10 Days Deal', N'استمتع بـ 9 ليالي من الرفاهية في صانوي لاجون - سلانجور وغيرها', 6700, N'ر.س', N'10 أيام / 9 ليالي', 10, 9, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 1, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('b1dbeec4-03ef-400b-b16c-a45a5e81746a', '2c32d0a2-ba2b-4f17-8498-1b20747b723f', 1, N'اليوم 1', N'الترحيب الحار في مطار كوالالمبور والانتقال المباشر إلى سيلانجور لتسجيل الدخول في الفندق والاستراحة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('5f55edfd-ef19-4731-8ae7-df595efc559e', '2c32d0a2-ba2b-4f17-8498-1b20747b723f', 2, N'اليوم 2', N'يوم ترفيهي متكامل في ملاهي صنواي لاجون المائية، للاستمتاع بأروع الألعاب المائية والأنشطة المشوقة لجميع أفراد العائلة (بدون سائق).', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('43e02a7a-eb06-4c71-ab13-9b04f8cbca91', '2c32d0a2-ba2b-4f17-8498-1b20747b723f', 3, N'اليوم 3', N'الانتقال إلى المطار للسفر جواً إلى جزيرة لنكاوي الساحرة، حيث يتم الاستقبال والتوصيل إلى فندقكم ذي الإطلالات الطبيعية.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('5ee812b6-f7a2-4712-9e58-ba1cefea733a', '2c32d0a2-ba2b-4f17-8498-1b20747b723f', 4, N'اليوم 4', N'جولة استكشافية لأهم معالم لنكاوي، تتضمن ركوب التلفريك والجسر المعلق، وزيارة شلالات لنكاوي وميدان النسر الشهير، بالإضافة إلى حديقة التماسيح.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('8b0fe51f-e54e-42c8-b548-424e03363194', '2c32d0a2-ba2b-4f17-8498-1b20747b723f', 5, N'اليوم 5', N'رحلة غابات المانجروف المذهلة (لمدة 3-4 ساعات) بالقارب، للاستمتاع بمشاهدة إطعام النسور، زيارة كهف الخفافيش، وتأمل الطبيعة البكر.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('2b9964ff-6221-4266-b42f-6e125dfa36a5', '2c32d0a2-ba2b-4f17-8498-1b20747b723f', 6, N'اليوم 6', N'توديع جزيرة لنكاوي والعودة بالطيران إلى العاصمة كوالالمبور، ثم الانتقال المريح إلى الفندق الجديد لتسجيل الدخول.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('ee8d9685-a930-4606-979d-2cba7202a172', '2c32d0a2-ba2b-4f17-8498-1b20747b723f', 7, N'اليوم 7', N'رحلة برية ممتعة إلى مرتفعات جنتنج الباردة، تشمل ركوب التلفريك وزيارة المعبد الصيني والاستمتاع بالمرافق الترفيهية، ثم العودة للفندق.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('5282d7cc-bfba-479f-bde2-fd932da46e02', '2c32d0a2-ba2b-4f17-8498-1b20747b723f', 8, N'اليوم 8', N'جولة سياحية شاملة في كوالالمبور لزيارة البرجين التوأم، حديقة الحيوانات، أكواريوم عالم البحار، ومنارة كوالالمبور.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('c3ee2130-ef11-478c-b4c4-942a468164de', '2c32d0a2-ba2b-4f17-8498-1b20747b723f', 9, N'اليوم 9', N'يوم حر في العاصمة الماليزية للاسترخاء التام أو التسوق في أرقى المولات واختيار الهدايا التذكارية.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('bf42ea7a-8fce-46c9-991f-e0125a084028', '2c32d0a2-ba2b-4f17-8498-1b20747b723f', 10, N'اليوم 10', N'نهاية الرحلة والتوصيل من الفندق إلى مطار كوالالمبور الدولي متمنين لكم رحلة عودة آمنة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('3d3b4470-ff7d-4d6e-a097-f8142dffc5da', '2c32d0a2-ba2b-4f17-8498-1b20747b723f', N'صانوي لاجون - سلانجور', N'سلانجور', 4, 0, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('7b6e2580-a23e-42a7-b479-1119bb5234cc', '2c32d0a2-ba2b-4f17-8498-1b20747b723f', N'ذا باي فيو لنكاوي هوتيل - جزيرة لانكاوي', N'جزيرة لانكاوي', 4, 0, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', 2);

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('43aee450-517f-4759-b49a-cf5775e872c6', '2c32d0a2-ba2b-4f17-8498-1b20747b723f', N'فندق أوكوود كوالالمبور - كوالالمبور', N'كوالالمبور', 4, 0, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', 3);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('0f9f4906-dbb7-41ea-9869-91716fbb3cee', '2c32d0a2-ba2b-4f17-8498-1b20747b723f', N'مسار رحلة ممتاز');
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-ماليزيا-2026-fly-29-11-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('d0ce03bb-61c6-41b8-94b1-a313393039f4', N'pkg-ماليزيا-2026-fly-29-11-days', @Dest_7, N'بكج ماليزيا 2026 FLY 29 الساحرة - عرض  يوم   ليالي 11 أيام', N'Amazing ماليزيا 11 Days Deal', N'استمتع بـ 10 ليالي من الرفاهية في صانوي لاجون - سلانجور وغيرها', 7100, N'ر.س', N'11 أيام / 10 ليالي', 11, 10, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 1, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('d7639e32-cdfc-43cb-a289-cb38bc523f8b', 'd0ce03bb-61c6-41b8-94b1-a313393039f4', 1, N'اليوم 1', N'الاستقبال في مطار كوالالمبور الدولي بكل ود والانتقال السلس إلى سيلانجور لبدء إجازتكم السعيدة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('cdcb35c7-f1d2-487d-9803-2972d7cdb417', 'd0ce03bb-61c6-41b8-94b1-a313393039f4', 2, N'اليوم 2', N'الانطلاق لقضاء يوم مليء بالإثارة في صنواي لاجون، أكبر مدن الألعاب المائية، للاستمتاع بالمسابح والأنشطة المتنوعة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('5a3da1a4-e7e7-4853-8332-6e0f4d0a430d', 'd0ce03bb-61c6-41b8-94b1-a313393039f4', 3, N'اليوم 3', N'مغادرة سيلانجور والتوجه جواً إلى جزيرة لنكاوي الهادئة، ليتم الاستقبال والتوصيل المباشر إلى الفندق.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('a79aa678-ba65-4dff-8edf-8081f15ac970', 'd0ce03bb-61c6-41b8-94b1-a313393039f4', 4, N'اليوم 4', N'جولة استكشافية مذهلة في لنكاوي لركوب التلفريك المرتفع، وزيارة الجسر المعلق، وميدان النسر، والتنزه عند شلالات لنكاوي الساحرة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('60235823-028f-42c2-92db-37ec981cc837', 'd0ce03bb-61c6-41b8-94b1-a313393039f4', 5, N'اليوم 5', N'رحلة نهرية في غابات المانجروف الفريدة، تشمل متعة مشاهدة إطعام النسور عن قرب واستكشاف الكهوف الطبيعية المتنوعة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('5288562e-930b-4252-ac0d-78d35afd73a3', 'd0ce03bb-61c6-41b8-94b1-a313393039f4', 6, N'اليوم 6', N'يوم حر للاسترخاء على شواطئ لنكاوي الجميلة، أو للاستمتاع بمرافق الفندق ذو الإطلالة الساحرة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('56be6a8d-c1d6-4e96-8329-1663448a5fb6', 'd0ce03bb-61c6-41b8-94b1-a313393039f4', 7, N'اليوم 7', N'توديع لنكاوي والسفر جواً للعودة إلى العاصمة كوالالمبور، ومنها الانتقال إلى الفندق لتسجيل الدخول.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('3de0e7c3-235f-4dd7-b8ff-f1e8ad491d0c', 'd0ce03bb-61c6-41b8-94b1-a313393039f4', 8, N'اليوم 8', N'يوم استثنائي في مرتفعات جنتنج ذات الطقس البارد، مع تجربة ركوب التلفريك البانورامي وزيارة معبد تشين سوي والاستمتاع بالترفيه.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('710e6160-e410-423d-aef0-34fee3ca6e65', 'd0ce03bb-61c6-41b8-94b1-a313393039f4', 9, N'اليوم 9', N'جولة كوالالمبور الثقافية والترفيهية لزيارة البرجين التوأم، الأكواريوم، حديقة الحيوانات، ومعالم المدينة البارزة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('d6164064-8550-4058-b3ac-e72188c1fa65', 'd0ce03bb-61c6-41b8-94b1-a313393039f4', 10, N'اليوم 10', N'يوم حر للاستجمام أو الانطلاق في جولة تسوق خاصة لشراء الهدايا من أسواق ومولات كوالالمبور العصرية.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('321802b0-4775-4c0a-86b3-fbd4ec348e7c', 'd0ce03bb-61c6-41b8-94b1-a313393039f4', 11, N'اليوم 11', N'ختام العطلة الجميلة، والتوصيل من الفندق إلى مطار كوالالمبور الدولي للعودة إلى أرض الوطن.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('393cfc25-7847-4df8-993e-74f756b0d62f', 'd0ce03bb-61c6-41b8-94b1-a313393039f4', N'صانوي لاجون - سلانجور', N'سلانجور', 4, 0, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('778163f1-2640-4c4f-9b73-ff0c07e4e270', 'd0ce03bb-61c6-41b8-94b1-a313393039f4', N'ذا باي فيو لنكاوي هوتيل - جزيرة لانكاوي', N'جزيرة لانكاوي', 4, 0, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', 2);

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('1db2b9a9-4902-4e8b-9ab7-8680ae0e3e51', 'd0ce03bb-61c6-41b8-94b1-a313393039f4', N'فندق أوكوود كوالالمبور - كوالالمبور', N'كوالالمبور', 4, 0, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', 3);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('c9e8c799-23df-4d8f-b397-fce8d9d59ecd', 'd0ce03bb-61c6-41b8-94b1-a313393039f4', N'مسار رحلة ممتاز');
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-ماليزيا-2026-fly-29-12-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('4da4b4a7-c952-489c-b28a-7ac961e7d5b9', N'pkg-ماليزيا-2026-fly-29-12-days', @Dest_7, N'بكج ماليزيا 2026 FLY 29 الساحرة - عرض  يوم   ليليه 12 أيام', N'Amazing ماليزيا  12 Days Deal', N'استمتع بـ 11 ليالي من الرفاهية في صانوي لاجون - سلانجور  وغيرها', 6900, N'ر.س', N'12 أيام / 11 ليالي', 12, 11, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 1, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('455cf181-c37e-4928-a116-58ec8e254ee7', '4da4b4a7-c952-489c-b28a-7ac961e7d5b9', 1, N'اليوم 1', N'استقبال دولي في مطار كوالالمبور والتوصيل إلى الفندق في سيلانجور للراحة والاستعداد لبدء الرحلة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('aef7b0b7-07c7-4228-9143-502490718cbf', '4da4b4a7-c952-489c-b28a-7ac961e7d5b9', 2, N'اليوم 2', N'جولة ممتعة في مدينة الألعاب المائية صنواي لاجون، أكبر ملاهي مائية في شرق آسيا، للاستمتاع بالألعاب المائية والكهربائية، المسابح، حديقة الحيوانات، السواحل الصناعية، وبيت الرعب، في يوم كامل مليء بالمرح (بدون سائق حيث تقع الحديقة بجوار الفندق مباشرة).', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('11b62ef4-7507-4297-9fd1-790c4112b637', '4da4b4a7-c952-489c-b28a-7ac961e7d5b9', 3, N'اليوم 3', N'توديع سيلانجور والتوصيل إلى المطار للمغادرة إلى جزيرة لنكاوي، حيث يتم الاستقبال في مطار جزيرة لنكاوي والتوصيل إلى الفندق المخصص.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('aab739ae-ba34-4317-81de-3734154e6bdf', '4da4b4a7-c952-489c-b28a-7ac961e7d5b9', 4, N'اليوم 4', N'جولة لمدة 8 ساعات بسيارة خاصة لاستكشاف أهم معالم لنكاوي، تشمل تجربة تلفريك لنكاوي للاستمتاع بمنظر الجزيرة، زيارة الجسر المعلق، شلالات لنكاوي، التقاط الصور في ميدان النسر الشهير، وزيارة حديقة التماسيح.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('b1f72be0-aa80-4198-bf88-2135c28d6b33', '4da4b4a7-c952-489c-b28a-7ac961e7d5b9', 5, N'اليوم 5', N'رحلة المانجروف الرائعة في لنكاوي (تستغرق من 3 إلى 4 ساعات) للتمتع بالمناظر الطبيعية الخلابة، والتي تتضمن إطعام النسور وزيارة الكهف.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('db7bb773-0e54-4ba0-9eb2-d1d3efe9668d', '4da4b4a7-c952-489c-b28a-7ac961e7d5b9', 6, N'اليوم 6', N'توديع لنكاوي والتوصيل للمطار للانتقال إلى جزيرة بينانج، حيث يتم الاستقبال في مطار بينانج والتوصيل إلى الفندق للراحة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('674fd0ed-2cd3-4312-8513-7df8223b3300', '4da4b4a7-c952-489c-b28a-7ac961e7d5b9', 7, N'اليوم 7', N'جولة سياحية بسيارة خاصة لمدة 8 ساعات في بينانج، تشمل صعود هضبة بينانج بقطار جبلي، زيارة حديقة الفواكه، حديقة الزهور التي تضم أندر الورود، الحدائق الاستوائية، حديقة الفراشات، شلالات بينانج، ومصنع الشوكولاتة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('7f37caf2-23aa-4136-bfa6-bcb30bbd1238', '4da4b4a7-c952-489c-b28a-7ac961e7d5b9', 8, N'اليوم 8', N'يوم حر مخصص للراحة والاستجمام داخل الفندق والاستمتاع بمرافقه.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('bf163986-d788-4b8e-9128-4f3cbcba6d6c', '4da4b4a7-c952-489c-b28a-7ac961e7d5b9', 9, N'اليوم 9', N'توديع جزيرة بينانج والتوصيل للمطار للتوجه إلى العاصمة كوالالمبور، ثم الاستقبال في مطار كوالالمبور الدولي والتوصيل إلى الفندق.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('bd103b10-ecc1-411b-858d-7e7108624da5', '4da4b4a7-c952-489c-b28a-7ac961e7d5b9', 10, N'اليوم 10', N'جولة إلى مرتفعات جنتنج الباردة عبر رحلة بتلفريك أوانا سكايواي الساحر فوق السحاب والغابات، للاستمتاع بمراكز الترفيه، السنوكر، البولينج، الرماية، وتسلق الجدار، مع زيارة معبد تشين سوي الصيني العريق.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('92b5856d-e99a-494a-a256-b1cfb04c45f3', '4da4b4a7-c952-489c-b28a-7ac961e7d5b9', 11, N'اليوم 11', N'يوم حر في كوالالمبور للاستجمام في الفندق واستكشاف الأماكن القريبة سيراً على الأقدام بحرية تامة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('35979d4f-cd6d-47f2-a976-a865a05e2eda', '4da4b4a7-c952-489c-b28a-7ac961e7d5b9', 12, N'اليوم 12', N'ختام الرحلة بتوديع كوالالمبور والتوصيل من الفندق إلى المطار للعودة إلى أرض الوطن بسلامة الله.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('acc6f219-4758-49bf-870c-91c822a1806c', '4da4b4a7-c952-489c-b28a-7ac961e7d5b9', N'صانوي لاجون - سلانجور ', N'سلانجور', 4, 0, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('3a185126-19ca-40ff-ba0e-a49505c2fc82', '4da4b4a7-c952-489c-b28a-7ac961e7d5b9', N'ذا باي فيو لنكاوي هوتيل - جزيرة لانكاوي ', N'جزيرة لانكاوي', 4, 0, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', 2);

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('d601b6a9-e99d-492a-a2ff-3a4212f61375', '4da4b4a7-c952-489c-b28a-7ac961e7d5b9', N'همبتون بينانغ هوتيل - جزيرة بينانغ ', N'جزيرة بينانغ', 4, 0, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', 3);

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('0956bbba-fc87-4289-a4ca-ae1267d32b12', '4da4b4a7-c952-489c-b28a-7ac961e7d5b9', N'فندق أوكوود كوالالمبور - كوالالمبور ', N'كوالالمبور', 4, 0, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', 4);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('bbc53b0a-0360-41c7-b3cd-f56c484f38f5', '4da4b4a7-c952-489c-b28a-7ac961e7d5b9', N'مسار رحلة ممتاز');
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-ماليزيا-2026-fly-29-13-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('a5082720-1ce4-4517-8885-554e35789fe9', N'pkg-ماليزيا-2026-fly-29-13-days', @Dest_7, N'بكج ماليزيا 2026 FLY 29 الساحرة - عرض  يوم   ليله 13 أيام', N'Amazing ماليزيا 13 Days Deal', N'استمتع بـ 12 ليالي من الرفاهية في صانوي لاجون - سلانجور وغيرها', 8800, N'ر.س', N'13 أيام / 12 ليالي', 13, 12, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 1, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('6ca5d679-e20d-4ff7-83e9-010ef8d602cb', 'a5082720-1ce4-4517-8885-554e35789fe9', 1, N'اليوم 1', N'الاستقبال في مطار كوالالمبور الدولي والانتقال بكل راحة إلى فندقكم في سيلانجور لبدء الإجازة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('f0872ee7-2361-4634-bc22-e6274b29f75b', 'a5082720-1ce4-4517-8885-554e35789fe9', 2, N'اليوم 2', N'يوم مليء بالحيوية والمرح في ملاهي صنواي لاجون المائية الكبرى للاستمتاع بجميع مرافقها (بدون سائق).', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('2096e1e6-5403-40f4-aca2-03ca2678c4e8', 'a5082720-1ce4-4517-8885-554e35789fe9', 3, N'اليوم 3', N'توديع سيلانجور والسفر جواً إلى جزيرة لنكاوي، حيث يتلقاكم المندوب للتوجه إلى فندق الإقامة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('a9724b6a-fbc0-4bd1-bf48-b54ac78c51a8', 'a5082720-1ce4-4517-8885-554e35789fe9', 4, N'اليوم 4', N'مغامرة لنكاوي المميزة بتجربة ركوب التلفريك، التقاط الصور على الجسر المعلق، وزيارة شلالات لنكاوي الخلابة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('51f6e1bf-0ef4-47f5-88cb-b9051048ffe9', 'a5082720-1ce4-4517-8885-554e35789fe9', 5, N'اليوم 5', N'رحلة قارب ساحرة في غابات المانجروف، للتمتع بالطبيعة ومشاهدة النسور واكتشاف الكهوف المائية.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('091673e1-d5f7-4084-adbf-953865af35f5', 'a5082720-1ce4-4517-8885-554e35789fe9', 6, N'اليوم 6', N'مغادرة لنكاوي براً أو بحراً/جواً إلى جزيرة بينانج، لتسجيل الدخول في الفندق والتمتع بأجواء الجزيرة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('8514b1f7-c7c8-4d17-b6ac-e38c2525271d', 'a5082720-1ce4-4517-8885-554e35789fe9', 7, N'اليوم 7', N'جولة سياحية غنية في بينانج لزيارة هضبة بينانج الشهيرة، حديقة الزهور، حديقة الفراشات، ومصنع الشوكولاتة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('317b2537-778f-4c5d-8b2f-2c899de7ba77', 'a5082720-1ce4-4517-8885-554e35789fe9', 8, N'اليوم 8', N'يوم حر في جزيرة بينانج للراحة والاسترخاء التام على الشواطئ الرملية أو ممارسة الأنشطة البحرية.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('8e83bbb9-a815-45c6-a116-684307ed7fa6', 'a5082720-1ce4-4517-8885-554e35789fe9', 9, N'اليوم 9', N'توديع بينانج والسفر إلى كوالالمبور، لتسجيل الدخول في الفندق وبدء استكشاف العاصمة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('ae26fba9-9799-448c-832e-2669b2458f98', 'a5082720-1ce4-4517-8885-554e35789fe9', 10, N'اليوم 10', N'جولة سياحية لاكتشاف كوالالمبور تشمل البرجين التوأم، حديقة الحيوانات الممتعة، والأكواريوم المدهش.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('6c4812cd-aa14-4cde-80de-93676ea3dc88', 'a5082720-1ce4-4517-8885-554e35789fe9', 11, N'اليوم 11', N'رحلة لمرتفعات جنتنج الباردة، تشمل ركوب التلفريك البانورامي، قضاء وقت ممتع في الملاهي، وزيارة معبد تشين سوي.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('4b598614-2ddc-41b5-96eb-e25c7fc75acd', 'a5082720-1ce4-4517-8885-554e35789fe9', 12, N'اليوم 12', N'يوم حر في العاصمة للتسوق الحر من أرقى المولات وتجربة المطاعم المتنوعة (بدون سائق).', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('186a8d35-fdd0-43d4-b48e-634cc094d4ae', 'a5082720-1ce4-4517-8885-554e35789fe9', 13, N'اليوم 13', N'انتهاء العطلة السعيدة، والتوصيل من الفندق إلى مطار كوالالمبور متمنين لكم رحلة عودة آمنة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('1407050b-e011-4e83-a165-ec7b36134d8f', 'a5082720-1ce4-4517-8885-554e35789fe9', N'صانوي لاجون - سلانجور', N'سلانجور', 4, 0, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('918c40c3-2047-40d3-9708-44ecfb6471b9', 'a5082720-1ce4-4517-8885-554e35789fe9', N'ذا باي فيو لنكاوي هوتيل - جزيرة لانكاوي', N'جزيرة لانكاوي', 4, 0, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', 2);

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('47a46937-41f8-49fc-abe3-e970747aaa55', 'a5082720-1ce4-4517-8885-554e35789fe9', N'همبتون بينانغ هوتيل - جزيرة بينانغ', N'جزيرة بينانغ', 4, 0, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', 3);

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('96754ddd-935c-481e-b178-292e08cf339b', 'a5082720-1ce4-4517-8885-554e35789fe9', N'فندق أوكوود كوالالمبور - كوالالمبور', N'كوالالمبور', 4, 0, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', 4);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('2a0ef994-8d55-4876-8ad5-86e4bf7b0251', 'a5082720-1ce4-4517-8885-554e35789fe9', N'مسار رحلة ممتاز');
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-ماليزيا-2026-fly-29-14-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('9e5da4fb-d021-4986-b73d-bb38566215a0', N'pkg-ماليزيا-2026-fly-29-14-days', @Dest_7, N'بكج ماليزيا 2026 FLY 29 الساحرة - عرض  يوم   ليله 14 أيام', N'Amazing ماليزيا 14 Days Deal', N'استمتع بـ 13 ليالي من الرفاهية في صانوي لاجون - سلانجور وغيرها', 9600, N'ر.س', N'14 أيام / 13 ليالي', 14, 13, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 1, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('13c402fb-4ffd-4943-95a0-054ee3c757fa', '9e5da4fb-d021-4986-b73d-bb38566215a0', 1, N'اليوم 1', N'الترحيب بكم في مطار كوالالمبور، والانتقال السلس إلى سيلانجور لتسجيل الدخول بالفندق والراحة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('7d6d4b78-1c32-4b73-a419-a1c6fe1120ed', '9e5da4fb-d021-4986-b73d-bb38566215a0', 2, N'اليوم 2', N'قضاء أوقات لا تُنسى في صنواي لاجون، والاستمتاع بمدينة الألعاب المائية المتكاملة وحديقة الحيوانات المرفقة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('3d665e3b-3533-4142-b97e-5ece472b4f34', '9e5da4fb-d021-4986-b73d-bb38566215a0', 3, N'اليوم 3', N'التوجه إلى المطار للسفر لجزيرة لنكاوي ذات الطبيعة الخلابة، والاستقبال هناك ثم التوصيل للفندق.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('ce25c2a7-4a8d-43c4-aae8-fec71c777a79', '9e5da4fb-d021-4986-b73d-bb38566215a0', 4, N'اليوم 4', N'جولة استكشافية لمعالم لنكاوي تشمل تلفريك لنكاوي الرائع، الجسر المعلق، شلالات لنكاوي المنعشة، وميدان النسر.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('59a6fc2f-1e8e-4e4d-a9e5-6ec3e400521f', '9e5da4fb-d021-4986-b73d-bb38566215a0', 5, N'اليوم 5', N'رحلة نهرية مدهشة عبر غابات المانجروف لمشاهدة إطعام النسور واستكشاف الطبيعة والكهوف، تليها العودة للفندق.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('55bb1a90-db97-4d78-a8ee-398c8ee36358', '9e5da4fb-d021-4986-b73d-bb38566215a0', 6, N'اليوم 6', N'توديع لنكاوي والانتقال إلى جزيرة بينانج الساحرة، لتسجيل الدخول في الفندق الجديد وتجديد النشاط.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('c2e48a0a-04a4-4311-abc5-8de8fe401d5f', '9e5da4fb-d021-4986-b73d-bb38566215a0', 7, N'اليوم 7', N'الانطلاق في جولة بينانج السياحية، لزيارة هضبة بينانج والحدائق الاستوائية، حديقة الفراشات، ومصنع الشوكولاتة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('7b92124e-0009-4f0b-b23c-3afc8637abc0', '9e5da4fb-d021-4986-b73d-bb38566215a0', 8, N'اليوم 8', N'يوم حر للاسترخاء والسباحة على شواطئ بينانج والاستمتاع بالمرافق السياحية المنتشرة حول الفندق.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('d30a606e-9280-450e-8740-7675057b2bdb', '9e5da4fb-d021-4986-b73d-bb38566215a0', 9, N'اليوم 9', N'مغادرة بينانج والتوجه نحو مرتفعات جنتنج ذات الأجواء الباردة والمنعشة لتسجيل الدخول والاستمتاع بالطبيعة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('fb8c8021-7e71-4b94-ba7f-8f8fe887ece8', '9e5da4fb-d021-4986-b73d-bb38566215a0', 10, N'اليوم 10', N'قضاء يوم ترفيهي في جنتنج لركوب التلفريك بين السحاب وتجربة الملاهي والألعاب، وزيارة معبد تشين سوي.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('9493451e-7d47-4ad6-b7cf-74394daa2508', '9e5da4fb-d021-4986-b73d-bb38566215a0', 11, N'اليوم 11', N'النزول من مرتفعات جنتنج والعودة إلى العاصمة كوالالمبور لتسجيل الدخول في الفندق الجديد للراحة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('69f713f3-9def-48e4-a5ca-d20f9706b6a9', '9e5da4fb-d021-4986-b73d-bb38566215a0', 12, N'اليوم 12', N'جولة ممتعة في كوالالمبور لزيارة أشهر معالمها مثل البرجين التوأم، منارة كوالالمبور، والأكواريوم المائي.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('7177257f-2509-4c10-ab81-258d937ea593', '9e5da4fb-d021-4986-b73d-bb38566215a0', 13, N'اليوم 13', N'يوم حر ومفتوح في كوالالمبور، يتيح لكم فرصة التسوق في المولات الفاخرة وشراء الهدايا التذكارية بكل حرية.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('dece9701-79fc-4aae-b396-b6d3e0b1446c', '9e5da4fb-d021-4986-b73d-bb38566215a0', 14, N'اليوم 14', N'ختام العطلة الماليزية السعيدة، والتوصيل من الفندق إلى مطار كوالالمبور الدولي لرحلة العودة بسلامة الله.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('8145b699-7268-42fc-9e6a-1ef7bea3fa1d', '9e5da4fb-d021-4986-b73d-bb38566215a0', N'صانوي لاجون - سلانجور', N'سلانجور', 4, 0, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('d0cfb335-3d71-4453-acd0-99db2ccb9e3f', '9e5da4fb-d021-4986-b73d-bb38566215a0', N'ذا باي فيو لنكاوي هوتيل - جزيرة لانكاوي', N'جزيرة لانكاوي', 4, 0, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', 2);

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('997b474c-b067-407a-a545-7d82be4d470c', '9e5da4fb-d021-4986-b73d-bb38566215a0', N'همبتون بينانغ هوتيل - جزيرة بينانغ', N'جزيرة بينانغ', 4, 0, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', 3);

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('a58c9e63-3234-4b55-8f5c-d5f8b9f4685a', '9e5da4fb-d021-4986-b73d-bb38566215a0', N'فندق سويس جاردن جينتنج هايلاندز - جنتنج هايلند', N'جنتنج هايلند', 4, 0, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', 4);

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('271dbdc6-fd4c-4a31-9771-b63b135e5142', '9e5da4fb-d021-4986-b73d-bb38566215a0', N'فندق أوكوود كوالالمبور - كوالالمبور', N'كوالالمبور', 4, 0, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', 5);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('b60c4e0a-955f-4691-a832-eb091dfe61fd', '9e5da4fb-d021-4986-b73d-bb38566215a0', N'مسار رحلة ممتاز');
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-ماليزيا-2026-fly-29-6-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('be6fc538-8bfe-4d99-9c41-b8039ee6f7e9', N'pkg-ماليزيا-2026-fly-29-6-days', @Dest_7, N'بكج ماليزيا 2026 FLY 29 الساحرة - عرض  ايام   ليالي 6 أيام', N'Amazing ماليزيا 6 Days Deal', N'استمتع بـ 5 ليالي من الرفاهية في فندق أوكوود كوالالمبور - كوالالمبور وغيرها', 2800, N'ر.س', N'6 أيام / 5 ليالي', 6, 5, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 1, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('29fc74b5-0b21-4487-8425-70715ec42ebe', 'be6fc538-8bfe-4d99-9c41-b8039ee6f7e9', 1, N'اليوم 1', N'الاستقبال في مطار كوالالمبور الدولي بكل ترحاب والانتقال المريح إلى فندق الإقامة للراحة والاستعداد لبدء الرحلة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('dcee8eaa-5868-456a-9ed9-820dac6d86d7', 'be6fc538-8bfe-4d99-9c41-b8039ee6f7e9', 2, N'اليوم 2', N'جولة ممتعة في مدينة الألعاب المائية صنواي لاجون، أكبر ملاهي مائية في شرق آسيا، للاستمتاع بالألعاب المائية والكهربائية وحديقة الحيوانات وقضاء يوم مليء بالمرح.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('776619b7-77b3-4fff-a5a5-e4e3ea76e578', 'be6fc538-8bfe-4d99-9c41-b8039ee6f7e9', 3, N'اليوم 3', N'جولة سياحية لاكتشاف سحر العاصمة كوالالمبور، تشمل زيارة البرجين التوأم، منارة كوالالمبور، وحديقة الحيوانات، واكتشاف عالم ما تحت البحار في الأكواريوم.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('c68bae80-0b6c-42c2-abe7-d3a86506b3e7', 'be6fc538-8bfe-4d99-9c41-b8039ee6f7e9', 4, N'اليوم 4', N'جولة مسائية ساحرة إلى مدينة الأضواء (I-City)، للاستمتاع بالمدينة الثلجية ومتحف الشمع، وقضاء وقت ممتع وسط الفعاليات المضيئة والألعاب.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('a0e41f14-c278-4d66-b261-dd8043074662', 'be6fc538-8bfe-4d99-9c41-b8039ee6f7e9', 5, N'اليوم 5', N'يوم حر في كوالالمبور يتيح لك الاستمتاع بمرافق الفندق أو التسوق والتجول الحر لاستكشاف الأسواق والمناطق القريبة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('96a5d43e-465d-491f-bca5-f62ea0d161e9', 'be6fc538-8bfe-4d99-9c41-b8039ee6f7e9', 6, N'اليوم 6', N'ختام العطلة السعيدة في ماليزيا وتوديعكم من الفندق إلى مطار كوالالمبور للعودة بسلامة الله.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('0df8638e-c6f2-4080-bfc3-98b3aaaa9797', 'be6fc538-8bfe-4d99-9c41-b8039ee6f7e9', N'فندق أوكوود كوالالمبور - كوالالمبور', N'كوالالمبور', 4, 0, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('072514a3-607e-47b1-8b41-7512637b366f', 'be6fc538-8bfe-4d99-9c41-b8039ee6f7e9', N'مسار رحلة ممتاز');
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-ماليزيا-2026-fly-29-7-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('2f132635-0208-4711-a2a6-b4ff87255a98', N'pkg-ماليزيا-2026-fly-29-7-days', @Dest_7, N'بكج ماليزيا 2026 FLY 29 الساحرة - عرض  ايام   ليالي 7 أيام', N'Amazing ماليزيا 7 Days Deal', N'استمتع بـ 6 ليالي من الرفاهية في صانوي لاجون - سلانجور وغيرها', 3300, N'ر.س', N'7 أيام / 6 ليالي', 7, 6, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 1, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('e73369c9-6036-491f-bed3-437ccee84944', '2f132635-0208-4711-a2a6-b4ff87255a98', 1, N'اليوم 1', N'استقبال دولي مميز في مطار كوالالمبور والانتقال المريح إلى فندق الإقامة في ولاية سيلانجور للراحة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('c292daf8-ecfd-4810-8966-e8490ec504eb', '2f132635-0208-4711-a2a6-b4ff87255a98', 2, N'اليوم 2', N'قضاء يوم كامل من المتعة في مدينة الألعاب المائية صنواي لاجون الشهيرة، والاستمتاع بالألعاب المائية المتنوعة، حديقة الحيوانات، وبيت الرعب (بدون سائق).', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('dd2a41c0-60b9-4a53-943d-8f17d5fb36bf', '2f132635-0208-4711-a2a6-b4ff87255a98', 3, N'اليوم 3', N'توديع سيلانجور والانتقال المريح بالسيارة الخاصة إلى العاصمة النابضة بالحياة كوالالمبور لتسجيل الدخول في الفندق.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('834b59a3-4fb2-4ea7-8d22-4faadc5aa365', '2f132635-0208-4711-a2a6-b4ff87255a98', 4, N'اليوم 4', N'جولة استكشافية لمعالم كوالالمبور، تتضمن زيارة البرجين التوأم، منارة كوالالمبور، حديقة الحيوانات، والغوص في أسرار المحيط في أكواريوم عالم تحت البحار.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('2344a13e-017c-497e-90b3-d8d72e3b0378', '2f132635-0208-4711-a2a6-b4ff87255a98', 5, N'اليوم 5', N'رحلة مسائية إلى مدينة الأضواء (I-City)، للاستمتاع بالأجواء الباردة في المدينة الثلجية، والتقاط الصور في متحف الشمع، وتجربة الألعاب الممتعة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('5f5a9d46-9a75-4d33-bea4-62c66e8ffba4', '2f132635-0208-4711-a2a6-b4ff87255a98', 6, N'اليوم 6', N'يوم حر بالكامل للاستجمام في الفندق، أو الانطلاق في جولة تسوق خاصة لشراء الهدايا التذكارية من أرقى مولات كوالالمبور.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('18cfc9d5-f885-4876-a9c5-a94c034e2237', '2f132635-0208-4711-a2a6-b4ff87255a98', 7, N'اليوم 7', N'نهاية الرحلة الممتعة، وتوديع كوالالمبور والانتقال من الفندق إلى المطار لرحلة العودة إلى أرض الوطن.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('6cbe7ff5-7702-4de0-b8a4-385d90294c58', '2f132635-0208-4711-a2a6-b4ff87255a98', N'صانوي لاجون - سلانجور', N'سلانجور', 4, 0, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('f70e92a7-945a-4327-84ff-bcc6a807f468', '2f132635-0208-4711-a2a6-b4ff87255a98', N'فندق أوكوود كوالالمبور - كوالالمبور', N'كوالالمبور', 4, 0, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', 2);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('9382245e-f06e-45f3-a1e3-ed4d2df67ac6', '2f132635-0208-4711-a2a6-b4ff87255a98', N'مسار رحلة ممتاز');
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-ماليزيا-2026-fly-29-8-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('480650c3-d1fc-444e-8907-324da2dab603', N'pkg-ماليزيا-2026-fly-29-8-days', @Dest_7, N'بكج ماليزيا 2026 FLY 29 الساحرة - عرض  ايام   ليالي 8 أيام', N'Amazing ماليزيا 8 Days Deal', N'استمتع بـ 7 ليالي من الرفاهية في صانوي لاجون - سلانجور وغيرها', 4300, N'ر.س', N'8 أيام / 7 ليالي', 8, 7, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 1, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('4ede9c35-ac06-4ed7-bca4-31d121f8440f', '480650c3-d1fc-444e-8907-324da2dab603', 1, N'اليوم 1', N'الاستقبال بحفاوة في مطار كوالالمبور الدولي والانتقال السلس إلى الفندق في سيلانجور لبدء عطلتكم.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('80cef1d6-f991-4e65-a839-3429c0da8a86', '480650c3-d1fc-444e-8907-324da2dab603', 2, N'اليوم 2', N'الانطلاق لقضاء يوم مليء بالإثارة في صنواي لاجون، أكبر مدن الألعاب المائية في آسيا، للاستمتاع بالمسابح والألعاب الكهربائية وحديقة الحيوانات (بدون سائق).', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('b00619a6-8000-419d-9f83-07904cc7daf6', '480650c3-d1fc-444e-8907-324da2dab603', 3, N'اليوم 3', N'مغادرة سيلانجور والتوجه نحو مرتفعات جنتنج الباردة، مع الاستمتاع بالطبيعة الجبلية الساحرة وتسجيل الدخول في الفندق.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('948ad00e-55a8-437c-9bf1-aa5a8081af23', '480650c3-d1fc-444e-8907-324da2dab603', 4, N'اليوم 4', N'جولة رائعة في جنتنج تشمل ركوب التلفريك للاستمتاع بإطلالة بانورامية فوق السحاب، وزيارة معبد تشين سوي الصيني، تليها رحلة الانتقال إلى العاصمة كوالالمبور.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('dcd8db3d-30f1-4e8e-95b1-a9be8df80c04', '480650c3-d1fc-444e-8907-324da2dab603', 5, N'اليوم 5', N'جولة سياحية للتعرف على أبرز معالم كوالالمبور، من البرجين التوأم إلى منارة كوالالمبور، مروراً بحديقة الحيوانات والأكواريوم.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('8e22ee95-cba5-494d-a1e7-a9379e14cb4a', '480650c3-d1fc-444e-8907-324da2dab603', 6, N'اليوم 6', N'جولة ترفيهية مسائية في مدينة الأضواء (I-City)، تشمل زيارة المدينة الثلجية ومتحف الشمع والاستمتاع بالأجواء المضيئة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('7b97b818-60e6-4693-a3c8-da870f22336a', '480650c3-d1fc-444e-8907-324da2dab603', 7, N'اليوم 7', N'يوم حر في كوالالمبور للاسترخاء التام في مرافق الفندق أو التجول الحر في الأسواق المجاورة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('ea69251a-fdf2-4efb-ba7a-cc3c8f8023bd', '480650c3-d1fc-444e-8907-324da2dab603', 8, N'اليوم 8', N'ختام العطلة السعيدة والتوصيل المريح من فندق كوالالمبور إلى المطار رافقتكم السلامة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('8e3d5ae9-370b-4e34-9d8a-0ea43bc72b43', '480650c3-d1fc-444e-8907-324da2dab603', N'صانوي لاجون - سلانجور', N'سلانجور', 4, 0, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('ba4f2896-5161-4bff-9dfc-bdf188658fe3', '480650c3-d1fc-444e-8907-324da2dab603', N'فندق سويس جاردن جينتنج هايلاندز - جنتنج هايلند', N'جنتنج هايلند', 4, 0, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', 2);

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('fd43de51-5d10-4ada-bf19-9b3fe274389c', '480650c3-d1fc-444e-8907-324da2dab603', N'فندق أوكوود كوالالمبور - كوالالمبور', N'كوالالمبور', 4, 0, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', 3);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('c05fc3a1-d19b-4843-97e5-1286dd432bd1', '480650c3-d1fc-444e-8907-324da2dab603', N'مسار رحلة ممتاز');
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-ماليزيا-2026-fly-29-9-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('92b89bbe-6c90-4870-920f-5121c84ec32e', N'pkg-ماليزيا-2026-fly-29-9-days', @Dest_7, N'بكج ماليزيا 2026 FLY 29 الساحرة - عرض  ايام   ليالي 9 أيام', N'Amazing ماليزيا 9 Days Deal', N'استمتع بـ 8 ليالي من الرفاهية في صانوي لاجون - سلانجور وغيرها', 5250, N'ر.س', N'9 أيام / 8 ليالي', 9, 8, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 1, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('0da9f798-7a0d-43b9-b417-44568c5f9ccd', '92b89bbe-6c90-4870-920f-5121c84ec32e', 1, N'اليوم 1', N'استقبالكم في مطار كوالالمبور والتوجه بالسيارة الخاصة إلى فندقكم في سيلانجور للراحة والاستعداد للمغامرة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('cacd8df7-bc36-43fd-a0b3-a7dd30b79430', '92b89bbe-6c90-4870-920f-5121c84ec32e', 2, N'اليوم 2', N'يوم حافل بالمرح العائلي في ملاهي صنواي لاجون المائية، حيث تتنوع الألعاب المائية والكهربائية وتجارب المغامرة (بدون سائق).', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('7cd5fc84-898f-44dc-809c-f93461804043', '92b89bbe-6c90-4870-920f-5121c84ec32e', 3, N'اليوم 3', N'توديع سيلانجور والانتقال المريح إلى مرتفعات جنتنج ذات الأجواء الباردة والمنعشة لتسجيل الدخول في الفندق.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('7cf06013-11a3-45a6-9340-1ff2b6ec7c22', '92b89bbe-6c90-4870-920f-5121c84ec32e', 4, N'اليوم 4', N'الاستمتاع بجمال جنتنج عبر ركوب التلفريك (أوانا سكاي واي) بين السحاب، وزيارة معبد تشين سوي العريق، واكتشاف مراكز الترفيه المتنوعة بالمرتفعات.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('067e66ee-2c9e-483f-aab8-9635523245b8', '92b89bbe-6c90-4870-920f-5121c84ec32e', 5, N'اليوم 5', N'الانتقال من طبيعة جنتنج الجبلية إلى سحر العاصمة كوالالمبور، وتدوين الدخول في الفندق الجديد.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('a53e562a-b25d-4603-a535-8102b4a454e3', '92b89bbe-6c90-4870-920f-5121c84ec32e', 6, N'اليوم 6', N'جولة كوالالمبور السياحية لاستكشاف البرجين التوأم، منارة كوالالمبور، حديقة الحيوانات المفتوحة، وعالم ما تحت البحار في الأكواريوم.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('29e9d2df-7e52-43ab-a7e5-8381c2f129bd', '92b89bbe-6c90-4870-920f-5121c84ec32e', 7, N'اليوم 7', N'جولة ساحرة إلى مدينة الأضواء (I-City) لتجربة المدينة الثلجية، ومتحف الشمع، والتمتع بالألعاب الضوئية والفعاليات الليلية.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('b0a8d1bb-edc9-4ac3-bdd7-4cea40ed3ee8', '92b89bbe-6c90-4870-920f-5121c84ec32e', 8, N'اليوم 8', N'يوم حر ومفتوح في كوالالمبور، فرصة للتسوق واقتناء الهدايا أو الاسترخاء في كافيهات المدينة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('f752fc8a-bc6f-43e1-9920-52e45348ea5a', '92b89bbe-6c90-4870-920f-5121c84ec32e', 9, N'اليوم 9', N'التوديع في اليوم الأخير، والانتقال من الفندق إلى مطار كوالالمبور للعودة إلى الديار بسلامة الله.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('f1d9decd-a83e-4862-9128-17f39b2df0cd', '92b89bbe-6c90-4870-920f-5121c84ec32e', N'صانوي لاجون - سلانجور', N'سلانجور', 4, 0, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('c451be18-1d9a-4675-bf06-c39a521b87aa', '92b89bbe-6c90-4870-920f-5121c84ec32e', N'فندق سويس جاردن جينتنج هايلاندز - جنتنج هايلند', N'جنتنج هايلند', 4, 0, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', 2);

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('7dee9942-4840-4514-8a94-0a5ff2d95f1c', '92b89bbe-6c90-4870-920f-5121c84ec32e', N'فندق أوكوود كوالالمبور - كوالالمبور', N'كوالالمبور', 4, 0, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', 3);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('a86adf26-5823-4777-9163-1f74940e69f3', '92b89bbe-6c90-4870-920f-5121c84ec32e', N'مسار رحلة ممتاز');
END

IF NOT EXISTS (SELECT 1 FROM Packages WHERE PackageId = N'pkg-ماليزيا-2026-fly-29-5-days')
BEGIN
    INSERT INTO Packages (Id, PackageId, DestinationId, TitleAr, TitleEn, Subtitle, Price, Currency, Duration, DurationDays, DurationNights, ImageUrl, VideoUrl, Vibe, Rating, IsOffer, IsActive, CreatedAt)
    VALUES ('81ec021c-4a57-4936-87f2-a7d797284c54', N'pkg-ماليزيا-2026-fly-29-5-days', @Dest_7, N'بكج ماليزيا 2026 FLY 29 الساحرة - عروض ماليزيا بالريال السعودي الحجز المبكر 5 أيام', N'Amazing ماليزيا 2026 FLY 29 5 Days Package', N'استمتع بـ 4 ليالي من الرفاهية في أفضل فنادق ماليزيا 2026 FLY 29', 3750, N'ر.س', N'5 أيام / 4 ليالي', 5, 4, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'', N'tropical', 4.8, 1, 1, GETUTCDATE());

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('e06f9a45-a6ba-478d-b8a0-0651af8bc1a2', '81ec021c-4a57-4936-87f2-a7d797284c54', 1, N'اليوم 1', N'وصف تفصيلي لجولات اليوم رقم 1 في ماليزيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('3d70b653-bf46-442c-a98e-f12a71fee04d', '81ec021c-4a57-4936-87f2-a7d797284c54', 2, N'اليوم 2', N'وصف تفصيلي لجولات اليوم رقم 2 في ماليزيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('9501a2bb-c0f9-46f5-bef9-cccc052f3d36', '81ec021c-4a57-4936-87f2-a7d797284c54', 3, N'اليوم 3', N'وصف تفصيلي لجولات اليوم رقم 3 في ماليزيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('fbd126c1-d8df-42f8-8f60-8c3a4a8e06e5', '81ec021c-4a57-4936-87f2-a7d797284c54', 4, N'اليوم 4', N'وصف تفصيلي لجولات اليوم رقم 4 في ماليزيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES ('faee600b-2d9c-4d61-801d-97325054dba0', '81ec021c-4a57-4936-87f2-a7d797284c54', 5, N'اليوم 5', N'وصف تفصيلي لجولات اليوم رقم 5 في ماليزيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES ('544cd987-c52f-4acc-8d0d-b6178e025a98', '81ec021c-4a57-4936-87f2-a7d797284c54', N'فندق الملحم الفاخر - ماليزيا 2026 FLY 29', N'ماليزيا 2026 FLY 29', 5, 0, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', 1);

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES ('0bf1c075-f78d-4079-8d55-c84171513a55', '81ec021c-4a57-4936-87f2-a7d797284c54', N'مسار رحلة ممتاز');
END
