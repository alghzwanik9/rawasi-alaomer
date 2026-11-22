# CLAUDE.md — Rawasi Al-Omar (رواسي العمر) Development Guidelines

This document provides project-specific instructions, commands, architectural patterns, and standards for Claude Code and related assistants working in this repository.

---

## 1. Project Overview & Philosophy
- **Client**: Rawasi Al-Omar (رواسي العمر) — Premier Saudi consulting and turnkey execution startup.
- **Core Positioning**: Bridging institutional governance, strategy, and field execution ("جهة واحدة، مسار واضح").
- **Startup Integrity Rule**: Never invent fake track records (e.g., no "500+ completed projects"). Authority is derived from turnkey blueprints, transparent governance, execution methodologies, and the qualification engine.
- **Architecture**: Next.js 15/16 (App Router), React 19, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons.
- **Package Manager**: Strictly use **`pnpm`** (never use `npm` or `yarn` directly).

---

## 2. Essential Commands

```bash
# Development
pnpm dev              # Start Turbopack development server on http://localhost:3000

# Verification & Build
pnpm build            # Full production build + TypeScript checking (Must pass with 0 errors)
pnpm lint             # Run ESLint validation

# Package Management (Uses global content-addressable store on D:\)
pnpm add <pkg>        # Add production dependency
pnpm add -D <pkg>     # Add development dependency
```

---

## 3. Brand System & Visual Language

Maintain a **bright, airy, architectural light-mode look** with generous whitespace. Strictly avoid dark backgrounds, muddy browns, or gold accents.

### Color Tokens
- **Canvas / Surfaces**:
  - Main Background: Pure White (`#FFFFFF`)
  - Architectural Soft Tint: Pale Ice Blue (`#F2F8FC`)
  - Structural Borders: Cool Border (`#E2ECF5`)
- **Primary Brand**:
  - Deep Royal Navy (`#163063`) — Headings, primary brand accents, prominent CTAs, footer.
- **Secondary Spectrum**:
  - Corporate Blue (`#2360A5`)
  - Bright Sky Cerulean (`#3488C4`)
  - Soft Turquoise Teal (`#47A3B8`)
- **Typography & Direction**:
  - Default direction: RTL (`dir="rtl"`, Arabic first).
  - Arabic Font: `IBM Plex Sans Arabic` (weights: 400, 500, 600, 700).
  - English Font: `IBM Plex Sans`.

---

## 4. Engineering Invariants & Code Standards

### Next.js & React Rules
- **Server Components by Default**: Every page and layout in `src/app/` must be a Server Component unless interactive state (`useState`, `useEffect`, event handlers, `framer-motion`) requires client execution.
- **Isolate Client Boundaries**: Confine `"use client"` strictly to leaf components inside `src/components/`.
- **No UI Slop**:
  - Zero placeholder / lorem-ipsum copy. Always write contextual, professional Arabic content reflecting the brand's executive voice.
  - Pixel-perfect responsive design across mobile (375px+), tablet (768px+), and desktop (1280px+).
  - Fluid micro-interactions using Framer Motion (subtle lifts, hover transitions, staggered section reveals).
  - Clean accessibility: meaningful `aria-*` tags, keyboard navigation, clear focus states.

### Project Structure Reference
```text
rawasialomar/
├── .agents/
│   ├── plugins/                 # Stitch & Superpowers plugins
│   └── skills/                  # 60+ modular skills (Stitch, Superpowers, Next.js patterns)
├── public/                      # Static assets & brand SVG logos
├── src/
│   ├── app/
│   │   ├── (public)/            # Public corporate pages & qualification wizard
│   │   ├── (portal)/            # Internal admin/staff CRM dashboard (protected)
│   │   └── api/                 # Lead intake & authentication endpoints
│   ├── components/              # Modular UI components (Client & Server)
│   └── data/                    # Structured bilingual content & sector definitions
├── AGENTS.md                    # Antigravity & Agent guidelines
├── CLAUDE.md                    # Claude Code guidelines (this file)
└── PROJECT_PLAN.md              # Master project specification
```

---

## 5. Skills Suites & Methodology Integration

This workspace has three pre-installed skill suites located in `.agents/skills/`:
1. **Google Stitch Skills**: Bridge Google Stitch UI designs and design system tokens (`DESIGN.md`, `react-components`, `stitch-ui-design`) into modular React components.
2. **Superpowers Discipline**:
   - Always plan multi-step changes first (referencing [PROJECT_PLAN.md](file:///d:/DEV/ACTIVE/rawasialomar/PROJECT_PLAN.md)).
   - Always run `pnpm build` before declaring tasks complete (`verification-before-completion`).
   - Isolate root causes systematically when resolving issues (`systematic-debugging`).
3. **Agentic Awesome Skills**: Follow high-end frontend architecture, Next.js App Router patterns, Tailwind tokens, and performance optimizations.
