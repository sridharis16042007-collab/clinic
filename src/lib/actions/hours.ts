'use server';

import { createClient } from '@/lib/supabase/server';
import { OpeningHours } from '@/types/clinic';
import { revalidatePath } from 'next/cache';

export async function updateDaySchedule(
  id: string,
  updates: Partial<OpeningHours>
) {
  const supabase = createClient();
  if (!supabase) {
    return { success: true, message: 'Schedule updated (mock)' };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('opening_hours') as any)
    .update(updates)
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/', 'layout');
  revalidatePath('/admin/hours');
  return { success: true };
}

export async function toggleHolidayNotice(
  settingsId: string,
  enabled: boolean,
  text: string
) {
  const supabase = createClient();
  if (!supabase) {
    return { success: true, message: 'Holiday notice toggled (mock)' };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('site_settings') as any)
    .update({
      holiday_notice_enabled: enabled,
      holiday_notice_text: text,
    })
    .eq('id', settingsId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/', 'layout');
  revalidatePath('/admin/hours');
  return { success: true };
}
