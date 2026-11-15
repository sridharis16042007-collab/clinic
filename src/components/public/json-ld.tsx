import React from 'react';
import { SiteSettings, OpeningHours, Doctor } from '@/types/clinic';

interface JsonLdProps {
  settings: SiteSettings;
  hours: OpeningHours[];
  doctors: Doctor[];
}

export function ClinicJsonLd({ settings, hours, doctors }: JsonLdProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vrikshamclinic.in';

  // Map opening hours to Schema.org OpeningHoursSpecification
  const dayMap: Record<number, string> = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
  };

  const openingHoursSpec = hours
    .filter((h) => !h.is_closed)
    .map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: dayMap[h.day_of_week] || 'Monday',
      opens: h.open_time?.replace(/\s*(AM|PM)/i, '') || '09:30',
      closes: h.close_time?.replace(/\s*(AM|PM)/i, '') || '20:30',
    }));

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Dentist', // or MedicalClinic / Physiotherapy
    name: settings.clinic_name,
    image: settings.logo_url || `${siteUrl}/images/clinic-hero.webp`,
    '@id': `${siteUrl}/#clinic`,
    url: siteUrl,
    telephone: settings.phone,
    priceRange: '₹₹',
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.address_line1,
      addressLocality: settings.city,
      addressRegion: settings.state,
      postalCode: settings.postal_code,
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 11.4589, // Rasipuram coordinates
      longitude: 78.1691,
    },
    openingHoursSpecification: openingHoursSpec,
    employee: doctors.map((doc) => ({
      '@type': 'Physician',
      name: doc.name,
      jobTitle: doc.designation,
      medicalSpecialty: doc.qualifications,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
