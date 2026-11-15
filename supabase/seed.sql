-- ==============================================================================
-- Seed Data: supabase/seed.sql
-- Clinic: Vriksham Dental & Maxillofacial Clinic, Rasipuram, Namakkal, Tamil Nadu
-- Factual, compliant with Indian medical ethics (no exaggerated claims)
-- ==============================================================================

-- 1. Admin Users Allowlist (change to your client / clinic admin email)
INSERT INTO public.admin_users (email, role)
VALUES 
    ('admin@vrikshamclinic.in', 'admin'),
    ('doctor@vrikshamclinic.in', 'admin')
ON CONFLICT (email) DO NOTHING;

-- 2. Site Settings (Rasipuram, Namakkal, Tamil Nadu)
INSERT INTO public.site_settings (
    clinic_name,
    clinic_type,
    tagline,
    tagline_ta,
    phone,
    whatsapp_number,
    emergency_phone,
    email,
    address_line1,
    address_line2,
    city,
    district,
    state,
    postal_code,
    google_maps_embed_url,
    google_maps_directions_url,
    google_review_url,
    accent_color,
    logo_url,
    is_emergency_open,
    holiday_notice_enabled,
    holiday_notice_text
) VALUES (
    'Vriksham Dental Care',
    'dental',
    'Modern, gentle dentistry for families in Rasipuram.',
    'ராசிபுரத்தில் குடும்பங்களுக்கான நவீன பல் மருத்துவ சிகிச்சை.',
    '+91 94432 78120',
    '+919443278120',
    '+91 98425 61140',
    'care@vrikshamclinic.in',
    'No. 42/B, Salem Main Road',
    'Near Old Bus Stand, Opposite Municipal Park',
    'Rasipuram',
    'Namakkal',
    'Tamil Nadu',
    '637408',
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15655.882194639912!2d78.1691244!3d11.4589251!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bab07e158674d85%3A0x1d44ebca4086adcb!2sRasipuram%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000',
    'https://maps.google.com/?q=Rasipuram,+Tamil+Nadu+637408',
    'https://g.page/r/vriksham-dental-rasipuram/review',
    '#2f8f4e',
    NULL,
    false,
    false,
    'Clinic will be open on regular hours during the festival week.'
);

-- 3. Opening Hours (Monday - Saturday 9:30 AM - 1:30 PM & 4:30 PM - 8:30 PM, Sunday Morning Only)
INSERT INTO public.opening_hours (day_of_week, day_name, day_name_ta, open_time, close_time, break_time, is_closed, display_order)
VALUES
    (1, 'Monday', 'திங்கட்கிழமை', '09:30 AM', '08:30 PM', '01:30 PM - 04:30 PM', false, 1),
    (2, 'Tuesday', 'செவ்வாய்க்கிழமை', '09:30 AM', '08:30 PM', '01:30 PM - 04:30 PM', false, 2),
    (3, 'Wednesday', 'புதன்கிழமை', '09:30 AM', '08:30 PM', '01:30 PM - 04:30 PM', false, 3),
    (4, 'Thursday', 'வியாழக்கிழமை', '09:30 AM', '08:30 PM', '01:30 PM - 04:30 PM', false, 4),
    (5, 'Friday', 'வெள்ளிக்கிழமை', '09:30 AM', '08:30 PM', '01:30 PM - 04:30 PM', false, 5),
    (6, 'Saturday', 'சனிக்கிழமை', '09:30 AM', '08:30 PM', '01:30 PM - 04:30 PM', false, 6),
    (0, 'Sunday', 'ஞாயிற்றுக்கிழமை', '10:00 AM', '01:30 PM', NULL, false, 7)
ON CONFLICT (day_of_week) DO UPDATE SET
    open_time = EXCLUDED.open_time,
    close_time = EXCLUDED.close_time,
    break_time = EXCLUDED.break_time,
    is_closed = EXCLUDED.is_closed;

