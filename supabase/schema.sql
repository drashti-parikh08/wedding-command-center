-- ==============================================================================
-- WEDDING COMMAND CENTER - DATABASE SCHEMA & SECURITY POLICIES (PHASE 1)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. HELPER FUNCTIONS & TRIGGERS

-- Automatically update 'updated_at' timestamp on any row update
CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Normalize city names (e.g. 'Bombay' -> 'Mumbai')
CREATE OR REPLACE FUNCTION public.normalize_city(raw_city TEXT)
RETURNS TEXT AS $$
BEGIN
  IF raw_city IS NULL THEN
    RETURN NULL;
  END IF;
  
  raw_city := TRIM(raw_city);
  
  -- Common city normalization mappings
  IF LOWER(raw_city) IN ('bombay', 'mumbai', 'mum') THEN
    RETURN 'Mumbai';
  ELSIF LOWER(raw_city) IN ('ahmedabad', 'amdavad', 'ahd') THEN
    RETURN 'Ahmedabad';
  ELSIF LOWER(raw_city) IN ('baroda', 'vadodara') THEN
    RETURN 'Vadodara';
  ELSIF LOWER(raw_city) IN ('surat', 'sur') THEN
    RETURN 'Surat';
  ELSIF LOWER(raw_city) IN ('rajkot') THEN
    RETURN 'Rajkot';
  ELSIF LOWER(raw_city) IN ('delhi', 'new delhi') THEN
    RETURN 'Delhi';
  ELSIF LOWER(raw_city) IN ('bengaluru', 'bangalore') THEN
    RETURN 'Bengaluru';
  ELSE
    -- Capitalize first letter of each word
    RETURN INITCAP(raw_city);
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ==============================================================================
-- 3. TABLES DEFINITION
-- ==============================================================================

