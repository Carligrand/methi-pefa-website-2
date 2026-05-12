-- ============ 1. ROLES & TYPES ============
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
        CREATE TYPE public.app_role AS ENUM ('bishop', 'it_admin', 'editor');
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('bishop','it_admin')
  )
$$;

-- user_roles policies
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own roles' AND tablename = 'user_roles') THEN
        CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'IT admins can view all roles' AND tablename = 'user_roles') THEN
        CREATE POLICY "IT admins can view all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'it_admin'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'IT admins can insert roles' AND tablename = 'user_roles') THEN
        CREATE POLICY "IT admins can insert roles" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'it_admin'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'IT admins can delete roles' AND tablename = 'user_roles') THEN
        CREATE POLICY "IT admins can delete roles" ON public.user_roles FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'it_admin'));
    END IF;
END $$;

-- ============ 2. PROFILES & AUTH TRIGGER ============
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own profile' AND tablename = 'profiles') THEN
        CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can view all profiles' AND tablename = 'profiles') THEN
        CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own profile' AND tablename = 'profiles') THEN
        CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid());
    END IF;
END $$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;

-- FIX: Drop before create to avoid "already exists" error
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ 3. CONTENT TABLES & HELPERS ============
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- site_settings
CREATE TABLE IF NOT EXISTS public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  youtube_channel_id text,
  youtube_live_video_id text,
  facebook_page_url text,
  mpesa_paybill text,
  mpesa_account text,
  card_donation_url text,
  contact_phone text,
  contact_email text,
  contact_address text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
