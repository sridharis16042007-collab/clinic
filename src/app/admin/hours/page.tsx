import React from 'react';
import { HoursManager } from '@/components/admin/hours-manager';
import { getOpeningHours, getSiteSettings } from '@/lib/data';
import { Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminHoursPage() {
  const [hours, settings] = await Promise.all([
    getOpeningHours(),
    getSiteSettings(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-accent-light text-accent text-xs font-semibold uppercase tracking-wider mb-2">
          <Clock className="w-3.5 h-3.5" />
          <span>Timing & Alerts</span>
        </div>
        <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-ink">
          Opening Hours & Holiday Notice
        </h1>
        <p className="text-xs sm:text-sm text-ink-muted mt-1">
          Manage day-by-day clinic consultation slots and toggle the top holiday alert banner.
        </p>
      </div>

      <HoursManager initialHours={hours} settings={settings} />
    </div>
  );
}
