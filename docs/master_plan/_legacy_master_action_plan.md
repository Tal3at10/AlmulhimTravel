# خطة العمل المرجعية الشاملة — Almulhim Travel

> **الدور:** Senior Software Architect & Tech Lead — Travel Tech B2B/B2C  
> **تاريخ الإعداد:** يوليو 2026  
> **مسار الملف:** `docs/master_action_plan.md`  
> **الحالة:** المرجع التقني المعتمد للمرحلة القادمة

---

## 1. ملخص تنفيذي للفحص (System Audit — Executive Summary)

تم فحص جميع طبقات النظام الحالية:

| الطبقة | التقنية | الحالة المؤكدة |
|--------|---------|---------------|
| **Backend Main** | .NET 8 + EF Core + SQL Server | يعمل على `api/` — اعتماد على Duffel/Amadeus/Hotelbeds/RapidAPI |
| **Frontend B2C** | React 19 + Vite + TailwindCSS 4 | SPA منفصلة تُبنى في `backend/wwwroot` |
| **Admin Dashboard** | React 19 + Vite | SPA منفصلة على `/admin` — معظم الـ CRUD جاهز |
| **VoucherPro** | .NET 8 Microservice | قائم بذاته — يحتوي بالفعل على نظام **طلبات العملاء + الوكلاء + العروض + المقارنة + الفواتير + PDF Extractor** |
| **WhatsApp Bot** | Freshchat Webhook + AI Orchestrator | يستخدم Freshchat API + AI Fallback Chain |
| **AI Layer** | Gemini / Groq / OpenRouter / HuggingFace | موجود مع Fallback & Cache |
| **Payments** | Moyasar + Tabby + Tamara | قائم بهيكل محفظة ولاء |

### ⚠️ أهم نتيجة: الميزة المطلوبة (Agent Bidding & Automated Comparison) موجودة أساسًا داخل VoucherPro بشكل متقدم.

إن الخطوة الأولى ليست البناء من الصفر، بل **توحيد وتفعيل** ما هو موجود، مع سد الثغرات الأمنية الحرجة.

---

## 2. الجزء الأول: تقرير المراجعة الشاملة

### 2.1 الأخطاء والثغرات الأمنية (Bugs & Security Vulnerabilities)

#### 🔴 حرج (Critical) — يجب إصلاحها فورًا

1. **تسريب بيانات حساسة في ملفات النشر (VoucherPro)**
   - **الموقع:** `Voucher Pro/VoucherPro_Clean_Publish/appsettings.json` و `appsettings.Production.json` و `appsettings.Development.json`.
   - **المشكلة:** تحتوي على:
     - عنوان السيرفر `db40744.public.databaseasp.net`
     - اسم المستخدم وكلمة مرور قاعدة البيانات.
     - مفتاح JWT السري لـ Production.
   - **الخطورة:** أي شخص يصل إلى هذه الملفات يستطيع الدخول إلى قاعدة البيانات وتزوير توكنات JWT.
   - **الإجراء:** تدوير (rotate) كافة البيانات فورًا (DB user/pass + JWT secret) وإزالة الملفات من Git وتجاهل `**/bin/**`, `**/obj/**`, `**/publish*/**`, `**/VoucherPro_Clean_Publish/**`.

2. **كلمة مرور افتراضية مكتوبة في الكود (VoucherProSettings.cs)**
   - **الموقع:** `backend/src/Infrastructure.Shared/Settings/VoucherProSettings.cs`
   - **المشكلة:** `Password = "Admin@123"` بشكل افتراضي.
   - **الإجراء:** حذف القيمة الافتراضية وإلزام القراءة من المتغيرات البيئية / Azure Key Vault.

3. **ثغرة إعادة تعيين كلمة المرور بدون تحقق من التوكن**
   - **الموقع:** `backend/src/Core.Application/Services/Identity/AuthService.cs` — `GeneratePasswordResetTokenAsync` و `ResetPasswordAsync`.
   - **المشكلة:** يتم توليد توكن إعادة الضبط ولكن لا يُخزن ولا يُتحقق منه. أي شخص يستطيع إرسال `email + newPassword` وإعادة ضبط كلمة مرور أي مستخدم.
   - **الإجراء:** إنشاء جدول `PasswordResetToken` يحتوي على `TokenHash`, `UserId`, `ExpiresAt`, `Used` والتحقق منه قبل الإعادة.

4. **محاكاة نجاح الدفع دائمًا**
   - **الموقع:** `backend/src/Core.Application/Services/Reservations/PaymentService.cs` — `ProcessPaymentAsync`.
   - **المشكلة:** `payment.Status = PaymentStatus.Completed;` دائمًا مع بطاقة وهمية `4242`.
   - **الإجراء:** ربط Moyasar/Tabby/Tamara فعليًا أو إخفاء الميزة في Production إلى أن تكتمل التكامل.

