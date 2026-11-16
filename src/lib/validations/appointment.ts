import { z } from 'zod';

/**
 * Normalizes Indian phone numbers into clean '+91 XXXXX XXXXX' format.
 * Accepts:
 * - 10 digits: '9443278120' -> '+91 94432 78120'
 * - With +91: '+919443278120', '+91 94432 78120' -> '+91 94432 78120'
 * - With 0: '09443278120' -> '+91 94432 78120'
 */
export function normalizeIndianPhone(input: string): string {
  if (!input) return '';
  const digits = input.replace(/\D/g, '');
  let tenDigits = '';

  if (digits.length === 10) {
    tenDigits = digits;
  } else if (digits.length > 10 && digits.startsWith('91')) {
    tenDigits = digits.slice(-10);
  } else if (digits.length === 11 && digits.startsWith('0')) {
    tenDigits = digits.slice(1);
  } else {
    tenDigits = digits.slice(-10);
  }

  if (tenDigits.length === 10) {
    return `+91 ${tenDigits.slice(0, 5)} ${tenDigits.slice(5)}`;
  }
  return input.trim();
}

// Indian mobile regex: must have 10 digits starting with 6, 7, 8, or 9
export function isValidIndianMobile(val: string): boolean {
  if (!val) return false;
  const digits = val.replace(/\D/g, '');
  let mobile10 = '';
  if (digits.length === 10) {
    mobile10 = digits;
  } else if (digits.length > 10 && digits.startsWith('91')) {
    mobile10 = digits.slice(-10);
  } else if (digits.length === 11 && digits.startsWith('0')) {
    mobile10 = digits.slice(1);
  }
  return /^[6789]\d{9}$/.test(mobile10);
}

export const appointmentSchema = z.object({
  patient_name: z
    .string()
    .min(2, { message: 'Please enter patient name (minimum 2 characters)' })
    .max(80, { message: 'Name cannot exceed 80 characters' })
    .trim(),
  email: z
    .string()
    .email({ message: 'Please enter a valid email address for confirmation & updates' })
    .trim()
    .toLowerCase(),
  phone: z
    .string()
    .trim()
    .refine((val) => isValidIndianMobile(val), {
      message: 'Please enter a valid 10-digit Indian mobile number (e.g. +91 94432 78120 or 9443278120)',
    })
    .transform((val) => normalizeIndianPhone(val)),
  treatment_id: z.string().optional().nullable(),
  treatment_name: z.string().optional().nullable(),
  preferred_date: z
    .string()
    .min(1, { message: 'Please select a preferred date' }),
  preferred_time: z
    .string()
    .min(1, { message: 'Please select a preferred time slot' }),
  patient_notes: z
    .string()
    .max(500, { message: 'Notes must be within 500 characters' })
    .optional()
    .or(z.literal('')),
  consent: z.literal(true, {
    errorMap: () => ({
      message: 'Please confirm consent to be contacted for appointment confirmation',
    }),
  }),
  honeypot: z.string().max(0, { message: 'Bot submission detected' }).optional(),
});

export type AppointmentFormInput = z.infer<typeof appointmentSchema>;
