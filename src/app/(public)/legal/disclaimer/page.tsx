import React from 'react';
import type { Metadata } from 'next';
import { getSiteSettings } from '@/lib/data';
import { AlertCircle } from 'lucide-react';

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: 'Medical & Dental Disclaimer',
    description: `Clinical advisory and general health educational disclaimer for ${settings.clinic_name}, Rasipuram.`,
  };
}

export default async function DisclaimerPage() {
  const settings = await getSiteSettings();

  return (
    <div className="py-12 sm:py-16 md:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-accent-light text-accent text-xs font-semibold tracking-wider uppercase mb-3">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Clinical Advisory</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-ink">
            Medical Disclaimer
          </h1>
          <p className="text-xs text-ink-muted mt-2">
            In compliance with National Medical Commission and Dental Council of India guidelines
          </p>
        </div>

        <div className="prose prose-neutral text-sm text-ink-muted leading-relaxed space-y-6">
          <div className="p-5 rounded-2xl bg-surface border border-border shadow-soft text-ink">
            <strong className="block text-accent mb-1 font-semibold">Important Notice:</strong>
            The content, treatment descriptions, estimated time durations, and fee illustrations published on this website are intended solely for general patient education. They do not constitute formal medical diagnosis, prognosis, or customized dental advice.
          </div>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-ink">1. Individual Variations in Treatment</h2>
            <p>
              Every patient&apos;s oral anatomy, bone density, gum condition, and medical history are distinct. Clinical outcomes, treatment duration, and surgical requirements can only be determined through direct, in-person clinical examination, dental probing, and low-radiation digital radiography at our operatory.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-ink">2. Medical Emergencies</h2>
            <p>
              If you are experiencing acute dental trauma, severe facial swelling, difficulty breathing, or uncontrolled oral bleeding, please seek immediate emergency care or call our emergency hotline at {settings.emergency_phone || settings.phone} without delay.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-ink">3. Advertising Ethics</h2>
            <p>
              {settings.clinic_name} adheres strictly to Indian medical ethics. We do not make superlative claims such as &quot;guaranteed results&quot; or &quot;best dental clinic&quot;. All qualifications listed reflect genuine degrees conferred by recognized universities and registered with the State Dental Council.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
