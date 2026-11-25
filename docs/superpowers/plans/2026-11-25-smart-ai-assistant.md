# Smart AI Assistant (المساعد الذكي التفاعلي) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a grounded, interactive 24/7 AI Assistant widget on the Rawasi Al-Omar public platform that advises clients on sectors and Marjea procedures, automatically qualifies and logs project leads into Supabase CRM, and generates a pre-formatted executive WhatsApp handoff.

**Architecture:** Next.js 16 App Router full-stack implementation using `@google/genai` on a protected server API route (`/api/ai/assistant`) with grounded domain knowledge injection (`knowledgeBase.ts`), dual-layer CRM ingestion (`public.inquiries`), and a responsive client-side chat widget (`AIAssistantWidget.tsx`) styled in Rawasi Al-Omar's architectural light-mode aesthetic.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, `@google/genai` SDK, Supabase (PostgreSQL 17), Tailwind CSS v4, Lucide Icons, Framer Motion.

**Spec:** [docs/superpowers/specs/2026-11-23-smart-ai-assistant-design.md](file:///d:/DEV/ACTIVE/rawasialomar/docs/superpowers/specs/2026-11-23-smart-ai-assistant-design.md)

## Global Constraints

- **Language & Direction:** Arabic primary, RTL layout (`dir="rtl"`), font `IBM Plex Sans Arabic`.
- **Visual Aesthetic:** Crisp light-mode architectural theme (`#FFFFFF`, `#F2F8FC`, `#E2ECF5`, `#163063`, `#47A3B8`). Zero dark moody themes, browns, or golds.
- **Brand Guardrails:** Strict zero-slop rule. No speculative or binding price commitments without engineering studies; grounded only in verified company services and Marjea procedures.
- **Security:** `GEMINI_API_KEY` must strictly live on the server side (`.env.local`). Never expose it to client components or public responses.
- **Build Quality:** All Next.js builds must exit with code 0 (`pnpm build`) with zero TypeScript or linting errors.

## Review Focus

1. **Missing or Invalid `GEMINI_API_KEY`:** Must gracefully degrade to an intelligent structured fallback with quick navigation buttons and direct WhatsApp contact rather than throwing 500 errors.
2. **Abuse & Rate Limiting:** Enforce a per-session limit (max 15 messages) to prevent API quota drain and malicious spamming.
3. **Lead Extraction Precision:** Extract contact name, phone, entity type, and sector into Supabase `inquiries` and return a valid `RAO-2026-XXX` reference ID without halting the conversational flow.
4. **WhatsApp URL Formatting:** Pre-fill Arabic message with proper URI encoding containing ref ID, contact info, and clear bullet points for Executive Management (`+966 57 599 9956`).
5. **Mobile Responsiveness (375px+):** Floating widget and drawer must not cause horizontal scroll, must close smoothly on backdrops or exit buttons, and must keep keyboard inputs accessible on touch devices.

---

### Task 1: Install `@google/genai` & Setup AI Client Configuration

**Files:**
- Modify: `package.json`
- Create: `src/lib/ai/geminiClient.ts`
- Modify: `.env.example`
- Create: `tests/ai/geminiClient.test.ts`

**Interfaces:**
- Consumes: `process.env.GEMINI_API_KEY`
- Produces: `getGeminiClient(): GoogleGenAI | null`, `isGeminiConfigured(): boolean`

- [ ] **Step 1: Write the failing test for Gemini client configuration**

Create `tests/ai/geminiClient.test.ts`:
```typescript
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { getGeminiClient, isGeminiConfigured } from "@/lib/ai/geminiClient";

describe("geminiClient", () => {
  const originalKey = process.env.GEMINI_API_KEY;

  afterEach(() => {
    process.env.GEMINI_API_KEY = originalKey;
  });

  it("returns isGeminiConfigured = false when GEMINI_API_KEY is not set", () => {
    delete process.env.GEMINI_API_KEY;
    expect(isGeminiConfigured()).toBe(false);
    expect(getGeminiClient()).toBeNull();
  });

  it("returns isGeminiConfigured = true and an instance when key is present", () => {
    process.env.GEMINI_API_KEY = "test_key_123";
    expect(isGeminiConfigured()).toBe(true);
    expect(getGeminiClient()).not.toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm dlx vitest run tests/ai/geminiClient.test.ts` (or standard node test runner)
Expected: FAIL ("Cannot find module '@/lib/ai/geminiClient'")

- [ ] **Step 3: Install `@google/genai` dependency**

Run: `pnpm add @google/genai`

- [ ] **Step 4: Implement `src/lib/ai/geminiClient.ts` and update `.env.example`**

```typescript
import { GoogleGenAI } from "@google/genai";

let cachedClient: GoogleGenAI | null = null;

export function isGeminiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);
}

export function getGeminiClient(): GoogleGenAI | null {
  if (!isGeminiConfigured()) {
    return null;
  }
  if (!cachedClient) {
    cachedClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  }
  return cachedClient;
}
```

Add `GEMINI_API_KEY=your_gemini_api_key_here` to `.env.example`.

- [ ] **Step 5: Run tests and verify PASS**

Run: `pnpm dlx vitest run tests/ai/geminiClient.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add package.json pnpm-lock.yaml .env.example src/lib/ai/geminiClient.ts tests/ai/geminiClient.test.ts
git commit -m "feat(ai): install @google/genai and configure server client wrapper"
```

---

### Task 2: Grounded Domain Knowledge Base & Prompt Engine

**Files:**
- Create: `src/lib/ai/knowledgeBase.ts`
- Create: `tests/ai/knowledgeBase.test.ts`

**Interfaces:**
- Consumes: Sectors metadata, Marjea procedures data (`src/data/portalSeed.ts`, `src/data/siteContent.ts`)
- Produces: `RAWASI_KNOWLEDGE_CONTEXT: string`, `buildSystemInstruction(): string`, `detectLeadIntent(text: string): boolean`

- [ ] **Step 1: Write test for knowledge base completeness and prompt rules**

Create `tests/ai/knowledgeBase.test.ts`:
```typescript
import { describe, it, expect } from "vitest";
import { buildSystemInstruction, RAWASI_KNOWLEDGE_CONTEXT } from "@/lib/ai/knowledgeBase";

describe("knowledgeBase", () => {
  it("includes all 5 core sectors and executive phone number", () => {
    expect(RAWASI_KNOWLEDGE_CONTEXT).toContain("المقاولات والتطوير الإنشائي");
    expect(RAWASI_KNOWLEDGE_CONTEXT).toContain("التجهيز والتوريد المتكامل");
    expect(RAWASI_KNOWLEDGE_CONTEXT).toContain("التقنية والحلول الذكية");
    expect(RAWASI_KNOWLEDGE_CONTEXT).toContain("التشغيل والصيانة وإدارة المرافق");
    expect(RAWASI_KNOWLEDGE_CONTEXT).toContain("التنمية المجتمعية وتمكين القطاع غير الربحي");
    expect(RAWASI_KNOWLEDGE_CONTEXT).toContain("966575999956");
  });

  it("enforces no-slop architectural rules and price guardrails", () => {
    const systemPrompt = buildSystemInstruction();
    expect(systemPrompt).toContain("عدم إعطاء أسعار قطعية");
    expect(systemPrompt).toContain("رواسي العمر");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm dlx vitest run tests/ai/knowledgeBase.test.ts`
Expected: FAIL ("Cannot find module '@/lib/ai/knowledgeBase'")

- [ ] **Step 3: Implement `src/lib/ai/knowledgeBase.ts`**

Implement `src/lib/ai/knowledgeBase.ts` incorporating:
1. Executive Identity: Startup consulting and turnkey execution entity ("جهة واحدة، مسار واضح").
2. 5 Sectors with deliverables and target clients.
3. 6 Non-Profit empowerment tracks and links to Marjea procedures.
4. Key Marjea procedures & template download URLs (`/api/marjea/templates/download`).
5. Strict guardrails against hallucinated figures, pricing, or commitments without engineering review.
6. Structured function calling schema for qualified lead capture.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm dlx vitest run tests/ai/knowledgeBase.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/ai/knowledgeBase.ts tests/ai/knowledgeBase.test.ts
git commit -m "feat(ai): define grounded domain knowledge base and prompt guardrails"
```

---

### Task 3: Server-side AI Assistant API Route (`/api/ai/assistant`)

**Files:**
- Create: `src/app/api/ai/assistant/route.ts`
- Create: `tests/ai/assistantRoute.test.ts`

**Interfaces:**
- Consumes: `POST { messages: Array<{ role: 'user' | 'model', content: string }>, sessionId?: string }`
- Produces: `NextResponse.json({ reply: string, leadCreated?: { refId: string, whatsappUrl: string }, suggestions?: string[] })`

- [ ] **Step 1: Write test for API route (rate limiting, validation, and fallback)**

Create `tests/ai/assistantRoute.test.ts`:
```typescript
import { describe, it, expect } from "vitest";
import { POST } from "@/app/api/ai/assistant/route";
import { NextRequest } from "next/server";

describe("POST /api/ai/assistant", () => {
  it("rejects empty body with 400", async () => {
    const req = new NextRequest("http://localhost:3000/api/ai/assistant", {
      method: "POST",
      body: JSON.stringify({}),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns fallback message when Gemini API key is unconfigured", async () => {
    delete process.env.GEMINI_API_KEY;
    const req = new NextRequest("http://localhost:3000/api/ai/assistant", {
      method: "POST",
      body: JSON.stringify({
        messages: [{ role: "user", content: "مرحبا، ما هي خدماتكم؟" }],
      }),
    });
    const res = await POST(req);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.reply).toBeDefined();
    expect(data.fallback).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm dlx vitest run tests/ai/assistantRoute.test.ts`
Expected: FAIL ("Cannot find module '@/app/api/ai/assistant/route'")

- [ ] **Step 3: Implement `src/app/api/ai/assistant/route.ts`**

1. In-memory sliding window rate limiter (max 15 requests per sessionId / IP).
2. Input validation for `messages`.
3. If `!isGeminiConfigured()`, return graceful fallback response with quick service cards and WhatsApp contact.
4. With Gemini configured:
   - Call Gemini model (e.g. `gemini-2.5-flash`) with `systemInstruction: buildSystemInstruction()`.
   - Implement function calling tool `saveProjectInquiry({ contactName, contactPhone, entityType, sector, city, notes })`.
   - When tool is invoked, insert lead into `public.inquiries` via `getSupabaseAdminClient()` (or fallback store), generate `RAO-2026-XXX`, construct encoded WhatsApp URL (`buildWhatsappUrl`), and return details in JSON response.
5. Return clean JSON containing `{ reply, leadCreated, suggestions }`.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm dlx vitest run tests/ai/assistantRoute.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/api/ai/assistant/route.ts tests/ai/assistantRoute.test.ts
git commit -m "feat(api): implement /api/ai/assistant with Gemini, rate limiting, and CRM lead capture"
```

---

### Task 4: Interactive Floating AI Assistant Widget UI (`AIAssistantWidget.tsx`)

**Files:**
- Create: `src/components/public/AIAssistantWidget.tsx`
- Create: `tests/components/AIAssistantWidget.test.tsx`

**Interfaces:**
- Consumes: `/api/ai/assistant` POST endpoint, `sessionStorage` for message persistence
- Produces: Floating trigger button, interactive conversation drawer with quick action chips, message bubbles, template download links, and WhatsApp handoff card.

- [ ] **Step 1: Write component test verifying initial state and quick chips**

Create `tests/components/AIAssistantWidget.test.tsx`:
```typescript
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { AIAssistantWidget } from "@/components/public/AIAssistantWidget";

describe("AIAssistantWidget", () => {
  it("renders floating launcher button with accessible label", () => {
    render(<AIAssistantWidget />);
    const button = screen.getByRole("button", { name: /المساعد الذكي|مساعد رواسي/i });
    expect(button).toBeDefined();
  });

  it("opens conversation drawer when launcher is clicked", () => {
    render(<AIAssistantWidget />);
    const button = screen.getByRole("button", { name: /المساعد الذكي|مساعد رواسي/i });
    fireEvent.click(button);
    expect(screen.getByText(/رواسي العمر الذكي|مساعد رواسي الاستشاري/i)).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm dlx vitest run tests/components/AIAssistantWidget.test.tsx`
Expected: FAIL ("Cannot find module '@/components/public/AIAssistantWidget'")

- [ ] **Step 3: Implement `src/components/public/AIAssistantWidget.tsx`**

- Use `"use client"`.
- Style strictly with architectural brand colors:
  - Header: `#163063` with status dot (أخضر متصل / أزرق متصل).
  - Background: `#FFFFFF` and `#F2F8FC`.
  - Accents: `#47A3B8` (Turquoise) for assistant message highlights and `#163063` for user bubbles.
  - Border: `#E2ECF5`.
- Features:
  - Floating trigger button at bottom left (`left-6 bottom-6 z-50` with subtle pulse ping).
  - Expandable modal/drawer (380px wide on desktop, 100% on mobile < 400px).
  - Quick action chips:
    * "📋 استفسار عن تأهيل وترخيص جمعية"
    * "🏗️ طلب دراسة مشروع مقاولات وتجهيز"
    * "📥 نماذج وأدلة مرجع الجمعيات"
  - Auto-scrolling message list with typing indicator (3-dot animated pulse).
  - Lead qualification card when `leadCreated` is returned:
    * Shows reference number `RAO-2026-XXX`.
    * High-visibility WhatsApp button with WhatsApp green `#25D366` and direct pre-filled link.
  - Session persistence in `sessionStorage` (`rawasi_chat_session_v1`).

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm dlx vitest run tests/components/AIAssistantWidget.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/public/AIAssistantWidget.tsx tests/components/AIAssistantWidget.test.tsx
git commit -m "feat(ui): create architectural AIAssistantWidget component with quick chips and WhatsApp handoff"
```

---

### Task 5: Integration into Public Layout & End-to-End Build Verification

**Files:**
- Modify: `src/app/(public)/layout.tsx`

**Interfaces:**
- Consumes: `<AIAssistantWidget />`
- Produces: Active AI Assistant across all public routes (`/`, `/about`, `/sectors`, `/sectors/*`, `/non-profit`, `/impact`, `/start-project`, `/marjea`).

- [ ] **Step 1: Mount `AIAssistantWidget` in `src/app/(public)/layout.tsx`**

```tsx
import React from "react";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { AIAssistantWidget } from "@/components/public/AIAssistantWidget";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <div className="flex-1 pt-20">{children}</div>
      <AIAssistantWidget />
      <Footer />
    </div>
  );
}
```

- [ ] **Step 2: Run build verification check**

Run: `pnpm build`
Expected: Success with `Exit Code 0`, compiling all routes (including `/api/ai/assistant`) with zero errors.

- [ ] **Step 3: Verification test via local test script or cURL**

Run a synthetic test against `/api/ai/assistant` verifying valid JSON structure and lead qualification response.

- [ ] **Step 4: Commit and finalize**

```bash
git add src/app/(public)/layout.tsx
git commit -m "feat: embed AIAssistantWidget in public layout and verify production build"
```

---

## Plan Review & Handoff Checklist
- [x] Grounded strictly in company specs and approved design document.
- [x] Zero-slop adherence: No fabricated pricing or promises without studies.
- [x] Graceful degradation if `GEMINI_API_KEY` is not immediately set.
- [x] Multi-layer lead logging into Supabase CRM + WhatsApp handoff.
- [x] Full responsive design (mobile 375px+ to desktop).