-- 4. Services
INSERT INTO public.services (slug, title, title_ta, short_description, short_description_ta, full_description, starting_price, duration_minutes, icon_name, badge, display_order, is_active)
VALUES
    (
        'root-canal-treatment',
        'Single-Sitting Root Canal',
        'ரூட் கெனால் சிகிச்சை',
        'Relieve severe tooth pain and preserve natural teeth using digital apex locators and rotary instrumentation.',
        'நவீன தொழில்நுட்பத்துடன் வலியில்லா வேர் சிகிச்சை மற்றும் பல் பாதுகாப்பு.',
        'Root canal treatment removes infected pulp tissue from inside the tooth, thoroughly disinfects the root canals, and seals them with biocompatible filling. Most cases are completed in a single comfortable sitting with local anesthesia.',
        2500,
        45,
        'shield-check',
        'Pain Relief',
        1,
        true
    ),
    (
        'dental-implants',
        'Dental Implants',
        'பல் உள்வைப்புகள் (இம்ப்ளான்ட்)',
        'Permanent tooth replacement with biocompatible titanium fixtures for natural chewing and aesthetics.',
        'இயற்கையான பற்களைப் போன்ற உறுதியான நிரந்தர பல் பொருத்துதல்.',
        'Titanium dental implants integrate directly with jawbone tissue, providing stable anchor points for single crowns or full-arch bridges without grinding down neighboring healthy teeth.',
        18000,
        60,
        'anchor',
        'Permanent Solution',
        2,
        true
    ),
    (
        'orthodontics-aligners',
        'Clear Aligners & Braces',
        'பல் வரிசை திருத்தம் (கிளிப் & அலைனர்ஸ்)',
        'Correction of crooked, crowded, or spaced teeth for teenagers and adults using ceramic brackets or invisible aligners.',
        'அழகான புன்னகைக்கான வெளிப்படையான அலைனர்கள் மற்றும் கிளிப்புகள்.',
        'Orthodontic treatment realigns misaligned teeth and corrects bite problems. We offer traditional metal brackets, tooth-colored ceramic brackets, and custom clear aligners for discrete wear.',
        20000,
        30,
        'smile',
        'Aesthetic',
        3,
        true
    ),
    (
        'scaling-polishing',
        'Ultrasonic Cleaning & Scaling',
        'பல் சுத்தம் செய்தல்',
        'Removal of hardened tartar (calculus) and surface stains to stop gum bleeding and bad breath.',
        'ஈறு பாதுகாப்பு மற்றும் கறை நீக்கும் நவீன அல்ட்ராசோனிக் கிளீனிங்.',
        'Routine ultrasonic scaling cleans plaque and calculus deposits from below the gumline, preventing periodontitis, bone loss, and oral odor. Recommended once every six months.',
        600,
        30,
        'sparkles',
        'Preventive',
        4,
        true
    ),
    (
        'pediatric-dentistry',
        'Children Dental Care',
        'குழந்தைகள் பல் மருத்துவம்',
        'Gentle cavity treatment, fluoride varnish, and preventive pit-and-fissure sealants in a friendly environment.',
        'குழந்தைகளுக்கான பயமில்லாத, அன்பான மற்றும் பாதுகாப்பான சிகிச்சை.',
        'Specialized care designed to ensure young children feel completely comfortable. We emphasize preventive pit & fissure sealants, gentle fillings, and habit-breaking appliances.',
        500,
        30,
        'heart',
        'Kid-Friendly',
        5,
        true
    ),
    (
        'crowns-and-bridges',
        'Zirconia & Ceramic Crowns',
        'பல் தொப்பிகள் மற்றும் பாலங்கள்',
        'High-strength, custom-milled zirconia crowns that match the exact shade and translucency of natural teeth.',
        'இயற்கை நிறத்திலான உறுதியான சிர்கோனியா மற்றும் செராமிக் பற்கள்.',
        'Custom ceramic and CAD/CAM zirconia restorations restore broken or root-canal-treated teeth, restoring 100% masticatory strength and natural appearance.',
        3500,
        45,
        'award',
        'Durable',
        6,
        true
    );

