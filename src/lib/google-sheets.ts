/**
 * Integration helper for Google Sheets & Apps Script Webhook
 * - Stores appointment submissions directly in Google Sheets
 * - Triggers Customer Success Confirmation Emails on submission
 * - Triggers Status Update Emails when admin modifies appointment status
 */

const DEFAULT_SCRIPT_URL =
  process.env.GOOGLE_SHEETS_SCRIPT_URL ||
  'https://script.google.com/macros/s/AKfycbwkueZoSnwV1VQUJ5tUzfk_3rV_URDmbdfJKBTu6U8W6gsdwsxupEQNqa3MNs2lBSjO6Q/exec';

export interface GoogleSheetsAppointmentPayload {
  action: 'create_appointment' | 'update_status';
  appointment_id?: string;
  patient_name: string;
  email: string;
  phone: string;
  treatment_name?: string | null;
  preferred_date: string;
  preferred_time: string;
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

    // Check if Google redirected to a sign-in screen (401 or accounts.google.com)
    if (
      response.status === 401 ||
      responseText.includes('accounts.google.com') ||
      responseText.includes('Sign in - Google Accounts')
    ) {
      console.warn(
        '[Google Sheets Webhook Warning] Google blocked this request with 401/Login redirect. In Apps Script, set "Who has access" to "Anyone" and redeploy.'
      );
      return {
        success: false,
        error:
          'Google Web App requires public permissions. In Apps Script, click Deploy -> New deployment -> Who has access: Anyone.',
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