DROP TRIGGER IF EXISTS trg_site_settings_updated ON public.site_settings;
CREATE TRIGGER trg_site_settings_updated BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- bishop_profile
CREATE TABLE IF NOT EXISTS public.bishop_profile (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'Bishop David G. Nduati',
  title text NOT NULL DEFAULT 'Senior Pastor · PEFA Methi Cathedral Branch',
  photo_url text,
  bio text,
  schedule jsonb NOT NULL DEFAULT '[]'::jsonb,
  phone text,
  email text,
  verse text,
  verse_reference text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.bishop_profile ENABLE ROW LEVEL SECURITY;
DROP TRIGGER IF EXISTS trg_bishop_profile_updated ON public.bishop_profile;
CREATE TRIGGER trg_bishop_profile_updated BEFORE UPDATE ON public.bishop_profile FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- church_history
CREATE TABLE IF NOT EXISTS public.church_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  intro text,
  full_history text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.church_history ENABLE ROW LEVEL SECURITY;
DROP TRIGGER IF EXISTS trg_church_history_updated ON public.church_history;
CREATE TRIGGER trg_church_history_updated BEFORE UPDATE ON public.church_history FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- past_pastors
CREATE TABLE IF NOT EXISTS public.past_pastors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  years text NOT NULL,
  title text NOT NULL,
  accomplishments text[] NOT NULL DEFAULT '{}',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.past_pastors ENABLE ROW LEVEL SECURITY;
DROP TRIGGER IF EXISTS trg_past_pastors_updated ON public.past_pastors;
CREATE TRIGGER trg_past_pastors_updated BEFORE UPDATE ON public.past_pastors FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- sermons
CREATE TABLE IF NOT EXISTS public.sermons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  speaker text,
  preached_on date,
  scripture text,
  description text,
  video_url text,
  thumbnail_url text,
  tags text[] NOT NULL DEFAULT '{}',
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.sermons ENABLE ROW LEVEL SECURITY;
DROP TRIGGER IF EXISTS trg_sermons_updated ON public.sermons;
CREATE TRIGGER trg_sermons_updated BEFORE UPDATE ON public.sermons FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ministries
CREATE TABLE IF NOT EXISTS public.ministries (
  id text PRIMARY KEY,
  name text NOT NULL,
  tagline text,
  mission text,
  vision text,
  support_info text,
  leaders jsonb NOT NULL DEFAULT '[]'::jsonb,
  cover_image_url text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.ministries ENABLE ROW LEVEL SECURITY;
DROP TRIGGER IF EXISTS trg_ministries_updated ON public.ministries;
CREATE TRIGGER trg_ministries_updated BEFORE UPDATE ON public.ministries FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ministry_events
CREATE TABLE IF NOT EXISTS public.ministry_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- CHANGED FROM uuid TO text TO MATCH ministries(id)
  ministry_id text NOT NULL REFERENCES public.ministries(id) ON DELETE CASCADE, 
  title text NOT NULL,
  event_date date NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.ministry_events ENABLE ROW LEVEL SECURITY;

-- Don't forget the trigger for updated_at!
DROP TRIGGER IF EXISTS trg_ministry_events_updated ON public.ministry_events;
CREATE TRIGGER trg_ministry_events_updated 
  BEFORE UPDATE ON public.ministry_events 
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  
-- ministry_gallery
CREATE TABLE IF NOT EXISTS public.ministry_gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ministry_id text NOT NULL REFERENCES public.ministries(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  caption text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.ministry_gallery ENABLE ROW LEVEL SECURITY;

-- order_of_service
CREATE TABLE IF NOT EXISTS public.order_of_service (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name text NOT NULL DEFAULT 'Sunday Service',
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.order_of_service ENABLE ROW LEVEL SECURITY;
DROP TRIGGER IF EXISTS trg_oos_updated ON public.order_of_service;
CREATE TRIGGER trg_oos_updated BEFORE UPDATE ON public.order_of_service FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ 4. DYNAMIC POLICIES ============
DO $$
DECLARE t text;
BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'site_settings','bishop_profile','church_history','past_pastors',
    'sermons','ministries','ministry_events','ministry_gallery','order_of_service'
  ]) LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Public can view %1$s" ON public.%1$s', t);
    EXECUTE format('CREATE POLICY "Public can view %1$s" ON public.%1$s FOR SELECT USING (true);', t);
    
    EXECUTE format('DROP POLICY IF EXISTS "Admins can insert %1$s" ON public.%1$s', t);
    EXECUTE format('CREATE POLICY "Admins can insert %1$s" ON public.%1$s FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));', t);
    
    EXECUTE format('DROP POLICY IF EXISTS "Admins can update %1$s" ON public.%1$s', t);
    EXECUTE format('CREATE POLICY "Admins can update %1$s" ON public.%1$s FOR UPDATE TO authenticated USING (public.is_admin(auth.uid()));', t);
    
    EXECUTE format('DROP POLICY IF EXISTS "Admins can delete %1$s" ON public.%1$s', t);
    EXECUTE format('CREATE POLICY "Admins can delete %1$s" ON public.%1$s FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));', t);
  END LOOP;
END $$;

-- Override sermon policy for visibility
DROP POLICY IF EXISTS "Public can view sermons" ON public.sermons;
DROP POLICY IF EXISTS "Public can view published sermons" ON public.sermons;
CREATE POLICY "Public can view published sermons" ON public.sermons
  FOR SELECT USING (published = true OR public.is_admin(auth.uid()));

-- ============ 5. SEED DATA ============
INSERT INTO public.site_settings (mpesa_paybill, mpesa_account, contact_email)
SELECT '000000', 'METHIPEFA', 'info@methipefa.org'
WHERE NOT EXISTS (SELECT 1 FROM public.site_settings);

INSERT INTO public.bishop_profile (bio, phone, email, verse, verse_reference, schedule)
SELECT 
  'Shepherding PEFA Methi Cathedral Branch...', 
  '+254 000 000 000', 
  'bishop@methipefa.org', 
  'For I know the plans...', 
  'Jeremiah 29:11', 
  '[{"day":"Sunday","times":"Main Service · 9:00 AM – 1:00 PM"}]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.bishop_profile);

INSERT INTO public.church_history (intro, full_history)
SELECT 'PEFA METHI CATHEDRAL...', 'PEFA METHI CATHEDRAL BRANCH was planted in the late 1970s...'
WHERE NOT EXISTS (SELECT 1 FROM public.church_history);

-- For multi-row tables, use ON CONFLICT
INSERT INTO public.past_pastors (name, years, title, accomplishments, sort_order) 
VALUES
('Bishop Ngure','1978 – 1995','Founding Bishop', ARRAY['Pioneered...'], 1),
('Rev. Joseph Kamau','1995 – 2008','Senior Pastor', ARRAY['Led...'], 2),
('Pastor Samuel Mwangi','2008 – 2017','Senior Pastor', ARRAY['Oversaw...'], 3),
('Bishop David G. Nduati','2017 – Present','Presiding Bishop', ARRAY['Launched...'], 4)
ON CONFLICT DO NOTHING;

INSERT INTO public.ministries (id, name, tagline, mission, vision, support_info) 
VALUES
('men','Men''s Ministry','Men of integrity...','Raise godly men...','A generation...','Support...'),
('women','Women''s Ministry','Daughters of grace...','Disciple women...','Transformed homes...','Support...'),
('youth','Youth Ministry','Bold for Christ...','Equip young people...','A generation on fire...','Sponsor...'),
('children','Children''s Ministry','Little hearts...','Nurture children...','Children rooted...','Donate...')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.order_of_service (service_name, items)
SELECT 'Sunday Service', '[{"time":"9:00 AM","item":"Praise & Worship"}]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.order_of_service);

INSERT INTO public.sermons (title, speaker, preached_on, scripture, description, published)
VALUES
('Hope That Does Not Disappoint','Bishop David G. Nduati','2025-04-20','Romans 5:1-5','...', true),
('The Power of Prayer','Rev. Joseph Kamau','2025-03-30','James 5:13-18','...', true),
('Walking in the Spirit','Pastor Samuel Mwangi','2025-03-09','Galatians 5:16-25','...', true)
ON CONFLICT DO NOTHING;

-- ============ 6. STORAGE BUCKETS ============
INSERT INTO storage.buckets (id, name, public) 
VALUES
  ('sermon-thumbnails','sermon-thumbnails', true),
  ('ministry-gallery','ministry-gallery', true),
  ('bishop-photos','bishop-photos', true),
  ('site-assets','site-assets', true)
ON CONFLICT (id) DO NOTHING;

DO $$
DECLARE b text;
BEGIN
  FOR b IN SELECT unnest(ARRAY['sermon-thumbnails','ministry-gallery','bishop-photos','site-assets']) LOOP
    EXECUTE format($f$DROP POLICY IF EXISTS "Public read %1$s" ON storage.objects;$f$, b);
    EXECUTE format($f$CREATE POLICY "Public read %1$s" ON storage.objects FOR SELECT USING (bucket_id = '%1$s');$f$, b);
    
    EXECUTE format($f$DROP POLICY IF EXISTS "Admins upload %1$s" ON storage.objects;$f$, b);
    EXECUTE format($f$CREATE POLICY "Admins upload %1$s" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = '%1$s' AND public.is_admin(auth.uid()));$f$, b);
    
    EXECUTE format($f$DROP POLICY IF EXISTS "Admins update %1$s" ON storage.objects;$f$, b);
    EXECUTE format($f$CREATE POLICY "Admins update %1$s" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = '%1$s' AND public.is_admin(auth.uid()));$f$, b);
    
    EXECUTE format($f$DROP POLICY IF EXISTS "Admins delete %1$s" ON storage.objects;$f$, b);
    EXECUTE format($f$CREATE POLICY "Admins delete %1$s" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = '%1$s' AND public.is_admin(auth.uid()));$f$, b);
  END LOOP;
END $$;