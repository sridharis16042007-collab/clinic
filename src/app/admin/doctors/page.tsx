import React from 'react';
import { DoctorsManager } from '@/components/admin/doctors-manager';
import { getActiveDoctors } from '@/lib/data';
import { Users } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDoctorsPage() {
  const doctors = await getActiveDoctors();

  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-accent-light text-accent text-xs font-semibold uppercase tracking-wider mb-2">
          <Users className="w-3.5 h-3.5" />
          <span>Clinical Staff</span>
        </div>
        <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-ink">
          Doctors & Dental Surgeons
        </h1>
        <p className="text-xs sm:text-sm text-ink-muted mt-1">
          Update doctor credentials, State Dental Council registration numbers, consultation fees, and bios.
        </p>
      </div>

      <DoctorsManager initialDoctors={doctors} />
    </div>
  );
}
