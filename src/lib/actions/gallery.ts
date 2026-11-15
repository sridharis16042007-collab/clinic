'use server';

import { createClient } from '@/lib/supabase/server';
import { GalleryImage } from '@/types/clinic';
import { revalidatePath } from 'next/cache';

export async function addGalleryImage(
  imageData: Omit<GalleryImage, 'id' | 'created_at' | 'updated_at'>
) {
  const supabase = createClient();
  if (!supabase) return { success: true, message: 'Image added (mock)' };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('gallery_images') as any).insert(imageData);
  if (error) return { success: false, error: error.message };

  revalidatePath('/gallery');
  revalidatePath('/admin/gallery');
  return { success: true };
}

export async function updateGalleryImage(
  id: string,
  updates: Partial<GalleryImage>
) {
  const supabase = createClient();
  if (!supabase) return { success: true, message: 'Image updated (mock)' };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('gallery_images') as any)
    .update(updates)
    .eq('id', id);
  if (error) return { success: false, error: error.message };

  revalidatePath('/gallery');
  revalidatePath('/admin/gallery');
  return { success: true };
}

export async function deleteGalleryImage(id: string) {
  const supabase = createClient();
  if (!supabase) return { success: true, message: 'Image deleted (mock)' };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('gallery_images') as any)
    .delete()
    .eq('id', id);
  if (error) return { success: false, error: error.message };

  revalidatePath('/gallery');
  revalidatePath('/admin/gallery');
  return { success: true };
}