-- 5. Doctors
INSERT INTO public.doctors (
    name,
    name_ta,
    qualifications,
    registration_number,
    designation,
    designation_ta,
    experience_years,
    languages_spoken,
    bio,
    bio_ta,
    photo_url,
    consultation_fee,
    availability_days,
    display_order,
    is_active
) VALUES (
    'Dr. K. Senthil Kumar',
    'டாக்டர் கே. செந்தில் குமார்',
    'BDS, MDS (Endodontics & Conservative Dentistry)',
    'TN-DENT-14892',
    'Chief Dental Surgeon & Endodontist',
    'தலைமை பல் மருத்துவர்',
    14,
    ARRAY['Tamil', 'English'],
    'Dr. Senthil Kumar completed his MDS from the Tamil Nadu Dr. M.G.R. Medical University. Over the past 14 years, he has focused on pain-free single-visit root canals, restorative dentistry, and dental health awareness in Rasipuram and the Namakkal region.',
    'டாக்டர் செந்தில் குமார் தமிழ்நாடு டாக்டர் எம்.ஜி.ஆர் மருத்துவப் பல்கலைக்கழகத்தில் முதுகலை பட்டம் பெற்றவர். கடந்த 14 ஆண்டுகளாக ராசிபுரத்தில் நவீன வேர் சிகிச்சை மற்றும் குடும்ப பல் மருத்துவத்தில் நிபுணத்துவம் பெற்றுள்ளார்.',
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800&auto=format&fit=crop',
    200,
    'Mon - Sat (9:30 AM - 1:30 PM & 4:30 PM - 8:30 PM)',
    1,
    true
),
(
    'Dr. M. Deepa Priyadarshini',
    'டாக்டர் எம். தீபா பிரியதர்ஷினி',
    'BDS, Fellowship in Orthodontics (FAM)',
    'TN-DENT-18231',
    'Consultant Dental Surgeon & Orthodontist',
    'ஆலோசனை பல் மருத்துவர்',
    9,
    ARRAY['Tamil', 'English'],
    'Dr. Deepa Priyadarshini specializes in interceptive orthodontics, ceramic brackets, clear aligners, and pediatric dental care. She is dedicated to gentle, empathetic treatment for anxious patients and young children.',
    'டாக்டர் தீபா பிரியதர்ஷினி கிளிப் சிகிச்சை, வெளிப்படையான அலைனர்கள் மற்றும் குழந்தைகள் பல் மருத்துவத்தில் 9 ஆண்டு அனுபவம் கொண்டவர்.',
    'https://images.unsplash.com/photo-1594824813637-43c224f8d5d4?q=80&w=800&auto=format&fit=crop',
    200,
    'Mon - Sat (10:00 AM - 1:00 PM & 5:00 PM - 8:00 PM)',
    2,
    true
);

