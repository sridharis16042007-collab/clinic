'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Service, SiteSettings } from '@/types/clinic';
import { formatINR } from '@/lib/utils/formatters';
import { Clock, Tag, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

interface ServiceGalleryProps {
  services: Service[];
  settings: SiteSettings;
}

export function ServiceGallery({ services, settings }: ServiceGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!services || services.length === 0) {
    return (
      <div className="text-center py-20 text-ink-muted text-sm">
        No clinical services listed at this moment.
      </div>
    );
  }

  const currentService = services[selectedIndex] || services[0];
  const numeralStr = String(selectedIndex + 1).padStart(2, '0');

  return (
    <div className="w-full">
      {/* Mobile Selector Pills */}
      <div className="lg:hidden flex overflow-x-auto hide-scrollbar space-x-2 pb-4 mb-6">
        {services.map((srv, idx) => (
          <button
            key={srv.id}
            onClick={() => setSelectedIndex(idx)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-medium transition-all ${
              idx === selectedIndex
                ? 'bg-ink text-white shadow-soft'
                : 'bg-surface text-ink-muted border border-border hover:bg-canvas'
            }`}
          >
            {srv.title}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left Column: Vertical List of Services */}
        <div className="lg:col-span-5 space-y-2 border-r border-border/60 lg:pr-6">
          <div className="text-xs uppercase tracking-wider font-semibold text-ink-muted px-4 py-2">
            Available Treatments ({services.length})
          </div>

          <div className="space-y-1">
            {services.map((service, index) => {
              const isSelected = index === selectedIndex;
              const itemNumeral = String(index + 1).padStart(2, '0');
              return (
                <button
                  key={service.id}
                  onClick={() => setSelectedIndex(index)}
                  className={`w-full text-left p-4 sm:p-5 rounded-2xl transition-all duration-200 flex items-center justify-between group ${
                    isSelected
                      ? 'bg-surface shadow-card border border-border/80'
                      : 'hover:bg-surface/50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <span
                      className={`text-xs font-mono transition-colors ${
                        isSelected
                          ? 'text-accent font-bold'
                          : 'text-ink-muted group-hover:text-ink'
                      }`}
                    >
                      {itemNumeral}
                    </span>
                    <div>
                      <div
                        className={`text-sm sm:text-base font-semibold tracking-tight transition-colors ${
                          isSelected ? 'text-ink' : 'text-ink-muted group-hover:text-ink'
                        }`}
                      >
                        {service.title}
                      </div>
                      {service.badge && (
                        <span className="inline-block text-[10px] font-medium text-accent bg-accent-light px-2 py-0.5 rounded-full mt-1">
                          {service.badge}
                        </span>
                      )}
                    </div>
                  </div>

                  <ArrowRight
                    className={`w-4 h-4 transition-transform ${
                      isSelected
                        ? 'text-accent translate-x-1'
                        : 'text-border opacity-0 group-hover:opacity-100'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Product-Gallery Detail View */}
        <div className="lg:col-span-7 bg-surface rounded-3xl p-6 sm:p-10 border border-border shadow-soft min-h-[520px] flex flex-col justify-between">
          <div className="space-y-6">
            {/* Outlined numeral header & badge */}
            <div className="flex items-center justify-between pb-4 border-b border-border/60">
              <span className="text-5xl sm:text-7xl font-extralight tracking-tighter text-border">
                {numeralStr}
              </span>

              {currentService.badge && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-accent-light text-accent border border-accent/20">
                  {currentService.badge}
                </span>
              )}
            </div>

            {/* Very large title with light/bold mix */}
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-sans font-bold tracking-tight text-ink">
              {currentService.title}
            </h3>

            {/* Description */}
            <p className="text-sm sm:text-base text-ink-muted leading-relaxed font-normal">
              {currentService.full_description || currentService.short_description}
            </p>

            {/* Service Image (if available) */}
            {currentService.image_url && (
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-border bg-[#f0f0ed]">
                <Image
                  src={currentService.image_url}
                  alt={currentService.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            )}

            {/* Dashed Facts Table (Starting price, duration, hygiene standard) */}
            <div className="pt-4 border-t border-dashed border-border divide-y divide-dashed divide-border text-xs sm:text-sm">
              {currentService.starting_price !== null &&
                currentService.starting_price !== undefined && (
                  <div className="py-2.5 flex justify-between items-center">
                    <span className="text-ink-muted flex items-center space-x-1.5">
                      <Tag className="w-3.5 h-3.5 text-accent" />
                      <span>Estimated Fee</span>
                    </span>
                    <span className="font-semibold text-ink">
                      From {formatINR(currentService.starting_price)}
                    </span>
                  </div>
                )}

              {currentService.duration_minutes && (
                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-ink-muted flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-accent" />
                    <span>Average Duration</span>
                  </span>
                  <span className="font-semibold text-ink">
                    ~{currentService.duration_minutes} minutes
                  </span>
                </div>
              )}

              <div className="py-2.5 flex justify-between items-center">
                <span className="text-ink-muted flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                  <span>Protocol</span>
                </span>
                <span className="font-semibold text-ink">
                  Autoclave Sterilized • Digital Diagnosis
                </span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-8 border-t border-border mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-ink-muted">
              Pre-consultation advice available via WhatsApp.
            </div>

            <Link
              href={`/contact?treatment=${encodeURIComponent(
                currentService.title
              )}&id=${currentService.id}`}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-accent hover:bg-accent-hover text-white px-6 py-3 rounded-pill text-xs sm:text-sm font-semibold shadow-soft transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Book this treatment</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
