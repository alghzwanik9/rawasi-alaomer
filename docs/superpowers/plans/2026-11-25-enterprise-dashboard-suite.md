# Enterprise Dashboard Suite (لوحة الإدارة والحوكمة الشاملة) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the Rawasi Al-Omar admin portal into a full enterprise operational and governance suite encompassing: Human Resources & Attendance Hub, Projects Portfolio Showcase CMS, Initiatives & SROI Lab, and Full Audit Trail Governance.

**Architecture:** Next.js 16 App Router architecture using React 19, Tailwind CSS v4, Lucide Icons, and Supabase PostgreSQL with resilient local dual-store fallbacks. Adds 4 dedicated dashboard route segments (`/dashboard/hr`, `/dashboard/projects`, `/dashboard/initiatives`, `/dashboard/governance`) backed by modular REST API handlers (`/api/hr/*`, `/api/projects`, `/api/initiatives`, `/api/governance/audit`).

**Tech Stack:** Next.js 16.4.6 (Turbopack), React 19, TypeScript, Supabase PostgreSQL, Tailwind CSS v4, Lucide Icons, Framer Motion.

**Spec:** [docs/superpowers/specs/2026-11-25-enterprise-dashboard-suite-design.md](file:///d:/DEV/ACTIVE/rawasialomar/docs/superpowers/specs/2026-11-25-enterprise-dashboard-suite-design.md)

## Global Constraints

- **Language & Layout:** Arabic primary, strict RTL layout (`dir="rtl"`), font `IBM Plex Sans Arabic`.
- **Aesthetic:** Crisp light-mode architectural theme (`#FFFFFF`, `#F2F8FC`, `#E2ECF5`, `#163063`, `#2360A5`, `#47A3B8`). Zero dark themes.
- **Zero-Slop Content:** Realistic Saudi corporate data, actual departments (المشاريع الهندسية، التوريد، الحوكمة، الموارد البشرية، الإدارة التنفيذية).
- **Dual-Layer Persistence:** All APIs must support live Supabase queries with automated in-memory and JSON storage fallback for full reliability.
- **Build Quality:** Must compile cleanly with `pnpm build` (exit code 0) across all routes with zero TypeScript or linting errors.

## Review Focus

1. **RBAC & Authorization:** HR and governance actions must reflect the actor's role (`super_admin`, `sector_manager`, `hr_admin`, `governance_reviewer`).
2. **Attendance Time Logic:** Clock-in / clock-out calculations must compute positive elapsed hours and properly tag late arrivals without timezone shifts.
3. **Responsive Drawers & Modals:** Employee creation and Project addition modals must render cleanly on mobile viewports (375px+) without horizontal scrolling.
4. **Before/After Media Rendering:** Portfolio project cards must handle missing or loading images gracefully with branded placeholders.
5. **Audit Trail Completeness:** Key operational actions (adding employee, publishing project, approving leave) must log an entry in `audit_logs`.

---

### Task 1: Navigation Expansion & Seed Data Store Setup

**Files:**
- Modify: `src/app/(portal)/dashboard/layout.tsx`
- Create: `src/data/portalEnterpriseSeed.ts`
- Modify: `src/data/portalAuth.ts` (add `hr_admin` role if needed)

**Interfaces:**
- Produces: `SEEDED_ATTENDANCE`, `SEEDED_LEAVES`, `SEEDED_PORTFOLIO_PROJECTS`, `SEEDED_INITIATIVES`, `SEEDED_AUDIT_LOGS`

- [ ] **Step 1: Create `src/data/portalEnterpriseSeed.ts`**
Define typed data structures and comprehensive realistic records for attendance, leaves, portfolio projects, initiatives, and audit logs.

- [ ] **Step 2: Update `src/app/(portal)/dashboard/layout.tsx`**
Expand `navLinks` to include:
1. "نظرة عامة" (`/dashboard`)
2. "طلبات المشاريع (CRM)" (`/dashboard/leads`)
3. "الموارد البشرية والدوام" (`/dashboard/hr`)
4. "معرض المشاريع" (`/dashboard/projects`)
5. "المبادرات والأثر" (`/dashboard/initiatives`)
6. "إدارة مرجع الجمعيات" (`/dashboard/marjea-cms`)
7. "الحوكمة والرقابة" (`/dashboard/governance`)
8. "فريق العمل والصلاحيات" (`/dashboard/team`)

- [ ] **Step 3: Verify TypeScript compilation**
Run: `pnpm exec tsc --noEmit`
Expected: PASS with 0 errors.

- [ ] **Step 4: Commit**
```bash
git add src/data/portalEnterpriseSeed.ts src/app/(portal)/dashboard/layout.tsx
git commit -m "feat(portal): expand dashboard navigation and define enterprise seed store"
```

---

### Task 2: HR & Attendance Hub (`/dashboard/hr` + `/api/hr/*`)

**Files:**
- Create: `src/app/api/hr/attendance/route.ts`
- Create: `src/app/api/hr/leaves/route.ts`
- Create: `src/app/(portal)/dashboard/hr/page.tsx`

**Interfaces:**
- Consumes: `SEEDED_ATTENDANCE`, `SEEDED_LEAVES`, `SEEDED_TEAM_MEMBERS`
- Produces: Full HR dashboard with live clock-in/out, attendance ledger table with status pills, employee add modal, and leaves approval workflow.

- [ ] **Step 1: Implement `/api/hr/attendance/route.ts`**
Support GET (list attendance by date/staff) and POST (clock-in / clock-out / manual record).

- [ ] **Step 2: Implement `/api/hr/leaves/route.ts`**
Support GET (list leave requests) and POST (submit leave) and PATCH (approve/reject with reviewer name).

- [ ] **Step 3: Implement `/dashboard/hr/page.tsx`**
Build the complete HR Management interface:
1. Executive KPI Cards: إجمالي الكادر، نسبة الحضور اليومي، الموظفون في إجازة، ساعات العمل المنجزة.
2. Quick Action Bar: "تسجيل حضورك الآن" (Check-in/Check-out)، "طلب إجازة"، و "إضافة موظف جديد".
3. Tabs:
   - سجل الحضور والانصراف اليومي (جدول تفصيلي مع حالات: حاضر، متأخر، مستأذن، غائب).
   - طلبات الإجازات (بطاقات الموافقة والاعتماد الإداري).
   - دليل الكوادر والموظفين (بطاقات الموظفين بالأقسام).
4. Modal: نموذج إضافة موظف متكامل يرسل البيانات إلى `/api/staff` وينشئ السجل الإداري.

- [ ] **Step 4: Verify TypeScript compilation**
Run: `pnpm exec tsc --noEmit`
Expected: PASS with 0 errors.

- [ ] **Step 5: Commit**
```bash
git add src/app/api/hr/ src/app/(portal)/dashboard/hr/
git commit -m "feat(hr): implement HR and attendance management hub with check-in and leaves workflow"
```

---

### Task 3: Projects Portfolio & Showcase CMS (`/dashboard/projects` + `/api/projects`)

**Files:**
- Create: `src/app/api/projects/route.ts`
- Create: `src/app/(portal)/dashboard/projects/page.tsx`

**Interfaces:**
- Consumes: `SEEDED_PORTFOLIO_PROJECTS`
- Produces: Portfolio project management, image comparisons, publishing toggle, and project creation modal.

- [ ] **Step 1: Implement `/api/projects/route.ts`**
Support GET (list projects), POST (create new project), and PATCH (update project status or toggle `isPublished`).

- [ ] **Step 2: Implement `/dashboard/projects/page.tsx`**
Build the Project Portfolio CMS interface:
1. Summary KPIs: إجمالي مشاريع تسليم المفتاح، المشاريع المنجزة، قيد التنفيذ، والمعروضة في البوابة العامة.
2. Filter bar by Sector (مقاولات، توريد، تقنية، تشغيل، مجتمعي).
3. Project Cards Grid:
   - Cover image or Before/After preview.
   - Project title, client/entity name, city, and contract budget.
   - Status badge and toggle for "معروض في البوابة العامة".
4. Modal: "إضافة مشروع جديد للمحفظة" مع الحقول الهندسية وجداول الكميات.

- [ ] **Step 3: Verify TypeScript compilation**
Run: `pnpm exec tsc --noEmit`
Expected: PASS with 0 errors.

- [ ] **Step 4: Commit**
```bash
git add src/app/api/projects/ src/app/(portal)/dashboard/projects/
git commit -m "feat(portfolio): implement projects showcase CMS with before/after gallery"
```

---

### Task 4: Initiatives & Impact Lab (`/dashboard/initiatives` + `/api/initiatives`)

**Files:**
- Create: `src/app/api/initiatives/route.ts`
- Create: `src/app/(portal)/dashboard/initiatives/page.tsx`

**Interfaces:**
- Consumes: `SEEDED_INITIATIVES`
- Produces: Community initiatives tracking, SROI multiplier cards, and milestone progress bars.

- [ ] **Step 1: Implement `/api/initiatives/route.ts`**
Support GET, POST, and PATCH for community initiatives and SROI calculations.

- [ ] **Step 2: Implement `/dashboard/initiatives/page.tsx`**
Build the Initiatives & Impact interface:
1. Impact KPIs: عدد المبادرات النشطة، إجمالي المستفيدين المحققين، متوسط العائد الاجتماعي على الاستثمار (SROI Multiplier)، ونسبة الالتزام بالجدول الزمني.
2. Initiative Cards:
   - Partner Charity/Waqf name.
   - Milestones progress stepper (`1 ← 2 ← 3`).
   - SROI badge (e.g. `1 : 3.8 ر.س عائد اجتماعي`).
3. Modal: "إطلاق مبادرة تنموية جديدة".

- [ ] **Step 3: Verify TypeScript compilation**
Run: `pnpm exec tsc --noEmit`
Expected: PASS with 0 errors.

- [ ] **Step 4: Commit**
```bash
git add src/app/api/initiatives/ src/app/(portal)/dashboard/initiatives/
git commit -m "feat(initiatives): implement initiatives tracking and SROI impact lab"
```

---

### Task 5: Enterprise Governance & Audit Trail (`/dashboard/governance` + `/api/governance/audit`)

**Files:**
- Create: `src/app/api/governance/audit/route.ts`
- Create: `src/app/(portal)/dashboard/governance/page.tsx`

**Interfaces:**
- Consumes: `SEEDED_AUDIT_LOGS`
- Produces: Live audit trail table, RBAC permissions matrix, and compliance policies repository.

- [ ] **Step 1: Implement `/api/governance/audit/route.ts`**
Support GET (list audit logs with actor and date filters) and POST (record audit event).

- [ ] **Step 2: Implement `/dashboard/governance/page.tsx`**
Build the Enterprise Governance & Audit interface:
1. Governance Metrics: مؤشر الامتثال المؤسسي (100%)، عدد العمليات الموثقة اليوم، الموافقات المزدوجة المعلقة، والسياسات المعتمدة.
2. Tabs:
   - سجل التدقيق والرقابة الفورية (Audit Trail Table مع اسم الموظف، دوره، نوع الحركة، تفاصيل الإجراء، والتاريخ الدقيق).
   - مصفوفة الصلاحيات والحوكمة (RBAC Matrix للأدوار الأربعة: المدير العام، مدير القطاع، مسؤول الموارد، مراجع الحوكمة).
   - مستودع السياسات واللوائح والامتثال المعتمد من المركز الوطني.

- [ ] **Step 3: Verify TypeScript compilation**
Run: `pnpm exec tsc --noEmit`
Expected: PASS with 0 errors.

- [ ] **Step 4: Commit**
```bash
git add src/app/api/governance/ src/app/(portal)/dashboard/governance/
git commit -m "feat(governance): implement enterprise governance dashboard, audit logs, and RBAC matrix"
```

---

### Task 6: Overview Dashboard Unification & Production Build Verification

**Files:**
- Modify: `src/app/(portal)/dashboard/page.tsx`
- Modify: `HANDOFF.md`

**Interfaces:**
- Consumes: All 4 new modules
- Produces: Unified Executive Overview dashboard with cross-module summary cards and clean production build.

- [ ] **Step 1: Enhance `/dashboard/page.tsx`**
Link quick widgets for HR attendance summary, active portfolio count, and recent audit alerts on the main executive dashboard overview.

- [ ] **Step 2: Run complete production build verification**
Run: `pnpm build`
Expected: Exit Code 0, compiling all 39+ routes with zero errors.

- [ ] **Step 3: Update `HANDOFF.md`**
Document all new routes, APIs, tables, and credentials.

- [ ] **Step 4: Commit and push to remotes**
```bash
git add -A
git commit -m "feat: complete Enterprise Dashboard Suite with HR, Portfolio, Initiatives, and Governance"
git push upstream main dev
git push origin main dev
```