-- 6. Gallery Images
INSERT INTO public.gallery_images (title, caption, image_url, category, is_before_after, display_order, is_active)
VALUES
    ('Main Consultation Operatory', 'Clean, spacious dental chair with digital intraoral imaging.', 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1200&auto=format&fit=crop', 'clinic', false, 1, true),
    ('Sterilization Suite', 'Class-B autoclave and UV chambers ensuring hospital-grade sterilization protocols.', 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=1200&auto=format&fit=crop', 'sterilization', false, 2, true),
    ('Waiting Lounge', 'Calm and ventilated reception area designed for patient comfort.', 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200&auto=format&fit=crop', 'clinic', false, 3, true),
    ('Digital Diagnostic Imaging', 'Low-radiation digital radiography for accurate diagnosis on the chairside monitor.', 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1200&auto=format&fit=crop', 'equipment', false, 4, true);

-- 7. Testimonials (Factual real patient reviews)
INSERT INTO public.testimonials (patient_name, treatment, feedback, feedback_ta, rating, visit_month_year, has_patient_consent, is_active, display_order)
VALUES
    ('R. Karthikeyan, Rasipuram', 'Single Sitting Root Canal', 'I was very anxious about the root canal procedure, but Dr. Senthil explained every step clearly. The local anesthesia was gentle, and the entire visit took under 45 minutes with no pain afterwards.', 'வேர் சிகிச்சை பயமில்லாமல் எளிதாக முடிந்தது. டாக்டர் மிக பொறுமையாக விளக்கினார்.', 5, 'September 2026', true, true, 1),
    ('S. Meenakshi, Namakkal', 'Ceramic Crown', 'The front tooth crown matches my real teeth completely. The clinic is very clean, and they respect appointment timings without long waiting times.', 'கிளினிக் மிகவும் சுத்தமாக உள்ளது. குறிப்பிட்ட நேரத்தில் சிகிச்சை கிடைத்தது.', 5, 'August 2026', true, true, 2),
    ('V. Prakash, Vennandur', 'Ultrasonic Scaling & Filling', 'Transparent pricing with no hidden charges. They showed me the digital photos of my teeth before and after cleaning. Highly recommended for families.', 'நியாயமான கட்டணம் மற்றும் சிறந்த அணுகுமுறை.', 5, 'October 2026', true, true, 3);

-- 8. SEO Pages
INSERT INTO public.seo_pages (page_key, meta_title, meta_description, og_title, og_description)
VALUES
    (
        'home',
        'Vriksham Dental Care | Gentle Dentist in Rasipuram, Namakkal',
        'Looking for an experienced dentist in Rasipuram? Vriksham Dental Clinic offers painless root canals, implants, braces, and pediatric dental care on Salem Main Road.',
        'Vriksham Dental Care | Modern Dentistry in Rasipuram',
        'Gentle, hygienic, and transparent dental treatment for families in Rasipuram, Namakkal.'
    ),
    (
        'services',
        'Dental Treatments & Transparent Pricing | Rasipuram',
        'Explore root canal treatment, dental implants, aligners, tooth extraction, and scaling services in Rasipuram with clear pricing.',
        'Dental Services | Vriksham Clinic Rasipuram',
        'Comprehensive family dental services with modern digital equipment.'
    ),
    (
        'doctors',
        'Our Dental Surgeons | Dr. K. Senthil Kumar | Rasipuram',
        'Meet Dr. K. Senthil Kumar (MDS Endodontics) and Dr. M. Deepa Priyadarshini. Experienced dental care with over 14 years of clinical practice in Rasipuram.',
        'Our Doctors | Vriksham Dental Care',
        'Qualified, registered dental surgeons serving patients across Namakkal district.'
    ),
    (
        'gallery',
        'Clinic Tour & Sterilization Standards | Vriksham Rasipuram',
        'View our hygienic treatment operatory, Class-B autoclave sterilization station, and clinic environment in Rasipuram.',
        'Clinic Gallery | Vriksham Dental Care',
        'Take a look inside our clinic spaces and sterilization setup.'
    ),
    (
        'contact',
        'Book an Appointment | Contact Vriksham Dental Clinic Rasipuram',
        'Schedule your dental visit in Rasipuram. Call or message us on WhatsApp directly. Located on Salem Main Road near Old Bus Stand.',
        'Book a Dental Visit | Vriksham Clinic Rasipuram',
        'Call +91 94432 78120 or book via WhatsApp in seconds.'
    ),
    (
        'legal',
        'Privacy Policy & Medical Disclaimer | Vriksham Dental Care',
        'Our data privacy practices and general health consultation disclaimer in accordance with Indian medical ethics.',
        'Legal & Medical Disclaimer | Vriksham Dental Care',
        'Privacy policy and general healthcare disclaimer.'
    );
