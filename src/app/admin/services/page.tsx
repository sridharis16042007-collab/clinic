import React from 'react';
import { ServicesManager } from '@/components/admin/services-manager';
import { getActiveServices } from '@/lib/data';
import { Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminServicesPage() {
  const services = await getActiveServices();

  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-accent-light text-accent text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Treatment Portfolio</span>
        </div>
        <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-ink">
          Clinical Services & Fees
        </h1>
        <p className="text-xs sm:text-sm text-ink-muted mt-1">
          Add, edit, toggle visibility, and configure starting prices for clinical procedures.
        </p>
      </div>

      <ServicesManager initialServices={services} />
    </div>
  );
}
