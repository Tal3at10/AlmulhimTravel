# خطة العمل المرجعية الشاملة — Almulhim Travel

## 1. ملخص تنفيذي
الميزة المطلوبة — **Agent Bidding & Automated Comparison** — موجودة بالفعل داخل خدمة VoucherPro. إذن الهدف ليس البناء من الصفر، بل:
- إغلاق الثغرات الأمنية الحرجة أولًا.
- ربط VoucherPro بالـ Backend الرئيسي ولوحة الإدارة والواتساب.
- تفعيل بوابة الوكلاء (Agent Portal) وتحسين AI Extraction.
- استيفاء معايير PCI / GDS / IATA قبل التوسع.

---

## 2. المراجعة الأمنية والكودية التفصيلية

### 2.1 نطاق المراجعة
بناءً على قراءة الملفات الفعلية، تم فحص:
- `backend/src/Core.Application/Services/Identity/AuthService.cs`
- `backend/src/Core.Application/Services/Reservations/PaymentService.cs`
- `backend/src/Core.Application/Services/Reservations/BookingService.cs`
- `backend/src/Infrastructure.Shared/Settings/VoucherProSettings.cs`
- `backend/src/Infrastructure.Shared/Services/VoucherProIntegrationService.cs`
- `backend/src/APIs/Controllers/Admin*Controller.cs`
- `Voucher Pro/VoucherPro.APIs/Program.cs`
- `Voucher Pro/VoucherPro.APIs/Controllers/CustomerRequestsController.cs`
- `Voucher Pro/VoucherPro.APIs/Controllers/QuotationsController.cs`
- `Voucher Pro/VoucherPro.Core.Application/Services/CustomerRequestService.cs`
- `Voucher Pro/VoucherPro.Core.Application/Services/QuotationService.cs`
- `Voucher Pro/VoucherPro.Core.Application/Services/AgentService.cs`
- `Voucher Pro/VoucherPro.APIs/Hubs/QuotationHub.cs`
- `Voucher Pro/VoucherPro.APIs/Services/GeminiService.cs`
- `admin/vite.config.js` و `vite.config.js`

### 2.2 الثغرات الحرجة (Critical) — مع تفاصيل الكود

#### 1. تسريب أسرار VoucherPro
**الملفات المشتبهة:**
- `Voucher Pro/VoucherPro_Clean_Publish/appsettings.json` (وملفات البيئات الأخرى)
**المكشوف:** عنوان السيرفر `db40744.public.databaseasp.net`، SQL user/password، و JWT SecretKey.
**الإجراء:**
- تدوير SQL user/pass فورًا.
- تغيير JWT SecretKey لطول >= 64 bytes مشفر Base64.
- حذف مجلدات `publish/` و `VoucherPro_Clean_Publish/` من المصدر.
- نقل الأسرار إلى Azure Key Vault أو Environment Variables.

#### 2. إعادة تعيين كلمة المرور بدون تحقق من التوكن
**الملف:** `backend/src/Core.Application/Services/Identity/AuthService.cs`
**المشكلة:** `GeneratePasswordResetTokenAsync` توَلّد توكن ولكن لا تُخزّنه. `ResetPasswordAsync` تأخذ email + newPassword فقط بدون أي token.
**التعديل المقترح:**
```csharp
public async Task<string> GeneratePasswordResetTokenAsync(string email)
{
    var user = await _userManager.FindByEmailAsync(email);
    if (user == null) return null;

    var rawToken = Convert.ToHexString(RandomNumberGenerator.GetBytes(32));
    var tokenHash = SHA256.HashData(Encoding.UTF8.GetBytes(rawToken));

    await _dbContext.PasswordResetTokens.AddAsync(new PasswordResetToken
    {
        UserId = user.Id,
        Email = email,
        TokenHash = Convert.ToHexString(tokenHash),
        ExpiresAt = DateTime.UtcNow.AddMinutes(15),
        CreatedAt = DateTime.UtcNow
    });
    await _dbContext.SaveChangesAsync();
    return rawToken;
}

public async Task<Result> ResetPasswordAsync(string email, string token, string newPassword)
{
    var tokenHash = Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(token)));
    var reset = await _dbContext.PasswordResetTokens
        .FirstOrDefaultAsync(t => t.Email == email 
                               && t.TokenHash == tokenHash 
                               && t.ExpiresAt > DateTime.UtcNow 
                               && t.UsedAt == null);

    if (reset == null) return Result.Failure("Invalid or expired token");

    var user = await _userManager.FindByEmailAsync(email);
    var result = await _userManager.ResetPasswordAsync(user, await _userManager.GeneratePasswordResetTokenAsync(user), newPassword);
    reset.UsedAt = DateTime.UtcNow;
    await _dbContext.SaveChangesAsync();
    return Result.Success();
}
```

