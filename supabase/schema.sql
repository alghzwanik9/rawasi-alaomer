-- ==============================================================================
-- Rawasi Al-Omar (رواسي العمر) — Enterprise Database Schema
-- Project: https://qghyfyktqibycanncbkk.supabase.co
-- Idempotent setup for 14 Core Governance, CRM, and Marjea CMS Tables
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. INQUIRIES (Lead Qualification & CRM Inquiries)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ref_id TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    entity_type TEXT NOT NULL,
    entity_type_name TEXT NOT NULL,
    entity_name TEXT,
    services TEXT[] DEFAULT '{}',
    service_names TEXT[] DEFAULT '{}',
    notes TEXT,
    project_name TEXT,
    city TEXT DEFAULT 'الرياض',
    budget_range TEXT DEFAULT 'لم تحدد بعد',
    timeline TEXT DEFAULT 'فوري',
    need_type TEXT DEFAULT 'تنفيذ تسليم مفتاح متكامل',
    contact_name TEXT NOT NULL,
    contact_role TEXT,
    contact_phone TEXT NOT NULL,
    contact_email TEXT,
    meeting_preference TEXT DEFAULT 'عن بُعد عبر Teams / Zoom',
    assigned_to TEXT,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'contacted', 'proposal_sent', 'closed_won')),
    whatsapp_url TEXT
);

CREATE INDEX IF NOT EXISTS idx_inquiries_ref_id ON public.inquiries(ref_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON public.inquiries(created_at DESC);

-- ------------------------------------------------------------------------------
-- 2. SECTORS (The 5 Integrated Sectors)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.sectors (
    id TEXT PRIMARY KEY, -- contracting, supply, tech, operations, community
    number TEXT NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    summary TEXT NOT NULL,
    full_description TEXT NOT NULL,
    accent_color TEXT NOT NULL,
    badge_text TEXT NOT NULL,
    scope TEXT[] DEFAULT '{}',
    beneficiaries TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    sla_highlight TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 3. KNOWLEDGE_CATEGORIES (The 9 Marjea Knowledge Categories)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.knowledge_categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 4. MARJEA_PROCEDURES (Unified Procedural Guides)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.marjea_procedures (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    code TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    category_id TEXT NOT NULL REFERENCES public.knowledge_categories(id) ON DELETE CASCADE,
    expected_time TEXT NOT NULL,
    authority TEXT NOT NULL,
    last_updated TEXT NOT NULL,
    short_summary TEXT NOT NULL,
    full_description TEXT NOT NULL,
    quick_action_label TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'in_review', 'published')),
    maker_name TEXT DEFAULT 'أ. نورة القحطاني',
    checker_name TEXT,
    data JSONB, -- Full structured snapshot
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_marjea_procedures_slug ON public.marjea_procedures(slug);
CREATE INDEX IF NOT EXISTS idx_marjea_procedures_category ON public.marjea_procedures(category_id);

-- ------------------------------------------------------------------------------
-- 5. PROCEDURE_STEPS (Sequential Stepper Steps)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.procedure_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    procedure_id TEXT NOT NULL REFERENCES public.marjea_procedures(id) ON DELETE CASCADE,
    step_number INT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    official_badge TEXT NOT NULL DEFAULT 'المعلومة الرسمية',
    official_reference TEXT NOT NULL,
    official_text TEXT NOT NULL,
    advisory_badge TEXT NOT NULL DEFAULT 'الخبرة الإرشادية من رواسي العمر',
    advisory_text TEXT NOT NULL,
    extra_note_label TEXT,
    extra_note_text TEXT,
    UNIQUE(procedure_id, step_number)
);

