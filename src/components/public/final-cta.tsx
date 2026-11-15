import React from 'react';
import Link from 'next/link';
import { ArrowRight, Phone, MessageCircle } from 'lucide-react';
import { SiteSettings } from '@/types/clinic';
import { cleanPhoneForTel } from '@/lib/utils/formatters';

interface FinalCtaProps {
  settings: SiteSettings;
}

export function FinalCta({ settings }: FinalCtaProps) {
  return (
    <section className="py-16 md:py-20 bg-[#161716] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center lg:text-left max-w-2xl">
            <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              Your next step
            </h2>
            <p className="text-sm sm:text-base text-[#a0a09b] leading-relaxed">
              Have questions about tooth pain, fees, or treatment options? Book a visit or send us a WhatsApp message directly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-white text-ink hover:bg-[#e4e4df] px-8 py-4 rounded-pill font-semibold text-sm shadow-card transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Book Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={`tel:${cleanPhoneForTel(settings.phone)}`}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-6 py-4 rounded-pill font-medium text-sm border border-white/20 transition-all"
            >
              <Phone className="w-4 h-4 text-accent" />
              <span>{settings.phone}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