#### 3. الدفع يسجّل "ناجح" دائمًا
**الملف:** `backend/src/Core.Application/Services/Reservations/PaymentService.cs`
**المشكلة:** `payment.Status = PaymentStatus.Completed;` ويُستخدم ذكر 4242 كبطاقة اختبار، مما يعني أي دفعة في Production ستُنفذ وهميًا.
**الإجراء:**
في `appsettings.Production.json` وضع `"Payment:SimulationMode": false`. وفي الكود:
```csharp
if (_settings.SimulationMode)
{
    payment.Status = PaymentStatus.Completed;
    return;
}
// وإلا: استدعِ Moyasar/Tabby/Tamara وتحقق من الـ callback
```

#### 4. رقم المرجع عشوائي بدون تفريد
**الملف:** `backend/src/Core.Application/Services/Reservations/BookingService.cs`
**المشكلة:** `Random.Next(...)` يُنتج قيمًا قابلة للتكرار، ولا يوجد Unique Constraint مطبق.
**الإجراء:**
```csharp
// Booking.cs
[Index(nameof(ReferenceNumber), IsUnique = true)]
public class Booking { ... }

private string GenerateReferenceNumber()
    => $"ALM-{DateTime.UtcNow:yyMM}-{Ulid.NewUlid()}".ToUpperInvariant();
```

#### 5. كلمة مرور افتراضية في VoucherProSettings
**الملف:** `backend/src/Infrastructure.Shared/Settings/VoucherProSettings.cs`
**المشكلة:** `Password = "Admin@123";`
**الإجراء:** إزالة القيمة الافتراضية:
```csharp
public string Password { get; set; } = null!;
```

#### 6. Fallback JWT Secret في AgentService
**الملف:** `Voucher Pro/VoucherPro.Core.Application/Services/AgentService.cs`
**الإجراء:**
```csharp
var secretKey = _configuration["Jwt:SecretKey"] 
    ?? throw new InvalidOperationException("VoucherPro JWT SecretKey is not configured.");
```

### 2.3 مشاكل عالية الخطورة (High)

#### 1. Admin Controllers لا تحمل [Authorize(Roles = "Admin")]
يجب التحقق أن كل Controller يحمل الصلاحية:
```csharp
var adminControllers = Assembly.GetExecutingAssembly()
    .GetTypes()
    .Where(t => typeof(ControllerBase).IsAssignableFrom(t)
                && t.Name.StartsWith("Admin"));
// تحقق أن كل Controller يحمل [Authorize(Roles = "Admin")]
```

#### 2. CORS وهمي
**الملف:** `Voucher Pro/VoucherPro.APIs/Program.cs`
استبدال `.WithOrigins("https://yourdomain.com")` بـ:
```csharp
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>();
policy.WithOrigins(allowedOrigins ?? Array.Empty<string>());
```

#### 3. WhatsApp static cache
**الملف:** `backend/src/Core.Application/Services/WhatsApp/WhatsAppAgentService.cs`
الحل: استبدال الـ static fields بـ `IDistributedCache` (Redis) أو بـ `IMemoryCache` injected على الأقل.