-- PROFILES (Users and roles linked 1-to-1 with Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'family' CHECK (role IN ('admin', 'family')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- FUNCTIONS (The wedding events)
CREATE TABLE IF NOT EXISTS public.functions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  date DATE NOT NULL,
  venue TEXT NOT NULL,
  notes TEXT,
  accent_key TEXT NOT NULL DEFAULT 'peach', -- 'peach', 'lavender', 'sage-light'
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- HOUSEHOLDS (Physical family units for Kankotri delivery)
CREATE TABLE IF NOT EXISTS public.households (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, -- e.g. "Shah Family", "Ramesh & Gita Patel"
  city TEXT NOT NULL, -- Normalized city
  area TEXT,          -- Neighborhood/suburb e.g. "Borivali West"
  address_note TEXT,  -- Flat/Building, landmark, directions
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- GUESTS (Individual attendees for catering, seating, and headcount)
CREATE TABLE IF NOT EXISTS public.guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,         -- Optional, sensitive
  city TEXT,          -- Normalized city
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- FUNCTION_GUESTS (Junction: Guest attendance & RSVP status per event)
CREATE TABLE IF NOT EXISTS public.function_guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id UUID NOT NULL REFERENCES public.guests(id) ON DELETE CASCADE,
  function_id UUID NOT NULL REFERENCES public.functions(id) ON DELETE CASCADE,
  invitation_status TEXT NOT NULL DEFAULT 'invited' CHECK (invitation_status IN ('invited', 'uninvited')),
  rsvp_status TEXT NOT NULL DEFAULT 'unknown' CHECK (rsvp_status IN ('invited', 'confirmed', 'declined', 'unknown')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_guest_function UNIQUE (guest_id, function_id)
);

-- KANKOTRI_VISITS (Household invitation visit checklist with 1-to-1 mapping)
CREATE TABLE IF NOT EXISTS public.kankotri_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID NOT NULL UNIQUE REFERENCES public.households(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'not_visited' CHECK (status IN ('not_visited', 'delivered', 'needs_revisit')),
  visited_on TIMESTAMPTZ,
  visited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- VENDORS (Minimal vendor directory)
CREATE TABLE IF NOT EXISTS public.vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'Caterer', 'Decorator', 'Photographer', 'DJ', etc.
  phone TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- PAYMENTS (Bills & expenses stored in integer paise: ₹1 = 100 paise)
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  function_id UUID NOT NULL REFERENCES public.functions(id) ON DELETE CASCADE,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE SET NULL,
  payee_text TEXT NOT NULL,
  title TEXT NOT NULL,
  amount_paise BIGINT NOT NULL CHECK (amount_paise >= 0),
  paid_on DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'paid' CHECK (status IN ('paid', 'pending', 'advance')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- PAYMENT_ATTACHMENTS (Receipt photo paths in private storage)
CREATE TABLE IF NOT EXISTS public.payment_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID NOT NULL REFERENCES public.payments(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes BIGINT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 4. ATTACH 'updated_at' TRIGGERS
-- ==============================================================================
CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
CREATE TRIGGER set_functions_updated_at BEFORE UPDATE ON public.functions FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
CREATE TRIGGER set_households_updated_at BEFORE UPDATE ON public.households FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
CREATE TRIGGER set_guests_updated_at BEFORE UPDATE ON public.guests FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
CREATE TRIGGER set_function_guests_updated_at BEFORE UPDATE ON public.function_guests FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
CREATE TRIGGER set_kankotri_visits_updated_at BEFORE UPDATE ON public.kankotri_visits FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
CREATE TRIGGER set_vendors_updated_at BEFORE UPDATE ON public.vendors FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
CREATE TRIGGER set_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
CREATE TRIGGER set_payment_attachments_updated_at BEFORE UPDATE ON public.payment_attachments FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- Auto-create profile row when a new user signs up in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'family')
  )
  ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-create a kankotri_visits record whenever a household is created
CREATE OR REPLACE FUNCTION public.handle_new_household()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.kankotri_visits (household_id, status)
  VALUES (NEW.id, 'not_visited')
  ON CONFLICT (household_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_household_created ON public.households;
CREATE TRIGGER on_household_created
  AFTER INSERT ON public.households
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_household();

-- ==============================================================================
-- 5. ROW LEVEL SECURITY (RLS) HELPER & POLICIES
-- ==============================================================================

-- Helper function: Is the calling user an admin?
-- SECURITY DEFINER runs with the privileges of the creator to bypass recursive RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- ENABLE RLS ON ALL TABLES (Non-negotiable security requirement)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.functions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.households ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.function_guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kankotri_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_attachments ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- POLICIES: PROFILES
-- ------------------------------------------------------------------------------
-- Authenticated users can view their own profile; admins can view all profiles
CREATE POLICY "profiles_select_policy" ON public.profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.is_admin());

-- Users can update their own email/info; only admins can change roles
CREATE POLICY "profiles_update_policy" ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid() OR public.is_admin())
  WITH CHECK (
    public.is_admin() OR (id = auth.uid() AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()))
  );

-- ------------------------------------------------------------------------------
-- POLICIES: OPERATIONAL TABLES (functions, households, guests, function_guests, kankotri_visits, vendors, payments, payment_attachments)
-- ------------------------------------------------------------------------------

-- READ (SELECT): Any authenticated user can view wedding operational data
CREATE POLICY "functions_select" ON public.functions FOR SELECT TO authenticated USING (true);
CREATE POLICY "households_select" ON public.households FOR SELECT TO authenticated USING (true);
CREATE POLICY "guests_select" ON public.guests FOR SELECT TO authenticated USING (true);
CREATE POLICY "function_guests_select" ON public.function_guests FOR SELECT TO authenticated USING (true);
CREATE POLICY "kankotri_visits_select" ON public.kankotri_visits FOR SELECT TO authenticated USING (true);
CREATE POLICY "vendors_select" ON public.vendors FOR SELECT TO authenticated USING (true);
CREATE POLICY "payments_select" ON public.payments FOR SELECT TO authenticated USING (true);
CREATE POLICY "payment_attachments_select" ON public.payment_attachments FOR SELECT TO authenticated USING (true);

-- INSERT: Authenticated users can log visits, add guests, upload payments
CREATE POLICY "households_insert" ON public.households FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "guests_insert" ON public.guests FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "function_guests_insert" ON public.function_guests FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "kankotri_visits_insert" ON public.kankotri_visits FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "vendors_insert" ON public.vendors FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "payments_insert" ON public.payments FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "payment_attachments_insert" ON public.payment_attachments FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "functions_insert_admin" ON public.functions FOR INSERT TO authenticated WITH CHECK (public.is_admin());

-- UPDATE: Authenticated users can update RSVP, mark visit delivered, edit bills
CREATE POLICY "households_update" ON public.households FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "guests_update" ON public.guests FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "function_guests_update" ON public.function_guests FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "kankotri_visits_update" ON public.kankotri_visits FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "vendors_update" ON public.vendors FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "payments_update" ON public.payments FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "payment_attachments_update" ON public.payment_attachments FOR UPDATE TO authenticated USING (true);
CREATE POLICY "functions_update_admin" ON public.functions FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- DELETE: Admin-only for destructive deletions (safeguards accidental data loss)
CREATE POLICY "households_delete_admin" ON public.households FOR DELETE TO authenticated USING (public.is_admin());
CREATE POLICY "guests_delete_admin" ON public.guests FOR DELETE TO authenticated USING (public.is_admin());
CREATE POLICY "function_guests_delete_admin" ON public.function_guests FOR DELETE TO authenticated USING (public.is_admin());
CREATE POLICY "kankotri_visits_delete_admin" ON public.kankotri_visits FOR DELETE TO authenticated USING (public.is_admin());
CREATE POLICY "vendors_delete_admin" ON public.vendors FOR DELETE TO authenticated USING (public.is_admin());
CREATE POLICY "payments_delete_admin" ON public.payments FOR DELETE TO authenticated USING (public.is_admin());
CREATE POLICY "payment_attachments_delete_admin" ON public.payment_attachments FOR DELETE TO authenticated USING (public.is_admin());
CREATE POLICY "functions_delete_admin" ON public.functions FOR DELETE TO authenticated USING (public.is_admin());

-- ==============================================================================
-- 6. PRIVATE STORAGE BUCKET: 'receipts'
-- ==============================================================================

-- Create private bucket if not present
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'receipts',
  'receipts',
  false, -- STRICTLY PRIVATE (no public access)
  10485760, -- 10 MB per file max
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic'];

-- STORAGE RLS POLICIES (on storage.objects)

-- 1. Read: Authenticated family members can view receipts via signed URLs
CREATE POLICY "receipts_select_authenticated" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'receipts');

-- 2. Insert: Authenticated family members can upload receipt photos
CREATE POLICY "receipts_insert_authenticated" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'receipts');

-- 3. Delete: Only admins can delete receipt photos
CREATE POLICY "receipts_delete_admin" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'receipts' AND public.is_admin());
