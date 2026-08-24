-- ==========================================================
-- AlMulhim Travel Production UPDATE Script (80 Packages)
-- ==========================================================

UPDATE Packages 
SET Price = 15000, 
    TitleEn = N'Amazing المالديف رونق ترافل 2026 30 Days Package', 
    Subtitle = N'استمتع بـ 29 ليالي من الرفاهية في أفضل فنادق المالديف رونق ترافل 2026' 
WHERE PackageId = N'pkg-المالديف-رونق-ترافل-2026-30-days';

DECLARE @PackId_pkg_المالديف_رونق_ترافل_2026_30_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_المالديف_رونق_ترافل_2026_30_days = Id FROM Packages WHERE PackageId = N'pkg-المالديف-رونق-ترافل-2026-30-days';
IF @PackId_pkg_المالديف_رونق_ترافل_2026_30_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_المالديف_رونق_ترافل_2026_30_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_المالديف_رونق_ترافل_2026_30_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_المالديف_رونق_ترافل_2026_30_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_المالديف_رونق_ترافل_2026_30_days, N'فندق الملحم الفاخر - المالديف رونق ترافل 2026', N'', 5, 29, N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_المالديف_رونق_ترافل_2026_30_days, 1, N'اليوم 1', N'وصف تفصيلي لجولات اليوم رقم 1 في المالديف رونق ترافل 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_المالديف_رونق_ترافل_2026_30_days, 2, N'اليوم 2', N'وصف تفصيلي لجولات اليوم رقم 2 في المالديف رونق ترافل 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_المالديف_رونق_ترافل_2026_30_days, 3, N'اليوم 3', N'وصف تفصيلي لجولات اليوم رقم 3 في المالديف رونق ترافل 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_المالديف_رونق_ترافل_2026_30_days, 4, N'اليوم 4', N'وصف تفصيلي لجولات اليوم رقم 4 في المالديف رونق ترافل 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_المالديف_رونق_ترافل_2026_30_days, 5, N'اليوم 5', N'وصف تفصيلي لجولات اليوم رقم 5 في المالديف رونق ترافل 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_المالديف_رونق_ترافل_2026_30_days, 6, N'اليوم 6', N'وصف تفصيلي لجولات اليوم رقم 6 في المالديف رونق ترافل 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_المالديف_رونق_ترافل_2026_30_days, 7, N'اليوم 7', N'وصف تفصيلي لجولات اليوم رقم 7 في المالديف رونق ترافل 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_المالديف_رونق_ترافل_2026_30_days, 8, N'اليوم 8', N'وصف تفصيلي لجولات اليوم رقم 8 في المالديف رونق ترافل 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_المالديف_رونق_ترافل_2026_30_days, 9, N'اليوم 9', N'وصف تفصيلي لجولات اليوم رقم 9 في المالديف رونق ترافل 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_المالديف_رونق_ترافل_2026_30_days, 10, N'اليوم 10', N'وصف تفصيلي لجولات اليوم رقم 10 في المالديف رونق ترافل 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_المالديف_رونق_ترافل_2026_30_days, 11, N'اليوم 11', N'وصف تفصيلي لجولات اليوم رقم 11 في المالديف رونق ترافل 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_المالديف_رونق_ترافل_2026_30_days, 12, N'اليوم 12', N'وصف تفصيلي لجولات اليوم رقم 12 في المالديف رونق ترافل 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_المالديف_رونق_ترافل_2026_30_days, 13, N'اليوم 13', N'وصف تفصيلي لجولات اليوم رقم 13 في المالديف رونق ترافل 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_المالديف_رونق_ترافل_2026_30_days, 14, N'اليوم 14', N'وصف تفصيلي لجولات اليوم رقم 14 في المالديف رونق ترافل 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_المالديف_رونق_ترافل_2026_30_days, 15, N'اليوم 15', N'وصف تفصيلي لجولات اليوم رقم 15 في المالديف رونق ترافل 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_المالديف_رونق_ترافل_2026_30_days, 16, N'اليوم 16', N'وصف تفصيلي لجولات اليوم رقم 16 في المالديف رونق ترافل 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_المالديف_رونق_ترافل_2026_30_days, 17, N'اليوم 17', N'وصف تفصيلي لجولات اليوم رقم 17 في المالديف رونق ترافل 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_المالديف_رونق_ترافل_2026_30_days, 18, N'اليوم 18', N'وصف تفصيلي لجولات اليوم رقم 18 في المالديف رونق ترافل 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_المالديف_رونق_ترافل_2026_30_days, 19, N'اليوم 19', N'وصف تفصيلي لجولات اليوم رقم 19 في المالديف رونق ترافل 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_المالديف_رونق_ترافل_2026_30_days, 20, N'اليوم 20', N'وصف تفصيلي لجولات اليوم رقم 20 في المالديف رونق ترافل 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_المالديف_رونق_ترافل_2026_30_days, 21, N'اليوم 21', N'وصف تفصيلي لجولات اليوم رقم 21 في المالديف رونق ترافل 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_المالديف_رونق_ترافل_2026_30_days, 22, N'اليوم 22', N'وصف تفصيلي لجولات اليوم رقم 22 في المالديف رونق ترافل 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_المالديف_رونق_ترافل_2026_30_days, 23, N'اليوم 23', N'وصف تفصيلي لجولات اليوم رقم 23 في المالديف رونق ترافل 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_المالديف_رونق_ترافل_2026_30_days, 24, N'اليوم 24', N'وصف تفصيلي لجولات اليوم رقم 24 في المالديف رونق ترافل 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_المالديف_رونق_ترافل_2026_30_days, 25, N'اليوم 25', N'وصف تفصيلي لجولات اليوم رقم 25 في المالديف رونق ترافل 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_المالديف_رونق_ترافل_2026_30_days, 26, N'اليوم 26', N'وصف تفصيلي لجولات اليوم رقم 26 في المالديف رونق ترافل 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_المالديف_رونق_ترافل_2026_30_days, 27, N'اليوم 27', N'وصف تفصيلي لجولات اليوم رقم 27 في المالديف رونق ترافل 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_المالديف_رونق_ترافل_2026_30_days, 28, N'اليوم 28', N'وصف تفصيلي لجولات اليوم رقم 28 في المالديف رونق ترافل 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_المالديف_رونق_ترافل_2026_30_days, 29, N'اليوم 29', N'وصف تفصيلي لجولات اليوم رقم 29 في المالديف رونق ترافل 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_المالديف_رونق_ترافل_2026_30_days, 30, N'اليوم 30', N'وصف تفصيلي لجولات اليوم رقم 30 في المالديف رونق ترافل 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_المالديف_رونق_ترافل_2026_30_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 3750, 
    TitleEn = N'Amazing جزر المالديف 5 Days Deal', 
    Subtitle = N'استمتع بـ 4 ليالي من الرفاهية في منتجع كانديما وغيرها' 
WHERE PackageId = N'pkg-المالديف-رونق-ترافل-2026-5-days';

DECLARE @PackId_pkg_المالديف_رونق_ترافل_2026_5_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_المالديف_رونق_ترافل_2026_5_days = Id FROM Packages WHERE PackageId = N'pkg-المالديف-رونق-ترافل-2026-5-days';
IF @PackId_pkg_المالديف_رونق_ترافل_2026_5_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_المالديف_رونق_ترافل_2026_5_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_المالديف_رونق_ترافل_2026_5_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_المالديف_رونق_ترافل_2026_5_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_المالديف_رونق_ترافل_2026_5_days, N'منتجع كانديما', N'', 4, 4, N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_المالديف_رونق_ترافل_2026_5_days, 1, N'اليوم 1', N'الاستقبال في مطار المالديف، والانتقال عبر الطيران الداخلي والقارب السريع إلى منتجع كانديما وتسجيل الدخول للبدء في إقامة مميزة تشمل وجبتي الإفطار والعشاء.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_المالديف_رونق_ترافل_2026_5_days, 2, N'اليوم 2', N'الاستمتاع بجلسة تصوير مجانية لمدة 20 دقيقة في استوديو ''Snap'' لتوثيق أجمل الذكريات، وتجربة الإفطار العائم الاستثنائية لضيوف الفلل التي تحتوي على مسبح.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_المالديف_رونق_ترافل_2026_5_days, 3, N'اليوم 3', N'الانطلاق في رحلة قارب (صباحية أو مسائية) إلى الشعاب المرجانية الخاصة بالفندق لتجربة غوص (سنوركلينج) لا تُنسى وسط الحياة البحرية الخلابة.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_المالديف_رونق_ترافل_2026_5_days, 4, N'اليوم 4', N'الاستمتاع برحلة كروز استكشافية لمدة ساعة كاملة، وقضاء أمسية ساحرة مع ليلة السينما الجماعية تحت النجوم.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_المالديف_رونق_ترافل_2026_5_days, 5, N'اليوم 5', N'تسجيل الخروج من المنتجع مع الاستفادة من الخصومات الإضافية على المطاعم، ثم الانتقال للمطار لرحلة العودة.', N'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_المالديف_رونق_ترافل_2026_5_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 6900, 
    TitleEn = N'Amazing اندونيسيا FLY 29 12 Days Package', 
    Subtitle = N'استمتع بـ 11 ليالي من الرفاهية في أفضل فنادق اندونيسيا FLY 29' 
WHERE PackageId = N'pkg-اندونيسيا-fly-29-12-days';

DECLARE @PackId_pkg_اندونيسيا_fly_29_12_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_اندونيسيا_fly_29_12_days = Id FROM Packages WHERE PackageId = N'pkg-اندونيسيا-fly-29-12-days';
IF @PackId_pkg_اندونيسيا_fly_29_12_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_اندونيسيا_fly_29_12_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_اندونيسيا_fly_29_12_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_اندونيسيا_fly_29_12_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_12_days, N'فندق الملحم الفاخر - اندونيسيا FLY 29', N'', 5, 11, N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_12_days, 1, N'اليوم 1', N'وصف تفصيلي لجولات اليوم رقم 1 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_12_days, 2, N'اليوم 2', N'وصف تفصيلي لجولات اليوم رقم 2 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_12_days, 3, N'اليوم 3', N'وصف تفصيلي لجولات اليوم رقم 3 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_12_days, 4, N'اليوم 4', N'وصف تفصيلي لجولات اليوم رقم 4 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_12_days, 5, N'اليوم 5', N'وصف تفصيلي لجولات اليوم رقم 5 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_12_days, 6, N'اليوم 6', N'وصف تفصيلي لجولات اليوم رقم 6 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_12_days, 7, N'اليوم 7', N'وصف تفصيلي لجولات اليوم رقم 7 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_12_days, 8, N'اليوم 8', N'وصف تفصيلي لجولات اليوم رقم 8 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_12_days, 9, N'اليوم 9', N'وصف تفصيلي لجولات اليوم رقم 9 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_12_days, 10, N'اليوم 10', N'وصف تفصيلي لجولات اليوم رقم 10 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_12_days, 11, N'اليوم 11', N'وصف تفصيلي لجولات اليوم رقم 11 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_12_days, 12, N'اليوم 12', N'وصف تفصيلي لجولات اليوم رقم 12 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_12_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 6000, 
    TitleEn = N'Amazing اندونيسيا FLY 29 10 Days Package', 
    Subtitle = N'استمتع بـ 9 ليالي من الرفاهية في أفضل فنادق اندونيسيا FLY 29' 
WHERE PackageId = N'pkg-اندونيسيا-fly-29-10-days';

DECLARE @PackId_pkg_اندونيسيا_fly_29_10_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_اندونيسيا_fly_29_10_days = Id FROM Packages WHERE PackageId = N'pkg-اندونيسيا-fly-29-10-days';
IF @PackId_pkg_اندونيسيا_fly_29_10_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_اندونيسيا_fly_29_10_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_اندونيسيا_fly_29_10_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_اندونيسيا_fly_29_10_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_10_days, N'فندق الملحم الفاخر - اندونيسيا FLY 29', N'', 5, 9, N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_10_days, 1, N'اليوم 1', N'وصف تفصيلي لجولات اليوم رقم 1 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_10_days, 2, N'اليوم 2', N'وصف تفصيلي لجولات اليوم رقم 2 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_10_days, 3, N'اليوم 3', N'وصف تفصيلي لجولات اليوم رقم 3 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_10_days, 4, N'اليوم 4', N'وصف تفصيلي لجولات اليوم رقم 4 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_10_days, 5, N'اليوم 5', N'وصف تفصيلي لجولات اليوم رقم 5 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_10_days, 6, N'اليوم 6', N'وصف تفصيلي لجولات اليوم رقم 6 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_10_days, 7, N'اليوم 7', N'وصف تفصيلي لجولات اليوم رقم 7 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_10_days, 8, N'اليوم 8', N'وصف تفصيلي لجولات اليوم رقم 8 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_10_days, 9, N'اليوم 9', N'وصف تفصيلي لجولات اليوم رقم 9 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_10_days, 10, N'اليوم 10', N'وصف تفصيلي لجولات اليوم رقم 10 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_10_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 6450, 
    TitleEn = N'Amazing اندونيسيا FLY 29 11 Days Package', 
    Subtitle = N'استمتع بـ 10 ليالي من الرفاهية في أفضل فنادق اندونيسيا FLY 29' 
WHERE PackageId = N'pkg-اندونيسيا-fly-29-11-days';

DECLARE @PackId_pkg_اندونيسيا_fly_29_11_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_اندونيسيا_fly_29_11_days = Id FROM Packages WHERE PackageId = N'pkg-اندونيسيا-fly-29-11-days';
IF @PackId_pkg_اندونيسيا_fly_29_11_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_اندونيسيا_fly_29_11_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_اندونيسيا_fly_29_11_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_اندونيسيا_fly_29_11_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_11_days, N'فندق الملحم الفاخر - اندونيسيا FLY 29', N'', 5, 10, N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_11_days, 1, N'اليوم 1', N'وصف تفصيلي لجولات اليوم رقم 1 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_11_days, 2, N'اليوم 2', N'وصف تفصيلي لجولات اليوم رقم 2 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_11_days, 3, N'اليوم 3', N'وصف تفصيلي لجولات اليوم رقم 3 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_11_days, 4, N'اليوم 4', N'وصف تفصيلي لجولات اليوم رقم 4 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_11_days, 5, N'اليوم 5', N'وصف تفصيلي لجولات اليوم رقم 5 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_11_days, 6, N'اليوم 6', N'وصف تفصيلي لجولات اليوم رقم 6 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_11_days, 7, N'اليوم 7', N'وصف تفصيلي لجولات اليوم رقم 7 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_11_days, 8, N'اليوم 8', N'وصف تفصيلي لجولات اليوم رقم 8 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_11_days, 9, N'اليوم 9', N'وصف تفصيلي لجولات اليوم رقم 9 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_11_days, 10, N'اليوم 10', N'وصف تفصيلي لجولات اليوم رقم 10 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_11_days, 11, N'اليوم 11', N'وصف تفصيلي لجولات اليوم رقم 11 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_11_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 7350, 
    TitleEn = N'Amazing اندونيسيا FLY 29 13 Days Package', 
    Subtitle = N'استمتع بـ 12 ليالي من الرفاهية في أفضل فنادق اندونيسيا FLY 29' 
WHERE PackageId = N'pkg-اندونيسيا-fly-29-13-days';

DECLARE @PackId_pkg_اندونيسيا_fly_29_13_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_اندونيسيا_fly_29_13_days = Id FROM Packages WHERE PackageId = N'pkg-اندونيسيا-fly-29-13-days';
IF @PackId_pkg_اندونيسيا_fly_29_13_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_اندونيسيا_fly_29_13_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_اندونيسيا_fly_29_13_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_اندونيسيا_fly_29_13_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_13_days, N'فندق الملحم الفاخر - اندونيسيا FLY 29', N'', 5, 12, N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_13_days, 1, N'اليوم 1', N'وصف تفصيلي لجولات اليوم رقم 1 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_13_days, 2, N'اليوم 2', N'وصف تفصيلي لجولات اليوم رقم 2 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_13_days, 3, N'اليوم 3', N'وصف تفصيلي لجولات اليوم رقم 3 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_13_days, 4, N'اليوم 4', N'وصف تفصيلي لجولات اليوم رقم 4 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_13_days, 5, N'اليوم 5', N'وصف تفصيلي لجولات اليوم رقم 5 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_13_days, 6, N'اليوم 6', N'وصف تفصيلي لجولات اليوم رقم 6 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_13_days, 7, N'اليوم 7', N'وصف تفصيلي لجولات اليوم رقم 7 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_13_days, 8, N'اليوم 8', N'وصف تفصيلي لجولات اليوم رقم 8 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_13_days, 9, N'اليوم 9', N'وصف تفصيلي لجولات اليوم رقم 9 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_13_days, 10, N'اليوم 10', N'وصف تفصيلي لجولات اليوم رقم 10 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_13_days, 11, N'اليوم 11', N'وصف تفصيلي لجولات اليوم رقم 11 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_13_days, 12, N'اليوم 12', N'وصف تفصيلي لجولات اليوم رقم 12 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_13_days, 13, N'اليوم 13', N'وصف تفصيلي لجولات اليوم رقم 13 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_13_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 7800, 
    TitleEn = N'Amazing اندونيسيا FLY 29 14 Days Package', 
    Subtitle = N'استمتع بـ 13 ليالي من الرفاهية في أفضل فنادق اندونيسيا FLY 29' 
WHERE PackageId = N'pkg-اندونيسيا-fly-29-14-days';

DECLARE @PackId_pkg_اندونيسيا_fly_29_14_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_اندونيسيا_fly_29_14_days = Id FROM Packages WHERE PackageId = N'pkg-اندونيسيا-fly-29-14-days';
IF @PackId_pkg_اندونيسيا_fly_29_14_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_اندونيسيا_fly_29_14_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_اندونيسيا_fly_29_14_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_اندونيسيا_fly_29_14_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_14_days, N'فندق الملحم الفاخر - اندونيسيا FLY 29', N'', 5, 13, N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_14_days, 1, N'اليوم 1', N'وصف تفصيلي لجولات اليوم رقم 1 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_14_days, 2, N'اليوم 2', N'وصف تفصيلي لجولات اليوم رقم 2 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_14_days, 3, N'اليوم 3', N'وصف تفصيلي لجولات اليوم رقم 3 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_14_days, 4, N'اليوم 4', N'وصف تفصيلي لجولات اليوم رقم 4 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_14_days, 5, N'اليوم 5', N'وصف تفصيلي لجولات اليوم رقم 5 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_14_days, 6, N'اليوم 6', N'وصف تفصيلي لجولات اليوم رقم 6 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_14_days, 7, N'اليوم 7', N'وصف تفصيلي لجولات اليوم رقم 7 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_14_days, 8, N'اليوم 8', N'وصف تفصيلي لجولات اليوم رقم 8 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_14_days, 9, N'اليوم 9', N'وصف تفصيلي لجولات اليوم رقم 9 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_14_days, 10, N'اليوم 10', N'وصف تفصيلي لجولات اليوم رقم 10 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_14_days, 11, N'اليوم 11', N'وصف تفصيلي لجولات اليوم رقم 11 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_14_days, 12, N'اليوم 12', N'وصف تفصيلي لجولات اليوم رقم 12 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_14_days, 13, N'اليوم 13', N'وصف تفصيلي لجولات اليوم رقم 13 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_14_days, 14, N'اليوم 14', N'وصف تفصيلي لجولات اليوم رقم 14 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_14_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 8250, 
    TitleEn = N'Amazing اندونيسيا FLY 29 15 Days Package', 
    Subtitle = N'استمتع بـ 14 ليالي من الرفاهية في أفضل فنادق اندونيسيا FLY 29' 
WHERE PackageId = N'pkg-اندونيسيا-fly-29-15-days';

DECLARE @PackId_pkg_اندونيسيا_fly_29_15_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_اندونيسيا_fly_29_15_days = Id FROM Packages WHERE PackageId = N'pkg-اندونيسيا-fly-29-15-days';
IF @PackId_pkg_اندونيسيا_fly_29_15_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_اندونيسيا_fly_29_15_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_اندونيسيا_fly_29_15_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_اندونيسيا_fly_29_15_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_15_days, N'فندق الملحم الفاخر - اندونيسيا FLY 29', N'', 5, 14, N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_15_days, 1, N'اليوم 1', N'وصف تفصيلي لجولات اليوم رقم 1 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_15_days, 2, N'اليوم 2', N'وصف تفصيلي لجولات اليوم رقم 2 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_15_days, 3, N'اليوم 3', N'وصف تفصيلي لجولات اليوم رقم 3 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_15_days, 4, N'اليوم 4', N'وصف تفصيلي لجولات اليوم رقم 4 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_15_days, 5, N'اليوم 5', N'وصف تفصيلي لجولات اليوم رقم 5 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_15_days, 6, N'اليوم 6', N'وصف تفصيلي لجولات اليوم رقم 6 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_15_days, 7, N'اليوم 7', N'وصف تفصيلي لجولات اليوم رقم 7 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_15_days, 8, N'اليوم 8', N'وصف تفصيلي لجولات اليوم رقم 8 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_15_days, 9, N'اليوم 9', N'وصف تفصيلي لجولات اليوم رقم 9 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_15_days, 10, N'اليوم 10', N'وصف تفصيلي لجولات اليوم رقم 10 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_15_days, 11, N'اليوم 11', N'وصف تفصيلي لجولات اليوم رقم 11 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_15_days, 12, N'اليوم 12', N'وصف تفصيلي لجولات اليوم رقم 12 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_15_days, 13, N'اليوم 13', N'وصف تفصيلي لجولات اليوم رقم 13 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_15_days, 14, N'اليوم 14', N'وصف تفصيلي لجولات اليوم رقم 14 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_15_days, 15, N'اليوم 15', N'وصف تفصيلي لجولات اليوم رقم 15 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_15_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 4200, 
    TitleEn = N'Amazing اندونيسيا  6 Days Deal', 
    Subtitle = N'استمتع بـ 5 ليالي من الرفاهية في فندق و منتجع جراند استون - بونشاك  وغيرها' 
WHERE PackageId = N'pkg-اندونيسيا-fly-29-6-days';

