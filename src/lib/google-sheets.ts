/**
 * Integration helper for Google Sheets & Apps Script Webhook
 * - Stores appointment submissions directly in Google Sheets
 * - Triggers Customer Success Confirmation Emails on submission
 * - Triggers Status Update Emails when admin modifies appointment status
 * - Fetches live appointments directly from Google Sheets (via CSV export or Apps Script API)
 */

import { Appointment } from '@/types/clinic';

const DEFAULT_SCRIPT_URL =
  process.env.GOOGLE_SHEETS_SCRIPT_URL ||
  'https://script.google.com/macros/s/AKfycbxeyk1TkwwQc4nfCJCZ84Gr3ldpN5w8YISrioBtaf2s6JKbCZ8pkxwbjEGZKCThrYbVpA/exec';

// Spreadsheet ID for versionclinic:
export const SPREADSHEET_ID = '13hZQKf5iGbFuJ1a-U334cYLL9CP3s4quC342-9n66kQ';
export const SPREADSHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=0`;

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

/**
 * Fast & robust CSV parser for Google Sheets export
 */
function parseCSV(csvText: string): string[][] {
  const lines: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let insideQuote = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (insideQuote && nextChar === '"') {
        currentField += '"';
        i++; // skip escaped quote
      } else {
        insideQuote = !insideQuote;
      }
    } else if (char === ',' && !insideQuote) {
      currentRow.push(currentField.trim());
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !insideQuote) {
      if (char === '\r' && nextChar === '\n') i++;
      currentRow.push(currentField.trim());
      if (currentRow.some((f) => f.length > 0)) {
        lines.push(currentRow);
      }
      currentRow = [];
      currentField = '';
    } else {
      currentField += char;
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some((f) => f.length > 0)) {
      lines.push(currentRow);
    }
  }

  return lines;
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
    // Crucial: Format phone with leading single quote so Google Sheets NEVER treats it as a formula (#ERROR!)
    let phoneToSend = payload.phone ? String(payload.phone).trim() : '';
    if (phoneToSend.startsWith('+') && !phoneToSend.startsWith("'")) {
      phoneToSend = "'" + phoneToSend;
    }

    const postBody = JSON.stringify({
      ...payload,
      phone: phoneToSend,
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
 * Fetch all live appointments from Google Sheets
 * 1. Primary path: Direct Google Sheets CSV Export (Instant, real-time, no Apps Script delays)
 * 2. Secondary path: Google Apps Script Web App (doGet / get_appointments)
 */
export async function fetchAppointmentsFromGoogleSheets(
  scriptUrlOverride?: string | null
): Promise<Appointment[]> {
  // --- Strategy 1: Direct Google Sheet CSV Export ---
  try {
    const csvRes = await fetch(SPREADSHEET_CSV_URL, {
      method: 'GET',
      cache: 'no-store',
    });

    if (csvRes.ok) {
      const csvText = await csvRes.text();
      if (csvText && csvText.includes('Appointment ID')) {
        const rows = parseCSV(csvText);
        const parsedAppointments: Appointment[] = [];

        // Row 0 is header: Timestamp, Appointment ID, Patient Name, Email Address, Mobile Phone, Treatment, Preferred Date, Preferred Time, Status, Patient Notes, Internal Notes
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          if (!row[1] && !row[2]) continue;

          const rawPhone = String(row[4] || '').replace(/^'/, '').trim();

          parsedAppointments.push({
            id: String(row[1] || `app-${i}`),
            patient_name: String(row[2] || 'Patient'),
            email: String(row[3] || ''),
            phone: rawPhone,
            treatment_id: null,
            treatment_name: String(row[5] || 'General Consultation'),
            preferred_date: String(row[6] || ''),
            preferred_time: String(row[7] || ''),
            status: (String(row[8] || 'new').toLowerCase().trim()) as Appointment['status'],
            patient_notes: String(row[9] || ''),
            internal_notes: String(row[10] || ''),
            source: 'website',
            created_at: String(row[0] || new Date().toISOString()),
            updated_at: new Date().toISOString(),
          });
        }

        if (parsedAppointments.length > 0) {
          // Newest first
          return parsedAppointments.reverse();
        }
      }
    }
  } catch (csvErr) {
    console.warn('[Google Sheets CSV Warning] Could not fetch directly from CSV export:', csvErr);
  }

  // --- Strategy 2: Google Apps Script Web App ---
  const url = scriptUrlOverride || DEFAULT_SCRIPT_URL;
  if (!url) return [];

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });

    if (response.ok) {
      const text = await response.text();
      try {
        const json = JSON.parse(text);
        if (json && Array.isArray(json.appointments) && json.appointments.length > 0) {
          return json.appointments as Appointment[];
        }
      } catch {
        // ignore parse error
      }
    }

    // Try POST action 'get_appointments'
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
        if (json && Array.isArray(json.appointments) && json.appointments.length > 0) {
          return json.appointments as Appointment[];
        }
      } catch {
        // ignore parse error
      }
    }
  } catch (err) {
    console.warn('[Google Sheets Fetch Warning] Could not fetch appointments live:', err);
  }

  return [];
}
