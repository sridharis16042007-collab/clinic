import React from 'react';

export function ProcessSteps() {
  const steps = [
    {
      num: '01',
      title: 'Listen & Understand',
      desc: 'We start by understanding your exact concerns, pain history, or smile goals without rush.',
    },
    {
      num: '02',
      title: 'Digital Assessment',
      desc: 'Low-radiation intraoral x-rays and clinical examination to assess tooth structure and gum health.',
    },
    {
      num: '03',
      title: 'Personalized Plan',
      desc: 'We explain treatment options, estimated visits, and transparent fees before any procedure begins.',
    },
    {
      num: '04',
      title: 'Gentle Care & Follow-Up',
      desc: 'Comfortable, pain-free treatment with postoperative guidance and scheduled follow-ups.',
    },
  ];

  return (
    <div className="space-y-6">
      {steps.map((st) => (
        <div
          key={st.num}
          className="flex items-start space-x-4 p-4 rounded-xl hover:bg-surface/80 transition-colors border-b border-border/60 pb-5"
        >
          <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center flex-shrink-0 text-xs font-semibold text-accent bg-surface">
            {st.num}
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-ink tracking-tight">
              {st.title}
            </h4>
            <p className="text-xs text-ink-muted leading-relaxed">
              {st.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
