'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { Task, Category, Priority, ViewMode, FilterState, WeeklyScore, Language } from '@/types/todo';
import {
  loadTasksFromStorage,
  saveTasksToStorage,
  loadWeeklyReviewsFromStorage,
  saveWeeklyReviewsToStorage,
  calculateWeeklyScore,
  isSaturdayModalDismissed,
  setSaturdayModalDismissed,
} from '@/lib/storage';
import {
  getTodayString,
  getTomorrowString,
  getPreviousWeekRange,
  getCurrentWeekRange,
  isTodaySaturday,
} from '@/lib/date-utils';
import { translations, TranslationDictionary } from '@/lib/translations';
import confetti from 'canvas-confetti';

interface TodoContextType {
  isMounted: boolean;
  todayStr: string;
  tomorrowStr: string;
  isSaturdayToday: boolean;
  prevWeekRange: { start: string; end: string };
  currentWeekRange: { start: string; end: string };

  // Language & i18n
  lang: Language;
  setLang: (l: Language) => void;
  toggleLanguage: () => void;
  t: TranslationDictionary;
  dir: 'ltr' | 'rtl';

  tasks: Task[];
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  filter: FilterState;
  setFilter: React.Dispatch<React.SetStateAction<FilterState>>;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: Category | 'All';
  setSelectedCategory: (cat: Category | 'All') => void;
  selectedPriority: Priority | 'All';
  setSelectedPriority: (prio: Priority | 'All') => void;

  // Task actions
  addTask: (data: {
    title: string;
    description?: string;
    dueDate: string;
    dueTime?: string;
    priority: Priority;
    category: Category;
    subtasks?: { title: string }[];
  }) => void;
  editTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  rescheduleTask: (id: string, newDate: string) => void;

