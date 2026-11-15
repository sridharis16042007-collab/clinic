'use server';

import { createClient } from '@/lib/supabase/server';
import { Doctor } from '@/types/clinic';
import { revalidatePath } from 'next/cache';

export async function createDoctor(doctorData: Omit<Doctor, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = createClient();
  if (!supabase) return { success: true, message: 'Doctor added (mock)' };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('doctors') as any).insert(doctorData);
  if (error) return { success: false, error: error.message };

  revalidatePath('/doctors');
  revalidatePath('/admin/doctors');
  return { success: true };
}

export async function updateDoctor(id: string, updates: Partial<Doctor>) {
  const supabase = createClient();
  if (!supabase) return { success: true, message: 'Doctor updated (mock)' };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('doctors') as any).update(updates).eq('id', id);
  if (error) return { success: false, error: error.message };

  revalidatePath('/doctors');
  revalidatePath('/admin/doctors');
  return { success: true };
}

export async function deleteDoctor(id: string) {
  const supabase = createClient();
  if (!supabase) return { success: true, message: 'Doctor deleted (mock)' };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('doctors') as any).delete().eq('id', id);
  if (error) return { success: false, error: error.message };

  revalidatePath('/doctors');
  revalidatePath('/admin/doctors');
  return { success: true };
}
