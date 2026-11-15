import { z } from 'zod';

// Indian mobile number validation regex: 10 digits starting with 6, 7, 8, or 9
const indianPhoneRegex = /^(?:(?:\+|0{0,2})91(\s*[-]\s*)?|[0]?)?[6789]\d{9}$/;

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
    .refine((val) => indianPhoneRegex.test(val.replace(/\s+/g, '')), {
      message: 'Please enter a valid 10-digit Indian mobile number',
    }),
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