DECLARE @PackId_pkg_اندونيسيا_fly_29_6_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_اندونيسيا_fly_29_6_days = Id FROM Packages WHERE PackageId = N'pkg-اندونيسيا-fly-29-6-days';
IF @PackId_pkg_اندونيسيا_fly_29_6_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_اندونيسيا_fly_29_6_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_اندونيسيا_fly_29_6_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_اندونيسيا_fly_29_6_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_6_days, N'فندق و منتجع جراند استون - بونشاك ', N'', 4, 5, N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_6_days, N'مارلين بارك هوتيل جاكرتا - جاكرتا ', N'', 4, 5, N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop', 1);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_6_days, 1, N'اليوم 1', N'استقبال دولي في مطار جاكرتا والتوصيل المريح والآمن إلى فندق الإقامة في بونشاك لتسجيل الدخول والراحة.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_6_days, 2, N'اليوم 2', N'جولة رائعة لاستكشاف أهم المعالم السياحية في بونشاك، تتضمن زيارة حديقة الزهور، حديقة تشيبوادس، بحيرة فينيسيا، الاستمتاع بتجربة البارشوت، وزيارة حديقة مرليبا ومزارع الشاي الخضراء.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_6_days, 3, N'اليوم 3', N'تسجيل الخروج والانتقال البري المريح بسيارة وسائق خاص من طبيعة بونشاك الخلابة إلى العاصمة جاكرتا.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_6_days, 4, N'اليوم 4', N'جولة سياحية ممتعة في جاكرتا لزيارة برج موناس الشهير، وقضاء وقت ترفيهي في متنزه أنشول لمشاهدة عروض الدلافين المذهلة وزيارة عالم ما تحت البحار.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_6_days, 5, N'اليوم 5', N'يوم حر بالكامل مخصص للراحة والاستجمام أو لاكتشاف المدينة بحرية (بدون سائق).', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_6_days, 6, N'اليوم 6', N'نهاية الرحلة الممتعة، حيث يتم التوديع والتوصيل إلى المطار في العاصمة جاكرتا للعودة إلى الديار بسلامة الله.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_6_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 4650, 
    TitleEn = N'Amazing اندونيسيا FLY 29 7 Days Package', 
    Subtitle = N'استمتع بـ 6 ليالي من الرفاهية في أفضل فنادق اندونيسيا FLY 29' 
WHERE PackageId = N'pkg-اندونيسيا-fly-29-7-days';

DECLARE @PackId_pkg_اندونيسيا_fly_29_7_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_اندونيسيا_fly_29_7_days = Id FROM Packages WHERE PackageId = N'pkg-اندونيسيا-fly-29-7-days';
IF @PackId_pkg_اندونيسيا_fly_29_7_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_اندونيسيا_fly_29_7_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_اندونيسيا_fly_29_7_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_اندونيسيا_fly_29_7_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_7_days, N'فندق الملحم الفاخر - اندونيسيا FLY 29', N'', 5, 6, N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_7_days, 1, N'اليوم 1', N'وصف تفصيلي لجولات اليوم رقم 1 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_7_days, 2, N'اليوم 2', N'وصف تفصيلي لجولات اليوم رقم 2 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_7_days, 3, N'اليوم 3', N'وصف تفصيلي لجولات اليوم رقم 3 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_7_days, 4, N'اليوم 4', N'وصف تفصيلي لجولات اليوم رقم 4 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_7_days, 5, N'اليوم 5', N'وصف تفصيلي لجولات اليوم رقم 5 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_7_days, 6, N'اليوم 6', N'وصف تفصيلي لجولات اليوم رقم 6 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_7_days, 7, N'اليوم 7', N'وصف تفصيلي لجولات اليوم رقم 7 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_7_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 5100, 
    TitleEn = N'Amazing اندونيسيا FLY 29 8 Days Package', 
    Subtitle = N'استمتع بـ 7 ليالي من الرفاهية في أفضل فنادق اندونيسيا FLY 29' 
WHERE PackageId = N'pkg-اندونيسيا-fly-29-8-days';

DECLARE @PackId_pkg_اندونيسيا_fly_29_8_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_اندونيسيا_fly_29_8_days = Id FROM Packages WHERE PackageId = N'pkg-اندونيسيا-fly-29-8-days';
IF @PackId_pkg_اندونيسيا_fly_29_8_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_اندونيسيا_fly_29_8_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_اندونيسيا_fly_29_8_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_اندونيسيا_fly_29_8_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_8_days, N'فندق الملحم الفاخر - اندونيسيا FLY 29', N'', 5, 7, N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_8_days, 1, N'اليوم 1', N'وصف تفصيلي لجولات اليوم رقم 1 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_8_days, 2, N'اليوم 2', N'وصف تفصيلي لجولات اليوم رقم 2 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_8_days, 3, N'اليوم 3', N'وصف تفصيلي لجولات اليوم رقم 3 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_8_days, 4, N'اليوم 4', N'وصف تفصيلي لجولات اليوم رقم 4 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_8_days, 5, N'اليوم 5', N'وصف تفصيلي لجولات اليوم رقم 5 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_8_days, 6, N'اليوم 6', N'وصف تفصيلي لجولات اليوم رقم 6 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_8_days, 7, N'اليوم 7', N'وصف تفصيلي لجولات اليوم رقم 7 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_8_days, 8, N'اليوم 8', N'وصف تفصيلي لجولات اليوم رقم 8 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_8_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 5550, 
    TitleEn = N'Amazing اندونيسيا FLY 29 9 Days Package', 
    Subtitle = N'استمتع بـ 8 ليالي من الرفاهية في أفضل فنادق اندونيسيا FLY 29' 
WHERE PackageId = N'pkg-اندونيسيا-fly-29-9-days';

DECLARE @PackId_pkg_اندونيسيا_fly_29_9_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_اندونيسيا_fly_29_9_days = Id FROM Packages WHERE PackageId = N'pkg-اندونيسيا-fly-29-9-days';
IF @PackId_pkg_اندونيسيا_fly_29_9_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_اندونيسيا_fly_29_9_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_اندونيسيا_fly_29_9_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_اندونيسيا_fly_29_9_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_9_days, N'فندق الملحم الفاخر - اندونيسيا FLY 29', N'', 5, 8, N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_9_days, 1, N'اليوم 1', N'وصف تفصيلي لجولات اليوم رقم 1 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_9_days, 2, N'اليوم 2', N'وصف تفصيلي لجولات اليوم رقم 2 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_9_days, 3, N'اليوم 3', N'وصف تفصيلي لجولات اليوم رقم 3 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_9_days, 4, N'اليوم 4', N'وصف تفصيلي لجولات اليوم رقم 4 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_9_days, 5, N'اليوم 5', N'وصف تفصيلي لجولات اليوم رقم 5 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_9_days, 6, N'اليوم 6', N'وصف تفصيلي لجولات اليوم رقم 6 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_9_days, 7, N'اليوم 7', N'وصف تفصيلي لجولات اليوم رقم 7 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_9_days, 8, N'اليوم 8', N'وصف تفصيلي لجولات اليوم رقم 8 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_9_days, 9, N'اليوم 9', N'وصف تفصيلي لجولات اليوم رقم 9 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_9_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 3750, 
    TitleEn = N'Amazing اندونيسيا FLY 29 5 Days Package', 
    Subtitle = N'استمتع بـ 4 ليالي من الرفاهية في أفضل فنادق اندونيسيا FLY 29' 
WHERE PackageId = N'pkg-اندونيسيا-fly-29-5-days';

DECLARE @PackId_pkg_اندونيسيا_fly_29_5_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_اندونيسيا_fly_29_5_days = Id FROM Packages WHERE PackageId = N'pkg-اندونيسيا-fly-29-5-days';
IF @PackId_pkg_اندونيسيا_fly_29_5_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_اندونيسيا_fly_29_5_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_اندونيسيا_fly_29_5_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_اندونيسيا_fly_29_5_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_5_days, N'فندق الملحم الفاخر - اندونيسيا FLY 29', N'', 5, 4, N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_5_days, 1, N'اليوم 1', N'وصف تفصيلي لجولات اليوم رقم 1 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_5_days, 2, N'اليوم 2', N'وصف تفصيلي لجولات اليوم رقم 2 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_5_days, 3, N'اليوم 3', N'وصف تفصيلي لجولات اليوم رقم 3 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_5_days, 4, N'اليوم 4', N'وصف تفصيلي لجولات اليوم رقم 4 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_5_days, 5, N'اليوم 5', N'وصف تفصيلي لجولات اليوم رقم 5 في اندونيسيا FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1553603227-234f60d081cd?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_اندونيسيا_fly_29_5_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 4700, 
    TitleEn = N'Amazing بوكيت 10 Days Deal', 
    Subtitle = N'استمتع بـ 9 ليالي من الرفاهية في منتجع دياموند بوكيت - جزيرة بوكيت وغيرها' 
WHERE PackageId = N'pkg-بانكوك-مع-بوكيت-2026-fly-29-10-days';

DECLARE @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_10_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_10_days = Id FROM Packages WHERE PackageId = N'pkg-بانكوك-مع-بوكيت-2026-fly-29-10-days';
IF @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_10_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_10_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_10_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_10_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_10_days, N'منتجع دياموند بوكيت - جزيرة بوكيت', N'', 4, 9, N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_10_days, 1, N'اليوم 1', N'الوصول بالسلامة إلى مطار بوكيت والانتقال المريح إلى المنتجع الفاخر لبدء الإجازة.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_10_days, 2, N'اليوم 2', N'جولة سياحية لمعالم بوكيت تتضمن خليج بان ناه، شلال بانغ باي، الحديقة المائية جنقل سبلاش، وعالم المحيط والنمور.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_10_days, 3, N'اليوم 3', N'جولة تشمل تمثال بوذا العملاق، بوكيت أكواريوم، حديقة الحيوانات، واستكشاف سحر المدينة القديمة.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_10_days, 4, N'اليوم 4', N'مغامرة بحرية متكاملة لجزر جيمس بوند والجزر الأربعة، مع زيارة كاتا بيتش وكهف الخفافيس.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_10_days, 5, N'اليوم 5', N'زيارة المدينة المائية الأفضل في بوكيت لقضاء أوقات عائلية مليئة بالمرح والألعاب المائية.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_10_days, 6, N'اليوم 6', N'يوم حر ومميز للاستمتاع بالطبيعة الساحرة والاسترخاء التام في جزيرة بوكيت.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_10_days, 7, N'اليوم 7', N'جولة تسوق ممتعة بسيارة خاصة لاستكشاف أفضل الأسواق واقتناء المشتريات المحلية.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_10_days, 8, N'اليوم 8', N'جولة سياحية خاصة لزيارة محمية الفيلة الطبيعية والاستمتاع بمشاهدة عروض القرود والأفاعي المشوقة.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_10_days, 9, N'اليوم 9', N'يوم حر للاستجمام والسباحة أو تجربة المطاعم المحلية في الجزيرة (بدون سائق).', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_10_days, 10, N'اليوم 10', N'ختام العطلة السعيدة والتوصيل من الفندق إلى مطار بوكيت لرحلة العودة بسلامة الله.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_10_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 5100, 
    TitleEn = N'Amazing بوكيت 11 Days Deal', 
    Subtitle = N'استمتع بـ 10 ليالي من الرفاهية في منتجع دياموند بوكيت - جزيرة بوكيت وغيرها' 
WHERE PackageId = N'pkg-بانكوك-مع-بوكيت-2026-fly-29-11-days';

DECLARE @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_11_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_11_days = Id FROM Packages WHERE PackageId = N'pkg-بانكوك-مع-بوكيت-2026-fly-29-11-days';
IF @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_11_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_11_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_11_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_11_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_11_days, N'منتجع دياموند بوكيت - جزيرة بوكيت', N'', 4, 10, N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_11_days, 1, N'اليوم 1', N'الاستقبال المميز في مطار بوكيت والتوصيل إلى فندق الإقامة للراحة والاستعداد للرحلة.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_11_days, 2, N'اليوم 2', N'جولة سياحية في بوكيت تشمل خليج بان ناه، الحديقة المائية، شلال بانغ باي، عالم المحيط وتل القرود.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_11_days, 3, N'اليوم 3', N'استكشاف تمثال بوذا العملاق، الأكواريوم المدهش، حديقة الحيوانات، والمدينة القديمة ذات الطابع الخاص.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_11_days, 4, N'اليوم 4', N'رحلة استكشافية بحرية لجزيرة جيمس بوند الرائعة والجزر الأربعة مع تجربة سفاري استثنائية.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_11_days, 5, N'اليوم 5', N'يوم ترفيهي مليء بالنشاط في المدينة المائية الكبرى والتي تحاكي في تصميمها 7 حضارات مختلفة.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_11_days, 6, N'اليوم 6', N'يوم حر للاستمتاع بالرمال الذهبية والأنشطة البحرية على شواطئ بوكيت.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_11_days, 7, N'اليوم 7', N'جولة تسوق حرة بسيارة وسائق خاص لاكتشاف أسواق بوكيت الرائعة.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_11_days, 8, N'اليوم 8', N'جولة ممتعة للتعرف على الحياة البرية من خلال زيارة محمية الفيلة ومشاهدة العروض الترفيهية.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_11_days, 9, N'اليوم 9', N'يوم المغامرات والتشويق عبر تجربة الزيبلاين (ركوب الحبل)، زيارة مصنع اللؤلؤ والفضة، وتجربة ركوب الخيل.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_11_days, 10, N'اليوم 10', N'يوم حر تماماً للاسترخاء في الجزيرة والاستمتاع بمرافق المنتجع (بدون سائق).', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_11_days, 11, N'اليوم 11', N'توديع بوكيت الساحرة والانتقال بالسيارة الخاصة إلى المطار للعودة إلى أرض الوطن.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_11_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 6900, 
    TitleEn = N'Amazing بانكوك مع بوكيت 2026 FLY 29 12 Days Package', 
    Subtitle = N'استمتع بـ 11 ليالي من الرفاهية في أفضل فنادق بانكوك مع بوكيت 2026 FLY 29' 
WHERE PackageId = N'pkg-بانكوك-مع-بوكيت-2026-fly-29-12-days';

DECLARE @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_12_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_12_days = Id FROM Packages WHERE PackageId = N'pkg-بانكوك-مع-بوكيت-2026-fly-29-12-days';
IF @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_12_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_12_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_12_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_12_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_12_days, N'فندق الملحم الفاخر - بانكوك مع بوكيت 2026 FLY 29', N'', 5, 11, N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_12_days, 1, N'اليوم 1', N'وصف تفصيلي لجولات اليوم رقم 1 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_12_days, 2, N'اليوم 2', N'وصف تفصيلي لجولات اليوم رقم 2 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_12_days, 3, N'اليوم 3', N'وصف تفصيلي لجولات اليوم رقم 3 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_12_days, 4, N'اليوم 4', N'وصف تفصيلي لجولات اليوم رقم 4 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_12_days, 5, N'اليوم 5', N'وصف تفصيلي لجولات اليوم رقم 5 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_12_days, 6, N'اليوم 6', N'وصف تفصيلي لجولات اليوم رقم 6 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_12_days, 7, N'اليوم 7', N'وصف تفصيلي لجولات اليوم رقم 7 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_12_days, 8, N'اليوم 8', N'وصف تفصيلي لجولات اليوم رقم 8 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_12_days, 9, N'اليوم 9', N'وصف تفصيلي لجولات اليوم رقم 9 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_12_days, 10, N'اليوم 10', N'وصف تفصيلي لجولات اليوم رقم 10 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_12_days, 11, N'اليوم 11', N'وصف تفصيلي لجولات اليوم رقم 11 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_12_days, 12, N'اليوم 12', N'وصف تفصيلي لجولات اليوم رقم 12 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_12_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 7350, 
    TitleEn = N'Amazing بانكوك مع بوكيت 2026 FLY 29 13 Days Package', 
    Subtitle = N'استمتع بـ 12 ليالي من الرفاهية في أفضل فنادق بانكوك مع بوكيت 2026 FLY 29' 
WHERE PackageId = N'pkg-بانكوك-مع-بوكيت-2026-fly-29-13-days';

DECLARE @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_13_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_13_days = Id FROM Packages WHERE PackageId = N'pkg-بانكوك-مع-بوكيت-2026-fly-29-13-days';
IF @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_13_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_13_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_13_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_13_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_13_days, N'فندق الملحم الفاخر - بانكوك مع بوكيت 2026 FLY 29', N'', 5, 12, N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_13_days, 1, N'اليوم 1', N'وصف تفصيلي لجولات اليوم رقم 1 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_13_days, 2, N'اليوم 2', N'وصف تفصيلي لجولات اليوم رقم 2 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_13_days, 3, N'اليوم 3', N'وصف تفصيلي لجولات اليوم رقم 3 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_13_days, 4, N'اليوم 4', N'وصف تفصيلي لجولات اليوم رقم 4 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_13_days, 5, N'اليوم 5', N'وصف تفصيلي لجولات اليوم رقم 5 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_13_days, 6, N'اليوم 6', N'وصف تفصيلي لجولات اليوم رقم 6 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_13_days, 7, N'اليوم 7', N'وصف تفصيلي لجولات اليوم رقم 7 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_13_days, 8, N'اليوم 8', N'وصف تفصيلي لجولات اليوم رقم 8 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_13_days, 9, N'اليوم 9', N'وصف تفصيلي لجولات اليوم رقم 9 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_13_days, 10, N'اليوم 10', N'وصف تفصيلي لجولات اليوم رقم 10 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_13_days, 11, N'اليوم 11', N'وصف تفصيلي لجولات اليوم رقم 11 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_13_days, 12, N'اليوم 12', N'وصف تفصيلي لجولات اليوم رقم 12 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_13_days, 13, N'اليوم 13', N'وصف تفصيلي لجولات اليوم رقم 13 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_13_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 7800, 
    TitleEn = N'Amazing بانكوك مع بوكيت 2026 FLY 29 14 Days Package', 
    Subtitle = N'استمتع بـ 13 ليالي من الرفاهية في أفضل فنادق بانكوك مع بوكيت 2026 FLY 29' 
WHERE PackageId = N'pkg-بانكوك-مع-بوكيت-2026-fly-29-14-days';

DECLARE @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_14_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_14_days = Id FROM Packages WHERE PackageId = N'pkg-بانكوك-مع-بوكيت-2026-fly-29-14-days';
IF @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_14_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_14_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_14_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_14_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_14_days, N'فندق الملحم الفاخر - بانكوك مع بوكيت 2026 FLY 29', N'', 5, 13, N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_14_days, 1, N'اليوم 1', N'وصف تفصيلي لجولات اليوم رقم 1 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_14_days, 2, N'اليوم 2', N'وصف تفصيلي لجولات اليوم رقم 2 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_14_days, 3, N'اليوم 3', N'وصف تفصيلي لجولات اليوم رقم 3 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_14_days, 4, N'اليوم 4', N'وصف تفصيلي لجولات اليوم رقم 4 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_14_days, 5, N'اليوم 5', N'وصف تفصيلي لجولات اليوم رقم 5 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_14_days, 6, N'اليوم 6', N'وصف تفصيلي لجولات اليوم رقم 6 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_14_days, 7, N'اليوم 7', N'وصف تفصيلي لجولات اليوم رقم 7 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_14_days, 8, N'اليوم 8', N'وصف تفصيلي لجولات اليوم رقم 8 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_14_days, 9, N'اليوم 9', N'وصف تفصيلي لجولات اليوم رقم 9 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_14_days, 10, N'اليوم 10', N'وصف تفصيلي لجولات اليوم رقم 10 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_14_days, 11, N'اليوم 11', N'وصف تفصيلي لجولات اليوم رقم 11 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_14_days, 12, N'اليوم 12', N'وصف تفصيلي لجولات اليوم رقم 12 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_14_days, 13, N'اليوم 13', N'وصف تفصيلي لجولات اليوم رقم 13 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_14_days, 14, N'اليوم 14', N'وصف تفصيلي لجولات اليوم رقم 14 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_14_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 3650, 
    TitleEn = N'Amazing بوكيت 8 Days Deal', 
    Subtitle = N'استمتع بـ 7 ليالي من الرفاهية في منتجع دياموند بوكيت - جزيرة بوكيت وغيرها' 
WHERE PackageId = N'pkg-بانكوك-مع-بوكيت-2026-fly-29-8-days';

DECLARE @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_8_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_8_days = Id FROM Packages WHERE PackageId = N'pkg-بانكوك-مع-بوكيت-2026-fly-29-8-days';
IF @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_8_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_8_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_8_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_8_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_8_days, N'منتجع دياموند بوكيت - جزيرة بوكيت', N'', 4, 7, N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_8_days, 1, N'اليوم 1', N'ترحيب حار في مطار بوكيت الدولي والانتقال بكل راحة إلى المنتجع لتسجيل الدخول.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_8_days, 2, N'اليوم 2', N'بدء المغامرات بجولة لخليج بان ناه، الحديقة المائية، شلال بانغ باي، عالم المحيط، ومملكة النمور.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_8_days, 3, N'اليوم 3', N'جولة ثقافية وترفيهية تشمل تمثال بوذا العملاق، الأكواريوم المائي، حديقة الحيوانات، والمدينة القديمة التراثية.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_8_days, 4, N'اليوم 4', N'قضاء يوم كامل في رحلة بحرية إلى جزيرة جيمس بوند، الجزر الأربعة، الاستمتاع بكاتا بيتش، وتجربة السفاري.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_8_days, 5, N'اليوم 5', N'يوم من المرح والإثارة في المدينة المائية الكبرى ببوكيت ذات التصميم العالمي المستوحى من حضارات العالم.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_8_days, 6, N'اليوم 6', N'جولة تسوق خاصة بالسيارة لزيارة أشهر أسواق بوكيت واقتناء أروع الهدايا التذكارية.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_8_days, 7, N'اليوم 7', N'يوم حر مخصص للاسترخاء على الشواطئ والاستمتاع بالمرافق الفندقية الفاخرة (بدون سائق).', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_8_days, 8, N'اليوم 8', N'نهاية الرحلة الممتعة، التوديع والتوصيل إلى المطار متمنين لكم رحلة عودة آمنة.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_8_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 5550, 
    TitleEn = N'Amazing بانكوك مع بوكيت 2026 FLY 29 9 Days Package', 
    Subtitle = N'استمتع بـ 8 ليالي من الرفاهية في أفضل فنادق بانكوك مع بوكيت 2026 FLY 29' 
