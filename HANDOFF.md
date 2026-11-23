<div dir="rtl" align="right">

# وثيقة التسليم الشاملة (Project Handoff) — منصة رواسي العمر
**تاريخ التوثيق:** 2026-11-22  
**الحالة:** مكتمل وجاهز للتشغيل والإنتاج (`Production-Ready MVP`)  
**مستودع GitHub:** `https://github.com/alghzwanyk6-tech/rawasi-alaomer` (الفرعان: `main` و `dev`)  
**معرّف مشروع Supabase:** `qghyfyktqibycanncbkk` (`ap-southeast-1` — PostgreSQL 17.12)

---

## 1. ملخص ما تم إنجازه بالكامل

تم بناء وربط المنظومة الرقمية المتكاملة لشركة **رواسي العمر** على إطار **Next.js 16.4.6 (App Router + Turbopack)** و **React 19** و **Supabase** وفق الهوية البصرية المعتمدة (`#163063`, `#2360A5`, `#3488C4`, `#47A3B8` على خلفيات `#FFFFFF` و `#F2F8FC` وبخط `IBM Plex Sans Arabic` اتجاه `RTL`).

### أولاً: البوابة المؤسسية العامة (`src/app/(public)`)
1. **الرئيسية (`/`)**:
   - قسم الهيرو التفاعلي، الإحصاءات التأسيسية، القطاعات الخمسة، مسارات الجمعيات والأوقاف، منهجية التنفيذ، ودعوة بدء المشروع.
2. **من نحن (`/about`)**:
   - فلسفة العلامة ("الرواسي" للثبات والمتانة، و"العمر" لامتداد القيمة والأثر بعد التسليم).
   - الرؤية، الرسالة، **ميثاق رواسي العمر**، والركائز التنفيذية الثلاث (مظلة واحدة، وضوح قبل التنفيذ، تمام في الختام).
3. **القطاعات التنفيذية (`/sectors` و `/sectors/[slug]`)**:
   - صفحة استعراض شاملة + 5 صفحات ديناميكية تفصيلية (`contracting`, `supply`, `tech`, `operations`, `community`) مع نطاق العمل، المخرجات، المستفيدين، وربط مباشر بمعالج تأهيل المشاريع (`/start-project?sector=[slug]`).
4. **حلول الجمعيات والأوقاف (`/non-profit`)**:
   - المسارات الستة المتكاملة لتمكين القطاع غير الربحي مع ربط مباشر ببوابة مرجع الجمعيات (`/marjea`).
5. **مختبر الأثر والنماذج التنفيذية (`/impact`)**:
   - إطار قياس العائد الاجتماعي على الاستثمار (`SROI`) و3 نماذج تنفيذية جاهزة للانطلاق (`Turnkey Blueprints`).
6. **معالج تأهيل المشاريع الذكي (`/start-project`)**:
   - معالج تفاعلي من 4 خطوات يدعم التحديد المسبق من الروابط (`?sector=` و `?track=`)، يولّد رقماً مرجعياً متسلسلاً (`RAO-2026-XXX`)، يحفظ الطلب مباشرة في Supabase، ويوفر زر إحالة فوري منسق إلى واتساب (`https://wa.me/966538881885`).

---

### ثانياً: بوابة مرجع الجمعيات (`/marjea` و `/marjea/guide/[slug]`)
1. **المركز المعرفي (`/marjea`)**:
   - بحث إجرائي فوري بالعربية في الأدلة والنماذج.
   - اختصارات **"ابدأ من هنا"** لأهم 6 إجراءات.
   - شريط تصفية لـ **9 تصنيفات معرفية**.
2. **بطاقة الإجراء الموحدة (`/marjea/guide/[slug]`)**:
   - تنبيه **"اعرف قبل أن تبدأ"** للمتطلبات الإلزامية.
   - خطوات متسلسلة (`1 ← 2 ← 3 ← 4`) تفصل بصرياً بين **"المعلومة الرسمية"** (`#163063`) و**"الخبرة الإرشادية من رواسي العمر"** (`#47A3B8`).
   - شريط تحميل النماذج الجاهزة (`Word / PDF / Excel`) وبطاقة تحويل هادئة إلى `/start-project`.

---

