import React from 'react';
import { SeoManager } from '@/components/admin/seo-manager';
import { createClient } from '@/lib/supabase/server';
import { SeoPage } from '@/types/clinic';
import { Search } from 'lucide-react';

export const dynamic = 'force-dynamic';

const fallbackSeoPages: SeoPage[] = [
  {
    id: 'seo-1',
    page_key: 'home',
    meta_title: 'Vriksham Dental Care | Gentle Dentist in Rasipuram, Namakkal',
    meta_description:
      'Looking for an experienced dentist in Rasipuram? Vriksham Dental Clinic offers painless root canals, implants, braces, and pediatric dental care on Salem Main Road.',
    og_title: 'Vriksham Dental Care | Modern Dentistry in Rasipuram',
    og_description:
      'Gentle, hygienic, and transparent dental treatment for families in Rasipuram, Namakkal.',
    og_image_url: null,
    canonical_url: null,
    json_ld_schema: null,
    created_at: '',
    updated_at: '',
  },
  {
    id: 'seo-2',
    page_key: 'services',
    meta_title: 'Dental Treatments & Transparent Pricing | Rasipuram',
    meta_description:
      'Explore root canal treatment, dental implants, aligners, tooth extraction, and scaling services in Rasipuram with clear pricing.',
    og_title: 'Dental Services | Vriksham Clinic Rasipuram',
    og_description:
      'Comprehensive family dental services with modern digital equipment.',
    og_image_url: null,
    canonical_url: null,
    json_ld_schema: null,
    created_at: '',
    updated_at: '',
  },
  {
    id: 'seo-3',
    page_key: 'doctors',
    meta_title: 'Our Dental Surgeons | Dr. K. Senthil Kumar | Rasipuram',
    meta_description:
      'Meet Dr. K. Senthil Kumar (MDS Endodontics) and Dr. M. Deepa Priyadarshini. Experienced dental care with over 14 years of clinical practice in Rasipuram.',
    og_title: 'Our Doctors | Vriksham Dental Care',
    og_description:
      'Qualified, registered dental surgeons serving patients across Namakkal district.',
    og_image_url: null,
    canonical_url: null,
    json_ld_schema: null,
    created_at: '',
    updated_at: '',
  },
  {
    id: 'seo-4',
    page_key: 'gallery',
    meta_title: 'Clinic Tour & Sterilization Standards | Vriksham Rasipuram',
    meta_description:
      'View our hygienic treatment operatory, Class-B autoclave sterilization station, and clinic environment in Rasipuram.',
    og_title: 'Clinic Gallery | Vriksham Dental Care',
    og_description:
      'Take a look inside our clinic spaces and sterilization setup.',
    og_image_url: null,
    canonical_url: null,
    json_ld_schema: null,
    created_at: '',
    updated_at: '',
  },
  {
    id: 'seo-5',
    page_key: 'contact',
    meta_title: 'Book an Appointment | Contact Vriksham Dental Clinic Rasipuram',
    meta_description:
      'Schedule your dental visit in Rasipuram. Call or message us on WhatsApp directly. Located on Salem Main Road near Old Bus Stand.',
    og_title: 'Book a Dental Visit | Vriksham Clinic Rasipuram',
    og_description:
      'Call +91 94432 78120 or book via WhatsApp in seconds.',
    og_image_url: null,
    canonical_url: null,
    json_ld_schema: null,
    created_at: '',
    updated_at: '',
  },
];

export default async function AdminSeoPage() {
  const supabase = createClient();
  let pages: SeoPage[] = fallbackSeoPages;

  if (supabase) {
    const { data, error } = await supabase.from('seo_pages').select('*');
    if (!error && data && data.length > 0) {
      pages = data as SeoPage[];
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-accent-light text-accent text-xs font-semibold uppercase tracking-wider mb-2">
          <Search className="w-3.5 h-3.5" />
          <span>Local SEO & Meta</span>
        </div>
        <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-ink">
          Search Engine Optimization
        </h1>
        <p className="text-xs sm:text-sm text-ink-muted mt-1">
          Control page meta titles, descriptions, and social preview cards to maximize local Google ranking in Rasipuram and Namakkal.
        </p>
      </div>

      <SeoManager initialPages={pages} />
    </div>
  );
}