WHERE PackageId = N'pkg-بانكوك-مع-بوكيت-2026-fly-29-9-days';

DECLARE @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_9_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_9_days = Id FROM Packages WHERE PackageId = N'pkg-بانكوك-مع-بوكيت-2026-fly-29-9-days';
IF @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_9_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_9_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_9_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_9_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_9_days, N'فندق الملحم الفاخر - بانكوك مع بوكيت 2026 FLY 29', N'', 5, 8, N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_9_days, 1, N'اليوم 1', N'وصف تفصيلي لجولات اليوم رقم 1 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_9_days, 2, N'اليوم 2', N'وصف تفصيلي لجولات اليوم رقم 2 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_9_days, 3, N'اليوم 3', N'وصف تفصيلي لجولات اليوم رقم 3 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_9_days, 4, N'اليوم 4', N'وصف تفصيلي لجولات اليوم رقم 4 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_9_days, 5, N'اليوم 5', N'وصف تفصيلي لجولات اليوم رقم 5 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_9_days, 6, N'اليوم 6', N'وصف تفصيلي لجولات اليوم رقم 6 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_9_days, 7, N'اليوم 7', N'وصف تفصيلي لجولات اليوم رقم 7 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_9_days, 8, N'اليوم 8', N'وصف تفصيلي لجولات اليوم رقم 8 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_9_days, 9, N'اليوم 9', N'وصف تفصيلي لجولات اليوم رقم 9 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_9_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 2800, 
    TitleEn = N'Amazing بوكيت 6 Days Deal', 
    Subtitle = N'استمتع بـ 5 ليالي من الرفاهية في منتجع دياموند بوكيت - جزيرة بوكيت وغيرها' 
WHERE PackageId = N'pkg-بانكوك-مع-بوكيت-2026-fly-29-6-days';

DECLARE @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_6_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_6_days = Id FROM Packages WHERE PackageId = N'pkg-بانكوك-مع-بوكيت-2026-fly-29-6-days';
IF @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_6_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_6_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_6_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_6_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_6_days, N'منتجع دياموند بوكيت - جزيرة بوكيت', N'', 4, 5, N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_6_days, 1, N'اليوم 1', N'الاستقبال والترحيب في مطار جزيرة بوكيت، والانتقال المريح بسيارة خاصة وسائق إلى الفندق لتسجيل الدخول والراحة.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_6_days, 2, N'اليوم 2', N'جولة سياحية لاكتشاف أهم معالم بوكيت تشمل خليج بان ناه، شلال بانغ باي، الحديقة المائية جنقل سبلاش، معبد وات تشالونج، بالإضافة إلى حديقة سيرينات الوطنية، عالم المحيط، ومملكة النمور.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_6_days, 3, N'اليوم 3', N'استكمال الجولات الممتعة بزيارة تمثال بوذا العملاق، مملكة النمور في بوكيت، الأكواريوم المائي، حديقة الحيوانات، والمدينة القديمة ذات الطابع التاريخي.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_6_days, 4, N'اليوم 4', N'رحلة بحرية خيالية ليوم كامل إلى منطقة فاتح نجا وجزيرة جيمس بوند، تتضمن زيارة الجزر الأربعة، الاستمتاع بشاطئ كاتا بيتش، استكشاف كهف الخفافيس، وقضاء وقت ممتع في رحلة سفاري.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_6_days, 5, N'اليوم 5', N'يوم حر مخصص للراحة والاستجمام التام في الفندق، أو لاستكشاف الشواطئ المحيطة بحرية (بدون سائق).', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_6_days, 6, N'اليوم 6', N'ختام الرحلة الجميلة بتوديع جزيرة بوكيت والانتقال من الفندق إلى المطار بسيارة خاصة لرحلة العودة بسلامة الله.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_6_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 3400, 
    TitleEn = N'Amazing بوكيت 7 Days Deal', 
    Subtitle = N'استمتع بـ 6 ليالي من الرفاهية في منتجع دياموند بوكيت - جزيرة بوكيت وغيرها' 
WHERE PackageId = N'pkg-بانكوك-مع-بوكيت-2026-fly-29-7-days';

DECLARE @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_7_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_7_days = Id FROM Packages WHERE PackageId = N'pkg-بانكوك-مع-بوكيت-2026-fly-29-7-days';
IF @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_7_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_7_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_7_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_7_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_7_days, N'منتجع دياموند بوكيت - جزيرة بوكيت', N'', 4, 6, N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_7_days, 1, N'اليوم 1', N'الاستقبال في مطار جزيرة بوكيت والتوصيل بسيارة خاصة وسائق إلى فندق الإقامة لبدء عطلتكم الاستوائية.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_7_days, 2, N'اليوم 2', N'جولة سياحية مذهلة لزيارة خليج بان ناه، شلال بانغ باي، الحديقة المائية جنقل سبلاش، معبد وات تشالونج، وعالم المحيط ومملكة النمور.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_7_days, 3, N'اليوم 3', N'جولة لاستكشاف تمثال بوذا العملاق، مملكة النمور، بوكيت أكواريوم، حديقة الحيوانات، والتجول في المدينة القديمة.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_7_days, 4, N'اليوم 4', N'رحلة بحرية لا تُنسى لجزيرة جيمس بوند وفاتح نجا، مع زيارة الجزر الأربعة، شاطئ كاتا بيتش، وكهف الخفافيس ورحلة السفاري الممتعة.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_7_days, 5, N'اليوم 5', N'يوم ترفيهي عائلي بامتياز في المدينة المائية الأكبر في بوكيت، والمصممة لتعكس 7 حضارات عالمية، حيث المسابح والألعاب المائية الرائعة.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_7_days, 6, N'اليوم 6', N'يوم حر للاسترخاء التام في مرافق الفندق أو للاستمتاع برمال شواطئ بوكيت الذهبية (بدون سائق).', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_7_days, 7, N'اليوم 7', N'توديع جزيرة بوكيت الساحرة، والتوصيل المريح من الفندق إلى المطار للعودة إلى الديار بسلامة الله.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_7_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 3750, 
    TitleEn = N'Amazing بانكوك مع بوكيت 2026 FLY 29 5 Days Package', 
    Subtitle = N'استمتع بـ 4 ليالي من الرفاهية في أفضل فنادق بانكوك مع بوكيت 2026 FLY 29' 
WHERE PackageId = N'pkg-بانكوك-مع-بوكيت-2026-fly-29-5-days';

DECLARE @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_5_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_5_days = Id FROM Packages WHERE PackageId = N'pkg-بانكوك-مع-بوكيت-2026-fly-29-5-days';
IF @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_5_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_5_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_5_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_5_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_5_days, N'فندق الملحم الفاخر - بانكوك مع بوكيت 2026 FLY 29', N'', 5, 4, N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_5_days, 1, N'اليوم 1', N'وصف تفصيلي لجولات اليوم رقم 1 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_5_days, 2, N'اليوم 2', N'وصف تفصيلي لجولات اليوم رقم 2 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_5_days, 3, N'اليوم 3', N'وصف تفصيلي لجولات اليوم رقم 3 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_5_days, 4, N'اليوم 4', N'وصف تفصيلي لجولات اليوم رقم 4 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_5_days, 5, N'اليوم 5', N'وصف تفصيلي لجولات اليوم رقم 5 في بانكوك مع بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1583491470869-d9fe3d25fe39?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_بانكوك_مع_بوكيت_2026_fly_29_5_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 4700, 
    TitleEn = N'Amazing بوكيت 10 Days Deal', 
    Subtitle = N'استمتع بـ 9 ليالي من الرفاهية في منتجع دياموند بوكيت - جزيرة بوكيت وغيرها' 
WHERE PackageId = N'pkg-بوكيت-2026-fly-29-10-days';

DECLARE @PackId_pkg_بوكيت_2026_fly_29_10_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_بوكيت_2026_fly_29_10_days = Id FROM Packages WHERE PackageId = N'pkg-بوكيت-2026-fly-29-10-days';
IF @PackId_pkg_بوكيت_2026_fly_29_10_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_بوكيت_2026_fly_29_10_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_بوكيت_2026_fly_29_10_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_بوكيت_2026_fly_29_10_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_بوكيت_2026_fly_29_10_days, N'منتجع دياموند بوكيت - جزيرة بوكيت', N'', 4, 9, N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بوكيت_2026_fly_29_10_days, 1, N'اليوم 1', N'الوصول بالسلامة إلى مطار بوكيت والانتقال المريح إلى المنتجع الفاخر لبدء الإجازة.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بوكيت_2026_fly_29_10_days, 2, N'اليوم 2', N'جولة سياحية لمعالم بوكيت تتضمن خليج بان ناه، شلال بانغ باي، الحديقة المائية جنقل سبلاش، وعالم المحيط والنمور.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بوكيت_2026_fly_29_10_days, 3, N'اليوم 3', N'جولة تشمل تمثال بوذا العملاق، بوكيت أكواريوم، حديقة الحيوانات، واستكشاف سحر المدينة القديمة.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بوكيت_2026_fly_29_10_days, 4, N'اليوم 4', N'مغامرة بحرية متكاملة لجزر جيمس بوند والجزر الأربعة، مع زيارة كاتا بيتش وكهف الخفافيس.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بوكيت_2026_fly_29_10_days, 5, N'اليوم 5', N'زيارة المدينة المائية الأفضل في بوكيت لقضاء أوقات عائلية مليئة بالمرح والألعاب المائية.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بوكيت_2026_fly_29_10_days, 6, N'اليوم 6', N'يوم حر ومميز للاستمتاع بالطبيعة الساحرة والاسترخاء التام في جزيرة بوكيت.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بوكيت_2026_fly_29_10_days, 7, N'اليوم 7', N'جولة تسوق ممتعة بسيارة خاصة لاستكشاف أفضل الأسواق واقتناء المشتريات المحلية.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بوكيت_2026_fly_29_10_days, 8, N'اليوم 8', N'جولة سياحية خاصة لزيارة محمية الفيلة الطبيعية والاستمتاع بمشاهدة عروض القرود والأفاعي المشوقة.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بوكيت_2026_fly_29_10_days, 9, N'اليوم 9', N'يوم حر للاستجمام والسباحة أو تجربة المطاعم المحلية في الجزيرة (بدون سائق).', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بوكيت_2026_fly_29_10_days, 10, N'اليوم 10', N'ختام العطلة السعيدة والتوصيل من الفندق إلى مطار بوكيت لرحلة العودة بسلامة الله.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_بوكيت_2026_fly_29_10_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 5100, 
    TitleEn = N'Amazing بوكيت 11 Days Deal', 
    Subtitle = N'استمتع بـ 10 ليالي من الرفاهية في منتجع دياموند بوكيت - جزيرة بوكيت وغيرها' 
WHERE PackageId = N'pkg-بوكيت-2026-fly-29-11-days';

DECLARE @PackId_pkg_بوكيت_2026_fly_29_11_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_بوكيت_2026_fly_29_11_days = Id FROM Packages WHERE PackageId = N'pkg-بوكيت-2026-fly-29-11-days';
IF @PackId_pkg_بوكيت_2026_fly_29_11_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_بوكيت_2026_fly_29_11_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_بوكيت_2026_fly_29_11_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_بوكيت_2026_fly_29_11_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_بوكيت_2026_fly_29_11_days, N'منتجع دياموند بوكيت - جزيرة بوكيت', N'', 4, 10, N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بوكيت_2026_fly_29_11_days, 1, N'اليوم 1', N'الاستقبال المميز في مطار بوكيت والتوصيل إلى فندق الإقامة للراحة والاستعداد للرحلة.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بوكيت_2026_fly_29_11_days, 2, N'اليوم 2', N'جولة سياحية في بوكيت تشمل خليج بان ناه، الحديقة المائية، شلال بانغ باي، عالم المحيط وتل القرود.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بوكيت_2026_fly_29_11_days, 3, N'اليوم 3', N'استكشاف تمثال بوذا العملاق، الأكواريوم المدهش، حديقة الحيوانات، والمدينة القديمة ذات الطابع الخاص.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بوكيت_2026_fly_29_11_days, 4, N'اليوم 4', N'رحلة استكشافية بحرية لجزيرة جيمس بوند الرائعة والجزر الأربعة مع تجربة سفاري استثنائية.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بوكيت_2026_fly_29_11_days, 5, N'اليوم 5', N'يوم ترفيهي مليء بالنشاط في المدينة المائية الكبرى والتي تحاكي في تصميمها 7 حضارات مختلفة.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بوكيت_2026_fly_29_11_days, 6, N'اليوم 6', N'يوم حر للاستمتاع بالرمال الذهبية والأنشطة البحرية على شواطئ بوكيت.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بوكيت_2026_fly_29_11_days, 7, N'اليوم 7', N'جولة تسوق حرة بسيارة وسائق خاص لاكتشاف أسواق بوكيت الرائعة.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بوكيت_2026_fly_29_11_days, 8, N'اليوم 8', N'جولة ممتعة للتعرف على الحياة البرية من خلال زيارة محمية الفيلة ومشاهدة العروض الترفيهية.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بوكيت_2026_fly_29_11_days, 9, N'اليوم 9', N'يوم المغامرات والتشويق عبر تجربة الزيبلاين (ركوب الحبل)، زيارة مصنع اللؤلؤ والفضة، وتجربة ركوب الخيل.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بوكيت_2026_fly_29_11_days, 10, N'اليوم 10', N'يوم حر تماماً للاسترخاء في الجزيرة والاستمتاع بمرافق المنتجع (بدون سائق).', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بوكيت_2026_fly_29_11_days, 11, N'اليوم 11', N'توديع بوكيت الساحرة والانتقال بالسيارة الخاصة إلى المطار للعودة إلى أرض الوطن.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_بوكيت_2026_fly_29_11_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 2800, 
    TitleEn = N'Amazing بوكيت 6 Days Deal', 
    Subtitle = N'استمتع بـ 5 ليالي من الرفاهية في منتجع دياموند بوكيت - جزيرة بوكيت وغيرها' 
WHERE PackageId = N'pkg-بوكيت-2026-fly-29-6-days';

DECLARE @PackId_pkg_بوكيت_2026_fly_29_6_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_بوكيت_2026_fly_29_6_days = Id FROM Packages WHERE PackageId = N'pkg-بوكيت-2026-fly-29-6-days';
IF @PackId_pkg_بوكيت_2026_fly_29_6_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_بوكيت_2026_fly_29_6_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_بوكيت_2026_fly_29_6_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_بوكيت_2026_fly_29_6_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_بوكيت_2026_fly_29_6_days, N'منتجع دياموند بوكيت - جزيرة بوكيت', N'', 4, 5, N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بوكيت_2026_fly_29_6_days, 1, N'اليوم 1', N'الاستقبال والترحيب في مطار جزيرة بوكيت، والانتقال المريح بسيارة خاصة وسائق إلى الفندق لتسجيل الدخول والراحة.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بوكيت_2026_fly_29_6_days, 2, N'اليوم 2', N'جولة سياحية لاكتشاف أهم معالم بوكيت تشمل خليج بان ناه، شلال بانغ باي، الحديقة المائية جنقل سبلاش، معبد وات تشالونج، بالإضافة إلى حديقة سيرينات الوطنية، عالم المحيط، ومملكة النمور.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بوكيت_2026_fly_29_6_days, 3, N'اليوم 3', N'استكمال الجولات الممتعة بزيارة تمثال بوذا العملاق، مملكة النمور في بوكيت، الأكواريوم المائي، حديقة الحيوانات، والمدينة القديمة ذات الطابع التاريخي.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بوكيت_2026_fly_29_6_days, 4, N'اليوم 4', N'رحلة بحرية خيالية ليوم كامل إلى منطقة فاتح نجا وجزيرة جيمس بوند، تتضمن زيارة الجزر الأربعة، الاستمتاع بشاطئ كاتا بيتش، استكشاف كهف الخفافيس، وقضاء وقت ممتع في رحلة سفاري.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بوكيت_2026_fly_29_6_days, 5, N'اليوم 5', N'يوم حر مخصص للراحة والاستجمام التام في الفندق، أو لاستكشاف الشواطئ المحيطة بحرية (بدون سائق).', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بوكيت_2026_fly_29_6_days, 6, N'اليوم 6', N'ختام الرحلة الجميلة بتوديع جزيرة بوكيت والانتقال من الفندق إلى المطار بسيارة خاصة لرحلة العودة بسلامة الله.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_بوكيت_2026_fly_29_6_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 3400, 
    TitleEn = N'Amazing بوكيت 7 Days Deal', 
    Subtitle = N'استمتع بـ 6 ليالي من الرفاهية في منتجع دياموند بوكيت - جزيرة بوكيت وغيرها' 
WHERE PackageId = N'pkg-بوكيت-2026-fly-29-7-days';

DECLARE @PackId_pkg_بوكيت_2026_fly_29_7_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_بوكيت_2026_fly_29_7_days = Id FROM Packages WHERE PackageId = N'pkg-بوكيت-2026-fly-29-7-days';
IF @PackId_pkg_بوكيت_2026_fly_29_7_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_بوكيت_2026_fly_29_7_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_بوكيت_2026_fly_29_7_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_بوكيت_2026_fly_29_7_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_بوكيت_2026_fly_29_7_days, N'منتجع دياموند بوكيت - جزيرة بوكيت', N'', 4, 6, N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بوكيت_2026_fly_29_7_days, 1, N'اليوم 1', N'الاستقبال في مطار جزيرة بوكيت والتوصيل بسيارة خاصة وسائق إلى فندق الإقامة لبدء عطلتكم الاستوائية.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بوكيت_2026_fly_29_7_days, 2, N'اليوم 2', N'جولة سياحية مذهلة لزيارة خليج بان ناه، شلال بانغ باي، الحديقة المائية جنقل سبلاش، معبد وات تشالونج، وعالم المحيط ومملكة النمور.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بوكيت_2026_fly_29_7_days, 3, N'اليوم 3', N'جولة لاستكشاف تمثال بوذا العملاق، مملكة النمور، بوكيت أكواريوم، حديقة الحيوانات، والتجول في المدينة القديمة.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بوكيت_2026_fly_29_7_days, 4, N'اليوم 4', N'رحلة بحرية لا تُنسى لجزيرة جيمس بوند وفاتح نجا، مع زيارة الجزر الأربعة، شاطئ كاتا بيتش، وكهف الخفافيس ورحلة السفاري الممتعة.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بوكيت_2026_fly_29_7_days, 5, N'اليوم 5', N'يوم ترفيهي عائلي بامتياز في المدينة المائية الأكبر في بوكيت، والمصممة لتعكس 7 حضارات عالمية، حيث المسابح والألعاب المائية الرائعة.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بوكيت_2026_fly_29_7_days, 6, N'اليوم 6', N'يوم حر للاسترخاء التام في مرافق الفندق أو للاستمتاع برمال شواطئ بوكيت الذهبية (بدون سائق).', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بوكيت_2026_fly_29_7_days, 7, N'اليوم 7', N'توديع جزيرة بوكيت الساحرة، والتوصيل المريح من الفندق إلى المطار للعودة إلى الديار بسلامة الله.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_بوكيت_2026_fly_29_7_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 3650, 
    TitleEn = N'Amazing بوكيت 8 Days Deal', 
    Subtitle = N'استمتع بـ 7 ليالي من الرفاهية في منتجع دياموند بوكيت - جزيرة بوكيت وغيرها' 
WHERE PackageId = N'pkg-بوكيت-2026-fly-29-8-days';

DECLARE @PackId_pkg_بوكيت_2026_fly_29_8_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_بوكيت_2026_fly_29_8_days = Id FROM Packages WHERE PackageId = N'pkg-بوكيت-2026-fly-29-8-days';
IF @PackId_pkg_بوكيت_2026_fly_29_8_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_بوكيت_2026_fly_29_8_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_بوكيت_2026_fly_29_8_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_بوكيت_2026_fly_29_8_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_بوكيت_2026_fly_29_8_days, N'منتجع دياموند بوكيت - جزيرة بوكيت', N'', 4, 7, N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بوكيت_2026_fly_29_8_days, 1, N'اليوم 1', N'ترحيب حار في مطار بوكيت الدولي والانتقال بكل راحة إلى المنتجع لتسجيل الدخول.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بوكيت_2026_fly_29_8_days, 2, N'اليوم 2', N'بدء المغامرات بجولة لخليج بان ناه، الحديقة المائية، شلال بانغ باي، عالم المحيط، ومملكة النمور.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بوكيت_2026_fly_29_8_days, 3, N'اليوم 3', N'جولة ثقافية وترفيهية تشمل تمثال بوذا العملاق، الأكواريوم المائي، حديقة الحيوانات، والمدينة القديمة التراثية.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بوكيت_2026_fly_29_8_days, 4, N'اليوم 4', N'قضاء يوم كامل في رحلة بحرية إلى جزيرة جيمس بوند، الجزر الأربعة، الاستمتاع بكاتا بيتش، وتجربة السفاري.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بوكيت_2026_fly_29_8_days, 5, N'اليوم 5', N'يوم من المرح والإثارة في المدينة المائية الكبرى ببوكيت ذات التصميم العالمي المستوحى من حضارات العالم.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بوكيت_2026_fly_29_8_days, 6, N'اليوم 6', N'جولة تسوق خاصة بالسيارة لزيارة أشهر أسواق بوكيت واقتناء أروع الهدايا التذكارية.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بوكيت_2026_fly_29_8_days, 7, N'اليوم 7', N'يوم حر مخصص للاسترخاء على الشواطئ والاستمتاع بالمرافق الفندقية الفاخرة (بدون سائق).', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بوكيت_2026_fly_29_8_days, 8, N'اليوم 8', N'نهاية الرحلة الممتعة، التوديع والتوصيل إلى المطار متمنين لكم رحلة عودة آمنة.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_بوكيت_2026_fly_29_8_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 3750, 
    TitleEn = N'Amazing بوكيت 2026 FLY 29 5 Days Package', 
    Subtitle = N'استمتع بـ 4 ليالي من الرفاهية في أفضل فنادق بوكيت 2026 FLY 29' 
WHERE PackageId = N'pkg-بوكيت-2026-fly-29-5-days';

