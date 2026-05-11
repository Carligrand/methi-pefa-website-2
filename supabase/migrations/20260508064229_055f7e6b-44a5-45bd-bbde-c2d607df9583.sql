
-- ============ ROLES ============
CREATE TYPE public.app_role AS ENUM ('bishop', 'it_admin', 'editor');

CREATE TABLE public.user_roles (
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
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "IT admins can view all roles" ON public.user_roles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'it_admin'));
CREATE POLICY "IT admins can insert roles" ON public.user_roles
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'it_admin'));
CREATE POLICY "IT admins can delete roles" ON public.user_roles
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'it_admin'));

-- Profiles for showing email/name in admin
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (id = auth.uid());

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ updated_at helper ============
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- ============ CONTENT TABLES ============
-- Generic helper macro pattern; we'll write each table.

-- site_settings (singleton)
CREATE TABLE public.site_settings (
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
CREATE TRIGGER trg_site_settings_updated BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- bishop_profile (singleton)
CREATE TABLE public.bishop_profile (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'Bishop David G. Nduati',
  title text NOT NULL DEFAULT 'Senior Pastor · Methi PEFA',
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
CREATE TRIGGER trg_bishop_profile_updated BEFORE UPDATE ON public.bishop_profile FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- church_history (singleton)
CREATE TABLE public.church_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  intro text,
  full_history text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.church_history ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_church_history_updated BEFORE UPDATE ON public.church_history FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- past_pastors
CREATE TABLE public.past_pastors (
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
CREATE TRIGGER trg_past_pastors_updated BEFORE UPDATE ON public.past_pastors FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- sermons
CREATE TABLE public.sermons (
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
CREATE TRIGGER trg_sermons_updated BEFORE UPDATE ON public.sermons FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ministries
CREATE TABLE public.ministries (
  id text PRIMARY KEY, -- 'men' | 'women' | 'youth' | 'children'
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
CREATE TRIGGER trg_ministries_updated BEFORE UPDATE ON public.ministries FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ministry_events
CREATE TABLE public.ministry_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ministry_id text NOT NULL REFERENCES public.ministries(id) ON DELETE CASCADE,
  title text NOT NULL,
  event_date date NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.ministry_events ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_ministry_events_updated BEFORE UPDATE ON public.ministry_events FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ministry_gallery
CREATE TABLE public.ministry_gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ministry_id text NOT NULL REFERENCES public.ministries(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  caption text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.ministry_gallery ENABLE ROW LEVEL SECURITY;

-- order_of_service (singleton with items jsonb)
CREATE TABLE public.order_of_service (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name text NOT NULL DEFAULT 'Sunday Service',
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.order_of_service ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_oos_updated BEFORE UPDATE ON public.order_of_service FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ POLICIES: public read + admin write ============
DO $$
DECLARE t text;
BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'site_settings','bishop_profile','church_history','past_pastors',
    'sermons','ministries','ministry_events','ministry_gallery','order_of_service'
  ]) LOOP
    EXECUTE format('CREATE POLICY "Public can view %1$s" ON public.%1$s FOR SELECT USING (true);', t);
    EXECUTE format('CREATE POLICY "Admins can insert %1$s" ON public.%1$s FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));', t);
    EXECUTE format('CREATE POLICY "Admins can update %1$s" ON public.%1$s FOR UPDATE TO authenticated USING (public.is_admin(auth.uid()));', t);
    EXECUTE format('CREATE POLICY "Admins can delete %1$s" ON public.%1$s FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));', t);
  END LOOP;
END $$;

-- Sermon published filter for non-admins
DROP POLICY "Public can view sermons" ON public.sermons;
CREATE POLICY "Public can view published sermons" ON public.sermons
  FOR SELECT USING (published = true OR public.is_admin(auth.uid()));

-- ============ SEED DATA ============
INSERT INTO public.site_settings (mpesa_paybill, mpesa_account, contact_email)
VALUES ('000000', 'METHIPEFA', 'info@methipefa.org');

INSERT INTO public.bishop_profile (bio, phone, email, verse, verse_reference, schedule)
VALUES (
  'Shepherding Methi PEFA with grace and the Word, Bishop Nduati carries a heart for revival, family, and the next generation.',
  '+254 000 000 000',
  'bishop@methipefa.org',
  'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.',
  'Jeremiah 29:11',
  '[
    {"day":"Sunday","times":"Main Service · 9:00 AM – 1:00 PM"},
    {"day":"Monday","times":"Office hours · 10:00 AM – 3:00 PM"},
    {"day":"Tuesday","times":"Pastoral counselling · 11:00 AM – 4:00 PM"},
    {"day":"Wednesday","times":"Midweek Bible Study · 6:00 PM – 8:00 PM"},
    {"day":"Thursday","times":"Leaders'' meeting · 5:00 PM – 7:00 PM"},
    {"day":"Friday","times":"Prayer & fasting · 9:00 AM – 12:00 PM"},
    {"day":"Saturday","times":"Visitations & community outreach"}
  ]'::jsonb
);

INSERT INTO public.church_history (intro, full_history) VALUES (
  'Methi PEFA Church was planted as a humble gathering of believers under a tree in Methi.',
  'Methi PEFA Church was planted in the late 1970s as a humble gathering of believers under the wide branches of a tree in Methi. With prayer, song, and an unshakeable conviction in the gospel of Jesus Christ, the founding members began a work that would touch generations.

Affiliated with the Pentecostal Evangelistic Fellowship of Africa (PEFA), the local assembly has grown from a handful of faithful families to a vibrant, multi-generational congregation.'
);

INSERT INTO public.past_pastors (name, years, title, accomplishments, sort_order) VALUES
('Bishop Ngure','1978 – 1995','Founding Bishop', ARRAY['Pioneered the planting of Methi PEFA Church.','Oversaw construction of the first sanctuary.','Established foundational discipleship programs.'], 1),
('Rev. Joseph Kamau','1995 – 2008','Senior Pastor', ARRAY['Led the church through revival and growth.','Launched youth and women''s ministries.'], 2),
('Pastor Samuel Mwangi','2008 – 2017','Senior Pastor', ARRAY['Oversaw expansion of the main sanctuary.','Strengthened worship ministry.'], 3),
('Bishop David G. Nduati','2017 – Present','Presiding Bishop', ARRAY['Launched live-streaming and digital ministry.','Restructured the four core ministries.'], 4);

INSERT INTO public.ministries (id, name, tagline, mission, vision, support_info) VALUES
('men','Men''s Ministry','Men of integrity, fathers of faith.','Raise godly men who lead families and community with integrity.','A generation of men anchored in Christ.','Support through prayer, mentorship, and offerings during fellowship.'),
('women','Women''s Ministry','Daughters of grace.','Disciple women to walk in the fullness of their calling.','Transformed homes through transformed women.','Support our outreach and benevolence programs.'),
('youth','Youth Ministry','Bold for Christ.','Equip young people to live and share the gospel.','A generation on fire for God.','Sponsor a youth event or camp scholarship.'),
('children','Children''s Ministry','Little hearts, big faith.','Nurture children in the truth of God''s Word.','Children rooted in love and Scripture.','Donate Bibles, books, or sponsor Sunday School materials.');

INSERT INTO public.order_of_service (service_name, items) VALUES (
  'Sunday Service',
  '[
    {"time":"9:00 AM","item":"Praise & Worship"},
    {"time":"9:45 AM","item":"Welcome & Notices"},
    {"time":"10:00 AM","item":"Choir Ministration"},
    {"time":"10:15 AM","item":"Word of God"},
    {"time":"11:30 AM","item":"Altar Call & Prayer"},
    {"time":"12:00 PM","item":"Offering & Tithes"},
    {"time":"12:30 PM","item":"Benediction"}
  ]'::jsonb
);

INSERT INTO public.sermons (title, speaker, preached_on, scripture, description, published) VALUES
('Hope That Does Not Disappoint','Bishop David G. Nduati','2025-04-20','Romans 5:1-5','A reminder that hope in Christ is steadfast.', true),
('The Power of Prayer','Rev. Joseph Kamau','2025-03-30','James 5:13-18','Effective fervent prayer changes situations.', true),
('Walking in the Spirit','Pastor Samuel Mwangi','2025-03-09','Galatians 5:16-25','Living a Spirit-led life.', true);

-- ============ STORAGE BUCKETS ============
INSERT INTO storage.buckets (id, name, public) VALUES
  ('sermon-thumbnails','sermon-thumbnails', true),
  ('ministry-gallery','ministry-gallery', true),
  ('bishop-photos','bishop-photos', true),
  ('site-assets','site-assets', true);

-- Storage policies: public read, admins write
DO $$
DECLARE b text;
BEGIN
  FOR b IN SELECT unnest(ARRAY['sermon-thumbnails','ministry-gallery','bishop-photos','site-assets']) LOOP
    EXECUTE format($f$CREATE POLICY "Public read %1$s" ON storage.objects FOR SELECT USING (bucket_id = '%1$s');$f$, b);
    EXECUTE format($f$CREATE POLICY "Admins upload %1$s" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = '%1$s' AND public.is_admin(auth.uid()));$f$, b);
    EXECUTE format($f$CREATE POLICY "Admins update %1$s" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = '%1$s' AND public.is_admin(auth.uid()));$f$, b);
    EXECUTE format($f$CREATE POLICY "Admins delete %1$s" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = '%1$s' AND public.is_admin(auth.uid()));$f$, b);
  END LOOP;
END $$;
