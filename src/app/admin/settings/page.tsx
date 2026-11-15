import React from 'react';
import { SettingsForm } from '@/components/admin/settings-form';
import { getSiteSettings } from '@/lib/data';
import { Settings } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-accent-light text-accent text-xs font-semibold uppercase tracking-wider mb-2">
          <Settings className="w-3.5 h-3.5" />
          <span>Clinic Configuration</span>
        </div>
        <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-ink">
          Clinic Details & Accent Styling
        </h1>
        <p className="text-xs sm:text-sm text-ink-muted mt-1">
          Update your clinic name, contact numbers, Rasipuram address, Google links, and brand accent color.
        </p>
      </div>

      <SettingsForm initialSettings={settings} />
    </div>
  );
}
