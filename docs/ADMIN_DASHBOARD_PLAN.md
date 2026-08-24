# 🏗️ خطة تنفيذ لوحة تحكم الملحم للسفر (Admin Dashboard)
# AlMulhim Travel - Admin Dashboard Implementation Plan

---

## 📋 ملخص المشروع

بناء **لوحة تحكم إدارية احترافية** (Admin Dashboard) منفصلة عن الموقع الرئيسي، تتيح للمديرين إدارة كامل محتوى المنصة (إضافة/تعديل/حذف) بواجهة عالمية المستوى مع الحفاظ على هوية الملحم (Navy `#001F3F` + Gold `#C9A227`).

---

## 🎯 التحليل: ما الموجود وما المطلوب؟

### ✅ الموجود فعلاً في الباك إند (الـ Services):
| الخدمة | Get/List | Create | Update | Delete | ملاحظة |
|--------|----------|--------|--------|--------|--------|
| HeroSlides | ✅ | ✅ | ✅ | ✅ | + Reorder |
| Testimonials | ✅ | ✅ | ✅ | ✅ | جاهز |
| Partners | ✅ | ✅ | ✅ | ✅ | جاهز |
| BoardMembers | ✅ | ✅ | ✅ | ✅ | + Chairman/CEO |
| CompanySettings | ✅ | - | ✅ | - | Key-Value فقط |
| Destinations | ✅ | ✅ | ✅ | ✅ | جاهز |
| Packages | ✅ | ✅ | ✅ | ✅ | + Search/Featured |
| CustomerVideos | ✅ | ✅ | ✅ | ✅ | جاهز |
| Hotels | ✅ Search | ❌ | ❌ | ❌ | **فقط Read** |
| Flights | ✅ Search | ❌ | ❌ | ❌ | **فقط Read** |
| Bookings | ✅ | ✅ Create | - | - | + Cancel/Confirm |
| Users | ✅ Get | - | ✅ Profile | - | **لا يوجد List/Admin** |

### ❌ المفقود من الباك إند:
1. **لا يوجد Role في الـ User** (لا Admin ولا User role)
2. **لا يوجد Admin Controllers** (كل الـ Controllers للـ Public API فقط)
3. **Hotels/Flights لا تملك CRUD كامل** (Search فقط)
4. **Users لا تملك GetAll/List**  
5. **Bookings لا تملك GetAll/UpdateStatus**
6. **لا يوجد Dashboard Stats endpoint**

---

## 🏛️ الخطة المعمارية

### سنبني الداشبورد كـ **React SPA منفصلة** داخل نفس المشروع:

```
e:\Projects\AlMulhim-Travel\
├── admin/                          ← 🆕 Admin Dashboard (Vite + React)
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   ├── config/
│   │   │   └── api.config.js       ← Admin API endpoints
│   │   ├── contexts/
│   │   │   └── AdminAuthContext.jsx ← Admin auth
│   │   ├── services/
│   │   │   └── admin.service.js     ← Admin API calls
│   │   ├── lib/
│   │   │   └── axios.js             ← Admin axios instance
│   │   ├── hooks/
│   │   ├── layouts/
│   │   │   └── DashboardLayout.jsx  ← Sidebar + TopBar
│   │   ├── components/
│   │   │   ├── ui/                  ← DataTable, Modal, Form, etc.
│   │   │   ├── charts/             
│   │   │   └── shared/
│   │   └── pages/
│   │       ├── Login.jsx
│   │       ├── Dashboard.jsx        ← إحصائيات عامة
│   │       ├── destinations/        ← CRUD الوجهات
│   │       ├── packages/            ← CRUD الباقات
│   │       ├── hotels/              ← CRUD الفنادق
│   │       ├── flights/             ← CRUD الطيران
│   │       ├── bookings/            ← إدارة الحجوزات
│   │       ├── users/               ← إدارة المستخدمين
│   │       ├── cms/                 ← إدارة المحتوى
│   │       │   ├── HeroSlides.jsx
│   │       │   ├── Testimonials.jsx
│   │       │   ├── Partners.jsx
│   │       │   ├── BoardMembers.jsx
│   │       │   ├── CompanySettings.jsx
│   │       │   └── CustomerVideos.jsx
│   │       └── settings/            ← إعدادات النظام
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── backend/                         ← الباك إند الحالي
│   └── src/
│       ├── APIs/
│       │   └── Controllers/
│       │       └── Admin/           ← 🆕 Admin Controllers
│       │           ├── AdminAuthController.cs
│       │           ├── AdminDashboardController.cs
│       │           ├── AdminDestinationsController.cs
│       │           ├── AdminPackagesController.cs
│       │           ├── AdminHotelsController.cs
│       │           ├── AdminFlightsController.cs
│       │           ├── AdminBookingsController.cs
│       │           ├── AdminUsersController.cs
│       │           └── AdminCmsController.cs
│       ├── Core.Domain/
│       │   └── Entities/
│       │       └── Identity/
│       │           └── User.cs      ← 🔄 إضافة Role
│       └── ...
```

