import { createClient } from './supabase/server';
import {
  fallbackSettings,
  fallbackHours,
  fallbackServices,
  fallbackDoctors,
  fallbackGallery,
  fallbackTestimonials,
} from './supabase/mock-data';
import {
  SiteSettings,
  OpeningHours,
  Service,
  Doctor,
  GalleryImage,
  Testimonial,
} from '@/types/clinic';

/**
 * Fetch clinic site settings
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = createClient();
  if (!supabase) return fallbackSettings;

  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1)
      .single();

    if (error || !data) {
      return fallbackSettings;
    }
    return data as SiteSettings;
  } catch {
    return fallbackSettings;
  }
}

/**
 * Fetch opening hours
 */
export async function getOpeningHours(): Promise<OpeningHours[]> {
  const supabase = createClient();
  if (!supabase) return fallbackHours;

  try {
    const { data, error } = await supabase
      .from('opening_hours')
      .select('*')
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return fallbackHours;
    }
    return data as OpeningHours[];
  } catch {
    return fallbackHours;
  }
}

/**
 * Fetch active services
 */
export async function getActiveServices(): Promise<Service[]> {
  const supabase = createClient();
  if (!supabase) return fallbackServices;

  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return fallbackServices;
    }
    return data as Service[];
  } catch {
    return fallbackServices;
  }
}

/**
 * Fetch active doctors
 */
export async function getActiveDoctors(): Promise<Doctor[]> {
  const supabase = createClient();
  if (!supabase) return fallbackDoctors;

  try {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return fallbackDoctors;
    }
    return data as Doctor[];
  } catch {
    return fallbackDoctors;
  }
}

/**
 * Fetch active gallery images
 */
export async function getActiveGallery(): Promise<GalleryImage[]> {
  const supabase = createClient();
  if (!supabase) return fallbackGallery;

  try {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return fallbackGallery;
    }
    return data as GalleryImage[];
  } catch {
    return fallbackGallery;
  }
}

/**
 * Fetch active testimonials
 */
export async function getActiveTestimonials(): Promise<Testimonial[]> {
  const supabase = createClient();
  if (!supabase) return fallbackTestimonials;

  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return fallbackTestimonials;
    }
    return data as Testimonial[];
  } catch {
    return fallbackTestimonials;
  }
}
