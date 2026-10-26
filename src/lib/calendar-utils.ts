import { Language } from '@/types/todo';
import { parseDate, getLocalDateString } from './date-utils';

export interface CalendarDay {
  dateStr: string; // YYYY-MM-DD
  dayNumber: number;
  dayOfWeek: number; // 0=Sun, 1=Mon, ..., 6=Sat
  isCurrentMonth: boolean;
}

export interface CalendarMonthData {
  title: string;
  startOffset: number; // Number of empty cells before day 1 (0 to 6)
  days: CalendarDay[];
  weekdays: string[];
}

function getPersianParts(d: Date): { year: number; month: number; day: number } {
  const parts = new Intl.DateTimeFormat('en-u-ca-persian', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(d);

  const map: Record<string, string> = {};
  for (const p of parts) map[p.type] = p.value;

  return {
    year: parseInt(map.year, 10),
    month: parseInt(map.month, 10),
    day: parseInt(map.day, 10),
  };
}

export function getCalendarMonthData(
  refDate: Date,
  lang: Language = 'fa'
): CalendarMonthData {
  if (lang === 'fa') {
    const p = getPersianParts(refDate);

    // Step back to day 1 of this Persian month
    const d1 = new Date(refDate);
    d1.setHours(12, 0, 0, 0);
    d1.setDate(d1.getDate() - (p.day - 1));

    // Persian week starts on Saturday (شنبه)
    // d1.getDay(): 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
    // Offset relative to Saturday: (day + 1) % 7
    const startOffset = (d1.getDay() + 1) % 7;

    const days: CalendarDay[] = [];
    const curr = new Date(d1);

    while (true) {
      const parts = getPersianParts(curr);
      if (parts.month !== p.month) break;

      days.push({
        dateStr: getLocalDateString(curr),
        dayNumber: parts.day,
        dayOfWeek: curr.getDay(),
        isCurrentMonth: true,
      });

      curr.setDate(curr.getDate() + 1);
    }

    const title = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
      month: 'long',
      year: 'numeric',
    }).format(refDate);

    const weekdays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

    return {
      title,
      startOffset,
      days,
      weekdays,
    };
  }

  // English (Gregorian)
  const year = refDate.getFullYear();
  const month = refDate.getMonth();

  const d1 = new Date(year, month, 1, 12, 0, 0);
  const startOffset = d1.getDay(); // 0=Sunday ... 6=Saturday

  const days: CalendarDay[] = [];
  const curr = new Date(d1);

  while (curr.getMonth() === month) {
    days.push({
      dateStr: getLocalDateString(curr),
      dayNumber: curr.getDate(),
      dayOfWeek: curr.getDay(),
      isCurrentMonth: true,
    });
    curr.setDate(curr.getDate() + 1);
  }

  const title = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(refDate);

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return {
    title,
    startOffset,
    days,
    weekdays,
  };
}

export function shiftMonth(refDate: Date, direction: 1 | -1, lang: Language = 'fa'): Date {
  const d = new Date(refDate);
  d.setHours(12, 0, 0, 0);

  if (lang === 'fa') {
    const p = getPersianParts(d);
    // Find day 1
    const d1 = new Date(d);
    d1.setDate(d1.getDate() - (p.day - 1));

    if (direction === 1) {
      // jump forward into next Persian month
      d1.setDate(d1.getDate() + 32);
      return d1;
    } else {
      // jump backward into previous Persian month
      d1.setDate(d1.getDate() - 5);
      return d1;
    }
  }

  d.setMonth(d.getMonth() + direction);
  return d;
}