---

## 📐 مراحل التنفيذ (7 مراحل)

---

### 🔴 المرحلة 1: تأسيس الباك إند للأدمن
> **الهدف**: إضافة Role للـ User + إنشاء Admin Controllers + Auth منفصل

#### الخطوات:

**1.1 إضافة Role للـ User Entity:**
```csharp
// Core.Domain/Entities/Identity/User.cs
public string Role { get; set; } = "User"; // "Admin" | "User"
```

**1.2 Migration جديدة** لإضافة العمود + إنشاء Admin user في الـ Seeder

**1.3 إنشاء Admin Auth:**
- تعديل `JwtTokenService` لإضافة Role claim
- إنشاء `AdminAuthController` مع login endpoint
- إنشاء `[Authorize(Roles = "Admin")]` middleware check

**1.4 إنشاء Admin Base Controller:**
```csharp
[Route("api/admin/[controller]")]
[Authorize(Roles = "Admin")]
public abstract class AdminBaseController : BaseApiController { }
```

**1.5 Admin Dashboard Stats Controller:**
- إجمالي الحجوزات / المستخدمين / الباقات / الوجهات
- آخر الحجوزات
- إحصائيات الإيرادات
- أكثر الوجهات حجزاً

#### الملفات المطلوبة:
| ملف | نوع | وصف |
|-----|------|------|
| `User.cs` | تعديل | إضافة Role |
| `JwtTokenService.cs` | تعديل | إضافة Role claim |
| `AdminBaseController.cs` | جديد | Base controller مع Admin auth |
| `AdminAuthController.cs` | جديد | Admin login |
| `AdminDashboardController.cs` | جديد | Dashboard stats |
| Migration | جديد | عمود Role + seeder |

---

### 🟠 المرحلة 2: Admin CRUD Controllers
> **الهدف**: إنشاء كل الـ Admin API endpoints

#### الخطوات:

**2.1 AdminCmsController** (المحتوى):
```
POST/PUT/DELETE api/admin/cms/hero-slides
POST/PUT/DELETE api/admin/cms/testimonials  
POST/PUT/DELETE api/admin/cms/partners
POST/PUT/DELETE api/admin/cms/board-members
PUT api/admin/cms/settings/{key}
POST/PUT/DELETE api/admin/cms/customer-videos
```

**2.2 AdminDestinationsController** (الوجهات):
```
GET    api/admin/destinations           (GetAll مع pagination)
GET    api/admin/destinations/{id}
POST   api/admin/destinations
PUT    api/admin/destinations/{id}
DELETE api/admin/destinations/{id}
```

**2.3 AdminPackagesController** (الباقات):
```
GET    api/admin/packages               (GetAll مع pagination)
GET    api/admin/packages/{id}
POST   api/admin/packages
PUT    api/admin/packages/{id}
DELETE api/admin/packages/{id}
```

