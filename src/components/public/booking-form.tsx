'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { appointmentSchema, AppointmentFormInput } from '@/lib/validations/appointment';
import { Service, SiteSettings } from '@/types/clinic';
import { generateWhatsAppBookingUrl } from '@/lib/utils/formatters';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MessageSquare,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

interface BookingFormProps {
  services: Service[];
  settings: SiteSettings;
}

export function BookingForm({ services, settings }: BookingFormProps) {
  const searchParams = useSearchParams();
  const preselectedTreatmentId = searchParams.get('id') || '';
  const preselectedTreatmentName = searchParams.get('treatment') || '';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [whatsAppUrl, setWhatsAppUrl] = useState<string | null>(null);

  // Set min date to today
  const todayDateString = new Date().toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AppointmentFormInput>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patient_name: '',
      email: '',
      phone: '',
      treatment_id: preselectedTreatmentId || null,
      treatment_name: preselectedTreatmentName || '',
      preferred_date: todayDateString,
      preferred_time: 'Evening (04:30 PM – 08:00 PM)',
      patient_notes: '',
      consent: true,
      honeypot: '',
    },
  });

  const selectedTreatmentId = watch('treatment_id');

  const onTreatmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const srvId = e.target.value;
    setValue('treatment_id', srvId);
    const found = services.find((s) => s.id === srvId);
    setValue('treatment_name', found ? found.title : 'General Consultation');
  };

  const onSubmit = async (data: AppointmentFormInput) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit booking request.');
      }

      // Generate deep-link WhatsApp URL
      const waLink = generateWhatsAppBookingUrl({
        clinicPhone: settings.whatsapp_number,
        patientName: data.patient_name,
        phone: data.phone,
        treatmentName: data.treatment_name || 'General Dental Consultation',
        preferredDate: data.preferred_date,
        preferredTime: data.preferred_time,
        notes: data.patient_notes,
      });

      setWhatsAppUrl(waLink);
      setSubmitSuccess(true);

      // Automatically trigger WhatsApp redirect after slight tick
      setTimeout(() => {
        window.open(waLink, '_blank', 'noopener,noreferrer');
      }, 600);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError('Something went wrong. Please call reception directly.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="bg-surface rounded-3xl p-8 sm:p-10 border border-border shadow-card text-center space-y-6 animate-in fade-in duration-300">
        <div className="w-16 h-16 rounded-full bg-accent-light text-accent flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-accent" />
        </div>

        <div className="space-y-2">
          <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-ink">
            Appointment Request Saved!
          </h3>
          <p className="text-sm text-ink-muted max-w-md mx-auto">
            Your booking details have been registered in our clinic inbox. We are opening WhatsApp to instantly notify our reception desk.
          </p>
        </div>

        {whatsAppUrl && (
          <div className="pt-2">
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-accent hover:bg-accent-hover text-white px-7 py-3.5 rounded-pill font-semibold text-sm shadow-soft transition-all"
            >
              <span>Continue in WhatsApp</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}

        <div className="pt-4 border-t border-border text-xs text-ink-muted">
          Need immediate assistance? Call us directly at{' '}
          <strong className="text-ink">{settings.phone}</strong>.
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-surface rounded-3xl p-6 sm:p-10 border border-border shadow-soft space-y-6"
      noValidate
    >
      {/* Honeypot field for bot deterrence */}
      <input
        type="text"
        {...register('honeypot')}
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      {serverError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Patient Name */}
      <div className="space-y-2">
        <label
          htmlFor="patient_name"
          className="block text-xs uppercase tracking-wider font-semibold text-ink"
        >
          Patient Full Name <span className="text-accent">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-muted">
            <User className="w-4 h-4" />
          </div>
          <input
            id="patient_name"
            type="text"
            placeholder="e.g. S. Murugan"
            {...register('patient_name')}
            className={`w-full pl-10 pr-4 py-3 bg-canvas border rounded-xl text-sm text-ink placeholder:text-ink-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors ${errors.patient_name ? 'border-red-500' : 'border-border'
              }`}
          />
        </div>
        {errors.patient_name && (
          <p className="text-xs text-red-600">{errors.patient_name.message}</p>
        )}
      </div>

      {/* Patient Email (for Google Sheets sync & automated confirmation emails) */}
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-xs uppercase tracking-wider font-semibold text-ink"
        >
          Email Address (For booking confirmation &amp; status updates) <span className="text-accent">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-muted">
            <Mail className="w-4 h-4" />
          </div>
          <input
            id="email"
            type="email"
            placeholder="e.g. patient@example.com"
            {...register('email')}
            className={`w-full pl-10 pr-4 py-3 bg-canvas border rounded-xl text-sm text-ink placeholder:text-ink-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors ${errors.email ? 'border-red-500' : 'border-border'
              }`}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Mobile Phone Number */}
      <div className="space-y-2">
        <label
          htmlFor="phone"
          className="block text-xs uppercase tracking-wider font-semibold text-ink"
        >
          Mobile Number (WhatsApp) <span className="text-accent">*</span>
        </label>
        <div className="relative flex items-center">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ink-muted">
            <span className="text-xs font-semibold text-ink-muted/80 bg-canvas-subtle px-1.5 py-0.5 rounded border border-border flex items-center gap-1">
              <span>🇮🇳</span>
              <span>+91</span>
            </span>
          </div>
          <input
            id="phone"
            type="tel"
            placeholder="94432 78120 (or +91 94432 78120)"
            {...register('phone')}
            className={`w-full pl-20 pr-4 py-3 bg-canvas border rounded-xl text-sm text-ink placeholder:text-ink-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors ${errors.phone ? 'border-red-500' : 'border-border'
              }`}
          />
        </div>
        <p className="text-[11px] text-ink-muted">
          Accepts 10-digit Indian mobile numbers (e.g. 94432 78120 or with +91)
        </p>
        {errors.phone && (
          <p className="text-xs text-red-600">{errors.phone.message}</p>
        )}
      </div>

      {/* Treatment Selector */}
      <div className="space-y-2">
        <label
          htmlFor="treatment_id"
          className="block text-xs uppercase tracking-wider font-semibold text-ink"
        >
          Reason for Visit / Treatment
        </label>
        <select
          id="treatment_id"
          value={selectedTreatmentId || ''}
          onChange={onTreatmentChange}
          className="w-full px-4 py-3 bg-canvas border border-border rounded-xl text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
        >
          <option value="">General Dental Consultation & Examination</option>
          {services.map((srv) => (
            <option key={srv.id} value={srv.id}>
              {srv.title} {srv.starting_price ? `(From ₹${srv.starting_price})` : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Preferred Date & Time Slot Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Date */}
        <div className="space-y-2">
          <label
            htmlFor="preferred_date"
            className="block text-xs uppercase tracking-wider font-semibold text-ink"
          >
            Preferred Date <span className="text-accent">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-muted">
              <Calendar className="w-4 h-4" />
            </div>
            <input
              id="preferred_date"
              type="date"
              min={todayDateString}
              {...register('preferred_date')}
              className={`w-full pl-10 pr-4 py-3 bg-canvas border rounded-xl text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors ${errors.preferred_date ? 'border-red-500' : 'border-border'
                }`}
            />
          </div>
          {errors.preferred_date && (
            <p className="text-xs text-red-600">
              {errors.preferred_date.message}
            </p>
          )}
        </div>

        {/* Time of Day */}
        <div className="space-y-2">
          <label
            htmlFor="preferred_time"
            className="block text-xs uppercase tracking-wider font-semibold text-ink"
          >
            Preferred Time Slot <span className="text-accent">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-muted">
              <Clock className="w-4 h-4" />
            </div>
            <select
              id="preferred_time"
              {...register('preferred_time')}
              className="w-full pl-10 pr-4 py-3 bg-canvas border border-border rounded-xl text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
            >
              <option value="Morning (09:30 AM – 01:00 PM)">
                Morning (09:30 AM – 01:00 PM)
              </option>
              <option value="Evening (04:30 PM – 08:00 PM)">
                Evening (04:30 PM – 08:00 PM)
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Patient Notes */}
      <div className="space-y-2">
        <label
          htmlFor="patient_notes"
          className="block text-xs uppercase tracking-wider font-semibold text-ink"
        >
          Tooth Pain Details / Questions (Optional)
        </label>
        <div className="relative">
          <div className="absolute top-3 left-3.5 pointer-events-none text-ink-muted">
            <MessageSquare className="w-4 h-4" />
          </div>
          <textarea
            id="patient_notes"
            rows={3}
            placeholder="e.g. Pain in lower left tooth when chewing, cold sensitivity"
            {...register('patient_notes')}
            className="w-full pl-10 pr-4 py-3 bg-canvas border border-border rounded-xl text-sm text-ink placeholder:text-ink-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
          />
        </div>
      </div>

      {/* Privacy Consent Checkbox */}
      <div className="space-y-2 pt-2">
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            {...register('consent')}
            className="mt-1 h-4 w-4 rounded border-border text-accent focus:ring-accent"
          />
          <span className="text-xs text-ink-muted leading-relaxed">
            I agree to be contacted via WhatsApp/Phone for appointment scheduling. We never share patient information.{' '}
            <Link
              href="/legal/privacy"
              className="text-accent underline hover:text-accent-hover"
            >
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        {errors.consent && (
          <p className="text-xs text-red-600">{errors.consent.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full inline-flex items-center justify-center space-x-2 bg-ink hover:bg-black text-white py-4 rounded-pill font-semibold text-sm shadow-card transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
      >
        <span>
          {isSubmitting ? 'Registering Booking...' : 'Confirm & Open WhatsApp Chat'}
        </span>
        <ArrowRight className="w-4 h-4" />
      </button>

      <div className="flex items-center justify-center space-x-2 text-[11px] text-ink-muted text-center pt-1">
        <ShieldCheck className="w-3.5 h-3.5 text-accent" />
        <span>No advance payment needed • Instant confirmation</span>
      </div>
    </form>
  );
}
