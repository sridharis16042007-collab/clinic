import React from 'react';
import type { Metadata } from 'next';
import { ServiceGallery } from '@/components/public/service-gallery';
import { FinalCta } from '@/components/public/final-cta';
import { getActiveServices, getSiteSettings } from '@/lib/data';
import { Sparkles } from 'lucide-react';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: 'Dental Treatments & Transparent Fees',
    description: `Browse root canals, dental implants, teeth alignment, scaling, and children dental care at ${settings.clinic_name}, Rasipuram. Clear fees and modern techniques.`,
  };
}

export default async function ServicesPage() {
  const [services, settings] = await Promise.all([
    getActiveServices(),
    getSiteSettings(),
  ]);

  return (
    <div className="py-12 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16">
        <div className="max-w-2xl">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-accent-light text-accent text-xs font-semibold tracking-wider uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Clinical Treatments</span>
          </div>
          <h1 className="clamp-title font-sans font-light text-ink">
            Care planned for your long-term{' '}
            <span className="font-extrabold text-ink block">oral wellness.</span>
          </h1>
          <p className="text-sm sm:text-base text-ink-muted mt-4 leading-relaxed">
            Select a procedure to view treatment steps, duration, and starting price. Every treatment plan is tailored after careful chairside examination.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ServiceGallery services={services} settings={settings} />
      </div>

      <div className="mt-20">
        <FinalCta settings={settings} />
      </div>
    </div>
  );
}
