-- ==============================================================
-- سكربت تفعيل حماية التزامن (Optimistic Concurrency)
-- ==============================================================
-- يرجى تشغيل هذا السكربت على السيرفر مباشرة عبر SQL Server Management Studio

-- 1. قاعدة بيانات VoucherPro
USE [db40744]; -- عدل هذا لاسم الداتا بيز الحقيقي لو اختلف
GO

-- إضافة عمود التزامن لجدول طلبات العملاء
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[CustomerRequests]') AND name = 'RowVersion')
BEGIN
    ALTER TABLE [dbo].[CustomerRequests] ADD [RowVersion] timestamp;
    PRINT 'تمت إضافة RowVersion لجدول CustomerRequests';
END
GO

-- إضافة عمود التزامن لجدول العروض
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Quotations]') AND name = 'RowVersion')
BEGIN
    ALTER TABLE [dbo].[Quotations] ADD [RowVersion] timestamp;
    PRINT 'تمت إضافة RowVersion لجدول Quotations';
END
GO


-- 2. قاعدة البيانات الأساسية للموقع (Main Database)
-- USE [اسم_قاعدة_البيانات_الرئيسية];
-- GO

-- إضافة عمود التزامن لجدول رحلات الطيران
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[FlightSchedules]') AND name = 'RowVersion')
BEGIN
    ALTER TABLE [dbo].[FlightSchedules] ADD [RowVersion] timestamp;
    PRINT 'تمت إضافة RowVersion لجدول FlightSchedules';
END
GO

-- إضافة عمود التزامن لجدول الحجوزات (في حال لم يكن مضافاً مسبقاً)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Bookings]') AND name = 'RowVersion')
BEGIN
    ALTER TABLE [dbo].[Bookings] ADD [RowVersion] timestamp;
    PRINT 'تمت إضافة RowVersion لجدول Bookings';
END
GO
