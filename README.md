# Clinic Web Platform & Admin Dashboard
### Designed for Local Clinics in Rasipuram, Namakkal, Tamil Nadu

A production-ready, minimal, editorial multipage website with an authenticated admin console built for fast loading on mobile devices over 3G/4G networks.

---

## Tech Stack & Architecture

- **Framework**: Next.js 14+ (App Router, Server Components, Server Actions)
- **Language & Styles**: TypeScript, Tailwind CSS, Manrope & Playfair typography, CSS variables for dynamic themes
- **Database & Auth**: Supabase (PostgreSQL with Row Level Security, Auth with email allow-list, Storage)
- **Validation**: Zod schema validation on client and server, React Hook Form
- **Performance**: Automated client-side WebP image compression (<250KB), ISR (Incremental Static Regeneration), security headers
- **Bilingual Structure**: English by default, dictionary architecture prepared for Tamil (`messages/en.json`, `messages/ta.json`)

---

## Public Pages Built

1. **Home (`/`)**:
   - Hero visual with soft ambient radial glow, architectural circular focal point, and floating card displaying today's live operating status (IST).
   - Three trust indicators: Walk-ins welcome, transparent upfront fees, Class-B autoclave sterilization.
   - Clinical approach timeline (`01 Listen`, `02 Assess`, `03 Plan`, `04 Treat`) alongside clinic interior view.
   - Dashed weekly consultation hours table with current day highlight.
   - Verified patient reviews.
   - High-contrast final consultation booking banner.
   - Schema.org `Dentist` / `LocalBusiness` JSON-LD structured data.

2. **Services (`/services`)**:
   - Product-gallery interactive layout.
   - Left vertical list of clinical treatments with badges and numbered badges.
   - Right gallery details panel with outlined numeral (`01`, `02`...), large title, clinical description, treatment duration, dashed fee table, and direct "Book this treatment" button.

3. **Our Doctors (`/doctors`)**:
   - Registered dental surgeons and specialists.
   - State Dental Council registration numbers, university qualifications, years of experience, consulting timings, and bio adhering strictly to Indian medical advertising ethics.

4. **Gallery (`/gallery`)**:
   - Treatment operatory, sterilization suite, and diagnostic equipment photo tour.
   - Category filtering and full-screen touch-friendly Lightbox viewer with keyboard navigation (`Esc`, `ArrowLeft`, `ArrowRight`).

5. **Contact & Booking (`/contact`)**:
   - Validated booking form: Patient name, mobile number, treatment selector, preferred date, time slot, and pain notes.
   - Anti-spam honeypot input and IP rate-limiting protection.
   - Automated conversion: Saves appointment to database and immediately launches a prefilled WhatsApp chat with the clinic reception.
   - Direct tap-to-call button, embedded Google Map, directions link, and clinic address.

6. **Legal & Disclaimers**:
   - **Privacy Policy (`/legal/privacy`)**: Details patient data confidentiality and non-disclosure standards.
   - **Medical Disclaimer (`/legal/disclaimer`)**: In compliance with the National Medical Commission (NMC) and Dental Council of India (DCI).

7. **Custom 404 (`/not-found`)**:
   - Minimalist error page with return options.

---

## Admin Dashboard (`/admin`)

- **Secure Login (`/admin/login`)**: Supabase Auth guarded by an allow-list of approved admin emails. Password reset flow (`/admin/reset-password`).
- **Appointments Inbox (`/admin/appointments`)**: Searchable and filterable inbox of booking requests. One-tap "Reply on WhatsApp" and "Call" buttons, private internal clinic notes, and CSV export.
- **Clinic Settings (`/admin/settings`)**: Full database-driven customization of clinic name, specialization, phone, WhatsApp number, address, Google Maps links, and calm accent color picker (changes update live across the entire site immediately).
- **Hours & Notice (`/admin/hours`)**: Per-day morning and evening schedules, break hours, and a toggleable top announcement banner for holidays or emergencies.
- **Services Manager (`/admin/services`)**: Add, edit, toggle visibility, and configure starting fees.
- **Doctors Manager (`/admin/doctors`)**: Add and edit clinician profiles, qualifications, and council registration numbers.
- **Gallery Manager (`/admin/gallery`)**: Upload clinic photos with automatic client-side WebP compression (< 250KB).
- **Testimonials Manager (`/admin/testimonials`)**: Curate real patient feedback with verified consent tracking.
- **Local SEO Manager (`/admin/seo`)**: Edit meta titles, meta descriptions, and Open Graph share cards for Google search rankings in Rasipuram and Namakkal.

---

## Local Setup & Development

### 1. Prerequisites
- Node.js 18+ (tested on Node v22)
- npm or pnpm

### 2. Installation
```bash
# Clone the repository and navigate into the folder
cd c:\clinic

# Install dependencies
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your Supabase project credentials (see Supabase Setup below).

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the public clinic website, or [http://localhost:3000/admin](http://localhost:3000/admin) to view the admin console.

---

## Supabase Setup

1. Create a new project on [Supabase](https://supabase.com).
2. Open the **SQL Editor** in your Supabase project dashboard.
3. Paste the contents of `supabase/migrations/20261115000000_init_clinic_schema.sql` and run it. This creates all 8 tables, indexes, triggers, and Row Level Security (RLS) policies.
4. Paste the contents of `supabase/seed.sql` and run it. This populates the default database settings for Rasipuram.
5. In **Project Settings -> API**, copy:
   - `Project URL` -> `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key -> `SUPABASE_SERVICE_ROLE_KEY`
6. In **Authentication -> Users**, create an admin user with the client's email (e.g. `admin@vrikshamclinic.in`) and add that email to `ADMIN_ALLOWED_EMAILS` in `.env.local`.

---

## Handover to the Client

1. **Creating the Doctor / Receptionist Login**:
   - Go to Supabase Auth -> Add user -> Enter doctor's email & temporary password.
   - Ensure the email is included in the `admin_users` table in SQL or `ADMIN_ALLOWED_EMAILS` environment variable.
2. **First Login Instructions**:
   - Direct the client to `https://your-domain.com/admin/login`.
   - Ask them to sign in and immediately click **Forgot password?** to set their personal secure password.
3. **Daily Operations Guide for the Clinic**:
   - **Appointments**: Open `/admin/appointments` on mobile to review new bookings and tap **Reply on WhatsApp** to confirm appointment timings.
   - **Holiday Banner**: Before a festival or holiday, toggle the holiday notice banner in `/admin/hours` to alert visiting patients.
   - **Photos**: Take photos of newly sanitized operatories or equipment on a smartphone and upload them via `/admin/gallery`.
