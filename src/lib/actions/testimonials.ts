'use server';

import { createClient } from '@/lib/supabase/server';
import { Testimonial } from '@/types/clinic';
import { revalidatePath } from 'next/cache';

export async function addTestimonial(
  data: Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>
) {
  const supabase = createClient();
  if (!supabase) return { success: true, message: 'Testimonial added (mock)' };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('testimonials') as any).insert(data);
  if (error) return { success: false, error: error.message };

  revalidatePath('/');
  revalidatePath('/admin/testimonials');
  return { success: true };
}

export async function updateTestimonial(
  id: string,
  updates: Partial<Testimonial>
) {
  const supabase = createClient();
  if (!supabase) return { success: true, message: 'Testimonial updated (mock)' };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('testimonials') as any)
    .update(updates)
    .eq('id', id);
  if (error) return { success: false, error: error.message };

  revalidatePath('/');
  revalidatePath('/admin/testimonials');
  return { success: true };
}

export async function deleteTestimonial(id: string) {
  const supabase = createClient();
  if (!supabase) return { success: true, message: 'Testimonial deleted (mock)' };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('testimonials') as any)
    .delete()
    .eq('id', id);
  if (error) return { success: false, error: error.message };

  revalidatePath('/');
  revalidatePath('/admin/testimonials');
  return { success: true };
}
