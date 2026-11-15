import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { BookingForm } from '@/components/public/booking-form';
import { DashedHoursTable } from '@/components/ui/dashed-table';
import { getSiteSettings, getActiveServices, getOpeningHours } from '@/lib/data';
import { cleanPhoneForTel } from '@/lib/utils/formatters';
import {
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  ExternalLink,
  Navigation,
} from 'lucide-react';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: 'Contact & Book an Appointment',
    description: `Book your dental consultation at ${settings.clinic_name}, Rasipuram. Fast WhatsApp booking, tap-to-call, clinic location map, and operating hours on Salem Main Road.`,
  };
}

export default async function ContactPage() {
  const [settings, services, hours] = await Promise.all([
    getSiteSettings(),
    getActiveServices(),
    getOpeningHours(),
  ]);

  return (
    <div className="py-12 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16">
        <div className="max-w-2xl">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-accent-light text-accent text-xs font-semibold tracking-wider uppercase mb-3">
            <Clock className="w-3.5 h-3.5" />
            <span>Consultation Booking</span>
          </div>
          <h1 className="clamp-title font-sans font-light text-ink">
            Schedule a visit or{' '}
            <span className="font-extrabold text-ink block">
              reach our reception desk.
            </span>
          </h1>
          <p className="text-sm sm:text-base text-ink-muted mt-4 leading-relaxed">
            Fill out the form to register your appointment and connect directly with our clinic on WhatsApp. Walk-ins and emergency phone calls are also accommodated.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Booking Form */}
          <div className="lg:col-span-7">
            <Suspense fallback={<div className="p-8 text-center text-sm text-ink-muted">Loading form...</div>}>
              <BookingForm services={services} settings={settings} />
            </Suspense>
          </div>

          {/* Right Column: Contact Details, Map, Address & Hours */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick Action Buttons */}
            <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-soft space-y-4">
              <h2 className="text-xs uppercase tracking-wider font-semibold text-ink-muted">
                Direct Clinic Assistance
              </h2>

              <div className="space-y-3">
                <a
                  href={`tel:${cleanPhoneForTel(settings.phone)}`}
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-canvas border border-border hover:border-accent text-ink transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-accent group-hover:scale-105 transition-transform">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[11px] uppercase tracking-wider font-semibold text-ink-muted">
                        Call Reception
                      </div>
                      <div className="text-sm font-bold text-ink">
                        {settings.phone}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-accent underline">
                    Tap to Call
                  </span>
                </a>

                <a
                  href={`https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(
                    settings.clinic_name
                  )},%20I%20have%20a%20question%20regarding%20an%20appointment.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/60 hover:border-emerald-500 text-ink transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 group-hover:scale-105 transition-transform">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[11px] uppercase tracking-wider font-semibold text-emerald-800">
                        WhatsApp Help
                      </div>
                      <div className="text-sm font-bold text-emerald-950">
                        Chat with Clinic
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 underline">
                    Open Chat
                  </span>
                </a>
              </div>
            </div>

            {/* Address & Embedded Map */}
            <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs uppercase tracking-wider font-semibold text-ink-muted">
                  <MapPin className="w-3.5 h-3.5 text-accent" />
                  <span>Clinic Address</span>
                </div>

                {settings.google_maps_directions_url && (
                  <a
                    href={settings.google_maps_directions_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-xs text-accent font-semibold hover:underline"
                  >
                    <Navigation className="w-3 h-3" />
                    <span>Get Directions</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              <address className="not-italic text-sm text-ink leading-relaxed">
                <p className="font-semibold text-ink">{settings.address_line1}</p>
                {settings.address_line2 && <p className="text-ink-muted">{settings.address_line2}</p>}
                <p className="text-ink-muted">
                  {settings.city}, {settings.district} – {settings.postal_code}
                </p>
                <p className="text-ink-muted">{settings.state}, India</p>
              </address>

              {/* Embedded Google Map */}
              {settings.google_maps_embed_url && (
                <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-border mt-3">
                  <iframe
                    title={`${settings.clinic_name} Location Map`}
                    src={settings.google_maps_embed_url}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full grayscale-[20%] contrast-[1.05]"
                  />
                </div>
              )}
            </div>

            {/* Schedule Summary */}
            <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-soft space-y-4">
              <div className="text-xs uppercase tracking-wider font-semibold text-ink-muted">
                Weekly Consultation Hours
              </div>
              <DashedHoursTable hours={hours} compact />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