### ثالثاً: البوابة الإدارية الداخلية والمصادقة (`/login` و `/dashboard/*`)
1. **المصادقة الحقيقية عبر Supabase Auth (`/login`)**:
   - مرتبطة بـ `supabase.auth.signInWithPassword` مع إدارة كوكيز الجلسات عبر `@supabase/ssr`.
   - أزرار دخول فوري بالأدوار الأربعة لتسهيل الاختبار الفعلي بحسابات Supabase Auth الحقيقية.
2. **حماية المسارات (`src/proxy.ts`)**:
   - يعترض جميع مسارات `/dashboard/:path*`، يتحقق من جلسة Supabase Auth ومن حالة الموظف ودوره في جدول `public.staff_profiles`، ويعيد توجيه غير المسجلين إلى `/login?redirectTo=...`.
3. **لوحة المؤشرات (`/dashboard`)**:
   - 4 بطاقات KPIs حية، أحدث طلبات المشاريع، وحالة أدلة المرجع.
4. **إدارة طلبات المشاريع CRM (`/dashboard/leads`)**:
   - قراءة وتحديث مباشر من جدول `public.inquiries` عبر `/api/inquiries`.
   - **عزل الطلبات حسب الدور (Server-Side RBAC Lead Isolation)**:
     - `super_admin`: يشاهد كافة الطلبات، يعدّل الحالات، ويسند الطلبات لمديري القطاعات.
     - `sector_manager`: يشاهد ويحدّث فقط الطلبات المسندة لبريده أو التابعة لقطاعه.
     - `marjea_editor` و `governance_reviewer`: محجوبان من الخادم (`HTTP 403`).
5. **إدارة وحوكمة مرجع الجمعيات CMS (`/dashboard/marjea-cms`)**:
   - مرتبطة مباشرة بجدول `public.marjea_procedures` وسجل `public.cms_workflow_logs` عبر `/api/marjea`.
   - تدعم إنشاء مسودة دليل جديد (`POST`)، رفع المسودة للمراجعة (`Maker`)، واعتماد النشر أو الإعادة للتحرير (`Checker`).
6. **إدارة فريق العمل والصلاحيات (`/dashboard/team`)**:
   - مرتبطة مباشرة بجدول `public.staff_profiles` عبر `/api/staff` مع إنشاء حساب Supabase Auth تلقائي لأي عضو جديد يضيفه المدير العام.

---

## 2. حسابات الموظفين المفعّلة في Supabase Auth

تم إنشاؤها وربطها بجدول `public.staff_profiles` عبر السكربت [`scripts/seed-auth-users.mjs`](./scripts/seed-auth-users.mjs) (`pnpm seed:auth`):

| الدور (`role_id`) | الاسم | البريد الإلكتروني | كلمة المرور الموحدة |
|---|---|---|---|
| `super_admin` | م. عبد العزيز بن سلطان | `ceo@rawasialomar.sa` | `Rawasi@2026!` |
| `sector_manager` | أ. فيصل بن خالد الحربي | `f.harbi@rawasialomar.sa` | `Rawasi@2026!` |
| `marjea_editor` | أ. نورة بنت فهد القحطاني | `n.qahtani@rawasialomar.sa` | `Rawasi@2026!` |
| `governance_reviewer` | د. عبد الله بن صالح الغامدي | `a.ghamdi@rawasialomar.sa` | `Rawasi@2026!` |

---

## 3. حالة قاعدة البيانات في Supabase (14 جدولاً مفعّلة مع RLS)

جميع الجداول مفعّل عليها `Row Level Security (RLS)` ومضبوطة الصلاحيات عبر [`supabase/fix_permissions.sql`](./supabase/fix_permissions.sql):

