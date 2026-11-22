<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# Rawasi Al-Omar (رواسي العمر) — Agent Engineering Guidelines & Skills Framework

This workspace is powered by three specialized Agent Skill Suites located in `.agents/skills/`:
1. **Google Stitch Design Skills (`stitch-*`, `design-md`, `code-to-design`, `react-components`)**: Bridging Google Stitch UI designs and design tokens into production code.
2. **Superpowers Engineering Methodology (`writing-plans`, `executing-plans`, `systematic-debugging`, `verification-before-completion`, `test-driven-development`)**: Ensuring disciplined, plan-first, verified software delivery.
3. **Agentic Awesome Skills (`nextjs-app-router-patterns`, `react-best-practices`, `ui-ux-pro-max`, `anti-ui-slop`, `ui-motion`, `tailwind-design-system`)**: Delivering enterprise-grade UI/UX, accessibility, and high performance.

---

## 1. Project Standards & Brand System
- **Client & Identity**: Rawasi Al-Omar (رواسي العمر) — Enterprise consulting and turnkey execution startup.
- **Aesthetic Direction**: Crisp, bright, airy light-mode architectural look with generous whitespace. Strictly avoid dark moody themes, browns, or golds.
- **Brand Palette**:
  - Dominant Background: Crisp White (`#FFFFFF`)
  - Architectural Soft Tint: Pale Ice Blue (`#F2F8FC`)
  - Border Accents: Cool Border (`#E2ECF5`)
  - Primary Brand / Headings: Deep Royal Navy (`#163063`)
  - Secondary Accents: Corporate Blue (`#2360A5`), Bright Sky Cerulean (`#3488C4`), Soft Turquoise Teal (`#47A3B8`)
- **Typography & Direction**:
  - Default direction: RTL (`dir="rtl"`, Arabic first).
  - Primary Arabic Font: `IBM Plex Sans Arabic`
  - English Font: `IBM Plex Sans`

---

## 2. Google Stitch UI Integration Protocol
When consuming or integrating designs created in Google Stitch:
- **Design Tokens**: Read tokens and typography from `DESIGN.md` or Stitch exports and map them directly to Tailwind classes and CSS variables.
- **Component Translation**: Use the `stitch-ui-design` and `react-components` skill guidelines to break down full-page layouts into modular, reusable components inside `src/components/`.
- **Responsive Architecture**: Ensure every Stitch screen translates seamlessly across mobile (375px+), tablet (768px+), and desktop (1280px+).

---

## 3. Superpowers Execution Workflow
Follow the disciplined software engineering lifecycle:
1. **Plan First**: Before executing multi-step changes, structure clear work items aligned with [PROJECT_PLAN.md](file:///d:/DEV/ACTIVE/rawasialomar/PROJECT_PLAN.md).
2. **Systematic Implementation**: Build iteratively; avoid massive monolithic edits.
3. **Verification Before Completion**: Run automated checks (`pnpm run build`, linting, route checks) to verify that zero errors or regressions exist before reporting completion.

---

## 4. Next.js 15/16 & React 19 Core Engineering Rules
- **Server Components by Default**: All components in `src/app/` are Server Components unless interactivity (`useState`, `useEffect`, `framer-motion`) requires `"use client"`.
- **Client Islands**: Keep `"use client"` boundaries as small as possible at the leaf component level.
- **No UI Slop**: Maintain pixel-perfect alignments, intentional micro-interactions (Framer Motion), clean accessible interactive states (`hover`, `focus-visible`, `active`), and zero placeholder lorem-ipsum content.

