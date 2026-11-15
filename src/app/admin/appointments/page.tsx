import React from 'react';
import { AppointmentsTable } from '@/components/admin/appointments-table';
import { createClient } from '@/lib/supabase/server';
import { getLocalAppointments } from '@/lib/appointments-store';
import { Appointment } from '@/types/clinic';
import { Inbox } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminAppointmentsPage() {
  const supabase = createClient();
  let appointments: Appointment[] = getLocalAppointments();

  if (supabase) {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      appointments = data as Appointment[];
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-accent-light text-accent text-xs font-semibold uppercase tracking-wider mb-2">
            <Inbox className="w-3.5 h-3.5" />
            <span>Booking Requests</span>
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-ink">
            Appointments Inbox
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted mt-1">
            Review incoming patient requests, update statuses, add clinic notes, and reply via WhatsApp.
          </p>
        </div>
      </div>

      <AppointmentsTable initialAppointments={appointments} />
    </div>
  );
}
