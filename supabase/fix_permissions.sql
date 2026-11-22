-- ==============================================================================
-- Rawasi Al-Omar — Permissions & RLS hardening (idempotent, safe to re-run)
-- Run once in Supabase SQL Editor after schema.sql + seed.sql.
-- ==============================================================================

-- 1) Remove over-permissive policies -------------------------------------------
-- "FOR ALL USING (true)" let ANY client (incl. the public publishable key)
-- read, edit and delete every lead. The service_role key bypasses RLS anyway,
-- so the server-side API does not need this policy.
DROP POLICY IF EXISTS "Service role & admin full access to inquiries" ON public.inquiries;

-- Inquiries are submitted through our server API (/api/inquiries) using the
-- service_role key, so direct public inserts are not needed (prevents spam).
DROP POLICY IF EXISTS "Public can submit inquiry" ON public.inquiries;

-- Staff profiles contain internal emails/roles — not public.
DROP POLICY IF EXISTS "Public read staff" ON public.staff_profiles;

-- 2) Table privileges (new Supabase projects do not auto-grant) --------------
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- Server-side API (service_role) — full access, bypasses RLS.
GRANT ALL ON ALL TABLES    IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL ROUTINES  IN SCHEMA public TO service_role;

-- Public website content — read-only; rows still filtered by RLS policies.
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

-- Make sure anon/authenticated have NO privileges on sensitive tables.
REVOKE ALL ON
    public.inquiries,
    public.staff_profiles,
    public.lead_timeline_events,
    public.proposals,
    public.audit_logs,
    public.cms_workflow_logs
FROM anon, authenticated;
