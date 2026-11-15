import React from 'react';
import { TestimonialsManager } from '@/components/admin/testimonials-manager';
import { getActiveTestimonials } from '@/lib/data';
import { MessageSquare } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminTestimonialsPage() {
  const testimonials = await getActiveTestimonials();

  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-accent-light text-accent text-xs font-semibold uppercase tracking-wider mb-2">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Patient Trust</span>
        </div>
        <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-ink">
          Patient Testimonials & Reviews
        </h1>
        <p className="text-xs sm:text-sm text-ink-muted mt-1">
          Manage real patient feedback. In compliance with medical ethics, only verified feedback with patient consent is displayed.
        </p>
      </div>

      <TestimonialsManager initialTestimonials={testimonials} />
    </div>
  );
}