**2.4 AdminHotelsController** (الفنادق):
- تحتاج CRUD services جديدة (Create/Update/Delete)
```
GET    api/admin/hotels
POST   api/admin/hotels
PUT    api/admin/hotels/{id}
DELETE api/admin/hotels/{id}
```

**2.5 AdminBookingsController** (الحجوزات):
- GetAll مع filtering + pagination
- Update status
- تفاصيل الحجز
```
GET    api/admin/bookings               (GetAll + filters)
GET    api/admin/bookings/{id}
PUT    api/admin/bookings/{id}/status   (Confirm/Cancel)
DELETE api/admin/bookings/{id}
```

**2.6 AdminUsersController** (المستخدمين):
- GetAll مع pagination
- Toggle active/deactivate
```
GET    api/admin/users
GET    api/admin/users/{id}
PUT    api/admin/users/{id}/toggle-active
```

#### الخدمات الجديدة المطلوبة:
| خدمة | Methods المطلوب إضافتها |
|------|------------------------|
| `IUserService` | `GetAllAsync`, `GetAllPaginatedAsync` |
| `IBookingService` | `GetAllAsync`, `GetAllPaginatedAsync`, `UpdateStatusAsync` |
| `IHotelService` | `CreateAsync`, `UpdateAsync`, `DeleteAsync` |

---

### 🟡 المرحلة 3: إنشاء الفرونت إند للداشبورد
> **الهدف**: بناء تطبيق React منفصل مع Layout احترافي

#### الخطوات:

**3.1 إنشاء مشروع Vite + React جديد** في مجلد `admin/`

**3.2 Setup التقنيات:**
- React 19 + React Router DOM 7
- TailwindCSS 4 (نفس التقنيات)
- Lucide React (icons)
- Framer Motion (animations)
- Recharts (charts للداشبورد)
- React Hot Toast

**3.3 بناء Design System:**
- ألوان الهوية: Navy `#001F3F`, Gold `#C9A227`, White
- خط: IBM Plex Sans Arabic
- RTL support
- Dark Sidebar + Light Content area

**3.4 الـ Layout الأساسي:**
```
┌──────────────────────────────────────────────┐
│  Top Bar (Search + Notifications + Profile)  │
├────────────┬─────────────────────────────────┤
│            │                                 │
│  Sidebar   │       Content Area              │
│  (Navy)    │       (Light/White)             │
│            │                                 │
│  - Dashboard│                                │
│  - الوجهات │                                 │
│  - الباقات │                                 │
│  - الفنادق │                                 │
│  - الطيران │                                 │
│  - الحجوزات│                                 │
│  - المستخدمين│                               │
│  - المحتوى │                                 │
│  - الإعدادات│                                │
│            │                                 │
├────────────┴─────────────────────────────────┤
│    Footer (Powered by AlMulhim Travel)       │
└──────────────────────────────────────────────┘
```

#### الملفات:
| ملف | وصف |
|-----|------|
| `admin/index.html` | Entry point |
| `admin/src/main.jsx` | React root |
| `admin/src/App.jsx` | Router + providers |
| `admin/src/index.css` | Tailwind + globals |
| `admin/src/layouts/DashboardLayout.jsx` | Sidebar + TopBar |
| `admin/src/components/ui/Sidebar.jsx` | Sidebar navigation |
| `admin/src/components/ui/TopBar.jsx` | Top navigation |
| `admin/src/lib/axios.js` | Admin axios instance |
| `admin/src/config/api.config.js` | Admin endpoints |
| `admin/src/contexts/AdminAuthContext.jsx` | Admin auth context |

---

### 🟢 المرحلة 4: صفحات الداشبورد الرئيسية
> **الهدف**: صفحة Login + Dashboard + Shared Components

#### 4.1 صفحة Login:
- تصميم حصري بخلفية Navy + لوجو الملحم
- حقول: Email + Password
- Remember me + Error handling

