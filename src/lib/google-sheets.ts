/**
 * Integration helper for Google Sheets & Apps Script Webhook
 * - Stores appointment submissions directly in Google Sheets
 * - Triggers Customer Success Confirmation Emails on submission
 * - Triggers Status Update Emails when admin modifies appointment status
 * - Fetches live appointments directly from Google Sheets for Admin Dashboard
 */

import { Appointment } from '@/types/clinic';

const DEFAULT_SCRIPT_URL =
  process.env.GOOGLE_SHEETS_SCRIPT_URL ||
  'https://script.google.com/macros/s/AKfycbxeyk1TkwwQc4nfCJCZ84Gr3ldpN5w8YISrioBtaf2s6JKbCZ8pkxwbjEGZKCThrYbVpA/exec';

export interface GoogleSheetsAppointmentPayload {
  action: 'create_appointment' | 'update_status' | 'get_appointments';
  appointment_id?: string;
  patient_name?: string;
  email?: string;
  phone?: string;
  treatment_name?: string | null;
  preferred_date?: string;
  preferred_time?: string;
  patient_notes?: string | null;
  internal_notes?: string | null;
  status?: string;
  clinic_name?: string;
  clinic_phone?: string;
}

export async function sendToGoogleAppsScript(
  payload: GoogleSheetsAppointmentPayload,
  scriptUrlOverride?: string | null
): Promise<{ success: boolean; data?: unknown; error?: string }> {
  const url = scriptUrlOverride || DEFAULT_SCRIPT_URL;

  if (!url) {
    return { success: false, error: 'Google Apps Script URL is not configured' };
  }

  try {
    const postBody = JSON.stringify({
      ...payload,
      clinic_name: payload.clinic_name || 'Vriksham Dental Care',
      clinic_phone: payload.clinic_phone || '+91 94432 78120',
      timestamp: new Date().toISOString(),
    });

    // Send as text/plain so Google Apps Script parses postData.contents reliably
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: postBody,
      redirect: 'follow',
    });

    const responseText = await response.text();

    if (
      response.status === 401 ||
      responseText.includes('accounts.google.com') ||
      responseText.includes('Sign in - Google Accounts')
    ) {
      console.warn(
        '[Google Sheets Webhook Warning] Google blocked this request with 401/Login redirect.'
      );
      return {
        success: false,
        error:
          'Google Web App requires public permissions (Who has access: Anyone).',
      };
    }

    let jsonResult;
    try {
      jsonResult = JSON.parse(responseText);
    } catch {
      jsonResult = { raw: responseText };
    }

    if (!response.ok) {
      return {
        success: false,
        error: `Google Apps Script returned HTTP ${response.status}`,
        data: jsonResult,
      };
    }

    return { success: true, data: jsonResult };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Error dispatching to Google Apps Script:', message);
    return { success: false, error: message };
  }
}

/**
 * Fetch all live appointments from Google Sheets via Apps Script Web App
 */
export async function fetchAppointmentsFromGoogleSheets(
  scriptUrlOverride?: string | null
): Promise<Appointment[]> {
  const url = scriptUrlOverride || DEFAULT_SCRIPT_URL;
  if (!url) return [];

  try {
    // 1. Try GET request to Web App
    const response = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });

    if (response.ok) {
      const text = await response.text();
      try {
        const json = JSON.parse(text);
        if (json && Array.isArray(json.appointments)) {
          return json.appointments as Appointment[];
        }
      } catch {
        // ignore parse error
      }
    }

    // 2. Fallback: try POST with action 'get_appointments'
    const postRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'get_appointments' }),
      cache: 'no-store',
    });

    if (postRes.ok) {
      const text = await postRes.text();
      try {
        const json = JSON.parse(text);
        if (json && Array.isArray(json.appointments)) {
          return json.appointments as Appointment[];
        }
      } catch {
        // ignore parse error
      }
    }

    return [];
  } catch (err) {
    console.warn('[Google Sheets Fetch Warning] Could not fetch appointments live:', err);
    return [];
  }
}
