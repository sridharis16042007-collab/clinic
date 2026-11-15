import React from 'react';
import { OpeningHours } from '@/types/clinic';

interface HoursTableProps {
  hours: OpeningHours[];
  compact?: boolean;
}

export function DashedHoursTable({ hours, compact = false }: HoursTableProps) {
  // Current day index in IST
  const now = new Date();
  const utcOffset = now.getTime() + now.getTimezoneOffset() * 60000;
  const istTime = new Date(utcOffset + 3600000 * 5.5);
  const currentDayIndex = istTime.getDay();

  return (
    <div className="w-full">
      <div className="divide-y divide-dashed divide-border border-y border-dashed border-border">
        {hours.map((item) => {
          const isToday = item.day_of_week === currentDayIndex;
          return (
            <div
              key={item.day_of_week}
              className={`flex items-center justify-between py-3 sm:py-3.5 px-2 transition-colors ${
                isToday
                  ? 'bg-accent-light/50 font-medium text-ink'
                  : 'text-ink-muted'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span
                  className={`text-xs sm:text-sm ${
                    isToday ? 'font-semibold text-ink' : 'font-normal'
                  }`}
                >
                  {item.day_name}
                </span>
                {isToday && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-accent text-white">
                    Today
                  </span>
                )}
              </div>

              <div className="text-right">
                {item.is_closed ? (
                  <span className="text-xs sm:text-sm text-amber-600 font-medium">
                    Closed (Emergency on call)
                  </span>
                ) : (
                  <div className="space-y-0.5">
                    <span className="text-xs sm:text-sm font-medium text-ink">
                      {item.open_time} – {item.close_time}
                    </span>
                    {!compact && item.break_time && (
                      <div className="text-[11px] text-ink-muted">
                        Break: {item.break_time}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
