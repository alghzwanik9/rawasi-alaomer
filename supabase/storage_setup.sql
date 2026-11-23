-- ==============================================================================
-- Supabase Storage Provisioning for Rawasi Al-Omar
-- Bucket: marjea-templates (Public bucket for governance/procedural templates)
-- ==============================================================================

-- 1. Create or update the public storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'marjea-templates',
  'marjea-templates',
  true,
  52428800, -- 50 MB limit
  ARRAY[
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'application/pdf',
    'application/zip',
    'text/plain',
    'application/octet-stream'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. Storage RLS Policies for storage.objects
DO $$
BEGIN
  -- Policy: Public can view and download all templates
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public Access for Marjea Templates'
  ) THEN
    CREATE POLICY "Public Access for Marjea Templates"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'marjea-templates');
  END IF;

  -- Policy: Staff (authenticated) & Service Role can upload templates
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Staff insert templates'
  ) THEN
    CREATE POLICY "Staff insert templates"
    ON storage.objects FOR INSERT
    TO authenticated, service_role
    WITH CHECK (bucket_id = 'marjea-templates');
  END IF;

  -- Policy: Staff (authenticated) & Service Role can update templates
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Staff update templates'
  ) THEN
    CREATE POLICY "Staff update templates"
    ON storage.objects FOR UPDATE
    TO authenticated, service_role
    USING (bucket_id = 'marjea-templates');
  END IF;

  -- Policy: Staff (authenticated) & Service Role can delete templates
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Staff delete templates'
  ) THEN
    CREATE POLICY "Staff delete templates"
    ON storage.objects FOR DELETE
    TO authenticated, service_role
    USING (bucket_id = 'marjea-templates');
  END IF;
END $$;

-- 3. Add download_url & download_count columns to procedure_templates
ALTER TABLE public.procedure_templates 
ADD COLUMN IF NOT EXISTS download_url text,
ADD COLUMN IF NOT EXISTS download_count integer DEFAULT 0;

-- 4. Atomic increment function for template downloads
CREATE OR REPLACE FUNCTION public.increment_template_download(template_id text)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_count integer;
BEGIN
  UPDATE public.procedure_templates
  SET download_count = COALESCE(download_count, 0) + 1
  WHERE id = template_id
  RETURNING download_count INTO new_count;
  
  RETURN COALESCE(new_count, 0);
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_template_download(text) TO anon, authenticated, service_role;

-- 5. Create templates view alias for unified access
CREATE OR REPLACE VIEW public.templates AS
SELECT * FROM public.procedure_templates;

-- 6. Set public Supabase Storage URL on all procedure templates
UPDATE public.procedure_templates
SET download_url = 'https://qghyfyktqibycanncbkk.supabase.co/storage/v1/object/public/marjea-templates/' || download_file_name
WHERE download_url IS NULL OR download_url = '';
