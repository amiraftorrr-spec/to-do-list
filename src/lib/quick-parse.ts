import { Priority, Category, Language } from '@/types/todo';
import { addDays, parseDate, getLocalDateString } from './date-utils';

export interface ParsedQuickTask {
  title: string;
  dueDate: string;
  dueTime?: string;
  priority: Priority;
  category: Category;
  detected: {
    hasDate: boolean;
    hasTime: boolean;
    hasPriority: boolean;
    hasCategory: boolean;
    rawDateLabel?: string;
    rawTimeLabel?: string;
  };
}

/**
 * Normalizes Persian and Arabic digits to standard Latin digits
 */
export function toEnglishDigits(str: string): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

  let result = str;
  for (let i = 0; i < 10; i++) {
    result = result.replaceAll(persianDigits[i], String(i));
    result = result.replaceAll(arabicDigits[i], String(i));
  }
  return result;
}

/**
 * Calculates date offset for day of week (0=Sunday ... 6=Saturday)
 */
function getNextDayOfWeek(targetDay: number, baseDateStr: string): string {
  const d = parseDate(baseDateStr);
  const currentDay = d.getDay();
  let daysToAdd = (targetDay - currentDay + 7) % 7;
  if (daysToAdd === 0) daysToAdd = 7; // next week's day
  return addDays(baseDateStr, daysToAdd);
}

