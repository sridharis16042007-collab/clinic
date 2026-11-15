-- ==============================================================================
-- Migration: 20261115000000_init_clinic_schema.sql
-- Description: Production database schema with Row Level Security (RLS)
--              for Clinic Management System (Rasipuram, Tamil Nadu)
-- ==============================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. ADMIN ALLOWLIST
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Only authenticated users listed in admin_users can view or modify admin_users
CREATE POLICY "Admins can view admin_users"
    ON public.admin_users
    FOR SELECT
    TO authenticated
    USING (email = auth.jwt() ->> 'email');

-- Helper function to check if current user is an authorized admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE email = auth.jwt() ->> 'email'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ------------------------------------------------------------------------------
-- 2. SITE SETTINGS (Single-row configuration)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinic_name TEXT NOT NULL,
    clinic_type TEXT NOT NULL DEFAULT 'dental', -- dental | physiotherapy | skin | general
    tagline TEXT,
    tagline_ta TEXT, -- Tamil translation support
    phone TEXT NOT NULL,
    whatsapp_number TEXT NOT NULL,
    emergency_phone TEXT,
    email TEXT,
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    city TEXT NOT NULL DEFAULT 'Rasipuram',
    district TEXT NOT NULL DEFAULT 'Namakkal',
    state TEXT NOT NULL DEFAULT 'Tamil Nadu',
    postal_code TEXT NOT NULL DEFAULT '637408',
    google_maps_embed_url TEXT,
    google_maps_directions_url TEXT,
    google_review_url TEXT,
    accent_color TEXT NOT NULL DEFAULT '#2f8f4e',
    logo_url TEXT,
    is_emergency_open BOOLEAN NOT NULL DEFAULT false,
    holiday_notice_enabled BOOLEAN NOT NULL DEFAULT false,
    holiday_notice_text TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read site settings"
    ON public.site_settings
    FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Admins can update site settings"
    ON public.site_settings
    FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 3. OPENING HOURS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.opening_hours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday, 1=Monday...
    day_name TEXT NOT NULL,
    day_name_ta TEXT,
    open_time TEXT, -- e.g. "09:00 AM"
    close_time TEXT, -- e.g. "08:30 PM"
    break_time TEXT, -- e.g. "01:30 PM - 04:30 PM"
    is_closed BOOLEAN NOT NULL DEFAULT false,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_day_of_week UNIQUE (day_of_week)
);

ALTER TABLE public.opening_hours ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read opening hours"
    ON public.opening_hours
    FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Admins can modify opening hours"
    ON public.opening_hours
    FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 4. SERVICES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    title_ta TEXT,
    short_description TEXT NOT NULL,
    short_description_ta TEXT,
    full_description TEXT,
    starting_price NUMERIC(10, 2), -- INR, optional starting price
    duration_minutes INT, -- Approximate duration
    image_url TEXT,
    icon_name TEXT DEFAULT 'activity',
    badge TEXT, -- e.g. "Most requested", "Painless"
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active services"
    ON public.services
    FOR SELECT
    TO anon, authenticated
    USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins can manage services"
    ON public.services
    FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 5. DOCTORS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.doctors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    name_ta TEXT,
    qualifications TEXT NOT NULL, -- e.g. "BDS, MDS (Conservative Dentistry & Endodontics)"
    registration_number TEXT NOT NULL, -- State Dental / Medical Council Reg No.
    designation TEXT NOT NULL, -- e.g. "Chief Dental Surgeon"
    designation_ta TEXT,
    experience_years INT NOT NULL DEFAULT 1,
    languages_spoken TEXT[] NOT NULL DEFAULT ARRAY['English', 'Tamil'],
    bio TEXT NOT NULL,
    bio_ta TEXT,
    photo_url TEXT,
    consultation_fee NUMERIC(10, 2),
    availability_days TEXT, -- e.g. "Mon - Sat"
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active doctors"
    ON public.doctors
    FOR SELECT
    TO anon, authenticated
    USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins can manage doctors"
    ON public.doctors
    FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 6. GALLERY IMAGES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.gallery_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    caption TEXT,
    image_url TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'clinic', -- 'clinic', 'sterilization', 'consultation', 'equipment'
    is_before_after BOOLEAN NOT NULL DEFAULT false,
    before_image_url TEXT,
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active gallery images"
    ON public.gallery_images
    FOR SELECT
    TO anon, authenticated
    USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins can manage gallery images"
    ON public.gallery_images
    FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 7. TESTIMONIALS (Only real patient feedback entered with consent)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_name TEXT NOT NULL, -- e.g. "Karthik R., Rasipuram"
    treatment TEXT NOT NULL, -- e.g. "Root Canal Treatment"
    feedback TEXT NOT NULL,
    feedback_ta TEXT,
    rating INT NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
    visit_month_year TEXT, -- e.g. "October 2026"
    has_patient_consent BOOLEAN NOT NULL DEFAULT true,
    is_active BOOLEAN NOT NULL DEFAULT true,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active testimonials"
    ON public.testimonials
    FOR SELECT
    TO anon, authenticated
    USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins can manage testimonials"
    ON public.testimonials
    FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 8. APPOINTMENTS (Booking Inbox)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    treatment_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    treatment_name TEXT, -- Fallback / text representation
    preferred_date DATE NOT NULL,
    preferred_time TEXT NOT NULL, -- e.g. "Morning (10:00 AM - 1:00 PM)" or "Evening (5:00 PM - 8:00 PM)"
    patient_notes TEXT,
    internal_notes TEXT,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'confirmed', 'completed', 'cancelled')),
    source TEXT NOT NULL DEFAULT 'website', -- website | phone | walk-in
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Anonymous public can ONLY insert appointments; they can never view or query them
CREATE POLICY "Public can create appointment requests"
    ON public.appointments
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Only verified admins can view, update, or delete appointments
CREATE POLICY "Admins can manage appointments"
    ON public.appointments
    FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 9. SEO & METADATA PER PAGE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.seo_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_key TEXT UNIQUE NOT NULL, -- 'home', 'services', 'doctors', 'gallery', 'contact', 'legal'
    meta_title TEXT NOT NULL,
    meta_description TEXT NOT NULL,
    og_title TEXT,
    og_description TEXT,
    og_image_url TEXT,
    canonical_url TEXT,
    json_ld_schema JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.seo_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read seo_pages"
    ON public.seo_pages
    FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Admins can manage seo_pages"
    ON public.seo_pages
    FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 10. AUTOMATIC UPDATED_AT TRIGGER
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_site_settings_modtime BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_opening_hours_modtime BEFORE UPDATE ON public.opening_hours FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_services_modtime BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_doctors_modtime BEFORE UPDATE ON public.doctors FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_gallery_images_modtime BEFORE UPDATE ON public.gallery_images FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_testimonials_modtime BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_appointments_modtime BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_seo_pages_modtime BEFORE UPDATE ON public.seo_pages FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
