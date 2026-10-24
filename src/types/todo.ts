export type Priority = 'urgent' | 'high' | 'medium' | 'low';

export type Language = 'en' | 'fa';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export type Category = 'General' | 'Personal' | 'Work' | 'Habits' | 'Learning' | 'Health';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  completedAt?: string;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  priority: Priority;
  category: Category;
  subtasks: Subtask[];
  createdAt: string;
  updatedAt: string;
}

export interface WeeklyScore {
  id: string;
  weekStart: string; // YYYY-MM-DD (Saturday)
  weekEnd: string;   // YYYY-MM-DD (Friday)
  score: number;     // 0 - 100
  totalTasks: number;
  completedTasks: number;
  urgentHighCompleted: number;
  urgentHighTotal: number;
  consistencyScore: number;
  ratingLabel: string;
  feedback: string;
  reflection?: string;
  reviewedAt: string;
}

export type ViewMode = 'today' | 'upcoming' | 'review' | 'all' | 'completed';

export interface FilterState {
  category?: Category | 'All';
  priority?: Priority | 'All';
  searchQuery: string;
}
