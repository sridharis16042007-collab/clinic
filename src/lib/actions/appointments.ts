'use server';

import { createClient } from '@/lib/supabase/server';
import { AppointmentStatus } from '@/types/clinic';
import { revalidatePath } from 'next/cache';

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus
) {
  const supabase = createClient();
  if (!supabase) {
    return { success: true, message: 'Updated status (mock)' };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('appointments') as any)
    .update({ status })
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/appointments');
  return { success: true };
}

export async function updateAppointmentNotes(id: string, internal_notes: string) {
  const supabase = createClient();
  if (!supabase) {
    return { success: true, message: 'Updated notes (mock)' };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('appointments') as any)
    .update({ internal_notes })
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/appointments');
  return { success: true };
}

export async function deleteAppointment(id: string) {
  const supabase = createClient();
  if (!supabase) {
    return { success: true, message: 'Deleted appointment (mock)' };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('appointments') as any)
    .delete()
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/appointments');
  return { success: true };
}
