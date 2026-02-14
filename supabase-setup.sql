-- =============================================
-- Valentine App - Supabase Setup
-- Run this in your Supabase Dashboard: SQL Editor > New query
-- =============================================

-- TABLE: couples
CREATE TABLE public.couples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  data JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- Auto-update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_couples_updated
  BEFORE UPDATE ON public.couples
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- =============================================
-- RLS POLICIES
-- Security relies on UUID being unguessable (122 bits of randomness)
-- =============================================
ALTER TABLE public.couples ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create a couple"
  ON public.couples
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone with the ID can read"
  ON public.couples
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone with the ID can update"
  ON public.couples
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- =============================================
-- STORAGE BUCKET: couple-photos
-- =============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('couple-photos', 'couple-photos', true);

CREATE POLICY "Allow photo uploads"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'couple-photos');

CREATE POLICY "Allow public photo reads"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'couple-photos');

CREATE POLICY "Allow photo updates"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'couple-photos')
  WITH CHECK (bucket_id = 'couple-photos');