#### 4. غياب Optimistic Concurrency
يجب إضافة `RowVersion` على (FlightSchedule, CustomerRequest, Quotation, Voucher):
```csharp
[Timestamp]
public byte[] RowVersion { get; set; }
```
وعند التحديث:
```csharp
try { await _dbContext.SaveChangesAsync(); }
catch (DbUpdateConcurrencyException) { ... }
```

#### 5. لا يوجد Circuit Breaker للموفرين الخارجيين
**الملف:** `backend/src/Infrastructure.Shared/Services/Aggregators/FlightAggregatorService.cs`
ينبغي إضافة Polly:
```csharp
.AddPolicyHandler(HttpPolicyExtensions
    .HandleTransientHttpError()
    .WaitAndRetryAsync(3, retryAttempt => 
        TimeSpan.FromSeconds(Math.Pow(2, retryAttempt))))
.AddPolicyHandler(HttpPolicyExtensions
    .HandleTransientHttpError()
    .CircuitBreakerAsync(5, TimeSpan.FromSeconds(30)));
```

### 2.4 لماذا الميزة موجودة فعلاً ولا نبني من الصفر؟
مراجعة VoucherPro أظهرت أن الخدمات موجودة بالفعل:
- إنشاء طلب العميل: `CustomerRequestService.cs`
- إرسال الطلب للوكلاء: `SendToAgentsAsync`
- تقديم عروض الأسعار: `QuotationService.SubmitQuotationAsync`
- محرك المقارنة: `QuotationService.CompareQuotationsAsync` (موجود وبأوزان واضحة)
- الإشعارات الفورية: `QuotationHub.cs` (SignalR)
- استخراج PDF: `GeminiService.cs`
- توليد Voucher: `CustomerRequestService.CreateVoucherAsync`
**الخلاصة:** لا نحتاج بناء محرك جديد، بل توحيد هذه الخدمة مع النظام الرئيسي.

---

## 3. التصميم الهدف للمزاد الذكي

### 3.1 المكونات
```text
    ┌─────────────────────────────────────────────────────────────┐
    │                    Frontend / Admin / WhatsApp              │
    └──────────────────────┬──────────────────────────────────────┘
                           │
              ┌────────────▼─────────────┐
              │   Main Backend (.NET 8)  │
              │  Bookings/Payments/Users │
              └────────────┬─────────────┘
                           │ creates/reads
              ┌────────────▼─────────────┐
              │   VoucherPro Microservice│
              │  CustomerRequest         │
              │  Quotation / Agent       │
              │  QuotationComparison     │
              │  QuotationHub (SignalR)  │
              │  Gemini PDF Extractor    │
              └──────────────────────────┘
```

### 3.2 تدفق البيانات بالتفصيل
1. العميل يفتح "اطلب عرض سعر مخصص" في الموقع أو يكتب واتساب.
2. `Main Backend` ينشئ `CustomerRequest` في VoucherPro عبر `VoucherProIntegrationService`.
3. VoucherPro يُرسّل الطلب للوكلاء (بناءً على التخصص والجغرافيا) مع `deadline`.
4. الوكلاء يردون بـ `Quotation` عبر API أو Portal.
5. `QuotationService.CompareQuotationsAsync` يُنتج أفضل عرض وفق الأوزان: (السعر: 40%، تقييم الوكيل: 25%، سرعة الرد: 15%، نسبة قبول الوكيل سابقًا: 10%، جودة الفندق/الخدمة: 10%).
6. العميل أو الأدمن يختاران العرض.
7. VoucherPro يُرسل Webhook للـ Main Backend لإنشاء Booking + Voucher.
8. Voucher PDF يُستخرج تلقائيًا عبر `GeminiService` ويُخزّن سحابياً.

### 3.3 نقاط التكامل الرئيسية
- **HTTP API:** Main Backend ←→ VoucherPro.
- **Webhook:** `POST /api/webhooks/voucherpro/selection` في Main Backend.
- **SignalR Hub:** `/hubs/quotations` للإشعارات الفورية.
- **Storage:** PDF Vouchers في Cloud Storage.

---

## 4. خطة التنفيذ المرحلية — 6 مراحل

