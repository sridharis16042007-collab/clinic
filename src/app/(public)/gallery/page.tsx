import React from 'react';
import type { Metadata } from 'next';
import { LightboxGallery } from '@/components/public/lightbox';
import { FinalCta } from '@/components/public/final-cta';
import { getActiveGallery, getSiteSettings } from '@/lib/data';
import { Camera } from 'lucide-react';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: 'Clinic Tour & Sterilization Standards',
    description: `Take a photo tour inside ${settings.clinic_name}, Rasipuram. Explore our hygienic treatment rooms, reception lounge, and Class-B autoclave sterilization station.`,
  };
}

export default async function GalleryPage() {
  const [galleryImages, settings] = await Promise.all([
    getActiveGallery(),
    getSiteSettings(),
  ]);

  return (
    <div className="py-12 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16">
        <div className="max-w-2xl">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-accent-light text-accent text-xs font-semibold tracking-wider uppercase mb-3">
            <Camera className="w-3.5 h-3.5" />
            <span>Clinic Tour</span>
          </div>
          <h1 className="clamp-title font-sans font-light text-ink">
            A calm environment,{' '}
            <span className="font-extrabold text-ink block">
              sterile standards.
            </span>
          </h1>
          <p className="text-sm sm:text-base text-ink-muted mt-4 leading-relaxed">
            We maintain strict hospital-grade cleanliness across all consultation rooms and equipment. Tap any image to inspect our facilities in full screen.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <LightboxGallery images={galleryImages} />
      </div>

      <div className="mt-20">
        <FinalCta settings={settings} />
      </div>
    </div>
  );
}