#### 4.2 صفحة Dashboard الرئيسية:
- **Stats Cards**: إجمالي الحجوزات، المستخدمين، الإيرادات، الباقات
- **Charts**: 
  - خط بياني للحجوزات (آخر 30 يوم)
  - دائري لأنواع الحجوزات (Hotel/Flight/Package)
  - بار لأكثر الوجهات حجزاً
- **آخر الحجوزات**: جدول بآخر 10 حجوزات
- **Quick Actions**: أزرار سريعة (إضافة باقة، إضافة وجهة...)

#### 4.3 Shared Components:
| Component | وصف |
|-----------|------|
| `DataTable` | جدول بيانات مع Search + Sort + Pagination + Actions |
| `Modal` | نافذة منبثقة للإضافة/التعديل |
| `FormField` | حقل نموذج موحد (Input, Select, Textarea, Switch, Upload) |
| `ConfirmDialog` | نافذة تأكيد الحذف |
| `StatusBadge` | شارة حالة ملونة |
| `StatsCard` | كارت إحصائية |
| `ImageUpload` | رفع صور مع معاينة |
| `SearchBar` | بحث مع Filter |
| `Breadcrumb` | مسار التنقل |
| `EmptyState` | حالة فارغة |
| `LoadingSpinner` | تحميل |

---

### 🔵 المرحلة 5: صفحات إدارة المحتوى (CMS)
> **الهدف**: إدارة كل المحتوى الظاهر في الموقع

#### 5.1 إدارة الشرائح (Hero Slides):
- جدول بالشرائح + ترتيب Drag & Drop
- إضافة/تعديل (صورة + عنوان عربي + عنوان إنجليزي + ترتيب + فعّال/غير فعّال)
- حذف مع تأكيد

#### 5.2 إدارة التقييمات (Testimonials):
- جدول + إضافة/تعديل/حذف
- الحقول: الاسم + الوجهة + التقييم + التعليق + فعّال

#### 5.3 إدارة الشركاء (Partners):
- جدول + إضافة/تعديل/حذف
- الحقول: الاسم + اللوجو + الرابط + فعّال

#### 5.4 إدارة مجلس الإدارة (Board Members):
- جدول + إضافة/تعديل/حذف
- الحقول: الاسم + المسمى + الصورة + كلمة + ترتيب

#### 5.5 إعدادات الشركة (Company Settings):
- نموذج مباشر (بدون جدول)
- الحقول: رؤية الشركة + رسالة + كلمة رئيس مجلس الإدارة

#### 5.6 فيديوهات العملاء (Customer Videos):
- جدول + إضافة/تعديل/حذف
- الحقول: رابط الفيديو + الوجهة + العنوان + فعّال

---

### 🟣 المرحلة 6: صفحات إدارة البيانات الرئيسية
> **الهدف**: إدارة الوجهات + الباقات + الفنادق + الطيران

#### 6.1 إدارة الوجهات (Destinations):
- جدول مع بحث + فلتر
- إضافة/تعديل: اسم عربي/إنجليزي + بلد + Slug + صورة + فعّال + ترتيب
- حذف مع تأكيد (تحقق من الباقات المرتبطة)

#### 6.2 إدارة الباقات (Packages):
- جدول مع بحث + فلتر بالوجهة + فلتر بالسعر
- إضافة/تعديل: بيانات الباقة كاملة + برنامج الرحلة + المميزات + الفنادق
- نموذج متعدد الخطوات (Multi-step form):
  1. البيانات الأساسية (العنوان + السعر + المدة + الوجهة)
  2. برنامج الرحلة (أيام + أنشطة)
  3. المميزات (قائمة)
  4. الفنادق (ربط الفنادق)
  5. الصور

#### 6.3 إدارة الفنادق (Hotels):
- جدول مع بحث + فلتر بالمدينة + النجوم
- إضافة/تعديل: الاسم + النجوم + المدينة + الموقع + الصور + الغرف + المرافق
- نموذج متعدد الأقسام

#### 6.4 إدارة الطيران (Flights):
- عرض الرحلات من Amadeus (للقراءة)
- إدارة الرحلات المحلية (Create/Update/Delete)

