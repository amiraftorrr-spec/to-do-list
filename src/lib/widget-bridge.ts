import { registerPlugin } from '@capacitor/core';
import { Task } from '@/types/todo';

interface WidgetBridgePluginType {
  updateWidget(options: {
    pendingCount: number;
    totalCount: number;
    completedCount: number;
    progressPercent: number;
    topTasks: string[];
    dateLabel?: string;
  }): Promise<void>;
  openUrl(options: { url: string }): Promise<void>;
}

const WidgetBridge = registerPlugin<WidgetBridgePluginType>('WidgetBridge');

/**
 * Opens an external web URL using native Android Intent to ensure the phone's browser is launched.
 */
export async function openExternalUrl(url: string): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    await WidgetBridge.openUrl({ url });
  } catch {
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
}

/**
 * Synchronizes task counts and top unfinished tasks with the native Android widgets.
 */
export async function syncNativeWidget(
  todayTasks: Task[],
  todayCompletedCount: number
): Promise<void> {
  if (typeof window === 'undefined') return;

  const pending = todayTasks.filter((t) => !t.completed);
  const total = pending.length + todayCompletedCount;
  const progressPercent = total > 0 ? Math.round((todayCompletedCount / total) * 100) : 100;
  const topTasks = pending.slice(0, 3).map((t) => t.title);

  let dateLabel = '';
  try {
    const today = new Date();
    const weekday = today.toLocaleDateString('fa-IR-u-ca-persian', { weekday: 'long' });
    const dayAndMonth = today.toLocaleDateString('fa-IR-u-ca-persian', { day: 'numeric', month: 'long' });
    dateLabel = `${weekday}، ${dayAndMonth}`;
  } catch {
    // fallback
  }

  try {
    await WidgetBridge.updateWidget({
      pendingCount: pending.length,
      totalCount: total,
      completedCount: todayCompletedCount,
      progressPercent,
      topTasks,
      dateLabel,
    });
  } catch {
    // Non-native web environment gracefully ignores
  }
}
