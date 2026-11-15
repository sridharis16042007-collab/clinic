import { Database } from './database';

export type SiteSettings = Database['public']['Tables']['site_settings']['Row'];
export type OpeningHours = Database['public']['Tables']['opening_hours']['Row'];
export type Service = Database['public']['Tables']['services']['Row'];
export type Doctor = Database['public']['Tables']['doctors']['Row'];
export type GalleryImage = Database['public']['Tables']['gallery_images']['Row'];
export type Testimonial = Database['public']['Tables']['testimonials']['Row'];
export type Appointment = Database['public']['Tables']['appointments']['Row'];
export type SeoPage = Database['public']['Tables']['seo_pages']['Row'];

export type AppointmentStatus = 'new' | 'confirmed' | 'completed' | 'cancelled';

export interface BookingFormData {
  patient_name: string;
  phone: string;
  treatment_id?: string;
  treatment_name?: string;
  preferred_date: string;
  preferred_time: string;
  patient_notes?: string;
  consent: boolean;
  honeypot?: string;
}

export type SupportedLanguage = 'en' | 'ta';
