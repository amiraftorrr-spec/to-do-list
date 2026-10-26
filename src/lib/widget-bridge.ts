import { registerPlugin } from '@capacitor/core';
import { Task } from '@/types/todo';

interface WidgetBridgePluginType {
  updateWidget(options: {
    pendingCount: number;
    totalCount: number;
    completedCount: number;
    progressPercent: number;
    topTasks: string[];
  }): Promise<void>;
}

const WidgetBridge = registerPlugin<WidgetBridgePluginType>('WidgetBridge');

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

  try {
    await WidgetBridge.updateWidget({
      pendingCount: pending.length,
      totalCount: total,
      completedCount: todayCompletedCount,
      progressPercent,
      topTasks,
    });
  } catch {
    // Non-native web environment gracefully ignores
  }
}