DECLARE @PackId_pkg_بوكيت_2026_fly_29_5_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_بوكيت_2026_fly_29_5_days = Id FROM Packages WHERE PackageId = N'pkg-بوكيت-2026-fly-29-5-days';
IF @PackId_pkg_بوكيت_2026_fly_29_5_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_بوكيت_2026_fly_29_5_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_بوكيت_2026_fly_29_5_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_بوكيت_2026_fly_29_5_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_بوكيت_2026_fly_29_5_days, N'فندق الملحم الفاخر - بوكيت 2026 FLY 29', N'', 5, 4, N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بوكيت_2026_fly_29_5_days, 1, N'اليوم 1', N'وصف تفصيلي لجولات اليوم رقم 1 في بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بوكيت_2026_fly_29_5_days, 2, N'اليوم 2', N'وصف تفصيلي لجولات اليوم رقم 2 في بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بوكيت_2026_fly_29_5_days, 3, N'اليوم 3', N'وصف تفصيلي لجولات اليوم رقم 3 في بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بوكيت_2026_fly_29_5_days, 4, N'اليوم 4', N'وصف تفصيلي لجولات اليوم رقم 4 في بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_بوكيت_2026_fly_29_5_days, 5, N'اليوم 5', N'وصف تفصيلي لجولات اليوم رقم 5 في بوكيت 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_بوكيت_2026_fly_29_5_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 6000, 
    TitleEn = N'Amazing تركيا 2026 FLY 29 10 Days Package', 
    Subtitle = N'استمتع بـ 9 ليالي من الرفاهية في أفضل فنادق تركيا 2026 FLY 29' 
WHERE PackageId = N'pkg-تركيا-2026-fly-29-10-days';

DECLARE @PackId_pkg_تركيا_2026_fly_29_10_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_تركيا_2026_fly_29_10_days = Id FROM Packages WHERE PackageId = N'pkg-تركيا-2026-fly-29-10-days';
IF @PackId_pkg_تركيا_2026_fly_29_10_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_تركيا_2026_fly_29_10_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_تركيا_2026_fly_29_10_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_تركيا_2026_fly_29_10_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_10_days, N'فندق الملحم الفاخر - تركيا 2026 FLY 29', N'', 5, 9, N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_10_days, 1, N'اليوم 1', N'وصف تفصيلي لجولات اليوم رقم 1 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_10_days, 2, N'اليوم 2', N'وصف تفصيلي لجولات اليوم رقم 2 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_10_days, 3, N'اليوم 3', N'وصف تفصيلي لجولات اليوم رقم 3 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_10_days, 4, N'اليوم 4', N'وصف تفصيلي لجولات اليوم رقم 4 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_10_days, 5, N'اليوم 5', N'وصف تفصيلي لجولات اليوم رقم 5 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_10_days, 6, N'اليوم 6', N'وصف تفصيلي لجولات اليوم رقم 6 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_10_days, 7, N'اليوم 7', N'وصف تفصيلي لجولات اليوم رقم 7 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_10_days, 8, N'اليوم 8', N'وصف تفصيلي لجولات اليوم رقم 8 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_10_days, 9, N'اليوم 9', N'وصف تفصيلي لجولات اليوم رقم 9 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_10_days, 10, N'اليوم 10', N'وصف تفصيلي لجولات اليوم رقم 10 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_10_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 3750, 
    TitleEn = N'Amazing تركيا 2026 FLY 29 5 Days Package', 
    Subtitle = N'استمتع بـ 4 ليالي من الرفاهية في أفضل فنادق تركيا 2026 FLY 29' 
WHERE PackageId = N'pkg-تركيا-2026-fly-29-5-days';

DECLARE @PackId_pkg_تركيا_2026_fly_29_5_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_تركيا_2026_fly_29_5_days = Id FROM Packages WHERE PackageId = N'pkg-تركيا-2026-fly-29-5-days';
IF @PackId_pkg_تركيا_2026_fly_29_5_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_تركيا_2026_fly_29_5_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_تركيا_2026_fly_29_5_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_تركيا_2026_fly_29_5_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_5_days, N'فندق الملحم الفاخر - تركيا 2026 FLY 29', N'', 5, 4, N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_5_days, 1, N'اليوم 1', N'وصف تفصيلي لجولات اليوم رقم 1 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_5_days, 2, N'اليوم 2', N'وصف تفصيلي لجولات اليوم رقم 2 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_5_days, 3, N'اليوم 3', N'وصف تفصيلي لجولات اليوم رقم 3 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_5_days, 4, N'اليوم 4', N'وصف تفصيلي لجولات اليوم رقم 4 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_5_days, 5, N'اليوم 5', N'وصف تفصيلي لجولات اليوم رقم 5 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_5_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 4200, 
    TitleEn = N'Amazing تركيا 2026 FLY 29 6 Days Package', 
    Subtitle = N'استمتع بـ 5 ليالي من الرفاهية في أفضل فنادق تركيا 2026 FLY 29' 
WHERE PackageId = N'pkg-تركيا-2026-fly-29-6-days';

DECLARE @PackId_pkg_تركيا_2026_fly_29_6_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_تركيا_2026_fly_29_6_days = Id FROM Packages WHERE PackageId = N'pkg-تركيا-2026-fly-29-6-days';
IF @PackId_pkg_تركيا_2026_fly_29_6_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_تركيا_2026_fly_29_6_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_تركيا_2026_fly_29_6_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_تركيا_2026_fly_29_6_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_6_days, N'فندق الملحم الفاخر - تركيا 2026 FLY 29', N'', 5, 5, N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_6_days, 1, N'اليوم 1', N'وصف تفصيلي لجولات اليوم رقم 1 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_6_days, 2, N'اليوم 2', N'وصف تفصيلي لجولات اليوم رقم 2 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_6_days, 3, N'اليوم 3', N'وصف تفصيلي لجولات اليوم رقم 3 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_6_days, 4, N'اليوم 4', N'وصف تفصيلي لجولات اليوم رقم 4 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_6_days, 5, N'اليوم 5', N'وصف تفصيلي لجولات اليوم رقم 5 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_6_days, 6, N'اليوم 6', N'وصف تفصيلي لجولات اليوم رقم 6 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_6_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 4650, 
    TitleEn = N'Amazing تركيا 2026 FLY 29 7 Days Package', 
    Subtitle = N'استمتع بـ 6 ليالي من الرفاهية في أفضل فنادق تركيا 2026 FLY 29' 
WHERE PackageId = N'pkg-تركيا-2026-fly-29-7-days';

DECLARE @PackId_pkg_تركيا_2026_fly_29_7_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_تركيا_2026_fly_29_7_days = Id FROM Packages WHERE PackageId = N'pkg-تركيا-2026-fly-29-7-days';
IF @PackId_pkg_تركيا_2026_fly_29_7_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_تركيا_2026_fly_29_7_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_تركيا_2026_fly_29_7_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_تركيا_2026_fly_29_7_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_7_days, N'فندق الملحم الفاخر - تركيا 2026 FLY 29', N'', 5, 6, N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_7_days, 1, N'اليوم 1', N'وصف تفصيلي لجولات اليوم رقم 1 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_7_days, 2, N'اليوم 2', N'وصف تفصيلي لجولات اليوم رقم 2 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_7_days, 3, N'اليوم 3', N'وصف تفصيلي لجولات اليوم رقم 3 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_7_days, 4, N'اليوم 4', N'وصف تفصيلي لجولات اليوم رقم 4 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_7_days, 5, N'اليوم 5', N'وصف تفصيلي لجولات اليوم رقم 5 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_7_days, 6, N'اليوم 6', N'وصف تفصيلي لجولات اليوم رقم 6 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_7_days, 7, N'اليوم 7', N'وصف تفصيلي لجولات اليوم رقم 7 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_7_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 5100, 
    TitleEn = N'Amazing تركيا 2026 FLY 29 8 Days Package', 
    Subtitle = N'استمتع بـ 7 ليالي من الرفاهية في أفضل فنادق تركيا 2026 FLY 29' 
WHERE PackageId = N'pkg-تركيا-2026-fly-29-8-days';

DECLARE @PackId_pkg_تركيا_2026_fly_29_8_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_تركيا_2026_fly_29_8_days = Id FROM Packages WHERE PackageId = N'pkg-تركيا-2026-fly-29-8-days';
IF @PackId_pkg_تركيا_2026_fly_29_8_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_تركيا_2026_fly_29_8_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_تركيا_2026_fly_29_8_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_تركيا_2026_fly_29_8_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_8_days, N'فندق الملحم الفاخر - تركيا 2026 FLY 29', N'', 5, 7, N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_8_days, 1, N'اليوم 1', N'وصف تفصيلي لجولات اليوم رقم 1 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_8_days, 2, N'اليوم 2', N'وصف تفصيلي لجولات اليوم رقم 2 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_8_days, 3, N'اليوم 3', N'وصف تفصيلي لجولات اليوم رقم 3 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_8_days, 4, N'اليوم 4', N'وصف تفصيلي لجولات اليوم رقم 4 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_8_days, 5, N'اليوم 5', N'وصف تفصيلي لجولات اليوم رقم 5 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_8_days, 6, N'اليوم 6', N'وصف تفصيلي لجولات اليوم رقم 6 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_8_days, 7, N'اليوم 7', N'وصف تفصيلي لجولات اليوم رقم 7 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_8_days, 8, N'اليوم 8', N'وصف تفصيلي لجولات اليوم رقم 8 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_8_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 5550, 
    TitleEn = N'Amazing تركيا 2026 FLY 29 9 Days Package', 
    Subtitle = N'استمتع بـ 8 ليالي من الرفاهية في أفضل فنادق تركيا 2026 FLY 29' 
WHERE PackageId = N'pkg-تركيا-2026-fly-29-9-days';

DECLARE @PackId_pkg_تركيا_2026_fly_29_9_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_تركيا_2026_fly_29_9_days = Id FROM Packages WHERE PackageId = N'pkg-تركيا-2026-fly-29-9-days';
IF @PackId_pkg_تركيا_2026_fly_29_9_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_تركيا_2026_fly_29_9_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_تركيا_2026_fly_29_9_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_تركيا_2026_fly_29_9_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_9_days, N'فندق الملحم الفاخر - تركيا 2026 FLY 29', N'', 5, 8, N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_9_days, 1, N'اليوم 1', N'وصف تفصيلي لجولات اليوم رقم 1 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_9_days, 2, N'اليوم 2', N'وصف تفصيلي لجولات اليوم رقم 2 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_9_days, 3, N'اليوم 3', N'وصف تفصيلي لجولات اليوم رقم 3 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_9_days, 4, N'اليوم 4', N'وصف تفصيلي لجولات اليوم رقم 4 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_9_days, 5, N'اليوم 5', N'وصف تفصيلي لجولات اليوم رقم 5 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_9_days, 6, N'اليوم 6', N'وصف تفصيلي لجولات اليوم رقم 6 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_9_days, 7, N'اليوم 7', N'وصف تفصيلي لجولات اليوم رقم 7 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_9_days, 8, N'اليوم 8', N'وصف تفصيلي لجولات اليوم رقم 8 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_9_days, 9, N'اليوم 9', N'وصف تفصيلي لجولات اليوم رقم 9 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_9_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 6900, 
    TitleEn = N'Amazing تركيا 2026 FLY 29 12 Days Package', 
    Subtitle = N'استمتع بـ 1 ليالي من الرفاهية في أفضل فنادق تركيا 2026 FLY 29' 
WHERE PackageId = N'pkg-تركيا-2026-fly-29-12-days';

DECLARE @PackId_pkg_تركيا_2026_fly_29_12_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_تركيا_2026_fly_29_12_days = Id FROM Packages WHERE PackageId = N'pkg-تركيا-2026-fly-29-12-days';
IF @PackId_pkg_تركيا_2026_fly_29_12_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_تركيا_2026_fly_29_12_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_تركيا_2026_fly_29_12_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_تركيا_2026_fly_29_12_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_12_days, N'فندق الملحم الفاخر - تركيا 2026 FLY 29', N'', 5, 1, N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_12_days, 1, N'اليوم 1', N'وصف تفصيلي لجولات اليوم رقم 1 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_12_days, 2, N'اليوم 2', N'وصف تفصيلي لجولات اليوم رقم 2 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_12_days, 3, N'اليوم 3', N'وصف تفصيلي لجولات اليوم رقم 3 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_12_days, 4, N'اليوم 4', N'وصف تفصيلي لجولات اليوم رقم 4 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_12_days, 5, N'اليوم 5', N'وصف تفصيلي لجولات اليوم رقم 5 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_12_days, 6, N'اليوم 6', N'وصف تفصيلي لجولات اليوم رقم 6 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_12_days, 7, N'اليوم 7', N'وصف تفصيلي لجولات اليوم رقم 7 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_12_days, 8, N'اليوم 8', N'وصف تفصيلي لجولات اليوم رقم 8 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_12_days, 9, N'اليوم 9', N'وصف تفصيلي لجولات اليوم رقم 9 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_12_days, 10, N'اليوم 10', N'وصف تفصيلي لجولات اليوم رقم 10 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_12_days, 11, N'اليوم 11', N'وصف تفصيلي لجولات اليوم رقم 11 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_12_days, 12, N'اليوم 12', N'وصف تفصيلي لجولات اليوم رقم 12 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_12_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 6900, 
    TitleEn = N'Amazing تركيا 2026 FLY 29 12 Days Package', 
    Subtitle = N'استمتع بـ 11 ليالي من الرفاهية في أفضل فنادق تركيا 2026 FLY 29' 
WHERE PackageId = N'pkg-تركيا-2026-fly-29-12-days';

DECLARE @PackId_pkg_تركيا_2026_fly_29_12_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_تركيا_2026_fly_29_12_days = Id FROM Packages WHERE PackageId = N'pkg-تركيا-2026-fly-29-12-days';
IF @PackId_pkg_تركيا_2026_fly_29_12_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_تركيا_2026_fly_29_12_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_تركيا_2026_fly_29_12_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_تركيا_2026_fly_29_12_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_12_days, N'فندق الملحم الفاخر - تركيا 2026 FLY 29', N'', 5, 11, N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_12_days, 1, N'اليوم 1', N'وصف تفصيلي لجولات اليوم رقم 1 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_12_days, 2, N'اليوم 2', N'وصف تفصيلي لجولات اليوم رقم 2 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_12_days, 3, N'اليوم 3', N'وصف تفصيلي لجولات اليوم رقم 3 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_12_days, 4, N'اليوم 4', N'وصف تفصيلي لجولات اليوم رقم 4 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_12_days, 5, N'اليوم 5', N'وصف تفصيلي لجولات اليوم رقم 5 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_12_days, 6, N'اليوم 6', N'وصف تفصيلي لجولات اليوم رقم 6 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_12_days, 7, N'اليوم 7', N'وصف تفصيلي لجولات اليوم رقم 7 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_12_days, 8, N'اليوم 8', N'وصف تفصيلي لجولات اليوم رقم 8 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_12_days, 9, N'اليوم 9', N'وصف تفصيلي لجولات اليوم رقم 9 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_12_days, 10, N'اليوم 10', N'وصف تفصيلي لجولات اليوم رقم 10 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_12_days, 11, N'اليوم 11', N'وصف تفصيلي لجولات اليوم رقم 11 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_12_days, 12, N'اليوم 12', N'وصف تفصيلي لجولات اليوم رقم 12 في تركيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_تركيا_2026_fly_29_12_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 3750, 
    TitleEn = N'Amazing روسيا قديم 5 Days Package', 
    Subtitle = N'استمتع بـ 4 ليالي من الرفاهية في أفضل فنادق روسيا قديم' 
WHERE PackageId = N'pkg-روسيا-قديم-5-days';

DECLARE @PackId_pkg_روسيا_قديم_5_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_روسيا_قديم_5_days = Id FROM Packages WHERE PackageId = N'pkg-روسيا-قديم-5-days';
IF @PackId_pkg_روسيا_قديم_5_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_روسيا_قديم_5_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_روسيا_قديم_5_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_روسيا_قديم_5_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_5_days, N'فندق الملحم الفاخر - روسيا قديم', N'', 5, 4, N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_5_days, 1, N'اليوم 1', N'وصف تفصيلي لجولات اليوم رقم 1 في روسيا قديم. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_5_days, 2, N'اليوم 2', N'وصف تفصيلي لجولات اليوم رقم 2 في روسيا قديم. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_5_days, 3, N'اليوم 3', N'وصف تفصيلي لجولات اليوم رقم 3 في روسيا قديم. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_5_days, 4, N'اليوم 4', N'وصف تفصيلي لجولات اليوم رقم 4 في روسيا قديم. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_5_days, 5, N'اليوم 5', N'وصف تفصيلي لجولات اليوم رقم 5 في روسيا قديم. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_5_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 10350, 
    TitleEn = N'Amazing روسيا 10 Days Deal', 
    Subtitle = N'استمتع بـ 9 ليالي من الرفاهية في فندق بينتا موسكو اربات - موسكو وغيرها' 
WHERE PackageId = N'pkg-روسيا-قديم-10-days';

DECLARE @PackId_pkg_روسيا_قديم_10_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_روسيا_قديم_10_days = Id FROM Packages WHERE PackageId = N'pkg-روسيا-قديم-10-days';
IF @PackId_pkg_روسيا_قديم_10_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_روسيا_قديم_10_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_روسيا_قديم_10_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_روسيا_قديم_10_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_10_days, N'فندق بينتا موسكو اربات - موسكو', N'', 4, 9, N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_10_days, 1, N'اليوم 1', N'الاستقبال والترحيب في المطار الدولي في موسكو، والتوصيل المباشر والمريح إلى الفندق لتسجيل الدخول والراحة.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_10_days, 2, N'اليوم 2', N'الانطلاق في جولة ممتعة لزيارة الكرملين إزميلوفو، والذي يعتبر أهم مجمع ثقافي وترفيهي لمشاهدة المعارض والمهرجانات، وزيارة سوق الهدايا التذكارية. ثم التوجه لزيارة حديقة فادنخا واستكشاف المتحف التاريخي، تليها زيارة لأشهر المولات الأوروبية للتسوق.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_10_days, 3, N'اليوم 3', N'جولة استكشافية لمعالم موسكو تشمل زيارة برج كوتافيا لدخول الكرملين، وعمل جولة حول الساحة الحمراء، حديقة الكسندر، كاتدرائية قازان، ضريح لينين، وحديقة زاريادي. بعدها ننتقل إلى ساحة سمولينسكايا للتجول في شارع أربات العريق، ونختتم اليوم بحضور أروع العروض العالمية في سيرك موسكو الشهير.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_10_days, 4, N'اليوم 4', N'رحلة مميزة لزيارة تلال سبارو وركوب التلفريك فوق نهر موسكو للاستمتاع بأجمل المناظر لالتقاط الصور. ثم التوجه لزيارة الداون تاون ومول أفيمال، ونختتم اليوم برحلة كروز ساحرة في نهر موسكو للاستمتاع بجمال الطبيعة والمباني التاريخية.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_10_days, 5, N'اليوم 5', N'يوم حر مخصص للاسترخاء التام في الفندق، أو الانطلاق في جولة حرة لاستكشاف شوارع وأسواق المدينة على طريقتك الخاصة (بدون سائق).', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_10_days, 6, N'اليوم 6', N'يوم مليء بالمرح والتشويق في مدينة الأحلام (دريم لاند)، أكبر مدينة ترفيهية في موسكو والمناسبة لجميع الأعمار، حيث نقضي يوماً كاملاً في الاستمتاع بالألعاب والفعاليات المذهلة.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_10_days, 7, N'اليوم 7', N'مغامرة استثنائية لتجربة عربة كلاب الهاسكي الشهيرة، وركوب الخيل، والاستمتاع بقيادة الدراجات الرباعية وسط الطبيعة الخلابة، تليها جولة استكشافية في قصر تساريتسنو التاريخي.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_10_days, 8, N'اليوم 8', N'زيارة رائعة إلى القرية الهولندية للتعرف على الطابع الأوروبي الفريد والتقاط أجمل الصور التذكارية. ثم التوجه لزيارة مركز موسكو التجاري الجديد للاستمتاع بالتسوق في أفخم المولات.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_10_days, 9, N'اليوم 9', N'يوم حر مخصص للاسترخاء التام في الفندق، أو الانطلاق في جولة حرة لاستكشاف شوارع وأسواق المدينة على طريقتك الخاصة (بدون سائق).', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_10_days, 10, N'اليوم 10', N'ختام الرحلة الجميلة وتوديع روسيا، حيث يتم التوصيل من مكان الإقامة في موسكو إلى المطار الدولي للعودة بسلامة الله إلى أرض الوطن.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_10_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 13150, 
    TitleEn = N'Amazing روسيا 11 Days Deal', 
    Subtitle = N'استمتع بـ 10 ليالي من الرفاهية في فندق بينتا موسكو اربات - موسكو وغيرها' 
WHERE PackageId = N'pkg-روسيا-قديم-11-days';