| # | اسم الجدول | السجلات | الحالة |
|---|---|---|---|
| 1 | `public.inquiries` | 4 | مربوط حياً بـ `/api/inquiries` |
| 2 | `public.lead_timeline_events` | 4 | يسجل حركات الطلبات تلقائياً |
| 3 | `public.proposals` | 2 | العروض الفنية والمالية |
| 4 | `public.sectors` | 5 | القطاعات التنفيذية الخمسة |
| 5 | `public.non_profit_tracks` | 6 | مسارات تمكين القطاع غير الربحي |
| 6 | `public.turnkey_blueprints` | 3 | النماذج التنفيذية الجاهزة |
| 7 | `public.knowledge_categories` | 10 | تصنيفات مرجع الجمعيات |
| 8 | `public.marjea_procedures` | 8 | مربوط حياً بـ `/api/marjea` (6 منشورة + 1 مراجعة + 1 مسودة) |
| 9 | `public.procedure_steps` | 24 | خطوات الأدلة الإجرائية |
| 10 | `public.procedure_prerequisites` | 18 | متطلبات "اعرف قبل أن تبدأ" |
| 11 | `public.procedure_templates` | 18 | نماذج التحميل المرفقة بالأدلة (مربوطة بـ Supabase Storage) |
| 12 | `public.cms_workflow_logs` | 4 | يسجل حركات Maker-Checker تلقائياً |
| 13 | `public.staff_profiles` | 4 | مربوط حياً بـ `/api/staff` و `/api/auth/me` |
| 14 | `public.audit_logs` | 4 | يسجل العمليات الرقابية تلقائياً |

### رابعاً: مستودع التخزين السحابي (Supabase Storage)
- **الحاوية العامة (`Public Bucket`)**: `marjea-templates`
- **حجم الملف الأقصى**: 50 ميغابايت (`file_size_limit: 52428800`)
- **الصيغ المدعومة**: Word (`.docx`), Excel (`.xlsx`), PDF (`.pdf`), ZIP, Text.
- **ملف الإعداد والسياسات**: [`supabase/storage_setup.sql`](./supabase/storage_setup.sql)
- **سكربت الرفع التلقائي**: [`scripts/seed-storage-templates.mjs`](./scripts/seed-storage-templates.mjs) عبر الأمر `pnpm seed:storage`.
- **حالة الرفع**: تم رفع **18 ملفاً إسترشادياً معتمداً** في الحاوية مع روابط تحميل عامة حقيقية تعمل مباشرة من واجهة بطاقة الإجراء الموحدة (`UnifiedProcedureCard`) مع وجود معالج احتياطي ذكي (`Graceful Fallback`).

---

## 4. واجهات الـ API الخلفية (`src/app/api/*`)

- `GET /api/health/supabase` — فحص حالة الاتصال الحي بقاعدة البيانات وإحصاءات الجداول.
- `GET /api/auth/me` — استرجاع ملف الموظف المسجل حالياً من جلسة Supabase Auth وجدول `staff_profiles`.
- `GET / POST / PATCH /api/inquiries` — إدارة طلبات المشاريع مع عزل الأدوار (`RBAC`) وتوثيق السجل الزمني.
- `GET / POST / PATCH /api/marjea` — إدارة أدلة مرجع الجمعيات وحوكمة النشر (`Maker-Checker`).
- `GET / POST /api/staff` — إدارة أعضاء الفريق وإنشاء حساباتهم في Supabase Auth.

---

## 5. كيف تستأنف العمل في أي جلسة قادمة؟

1. **تشغيل خادم التطوير محلياً**:
   ```bash
   pnpm dev
   ```
2. **التحقق من البناء**:
   ```bash
   pnpm build
   ```
3. **رفع أي تعديلات جديدة إلى GitHub (`main` و `dev`)**:
   ```bash
   git add -A
   git commit -m "وصف التعديل"
   git branch -f dev main
   git push origin main dev
   ```
4. **إدارة قاعدة البيانات**:
   - إضافة **Supabase MCP** مفعّلة ومربوطة بالمعرّف `qghyfyktqibycanncbkk` في [.mcp.json](./.mcp.json)، ويمكن للوكيل الذكي تنفيذ أي استعلام أو ترحيل (`Migration`) مباشرة.

---

## 6. توصيات المرحلة القادمة (قبل الإطلاق الرسمي على النطاق العام)
- **تدوير المفتاح السري (`Secret Key`)** في لوحة تحكم Supabase (`Settings -> API Keys`) وتحديثه في `.env.local` وعند النشر على Vercel.
- **تغيير كلمات المرور التجريبية** لحسابات الموظفين الأربعة قبل تسليمها للفريق الفعلي.
- **ربط مستودع GitHub بمنصة Vercel** مع إضافة متغيرات البيئة الثلاثة (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) للنشر السحابي التلقائي من فرع `main`.

</div>
