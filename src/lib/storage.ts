import { Task, WeeklyScore } from '@/types/todo';
import { getTodayString, getTomorrowString, addDays } from './date-utils';

const TASKS_STORAGE_KEY = 'todo_app_tasks_v1';
const REVIEWS_STORAGE_KEY = 'todo_app_weekly_reviews_v1';
const DISMISSED_SAT_KEY = 'todo_app_sat_modal_dismissed_week';

const SEED_TASK_IDS = new Set(['task-1', 'task-2', 'task-3', 'task-4', 'task-5']);

export function getInitialSeedTasks(): Task[] {
  return [];
}

export function loadTasksFromStorage(): Task[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(TASKS_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Filter out previous seed/dummy tasks so the site is clean of default content
    const cleaned = parsed.filter((t) => !SEED_TASK_IDS.has(t.id));
    if (cleaned.length !== parsed.length) {
      saveTasksToStorage(cleaned);
    }
    return cleaned;
  } catch (err) {
    console.error('Failed to load tasks from localStorage:', err);
    return [];
  }
}

export function saveTasksToStorage(tasks: Task[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch (err) {
    console.error('Failed to save tasks to localStorage:', err);
  }
}

export function loadWeeklyReviewsFromStorage(): WeeklyScore[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(REVIEWS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to load reviews from localStorage:', err);
    return [];
  }
}

export function saveWeeklyReviewsToStorage(reviews: WeeklyScore[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
  } catch (err) {
    console.error('Failed to save reviews to localStorage:', err);
  }
}

export function isSaturdayModalDismissed(weekId: string): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(DISMISSED_SAT_KEY) === weekId;
}

export function setSaturdayModalDismissed(weekId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DISMISSED_SAT_KEY, weekId);
}

/**
 * Calculates a thoughtful weekly score out of 100 for a given week range.
 *
 * Scoring model:
 * 1. Base Completion Rate (60 points max):
 *    (completed / total) * 60
 * 2. High-Priority Execution (25 points max):
 *    (urgent/high completed / urgent/high total) * 25
 *    (or full 25 if no urgent/high tasks were scheduled)
 * 3. Daily Consistency Bonus (15 points max):
 *    Rewarding completing tasks across different days rather than cramming or dropping off.
 */
export function calculateWeeklyScore(
  tasks: Task[],
  weekStart: string,
  weekEnd: string
): Omit<WeeklyScore, 'id' | 'reflection' | 'reviewedAt'> {
  // Filter tasks that fell into this week's window
  const weekTasks = tasks.filter((t) => t.dueDate >= weekStart && t.dueDate <= weekEnd);

  if (weekTasks.length === 0) {
    return {
      weekStart,
      weekEnd,
      score: 100,
      totalTasks: 0,
      completedTasks: 0,
      urgentHighCompleted: 0,
      urgentHighTotal: 0,
      consistencyScore: 100,
      ratingLabel: 'Clean Slate',
      feedback: 'No tasks were logged for this week. A peaceful week to recharge or prepare for what lies ahead.',
    };
  }

  const totalTasks = weekTasks.length;
  const completedTasks = weekTasks.filter((t) => t.completed).length;
  const completionRate = completedTasks / totalTasks;

  const urgentHighTasks = weekTasks.filter((t) => t.priority === 'urgent' || t.priority === 'high');
  const urgentHighTotal = urgentHighTasks.length;
  const urgentHighCompleted = urgentHighTasks.filter((t) => t.completed).length;

  const urgentHighRate = urgentHighTotal > 0 ? urgentHighCompleted / urgentHighTotal : completionRate;

  // Consistency: count unique days where at least 1 task was completed
  const activeDays = new Set(
    weekTasks
      .filter((t) => t.completed)
      .map((t) => (t.completedAt ? t.completedAt.slice(0, 10) : t.dueDate))
  ).size;
  const consistencyScore = Math.min(15, Math.round((activeDays / 5) * 15));

  const basePoints = Math.round(completionRate * 60);
  const priorityPoints = Math.round(urgentHighRate * 25);
  const totalScore = Math.min(100, Math.max(0, basePoints + priorityPoints + consistencyScore));

  let ratingLabel = '';
  let feedback = '';

  if (totalScore >= 90) {
    ratingLabel = 'Exceptional Flow 🌟';
    feedback = 'Outstanding discipline! You crushed almost all commitments, conquered high-priority goals, and maintained steady momentum.';
  } else if (totalScore >= 80) {
    ratingLabel = 'Strong Momentum 💪';
    feedback = 'Great job this week! High completion and reliable execution. Keep sharpening your focus on the critical few.';
  } else if (totalScore >= 65) {
    ratingLabel = 'Steady Progress 📈';
    feedback = 'Solid effort. You tackled a meaningful chunk of your plan. Consider trimming non-essential tasks to finish what matters most.';
  } else if (totalScore >= 50) {
    ratingLabel = 'Mixed Execution ⚖️';
    feedback = 'You made progress, but several tasks slipped. Review whether your schedule was over-ambitious or derailed by distractions.';
  } else {
    ratingLabel = 'Rebuild & Reset 🔄';
    feedback = 'A challenging week, but every Saturday is an opportunity to wipe the slate clean and start fresh with simpler, clearer goals.';
  }

  return {
    weekStart,
    weekEnd,
    score: totalScore,
    totalTasks,
    completedTasks,
    urgentHighCompleted,
    urgentHighTotal,
    consistencyScore,
    ratingLabel,
    feedback,
  };
}

export function exportDataAsJSON(): void {
  if (typeof window === 'undefined') return;
  const tasks = loadTasksFromStorage();
  const reviews = loadWeeklyReviewsFromStorage();
  const backup = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    tasks,
    reviews,
  };

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `mindful-todo-backup-${getTodayString()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function importDataFromJSON(
  fileContent: string
): { success: boolean; message: string; taskCount: number } {
  try {
    const data = JSON.parse(fileContent);
    if (!data.tasks || !Array.isArray(data.tasks)) {
      return { success: false, message: 'Invalid file format: missing tasks array', taskCount: 0 };
    }

    saveTasksToStorage(data.tasks);
    if (data.reviews && Array.isArray(data.reviews)) {
      saveWeeklyReviewsToStorage(data.reviews);
    }

    return {
      success: true,
      message: 'Data successfully restored!',
      taskCount: data.tasks.length,
    };
  } catch (err) {
    return {
      success: false,
      message: 'Failed to parse JSON file: ' + (err instanceof Error ? err.message : String(err)),
      taskCount: 0,
    };
  }
}
