# Clinic Website Launch Checklist
### Pre-Launch and Go-Live Verification Guide

Follow this step-by-step checklist before handing over the website to the clinic and directing patient traffic.

---

## 1. Domain & DNS Setup
- [ ] **Custom Domain Purchase**: Acquire clinic domain (e.g., `vrikshamclinic.in` or `.com`).
- [ ] **DNS Records on Vercel / Cloudflare**:
  - `A` Record: Point root (`@`) to `76.76.21.21` (or your host IP).
  - `CNAME` Record: Point `www` to `cname.vercel-dns.com`.
- [ ] **Apex Redirect**: Verify that `http://yourclinic.in` automatically redirects to `https://www.yourclinic.in` (or vice-versa).
- [ ] **SSL / TLS Certificate**: Confirm active Let's Encrypt / Vercel wildcard SSL certificate. Ensure HTTPS enforcement with HSTS header.

---

## 2. Google Business Profile & Local Maps
- [ ] **Claim / Verify Clinic Profile**: Verify ownership of the Google Business Profile at the exact street address on Salem Main Road, Rasipuram.
- [ ] **Website Link**: Update website URL in Google Maps listing to point to `https://yourclinic.in`.
- [ ] **Appointment Link**: Add direct appointment booking URL: `https://yourclinic.in/contact`.
- [ ] **Review Shortlink**: Generate short review URL (e.g. `https://g.page/r/.../review`) and paste it into `/admin/settings` -> **Google Review URL**.
- [ ] **Operating Hours Sync**: Ensure clinic opening and break hours in Google Business Profile match `/admin/hours`.

---

## 3. Google Search Console & Local SEO
- [ ] **Domain Verification**: Add property in [Google Search Console](https://search.google.com/search-console).
- [ ] **Submit Sitemap**: Submit `https://yourclinic.in/sitemap.xml`.
- [ ] **Robots.txt Check**: Verify `https://yourclinic.in/robots.txt` is accessible and properly disallows `/admin/` and `/api/`.
- [ ] **Structured Data Testing**: Run [Google Rich Results Test](https://search.google.com/test/rich-results) on `https://yourclinic.in` to confirm Schema.org `Dentist` / `LocalBusiness` validation with address, geo-coordinates, and opening hours.

---

## 4. End-to-End Booking Test
- [ ] **Form Submission**: Open `/contact` on a mobile smartphone (over 4G network).
- [ ] **Input Validation**: Attempt submission with invalid phone number; confirm error message displays in clear language.
- [ ] **Database Insertion**: Submit a valid test appointment (e.g. "Test Patient", "9876543210").
- [ ] **WhatsApp Deep-Link**: Confirm the form automatically opens WhatsApp with the prefilled message containing patient name, preferred time slot, and treatment.
- [ ] **Admin Inbox Verification**: Log into `/admin/appointments` on mobile:
  - Verify test appointment shows as `new`.
  - Tap "Call" and ensure phone dialer opens with number.
  - Tap "Reply on WhatsApp" and confirm chat opens.
  - Change status to `confirmed` and add an internal note.
  - Export CSV and verify row appears.

---

## 5. Security & Privacy Audit
- [ ] **Environment Secrets**: Verify `SUPABASE_SERVICE_ROLE_KEY` and `REVALIDATE_SECRET_TOKEN` are only in Vercel environment variables and not exposed in client bundles (`NEXT_PUBLIC_`).
- [ ] **Row Level Security (RLS)**: Test with anonymous client; verify anonymous users can only `INSERT` appointments and cannot `SELECT` or read any appointment.
- [ ] **Admin Allow-List**: Attempt logging in with an email not on the allowlist; verify dashboard access is blocked.
- [ ] **Disclaimers**: Verify that the medical consultation disclaimer appears on footer and `/legal/disclaimer` in accordance with National Medical Commission guidelines.
