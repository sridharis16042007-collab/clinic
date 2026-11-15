import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import { createClient } from './server';

export function getAdminServiceRoleClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return null;
  }

  return createSupabaseClient<Database>(supabaseUrl, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * Validates if an email is in the admin allowlist
 */
export function isEmailInAllowlist(email: string | null | undefined): boolean {
  if (!email) return false;
  
  const envAllowlist = (process.env.ADMIN_ALLOWED_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  // If no env is set, default to demo admin
  if (envAllowlist.length === 0) {
    return email.toLowerCase() === 'admin@vrikshamclinic.in';
  }

  return envAllowlist.includes(email.toLowerCase());
}

/**
 * Checks if current request is authenticated by an authorized admin user
 */
export async function getAuthenticatedAdmin() {
  const client = createClient();
  if (!client) {
    // Development fallback mock mode if supabase keys are missing
    return {
      user: {
        id: 'mock-admin-id',
        email: 'admin@vrikshamclinic.in',
      },
      isAdmin: true,
      isMock: true,
    };
  }

  const {
    data: { user },
    error,
  } = await client.auth.getUser();

  if (error || !user) {
    return { user: null, isAdmin: false, isMock: false };
  }

  const allowed = isEmailInAllowlist(user.email);
  return { user, isAdmin: allowed, isMock: false };
}
