import { OpeningHours } from '@/types/clinic';

/**
 * Clean phone number for tel: links
 */
export function cleanPhoneForTel(phone: string): string {
  return phone.replace(/[^0-9+]/g, '');
}

/**
 * Format number to Indian Rupee representation (e.g. ₹18,000)
 */
export function formatINR(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return '';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Generate a prefilled WhatsApp booking message URL
 */
export function generateWhatsAppBookingUrl({
  clinicPhone,
  patientName,
  phone,
  treatmentName,
  preferredDate,
  preferredTime,
  notes,
}: {
  clinicPhone: string;
  patientName: string;
  phone: string;
  treatmentName?: string | null;
  preferredDate: string;
  preferredTime: string;
  notes?: string | null;
}): string {
  const cleanNumber = clinicPhone.replace(/[^0-9]/g, '');
  
  const textLines = [
    `*Appointment Request - Vriksham Dental Care*`,
    `--------------------------------`,
    `*Patient Name:* ${patientName}`,
    `*Contact Number:* ${phone}`,
    treatmentName ? `*Treatment / Reason:* ${treatmentName}` : null,
    `*Preferred Date:* ${preferredDate}`,
    `*Preferred Time:* ${preferredTime}`,
    notes ? `*Notes / Symptoms:* ${notes}` : null,
    `--------------------------------`,
    `_Sent via website booking form_`,
  ].filter(Boolean);

  const encodedMessage = encodeURIComponent(textLines.join('\n'));
  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
}

/**
 * Determine today's operating hours and live open/closed status in IST
 */
export function getTodayClinicStatus(openingHours: OpeningHours[] = []): {
  isOpenToday: boolean;
  isCurrentlyOpen: boolean;
  todayScheduleText: string;
  hoursBreakdown: string;
  currentDayName: string;
} {
  // Current time in Indian Standard Time (UTC+5:30)
  const now = new Date();
  const utcOffset = now.getTime() + now.getTimezoneOffset() * 60000;
  const istTime = new Date(utcOffset + 3600000 * 5.5);

  const dayOfWeek = istTime.getDay(); // 0 = Sunday, 1 = Monday...
  const todayRecord = openingHours.find((h) => h.day_of_week === dayOfWeek);

  if (!todayRecord || todayRecord.is_closed) {
    return {
      isOpenToday: false,
      isCurrentlyOpen: false,
      todayScheduleText: 'Closed Today',
      hoursBreakdown: 'Emergency appointments by phone',
      currentDayName: todayRecord?.day_name || 'Today',
    };
  }

  const hoursBreakdown = todayRecord.break_time
    ? `${todayRecord.open_time} - ${todayRecord.close_time} (Break: ${todayRecord.break_time})`
    : `${todayRecord.open_time} - ${todayRecord.close_time}`;

  // Simple heuristic for current status
  const currentHour = istTime.getHours() + istTime.getMinutes() / 60;
  const isCurrentlyOpen =
    dayOfWeek === 0
      ? currentHour >= 10 && currentHour <= 13.5 // Sunday morning
      : (currentHour >= 9.5 && currentHour <= 13.5) ||
        (currentHour >= 16.5 && currentHour <= 20.5);

  return {
    isOpenToday: true,
    isCurrentlyOpen,
    todayScheduleText: `${todayRecord.open_time} – ${todayRecord.close_time}`,
    hoursBreakdown,
    currentDayName: todayRecord.day_name,
  };
}