-- ------------------------------------------------------------------------------
-- 6. PROCEDURE_TEMPLATES (Downloadable Ready-to-use Documents)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.procedure_templates (
    id TEXT PRIMARY KEY,
    procedure_id TEXT NOT NULL REFERENCES public.marjea_procedures(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    format TEXT NOT NULL,
    file_type TEXT NOT NULL,
    download_file_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 7. PROCEDURE_PREREQUISITES (Mandatory Checklist Before Starting)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.procedure_prerequisites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    procedure_id TEXT NOT NULL REFERENCES public.marjea_procedures(id) ON DELETE CASCADE,
    headline TEXT NOT NULL,
    detail TEXT NOT NULL,
    display_order INT DEFAULT 0
);

-- ------------------------------------------------------------------------------
-- 8. CMS_WORKFLOW_LOGS (Maker-Checker Audit Trail)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cms_workflow_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    procedure_id TEXT NOT NULL REFERENCES public.marjea_procedures(id) ON DELETE CASCADE,
    action TEXT NOT NULL, -- submit_for_review, approve, reject, draft_saved
    performed_by TEXT NOT NULL,
    role_id TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 9. STAFF_PROFILES (Internal Team & RBAC)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.staff_profiles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role_id TEXT NOT NULL CHECK (role_id IN ('super_admin', 'sector_manager', 'marjea_editor', 'governance_reviewer')),
    role_title TEXT NOT NULL,
    department TEXT NOT NULL,
    sector TEXT,
    status TEXT NOT NULL DEFAULT 'نشط',
    access_scope TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 10. TURNKEY_BLUEPRINTS (Ready-to-deploy Operational Models)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.turnkey_blueprints (
    code TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    duration TEXT NOT NULL,
    sectors TEXT[] DEFAULT '{}',
    summary TEXT NOT NULL,
    deliverables TEXT[] DEFAULT '{}',
    accent_color TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 11. NON_PROFIT_TRACKS (The 6 Empowerment Tracks)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.non_profit_tracks (
    num TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    color TEXT NOT NULL,
    link_to_marjea TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 12. LEAD_TIMELINE_EVENTS (CRM Audit & Status Changes)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lead_timeline_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inquiry_id UUID NOT NULL REFERENCES public.inquiries(id) ON DELETE CASCADE,
    from_status TEXT,
    to_status TEXT NOT NULL,
    actor TEXT NOT NULL,
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 13. PROPOSALS (Price Quotes & Scopes of Work)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.proposals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inquiry_id UUID NOT NULL REFERENCES public.inquiries(id) ON DELETE CASCADE,
    proposal_number TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'declined')),
    valid_until DATE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 14. AUDIT_LOGS (System-wide Compliance Log)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_email TEXT,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marjea_procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.procedure_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.procedure_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.procedure_prerequisites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_workflow_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.turnkey_blueprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.non_profit_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. Public Read Policies for content tables
DO $$
BEGIN
    DROP POLICY IF EXISTS "Public read sectors" ON public.sectors;
    CREATE POLICY "Public read sectors" ON public.sectors FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Public read categories" ON public.knowledge_categories;
    CREATE POLICY "Public read categories" ON public.knowledge_categories FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Public read procedures" ON public.marjea_procedures;
    CREATE POLICY "Public read procedures" ON public.marjea_procedures FOR SELECT USING (status = 'published');

    DROP POLICY IF EXISTS "Public read procedure steps" ON public.procedure_steps;
    CREATE POLICY "Public read procedure steps" ON public.procedure_steps FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Public read procedure templates" ON public.procedure_templates;
    CREATE POLICY "Public read procedure templates" ON public.procedure_templates FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Public read procedure prerequisites" ON public.procedure_prerequisites;
    CREATE POLICY "Public read procedure prerequisites" ON public.procedure_prerequisites FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Public read blueprints" ON public.turnkey_blueprints;
    CREATE POLICY "Public read blueprints" ON public.turnkey_blueprints FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Public read tracks" ON public.non_profit_tracks;
    CREATE POLICY "Public read tracks" ON public.non_profit_tracks FOR SELECT USING (true);

    -- Staff profiles are internal: no public policy.
    DROP POLICY IF EXISTS "Public read staff" ON public.staff_profiles;
END $$;

-- 2. Sensitive tables (inquiries, staff, proposals, logs): NO public policies.
--    All access goes through the server API with the service_role key,
--    which bypasses RLS. Remove legacy over-permissive policies if present.
DROP POLICY IF EXISTS "Public can submit inquiry" ON public.inquiries;
DROP POLICY IF EXISTS "Service role & admin full access to inquiries" ON public.inquiries;

-- ==============================================================================
-- TABLE PRIVILEGES (new Supabase projects do not auto-grant)
-- ==============================================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES    IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL ROUTINES  IN SCHEMA public TO service_role;

GRANT SELECT ON
    public.sectors,
    public.knowledge_categories,
    public.marjea_procedures,
    public.procedure_steps,
    public.procedure_templates,
    public.procedure_prerequisites,
    public.turnkey_blueprints,
    public.non_profit_tracks
TO anon, authenticated;

REVOKE ALL ON
    public.inquiries,
    public.staff_profiles,
    public.lead_timeline_events,
    public.proposals,
    public.audit_logs,
    public.cms_workflow_logs
FROM anon, authenticated;