5. **إنشاء رقم حجز عشوائي بدون تفريغ/فهرس فريد**
   - **الموقع:** `BookingService.cs` — `GenerateReferenceNumber()` يستخدم `Random.Next`.
   - **الإجراء:** إضافة Unique Constraint على `ReferenceNumber` واستخدام آلية Seq/Guid مع Serial Number آمن.

6. **VoucherPro AgentService يحتوي على fallback secret key**
   - **الموقع:** `Voucher Pro/VoucherPro.Core.Application/Services/AgentService.cs` — `GenerateJwtToken`.
   - **المشكلة:** قيمة افتراضية قد تُستخدم إذا فُقدت الإعدادات.
   - **الإجراء:** إزالة النص الافتراضي وإيقاف التوقيع إذا لم يُحضر الـ SecretKey.

#### 🟠 عالي (High)

7. **CORS في VoucherPro يستخدم قيمًا وهمية على Production**
   - **الموقع:** `Voucher Pro/VoucherPro.APIs/Program.cs` — `WithOrigins("https://yourdomain.com")`.
   - **الإجراء:** تكوين Origins الفعلية من الإعدادات.

8. **API Main Backend لا يطبق `[Authorize(Roles = "Admin")]` على Admin Controllers بشكل كافٍ**
   - تأكد من أن جميع `Admin*Controller` تستخدم `Authorize(Roles = "Admin")` وأن الـ Role claim موجود في JWT.

9. **WhatsApp Webhook Controller يعتمد على `Console.WriteLine` و caching محلي (`static`)**
   - **الإجراء:** الانتقال إلى Redis/Kafka للـ deduplication والـ debounce عند التوسع.

10. **نقص الـ Optimistic Concurrency في قوائم الانتظار والمقاعد**
    - **الموقع:** حجز المقاعد في `BookingService.cs` يزيل من `EconomySeatsAvailable` بدون `RowVersion` على `FlightSchedule`.
    - **الإجراء:** تفعيل `[Timestamp] RowVersion` على `FlightSchedule`, `Booking`, `CustomerRequest`, `Quotation`.

### 2.2 التحسينات (Improvements)

| المجال | التحسين المقترح | الأولوية |
|--------|-----------------|----------|
| **Clean Architecture** | فصل `Core.Application.Abstraction` عن `Core.Application` موجود، لكن بعض Services مثل `WhatsAppAgentService` في Application Layer ثقيلة جدًا يجب تقسيمها إلى State Machine. | عالي |
| **Performance** | إضافة `AsNoTracking` في القوائم العامة؛ استخدام Projection بدل INCLUDE المتكرر؛ وجود migration `AddMissingPerformanceIndexes` يحتاج مراجعة. | عالي |
| **Caching** | انتقال من `static _cachedToken` و `IMemoryCache` إلى Redis لـ distributed cache. | متوسط |
| **Resilience** | إضافة Polly للـ HttpClients الخارجية (Amadeus, Duffel, Freshchat). | عالي |
| **Observability** | ربط Serilog مع Seq/Splunk/CloudWatch؛ توحيد logs. | متوسط |
| **Testing** | إكمال `PaymentServiceTests` وإضافة integration tests للحجوزات والوكلاء. | متوسط |
| **Frontend** | تحسين SEO (SPA meta injection موجود جيد)، لكن بعض الصفحات تحتاج Code Splitting أكبر. | منخفض |

### 2.3 التعديلات (Refactoring)

| الكود | المشكلة | الإجراء |
|-------|---------|---------|
| `appsettings.Production.json` في كل مشروع | أسرار مكشوفة | نقل إلى Key Vault / Environment Variables |
| `VoucherProSettings.cs` | كلمة مرور افتراضية | إزالة القيمة وتجنب commit |
| `WhatsAppAgentService.cs` | منطق الحالات مكتوب يدويًا ويصعب صيانته | تحويله إلى State Machine أو Decision Table |
| `FlightAggregatorService.cs` | Aggregate providers بطريقة بسيطة؛ لا يوجد Circuit Breaker | إضافة Polly + logging + graceful degradation |
| `PaymentService.cs` | محاكاة دائمة للدفع | التكامل الفعلي أو Feature Flag |
| `RapidApiHotelService` و `RapidApiHotelsController` | تبقى كود قديم | تقرير: حذف أو إعادة تفعيل واضحة |
| `backend/publish` و `VoucherPro_Clean_Publish` | ملفات نشر ضخمة ضمن المصدر | إزالة من Git وإضافتها إلى `.gitignore` |

### 2.4 التطويرات لاستيفاء معايير مزودي GDS العالميين (Amadeus / Hotelbeds)

| المتطلب | الحالة الحالية | المطلوب |
|---------|----------------|---------|
| **Test/Production Endpoints** | Amadeus يستخدم `test.api.amadeus.com`؛ Hotelbeds uses `api.test.hotelbeds.com` | تبديل Production endpoints عبر feature flag + End-to-End testing |
| **SLA / Latency** | غير مُقاس | إضافة metrics + circuit breaker |
| **IATA / ARC Certification** | غير جاهز | توثيق APIs، إضافة Audit Logs، إثبات traceability للحجوزات |
| **PCI