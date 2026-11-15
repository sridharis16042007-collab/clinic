'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, Calendar, ArrowRight } from 'lucide-react';
import { SiteSettings } from '@/types/clinic';
import { cleanPhoneForTel } from '@/lib/utils/formatters';

interface HeaderProps {
  settings: SiteSettings;
}

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/doctors', label: 'Our Doctors' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact & Booking' },
];

export function Header({ settings }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-canvas/90 border-b border-border transition-colors">
      {/* Top emergency / holiday notice banner if enabled */}
      {settings.holiday_notice_enabled && settings.holiday_notice_text && (
        <div className="w-full bg-accent text-white px-4 py-2 text-center text-xs md:text-sm font-medium tracking-wide">
          <span>{settings.holiday_notice_text}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Clinic Brand */}
          <Link href="/" className="flex items-baseline space-x-2 group">
            <span className="font-editorial text-xl sm:text-2xl font-bold tracking-tight text-ink group-hover:text-accent transition-colors">
              {settings.clinic_name}
            </span>
            <span className="hidden sm:inline-block text-xs uppercase tracking-widest text-ink-muted">
              {settings.city}
            </span>
          </Link>

          {/* Desktop Centered Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-xs uppercase tracking-wider font-medium py-1 transition-colors ${
                    isActive
                      ? 'text-ink font-semibold'
                      : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent rounded-full animate-in fade-in duration-200" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Pill Button + Direct Phone */}
          <div className="flex items-center space-x-3">
            <a
              href={`tel:${cleanPhoneForTel(settings.phone)}`}
              className="hidden lg:flex items-center space-x-2 text-xs font-semibold text-ink-muted hover:text-accent transition-colors px-3 py-1.5"
              title={`Call ${settings.phone}`}
            >
              <Phone className="w-3.5 h-3.5 text-accent" />
              <span>{settings.phone}</span>
            </a>

            <Link
              href="/contact"
              className="inline-flex items-center space-x-2 bg-ink hover:bg-black text-white text-xs sm:text-sm font-medium px-4 sm:px-5 py-2 sm:py-2.5 rounded-pill shadow-soft transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book a visit</span>
              <ArrowRight className="w-3 h-3 hidden sm:inline-block" />
            </Link>
          </div>
        </div>

        {/* Mobile Horizontal Scroll Navigation */}
        <div className="md:hidden flex items-center overflow-x-auto hide-scrollbar space-x-6 py-2.5 border-t border-border/60">
          {navLinks.map((link) => {
            const isActive =
              link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap text-xs uppercase tracking-wider font-medium pb-1 relative transition-colors ${
                  isActive
                    ? 'text-accent font-semibold'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