DECLARE @PackId_pkg_روسيا_قديم_11_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_روسيا_قديم_11_days = Id FROM Packages WHERE PackageId = N'pkg-روسيا-قديم-11-days';
IF @PackId_pkg_روسيا_قديم_11_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_روسيا_قديم_11_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_روسيا_قديم_11_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_روسيا_قديم_11_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_11_days, N'فندق بينتا موسكو اربات - موسكو', N'', 4, 10, N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_11_days, N'نوفوتيل سانت بترسبرج - سانت بطرسبرغ', N'', 4, 10, N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', 1);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_11_days, 1, N'اليوم 1', N'الاستقبال والترحيب في المطار الدولي في موسكو، والتوصيل المباشر والمريح إلى الفندق لتسجيل الدخول والراحة.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_11_days, 2, N'اليوم 2', N'الانطلاق في جولة ممتعة لزيارة الكرملين إزميلوفو، والذي يعتبر أهم مجمع ثقافي وترفيهي لمشاهدة المعارض والمهرجانات، وزيارة سوق الهدايا التذكارية. ثم التوجه لزيارة حديقة فادنخا واستكشاف المتحف التاريخي، تليها زيارة لأشهر المولات الأوروبية للتسوق.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_11_days, 3, N'اليوم 3', N'يوم حر مخصص للاسترخاء التام في الفندق، أو الانطلاق في جولة حرة لاستكشاف شوارع وأسواق المدينة على طريقتك الخاصة (بدون سائق).', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_11_days, 4, N'اليوم 4', N'تسجيل الخروج من الفندق في موسكو والانتقال المريح إلى محطة القطار للتوجه إلى سانت بطرسبرغ، وعند الوصول يتم الاستقبال والتوصيل إلى الفندق المحجوز.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_11_days, 5, N'اليوم 5', N'جولة سياحية لاستكشاف سحر سانت بطرسبرغ، تشمل قلعة بطرس وبولس، شارع نيفسكي بروسبكت، كاتدرائية سمولني، وساحة القصر. ثم التوجه لزيارة قصر بيترهوف للاستمتاع بالحديقة السفلى والشلالات والمتحف الوطني.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_11_days, 6, N'اليوم 6', N'تسجيل الخروج والانتقال من سانت بطرسبرغ إلى محطة القطار للعودة إلى العاصمة موسكو، وعند الوصول يتم الاستقبال والتوصيل المباشر إلى الفندق.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_11_days, 7, N'اليوم 7', N'جولة استكشافية لمعالم موسكو تشمل زيارة برج كوتافيا لدخول الكرملين، وعمل جولة حول الساحة الحمراء، حديقة الكسندر، كاتدرائية قازان، ضريح لينين، وحديقة زاريادي. بعدها ننتقل إلى ساحة سمولينسكايا للتجول في شارع أربات العريق، ونختتم اليوم بحضور أروع العروض العالمية في سيرك موسكو الشهير.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_11_days, 8, N'اليوم 8', N'رحلة مميزة لزيارة تلال سبارو وركوب التلفريك فوق نهر موسكو للاستمتاع بأجمل المناظر لالتقاط الصور. ثم التوجه لزيارة الداون تاون ومول أفيمال، ونختتم اليوم برحلة كروز ساحرة في نهر موسكو للاستمتاع بجمال الطبيعة والمباني التاريخية.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_11_days, 9, N'اليوم 9', N'يوم مليء بالمرح والتشويق في مدينة الأحلام (دريم لاند)، أكبر مدينة ترفيهية في موسكو والمناسبة لجميع الأعمار، حيث نقضي يوماً كاملاً في الاستمتاع بالألعاب والفعاليات المذهلة.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_11_days, 10, N'اليوم 10', N'يوم حر مخصص للاسترخاء التام في الفندق، أو الانطلاق في جولة حرة لاستكشاف شوارع وأسواق المدينة على طريقتك الخاصة (بدون سائق).', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_11_days, 11, N'اليوم 11', N'ختام الرحلة الجميلة وتوديع روسيا، حيث يتم التوصيل من مكان الإقامة في موسكو إلى المطار الدولي للعودة بسلامة الله إلى أرض الوطن.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_11_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 14600, 
    TitleEn = N'Amazing روسيا 12 Days Deal', 
    Subtitle = N'استمتع بـ 11 ليالي من الرفاهية في فندق بينتا موسكو اربات - موسكو وغيرها' 
WHERE PackageId = N'pkg-روسيا-قديم-12-days';

DECLARE @PackId_pkg_روسيا_قديم_12_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_روسيا_قديم_12_days = Id FROM Packages WHERE PackageId = N'pkg-روسيا-قديم-12-days';
IF @PackId_pkg_روسيا_قديم_12_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_روسيا_قديم_12_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_روسيا_قديم_12_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_روسيا_قديم_12_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_12_days, N'فندق بينتا موسكو اربات - موسكو', N'', 4, 11, N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_12_days, N'نوفوتيل سانت بترسبرج - سانت بطرسبرغ', N'', 4, 11, N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', 1);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_12_days, 1, N'اليوم 1', N'الاستقبال والترحيب في المطار الدولي في موسكو، والتوصيل المباشر والمريح إلى الفندق لتسجيل الدخول والراحة.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_12_days, 2, N'اليوم 2', N'الانطلاق في جولة ممتعة لزيارة الكرملين إزميلوفو، والذي يعتبر أهم مجمع ثقافي وترفيهي لمشاهدة المعارض والمهرجانات، وزيارة سوق الهدايا التذكارية. ثم التوجه لزيارة حديقة فادنخا واستكشاف المتحف التاريخي، تليها زيارة لأشهر المولات الأوروبية للتسوق.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_12_days, 3, N'اليوم 3', N'يوم حر مخصص للاسترخاء التام في الفندق، أو الانطلاق في جولة حرة لاستكشاف شوارع وأسواق المدينة على طريقتك الخاصة (بدون سائق).', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_12_days, 4, N'اليوم 4', N'تسجيل الخروج من الفندق في موسكو والانتقال المريح إلى محطة القطار للتوجه إلى سانت بطرسبرغ، وعند الوصول يتم الاستقبال والتوصيل إلى الفندق المحجوز.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_12_days, 5, N'اليوم 5', N'جولة سياحية لاستكشاف سحر سانت بطرسبرغ، تشمل قلعة بطرس وبولس، شارع نيفسكي بروسبكت، كاتدرائية سمولني، وساحة القصر. ثم التوجه لزيارة قصر بيترهوف للاستمتاع بالحديقة السفلى والشلالات والمتحف الوطني.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_12_days, 6, N'اليوم 6', N'رحلة تاريخية لزيارة مدينة بوشكين (تسارسكوي سيلو) واستكشاف المقر الإمبراطوري في قصر كاترين المذهل. ثم التوجه للتسوق في مول جاليريا الشهير والتمتع بأجواء المدينة.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_12_days, 7, N'اليوم 7', N'تسجيل الخروج والانتقال من سانت بطرسبرغ إلى محطة القطار للعودة إلى العاصمة موسكو، وعند الوصول يتم الاستقبال والتوصيل المباشر إلى الفندق.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_12_days, 8, N'اليوم 8', N'جولة استكشافية لمعالم موسكو تشمل زيارة برج كوتافيا لدخول الكرملين، وعمل جولة حول الساحة الحمراء، حديقة الكسندر، كاتدرائية قازان، ضريح لينين، وحديقة زاريادي. بعدها ننتقل إلى ساحة سمولينسكايا للتجول في شارع أربات العريق، ونختتم اليوم بحضور أروع العروض العالمية في سيرك موسكو الشهير.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_12_days, 9, N'اليوم 9', N'رحلة مميزة لزيارة تلال سبارو وركوب التلفريك فوق نهر موسكو للاستمتاع بأجمل المناظر لالتقاط الصور. ثم التوجه لزيارة الداون تاون ومول أفيمال، ونختتم اليوم برحلة كروز ساحرة في نهر موسكو للاستمتاع بجمال الطبيعة والمباني التاريخية.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_12_days, 10, N'اليوم 10', N'يوم مليء بالمرح والتشويق في مدينة الأحلام (دريم لاند)، أكبر مدينة ترفيهية في موسكو والمناسبة لجميع الأعمار، حيث نقضي يوماً كاملاً في الاستمتاع بالألعاب والفعاليات المذهلة.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_12_days, 11, N'اليوم 11', N'يوم حر مخصص للاسترخاء التام في الفندق، أو الانطلاق في جولة حرة لاستكشاف شوارع وأسواق المدينة على طريقتك الخاصة (بدون سائق).', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_12_days, 12, N'اليوم 12', N'ختام الرحلة الجميلة وتوديع روسيا، حيث يتم التوصيل من مكان الإقامة في موسكو إلى المطار الدولي للعودة بسلامة الله إلى أرض الوطن.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_12_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 15800, 
    TitleEn = N'Amazing روسيا 13 Days Deal', 
    Subtitle = N'استمتع بـ 12 ليالي من الرفاهية في فندق بينتا موسكو اربات - موسكو وغيرها' 
WHERE PackageId = N'pkg-روسيا-قديم-13-days';

DECLARE @PackId_pkg_روسيا_قديم_13_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_روسيا_قديم_13_days = Id FROM Packages WHERE PackageId = N'pkg-روسيا-قديم-13-days';
IF @PackId_pkg_روسيا_قديم_13_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_روسيا_قديم_13_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_روسيا_قديم_13_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_روسيا_قديم_13_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_13_days, N'فندق بينتا موسكو اربات - موسكو', N'', 4, 12, N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_13_days, N'نوفوتيل سانت بترسبرج - سانت بطرسبرغ', N'', 4, 12, N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', 1);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_13_days, 1, N'اليوم 1', N'الاستقبال والترحيب في المطار الدولي في موسكو، والتوصيل المباشر والمريح إلى الفندق لتسجيل الدخول والراحة.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_13_days, 2, N'اليوم 2', N'الانطلاق في جولة ممتعة لزيارة الكرملين إزميلوفو، والذي يعتبر أهم مجمع ثقافي وترفيهي لمشاهدة المعارض والمهرجانات، وزيارة سوق الهدايا التذكارية. ثم التوجه لزيارة حديقة فادنخا واستكشاف المتحف التاريخي، تليها زيارة لأشهر المولات الأوروبية للتسوق.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_13_days, 3, N'اليوم 3', N'يوم حر مخصص للاسترخاء التام في الفندق، أو الانطلاق في جولة حرة لاستكشاف شوارع وأسواق المدينة على طريقتك الخاصة (بدون سائق).', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_13_days, 4, N'اليوم 4', N'تسجيل الخروج من الفندق في موسكو والانتقال المريح إلى محطة القطار للتوجه إلى سانت بطرسبرغ، وعند الوصول يتم الاستقبال والتوصيل إلى الفندق المحجوز.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_13_days, 5, N'اليوم 5', N'جولة سياحية لاستكشاف سحر سانت بطرسبرغ، تشمل قلعة بطرس وبولس، شارع نيفسكي بروسبكت، كاتدرائية سمولني، وساحة القصر. ثم التوجه لزيارة قصر بيترهوف للاستمتاع بالحديقة السفلى والشلالات والمتحف الوطني.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_13_days, 6, N'اليوم 6', N'رحلة تاريخية لزيارة مدينة بوشكين (تسارسكوي سيلو) واستكشاف المقر الإمبراطوري في قصر كاترين المذهل. ثم التوجه للتسوق في مول جاليريا الشهير والتمتع بأجواء المدينة.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_13_days, 7, N'اليوم 7', N'تسجيل الخروج والانتقال من سانت بطرسبرغ إلى محطة القطار للعودة إلى العاصمة موسكو، وعند الوصول يتم الاستقبال والتوصيل المباشر إلى الفندق.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_13_days, 8, N'اليوم 8', N'جولة استكشافية لمعالم موسكو تشمل زيارة برج كوتافيا لدخول الكرملين، وعمل جولة حول الساحة الحمراء، حديقة الكسندر، كاتدرائية قازان، ضريح لينين، وحديقة زاريادي. بعدها ننتقل إلى ساحة سمولينسكايا للتجول في شارع أربات العريق، ونختتم اليوم بحضور أروع العروض العالمية في سيرك موسكو الشهير.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_13_days, 9, N'اليوم 9', N'رحلة مميزة لزيارة تلال سبارو وركوب التلفريك فوق نهر موسكو للاستمتاع بأجمل المناظر لالتقاط الصور. ثم التوجه لزيارة الداون تاون ومول أفيمال، ونختتم اليوم برحلة كروز ساحرة في نهر موسكو للاستمتاع بجمال الطبيعة والمباني التاريخية.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_13_days, 10, N'اليوم 10', N'يوم مليء بالمرح والتشويق في مدينة الأحلام (دريم لاند)، أكبر مدينة ترفيهية في موسكو والمناسبة لجميع الأعمار، حيث نقضي يوماً كاملاً في الاستمتاع بالألعاب والفعاليات المذهلة.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_13_days, 11, N'اليوم 11', N'مغامرة استثنائية لتجربة عربة كلاب الهاسكي الشهيرة، وركوب الخيل، والاستمتاع بقيادة الدراجات الرباعية وسط الطبيعة الخلابة، تليها جولة استكشافية في قصر تساريتسنو التاريخي.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_13_days, 12, N'اليوم 12', N'يوم حر مخصص للاسترخاء التام في الفندق، أو الانطلاق في جولة حرة لاستكشاف شوارع وأسواق المدينة على طريقتك الخاصة (بدون سائق).', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_13_days, 13, N'اليوم 13', N'ختام الرحلة الجميلة وتوديع روسيا، حيث يتم التوصيل من مكان الإقامة في موسكو إلى المطار الدولي للعودة بسلامة الله إلى أرض الوطن.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_13_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 17250, 
    TitleEn = N'Amazing روسيا 14 Days Deal', 
    Subtitle = N'استمتع بـ 13 ليالي من الرفاهية في فندق بينتا موسكو اربات - موسكو وغيرها' 
WHERE PackageId = N'pkg-روسيا-قديم-14-days';

DECLARE @PackId_pkg_روسيا_قديم_14_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_روسيا_قديم_14_days = Id FROM Packages WHERE PackageId = N'pkg-روسيا-قديم-14-days';
IF @PackId_pkg_روسيا_قديم_14_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_روسيا_قديم_14_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_روسيا_قديم_14_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_روسيا_قديم_14_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_14_days, N'فندق بينتا موسكو اربات - موسكو', N'', 4, 13, N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_14_days, N'نوفوتيل سانت بترسبرج - سانت بطرسبرغ', N'', 4, 13, N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', 1);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_14_days, 1, N'اليوم 1', N'الاستقبال والترحيب في المطار الدولي في موسكو، والتوصيل المباشر والمريح إلى الفندق لتسجيل الدخول والراحة.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_14_days, 2, N'اليوم 2', N'الانطلاق في جولة ممتعة لزيارة الكرملين إزميلوفو، والذي يعتبر أهم مجمع ثقافي وترفيهي لمشاهدة المعارض والمهرجانات، وزيارة سوق الهدايا التذكارية. ثم التوجه لزيارة حديقة فادنخا واستكشاف المتحف التاريخي، تليها زيارة لأشهر المولات الأوروبية للتسوق.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_14_days, 3, N'اليوم 3', N'يوم حر مخصص للاسترخاء التام في الفندق، أو الانطلاق في جولة حرة لاستكشاف شوارع وأسواق المدينة على طريقتك الخاصة (بدون سائق).', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_14_days, 4, N'اليوم 4', N'تسجيل الخروج من الفندق في موسكو والانتقال المريح إلى محطة القطار للتوجه إلى سانت بطرسبرغ، وعند الوصول يتم الاستقبال والتوصيل إلى الفندق المحجوز.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_14_days, 5, N'اليوم 5', N'جولة سياحية لاستكشاف سحر سانت بطرسبرغ، تشمل قلعة بطرس وبولس، شارع نيفسكي بروسبكت، كاتدرائية سمولني، وساحة القصر. ثم التوجه لزيارة قصر بيترهوف للاستمتاع بالحديقة السفلى والشلالات والمتحف الوطني.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_14_days, 6, N'اليوم 6', N'رحلة تاريخية لزيارة مدينة بوشكين (تسارسكوي سيلو) واستكشاف المقر الإمبراطوري في قصر كاترين المذهل. ثم التوجه للتسوق في مول جاليريا الشهير والتمتع بأجواء المدينة.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_14_days, 7, N'اليوم 7', N'تسجيل الخروج والانتقال من سانت بطرسبرغ إلى محطة القطار للعودة إلى العاصمة موسكو، وعند الوصول يتم الاستقبال والتوصيل المباشر إلى الفندق.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_14_days, 8, N'اليوم 8', N'جولة استكشافية لمعالم موسكو تشمل زيارة برج كوتافيا لدخول الكرملين، وعمل جولة حول الساحة الحمراء، حديقة الكسندر، كاتدرائية قازان، ضريح لينين، وحديقة زاريادي. بعدها ننتقل إلى ساحة سمولينسكايا للتجول في شارع أربات العريق، ونختتم اليوم بحضور أروع العروض العالمية في سيرك موسكو الشهير.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_14_days, 9, N'اليوم 9', N'رحلة مميزة لزيارة تلال سبارو وركوب التلفريك فوق نهر موسكو للاستمتاع بأجمل المناظر لالتقاط الصور. ثم التوجه لزيارة الداون تاون ومول أفيمال، ونختتم اليوم برحلة كروز ساحرة في نهر موسكو للاستمتاع بجمال الطبيعة والمباني التاريخية.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_14_days, 10, N'اليوم 10', N'يوم حر مخصص للاسترخاء التام في الفندق، أو الانطلاق في جولة حرة لاستكشاف شوارع وأسواق المدينة على طريقتك الخاصة (بدون سائق).', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_14_days, 11, N'اليوم 11', N'يوم مليء بالمرح والتشويق في مدينة الأحلام (دريم لاند)، أكبر مدينة ترفيهية في موسكو والمناسبة لجميع الأعمار، حيث نقضي يوماً كاملاً في الاستمتاع بالألعاب والفعاليات المذهلة.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_14_days, 12, N'اليوم 12', N'مغامرة استثنائية لتجربة عربة كلاب الهاسكي الشهيرة، وركوب الخيل، والاستمتاع بقيادة الدراجات الرباعية وسط الطبيعة الخلابة، تليها جولة استكشافية في قصر تساريتسنو التاريخي.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_14_days, 13, N'اليوم 13', N'يوم حر مخصص للاسترخاء التام في الفندق، أو الانطلاق في جولة حرة لاستكشاف شوارع وأسواق المدينة على طريقتك الخاصة (بدون سائق).', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_14_days, 14, N'اليوم 14', N'ختام الرحلة الجميلة وتوديع روسيا، حيث يتم التوصيل من مكان الإقامة في موسكو إلى المطار الدولي للعودة بسلامة الله إلى أرض الوطن.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_14_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 5750, 
    TitleEn = N'Amazing روسيا 6 Days Deal', 
    Subtitle = N'استمتع بـ 5 ليالي من الرفاهية في فندق بينتا موسكو اربات - موسكو وغيرها' 
WHERE PackageId = N'pkg-روسيا-قديم-6-days';

DECLARE @PackId_pkg_روسيا_قديم_6_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_روسيا_قديم_6_days = Id FROM Packages WHERE PackageId = N'pkg-روسيا-قديم-6-days';
IF @PackId_pkg_روسيا_قديم_6_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_روسيا_قديم_6_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_روسيا_قديم_6_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_روسيا_قديم_6_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_6_days, N'فندق بينتا موسكو اربات - موسكو', N'', 4, 5, N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_6_days, 1, N'اليوم 1', N'الاستقبال والترحيب في المطار الدولي في موسكو، والتوصيل المباشر والمريح إلى الفندق لتسجيل الدخول والراحة.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_6_days, 2, N'اليوم 2', N'الانطلاق في جولة ممتعة لزيارة الكرملين إزميلوفو، والذي يعتبر أهم مجمع ثقافي وترفيهي لمشاهدة المعارض والمهرجانات، وزيارة سوق الهدايا التذكارية. ثم التوجه لزيارة حديقة فادنخا واستكشاف المتحف التاريخي، تليها زيارة لأشهر المولات الأوروبية للتسوق.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_6_days, 3, N'اليوم 3', N'جولة استكشافية لمعالم موسكو تشمل زيارة برج كوتافيا لدخول الكرملين، وعمل جولة حول الساحة الحمراء، حديقة الكسندر، كاتدرائية قازان، ضريح لينين، وحديقة زاريادي. بعدها ننتقل إلى ساحة سمولينسكايا للتجول في شارع أربات العريق، ونختتم اليوم بحضور أروع العروض العالمية في سيرك موسكو الشهير.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_6_days, 4, N'اليوم 4', N'رحلة مميزة لزيارة تلال سبارو وركوب التلفريك فوق نهر موسكو للاستمتاع بأجمل المناظر لالتقاط الصور. ثم التوجه لزيارة الداون تاون ومول أفيمال، ونختتم اليوم برحلة كروز ساحرة في نهر موسكو للاستمتاع بجمال الطبيعة والمباني التاريخية.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_6_days, 5, N'اليوم 5', N'يوم حر مخصص للاسترخاء التام في الفندق، أو الانطلاق في جولة حرة لاستكشاف شوارع وأسواق المدينة على طريقتك الخاصة (بدون سائق).', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_6_days, 6, N'اليوم 6', N'ختام الرحلة الجميلة وتوديع روسيا، حيث يتم التوصيل من مكان الإقامة في موسكو إلى المطار الدولي للعودة بسلامة الله إلى أرض الوطن.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_6_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 7200, 
    TitleEn = N'Amazing روسيا 7 Days Deal', 
    Subtitle = N'استمتع بـ 6 ليالي من الرفاهية في فندق بينتا موسكو اربات - موسكو وغيرها' 
WHERE PackageId = N'pkg-روسيا-قديم-7-days';

DECLARE @PackId_pkg_روسيا_قديم_7_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_روسيا_قديم_7_days = Id FROM Packages WHERE PackageId = N'pkg-روسيا-قديم-7-days';
IF @PackId_pkg_روسيا_قديم_7_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_روسيا_قديم_7_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_روسيا_قديم_7_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_روسيا_قديم_7_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_7_days, N'فندق بينتا موسكو اربات - موسكو', N'', 4, 6, N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_7_days, 1, N'اليوم 1', N'الاستقبال والترحيب في المطار الدولي في موسكو، والتوصيل المباشر والمريح إلى الفندق لتسجيل الدخول والراحة.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_7_days, 2, N'اليوم 2', N'الانطلاق في جولة ممتعة لزيارة الكرملين إزميلوفو، والذي يعتبر أهم مجمع ثقافي وترفيهي لمشاهدة المعارض والمهرجانات، وزيارة سوق الهدايا التذكارية. ثم التوجه لزيارة حديقة فادنخا واستكشاف المتحف التاريخي، تليها زيارة لأشهر المولات الأوروبية للتسوق.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_7_days, 3, N'اليوم 3', N'جولة استكشافية لمعالم موسكو تشمل زيارة برج كوتافيا لدخول الكرملين، وعمل جولة حول الساحة الحمراء، حديقة الكسندر، كاتدرائية قازان، ضريح لينين، وحديقة زاريادي. بعدها ننتقل إلى ساحة سمولينسكايا للتجول في شارع أربات العريق، ونختتم اليوم بحضور أروع العروض العالمية في سيرك موسكو الشهير.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_7_days, 4, N'اليوم 4', N'رحلة مميزة لزيارة تلال سبارو وركوب التلفريك فوق نهر موسكو للاستمتاع بأجمل المناظر لالتقاط الصور. ثم التوجه لزيارة الداون تاون ومول أفيمال، ونختتم اليوم برحلة كروز ساحرة في نهر موسكو للاستمتاع بجمال الطبيعة والمباني التاريخية.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_7_days, 5, N'اليوم 5', N'يوم مليء بالمرح والتشويق في مدينة الأحلام (دريم لاند)، أكبر مدينة ترفيهية في موسكو والمناسبة لجميع الأعمار، حيث نقضي يوماً كاملاً في الاستمتاع بالألعاب والفعاليات المذهلة.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_7_days, 6, N'اليوم 6', N'يوم حر مخصص للاسترخاء التام في الفندق، أو الانطلاق في جولة حرة لاستكشاف شوارع وأسواق المدينة على طريقتك الخاصة (بدون سائق).', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_7_days, 7, N'اليوم 7', N'ختام الرحلة الجميلة وتوديع روسيا، حيث يتم التوصيل من مكان الإقامة في موسكو إلى المطار الدولي للعودة بسلامة الله إلى أرض الوطن.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_7_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 7850, 
    TitleEn = N'Amazing روسيا 8 Days Deal', 
    Subtitle = N'استمتع بـ 7 ليالي من الرفاهية في فندق بينتا موسكو اربات - موسكو وغيرها' 