### المرحلة 0: تأمين الأساس (48 ساعة)
- **تدوير أسرار VoucherPro:** DB pass + JWT secret جديدة.
- **تهيئة Git repo + .gitignore:** سيطرة على المصدر وحذف ملفات النشر.
- **إصلاح AuthService:** PasswordResetToken يُخزّن ويُتحقق.
- **إيقاف محاكاة الدفع:** Feature Flag أو ربط حقيقي.
- **تنظيف VoucherProSettings:** لا قيم افتراضية.
- **تفعيل [Authorize(Roles="Admin")]:** كل AdminController محمي.
- **RowVersion على الكيانات الحرجة:** منع Race Condition.

### المرحلة 1: ربط VoucherPro (أسبوعان)
- `VoucherProIntegrationService` يدعم `CreateCustomerRequestAsync`.
- تخزين `VoucherProRequestId` في `Booking / User`.
- Webhook لاستقبال العرض المختار ومزامنة الحالات.

### المرحلة 2: Agent Portal + لوحة المزايدات (2–3 أسابيع)
- تسجيل/دخول الوكلاء وقائمة الطلبات المتاحة ونموذج تقديم عرض سعر.
- لوحة الإدارة تعرض المقارنة التلقائية.
- SignalR notifications.

### المرحلة 3: WhatsApp + AI Extractor (أسبوعان)
- إضافة intent "اطلب عرض سعر" في `WhatsAppAgentService`.
- تحويل `WhatsAppAgentService` إلى State Machine Clean.
- تحسين `GeminiService` بدقة ≥ 90%.

### المرحلة 4: تدفق العميل في الموقع الرئيسي (2–3 أسابيع)
- نموذج طلب عرض سعر مخصص وصفحة متابعة العروض للعميل.
- اختيار عرض ← حجز ← دفع.

### المرحلة 5: اختبار وإطلاق (أسبوعان)
- Integration Tests, Penetration test خفيف, Load test على SignalR.
- PCI self-assessment و Soft launch.

---

## 5. الامتثال (Compliance Checklist)
- **PCI DSS:** لا تُخزّن PAN/CVV، Tokenization من بوابة الدفع، TLS 1.2+، Audit logs لكل معاملة، RBAC، Network segmentation.
- **IATA / GDS / ARC:** Production endpoints، PNR/Ticketing traceability، Audit trail لكل حركة، سياسة احتفاظ بالبيانات 5–7 سنوات.
- **خصوصية البيانات (GDPR):** Consent واضح، حذف/تصدير بيانات العميل، تقييد مشاركة البيانات مع الوكلاء.
- **AML / KYC (مستقبلاً):** تسجيل هوية الوكلاء ومراجعة المعاملات.

---

## 6. المخاطر ومؤشرات النجاح
### المخاطر:
- **التسريبات الأمنية:** إغلاقه قبل أي تطوير.
- **تعقيد التكامل:** Webhook واضح + Mapping واضح.
- **مقاومة الوكلاء للنظام:** Onboarding + حوافز + UX بسيط.
- **SignalR تحت الضغط:** Redis backplane + Load test.
- **رفض GDS:** Audit logs + Documentation مبكر.

### KPIs (مؤشرات النجاح):
- وقت أول عرض: ≤ 5 دقائق.
- نسبة تحويل الطلب المخصص: ≥ 20%.
- دقة استخراج PDF: ≥ 90%.
- Uptime: 99.9%.
- وقت اختيار العرض: < 2 دقيقة.

---

## 7. Runbook العاجل — 48 ساعة

