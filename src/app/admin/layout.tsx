import React from 'react';
import { AdminNav } from '@/components/admin/admin-nav';
import { getSiteSettings } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col lg:flex-row">
      <AdminNav clinicName={settings.clinic_name} />
      <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-6xl w-full">
        {children}
      </main>
    </div>
  );
}
