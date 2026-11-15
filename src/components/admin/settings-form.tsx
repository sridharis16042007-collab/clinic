'use client';

import React, { useState } from 'react';
import { SiteSettings } from '@/types/clinic';
import { updateSiteSettings } from '@/lib/actions/settings';
import { Save, CheckCircle2, AlertCircle, Palette } from 'lucide-react';

interface SettingsFormProps {
  initialSettings: SiteSettings;
}

const presetAccents = [
  { name: 'Forest Green (Default)', hex: '#2f8f4e' },
  { name: 'Sage Leaf', hex: '#3b7a57' },
  { name: 'Eucalyptus', hex: '#1e6b52' },
  { name: 'Slate Teal', hex: '#2c7a7b' },
  { name: 'Warm Terracotta', hex: '#9c5138' },
  { name: 'Deep Indigo', hex: '#2b4c7e' },
];

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [formData, setFormData] = useState<SiteSettings>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAccentSelect = (hex: string) => {
    setFormData((prev) => ({ ...prev, accent_color: hex }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMsg(null);

    const res = await updateSiteSettings(formData.id, formData);

    if (res.success) {
      setStatusMsg({
        type: 'success',
        text: 'Clinic details & styling saved successfully! Changes are live on the website.',
      });
    } else {
      setStatusMsg({
        type: 'error',
        text: res.error || 'Failed to save settings.',
      });
    }

    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {statusMsg && (
        <div
          className={`p-4 rounded-2xl text-xs flex items-center space-x-2 border ${
            statusMsg.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {statusMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* 1. Clinic Branding & Identity */}
      <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-soft space-y-5">
        <h2 className="text-sm uppercase tracking-wider font-bold text-ink">
          Clinic Branding & Tagline
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-ink">
              Clinic Name
            </label>
            <input
              type="text"
              name="clinic_name"
              required
              value={formData.clinic_name}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-canvas border border-border rounded-xl text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-ink">
              Clinic Speciality Type
            </label>
            <select
              name="clinic_type"
              value={formData.clinic_type}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-canvas border border-border rounded-xl text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/20"
            >
              <option value="dental">Dental & Oral Health Care</option>
              <option value="physiotherapy">Physiotherapy & Rehabilitation</option>
              <option value="skin">Dermatology & Skin Clinic</option>
              <option value="general">General Medical Practice</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-ink">
            Tagline (English)
          </label>
          <input
            type="text"
            name="tagline"
            value={formData.tagline || ''}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 bg-canvas border border-border rounded-xl text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-ink">
            Tagline (Tamil - தமிழ்)
          </label>
          <input
            type="text"
            name="tagline_ta"
            value={formData.tagline_ta || ''}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 bg-canvas border border-border rounded-xl text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
        </div>
      </div>

      {/* 2. Color Theme & Calm Accent */}
      <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-soft space-y-5">
        <div className="flex items-center space-x-2">
          <Palette className="w-4 h-4 text-accent" />
          <h2 className="text-sm uppercase tracking-wider font-bold text-ink">
            Calm Accent Color
          </h2>
        </div>
        <p className="text-xs text-ink-muted">
          Choose a calm brand tone for buttons, badges, highlights, and icons.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {presetAccents.map((item) => (
            <button
              type="button"
              key={item.hex}
              onClick={() => handleAccentSelect(item.hex)}
              className={`flex items-center space-x-3 p-3 rounded-xl border transition-all text-left ${
                formData.accent_color.toLowerCase() === item.hex.toLowerCase()
                  ? 'border-ink bg-canvas font-semibold shadow-sm'
                  : 'border-border hover:bg-canvas'
              }`}
            >
              <span
                className="w-5 h-5 rounded-full border border-black/10 flex-shrink-0"
                style={{ backgroundColor: item.hex }}
              />
              <span className="text-xs text-ink truncate">{item.name}</span>
            </button>
          ))}
        </div>

        <div className="pt-2 flex items-center space-x-3">
          <span className="text-xs text-ink-muted font-medium">Custom Hex:</span>
          <input
            type="text"
            name="accent_color"
            value={formData.accent_color}
            onChange={handleChange}
            className="w-32 px-3 py-1.5 bg-canvas border border-border rounded-lg text-xs font-mono text-ink"
          />
          <div
            className="w-7 h-7 rounded-lg border border-border"
            style={{ backgroundColor: formData.accent_color }}
          />
        </div>
      </div>

      {/* 3. Phone & WhatsApp Numbers */}
      <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-soft space-y-5">
        <h2 className="text-sm uppercase tracking-wider font-bold text-ink">
          Phone & Messaging Contact
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-ink">
              Reception Phone
            </label>
            <input
              type="text"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-canvas border border-border rounded-xl text-sm text-ink focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-ink">
              WhatsApp Booking Number
            </label>
            <input
              type="text"
              name="whatsapp_number"
              required
              value={formData.whatsapp_number}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-canvas border border-border rounded-xl text-sm text-ink focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-ink">
              Emergency Phone (Optional)
            </label>
            <input
              type="text"
              name="emergency_phone"
              value={formData.emergency_phone || ''}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-canvas border border-border rounded-xl text-sm text-ink focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 4. Physical Address & Google Maps */}
      <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-soft space-y-5">
        <h2 className="text-sm uppercase tracking-wider font-bold text-ink">
          Location & Google Maps Links
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-ink">
              Address Line 1
            </label>
            <input
              type="text"
              name="address_line1"
              required
              value={formData.address_line1}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-canvas border border-border rounded-xl text-sm text-ink focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-ink">
              Address Line 2 (Landmark)
            </label>
            <input
              type="text"
              name="address_line2"
              value={formData.address_line2 || ''}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-canvas border border-border rounded-xl text-sm text-ink focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-ink">
              City
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-canvas border border-border rounded-xl text-sm text-ink focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-ink">
              District
            </label>
            <input
              type="text"
              name="district"
              value={formData.district}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-canvas border border-border rounded-xl text-sm text-ink focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-ink">
              Postal Code (PIN)
            </label>
            <input
              type="text"
              name="postal_code"
              value={formData.postal_code}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-canvas border border-border rounded-xl text-sm text-ink focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-ink">
            Google Maps Embed URL (iframe src)
          </label>
          <input
            type="text"
            name="google_maps_embed_url"
            value={formData.google_maps_embed_url || ''}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 bg-canvas border border-border rounded-xl text-sm text-ink focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-ink">
            Google Maps Directions Link
          </label>
          <input
            type="text"
            name="google_maps_directions_url"
            value={formData.google_maps_directions_url || ''}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 bg-canvas border border-border rounded-xl text-sm text-ink focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-ink">
            Google Review Page URL (for patient reviews link)
          </label>
          <input
            type="text"
            name="google_review_url"
            value={formData.google_review_url || ''}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 bg-canvas border border-border rounded-xl text-sm text-ink focus:outline-none"
          />
        </div>
      </div>

      {/* 5. Google Sheets Database & Webhook Integration */}
      <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-soft space-y-5">
        <h2 className="text-sm uppercase tracking-wider font-bold text-ink">
          Google Sheets Database &amp; Email Webhook
        </h2>
        <p className="text-xs text-ink-muted">
          Your Google Apps Script Web App URL stores all patient bookings directly into your Google Sheet and sends automated confirmation &amp; status emails to patients.
        </p>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-ink">
            Google Apps Script Web App URL (/exec)
          </label>
          <input
            type="url"
            name="google_sheets_script_url"
            value={formData.google_sheets_script_url || ''}
            onChange={handleChange}
            placeholder="https://script.google.com/macros/s/.../exec"
            className="w-full px-3.5 py-2.5 bg-canvas border border-border rounded-xl text-sm text-ink focus:outline-none font-mono text-xs"
          />
          <span className="block text-[11px] text-ink-muted mt-1">
            Ensure this Web App is deployed with: <strong>Execute as: Me</strong> and <strong>Who has access: Anyone</strong>.
          </span>
        </div>
      </div>

      <div className="sticky bottom-4 z-20 flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center space-x-2 bg-ink hover:bg-black text-white px-8 py-4 rounded-pill font-semibold text-sm shadow-card transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving Changes...' : 'Save All Settings'}</span>
        </button>
      </div>
    </form>
  );
}