1. **تدوير أسرار VoucherPro:** تغيير SQL user/pass و JWT secret وتعطيل المستخدم القديم.
2. **إزالة ملفات النشر من المصدر:** حذف `backend/publish`، `Voucher Pro/publish`، و `VoucherPro_Release.zip`.
3. **تهيئة Git + .gitignore:** يتضمن `**/bin/**`, `**/obj/**`, `**/publish*/`.
4. **إصلاح AuthService.cs:** إنشاء `PasswordResetToken` والتحقق منه.
5. **تنظيف PaymentService.cs:** ربط بوابة حقيقية أو تفعيل SimulationMode في QA فقط.
6. **تنظيف VoucherProSettings.cs:** إزالة `Admin@123`.
7. **تفعيل Authorize:** إضافة `[Authorize(Roles = "Admin")]` على كل `Admin*Controller` والتأكد من Role claim.
8. **إصلاح CORS:** إزالة `https://yourdomain.com` واستخدام `AllowedOrigins` من الإعدادات.
9. **تفعيل RowVersion:** على `FlightSchedule`, `Booking`, `CustomerRequest`, `Quotation`.
10. **تجهيز Redis:** للـ distributed cache، SignalR backplane، و WhatsApp deduplication.
11. **النسخ الاحتياطي:** خذ نسخ احتياطي من قواعد البيانات قبل التعديل.
12. **Smoke Tests:** تسجيل دخول، حجز، دفع، إنشاء طلب في VoucherPro.
13. **تجميد أي إطلاق جديد:** حتى تنتهي المرحلة 0 بالكامل.

---

## 8. أقسام إضافية هامة لم تُعرض بالكامل سابقًا

### 8.1 إدارة الأسرار (Secrets Management)
- استخدام Azure Key Vault أو AWS Secrets Manager.
- قراءتها من Environment Variables في Production.
- عدم كتابة أسرار في `appsettings.Production.json` نهائيًا.

### 8.2 Agent Onboarding & KYC
- تسجيل الوكيل يحتاج موافقة Admin مع رفع الهوية/الترخيص.
- لكل وكيل Rating و AcceptanceRate و ResponseTime. تقييم العميل يؤثر على ترتيب العروض.

### 8.3 Logging & Observability
- توحيد الـ logs بـ `Serilog` وإرسالها لـ `Seq` أو `CloudWatch`.
- تتبع الـ transaction عبر `CorrelationId` ومراقبة الـ latency والأخطاء.

### 8.4 Data Migration
- هل `CustomerRequest` مرتبط بحجز قديم؟ يجب تحويل الطلبات الحالية للاحتفاظ على الـ ReferenceNumber دون تعارض.

### 8.5 Backup & Disaster Recovery
- Backups يومية لقواعد البيانات مع RTO/RTO محددة.

### 8.6 Rollback Plan
- Feature Flags لكل مرحلة `Feature Flags` لتعطيل `VoucherPro` integration للرجوع للتدفق القديم بسهولة.

### 8.7 Frontend Changes Needed
- صفحة Admin للمراجعة والمقارنة (Score + Price + Rating).
- نموذج العميل "اطلب عرض سعر" و Agent Portal منفصل.

### 8.8 NotificationService
- تفعيل إشعارات Push و WhatsApp لإشعار الوكلاء فوراً عند وصول طلب (الإيميل موجود حالياً).

### 8.9 API Documentation للوكلاء
- توفير دليل Integration واضح عبر Swagger مع API keys و Rate limiting منطقي لكل وكيل.

### 8.10 Roles & Permissions Matrix
- **SuperAdmin:** كل الصلاحيات.
- **Admin:** مراجعة الطلبات، الموافقة على الوكلاء.
- **Agent:** تقديم عروض، رؤية طلباته.
- **Customer:** إنشاء طلب، اختيار عرض.

### 8.11 Feature Flags
- `VoucherPro:Enabled`
- `Payment:SimulationMode`
- `QuotationComparison:AutoSuggest`
- `WhatsAppRfp:Enabled`
- `AgentPortal:Enabled`

### 8.12 Penetration & Load Testing
- Penetration test للمنافذ العامة. Load test على SignalR hub مع 1000 وكيل متزامن.

---
**الخلاصة:** لا نبدأ Phase 1 قبل إغلاق المرحلة 0. الأمن والأساس يجب أن يكونا سليمين؛ بعدها ربط VoucherPro وإطلاق المزاد يكونان أسرع وأقل مخاطر.