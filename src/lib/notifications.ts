import { LocalNotifications } from '@capacitor/local-notifications';
import { Task } from '@/types/todo';

export const NIGHTLY_NOTIFICATION_ID = 2300;
export const TEST_NOTIFICATION_ID = 9999;
export const ACTION_TYPE_ID = 'TASK_REMINDER_ACTIONS';
export const REMINDERS_CHANNEL_ID = 'tedlist_reminders';

/**
 * Calculates the exact next 23:00 (11:00 PM) in Tehran timezone (Asia/Tehran).
 */
export function getNextTehran11PM(): Date {
  const now = new Date();
  const tehranTimeStr = now.toLocaleTimeString('en-US', {
    timeZone: 'Asia/Tehran',
    hour12: false,
    hour: 'numeric',
    minute: 'numeric',
  });
  const [tHour, tMin] = tehranTimeStr.split(':').map(Number);

  let hoursDiff = 23 - tHour;
  let minDiff = 0 - tMin;
  let totalMinutesUntil = hoursDiff * 60 + minDiff;
  if (totalMinutesUntil <= 0) {
    totalMinutesUntil += 24 * 60; // Next day
  }

  return new Date(now.getTime() + totalMinutesUntil * 60 * 1000);
}

/**
 * Initializes notification action types and Android high-importance notification channel.
 */
export async function initNotificationActions(): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    // 1. Create Android Notification Channel for Heads-up Alert with sound & vibration
    await LocalNotifications.createChannel({
      id: REMINDERS_CHANNEL_ID,
      name: 'یادآور کارهای روزانه',
      description: 'اعلان‌های شبانه و یادآور کارهای باقیمانده tedlist',
      importance: 5, // High importance (Heads-up banner)
      visibility: 1, // Public on lockscreen
      sound: 'default',
      vibration: true,
      lights: true,
      lightColor: '#6366f1',
    });

    // 2. Register Action Types (Pull-down buttons)
    await LocalNotifications.registerActionTypes({
      types: [
        {
          id: ACTION_TYPE_ID,
          actions: [
            {
              id: 'COMPLETE_ALL',
              title: 'تیک زدن همه کارهای امروز ✓',
            },
            {
              id: 'DISMISS',
              title: 'بعداً یادآوری کن',
              destructive: true,
            },
          ],
        },
      ],
    });
  } catch {
    // Non-native fallback
  }
}

/**
 * Requests local notification permission if not yet granted.
 */
export async function checkAndRequestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  try {
    const status = await LocalNotifications.checkPermissions();
    if (status.display === 'granted') {
      return true;
    }
    const requested = await LocalNotifications.requestPermissions();
    return requested.display === 'granted';
  } catch {
    return false;
  }
}

/**
 * Schedules or cancels the 23:00 Tehran nightly reminder based on pending tasks.
 */
export async function scheduleNightlyReminder(pendingTodayTasks: Task[]): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    // If no tasks are pending, cancel reminder
    if (pendingTodayTasks.length === 0) {
      await LocalNotifications.cancel({
        notifications: [{ id: NIGHTLY_NOTIFICATION_ID }],
      });
      return;
    }

    const hasPermission = await checkAndRequestNotificationPermission();
    if (!hasPermission) return;

    await initNotificationActions();

    const targetDate = getNextTehran11PM();
    const count = pendingTodayTasks.length;
    const taskTitles = pendingTodayTasks.map((t) => t.title);

    let title = 'این‌ها یادت نره! 🌙';
    let body = '';

    if (count === 1) {
      title = `یادت نره: ${taskTitles[0]} 🌙`;
      body = 'یک کار انجام‌نشده برای امروز داری. برای تیک زدن پایین بکش!';
    } else {
      title = `${count} کار انجام‌نشده برای امروز 🌙`;
      body = `کارهای باقیمانده: ${taskTitles.slice(0, 3).join('، ')}${count > 3 ? ' و...' : ''}`;
    }

    await LocalNotifications.schedule({
      notifications: [
        {
          id: NIGHTLY_NOTIFICATION_ID,
          title,
          body,
          schedule: {
            at: targetDate,
            allowWhileIdle: true,
          },
          channelId: REMINDERS_CHANNEL_ID,
          actionTypeId: ACTION_TYPE_ID,
          sound: 'default',
          extra: {
            type: 'nightly_reminder',
            taskCount: count,
          },
        },
      ],
    });
  } catch {
    // Graceful fallback
  }
}

/**
 * Schedules a test notification to trigger exactly 10 seconds from now.
 */
export async function schedule10sTestNotification(pendingTodayTasks: Task[]): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  try {
    const hasPermission = await checkAndRequestNotificationPermission();
    if (!hasPermission) return false;

    await initNotificationActions();

    const targetDate = new Date(Date.now() + 10 * 1000);
    const count = pendingTodayTasks.length;

    let title = 'این‌ها یادت نره! 🌙 (تست ۱۰ ثانیه‌ای)';
    let body = '';

    if (count === 0) {
      body = 'تمام کارهای امروز تیک خورده‌اند! اعلان تستی با موفقیت کار می‌کند.';
    } else if (count === 1) {
      body = `کار ناتمام: "${pendingTodayTasks[0].title}". برای تیک زدن پایین بکش!`;
    } else {
      body = `${count} کار انجام‌نشده داری (${pendingTodayTasks.slice(0, 2).map((t) => t.title).join('، ')}...). برای تیک زدن همه پایین بکش!`;
    }

    await LocalNotifications.schedule({
      notifications: [
        {
          id: TEST_NOTIFICATION_ID,
          title,
          body,
          schedule: {
            at: targetDate,
            allowWhileIdle: true,
          },
          channelId: REMINDERS_CHANNEL_ID,
          actionTypeId: ACTION_TYPE_ID,
          sound: 'default',
          extra: {
            type: 'test_10s',
            taskCount: count,
          },
        },
      ],
    });

    return true;
  } catch (err) {
    console.error('Failed to schedule test notification:', err);
    return false;
  }
}
