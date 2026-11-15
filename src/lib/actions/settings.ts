'use server';

import { createClient } from '@/lib/supabase/server';
import { SiteSettings } from '@/types/clinic';
import { revalidatePath } from 'next/cache';

export async function updateSiteSettings(
  id: string,
  updates: Partial<SiteSettings>
) {
  const supabase = createClient();
  if (!supabase) {
    return { success: true, message: 'Settings saved (mock)' };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('site_settings') as any)
    .update(updates)
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  // Instant revalidation of all public pages
  revalidatePath('/', 'layout');
  revalidatePath('/admin/settings');
  return { success: true };
}
