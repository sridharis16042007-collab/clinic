import React from 'react';
import { UserCheck, Tag, Sparkles, ShieldCheck } from 'lucide-react';

export function TrustPoints() {
  const points = [
    {
      icon: UserCheck,
      title: 'Walk-ins Welcome',
      desc: 'Emergency dental pain or sudden toothache is addressed with prompt priority consultation.',
      badge: 'Immediate triage',
    },
    {
      icon: Tag,
      title: 'Clear, Transparent Pricing',
      desc: 'Every fee is explained before treatment begins. Standard charges with no surprise add-ons.',
      badge: 'Fixed estimates',
    },
    {
      icon: Sparkles,
      title: 'Hospital-Grade Hygiene',
      desc: 'Every instrument undergoes Class-B autoclave sterilization with sealed single-use patient kits.',
      badge: '100% sterile',
    },
  ];

  return (
    <section className="py-16 md:py-24 border-y border-border/80 bg-surface/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-accent-light text-accent text-xs font-semibold tracking-wider uppercase mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Patient Standards</span>
          </div>
          <h2 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-ink">
            Care centered on patient comfort and honest advice.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {points.map((pt, idx) => {
            const Icon = pt.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-start p-6 sm:p-8 rounded-2xl bg-surface border border-border hover:border-accent/40 transition-all duration-300 shadow-soft group"
              >
                <div className="flex items-center justify-between w-full mb-6">
                  <div className="w-12 h-12 rounded-full bg-canvas flex items-center justify-center border border-border group-hover:border-accent/30 group-hover:bg-accent-light transition-colors">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <span className="text-[11px] font-medium text-ink-muted bg-canvas px-2.5 py-1 rounded-full border border-border">
                    {pt.badge}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-ink mb-2 tracking-tight">
                  {pt.title}
                </h3>
                <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                  {pt.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
