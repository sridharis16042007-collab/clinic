import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';
import { Testimonial } from '@/types/clinic';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-surface/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="text-xs uppercase tracking-wider font-semibold text-accent mb-2">
              Verified Patient Experiences
            </div>
            <h2 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-ink">
              Real feedback from local families.
            </h2>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-2 text-xs text-ink-muted">
            <CheckCircle2 className="w-4 h-4 text-accent" />
            <span>Shared with verified patient consent</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-surface border border-border shadow-soft hover:shadow-card transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5 text-amber-400 fill-amber-400"
                      />
                    ))}
                  </div>
                  <Quote className="w-5 h-5 text-border" />
                </div>

                <p className="text-xs sm:text-sm text-ink/90 leading-relaxed italic mb-6">
                  &ldquo;{item.feedback}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-border/70 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-ink">
                    {item.patient_name}
                  </div>
                  <div className="text-[11px] text-accent font-medium mt-0.5">
                    {item.treatment}
                  </div>
                </div>
                {item.visit_month_year && (
                  <span className="text-[10px] text-ink-muted">
                    {item.visit_month_year}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