---

### ⚫ المرحلة 7: إدارة الحجوزات والمستخدمين + الـ Deployment
> **الهدف**: إدارة العمليات + النشر

#### 7.1 إدارة الحجوزات (Bookings):
- جدول شامل مع فلاتر متعددة (النوع + الحالة + التاريخ + الاسم)
- عرض تفاصيل الحجز كاملة
- تغيير الحالة (Confirm / Cancel / Complete)
- تصدير CSV/Excel
- تقارير

#### 7.2 إدارة المستخدمين (Users):
- جدول المستخدمين مع بحث
- عرض ملف المستخدم + حجوزاته
- تفعيل/تعطيل الحساب

#### 7.3 تحديث الـ Deployment:
- بناء الداشبورد وخدمتها من Backend
- تحديث `deploy.bat`
- تحديث CORS + Static Files config
- الداشبورد تكون على path `/admin`

---

## 🔐 الأمان

| المتطلب | التنفيذ |
|---------|---------|
| Admin Authentication | JWT مع Role = "Admin" |
| Authorization | `[Authorize(Roles = "Admin")]` على كل Admin controllers |
| Session Timeout | Token expiry (7 أيام) |
| Password Security | BCrypt hashing (موجود) |
| Route Protection | ProtectedRoute component في React |
| CORS | نفس الـ origin (Same-server deployment) |

---

## 🎨 هوية التصميم

| العنصر | القيمة |
|--------|--------|
| **Primary (Navy)** | `#001F3F` |
| **Accent (Gold)** | `#C9A227` |
| **Success** | `#10B981` |
| **Danger** | `#EF4444` |
| **Warning** | `#F59E0B` |
| **Info** | `#3B82F6` |
| **Background** | `#F8FAFC` (Light gray) |
| **Sidebar** | `#001F3F` (Navy dark) |
| **Font** | IBM Plex Sans Arabic |
| **Direction** | RTL |
| **Border Radius** | `12px` (rounded-xl) |

---

## 📊 ترتيب التنفيذ (الأولوية)

| # | المرحلة | الوقت المقدر | الأولوية |
|---|---------|-------------|---------|
| 1 | تأسيس الباك إند للأدمن | ~2h | 🔴 حرج |
| 2 | Admin CRUD Controllers | ~3h | 🟠 عالي |
| 3 | إنشاء الفرونت إند + Layout | ~2h | 🟡 عالي |
| 4 | Dashboard + Login + Shared | ~3h | 🟢 عالي |
| 5 | صفحات إدارة المحتوى | ~4h | 🔵 متوسط |
| 6 | إدارة البيانات الرئيسية | ~5h | 🟣 متوسط |
| 7 | الحجوزات + المستخدمين + Deploy | ~3h | ⚫ منخفض |

**الإجمالي المقدر: ~22 ساعة عمل**

---

## ✅ معايير الجودة

1. **Responsive**: يعمل على Desktop + Tablet
2. **RTL**: دعم كامل للعربية
3. **Animations**: Framer Motion لكل الانتقالات
4. **Loading States**: شاشات تحميل جميلة
5. **Error Handling**: رسائل خطأ عربية واضحة
6. **Confirmation**: تأكيد قبل كل حذف
7. **Toast Notifications**: إشعارات لكل عملية
8. **Breadcrumbs**: مسار تنقل واضح
9. **Search & Filter**: بحث وفلترة في كل جدول
10. **Pagination**: تقسيم الصفحات
11. **Data Validation**: تحقق من البيانات client + server

---

## 🚀 نبدأ بالمرحلة 1؟

عند الموافقة على الخطة، سأبدأ بـ:
1. إضافة `Role` للـ `User` entity
2. تعديل `JwtTokenService` لإضافة الـ Role claim  
3. إنشاء `AdminBaseController`
4. إنشاء `AdminAuthController`
5. إنشاء Admin user في الـ Seeder
6. إنشاء Migration جديدة
