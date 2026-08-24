# 01 — تقرير المراجعة الشاملة

> الملف: `docs/master_plan/01_security_audit.md`  
> النطاق: الفحص الأمني والهيكلي ومعايير GDS

---

## 1. ملخص تنفيذي

- الميزة المطلوبة (Agent Bidding) موجودة داخل VoucherPro.
- لكن توجد ثغرات حرجة يجب إصلاحها قبل التفعيل.
- ملفات النشر تحتوي على أسرار مكشوفة.

---

## 2. الثغرات الحرجة (Critical)

| # | الثغرة | الموقع | الإجراء الفوري |
|---|--------|--------|----------------|
| 1 | تسريب أسرار قاعدة البيانات و JWT | `Voucher Pro/VoucherPro_Clean_Publish/appsettings*.json` | تدوير الاعتمادات وحذف الملفات من المصدر |
| 2 | كلمة مرور افتراضية | `VoucherProSettings.cs` | حذف القيمة وجعلها nullable |
| 3 | إعادة تعيين كلمة المرور بدون توكن | `AuthService.cs` | إنشاء جدول PasswordResetToken |
| 4 | تسجيل الدفع نجاحًا دائمًا | `PaymentService.cs` | ربط بوابة الدفع أو Feature Flag |
| 5 | أرقام مراجعة عشوائية بدون تفريد | `BookingService.cs` | Unique Constraint + Seq/Guid |
| 6 | fallback JWT secret | `AgentService.cs` | إلغاء القيمة الافتراضية |

---

<!-- APPEND_NEXT -->
