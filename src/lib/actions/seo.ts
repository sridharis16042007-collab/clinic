'use server';

import { createClient } from '@/lib/supabase/server';
import { SeoPage } from '@/types/clinic';
import { revalidatePath } from 'next/cache';

export async function updateSeoPage(id: string, updates: Partial<SeoPage>) {
  const supabase = createClient();
  if (!supabase) return { success: true, message: 'SEO updated (mock)' };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('seo_pages') as any)
    .update(updates)
    .eq('id', id);

  if (error) return { success: false, error: error.message };

  revalidatePath('/', 'layout');
  revalidatePath('/admin/seo');
  return { success: true };
}
