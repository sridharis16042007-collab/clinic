import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HeroSection } from '@/components/public/hero-visual';
import { TrustPoints } from '@/components/public/trust-points';
import { DashedHoursTable } from '@/components/ui/dashed-table';
import { ProcessSteps } from '@/components/public/process-steps';
import { TestimonialsSection } from '@/components/public/testimonials';
import { FinalCta } from '@/components/public/final-cta';
import { ClinicJsonLd } from '@/components/public/json-ld';
import {
  getSiteSettings,
  getOpeningHours,
  getActiveDoctors,
  getActiveTestimonials,
  getActiveServices,
} from '@/lib/data';
import { Clock, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';

export const revalidate = 60; // ISR cache revalidation every 60 seconds

export default async function HomePage() {
  const [settings, hours, doctors, testimonials, services] = await Promise.all([
    getSiteSettings(),
    getOpeningHours(),
    getActiveDoctors(),
    getActiveTestimonials(),
    getActiveServices(),
  ]);

  return (
    <div className="flex flex-col">
      <ClinicJsonLd settings={settings} hours={hours} doctors={doctors} />

      {/* 1. Hero Section */}
      <HeroSection settings={settings} hours={hours} />

      {/* 2. Three Trust Points */}
      <TrustPoints />

      {/* 3. Clinical Approach & Interior Visual (Inspired by Quenbylynn reference layout) */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="text-xs uppercase tracking-wider font-semibold text-accent">
              Our Clinical Approach
            </div>
            <h2 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-ink">
              Careful diagnostics, respectful explanations.
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
              We know visiting a dental clinic can bring anxiety. We explain each step thoroughly so you always feel in control of your oral health decisions.
            </p>

            <ProcessSteps />
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-border shadow-card bg-surface">
              <Image
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1000&auto=format&fit=crop"
                alt="Clinic Reception & Consultation Lounge"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="p-5 rounded-2xl bg-surface border border-border shadow-soft flex items-start space-x-3">
              <ShieldCheck className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div className="text-xs text-ink-muted">
                <strong className="text-ink font-semibold">Strict Infection Control:</strong>{' '}
                Our operatory surfaces and handpieces are sanitized between every single patient. Autoclave cycles are monitored digitally.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Opening Hours & Weekly Schedule Section */}
      <section className="py-16 bg-surface/60 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center space-x-1 text-xs font-semibold uppercase tracking-wider text-accent mb-2">
              <Clock className="w-3.5 h-3.5" />
              <span>Consultation Schedule</span>
            </div>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight text-ink">
              Clinic Working Hours
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted mt-2">
              Convenient morning and evening consultation slots in Rasipuram.
            </p>
          </div>

          <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-border shadow-soft">
            <DashedHoursTable hours={hours} />

            <div className="mt-6 pt-6 border-t border-dashed border-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-2 text-xs text-ink-muted">
                <MapPin className="w-4 h-4 text-accent" />
                <span>Salem Main Road, Opp. Municipal Park, Rasipuram</span>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-accent hover:underline"
              >
                <span>Book your preferred slot</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Real Patient Testimonials */}
      <TestimonialsSection testimonials={testimonials} />

      {/* 6. Final Booking Call to Action */}
      <FinalCta settings={settings} />
    </div>
  );
}
