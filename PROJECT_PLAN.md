# PROJECT_PLAN.md — Rawasi Al-Omar (رواسي العمر) Digital Platform

## 1. Executive Summary & Strategic Positioning
**Client:** Rawasi Al-Omar (رواسي العمر) — `rawasialomar.sa`
**Project Value:** Enterprise-grade ($5,000+ agency standard)
**Core Positioning:** A premier Saudi consulting and turnkey project execution startup that bridges strategy, governance, and field execution under one roof ("جهة واحدة، مسار واضح").
**Strategic Approach for a Startup:** Since Rawasi Al-Omar is a dynamic, newly established company, the public website MUST NOT fabricate large historical project counts (e.g., avoid fake "500+ projects" claims). Instead, authority and trust are built through:
1. **Execution Methodologies & Turnkey Blueprints** (ready-to-deploy operational models).
2. **Institutional Governance & Quality Standards** (100% compliance, 360° lifecycle).
3. **Specialized Non-Profit & Awqaf Solutions** (connecting licensing, governance, and field execution).
4. **Interactive Project Qualification Engine** (replacing raw WhatsApp redirects with a structured multi-step lead qualification flow).

---

## 2. Official Brand Design System (Extracted from Brand Logo)
**STRICT RULE:** Maintain a bright, clean, airy light-mode aesthetic with generous white breathing room. Do NOT use dark moody backgrounds, brown, or gold accents.

- **Canvas & Surfaces:**
  - Dominant Background: Pure Crisp White (`#FFFFFF`)
  - Soft Architectural Tint (Hero circular backdrops & subtle cards): Very Pale Ice Blue (`#F2F8FC`)
  - Card Borders: Crisp Cool Border (`#E2ECF5`)
- **Primary Brand Color (Logo, Main Headings, Primary CTAs, Footer):**
  - Deep Royal Navy (`#163063`)[cite: 7, 8]
- **Secondary Architectural Spectrum (Icons, Badges, Highlights, Gradients):**
  - Classic Corporate Blue (`#2360A5`)[cite: 8]
  - Bright Sky Cerulean (`#3488C4`)[cite: 8]
  - Soft Turquoise Teal (`#47A3B8`)[cite: 7, 8]
- **Typography:**
  - Arabic (Default `dir="rtl"`): `IBM Plex Sans Arabic` (Weights: 400, 500, 600, 700)
  - English (`dir="ltr"`): `IBM Plex Sans`
  - Heading Color: `#163063` / `#1E293B` | Body Text: `#526071`

---

## 3. System Architecture (Unified Monorepo)
Build using **Next.js 14+ (App Router)**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, and **Lucide Icons**, structured into two distinct Route Groups sharing a unified database/API layer:

```text
rawasi-alomar/
├── public/
│   └── brand/
│       └── logo.svg                 # Swappable SVG logo component (4-bar blue arch + Arabic title)
├── src/
│   ├── app/
│   │   ├── (public)/                # [A] PUBLIC CORPORATE & SOLUTIONS WEBSITE
│   │   │   ├── layout.tsx           # Sticky White Navbar + Corporate Footer
│   │   │   ├── page.tsx             # Homepage (Editorial + Conversion Funnel)
│   │   │   ├── about/page.tsx       # Brand Philosophy ("الرواسي" & "العمر"), Vision, Methodology
│   │   │   ├── sectors/
│   │   │   │   ├── page.tsx         # Overview of the 5 Integrated Sectors
│   │   │   │   └── [slug]/page.tsx  # Dynamic pages: contracting, supply, tech, operations, community
│   │   │   ├── non-profit/page.tsx  # Dedicated Portal for Charities, Awqaf & Donors (6 Tracks)
│   │   │   ├── impact/page.tsx      # Impact Lab, SROI Framework & Turnkey Blueprints
│   │   │   └── start-project/page.tsx # Multi-Step Project Qualification Wizard
│   │   │
│   │   ├── (portal)/                # [B] INTERNAL ADMIN & STAFF DASHBOARD (Protected)
│   │   │   ├── login/page.tsx       # Staff & Admin Authentication
│   │   │   └── dashboard/
│   │   │       ├── layout.tsx       # RTL Sidebar Navigation & Top Bar
│   │   │       ├── page.tsx         # Executive KPI Overview (Leads by Sector & Entity Type)
│   │   │       ├── leads/page.tsx   # CRM Pipeline (New -> Under Review -> Contacted -> Proposal Sent)
│   │   │       ├── cms/page.tsx     # Manage Blueprints, News, and Sector Content
│   │   │       └── team/page.tsx    # Role-Based Access Control (Admin vs. Sector Manager)
│   │   │
│   │   └── api/
│   │       ├── inquiries/route.ts   # Handle project submissions + generate Ref ID (e.g., RAO-2026-101)
│   │       └── auth/route.ts        # Session & RBAC handling
│   │
│   ├── components/
│   │   ├── BrandLogo.tsx            # Centralized logo wrapper using /public/brand/logo.svg
│   │   ├── public/                  # Hero, SectorCards, LifecycleStepper, NonProfitMatrix, LeadWizard
│   │   └── portal/                  # LeadsTable, StatusBadge, LeadDetailDrawer, StatsCards
│   └── data/
│       └── siteContent.ts           # Bilingual (AR/EN) structured content & startup capability metrics