export function parseQuickTask(
  rawInput: string,
  todayStr: string
): ParsedQuickTask {
  let text = rawInput.trim();
  const normalized = toEnglishDigits(text);

  let priority: Priority = 'medium';
  let category: Category = 'General';
  let dueDate = todayStr;
  let dueTime: string | undefined = undefined;

  let hasPriority = false;
  let hasCategory = false;
  let hasDate = false;
  let hasTime = false;
  let rawDateLabel: string | undefined = undefined;
  let rawTimeLabel: string | undefined = undefined;

  // 1. Priority tags
  if (/!(?:فوری|urgent)/i.test(text)) {
    priority = 'urgent';
    hasPriority = true;
    text = text.replace(/!(?:فوری|urgent)/gi, '');
  } else if (/!(?:مهم|بالا|high)/i.test(text)) {
    priority = 'high';
    hasPriority = true;
    text = text.replace(/!(?:مهم|بالا|high)/gi, '');
  } else if (/!(?:متوسط|معمولی|medium)/i.test(text)) {
    priority = 'medium';
    hasPriority = true;
    text = text.replace(/!(?:متوسط|معمولی|medium)/gi, '');
  } else if (/!(?:پایین|کم|low)/i.test(text)) {
    priority = 'low';
    hasPriority = true;
    text = text.replace(/!(?:پایین|کم|low)/gi, '');
  }

  // 2. Category tags
  if (/#(?:شخصی|personal)/i.test(text)) {
    category = 'Personal';
    hasCategory = true;
    text = text.replace(/#(?:شخصی|personal)/gi, '');
  } else if (/#(?:کاری|کار|work)/i.test(text)) {
    category = 'Work';
    hasCategory = true;
    text = text.replace(/#(?:کاری|کار|work)/gi, '');
  } else if (/#(?:عادت‌ها|عادت|عادات|habits|habit)/i.test(text)) {
    category = 'Habits';
    hasCategory = true;
    text = text.replace(/#(?:عادت‌ها|عادت|عادات|habits|habit)/gi, '');
  } else if (/#(?:یادگیری|درس|آموزش|learning)/i.test(text)) {
    category = 'Learning';
    hasCategory = true;
    text = text.replace(/#(?:یادگیری|درس|آموزش|learning)/gi, '');
  } else if (/#(?:سلامتی|سلامت|ورزش|health)/i.test(text)) {
    category = 'Health';
    hasCategory = true;
    text = text.replace(/#(?:سلامتی|سلامت|ورزش|health)/gi, '');
  } else if (/#(?:عمومی|general)/i.test(text)) {
    category = 'General';
    hasCategory = true;
    text = text.replace(/#(?:عمومی|general)/gi, '');
  }

  // 3. Time detection (e.g. ساعت ۱۸, ساعت 18:30, 18:30, 4pm, 4:30pm)
  // Persian "ساعت HH(:MM)?"
  const persianTimeMatch = normalized.match(/(?:ساعت|at)\s*(\d{1,2})(?::(\d{2}))?\s*(صبح|عصر|شب|am|pm)?/i);
  if (persianTimeMatch) {
    let hours = parseInt(persianTimeMatch[1], 10);
    const minutes = persianTimeMatch[2] ? parseInt(persianTimeMatch[2], 10) : 0;
    const period = persianTimeMatch[3]?.toLowerCase();

    if ((period === 'عصر' || period === 'شب' || period === 'pm') && hours < 12) {
      hours += 12;
    } else if ((period === 'صبح' || period === 'am') && hours === 12) {
      hours = 0;
    }

    if (hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) {
      dueTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      hasTime = true;
      rawTimeLabel = dueTime;
      // remove matched part from text
      text = text.replace(new RegExp(persianTimeMatch[0], 'i'), '');
    }
  } else {
    // English style 4pm or 14:30
    const enTimeMatch = normalized.match(/\b(\d{1,2}):(\d{2})\b/);
    if (enTimeMatch) {
      const h = parseInt(enTimeMatch[1], 10);
      const m = parseInt(enTimeMatch[2], 10);
      if (h >= 0 && h < 24 && m >= 0 && m < 60) {
        dueTime = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        hasTime = true;
        rawTimeLabel = dueTime;
        text = text.replace(enTimeMatch[0], '');
      }
    }
  }

  // 4. Relative Date detection
  if (/\b(?:پس‌فردا|پس فردا|in 2 days)\b/i.test(text)) {
    dueDate = addDays(todayStr, 2);
    hasDate = true;
    rawDateLabel = 'پس‌فردا';
    text = text.replace(/\b(?:پس‌فردا|پس فردا|in 2 days)\b/gi, '');
  } else if (/\b(?:فردا|tomorrow)\b/i.test(text)) {
    dueDate = addDays(todayStr, 1);
    hasDate = true;
    rawDateLabel = 'فردا';
    text = text.replace(/\b(?:فردا|tomorrow)\b/gi, '');
  } else if (/\b(?:امروز|today)\b/i.test(text)) {
    dueDate = todayStr;
    hasDate = true;
    rawDateLabel = 'امروز';
    text = text.replace(/\b(?:امروز|today)\b/gi, '');
  } else if (/\b(?:شنبه|saturday)\b/i.test(text)) {
    dueDate = getNextDayOfWeek(6, todayStr);
    hasDate = true;
    rawDateLabel = 'شنبه';
    text = text.replace(/\b(?:شنبه|saturday)\b/gi, '');
  } else if (/\b(?:یکشنبه|یک‌شنبه|sunday)\b/i.test(text)) {
    dueDate = getNextDayOfWeek(0, todayStr);
    hasDate = true;
    rawDateLabel = 'یکشنبه';
    text = text.replace(/\b(?:یکشنبه|یک‌شنبه|sunday)\b/gi, '');
  } else if (/\b(?:دوشنبه|monday)\b/i.test(text)) {
    dueDate = getNextDayOfWeek(1, todayStr);
    hasDate = true;
    rawDateLabel = 'دوشنبه';
    text = text.replace(/\b(?:دوشنبه|monday)\b/gi, '');
  } else if (/\b(?:سه‌شنبه|سه شنبه|tuesday)\b/i.test(text)) {
    dueDate = getNextDayOfWeek(2, todayStr);
    hasDate = true;
    rawDateLabel = 'سه‌شنبه';
    text = text.replace(/\b(?:سه‌شنبه|سه شنبه|tuesday)\b/gi, '');
  } else if (/\b(?:چهارشنبه|wednesday)\b/i.test(text)) {
    dueDate = getNextDayOfWeek(3, todayStr);
    hasDate = true;
    rawDateLabel = 'چهارشنبه';
    text = text.replace(/\b(?:چهارشنبه|wednesday)\b/gi, '');
  } else if (/\b(?:پنج‌شنبه|پنج شنبه|thursday)\b/i.test(text)) {
    dueDate = getNextDayOfWeek(4, todayStr);
    hasDate = true;
    rawDateLabel = 'پنج‌شنبه';
    text = text.replace(/\b(?:پنج‌شنبه|پنج شنبه|thursday)\b/gi, '');
  } else if (/\b(?:جمعه|friday)\b/i.test(text)) {
    dueDate = getNextDayOfWeek(5, todayStr);
    hasDate = true;
    rawDateLabel = 'جمعه';
    text = text.replace(/\b(?:جمعه|friday)\b/gi, '');
  }

  // Clean title
  let cleanedTitle = text
    .replace(/\s+/g, ' ')
    .replace(/^[-–—:,.\s]+|[-–—:,.\s]+$/g, '')
    .trim();

  if (!cleanedTitle) {
    cleanedTitle = rawInput.trim();
  }

  return {
    title: cleanedTitle,
    dueDate,
    dueTime,
    priority,
    category,
    detected: {
      hasDate,
      hasTime,
      hasPriority,
      hasCategory,
      rawDateLabel,
      rawTimeLabel,
    },
  };
}
