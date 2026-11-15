export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: {
          id: string;
          email: string;
          role: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          role?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: string;
          created_at?: string;
        };
      };
      site_settings: {
        Row: {
          id: string;
          clinic_name: string;
          clinic_type: string;
          tagline: string | null;
          tagline_ta: string | null;
          phone: string;
          whatsapp_number: string;
          emergency_phone: string | null;
          email: string | null;
          address_line1: string;
          address_line2: string | null;
          city: string;
          district: string;
          state: string;
          postal_code: string;
          google_maps_embed_url: string | null;
          google_maps_directions_url: string | null;
          google_review_url: string | null;
          accent_color: string;
          logo_url: string | null;
          is_emergency_open: boolean;
          holiday_notice_enabled: boolean;
          holiday_notice_text: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          clinic_name: string;
          clinic_type?: string;
          tagline?: string | null;
          tagline_ta?: string | null;
          phone: string;
          whatsapp_number: string;
          emergency_phone?: string | null;
          email?: string | null;
          address_line1: string;
          address_line2?: string | null;
          city?: string;
          district?: string;
          state?: string;
          postal_code?: string;
          google_maps_embed_url?: string | null;
          google_maps_directions_url?: string | null;
          google_review_url?: string | null;
          accent_color?: string;
          logo_url?: string | null;
          is_emergency_open?: boolean;
          holiday_notice_enabled?: boolean;
          holiday_notice_text?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          clinic_name?: string;
          clinic_type?: string;
          tagline?: string | null;
          tagline_ta?: string | null;
          phone?: string;
          whatsapp_number?: string;
          emergency_phone?: string | null;
          email?: string | null;
          address_line1?: string;
          address_line2?: string | null;
          city?: string;
          district?: string;
          state?: string;
          postal_code?: string;
          google_maps_embed_url?: string | null;
          google_maps_directions_url?: string | null;
          google_review_url?: string | null;
          accent_color?: string;
          logo_url?: string | null;
          is_emergency_open?: boolean;
          holiday_notice_enabled?: boolean;
          holiday_notice_text?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      opening_hours: {
        Row: {
          id: string;
          day_of_week: number;
          day_name: string;
          day_name_ta: string | null;
          open_time: string | null;
          close_time: string | null;
          break_time: string | null;
          is_closed: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          day_of_week: number;
          day_name: string;
          day_name_ta?: string | null;
          open_time?: string | null;
          close_time?: string | null;
          break_time?: string | null;
          is_closed?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          day_of_week?: number;
          day_name?: string;
          day_name_ta?: string | null;
          open_time?: string | null;
          close_time?: string | null;
          break_time?: string | null;
          is_closed?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      services: {
        Row: {
          id: string;
          slug: string;
          title: string;
          title_ta: string | null;
          short_description: string;
          short_description_ta: string | null;
          full_description: string | null;
          starting_price: number | null;
          duration_minutes: number | null;
          image_url: string | null;
          icon_name: string | null;
          badge: string | null;
          display_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          title_ta?: string | null;
          short_description: string;
          short_description_ta?: string | null;
          full_description?: string | null;
          starting_price?: number | null;
          duration_minutes?: number | null;
          image_url?: string | null;
          icon_name?: string | null;
          badge?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          title_ta?: string | null;
          short_description?: string;
          short_description_ta?: string | null;
          full_description?: string | null;
          starting_price?: number | null;
          duration_minutes?: number | null;
          image_url?: string | null;
          icon_name?: string | null;
          badge?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      doctors: {
        Row: {
          id: string;
          name: string;
          name_ta: string | null;
          qualifications: string;
          registration_number: string;
          designation: string;
          designation_ta: string | null;
          experience_years: number;
          languages_spoken: string[];
          bio: string;
          bio_ta: string | null;
          photo_url: string | null;
          consultation_fee: number | null;
          availability_days: string | null;
          display_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          name_ta?: string | null;
          qualifications: string;
          registration_number: string;
          designation: string;
          designation_ta?: string | null;
          experience_years?: number;
          languages_spoken?: string[];
          bio: string;
          bio_ta?: string | null;
          photo_url?: string | null;
          consultation_fee?: number | null;
          availability_days?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          name_ta?: string | null;
          qualifications?: string;
          registration_number?: string;
          designation?: string;
          designation_ta?: string | null;
          experience_years?: number;
          languages_spoken?: string[];
          bio?: string;
          bio_ta?: string | null;
          photo_url?: string | null;
          consultation_fee?: number | null;
          availability_days?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      gallery_images: {
        Row: {
          id: string;
          title: string;
          caption: string | null;
          image_url: string;
          category: string;
          is_before_after: boolean;
          before_image_url: string | null;
          display_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          caption?: string | null;
          image_url: string;
          category?: string;
          is_before_after?: boolean;
          before_image_url?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          caption?: string | null;
          image_url?: string;
          category?: string;
          is_before_after?: boolean;
          before_image_url?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      testimonials: {
        Row: {
          id: string;
          patient_name: string;
          treatment: string;
          feedback: string;
          feedback_ta: string | null;
          rating: number;
          visit_month_year: string | null;
          has_patient_consent: boolean;
          is_active: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          patient_name: string;
          treatment: string;
          feedback: string;
          feedback_ta?: string | null;
          rating?: number;
          visit_month_year?: string | null;
          has_patient_consent?: boolean;
          is_active?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          patient_name?: string;
          treatment?: string;
          feedback?: string;
          feedback_ta?: string | null;
          rating?: number;
          visit_month_year?: string | null;
          has_patient_consent?: boolean;
          is_active?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      appointments: {
        Row: {
          id: string;
          patient_name: string;
          phone: string;
          treatment_id: string | null;
          treatment_name: string | null;
          preferred_date: string;
          preferred_time: string;
          patient_notes: string | null;
          internal_notes: string | null;
          status: 'new' | 'confirmed' | 'completed' | 'cancelled';
          source: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          patient_name: string;
          phone: string;
          treatment_id?: string | null;
          treatment_name?: string | null;
          preferred_date: string;
          preferred_time: string;
          patient_notes?: string | null;
          internal_notes?: string | null;
          status?: 'new' | 'confirmed' | 'completed' | 'cancelled';
          source?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          patient_name?: string;
          phone?: string;
          treatment_id?: string | null;
          treatment_name?: string | null;
          preferred_date?: string;
          preferred_time?: string;
          patient_notes?: string | null;
          internal_notes?: string | null;
          status?: 'new' | 'confirmed' | 'completed' | 'cancelled';
          source?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      seo_pages: {
        Row: {
          id: string;
          page_key: string;
          meta_title: string;
          meta_description: string;
          og_title: string | null;
          og_description: string | null;
          og_image_url: string | null;
          canonical_url: string | null;
          json_ld_schema: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          page_key: string;
          meta_title: string;
          meta_description: string;
          og_title?: string | null;
          og_description?: string | null;
          og_image_url?: string | null;
          canonical_url?: string | null;
          json_ld_schema?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          page_key?: string;
          meta_title?: string;
          meta_description?: string;
          og_title?: string | null;
          og_description?: string | null;
          og_image_url?: string | null;
          canonical_url?: string | null;
          json_ld_schema?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