WHERE PackageId = N'pkg-روسيا-قديم-8-days';

DECLARE @PackId_pkg_روسيا_قديم_8_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_روسيا_قديم_8_days = Id FROM Packages WHERE PackageId = N'pkg-روسيا-قديم-8-days';
IF @PackId_pkg_روسيا_قديم_8_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_روسيا_قديم_8_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_روسيا_قديم_8_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_روسيا_قديم_8_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_8_days, N'فندق بينتا موسكو اربات - موسكو', N'', 4, 7, N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_8_days, 1, N'اليوم 1', N'الاستقبال والترحيب في المطار الدولي في موسكو، والتوصيل المباشر والمريح إلى الفندق لتسجيل الدخول والراحة.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_8_days, 2, N'اليوم 2', N'الانطلاق في جولة ممتعة لزيارة الكرملين إزميلوفو، والذي يعتبر أهم مجمع ثقافي وترفيهي لمشاهدة المعارض والمهرجانات، وزيارة سوق الهدايا التذكارية. ثم التوجه لزيارة حديقة فادنخا واستكشاف المتحف التاريخي، تليها زيارة لأشهر المولات الأوروبية للتسوق.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_8_days, 3, N'اليوم 3', N'جولة استكشافية لمعالم موسكو تشمل زيارة برج كوتافيا لدخول الكرملين، وعمل جولة حول الساحة الحمراء، حديقة الكسندر، كاتدرائية قازان، ضريح لينين، وحديقة زاريادي. بعدها ننتقل إلى ساحة سمولينسكايا للتجول في شارع أربات العريق، ونختتم اليوم بحضور أروع العروض العالمية في سيرك موسكو الشهير.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_8_days, 4, N'اليوم 4', N'يوم حر مخصص للاسترخاء التام في الفندق، أو الانطلاق في جولة حرة لاستكشاف شوارع وأسواق المدينة على طريقتك الخاصة (بدون سائق).', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_8_days, 5, N'اليوم 5', N'رحلة مميزة لزيارة تلال سبارو وركوب التلفريك فوق نهر موسكو للاستمتاع بأجمل المناظر لالتقاط الصور. ثم التوجه لزيارة الداون تاون ومول أفيمال، ونختتم اليوم برحلة كروز ساحرة في نهر موسكو للاستمتاع بجمال الطبيعة والمباني التاريخية.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_8_days, 6, N'اليوم 6', N'يوم مليء بالمرح والتشويق في مدينة الأحلام (دريم لاند)، أكبر مدينة ترفيهية في موسكو والمناسبة لجميع الأعمار، حيث نقضي يوماً كاملاً في الاستمتاع بالألعاب والفعاليات المذهلة.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_8_days, 7, N'اليوم 7', N'يوم حر مخصص للاسترخاء التام في الفندق، أو الانطلاق في جولة حرة لاستكشاف شوارع وأسواق المدينة على طريقتك الخاصة (بدون سائق).', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_8_days, 8, N'اليوم 8', N'ختام الرحلة الجميلة وتوديع روسيا، حيث يتم التوصيل من مكان الإقامة في موسكو إلى المطار الدولي للعودة بسلامة الله إلى أرض الوطن.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_8_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 9100, 
    TitleEn = N'Amazing روسيا 9 Days Deal', 
    Subtitle = N'استمتع بـ 8 ليالي من الرفاهية في فندق بينتا موسكو اربات - موسكو وغيرها' 
WHERE PackageId = N'pkg-روسيا-قديم-9-days';

DECLARE @PackId_pkg_روسيا_قديم_9_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_روسيا_قديم_9_days = Id FROM Packages WHERE PackageId = N'pkg-روسيا-قديم-9-days';
IF @PackId_pkg_روسيا_قديم_9_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_روسيا_قديم_9_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_روسيا_قديم_9_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_روسيا_قديم_9_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_9_days, N'فندق بينتا موسكو اربات - موسكو', N'', 4, 8, N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_9_days, 1, N'اليوم 1', N'الاستقبال والترحيب في المطار الدولي في موسكو، والتوصيل المباشر والمريح إلى الفندق لتسجيل الدخول والراحة.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_9_days, 2, N'اليوم 2', N'الانطلاق في جولة ممتعة لزيارة الكرملين إزميلوفو، والذي يعتبر أهم مجمع ثقافي وترفيهي لمشاهدة المعارض والمهرجانات، وزيارة سوق الهدايا التذكارية. ثم التوجه لزيارة حديقة فادنخا واستكشاف المتحف التاريخي، تليها زيارة لأشهر المولات الأوروبية للتسوق.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_9_days, 3, N'اليوم 3', N'جولة استكشافية لمعالم موسكو تشمل زيارة برج كوتافيا لدخول الكرملين، وعمل جولة حول الساحة الحمراء، حديقة الكسندر، كاتدرائية قازان، ضريح لينين، وحديقة زاريادي. بعدها ننتقل إلى ساحة سمولينسكايا للتجول في شارع أربات العريق، ونختتم اليوم بحضور أروع العروض العالمية في سيرك موسكو الشهير.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_9_days, 4, N'اليوم 4', N'رحلة مميزة لزيارة تلال سبارو وركوب التلفريك فوق نهر موسكو للاستمتاع بأجمل المناظر لالتقاط الصور. ثم التوجه لزيارة الداون تاون ومول أفيمال، ونختتم اليوم برحلة كروز ساحرة في نهر موسكو للاستمتاع بجمال الطبيعة والمباني التاريخية.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_9_days, 5, N'اليوم 5', N'يوم حر مخصص للاسترخاء التام في الفندق، أو الانطلاق في جولة حرة لاستكشاف شوارع وأسواق المدينة على طريقتك الخاصة (بدون سائق).', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_9_days, 6, N'اليوم 6', N'يوم مليء بالمرح والتشويق في مدينة الأحلام (دريم لاند)، أكبر مدينة ترفيهية في موسكو والمناسبة لجميع الأعمار، حيث نقضي يوماً كاملاً في الاستمتاع بالألعاب والفعاليات المذهلة.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_9_days, 7, N'اليوم 7', N'مغامرة استثنائية لتجربة عربة كلاب الهاسكي الشهيرة، وركوب الخيل، والاستمتاع بقيادة الدراجات الرباعية وسط الطبيعة الخلابة، تليها جولة استكشافية في قصر تساريتسنو التاريخي.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_9_days, 8, N'اليوم 8', N'يوم حر مخصص للاسترخاء التام في الفندق، أو الانطلاق في جولة حرة لاستكشاف شوارع وأسواق المدينة على طريقتك الخاصة (بدون سائق).', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_9_days, 9, N'اليوم 9', N'ختام الرحلة الجميلة وتوديع روسيا، حيث يتم التوصيل من مكان الإقامة في موسكو إلى المطار الدولي للعودة بسلامة الله إلى أرض الوطن.', N'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_روسيا_قديم_9_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 5500, 
    TitleEn = N'Amazing فيتنام 10 Days Deal', 
    Subtitle = N'استمتع بـ 9 ليالي من الرفاهية في فندق سيلك باث هانواي - هانوي وغيرها' 
WHERE PackageId = N'pkg-فيتنام-2026-10-days';

DECLARE @PackId_pkg_فيتنام_2026_10_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_فيتنام_2026_10_days = Id FROM Packages WHERE PackageId = N'pkg-فيتنام-2026-10-days';
IF @PackId_pkg_فيتنام_2026_10_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_فيتنام_2026_10_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_فيتنام_2026_10_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_فيتنام_2026_10_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_10_days, N'فندق سيلك باث هانواي - هانوي', N'', 4, 9, N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_10_days, N'فندق باو سابا - مرتفعات سابا', N'', 4, 9, N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', 1);
    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_10_days, N'فندق سوليل هالونج - خليج الهالونج', N'', 4, 9, N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', 2);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_10_days, 1, N'اليوم 1', N'الاستقبال والترحيب في مطار هانوي الدولي والانتقال المريح إلى الفندق لبدء عطلتكم الساحرة.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_10_days, 2, N'اليوم 2', N'جولة طبيعية خلابة في ''نينه بينه''، تتضمن الإبحار بقوارب السامبان في رصيف تام كوك وسط الجبال وحقول الأرز والكهوف المدهشة.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_10_days, 3, N'اليوم 3', N'يوم حر بالكامل في هانوي للاستجمام والراحة، أو لاستكشاف أسواق ومطاعم المدينة بحرية تامة.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_10_days, 4, N'اليوم 4', N'مغادرة هانوي والانتقال المريح إلى مرتفعات سابا ذات الأجواء الباردة عبر باص النوم الفاخر.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_10_days, 5, N'اليوم 5', N'استكشاف سابا بزيارة قرية ''كات كات'' للتعرف على تراث الهومونج، ثم الصعود بالتلفريك المذهل لمعانقة السحاب فوق القمم الخضراء.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_10_days, 6, N'اليوم 6', N'يوم سياحي متكامل في سابا لزيارة الشلالات المنعشة، الجسر الزجاجي، ومنطقة ''موانا سابا'' ذات المناظر الفريدة لعشاق التصوير.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_10_days, 7, N'اليوم 7', N'رحلة انتقال من طبيعة سابا الجبلية عبر هانوي وصولاً إلى فندق الإقامة في خليج هالونج الساحر.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_10_days, 8, N'اليوم 8', N'يوم مخصص للاسترخاء والجمال في رحلة بحرية فاخرة وسط مياه وجزر خليج هالونج الاستثنائية.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_10_days, 9, N'اليوم 9', N'مغادرة خليج هالونج والعودة بالسيارة الخاصة إلى العاصمة هانوي لقضاء الليلة الأخيرة.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_10_days, 10, N'اليوم 10', N'نهاية الرحلة السعيدة، والتوصيل المريح من الفندق إلى مطار هانوي للعودة إلى الديار بسلامة الله.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_10_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 5900, 
    TitleEn = N'Amazing فيتنام 11 Days Deal', 
    Subtitle = N'استمتع بـ 10 ليالي من الرفاهية في فندق سيلك باث هانواي - هانوي وغيرها' 
WHERE PackageId = N'pkg-فيتنام-2026-11-days';

DECLARE @PackId_pkg_فيتنام_2026_11_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_فيتنام_2026_11_days = Id FROM Packages WHERE PackageId = N'pkg-فيتنام-2026-11-days';
IF @PackId_pkg_فيتنام_2026_11_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_فيتنام_2026_11_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_فيتنام_2026_11_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_فيتنام_2026_11_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_11_days, N'فندق سيلك باث هانواي - هانوي', N'', 4, 10, N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_11_days, N'فندق باو سابا - مرتفعات سابا', N'', 4, 10, N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', 1);
    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_11_days, N'فندق سوليل هالونج - خليج الهالونج', N'', 4, 10, N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', 2);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_11_days, 1, N'اليوم 1', N'الترحيب الحار في مطار هانوي الدولي والانتقال السلس إلى الفندق للراحة والتجهيز لبدء المغامرة.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_11_days, 2, N'اليوم 2', N'رحلة استكشافية إلى جنة ''نينه بينه'' والإبحار بقوارب السامبان وسط الجبال الصخرية وحقول الأرز البديعة في تام كوك.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_11_days, 3, N'اليوم 3', N'جولة سياحية غنية لمدة 8 ساعات للتعرف على أهم المعالم التاريخية والثقافية في العاصمة هانوي.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_11_days, 4, N'اليوم 4', N'تجربة انتقال مميزة عبر باص النوم من هانوي صعوداً إلى مرتفعات سابا ذات الطبيعة الخلابة.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_11_days, 5, N'اليوم 5', N'جولة في سابا تشمل زيارة قرية ''كات كات'' ومدرجات الأرز، وتجربة ركوب التلفريك الأطول للوصول إلى قمة الجبل بين السحاب.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_11_days, 6, N'اليوم 6', N'زيارة أجمل المعالم الطبيعية في سابا، وتتضمن الشلالات، الجسر الزجاجي، ومنطقة ''موانا سابا'' لالتقاط صور بانورامية ساحرة.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_11_days, 7, N'اليوم 7', N'مغادرة أجواء سابا الباردة والانتقال بالسيارة مروراً بهانوي وصولاً إلى فندق الإقامة في خليج هالونج.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_11_days, 8, N'اليوم 8', N'يوم مليء بالاسترخاء والمتعة عبر رحلة بحرية فاخرة لاستكشاف جزر وكهوف خليج هالونج المذهل.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_11_days, 9, N'اليوم 9', N'العودة بالسيارة الخاصة من طبيعة هالونج إلى قلب العاصمة هانوي لتسجيل الدخول بالفندق.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_11_days, 10, N'اليوم 10', N'يوم حر ومميز للتسوق واقتناء أروع الهدايا التذكارية من أسواق هانوي النابضة بالحياة.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_11_days, 11, N'اليوم 11', N'ختام رحلتكم الفيتنامية الممتعة، والانتقال من الفندق إلى مطار هانوي للعودة إلى أرض الوطن بسلام.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_11_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 7000, 
    TitleEn = N'Amazing فيتنام 12 Days Deal', 
    Subtitle = N'استمتع بـ 11 ليالي من الرفاهية في فندق سيلك باث هانواي - هانوي وغيرها' 
WHERE PackageId = N'pkg-فيتنام-2026-12-days';

DECLARE @PackId_pkg_فيتنام_2026_12_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_فيتنام_2026_12_days = Id FROM Packages WHERE PackageId = N'pkg-فيتنام-2026-12-days';
IF @PackId_pkg_فيتنام_2026_12_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_فيتنام_2026_12_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_فيتنام_2026_12_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_فيتنام_2026_12_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_12_days, N'فندق سيلك باث هانواي - هانوي', N'', 4, 11, N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_12_days, N'سيتادنس بيرل هوي ان - دانانج - دانانج', N'', 4, 11, N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', 1);
    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_12_days, N'فندق سوليل هالونج - خليج الهالونج', N'', 4, 11, N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', 2);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_12_days, 1, N'اليوم 1', N'الاستقبال في مطار هانوي الدولي والتوجه المباشر إلى الفندق لبدء عطلة استثنائية في فيتنام.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_12_days, 2, N'اليوم 2', N'يوم مخصص للطبيعة الساحرة في ''نينه بينه''، والإبحار بالقوارب التقليدية وسط الجبال والكهوف في رصيف تام كوك.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_12_days, 3, N'اليوم 3', N'جولة سياحية متكاملة لاكتشاف أهم المعالم الثقافية والسياحية البارزة في العاصمة هانوي.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_12_days, 4, N'اليوم 4', N'توديع هانوي والانتقال بالطيران الداخلي إلى مدينة دانانج الساحلية، ليتم استقبالكم هناك والتوصيل للفندق.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_12_days, 5, N'اليوم 5', N'يوم سياحي خيالي في ''بانا هيلز''، يشمل ركوب أطول تلفريك، المشي على الجسر الذهبي الشهير، وزيارة الملاهي وحديقة الديناصورات.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_12_days, 6, N'اليوم 6', N'رحلة ممتعة إلى قرية ''كام ثانه'' المائية، لتجربة ركوب قوارب سلة الخيزران الدائرية واصطياد السرطانات، يليها زيارة جبل ماربل.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_12_days, 7, N'اليوم 7', N'يوم حر للاسترخاء التام على شواطئ دانانج الجميلة أو التجول في أسواقها بحرية تامة.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_12_days, 8, N'اليوم 8', N'توديع دانانج والعودة بالطيران إلى هانوي، ومن ثم الانتقال المباشر بالسيارة إلى فندقكم في خليج هالونج.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_12_days, 9, N'اليوم 9', N'الاستمتاع برحلة بحرية فاخرة وسط المناظر الطبيعية الخلابة والجزر الصخرية المنتشرة في خليج هالونج.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_12_days, 10, N'اليوم 10', N'تسجيل الخروج من هالونج والعودة المريحة بالسيارة الخاصة إلى العاصمة هانوي.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_12_days, 11, N'اليوم 11', N'يوم حر أخير للتسوق وشراء أجمل الهدايا التذكارية من أسواق هانوي العريقة.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_12_days, 12, N'اليوم 12', N'انتهاء الرحلة الممتعة والتوصيل من الفندق إلى مطار هانوي الدولي لرحلة العودة بسلامة الله.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_12_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 7700, 
    TitleEn = N'Amazing فيتنام 13 Days Deal', 
    Subtitle = N'استمتع بـ 12 ليالي من الرفاهية في فندق سيلك باث هانواي - هانوي وغيرها' 
WHERE PackageId = N'pkg-فيتنام-2026-13-days';

DECLARE @PackId_pkg_فيتنام_2026_13_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_فيتنام_2026_13_days = Id FROM Packages WHERE PackageId = N'pkg-فيتنام-2026-13-days';
IF @PackId_pkg_فيتنام_2026_13_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_فيتنام_2026_13_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_فيتنام_2026_13_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_فيتنام_2026_13_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_13_days, N'فندق سيلك باث هانواي - هانوي', N'', 4, 12, N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_13_days, N'سيتادنس بيرل هوي ان - دانانج - دانانج', N'', 4, 12, N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', 1);
    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_13_days, N'فندق سوليل هالونج - خليج الهالونج', N'', 4, 12, N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', 2);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_13_days, 1, N'اليوم 1', N'الاستقبال والترحيب في مطار هانوي الدولي، والانتقال السلس إلى الفندق لتسجيل الدخول وأخذ قسط من الراحة.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_13_days, 2, N'اليوم 2', N'يوم استكشافي رائع في ''نينه بينه''، يتضمن جولة بقوارب السامبان للإبحار وسط الجبال الصخرية وحقول الأرز الخضراء.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_13_days, 3, N'اليوم 3', N'جولة سياحية للتعرف على أسرار العاصمة هانوي وزيارة أبرز معالمها التاريخية والسياحية.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_13_days, 4, N'اليوم 4', N'التوجه لمطار هانوي للسفر داخلياً إلى مدينة دانانج الساحرة، حيث يتم استقبالكم هناك وتوصيلكم للفندق.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_13_days, 5, N'اليوم 5', N'يوم من الخيال في ''بانا هيلز'' يتضمن ركوب التلفريك، السير على الجسر الذهبي المذهل، والاستمتاع بألعاب فانتازيا بارك الكبرى.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_13_days, 6, N'اليوم 6', N'رحلة تفاعلية ممتعة في قرية جوز الهند المائية ''كام ثانه''، لتجربة قوارب الخيزران الدائرية واصطياد السرطانات، وزيارة جبل ماربل.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_13_days, 7, N'اليوم 7', N'يوم حر ومخصص للاستمتاع بشواطئ دانانج الذهبية أو الاسترخاء في مرافق الفندق الرائعة.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_13_days, 8, N'اليوم 8', N'مغادرة دانانج والعودة جواً إلى هانوي، لتبدأ رحلة برية ممتعة نحو فندق الإقامة في خليج هالونج.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_13_days, 9, N'اليوم 9', N'يوم ساحر على متن رحلة بحرية فاخرة لاكتشاف جماليات وجزر وكهوف خليج هالونج الاستثنائي.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_13_days, 10, N'اليوم 10', N'توديع خليج هالونج والعودة بكل أريحية بسيارة خاصة إلى الفندق في مدينة هانوي.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_13_days, 11, N'اليوم 11', N'يوم سياحي مخصص للتسوق بسيارة خاصة لزيارة أشهر وأفضل الأسواق والمولات في هانوي.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_13_days, 12, N'اليوم 12', N'يوم حر للاستجمام أو استكشاف المزيد من معالم هانوي المحلية على طريقتك الخاصة.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_13_days, 13, N'اليوم 13', N'نهاية الرحلة، والتوديع من الفندق إلى مطار هانوي متمنين لكم رحلة عودة سعيدة وآمنة.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_13_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 8900, 
    TitleEn = N'Amazing فيتنام 14 Days Deal', 
    Subtitle = N'استمتع بـ 13 ليالي من الرفاهية في فندق سيلك باث هانواي - هانوي وغيرها' 
WHERE PackageId = N'pkg-فيتنام-2026-14-days';