  // Subtasks
  addSubtask: (taskId: string, title: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;

  // Modal controls
  isTaskModalOpen: boolean;
  setIsTaskModalOpen: (open: boolean) => void;
  editingTask: Task | null;
  modalDefaultDate: string;
  openCreateModal: (defaultDate?: string) => void;
  openEditModal: (task: Task) => void;
  closeTaskModal: () => void;

  // Saturday Weekly Review
  weeklyReviews: WeeklyScore[];
  lastWeekScore: ReturnType<typeof calculateWeeklyScore>;
  currentWeekScore: ReturnType<typeof calculateWeeklyScore>;
  saveWeeklyReview: (review: WeeklyScore) => void;
  isSaturdayReviewModalOpen: boolean;
  setIsSaturdayReviewModalOpen: (open: boolean) => void;
  dismissSaturdayNotice: () => void;

  // Backup modal
  isBackupModalOpen: boolean;
  setIsBackupModalOpen: (open: boolean) => void;
  reloadFromStorage: () => void;

  // Tutorial
  isTutorialOpen: boolean;
  openTutorial: () => void;
  completeTutorial: () => void;

  // PWA Prompt
  isPwaPromptOpen: boolean;
  dismissPwaPrompt: () => void;
  installPwa: () => void;
}

const TodoContext = createContext<TodoContextType | null>(null);

export function TodoProvider({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const [lang, setLangState] = useState<Language>('en');
  const [todayStr, setTodayStr] = useState('');
  const [tomorrowStr, setTomorrowStr] = useState('');
  const [isSaturdayToday, setIsSaturdayToday] = useState(false);
  const [prevWeekRange, setPrevWeekRange] = useState({ start: '', end: '' });
  const [currentWeekRange, setCurrentWeekRange] = useState({ start: '', end: '' });

  const [tasks, setTasks] = useState<Task[]>([]);
  const [weeklyReviews, setWeeklyReviews] = useState<WeeklyScore[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [selectedPriority, setSelectedPriority] = useState<Priority | 'All'>('All');
  const [filter, setFilter] = useState<FilterState>({ searchQuery: '' });

  // Modal states
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [modalDefaultDate, setModalDefaultDate] = useState<string>('');
  const [isSaturdayReviewModalOpen, setIsSaturdayReviewModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);

  // Tutorial & PWA states
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isPwaPromptOpen, setIsPwaPromptOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  const t = useMemo(() => translations[lang], [lang]);
  const dir = useMemo(() => (lang === 'fa' ? 'rtl' : 'ltr'), [lang]);

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cadence_lang', newLang);
      document.documentElement.dir = newLang === 'fa' ? 'rtl' : 'ltr';
      document.documentElement.lang = newLang;
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLang(lang === 'en' ? 'fa' : 'en');
  }, [lang, setLang]);

  // Initial load on client
  useEffect(() => {
    const today = getTodayString();
    const tomorrow = getTomorrowString();
    const isSat = isTodaySaturday();
    const prevRange = getPreviousWeekRange();
    const curRange = getCurrentWeekRange();

    setTodayStr(today);
    setTomorrowStr(tomorrow);
    setIsSaturdayToday(isSat);
    setPrevWeekRange(prevRange);
    setCurrentWeekRange(curRange);
    setModalDefaultDate(today);

    // Load language preference
    const savedLang = localStorage.getItem('cadence_lang') as Language;
    if (savedLang === 'fa' || savedLang === 'en') {
      setLangState(savedLang);
      document.documentElement.dir = savedLang === 'fa' ? 'rtl' : 'ltr';
      document.documentElement.lang = savedLang;
    }

    const loaded = loadTasksFromStorage();
    setTasks(loaded);
    const reviews = loadWeeklyReviewsFromStorage();
    setWeeklyReviews(reviews);

    // Onboarding tutorial check
    const tutorialSeen = localStorage.getItem('cadence_tutorial_seen_v1');
    if (!tutorialSeen) {
      setIsTutorialOpen(true);
    } else if (isSat) {
      // Auto-prompt Saturday morning review if it is Saturday and not yet dismissed this week
      const weekId = `week-${prevRange.start}`;
      if (!isSaturdayModalDismissed(weekId)) {
        setIsSaturdayReviewModalOpen(true);
      }
    }

    // Capture PWA beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    setIsMounted(true);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const openTutorial = useCallback(() => {
    setIsTutorialOpen(true);
  }, []);

  const completeTutorial = useCallback(() => {
    setIsTutorialOpen(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cadence_tutorial_seen_v1', 'true');
      const pwaPrompted = localStorage.getItem('cadence_pwa_prompted');
      if (!pwaPrompted) {
        setTimeout(() => {
          setIsPwaPromptOpen(true);
        }, 500);
      }
    }
  }, []);

  const dismissPwaPrompt = useCallback(() => {
    setIsPwaPromptOpen(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cadence_pwa_prompted', 'true');
    }
  }, []);

  const installPwa = useCallback(async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult && choiceResult.outcome === 'accepted') {
        console.log('User accepted PWA install');
      }
      setDeferredPrompt(null);
    }
    dismissPwaPrompt();
  }, [deferredPrompt, dismissPwaPrompt]);

  const reloadFromStorage = useCallback(() => {
    const loaded = loadTasksFromStorage();
    setTasks(loaded);
    const reviews = loadWeeklyReviewsFromStorage();
    setWeeklyReviews(reviews);
  }, []);

  // Update tasks and persist
  const updateTasks = useCallback((updater: (prev: Task[]) => Task[]) => {
    setTasks((prev) => {
      const next = updater(prev);
      saveTasksToStorage(next);
      return next;
    });
  }, []);

  const addTask = useCallback(
    (data: {
      title: string;
      description?: string;
      dueDate: string;
      dueTime?: string;
      priority: Priority;
      category: Category;
      subtasks?: { title: string }[];
    }) => {
      const now = new Date().toISOString();
      const newTask: Task = {
        id: 'task_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        title: data.title.trim(),
        description: data.description?.trim() || undefined,
        completed: false,
        dueDate: data.dueDate,
        dueTime: data.dueTime || undefined,
        priority: data.priority,
        category: data.category,
        subtasks:
          data.subtasks?.map((s) => ({
            id: 'sub_' + Math.random().toString(36).substring(2, 9),
            title: s.title.trim(),
            completed: false,
          })) || [],
        createdAt: now,
        updatedAt: now,
      };

      updateTasks((prev) => [newTask, ...prev]);
    },
    [updateTasks]
  );

  const editTask = useCallback(
    (id: string, updates: Partial<Task>) => {
      updateTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t))
      );
    },
    [updateTasks]
  );

  const deleteTask = useCallback(
    (id: string) => {
      updateTasks((prev) => prev.filter((t) => t.id !== id));
    },
    [updateTasks]
  );

  const toggleTask = useCallback(
    (id: string) => {
      updateTasks((prev) =>
        prev.map((t) => {
          if (t.id !== id) return t;
          const nextCompleted = !t.completed;
          if (nextCompleted) {
            try {
              confetti({
                particleCount: 28,
                spread: 45,
                origin: { y: 0.8 },
                colors: ['#22c55e', '#10b981', '#3b82f6', '#f59e0b'],
              });
            } catch {
              // Ignore if canvas is unavailable
            }
          }
          return {
            ...t,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : undefined,
            updatedAt: new Date().toISOString(),
          };
        })
      );
    },
    [updateTasks]
  );

  const rescheduleTask = useCallback(
    (id: string, newDate: string) => {
      editTask(id, { dueDate: newDate });
    },
    [editTask]
  );

  const addSubtask = useCallback(
    (taskId: string, title: string) => {
      if (!title.trim()) return;
      updateTasks((prev) =>
        prev.map((t) => {
          if (t.id !== taskId) return t;
          const newSub = {
            id: 'sub_' + Math.random().toString(36).substring(2, 9),
            title: title.trim(),
            completed: false,
          };
          return {
            ...t,
            subtasks: [...t.subtasks, newSub],
            updatedAt: new Date().toISOString(),
          };
        })
      );
    },
    [updateTasks]
  );

  const toggleSubtask = useCallback(
    (taskId: string, subtaskId: string) => {
      updateTasks((prev) =>
        prev.map((t) => {
          if (t.id !== taskId) return t;
          return {
            ...t,
            subtasks: t.subtasks.map((s) =>
              s.id === subtaskId ? { ...s, completed: !s.completed } : s
            ),
            updatedAt: new Date().toISOString(),
          };
        })
      );
    },
    [updateTasks]
  );

  const deleteSubtask = useCallback(
    (taskId: string, subtaskId: string) => {
      updateTasks((prev) =>
        prev.map((t) => {
          if (t.id !== taskId) return t;
          return {
            ...t,
            subtasks: t.subtasks.filter((s) => s.id !== subtaskId),
            updatedAt: new Date().toISOString(),
          };
        })
      );
    },
    [updateTasks]
  );

  const openCreateModal = useCallback(
    (defaultDate?: string) => {
      setEditingTask(null);
      setModalDefaultDate(defaultDate || todayStr);
      setIsTaskModalOpen(true);
    },
    [todayStr]
  );

  const openEditModal = useCallback((task: Task) => {
    setEditingTask(task);
    setModalDefaultDate(task.dueDate);
    setIsTaskModalOpen(true);
  }, []);

  const closeTaskModal = useCallback(() => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
  }, []);

  // Compute Weekly Scores
  const lastWeekScore = useMemo(() => {
    if (!prevWeekRange.start || !prevWeekRange.end) {
      return {
        weekStart: '',
        weekEnd: '',
        score: 100,
        totalTasks: 0,
        completedTasks: 0,
        urgentHighCompleted: 0,
        urgentHighTotal: 0,
        consistencyScore: 100,
        ratingLabel: 'Ready',
        feedback: 'Loading evaluation...',
      };
    }
    return calculateWeeklyScore(tasks, prevWeekRange.start, prevWeekRange.end);
  }, [tasks, prevWeekRange]);

  const currentWeekScore = useMemo(() => {
    if (!currentWeekRange.start || !currentWeekRange.end) {
      return {
        weekStart: '',
        weekEnd: '',
        score: 100,
        totalTasks: 0,
        completedTasks: 0,
        urgentHighCompleted: 0,
        urgentHighTotal: 0,
        consistencyScore: 100,
        ratingLabel: 'Ready',
        feedback: 'Loading evaluation...',
      };
    }
    return calculateWeeklyScore(tasks, currentWeekRange.start, currentWeekRange.end);
  }, [tasks, currentWeekRange]);

  const saveWeeklyReview = useCallback((review: WeeklyScore) => {
    setWeeklyReviews((prev) => {
      const filtered = prev.filter((r) => r.weekStart !== review.weekStart);
      const updated = [review, ...filtered];
      saveWeeklyReviewsToStorage(updated);
      return updated;
    });
  }, []);

  const dismissSaturdayNotice = useCallback(() => {
    if (prevWeekRange.start) {
      setSaturdayModalDismissed(`week-${prevWeekRange.start}`);
    }
    setIsSaturdayReviewModalOpen(false);
  }, [prevWeekRange.start]);

  return (
    <TodoContext.Provider
      value={{
        isMounted,
        todayStr,
        tomorrowStr,
        isSaturdayToday,
        prevWeekRange,
        currentWeekRange,
        lang,
        setLang,
        toggleLanguage,
        t,
        dir,
        tasks,
        viewMode,
        setViewMode,
        filter,
        setFilter,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedPriority,
        setSelectedPriority,
        addTask,
        editTask,
        deleteTask,
        toggleTask,
        rescheduleTask,
        addSubtask,
        toggleSubtask,
        deleteSubtask,
        isTaskModalOpen,
        setIsTaskModalOpen,
        editingTask,
        modalDefaultDate,
        openCreateModal,
        openEditModal,
        closeTaskModal,
        weeklyReviews,
        lastWeekScore,
        currentWeekScore,
        saveWeeklyReview,
        isSaturdayReviewModalOpen,
        setIsSaturdayReviewModalOpen,
        dismissSaturdayNotice,
        isBackupModalOpen,
        setIsBackupModalOpen,
        reloadFromStorage,
        isTutorialOpen,
        openTutorial,
        completeTutorial,
        isPwaPromptOpen,
        dismissPwaPrompt,
        installPwa,
      }}
    >
      <div dir={dir} className={lang === 'fa' ? 'font-sans' : ''}>
        {children}
      </div>
    </TodoContext.Provider>
  );
}

export function useTodo() {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
}
