'use client';

import React, { useState } from 'react';
import { Testimonial } from '@/types/clinic';
import {
  addTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '@/lib/actions/testimonials';
import {
  Plus,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle2,
  Star,
  ShieldCheck,
} from 'lucide-react';

interface TestimonialsManagerProps {
  initialTestimonials: Testimonial[];
}

export function TestimonialsManager({
  initialTestimonials,
}: TestimonialsManagerProps) {
  const [items, setItems] = useState<Testimonial[]>(initialTestimonials);
  const [isAdding, setIsAdding] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    patient_name: '',
    treatment: '',
    feedback: '',
    rating: 5,
    visit_month_year: 'November 2026',
    has_patient_consent: true,
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patient_name || !formData.feedback) return;

    const newRecord: Omit<Testimonial, 'id' | 'created_at' | 'updated_at'> = {
      patient_name: formData.patient_name,
      treatment: formData.treatment || 'Dental Care',
      feedback: formData.feedback,
      feedback_ta: null,
      rating: formData.rating,
      visit_month_year: formData.visit_month_year,
      has_patient_consent: formData.has_patient_consent,
      is_active: true,
      display_order: items.length + 1,
    };

    await addTestimonial(newRecord);
    setItems((prev) => [
      ...prev,
      {
        ...newRecord,
        id: `t-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);

    setFeedbackMsg('Verified patient feedback added.');
    setIsAdding(false);
    setFormData({
      patient_name: '',
      treatment: '',
      feedback: '',
      rating: 5,
      visit_month_year: 'November 2026',
      has_patient_consent: true,
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this testimonial?')) {
      setItems((prev) => prev.filter((t) => t.id !== id));
      await deleteTestimonial(id);
      setFeedbackMsg('Testimonial removed.');
    }
  };

  const handleToggle = async (id: string, current: boolean) => {
    setItems((prev) =>
      prev.map((t) => (t.id === id ? { ...t, is_active: !current } : t))
    );
    await updateTestimonial(id, { is_active: !current });
  };

  return (
    <div className="space-y-6">
      {feedbackMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="text-xs text-ink-muted">
          Showing {items.length} verified patient reviews
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center space-x-1.5 bg-ink hover:bg-black text-white px-4 py-2 rounded-pill text-xs font-semibold shadow-soft transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Patient Feedback</span>
          </button>
        )}
      </div>

      {isAdding && (
        <form
          onSubmit={handleCreate}
          className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-card space-y-4 animate-in fade-in"
        >
          <div className="flex justify-between items-center pb-3 border-b border-border">
            <h3 className="font-editorial text-lg font-bold text-ink">
              Add Verified Patient Review
            </h3>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-xs text-ink-muted hover:text-ink"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] uppercase font-bold text-ink">
                Patient Name & City *
              </label>
              <input
                type="text"
                required
                value={formData.patient_name}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    patient_name: e.target.value,
                  }))
                }
                placeholder="e.g. S. Ramanathan, Rasipuram"
                className="w-full px-3 py-2 bg-canvas border border-border rounded-xl text-xs sm:text-sm text-ink focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] uppercase font-bold text-ink">
                Treatment Received *
              </label>
              <input
                type="text"
                required
                value={formData.treatment}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    treatment: e.target.value,
                  }))
                }
                placeholder="e.g. Root Canal & Ceramic Crown"
                className="w-full px-3 py-2 bg-canvas border border-border rounded-xl text-xs sm:text-sm text-ink focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] uppercase font-bold text-ink">
              Genuine Patient Feedback *
            </label>
            <textarea
              required
              rows={3}
              value={formData.feedback}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, feedback: e.target.value }))
              }
              placeholder="Factual comments provided by the patient regarding pain relief, doctor explanation, clinic cleanliness..."
              className="w-full px-3 py-2 bg-canvas border border-border rounded-xl text-xs sm:text-sm text-ink focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="space-y-1">
              <label className="text-[11px] uppercase font-bold text-ink">
                Visit Month / Year
              </label>
              <input
                type="text"
                value={formData.visit_month_year}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    visit_month_year: e.target.value,
                  }))
                }
                placeholder="October 2026"
                className="w-full px-3 py-2 bg-canvas border border-border rounded-xl text-xs sm:text-sm text-ink focus:outline-none"
              />
            </div>

            <div className="pt-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.has_patient_consent}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      has_patient_consent: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                />
                <span className="text-xs text-ink-muted">
                  Patient has given verbal/written consent for feedback display
                </span>
              </label>
            </div>
          </div>

          <div className="pt-3 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-pill bg-canvas text-xs font-semibold text-ink-muted border border-border"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-pill bg-accent hover:bg-accent-hover text-white text-xs font-semibold shadow-soft"
            >
              Save Feedback
            </button>
          </div>
        </form>
      )}

      {/* Testimonials List */}
      <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-soft">
        <div className="divide-y divide-border">
          {items.map((item) => (
            <div
              key={item.id}
              className={`p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 transition-colors ${
                !item.is_active ? 'opacity-50 bg-canvas/40' : 'hover:bg-canvas/30'
              }`}
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-ink">
                    {item.patient_name}
                  </span>
                  <span className="text-xs text-accent font-medium">
                    • {item.treatment}
                  </span>
                </div>

                <div className="flex items-center space-x-1 py-1">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5 text-amber-400 fill-amber-400"
                    />
                  ))}
                  {item.visit_month_year && (
                    <span className="text-[10px] text-ink-muted ml-2">
                      ({item.visit_month_year})
                    </span>
                  )}
                </div>

                <p className="text-xs text-ink-muted italic leading-relaxed">
                  &ldquo;{item.feedback}&rdquo;
                </p>
              </div>

              <div className="flex items-center space-x-2 self-end sm:self-center">
                <button
                  onClick={() => handleToggle(item.id, item.is_active)}
                  className="p-2 rounded-lg bg-canvas text-ink-muted hover:text-ink border border-border"
                  title={item.is_active ? 'Hide review' : 'Publish review'}
                >
                  {item.is_active ? (
                    <Eye className="w-3.5 h-3.5 text-accent" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5 text-ink-muted" />
                  )}
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 rounded-lg bg-canvas text-ink-muted hover:text-red-600 border border-border"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
