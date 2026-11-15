'use server';

import { createClient } from '@/lib/supabase/server';
import { AppointmentStatus, Appointment } from '@/types/clinic';
import { revalidatePath } from 'next/cache';
import { sendToGoogleAppsScript } from '@/lib/google-sheets';
import { getSiteSettings } from '@/lib/data';

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus,
  appointmentDetails?: Partial<Appointment>
) {
  const settings = await getSiteSettings();

  // 1. Sync to Google Sheets & Trigger Status Notification Email
  if (appointmentDetails && appointmentDetails.email) {
    await sendToGoogleAppsScript(
      {
        action: 'update_status',
        appointment_id: id,
        patient_name: appointmentDetails.patient_name || 'Patient',
        email: appointmentDetails.email,
        phone: appointmentDetails.phone || '',
        treatment_name: appointmentDetails.treatment_name || 'Consultation',
        preferred_date: appointmentDetails.preferred_date || '',
        preferred_time: appointmentDetails.preferred_time || '',
        status,
        internal_notes: appointmentDetails.internal_notes || null,
        clinic_name: settings.clinic_name,
        clinic_phone: settings.phone,
      },
      settings.google_sheets_script_url
    );
  }

  // 2. Update Supabase if available or fallback
  const supabase = createClient();
  if (supabase) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('appointments') as any)
      .update({ status })
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }
  } else {
    const { updateLocalAppointmentStatus } = await import('@/lib/appointments-store');
    updateLocalAppointmentStatus(id, status);
  }

  revalidatePath('/admin/appointments');
  return { success: true };
}

export async function updateAppointmentNotes(
  id: string,
  internal_notes: string,
  appointmentDetails?: Partial<Appointment>
) {
  const settings = await getSiteSettings();

  if (appointmentDetails && appointmentDetails.email) {
    await sendToGoogleAppsScript(
      {
        action: 'update_status',
        appointment_id: id,
        patient_name: appointmentDetails.patient_name || 'Patient',
        email: appointmentDetails.email,
        phone: appointmentDetails.phone || '',
        treatment_name: appointmentDetails.treatment_name || 'Consultation',
        preferred_date: appointmentDetails.preferred_date || '',
        preferred_time: appointmentDetails.preferred_time || '',
        status: appointmentDetails.status || 'new',
        internal_notes,
        clinic_name: settings.clinic_name,
        clinic_phone: settings.phone,
      },
      settings.google_sheets_script_url
    );
  }

  const supabase = createClient();
  if (supabase) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('appointments') as any)
      .update({ internal_notes })
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }
  } else {
    const { updateLocalAppointmentNotes } = await import('@/lib/appointments-store');
    updateLocalAppointmentNotes(id, internal_notes);
  }

  revalidatePath('/admin/appointments');
  return { success: true };
}

export async function deleteAppointment(id: string) {
  const supabase = createClient();
  if (supabase) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('appointments') as any)
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }
  } else {
    const { deleteLocalAppointment } = await import('@/lib/appointments-store');
    deleteLocalAppointment(id);
  }

  revalidatePath('/admin/appointments');
  return { success: true };
}
