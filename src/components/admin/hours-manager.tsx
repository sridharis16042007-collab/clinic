'use client';

import React, { useState } from 'react';
import { OpeningHours, SiteSettings } from '@/types/clinic';
import { updateDaySchedule, toggleHolidayNotice } from '@/lib/actions/hours';
import { Clock, AlertTriangle, Save, CheckCircle2, AlertCircle } from 'lucide-react';

interface HoursManagerProps {
  initialHours: OpeningHours[];
  settings: SiteSettings;
}

export function HoursManager({ initialHours, settings }: HoursManagerProps) {
  const [hoursList, setHoursList] = useState<OpeningHours[]>(initialHours);
  const [holidayEnabled, setHolidayEnabled] = useState(
    settings.holiday_notice_enabled
  );
  const [holidayText, setHolidayText] = useState(
    settings.holiday_notice_text || 'Clinic will remain closed on festival day.'
  );
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleFieldChange = (
    id: string,
    field: keyof OpeningHours,
    value: string | boolean
  ) => {
    setHoursList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleSaveDay = async (item: OpeningHours) => {
    setIsSaving(true);
    setFeedback(null);
    const res = await updateDaySchedule(item.id, {
      open_time: item.open_time,
      close_time: item.close_time,
      break_time: item.break_time,
      is_closed: item.is_closed,
    });
    if (res.success) {
      setFeedback(`Saved schedule for ${item.day_name}.`);
    }
    setIsSaving(false);
  };

  const handleSaveHolidayNotice = async () => {
    setIsSaving(true);
    setFeedback(null);
    const res = await toggleHolidayNotice(
      settings.id,
      holidayEnabled,
      holidayText
    );
    if (res.success) {
      setFeedback('Holiday / emergency banner notice updated successfully.');
    }
    setIsSaving(false);
  };

  return (
    <div className="space-y-8">
      {feedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* 1. Holiday / Temporary Notice Banner */}
      <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-soft space-y-5">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <h2 className="text-sm uppercase tracking-wider font-bold text-ink">
            Temporary Notice / Holiday Banner
          </h2>
        </div>
        <p className="text-xs text-ink-muted">
          Displays an urgent alert banner at the very top of the public website for festival holidays, weather disruptions, or temporary schedule shifts.
        </p>

        <div className="flex items-center space-x-3 pt-1">
          <input
            id="holiday_toggle"
            type="checkbox"
            checked={holidayEnabled}
            onChange={(e) => setHolidayEnabled(e.target.checked)}
            className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
          />
          <label
            htmlFor="holiday_toggle"
            className="text-xs font-semibold text-ink cursor-pointer"
          >
            Show notice banner on public website
          </label>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-wider font-semibold text-ink">
            Banner Announcement Text
          </label>
          <input
            type="text"
            value={holidayText}
            onChange={(e) => setHolidayText(e.target.value)}
            placeholder="e.g. Clinic will remain closed on Friday for Deepavali. Emergency consultations available on call."
            className="w-full px-3.5 py-2.5 bg-canvas border border-border rounded-xl text-xs sm:text-sm text-ink focus:outline-none"
          />
        </div>

        <button
          onClick={handleSaveHolidayNotice}
          disabled={isSaving}
          className="inline-flex items-center space-x-2 bg-ink hover:bg-black text-white px-5 py-2.5 rounded-pill text-xs font-semibold shadow-soft transition-all"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Notice Banner</span>
        </button>
      </div>

      {/* 2. Per-Day Schedule */}
      <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-soft space-y-6">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-accent" />
          <h2 className="text-sm uppercase tracking-wider font-bold text-ink">
            Weekly Consultation Schedule
          </h2>
        </div>

        <div className="divide-y divide-border/60">
          {hoursList.map((item) => (
            <div
              key={item.day_of_week}
              className="py-4 first:pt-0 last:pb-0 grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 items-center"
            >
              {/* Day name & Closed checkbox */}
              <div className="sm:col-span-3">
                <div className="text-sm font-bold text-ink">
                  {item.day_name}
                </div>
                <label className="flex items-center space-x-1.5 mt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.is_closed}
                    onChange={(e) =>
                      handleFieldChange(item.id, 'is_closed', e.target.checked)
                    }
                    className="h-3.5 w-3.5 rounded border-border text-accent focus:ring-accent"
                  />
                  <span className="text-[11px] text-ink-muted">
                    Mark as Closed
                  </span>
                </label>
              </div>

              {/* Open & Close Times */}
              {!item.is_closed ? (
                <>
                  <div className="sm:col-span-3">
                    <label className="block text-[10px] uppercase font-semibold text-ink-muted">
                      Open Time
                    </label>
                    <input
                      type="text"
                      value={item.open_time || ''}
                      onChange={(e) =>
                        handleFieldChange(item.id, 'open_time', e.target.value)
                      }
                      placeholder="09:30 AM"
                      className="w-full px-2.5 py-1.5 bg-canvas border border-border rounded-lg text-xs text-ink"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-[10px] uppercase font-semibold text-ink-muted">
                      Close Time
                    </label>
                    <input
                      type="text"
                      value={item.close_time || ''}
                      onChange={(e) =>
                        handleFieldChange(item.id, 'close_time', e.target.value)
                      }
                      placeholder="08:30 PM"
                      className="w-full px-2.5 py-1.5 bg-canvas border border-border rounded-lg text-xs text-ink"
                    />
                  </div>

                  <div className="sm:col-span-3 flex items-center justify-between space-x-2">
                    <div className="flex-1">
                      <label className="block text-[10px] uppercase font-semibold text-ink-muted">
                        Break Slot
                      </label>
                      <input
                        type="text"
                        value={item.break_time || ''}
                        onChange={(e) =>
                          handleFieldChange(item.id, 'break_time', e.target.value)
                        }
                        placeholder="01:30 PM - 04:30 PM"
                        className="w-full px-2.5 py-1.5 bg-canvas border border-border rounded-lg text-xs text-ink"
                      />
                    </div>
                    <button
                      onClick={() => handleSaveDay(item)}
                      disabled={isSaving}
                      className="mt-3.5 p-2 rounded-lg bg-canvas hover:bg-surface border border-border text-ink hover:text-accent shadow-sm"
                      title="Save day"
                    >
                      <Save className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="sm:col-span-9 flex items-center justify-between">
                  <span className="text-xs text-amber-700 italic">
                    Closed (Emergency consultations on call)
                  </span>
                  <button
                    onClick={() => handleSaveDay(item)}
                    disabled={isSaving}
                    className="p-2 rounded-lg bg-canvas hover:bg-surface border border-border text-ink hover:text-accent shadow-sm"
                    title="Save day"
                  >
                    <Save className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
