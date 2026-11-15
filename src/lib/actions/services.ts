'use server';

import { createClient } from '@/lib/supabase/server';
import { Service } from '@/types/clinic';
import { revalidatePath } from 'next/cache';

export async function createService(serviceData: Omit<Service, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = createClient();
  if (!supabase) return { success: true, message: 'Service added (mock)' };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('services') as any).insert(serviceData);
  if (error) return { success: false, error: error.message };

  revalidatePath('/services');
  revalidatePath('/admin/services');
  return { success: true };
}

export async function updateService(id: string, updates: Partial<Service>) {
  const supabase = createClient();
  if (!supabase) return { success: true, message: 'Service updated (mock)' };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('services') as any).update(updates).eq('id', id);
  if (error) return { success: false, error: error.message };

  revalidatePath('/services');
  revalidatePath('/admin/services');
  return { success: true };
}

export async function deleteService(id: string) {
  const supabase = createClient();
  if (!supabase) return { success: true, message: 'Service deleted (mock)' };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('services') as any).delete().eq('id', id);
  if (error) return { success: false, error: error.message };

  revalidatePath('/services');
  revalidatePath('/admin/services');
  return { success: true };
}
