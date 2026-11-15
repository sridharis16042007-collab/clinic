import { NextRequest, NextResponse } from 'next/server';
import { appointmentSchema } from '@/lib/validations/appointment';
import { createClient } from '@/lib/supabase/server';
import { checkRateLimit } from '@/lib/utils/rate-limiter';
import { sendToGoogleAppsScript } from '@/lib/google-sheets';
import { getSiteSettings } from '@/lib/data';

export async function POST(request: NextRequest) {
  try {
    // 1. IP Rate Limiting
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';
    const rateCheck = checkRateLimit(ip);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error:
            'Too many appointment requests from this connection. Please call our clinic directly or try again later.',
        },
        { status: 429 }
      );
    }

    // 2. Parse & Validate body
    const body = await request.json();
    const validationResult = appointmentSchema.safeParse(body);

    if (!validationResult.success) {
      const firstIssue = validationResult.error.issues[0]?.message;
      return NextResponse.json(
        { error: firstIssue || 'Invalid booking details provided.' },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // 3. Honeypot check
    if (data.honeypot && data.honeypot.length > 0) {
      return NextResponse.json({ success: true, message: 'Request received' });
    }

    const appointmentId = `app-${Date.now()}`;
    const settings = await getSiteSettings();

    // 4. Send directly to Google Sheets database & trigger Customer Success Email
    const googleSheetResult = await sendToGoogleAppsScript(
      {
        action: 'create_appointment',
        appointment_id: appointmentId,
        patient_name: data.patient_name,
        email: data.email,
        phone: data.phone,
        treatment_name: data.treatment_name || 'General Consultation',
        preferred_date: data.preferred_date,
        preferred_time: data.preferred_time,
        patient_notes: data.patient_notes || null,
        status: 'new',
        clinic_name: settings.clinic_name,
        clinic_phone: settings.phone,
      },
      settings.google_sheets_script_url
    );

    // 5. Also insert into Supabase if connected
    const supabase = createClient();
    if (supabase) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from('appointments') as any).insert({
        id: appointmentId,
        patient_name: data.patient_name,
        email: data.email,
        phone: data.phone,
        treatment_id: data.treatment_id || null,
        treatment_name: data.treatment_name || 'General Consultation',
        preferred_date: data.preferred_date,
        preferred_time: data.preferred_time,
        patient_notes: data.patient_notes || null,
        status: 'new',
        source: 'website',
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Appointment request registered successfully. Confirmation email dispatched.',
      googleSheetsSynced: googleSheetResult.success,
      appointmentId,
    });
  } catch (err) {
    console.error('Appointment API error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please contact the clinic by phone.' },
      { status: 500 }
    );
  }
}
