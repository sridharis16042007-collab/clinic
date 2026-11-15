import React from 'react';
import type { Metadata } from 'next';
import { getSiteSettings } from '@/lib/data';
import { ShieldCheck } from 'lucide-react';

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: 'Privacy Policy',
    description: `Data protection and patient privacy policies for ${settings.clinic_name}, Rasipuram.`,
  };
}

export default async function PrivacyPolicyPage() {
  const settings = await getSiteSettings();

  return (
    <div className="py-12 sm:py-16 md:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-accent-light text-accent text-xs font-semibold tracking-wider uppercase mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Patient Confidentiality</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-ink">
            Privacy Policy
          </h1>
          <p className="text-xs text-ink-muted mt-2">
            Last updated: November 2026 • Compliant with Indian Digital Data Protection standards
          </p>
        </div>

        <div className="prose prose-neutral text-sm text-ink-muted leading-relaxed space-y-6">
          <section className="space-y-2">
            <h2 className="text-base font-semibold text-ink">1. Information We Collect</h2>
            <p>
              When you submit an appointment request through {settings.clinic_name}&apos;s website, we collect only the minimum necessary details to schedule and facilitate your clinical visit:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Patient Name</li>
              <li>Contact Phone / WhatsApp number</li>
              <li>Requested dental treatment or consultation topic</li>
              <li>Preferred appointment date and time of day</li>
              <li>Optional symptoms or notes shared by you</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-ink">2. How Your Information Is Used</h2>
            <p>
              Your personal information is used exclusively for:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Contacting you via WhatsApp or phone call to confirm or reschedule your appointment</li>
              <li>Preparing clinic case records for your scheduled consultation</li>
              <li>Answering questions you submitted through our contact channels</li>
            </ul>
            <p className="font-medium text-ink">
              We never sell, rent, monetize, or disclose your contact details to third-party marketers or insurance aggregators.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-ink">3. Data Storage & Security</h2>
            <p>
              Submissions are encrypted via SSL/HTTPS transmission and securely stored in our protected database with Row Level Security (RLS). Access is restricted exclusively to authenticated clinic administrative personnel.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-ink">4. Your Rights</h2>
            <p>
              You have the right to request access to or deletion of your contact inquiry record from our booking inbox at any time. To request deletion, contact our clinic desk at {settings.phone} or email {settings.email || 'care@vrikshamclinic.in'}.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