DECLARE @PackId_pkg_فيتنام_2026_14_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_فيتنام_2026_14_days = Id FROM Packages WHERE PackageId = N'pkg-فيتنام-2026-14-days';
IF @PackId_pkg_فيتنام_2026_14_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_فيتنام_2026_14_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_فيتنام_2026_14_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_فيتنام_2026_14_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_14_days, N'فندق سيلك باث هانواي - هانوي', N'', 4, 13, N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_14_days, N'فندق باو سابا - مرتفعات سابا', N'', 4, 13, N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', 1);
    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_14_days, N'سيتادنس بيرل هوي ان - دانانج - دانانج', N'', 4, 13, N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', 2);
    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_14_days, N'فندق سوليل هالونج - خليج الهالونج', N'', 4, 13, N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', 3);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_14_days, 1, N'اليوم 1', N'استقبال مميز في مطار هانوي الدولي والتوجه بالسيارة الخاصة إلى الفندق لترتيب الأمتعة والراحة.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_14_days, 2, N'اليوم 2', N'جولة طبيعية لا تُنسى في منطقة ''نينه بينه''، والإبحار بالقوارب بين الجبال الصخرية وحقول الأرز والمرور بالكهوف الخلابة.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_14_days, 3, N'اليوم 3', N'جولة استكشافية متكاملة لزيارة المعالم السياحية والتاريخية العريقة في مدينة هانوي.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_14_days, 4, N'اليوم 4', N'مغادرة هانوي في رحلة ممتعة ومريحة عبر باص النوم الفاخر متوجهين إلى طبيعة سابا الجبلية الساحرة.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_14_days, 5, N'اليوم 5', N'يوم سياحي في سابا للتعرف على قرية ''كات كات'' وتراث قبائل الهومونج، والقيام برحلة بانورامية عبر التلفريك للوصول إلى القمة المرتفعة.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_14_days, 6, N'اليوم 6', N'النزول بالسيارة من سابا إلى مطار هانوي، ثم الطيران الداخلي إلى مدينة دانانج الساحلية ليكون المندوب في استقبالكم وتوصيلكم للفندق.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_14_days, 7, N'اليوم 7', N'مغامرة استثنائية في ''بانا هيلز'' وتجربة التلفريك المذهل، التقاط الصور على الجسر الذهبي، وقضاء وقت ممتع في ملاهي فانتازيا بارك.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_14_days, 8, N'اليوم 8', N'جولة تراثية في قرية جوز الهند ''كام ثانه''، وتجربة التجديف بقوارب السلة الدائرية الممتعة، تليها زيارة جبل ماربل الشهير.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_14_days, 9, N'اليوم 9', N'يوم حر ومخصص للاسترخاء التام على شواطئ دانانج أو الاستمتاع بمرافق الفندق الفاخرة.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_14_days, 10, N'اليوم 10', N'توديع دانانج والعودة بالطيران إلى هانوي، ومنها الانتقال البري المباشر إلى خليج هالونج لتسجيل الدخول في الفندق.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_14_days, 11, N'اليوم 11', N'الاستمتاع بيوم هادئ وجميل في رحلة بحرية فاخرة وسط طبيعة خليج هالونج ومياهه الفيروزية.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_14_days, 12, N'اليوم 12', N'العودة المريحة بالسيارة الخاصة من خليج هالونج إلى العاصمة هانوي لقضاء الأيام الأخيرة من الرحلة.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_14_days, 13, N'اليوم 13', N'يوم حر في مدينة هانوي لتسوق الهدايا التذكارية وتجربة المطاعم الفيتنامية الشهيرة بحرية تامة.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_14_days, 14, N'اليوم 14', N'ختام عطلتكم السعيدة في فيتنام، والتوصيل من الفندق إلى مطار هانوي الدولي للعودة إلى الديار بسلامة الله.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_14_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 3400, 
    TitleEn = N'Amazing فيتنام 7 Days Deal', 
    Subtitle = N'استمتع بـ 6 ليالي من الرفاهية في فندق سيلك باث هانواي - هانوي وغيرها' 
WHERE PackageId = N'pkg-فيتنام-2026-7-days';

DECLARE @PackId_pkg_فيتنام_2026_7_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_فيتنام_2026_7_days = Id FROM Packages WHERE PackageId = N'pkg-فيتنام-2026-7-days';
IF @PackId_pkg_فيتنام_2026_7_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_فيتنام_2026_7_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_فيتنام_2026_7_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_فيتنام_2026_7_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_7_days, N'فندق سيلك باث هانواي - هانوي', N'', 4, 6, N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_7_days, N'فندق سوليل هالونج - خليج الهالونج', N'', 4, 6, N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', 1);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_7_days, 1, N'اليوم 1', N'الاستقبال والترحيب في مطار هانوي الدولي والتوصيل المباشر والمريح بسيارة خاصة إلى الفندق لتسجيل الدخول وأخذ قسط من الراحة لبدء عطلتكم الساحرة.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_7_days, 2, N'اليوم 2', N'يوم سياحي ممتع لاستكشاف ''نينه بينه'' الهادئة والساحرة، تشمل جولة بقوارب السامبان في رصيف تام كوك الشهير للإبحار عبر القرى، حقول الأرز الخضراء، والجبال الصخرية المهيبة، مع المرور بثلاثة كهوف وسط طبيعة خلابة.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_7_days, 3, N'اليوم 3', N'تسجيل الخروج والانتقال المريح بسيارة خاصة من الفندق في هانوي إلى فندق الإقامة الجديد في خليج هالونج الساحر.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_7_days, 4, N'اليوم 4', N'الاستمتاع برحلة بحرية فاخرة واستثنائية لاستكشاف عجائب وجمال خليج هالونج ذي الطبيعة الآسرة.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_7_days, 5, N'اليوم 5', N'العودة بالسيارة الخاصة من خليج هالونج إلى العاصمة هانوي لتسجيل الدخول في الفندق والاسترخاء.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_7_days, 6, N'اليوم 6', N'يوم حر مخصص لك بالكامل لاستكشاف مدينة هانوي النابضة بالحياة، والتجول في أسواقها والاستمتاع بأجوائها على طريقتك الخاصة (بدون سائق).', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_7_days, 7, N'اليوم 7', N'ختام الرحلة السعيدة وتوديع فيتنام، حيث سيتم توصيلكم من الفندق إلى مطار هانوي الدولي للعودة بسلامة الله.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_7_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 4000, 
    TitleEn = N'Amazing فيتنام 8 Days Deal', 
    Subtitle = N'استمتع بـ 7 ليالي من الرفاهية في فندق سيلك باث هانواي - هانوي وغيرها' 
WHERE PackageId = N'pkg-فيتنام-2026-8-days';

DECLARE @PackId_pkg_فيتنام_2026_8_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_فيتنام_2026_8_days = Id FROM Packages WHERE PackageId = N'pkg-فيتنام-2026-8-days';
IF @PackId_pkg_فيتنام_2026_8_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_فيتنام_2026_8_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_فيتنام_2026_8_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_فيتنام_2026_8_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_8_days, N'فندق سيلك باث هانواي - هانوي', N'', 4, 7, N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_8_days, N'فندق سوليل هالونج - خليج الهالونج', N'', 4, 7, N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', 1);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_8_days, 1, N'اليوم 1', N'الاستقبال والترحيب في مطار هانوي الدولي، والانتقال المريح بسيارة خاصة إلى الفندق لتسجيل الدخول والراحة.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_8_days, 2, N'اليوم 2', N'يوم سياحي مذهل لزيارة ''نينه بينه'' ذات الطبيعة الساحرة، يتخلله ركوب قوارب السامبان في رصيف تام كوك، للإبحار وسط الجبال وحقول الأرز والمرور بثلاثة كهوف رائعة.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_8_days, 3, N'اليوم 3', N'جولة سياحية ممتعة لمدة 8 ساعات لاستكشاف أهم المعالم السياحية والتاريخية البارزة في مدينة هانوي.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_8_days, 4, N'اليوم 4', N'مغادرة هانوي والانتقال المريح بسيارة خاصة إلى فندق الإقامة في خليج هالونج الخلاب.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_8_days, 5, N'اليوم 5', N'قضاء يوم لا يُنسى في رحلة بحرية فاخرة لاستكشاف سحر وجمال خليج هالونج المذهل.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_8_days, 6, N'اليوم 6', N'تسجيل الخروج والانتقال بسيارة خاصة من خليج هالونج للعودة إلى مدينة هانوي.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_8_days, 7, N'اليوم 7', N'يوم حر بالكامل للاستجمام أو الانطلاق في جولة تسوق حرة لاستكشاف شوارع هانوي وأسواقها المحلية الممتعة.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_8_days, 8, N'اليوم 8', N'نهاية العطلة والتوديع من الفندق والانتقال إلى مطار هانوي الدولي متمنين لكم رحلة عودة آمنة.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_8_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 5200, 
    TitleEn = N'Amazing فيتنام 9 Days Deal', 
    Subtitle = N'استمتع بـ 8 ليالي من الرفاهية في فندق سيلك باث هانواي - هانوي وغيرها' 
WHERE PackageId = N'pkg-فيتنام-2026-9-days';

DECLARE @PackId_pkg_فيتنام_2026_9_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_فيتنام_2026_9_days = Id FROM Packages WHERE PackageId = N'pkg-فيتنام-2026-9-days';
IF @PackId_pkg_فيتنام_2026_9_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_فيتنام_2026_9_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_فيتنام_2026_9_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_فيتنام_2026_9_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_9_days, N'فندق سيلك باث هانواي - هانوي', N'', 4, 8, N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_9_days, N'فندق باو سابا - مرتفعات سابا', N'', 4, 8, N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', 1);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_9_days, 1, N'اليوم 1', N'استقبال مميز في مطار هانوي الدولي، والتوصيل المباشر بسيارة خاصة إلى الفندق للاستراحة من عناء السفر.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_9_days, 2, N'اليوم 2', N'رحلة استكشافية إلى ''نينه بينه'' للاستمتاع بالطبيعة العذراء، وركوب قوارب السامبان في تام كوك للإبحار عبر الكهوف والجبال وحقول الأرز الخضراء.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_9_days, 3, N'اليوم 3', N'الانطلاق في رحلة برية إلى خليج هالونج الساحر للاستمتاع برحلة بحرية مدهشة واستكشاف جمال الخليج، ثم العودة إلى هانوي.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_9_days, 4, N'اليوم 4', N'تجربة فريدة للانتقال من هانوي إلى مرتفعات سابا الساحرة عبر باص النوم المريح والمجهز.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_9_days, 5, N'اليوم 5', N'جولة سياحية في سابا لزيارة قرية ''كات كات'' الرائعة والتعرف على ثقافة قبائل الهومونج بين حقول الأرز، تليها تجربة ركوب التلفريك الأجمل في العالم للصعود فوق السحاب والتقاط أروع الصور.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_9_days, 6, N'اليوم 6', N'يوم مليء بالجمال في سابا لزيارة الشلالات الطبيعية، الجسر الزجاجي المثير، ومنطقة ''موانا سابا'' المثالية لالتقاط أجمل الصور التذكارية.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_9_days, 7, N'اليوم 7', N'توديع مرتفعات سابا والعودة إلى مدينة هانوي عبر باص النوم المريح لتسجيل الدخول في الفندق.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_9_days, 8, N'اليوم 8', N'يوم حر مخصص لكم للاستمتاع بأجواء هانوي، التسوق وشراء الهدايا، أو تجربة المقاهي المحلية الرائعة.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_9_days, 9, N'اليوم 9', N'ختام الرحلة الجميلة، والتوصيل من الفندق إلى مطار هانوي للعودة إلى أرض الوطن بسلامة الله.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_9_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 3750, 
    TitleEn = N'Amazing فيتنام 2026 5 Days Package', 
    Subtitle = N'استمتع بـ 4 ليالي من الرفاهية في أفضل فنادق فيتنام 2026' 
WHERE PackageId = N'pkg-فيتنام-2026-5-days';

DECLARE @PackId_pkg_فيتنام_2026_5_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_فيتنام_2026_5_days = Id FROM Packages WHERE PackageId = N'pkg-فيتنام-2026-5-days';
IF @PackId_pkg_فيتنام_2026_5_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_فيتنام_2026_5_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_فيتنام_2026_5_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_فيتنام_2026_5_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_5_days, N'فندق الملحم الفاخر - فيتنام 2026', N'', 5, 4, N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_5_days, 1, N'اليوم 1', N'وصف تفصيلي لجولات اليوم رقم 1 في فيتنام 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_5_days, 2, N'اليوم 2', N'وصف تفصيلي لجولات اليوم رقم 2 في فيتنام 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_5_days, 3, N'اليوم 3', N'وصف تفصيلي لجولات اليوم رقم 3 في فيتنام 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_5_days, 4, N'اليوم 4', N'وصف تفصيلي لجولات اليوم رقم 4 في فيتنام 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_5_days, 5, N'اليوم 5', N'وصف تفصيلي لجولات اليوم رقم 5 في فيتنام 2026. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_فيتنام_2026_5_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 6700, 
    TitleEn = N'Amazing ماليزيا 10 Days Deal', 
    Subtitle = N'استمتع بـ 9 ليالي من الرفاهية في صانوي لاجون - سلانجور وغيرها' 
WHERE PackageId = N'pkg-ماليزيا-2026-fly-29-10-days';

DECLARE @PackId_pkg_ماليزيا_2026_fly_29_10_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_ماليزيا_2026_fly_29_10_days = Id FROM Packages WHERE PackageId = N'pkg-ماليزيا-2026-fly-29-10-days';
IF @PackId_pkg_ماليزيا_2026_fly_29_10_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_ماليزيا_2026_fly_29_10_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_ماليزيا_2026_fly_29_10_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_ماليزيا_2026_fly_29_10_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_10_days, N'صانوي لاجون - سلانجور', N'', 4, 9, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_10_days, N'ذا باي فيو لنكاوي هوتيل - جزيرة لانكاوي', N'', 4, 9, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', 1);
    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_10_days, N'فندق أوكوود كوالالمبور - كوالالمبور', N'', 4, 9, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', 2);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_10_days, 1, N'اليوم 1', N'الترحيب الحار في مطار كوالالمبور والانتقال المباشر إلى سيلانجور لتسجيل الدخول في الفندق والاستراحة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_10_days, 2, N'اليوم 2', N'يوم ترفيهي متكامل في ملاهي صنواي لاجون المائية، للاستمتاع بأروع الألعاب المائية والأنشطة المشوقة لجميع أفراد العائلة (بدون سائق).', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_10_days, 3, N'اليوم 3', N'الانتقال إلى المطار للسفر جواً إلى جزيرة لنكاوي الساحرة، حيث يتم الاستقبال والتوصيل إلى فندقكم ذي الإطلالات الطبيعية.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_10_days, 4, N'اليوم 4', N'جولة استكشافية لأهم معالم لنكاوي، تتضمن ركوب التلفريك والجسر المعلق، وزيارة شلالات لنكاوي وميدان النسر الشهير، بالإضافة إلى حديقة التماسيح.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_10_days, 5, N'اليوم 5', N'رحلة غابات المانجروف المذهلة (لمدة 3-4 ساعات) بالقارب، للاستمتاع بمشاهدة إطعام النسور، زيارة كهف الخفافيش، وتأمل الطبيعة البكر.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_10_days, 6, N'اليوم 6', N'توديع جزيرة لنكاوي والعودة بالطيران إلى العاصمة كوالالمبور، ثم الانتقال المريح إلى الفندق الجديد لتسجيل الدخول.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_10_days, 7, N'اليوم 7', N'رحلة برية ممتعة إلى مرتفعات جنتنج الباردة، تشمل ركوب التلفريك وزيارة المعبد الصيني والاستمتاع بالمرافق الترفيهية، ثم العودة للفندق.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_10_days, 8, N'اليوم 8', N'جولة سياحية شاملة في كوالالمبور لزيارة البرجين التوأم، حديقة الحيوانات، أكواريوم عالم البحار، ومنارة كوالالمبور.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_10_days, 9, N'اليوم 9', N'يوم حر في العاصمة الماليزية للاسترخاء التام أو التسوق في أرقى المولات واختيار الهدايا التذكارية.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_10_days, 10, N'اليوم 10', N'نهاية الرحلة والتوصيل من الفندق إلى مطار كوالالمبور الدولي متمنين لكم رحلة عودة آمنة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_10_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 7100, 
    TitleEn = N'Amazing ماليزيا 11 Days Deal', 
    Subtitle = N'استمتع بـ 10 ليالي من الرفاهية في صانوي لاجون - سلانجور وغيرها' 
WHERE PackageId = N'pkg-ماليزيا-2026-fly-29-11-days';

DECLARE @PackId_pkg_ماليزيا_2026_fly_29_11_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_ماليزيا_2026_fly_29_11_days = Id FROM Packages WHERE PackageId = N'pkg-ماليزيا-2026-fly-29-11-days';
IF @PackId_pkg_ماليزيا_2026_fly_29_11_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_ماليزيا_2026_fly_29_11_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_ماليزيا_2026_fly_29_11_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_ماليزيا_2026_fly_29_11_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_11_days, N'صانوي لاجون - سلانجور', N'', 4, 10, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_11_days, N'ذا باي فيو لنكاوي هوتيل - جزيرة لانكاوي', N'', 4, 10, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', 1);
    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_11_days, N'فندق أوكوود كوالالمبور - كوالالمبور', N'', 4, 10, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', 2);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_11_days, 1, N'اليوم 1', N'الاستقبال في مطار كوالالمبور الدولي بكل ود والانتقال السلس إلى سيلانجور لبدء إجازتكم السعيدة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_11_days, 2, N'اليوم 2', N'الانطلاق لقضاء يوم مليء بالإثارة في صنواي لاجون، أكبر مدن الألعاب المائية، للاستمتاع بالمسابح والأنشطة المتنوعة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_11_days, 3, N'اليوم 3', N'مغادرة سيلانجور والتوجه جواً إلى جزيرة لنكاوي الهادئة، ليتم الاستقبال والتوصيل المباشر إلى الفندق.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_11_days, 4, N'اليوم 4', N'جولة استكشافية مذهلة في لنكاوي لركوب التلفريك المرتفع، وزيارة الجسر المعلق، وميدان النسر، والتنزه عند شلالات لنكاوي الساحرة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_11_days, 5, N'اليوم 5', N'رحلة نهرية في غابات المانجروف الفريدة، تشمل متعة مشاهدة إطعام النسور عن قرب واستكشاف الكهوف الطبيعية المتنوعة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_11_days, 6, N'اليوم 6', N'يوم حر للاسترخاء على شواطئ لنكاوي الجميلة، أو للاستمتاع بمرافق الفندق ذو الإطلالة الساحرة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_11_days, 7, N'اليوم 7', N'توديع لنكاوي والسفر جواً للعودة إلى العاصمة كوالالمبور، ومنها الانتقال إلى الفندق لتسجيل الدخول.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_11_days, 8, N'اليوم 8', N'يوم استثنائي في مرتفعات جنتنج ذات الطقس البارد، مع تجربة ركوب التلفريك البانورامي وزيارة معبد تشين سوي والاستمتاع بالترفيه.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_11_days, 9, N'اليوم 9', N'جولة كوالالمبور الثقافية والترفيهية لزيارة البرجين التوأم، الأكواريوم، حديقة الحيوانات، ومعالم المدينة البارزة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_11_days, 10, N'اليوم 10', N'يوم حر للاستجمام أو الانطلاق في جولة تسوق خاصة لشراء الهدايا من أسواق ومولات كوالالمبور العصرية.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_11_days, 11, N'اليوم 11', N'ختام العطلة الجميلة، والتوصيل من الفندق إلى مطار كوالالمبور الدولي للعودة إلى أرض الوطن.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_11_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 6900, 
    TitleEn = N'Amazing ماليزيا  12 Days Deal', 
    Subtitle = N'استمتع بـ 11 ليالي من الرفاهية في صانوي لاجون - سلانجور  وغيرها' 
WHERE PackageId = N'pkg-ماليزيا-2026-fly-29-12-days';

DECLARE @PackId_pkg_ماليزيا_2026_fly_29_12_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_ماليزيا_2026_fly_29_12_days = Id FROM Packages WHERE PackageId = N'pkg-ماليزيا-2026-fly-29-12-days';
IF @PackId_pkg_ماليزيا_2026_fly_29_12_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_ماليزيا_2026_fly_29_12_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_ماليزيا_2026_fly_29_12_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_ماليزيا_2026_fly_29_12_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_12_days, N'صانوي لاجون - سلانجور ', N'', 4, 11, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_12_days, N'ذا باي فيو لنكاوي هوتيل - جزيرة لانكاوي ', N'', 4, 11, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', 1);
    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_12_days, N'همبتون بينانغ هوتيل - جزيرة بينانغ ', N'', 4, 11, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', 2);
    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_12_days, N'فندق أوكوود كوالالمبور - كوالالمبور ', N'', 4, 11, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', 3);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_12_days, 1, N'اليوم 1', N'استقبال دولي في مطار كوالالمبور والتوصيل إلى الفندق في سيلانجور للراحة والاستعداد لبدء الرحلة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_12_days, 2, N'اليوم 2', N'جولة ممتعة في مدينة الألعاب المائية صنواي لاجون، أكبر ملاهي مائية في شرق آسيا، للاستمتاع بالألعاب المائية والكهربائية، المسابح، حديقة الحيوانات، السواحل الصناعية، وبيت الرعب، في يوم كامل مليء بالمرح (بدون سائق حيث تقع الحديقة بجوار الفندق مباشرة).', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_12_days, 3, N'اليوم 3', N'توديع سيلانجور والتوصيل إلى المطار للمغادرة إلى جزيرة لنكاوي، حيث يتم الاستقبال في مطار جزيرة لنكاوي والتوصيل إلى الفندق المخصص.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_12_days, 4, N'اليوم 4', N'جولة لمدة 8 ساعات بسيارة خاصة لاستكشاف أهم معالم لنكاوي، تشمل تجربة تلفريك لنكاوي للاستمتاع بمنظر الجزيرة، زيارة الجسر المعلق، شلالات لنكاوي، التقاط الصور في ميدان النسر الشهير، وزيارة حديقة التماسيح.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_12_days, 5, N'اليوم 5', N'رحلة المانجروف الرائعة في لنكاوي (تستغرق من 3 إلى 4 ساعات) للتمتع بالمناظر الطبيعية الخلابة، والتي تتضمن إطعام النسور وزيارة الكهف.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_12_days, 6, N'اليوم 6', N'توديع لنكاوي والتوصيل للمطار للانتقال إلى جزيرة بينانج، حيث يتم الاستقبال في مطار بينانج والتوصيل إلى الفندق للراحة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_12_days, 7, N'اليوم 7', N'جولة سياحية بسيارة خاصة لمدة 8 ساعات في بينانج، تشمل صعود هضبة بينانج بقطار جبلي، زيارة حديقة الفواكه، حديقة الزهور التي تضم أندر الورود، الحدائق الاستوائية، حديقة الفراشات، شلالات بينانج، ومصنع الشوكولاتة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_12_days, 8, N'اليوم 8', N'يوم حر مخصص للراحة والاستجمام داخل الفندق والاستمتاع بمرافقه.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_12_days, 9, N'اليوم 9', N'توديع جزيرة بينانج والتوصيل للمطار للتوجه إلى العاصمة كوالالمبور، ثم الاستقبال في مطار كوالالمبور الدولي والتوصيل إلى الفندق.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_12_days, 10, N'اليوم 10', N'جولة إلى مرتفعات جنتنج الباردة عبر رحلة بتلفريك أوانا سكايواي الساحر فوق السحاب والغابات، للاستمتاع بمراكز الترفيه، السنوكر، البولينج، الرماية، وتسلق الجدار، مع زيارة معبد تشين سوي الصيني العريق.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_12_days, 11, N'اليوم 11', N'يوم حر في كوالالمبور للاستجمام في الفندق واستكشاف الأماكن القريبة سيراً على الأقدام بحرية تامة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_12_days, 12, N'اليوم 12', N'ختام الرحلة بتوديع كوالالمبور والتوصيل من الفندق إلى المطار للعودة إلى أرض الوطن بسلامة الله.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_12_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 8800, 
    TitleEn = N'Amazing ماليزيا 13 Days Deal', 
    Subtitle = N'استمتع بـ 12 ليالي من الرفاهية في صانوي لاجون - سلانجور وغيرها' 
