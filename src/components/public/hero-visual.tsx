import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, ArrowRight, MessageCircle, Phone, CheckCircle2 } from 'lucide-react';
import { SiteSettings, OpeningHours } from '@/types/clinic';
import { getTodayClinicStatus, cleanPhoneForTel } from '@/lib/utils/formatters';

interface HeroVisualProps {
  settings: SiteSettings;
  hours: OpeningHours[];
}

export function HeroSection({ settings, hours }: HeroVisualProps) {
  const todayStatus = getTodayClinicStatus(hours);

  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24">
      {/* Background soft ambient glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] md:w-[750px] h-[500px] md:h-[750px] rounded-full opacity-30 pointer-events-none blur-3xl -z-10"
        style={{
          background: `radial-gradient(circle, var(--accent-color) 0%, rgba(246, 246, 244, 0) 70%)`,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Huge tight headline, weight mix, action pills */}
          <div className="lg:col-span-7 space-y-6 md:space-y-8">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-surface border border-border shadow-soft text-xs text-ink-muted">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-medium tracking-wide">
                Rasipuram, Namakkal District
              </span>
            </div>

            {/* Headline with weight contrast: light for most words, extra-bold for key words */}
            <h1 className="clamp-hero font-sans text-ink">
              <span className="font-light block text-ink/85">Gentle, precise care for</span>
              <span className="font-extrabold tracking-tightest text-ink block">
                your family&apos;s smiles.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-ink-muted max-w-xl font-normal leading-relaxed">
              {settings.tagline ||
                'Personalized dental treatment with modern digital equipment, pain-free techniques, and transparent upfront consultation in Rasipuram.'}
            </p>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center space-x-2.5 bg-ink hover:bg-black text-white px-7 py-3.5 rounded-pill font-medium text-sm shadow-card transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Book a consultation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={`https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(
                  settings.clinic_name
                )},%20I%20would%20like%20to%20inquire%20about%20a%20consultation.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center space-x-2 bg-surface hover:bg-canvas border border-border text-ink px-6 py-3.5 rounded-pill font-medium text-sm shadow-soft transition-all hover:border-accent"
              >
                <MessageCircle className="w-4 h-4 text-green-600" />
                <span>Message on WhatsApp</span>
              </a>
            </div>

            {/* Quick check indicators */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-ink-muted">
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                <span>Zero wait with appointment</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                <span>Salem Main Road location</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual with large soft circle & floating opening hours card */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            {/* Large soft architectural backdrop circle */}
            <div className="relative w-[300px] sm:w-[380px] md:w-[420px] aspect-square rounded-full bg-gradient-to-tr from-surface to-canvas border border-border/70 p-3 sm:p-4 shadow-soft">
              <div className="relative w-full h-full rounded-full overflow-hidden shadow-inner bg-[#ecece8]">
                <Image
                  src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1000&auto=format&fit=crop"
                  alt={`${settings.clinic_name} Consultation Operatory`}
                  fill
                  sizes="(max-width: 768px) 100vw, 500px"
                  priority
                  className="object-cover scale-105 hover:scale-110 transition-transform duration-700"
                />
              </div>

              {/* Floating Opening Hours Card (with soft shadow) */}
              <div className="absolute -bottom-6 -left-4 sm:-bottom-4 sm:-left-6 bg-surface/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-border shadow-card max-w-[260px] sm:max-w-[280px] z-10 transition-all hover:translate-y-[-2px]">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-border">
                  <div className="flex items-center space-x-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                    <Clock className="w-3.5 h-3.5 text-accent" />
                    <span>Today&apos;s Hours</span>
                  </div>
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${
                      todayStatus.isOpenToday ? 'bg-accent' : 'bg-amber-500'
                    }`}
                  />
                </div>

                <div className="text-sm font-bold text-ink">
                  {todayStatus.todayScheduleText}
                </div>
                <div className="text-[11px] text-ink-muted mt-0.5 leading-tight">
                  {todayStatus.hoursBreakdown}
                </div>

                <div className="mt-3 pt-2 border-t border-border/60 flex items-center justify-between">
                  <span className="text-[11px] text-accent font-medium">
                    {todayStatus.isCurrentlyOpen
                      ? 'Doctor is in consultation'
                      : 'Next session open today'}
                  </span>
                  <Link
                    href="/contact"
                    className="text-[11px] font-semibold text-ink underline hover:text-accent"
                  >
                    View map
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
