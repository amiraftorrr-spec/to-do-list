// Utility functions for date manipulation and formatting

export function getLocalDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTodayString(): string {
  return getLocalDateString(new Date());
}

export function getTomorrowString(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return getLocalDateString(d);
}

export function addDays(dateStr: string, days: number): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  d.setDate(d.getDate() + days);
  return getLocalDateString(d);
}

export function parseDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

import { Language } from '@/types/todo';

export function formatDisplayDate(dateStr: string, lang: Language = 'en'): string {
  if (!dateStr) return '';
  const today = getTodayString();
  const tomorrow = getTomorrowString();
  const yesterday = addDays(today, -1);
  const date = parseDate(dateStr);

  if (lang === 'fa') {
    const weekday = date.toLocaleDateString('fa-IR-u-ca-persian', { weekday: 'long' });
    const dayAndMonth = date.toLocaleDateString('fa-IR-u-ca-persian', { day: 'numeric', month: 'long' });

    if (dateStr === today) {
      return `امروز (${weekday}، ${dayAndMonth})`;
    }
    if (dateStr === tomorrow) {
      return `فردا (${weekday}، ${dayAndMonth})`;
    }
    if (dateStr === yesterday) {
      return `دیروز (${weekday})`;
    }
    return `${weekday}، ${dayAndMonth}`;
  }

  const monthName = date.toLocaleDateString('en-US', { month: 'short' });
  const day = date.getDate();
  const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });

  if (dateStr === today) {
    return `Today (${weekday}, ${monthName} ${day})`;
  }
  if (dateStr === tomorrow) {
    return `Tomorrow (${weekday}, ${monthName} ${day})`;
  }
  if (dateStr === yesterday) {
    return `Yesterday (${weekday})`;
  }

  const thisYear = new Date().getFullYear();
  if (date.getFullYear() === thisYear) {
    return `${weekday}, ${monthName} ${day}`;
  }
  return `${monthName} ${day}, ${date.getFullYear()}`;
}

export function isOverdue(dateStr: string, completed: boolean): boolean {
  if (completed || !dateStr) return false;
  return dateStr < getTodayString();
}

/**
 * Weekly Saturday Cycle:
 * In this system, Saturday marks the start of a new weekly planning cycle.
 * The week runs from Saturday to Friday.
 * Saturday morning is the time to review the *previous* week (the Saturday to Friday that just concluded).
 */

export function isTodaySaturday(): boolean {
  return new Date().getDay() === 6; // 6 is Saturday in standard JavaScript Date.getDay()
}

// Get the Saturday that starts the week containing targetDate
export function getSaturdayOfWeek(targetDate: Date = new Date()): Date {
  const d = new Date(targetDate);
  const day = d.getDay(); // 0 is Sun, 1 is Mon, ..., 6 is Sat
  const daysSinceSaturday = (day + 1) % 7;
  d.setDate(d.getDate() - daysSinceSaturday);
  return d;
}

// Returns the upcoming Saturday (if today is Saturday, returns next Saturday in 7 days)
export function getNextSaturday(referenceDate: Date = new Date()): Date {
  const d = new Date(referenceDate);
  const day = d.getDay(); // 0 is Sun, ..., 6 is Sat
  const daysUntilSaturday = (6 - day + 7) % 7 || 7;
  d.setDate(d.getDate() + daysUntilSaturday);
  return d;
}

// Returns the previous week range: [prev Saturday, prev Friday]
export function getPreviousWeekRange(referenceDate: Date = new Date()): { start: string; end: string } {
  const currentSaturday = getSaturdayOfWeek(referenceDate);
  const prevSaturday = new Date(currentSaturday);
  prevSaturday.setDate(prevSaturday.getDate() - 7);

  const prevFriday = new Date(prevSaturday);
  prevFriday.setDate(prevFriday.getDate() + 6);

  return {
    start: getLocalDateString(prevSaturday),
    end: getLocalDateString(prevFriday),
  };
}

// Returns the current week range: [this Saturday, this Friday]
export function getCurrentWeekRange(referenceDate: Date = new Date()): { start: string; end: string } {
  const currentSaturday = getSaturdayOfWeek(referenceDate);
  const currentFriday = new Date(currentSaturday);
  currentFriday.setDate(currentFriday.getDate() + 6);

  return {
    start: getLocalDateString(currentSaturday),
    end: getLocalDateString(currentFriday),
  };
}

export function formatWeekLabel(startDateStr: string, endDateStr: string, lang: Language = 'en'): string {
  if (!startDateStr || !endDateStr) return '';
  const start = parseDate(startDateStr);
  const end = parseDate(endDateStr);

  if (lang === 'fa') {
    const startText = start.toLocaleDateString('fa-IR-u-ca-persian', { day: 'numeric', month: 'long' });
    const endText = end.toLocaleDateString('fa-IR-u-ca-persian', { day: 'numeric', month: 'long', year: 'numeric' });
    return `${startText} تا ${endText}`;
  }

  const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
  const endMonth = end.toLocaleDateString('en-US', { month: 'short' });

  if (startMonth === endMonth) {
    return `${startMonth} ${start.getDate()} – ${end.getDate()}, ${start.getFullYear()}`;
  }
  return `${startMonth} ${start.getDate()} – ${endMonth} ${end.getDate()}, ${end.getFullYear()}`;
}

export function getUpcomingDays(count: number = 7): string[] {
  const today = getTodayString();
  const days: string[] = [];
  for (let i = 0; i < count; i++) {
    days.push(addDays(today, i));
  }
  return days;
}
