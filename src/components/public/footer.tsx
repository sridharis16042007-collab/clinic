import React from 'react';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  ExternalLink,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { SiteSettings, OpeningHours } from '@/types/clinic';
import { cleanPhoneForTel } from '@/lib/utils/formatters';

interface FooterProps {
  settings: SiteSettings;
  hours: OpeningHours[];
}

export function Footer({ settings, hours }: FooterProps) {
  return (
    <footer className="w-full bg-[#161716] text-[#e8e8e3] pt-16 pb-12 mt-auto border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-12 border-b border-white/10">
          {/* Column 1: Clinic Identity & Mission */}
          <div className="space-y-4">
            <h3 className="font-editorial text-2xl font-bold tracking-tight text-white">
              {settings.clinic_name}
            </h3>
            <p className="text-xs text-[#a0a09b] leading-relaxed">
              {settings.tagline ||
                'Modern, gentle and evidence-based dental care in Rasipuram, Namakkal District.'}
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-[#cfcfc8]">
                <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                <span>TN Dental Council Registered</span>
              </span>
            </div>
          </div>

          {/* Column 2: Hours & Schedule */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-white">
              <Clock className="w-3.5 h-3.5 text-accent" />
              <span>Clinic Hours</span>
            </div>
            <ul className="space-y-2 text-xs text-[#b8b8b0]">
              {hours.map((item) => (
                <li
                  key={item.day_of_week}
                  className="flex justify-between items-center border-b border-white/5 pb-1"
                >
                  <span className="font-medium text-white/90">{item.day_name}</span>
                  <span>
                    {item.is_closed
                      ? 'Closed'
                      : `${item.open_time} – ${item.close_time}`}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Location & Directions */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-white">
              <MapPin className="w-3.5 h-3.5 text-accent" />
              <span>Location & Directions</span>
            </div>
            <address className="not-italic text-xs text-[#b8b8b0] leading-relaxed space-y-1">
              <p className="font-medium text-white">{settings.address_line1}</p>
              {settings.address_line2 && <p>{settings.address_line2}</p>}
              <p>
                {settings.city}, {settings.district} - {settings.postal_code}
              </p>
              <p>{settings.state}, India</p>
            </address>

            <div className="pt-2 flex flex-col space-y-2">
              {settings.google_maps_directions_url && (
                <a
                  href={settings.google_maps_directions_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-xs text-accent hover:underline"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {settings.google_review_url && (
                <a
                  href={settings.google_review_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-xs text-[#b8b8b0] hover:text-white"
                >
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span>Leave a Google Review</span>
                </a>
              )}
            </div>
          </div>

          {/* Column 4: Quick Contact & Direct Action */}
          <div className="space-y-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-white">
              Direct Contact
            </div>
            <div className="space-y-2">
              <a
                href={`tel:${cleanPhoneForTel(settings.phone)}`}
                className="flex items-center space-x-2.5 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-accent text-xs font-medium text-white transition-all"
              >
                <Phone className="w-4 h-4 text-accent" />
                <div>
                  <div className="text-[10px] text-[#9c9c94] uppercase tracking-wider">
                    Reception Desk
                  </div>
                  <div>{settings.phone}</div>
                </div>
              </a>

              <a
                href={`https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(
                  settings.clinic_name
                )},%20I%20would%20like%20to%20book%20a%20visit.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2.5 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-green-500 text-xs font-medium text-white transition-all"
              >
                <MessageCircle className="w-4 h-4 text-green-400" />
                <div>
                  <div className="text-[10px] text-[#9c9c94] uppercase tracking-wider">
                    WhatsApp Chat
                  </div>
                  <div>Direct Message</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Legal, Disclaimer & Admin Link */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-[#8c8c85] gap-4">
          <p className="text-center md:text-left max-w-2xl leading-relaxed">
            <strong className="text-[#a0a09b]">Medical Disclaimer:</strong> Information on this website is for general health educational purposes only and does not constitute formal medical diagnosis or treatment. Consult our registered doctors for clinical evaluation.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <Link href="/legal/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/legal/disclaimer" className="hover:text-white transition-colors">
              Medical Disclaimer
            </Link>
            <span>•</span>
            <Link href="/admin/login" className="hover:text-white transition-colors opacity-60 hover:opacity-100">
              Admin
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center text-[11px] text-[#6b6b65]">
          © {new Date().getFullYear()} {settings.clinic_name}, Rasipuram. Built for fast local access.
        </div>
      </div>
    </footer>
  );
}
