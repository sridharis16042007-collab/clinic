import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getActiveDoctors, getSiteSettings } from '@/lib/data';
import { formatINR } from '@/lib/utils/formatters';
import { FinalCta } from '@/components/public/final-cta';
import {
  Award,
  Calendar,
  Languages,
  ShieldCheck,
  Tag,
  ArrowRight,
} from 'lucide-react';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: 'Our Doctors & Dental Surgeons',
    description: `Meet Dr. K. Senthil Kumar (MDS Endodontics) and Dr. M. Deepa Priyadarshini at ${settings.clinic_name}, Rasipuram. Registered clinicians with 14+ years experience.`,
  };
}

export default async function DoctorsPage() {
  const [doctors, settings] = await Promise.all([
    getActiveDoctors(),
    getSiteSettings(),
  ]);

  return (
    <div className="py-12 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16">
        <div className="max-w-2xl">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-accent-light text-accent text-xs font-semibold tracking-wider uppercase mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Clinical Credentials</span>
          </div>
          <h1 className="clamp-title font-sans font-light text-ink">
            Qualified clinicians,{' '}
            <span className="font-extrabold text-ink block">
              dedicated to Rasipuram.
            </span>
          </h1>
          <p className="text-sm sm:text-base text-ink-muted mt-4 leading-relaxed">
            Our doctors are registered with the State Dental Council and adhere strictly to medical ethics. We prioritize patient education and comfortable, informed clinical care.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-12 sm:space-y-16">
          {doctors.map((doc, idx) => (
            <div
              key={doc.id}
              className="bg-surface rounded-3xl p-6 sm:p-10 border border-border shadow-soft grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start"
            >
              {/* Doctor Photo */}
              <div className="lg:col-span-4 relative aspect-[4/5] rounded-2xl overflow-hidden border border-border bg-[#ecece8]">
                {doc.photo_url ? (
                  <Image
                    src={doc.photo_url}
                    alt={doc.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 350px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-ink-muted text-sm">
                    Clinical Portrait
                  </div>
                )}
                <div className="absolute bottom-3 left-3 bg-surface/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-semibold text-accent border border-border">
                  {doc.experience_years}+ Years Clinical Practice
                </div>
              </div>

              {/* Doctor Details & Dashed Facts Table */}
              <div className="lg:col-span-8 space-y-6">
                <div>
                  <div className="text-xs uppercase tracking-wider font-semibold text-accent mb-1">
                    {doc.designation}
                  </div>
                  <h2 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-ink">
                    {doc.name}
                  </h2>
                  <p className="text-sm font-medium text-ink-muted mt-1">
                    {doc.qualifications}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                  {doc.bio}
                </p>

                {/* Dashed Facts Table */}
                <div className="border-y border-dashed border-border divide-y divide-dashed divide-border text-xs sm:text-sm">
                  <div className="py-2.5 flex justify-between items-center">
                    <span className="text-ink-muted flex items-center space-x-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                      <span>Registration Number</span>
                    </span>
                    <span className="font-mono font-semibold text-ink">
                      {doc.registration_number} (State Dental Council)
                    </span>
                  </div>

                  <div className="py-2.5 flex justify-between items-center">
                    <span className="text-ink-muted flex items-center space-x-1.5">
                      <Award className="w-3.5 h-3.5 text-accent" />
                      <span>Clinical Experience</span>
                    </span>
                    <span className="font-semibold text-ink">
                      {doc.experience_years} Years Active Practice
                    </span>
                  </div>

                  <div className="py-2.5 flex justify-between items-center">
                    <span className="text-ink-muted flex items-center space-x-1.5">
                      <Languages className="w-3.5 h-3.5 text-accent" />
                      <span>Consultation Languages</span>
                    </span>
                    <span className="font-medium text-ink">
                      {doc.languages_spoken.join(', ')}
                    </span>
                  </div>

                  {doc.availability_days && (
                    <div className="py-2.5 flex justify-between items-center">
                      <span className="text-ink-muted flex items-center space-x-1.5">
                        <Calendar className="w-3.5 h-3.5 text-accent" />
                        <span>Consulting Hours</span>
                      </span>
                      <span className="font-medium text-ink">
                        {doc.availability_days}
                      </span>
                    </div>
                  )}

                  {doc.consultation_fee && (
                    <div className="py-2.5 flex justify-between items-center">
                      <span className="text-ink-muted flex items-center space-x-1.5">
                        <Tag className="w-3.5 h-3.5 text-accent" />
                        <span>Consultation Fee</span>
                      </span>
                      <span className="font-semibold text-ink">
                        {formatINR(doc.consultation_fee)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <Link
                    href={`/contact?doctor=${encodeURIComponent(doc.name)}`}
                    className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-ink hover:bg-black text-white px-6 py-3 rounded-pill text-xs sm:text-sm font-semibold shadow-soft transition-all"
                  >
                    <span>Consult with {doc.name.split(' ')[1] || doc.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20">
        <FinalCta settings={settings} />
      </div>
    </div>
  );
}