WHERE PackageId = N'pkg-ماليزيا-2026-fly-29-13-days';

DECLARE @PackId_pkg_ماليزيا_2026_fly_29_13_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_ماليزيا_2026_fly_29_13_days = Id FROM Packages WHERE PackageId = N'pkg-ماليزيا-2026-fly-29-13-days';
IF @PackId_pkg_ماليزيا_2026_fly_29_13_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_ماليزيا_2026_fly_29_13_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_ماليزيا_2026_fly_29_13_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_ماليزيا_2026_fly_29_13_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_13_days, N'صانوي لاجون - سلانجور', N'', 4, 12, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_13_days, N'ذا باي فيو لنكاوي هوتيل - جزيرة لانكاوي', N'', 4, 12, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', 1);
    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_13_days, N'همبتون بينانغ هوتيل - جزيرة بينانغ', N'', 4, 12, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', 2);
    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_13_days, N'فندق أوكوود كوالالمبور - كوالالمبور', N'', 4, 12, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', 3);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_13_days, 1, N'اليوم 1', N'الاستقبال في مطار كوالالمبور الدولي والانتقال بكل راحة إلى فندقكم في سيلانجور لبدء الإجازة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_13_days, 2, N'اليوم 2', N'يوم مليء بالحيوية والمرح في ملاهي صنواي لاجون المائية الكبرى للاستمتاع بجميع مرافقها (بدون سائق).', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_13_days, 3, N'اليوم 3', N'توديع سيلانجور والسفر جواً إلى جزيرة لنكاوي، حيث يتلقاكم المندوب للتوجه إلى فندق الإقامة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_13_days, 4, N'اليوم 4', N'مغامرة لنكاوي المميزة بتجربة ركوب التلفريك، التقاط الصور على الجسر المعلق، وزيارة شلالات لنكاوي الخلابة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_13_days, 5, N'اليوم 5', N'رحلة قارب ساحرة في غابات المانجروف، للتمتع بالطبيعة ومشاهدة النسور واكتشاف الكهوف المائية.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_13_days, 6, N'اليوم 6', N'مغادرة لنكاوي براً أو بحراً/جواً إلى جزيرة بينانج، لتسجيل الدخول في الفندق والتمتع بأجواء الجزيرة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_13_days, 7, N'اليوم 7', N'جولة سياحية غنية في بينانج لزيارة هضبة بينانج الشهيرة، حديقة الزهور، حديقة الفراشات، ومصنع الشوكولاتة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_13_days, 8, N'اليوم 8', N'يوم حر في جزيرة بينانج للراحة والاسترخاء التام على الشواطئ الرملية أو ممارسة الأنشطة البحرية.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_13_days, 9, N'اليوم 9', N'توديع بينانج والسفر إلى كوالالمبور، لتسجيل الدخول في الفندق وبدء استكشاف العاصمة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_13_days, 10, N'اليوم 10', N'جولة سياحية لاكتشاف كوالالمبور تشمل البرجين التوأم، حديقة الحيوانات الممتعة، والأكواريوم المدهش.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_13_days, 11, N'اليوم 11', N'رحلة لمرتفعات جنتنج الباردة، تشمل ركوب التلفريك البانورامي، قضاء وقت ممتع في الملاهي، وزيارة معبد تشين سوي.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_13_days, 12, N'اليوم 12', N'يوم حر في العاصمة للتسوق الحر من أرقى المولات وتجربة المطاعم المتنوعة (بدون سائق).', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_13_days, 13, N'اليوم 13', N'انتهاء العطلة السعيدة، والتوصيل من الفندق إلى مطار كوالالمبور متمنين لكم رحلة عودة آمنة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_13_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 9600, 
    TitleEn = N'Amazing ماليزيا 14 Days Deal', 
    Subtitle = N'استمتع بـ 13 ليالي من الرفاهية في صانوي لاجون - سلانجور وغيرها' 
WHERE PackageId = N'pkg-ماليزيا-2026-fly-29-14-days';

DECLARE @PackId_pkg_ماليزيا_2026_fly_29_14_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_ماليزيا_2026_fly_29_14_days = Id FROM Packages WHERE PackageId = N'pkg-ماليزيا-2026-fly-29-14-days';
IF @PackId_pkg_ماليزيا_2026_fly_29_14_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_ماليزيا_2026_fly_29_14_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_ماليزيا_2026_fly_29_14_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_ماليزيا_2026_fly_29_14_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_14_days, N'صانوي لاجون - سلانجور', N'', 4, 13, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_14_days, N'ذا باي فيو لنكاوي هوتيل - جزيرة لانكاوي', N'', 4, 13, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', 1);
    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_14_days, N'همبتون بينانغ هوتيل - جزيرة بينانغ', N'', 4, 13, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', 2);
    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_14_days, N'فندق سويس جاردن جينتنج هايلاندز - جنتنج هايلند', N'', 4, 13, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', 3);
    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_14_days, N'فندق أوكوود كوالالمبور - كوالالمبور', N'', 4, 13, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', 4);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_14_days, 1, N'اليوم 1', N'الترحيب بكم في مطار كوالالمبور، والانتقال السلس إلى سيلانجور لتسجيل الدخول بالفندق والراحة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_14_days, 2, N'اليوم 2', N'قضاء أوقات لا تُنسى في صنواي لاجون، والاستمتاع بمدينة الألعاب المائية المتكاملة وحديقة الحيوانات المرفقة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_14_days, 3, N'اليوم 3', N'التوجه إلى المطار للسفر لجزيرة لنكاوي ذات الطبيعة الخلابة، والاستقبال هناك ثم التوصيل للفندق.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_14_days, 4, N'اليوم 4', N'جولة استكشافية لمعالم لنكاوي تشمل تلفريك لنكاوي الرائع، الجسر المعلق، شلالات لنكاوي المنعشة، وميدان النسر.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_14_days, 5, N'اليوم 5', N'رحلة نهرية مدهشة عبر غابات المانجروف لمشاهدة إطعام النسور واستكشاف الطبيعة والكهوف، تليها العودة للفندق.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_14_days, 6, N'اليوم 6', N'توديع لنكاوي والانتقال إلى جزيرة بينانج الساحرة، لتسجيل الدخول في الفندق الجديد وتجديد النشاط.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_14_days, 7, N'اليوم 7', N'الانطلاق في جولة بينانج السياحية، لزيارة هضبة بينانج والحدائق الاستوائية، حديقة الفراشات، ومصنع الشوكولاتة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_14_days, 8, N'اليوم 8', N'يوم حر للاسترخاء والسباحة على شواطئ بينانج والاستمتاع بالمرافق السياحية المنتشرة حول الفندق.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_14_days, 9, N'اليوم 9', N'مغادرة بينانج والتوجه نحو مرتفعات جنتنج ذات الأجواء الباردة والمنعشة لتسجيل الدخول والاستمتاع بالطبيعة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_14_days, 10, N'اليوم 10', N'قضاء يوم ترفيهي في جنتنج لركوب التلفريك بين السحاب وتجربة الملاهي والألعاب، وزيارة معبد تشين سوي.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_14_days, 11, N'اليوم 11', N'النزول من مرتفعات جنتنج والعودة إلى العاصمة كوالالمبور لتسجيل الدخول في الفندق الجديد للراحة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_14_days, 12, N'اليوم 12', N'جولة ممتعة في كوالالمبور لزيارة أشهر معالمها مثل البرجين التوأم، منارة كوالالمبور، والأكواريوم المائي.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_14_days, 13, N'اليوم 13', N'يوم حر ومفتوح في كوالالمبور، يتيح لكم فرصة التسوق في المولات الفاخرة وشراء الهدايا التذكارية بكل حرية.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_14_days, 14, N'اليوم 14', N'ختام العطلة الماليزية السعيدة، والتوصيل من الفندق إلى مطار كوالالمبور الدولي لرحلة العودة بسلامة الله.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_14_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 2800, 
    TitleEn = N'Amazing ماليزيا 6 Days Deal', 
    Subtitle = N'استمتع بـ 5 ليالي من الرفاهية في فندق أوكوود كوالالمبور - كوالالمبور وغيرها' 
WHERE PackageId = N'pkg-ماليزيا-2026-fly-29-6-days';

DECLARE @PackId_pkg_ماليزيا_2026_fly_29_6_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_ماليزيا_2026_fly_29_6_days = Id FROM Packages WHERE PackageId = N'pkg-ماليزيا-2026-fly-29-6-days';
IF @PackId_pkg_ماليزيا_2026_fly_29_6_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_ماليزيا_2026_fly_29_6_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_ماليزيا_2026_fly_29_6_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_ماليزيا_2026_fly_29_6_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_6_days, N'فندق أوكوود كوالالمبور - كوالالمبور', N'', 4, 5, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_6_days, 1, N'اليوم 1', N'الاستقبال في مطار كوالالمبور الدولي بكل ترحاب والانتقال المريح إلى فندق الإقامة للراحة والاستعداد لبدء الرحلة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_6_days, 2, N'اليوم 2', N'جولة ممتعة في مدينة الألعاب المائية صنواي لاجون، أكبر ملاهي مائية في شرق آسيا، للاستمتاع بالألعاب المائية والكهربائية وحديقة الحيوانات وقضاء يوم مليء بالمرح.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_6_days, 3, N'اليوم 3', N'جولة سياحية لاكتشاف سحر العاصمة كوالالمبور، تشمل زيارة البرجين التوأم، منارة كوالالمبور، وحديقة الحيوانات، واكتشاف عالم ما تحت البحار في الأكواريوم.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_6_days, 4, N'اليوم 4', N'جولة مسائية ساحرة إلى مدينة الأضواء (I-City)، للاستمتاع بالمدينة الثلجية ومتحف الشمع، وقضاء وقت ممتع وسط الفعاليات المضيئة والألعاب.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_6_days, 5, N'اليوم 5', N'يوم حر في كوالالمبور يتيح لك الاستمتاع بمرافق الفندق أو التسوق والتجول الحر لاستكشاف الأسواق والمناطق القريبة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_6_days, 6, N'اليوم 6', N'ختام العطلة السعيدة في ماليزيا وتوديعكم من الفندق إلى مطار كوالالمبور للعودة بسلامة الله.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_6_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 3300, 
    TitleEn = N'Amazing ماليزيا 7 Days Deal', 
    Subtitle = N'استمتع بـ 6 ليالي من الرفاهية في صانوي لاجون - سلانجور وغيرها' 
WHERE PackageId = N'pkg-ماليزيا-2026-fly-29-7-days';

DECLARE @PackId_pkg_ماليزيا_2026_fly_29_7_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_ماليزيا_2026_fly_29_7_days = Id FROM Packages WHERE PackageId = N'pkg-ماليزيا-2026-fly-29-7-days';
IF @PackId_pkg_ماليزيا_2026_fly_29_7_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_ماليزيا_2026_fly_29_7_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_ماليزيا_2026_fly_29_7_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_ماليزيا_2026_fly_29_7_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_7_days, N'صانوي لاجون - سلانجور', N'', 4, 6, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_7_days, N'فندق أوكوود كوالالمبور - كوالالمبور', N'', 4, 6, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', 1);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_7_days, 1, N'اليوم 1', N'استقبال دولي مميز في مطار كوالالمبور والانتقال المريح إلى فندق الإقامة في ولاية سيلانجور للراحة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_7_days, 2, N'اليوم 2', N'قضاء يوم كامل من المتعة في مدينة الألعاب المائية صنواي لاجون الشهيرة، والاستمتاع بالألعاب المائية المتنوعة، حديقة الحيوانات، وبيت الرعب (بدون سائق).', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_7_days, 3, N'اليوم 3', N'توديع سيلانجور والانتقال المريح بالسيارة الخاصة إلى العاصمة النابضة بالحياة كوالالمبور لتسجيل الدخول في الفندق.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_7_days, 4, N'اليوم 4', N'جولة استكشافية لمعالم كوالالمبور، تتضمن زيارة البرجين التوأم، منارة كوالالمبور، حديقة الحيوانات، والغوص في أسرار المحيط في أكواريوم عالم تحت البحار.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_7_days, 5, N'اليوم 5', N'رحلة مسائية إلى مدينة الأضواء (I-City)، للاستمتاع بالأجواء الباردة في المدينة الثلجية، والتقاط الصور في متحف الشمع، وتجربة الألعاب الممتعة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_7_days, 6, N'اليوم 6', N'يوم حر بالكامل للاستجمام في الفندق، أو الانطلاق في جولة تسوق خاصة لشراء الهدايا التذكارية من أرقى مولات كوالالمبور.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_7_days, 7, N'اليوم 7', N'نهاية الرحلة الممتعة، وتوديع كوالالمبور والانتقال من الفندق إلى المطار لرحلة العودة إلى أرض الوطن.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_7_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 4300, 
    TitleEn = N'Amazing ماليزيا 8 Days Deal', 
    Subtitle = N'استمتع بـ 7 ليالي من الرفاهية في صانوي لاجون - سلانجور وغيرها' 
WHERE PackageId = N'pkg-ماليزيا-2026-fly-29-8-days';

DECLARE @PackId_pkg_ماليزيا_2026_fly_29_8_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_ماليزيا_2026_fly_29_8_days = Id FROM Packages WHERE PackageId = N'pkg-ماليزيا-2026-fly-29-8-days';
IF @PackId_pkg_ماليزيا_2026_fly_29_8_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_ماليزيا_2026_fly_29_8_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_ماليزيا_2026_fly_29_8_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_ماليزيا_2026_fly_29_8_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_8_days, N'صانوي لاجون - سلانجور', N'', 4, 7, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_8_days, N'فندق سويس جاردن جينتنج هايلاندز - جنتنج هايلند', N'', 4, 7, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', 1);
    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_8_days, N'فندق أوكوود كوالالمبور - كوالالمبور', N'', 4, 7, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', 2);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_8_days, 1, N'اليوم 1', N'الاستقبال بحفاوة في مطار كوالالمبور الدولي والانتقال السلس إلى الفندق في سيلانجور لبدء عطلتكم.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_8_days, 2, N'اليوم 2', N'الانطلاق لقضاء يوم مليء بالإثارة في صنواي لاجون، أكبر مدن الألعاب المائية في آسيا، للاستمتاع بالمسابح والألعاب الكهربائية وحديقة الحيوانات (بدون سائق).', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_8_days, 3, N'اليوم 3', N'مغادرة سيلانجور والتوجه نحو مرتفعات جنتنج الباردة، مع الاستمتاع بالطبيعة الجبلية الساحرة وتسجيل الدخول في الفندق.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_8_days, 4, N'اليوم 4', N'جولة رائعة في جنتنج تشمل ركوب التلفريك للاستمتاع بإطلالة بانورامية فوق السحاب، وزيارة معبد تشين سوي الصيني، تليها رحلة الانتقال إلى العاصمة كوالالمبور.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_8_days, 5, N'اليوم 5', N'جولة سياحية للتعرف على أبرز معالم كوالالمبور، من البرجين التوأم إلى منارة كوالالمبور، مروراً بحديقة الحيوانات والأكواريوم.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_8_days, 6, N'اليوم 6', N'جولة ترفيهية مسائية في مدينة الأضواء (I-City)، تشمل زيارة المدينة الثلجية ومتحف الشمع والاستمتاع بالأجواء المضيئة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_8_days, 7, N'اليوم 7', N'يوم حر في كوالالمبور للاسترخاء التام في مرافق الفندق أو التجول الحر في الأسواق المجاورة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_8_days, 8, N'اليوم 8', N'ختام العطلة السعيدة والتوصيل المريح من فندق كوالالمبور إلى المطار رافقتكم السلامة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_8_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 5250, 
    TitleEn = N'Amazing ماليزيا 9 Days Deal', 
    Subtitle = N'استمتع بـ 8 ليالي من الرفاهية في صانوي لاجون - سلانجور وغيرها' 
WHERE PackageId = N'pkg-ماليزيا-2026-fly-29-9-days';

DECLARE @PackId_pkg_ماليزيا_2026_fly_29_9_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_ماليزيا_2026_fly_29_9_days = Id FROM Packages WHERE PackageId = N'pkg-ماليزيا-2026-fly-29-9-days';
IF @PackId_pkg_ماليزيا_2026_fly_29_9_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_ماليزيا_2026_fly_29_9_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_ماليزيا_2026_fly_29_9_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_ماليزيا_2026_fly_29_9_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_9_days, N'صانوي لاجون - سلانجور', N'', 4, 8, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_9_days, N'فندق سويس جاردن جينتنج هايلاندز - جنتنج هايلند', N'', 4, 8, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', 1);
    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_9_days, N'فندق أوكوود كوالالمبور - كوالالمبور', N'', 4, 8, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', 2);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_9_days, 1, N'اليوم 1', N'استقبالكم في مطار كوالالمبور والتوجه بالسيارة الخاصة إلى فندقكم في سيلانجور للراحة والاستعداد للمغامرة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_9_days, 2, N'اليوم 2', N'يوم حافل بالمرح العائلي في ملاهي صنواي لاجون المائية، حيث تتنوع الألعاب المائية والكهربائية وتجارب المغامرة (بدون سائق).', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_9_days, 3, N'اليوم 3', N'توديع سيلانجور والانتقال المريح إلى مرتفعات جنتنج ذات الأجواء الباردة والمنعشة لتسجيل الدخول في الفندق.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_9_days, 4, N'اليوم 4', N'الاستمتاع بجمال جنتنج عبر ركوب التلفريك (أوانا سكاي واي) بين السحاب، وزيارة معبد تشين سوي العريق، واكتشاف مراكز الترفيه المتنوعة بالمرتفعات.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_9_days, 5, N'اليوم 5', N'الانتقال من طبيعة جنتنج الجبلية إلى سحر العاصمة كوالالمبور، وتدوين الدخول في الفندق الجديد.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_9_days, 6, N'اليوم 6', N'جولة كوالالمبور السياحية لاستكشاف البرجين التوأم، منارة كوالالمبور، حديقة الحيوانات المفتوحة، وعالم ما تحت البحار في الأكواريوم.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_9_days, 7, N'اليوم 7', N'جولة ساحرة إلى مدينة الأضواء (I-City) لتجربة المدينة الثلجية، ومتحف الشمع، والتمتع بالألعاب الضوئية والفعاليات الليلية.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_9_days, 8, N'اليوم 8', N'يوم حر ومفتوح في كوالالمبور، فرصة للتسوق واقتناء الهدايا أو الاسترخاء في كافيهات المدينة.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_9_days, 9, N'اليوم 9', N'التوديع في اليوم الأخير، والانتقال من الفندق إلى مطار كوالالمبور للعودة إلى الديار بسلامة الله.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_9_days, N'مسار رحلة ممتاز');
END

GO

UPDATE Packages 
SET Price = 3750, 
    TitleEn = N'Amazing ماليزيا 2026 FLY 29 5 Days Package', 
    Subtitle = N'استمتع بـ 4 ليالي من الرفاهية في أفضل فنادق ماليزيا 2026 FLY 29' 
WHERE PackageId = N'pkg-ماليزيا-2026-fly-29-5-days';

DECLARE @PackId_pkg_ماليزيا_2026_fly_29_5_days UNIQUEIDENTIFIER;
SELECT @PackId_pkg_ماليزيا_2026_fly_29_5_days = Id FROM Packages WHERE PackageId = N'pkg-ماليزيا-2026-fly-29-5-days';
IF @PackId_pkg_ماليزيا_2026_fly_29_5_days IS NOT NULL
BEGIN
    DELETE FROM PackageHotels WHERE PackageId = @PackId_pkg_ماليزيا_2026_fly_29_5_days;
    DELETE FROM PackageItineraries WHERE PackageId = @PackId_pkg_ماليزيا_2026_fly_29_5_days;
    DELETE FROM PackageFeatures WHERE PackageId = @PackId_pkg_ماليزيا_2026_fly_29_5_days;

    INSERT INTO PackageHotels (Id, PackageId, Name, Location, Stars, NightsCount, DayImageUrl, NightImageUrl, SortOrder)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_5_days, N'فندق الملحم الفاخر - ماليزيا 2026 FLY 29', N'', 5, 4, N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop', 0);
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_5_days, 1, N'اليوم 1', N'وصف تفصيلي لجولات اليوم رقم 1 في ماليزيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_5_days, 2, N'اليوم 2', N'وصف تفصيلي لجولات اليوم رقم 2 في ماليزيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_5_days, 3, N'اليوم 3', N'وصف تفصيلي لجولات اليوم رقم 3 في ماليزيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_5_days, 4, N'اليوم 4', N'وصف تفصيلي لجولات اليوم رقم 4 في ماليزيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');
    INSERT INTO PackageItineraries (Id, PackageId, Day, Title, Description, ImageUrl)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_5_days, 5, N'اليوم 5', N'وصف تفصيلي لجولات اليوم رقم 5 في ماليزيا 2026 FLY 29. الإفطار في الفندق والانطلاق للفعاليات.', N'https://images.unsplash.com/photo-1549488344-c6c7bf4b1fc7?q=80&w=1920&auto=format&fit=crop');

    INSERT INTO PackageFeatures (Id, PackageId, Text)
    VALUES (NEWID(), @PackId_pkg_ماليزيا_2026_fly_29_5_days, N'مسار رحلة ممتاز');
END

GO

