'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { flushSync } from 'react-dom';
import { Task, Category, Priority, ViewMode, FilterState, WeeklyScore, Language, Recurrence } from '@/types/todo';
import { triggerHaptic } from '@/lib/haptics';
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
import { isAppInstalledOrNative } from '@/lib/platform';
import { syncNativeWidget } from '@/lib/widget-bridge';
import { scheduleNightlyReminder, schedule30sTestNotification } from '@/lib/notifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import confetti from 'canvas-confetti';
import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';

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

  // Theme
  theme: 'dark' | 'light';
  setTheme: (t: 'dark' | 'light') => void;
  toggleTheme: (event?: React.MouseEvent | { clientX?: number; clientY?: number; currentTarget?: any }) => void;

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
    recurrence?: Recurrence;
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

  // Notifications & Widget
  completeAllTodayTasks: () => void;
  runNotificationTest30s: () => Promise<boolean>;
  testNotificationToast: string | null;
  clearTestNotificationToast: () => void;

  // PWA Prompt
  isPwaPromptOpen: boolean;
  isPwaInstallable: boolean;
  openPwaPrompt: () => void;
  dismissPwaPrompt: () => void;
  installPwa: () => void;
}

const TodoContext = createContext<TodoContextType | null>(null);

export function TodoProvider({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const [theme, setThemeState] = useState<'dark' | 'light'>('dark');
  const [lang, setLangState] = useState<Language>('fa');
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

  // Tutorial & APK states
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isPwaPromptOpen, setIsPwaPromptOpen] = useState(false);

  const t = useMemo(() => translations[lang], [lang]);
  const dir = useMemo(() => (lang === 'fa' ? 'rtl' : 'ltr'), [lang]);

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('tedlist_lang', newLang);
      document.documentElement.dir = newLang === 'fa' ? 'rtl' : 'ltr';
      document.documentElement.lang = newLang;
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLang(lang === 'en' ? 'fa' : 'en');
  }, [lang, setLang]);

  const isTransitioningRef = useRef(false);

  const setTheme = useCallback((newTheme: 'dark' | 'light') => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('tedlist_theme', newTheme);
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      }
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', newTheme === 'dark' ? '#090d16' : '#f8fafc');
      }
    }
  }, []);

  const toggleTheme = useCallback(
    (event?: React.MouseEvent | { clientX?: number; clientY?: number; currentTarget?: any }) => {
      if (isTransitioningRef.current) return;

      const nextTheme = theme === 'dark' ? 'light' : 'dark';

      let x = typeof window !== 'undefined' ? window.innerWidth / 2 : 0;
      let y = 0;

      if (event && 'currentTarget' in event && event.currentTarget instanceof HTMLElement) {
        const rect = event.currentTarget.getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 2;
      } else if (
        event &&
        typeof event.clientX === 'number' &&
        typeof event.clientY === 'number' &&
        (event.clientX !== 0 || event.clientY !== 0)
      ) {
        x = event.clientX;
        y = event.clientY;
      }

      const isViewTransitionSupported =
        typeof document !== 'undefined' &&
        'startViewTransition' in document &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (!isViewTransitionSupported) {
        setTheme(nextTheme);
        return;
      }

      isTransitioningRef.current = true;

      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      try {
        const transition = document.startViewTransition(() => {
          flushSync(() => {
            setTheme(nextTheme);
          });
        });

        transition.ready
          .then(() => {
            const clipPath = [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`,
            ];

            const anim = document.documentElement.animate(
              {
                clipPath: clipPath,
                filter: [
                  'drop-shadow(0 0 4px rgba(99, 102, 241, 0.9))',
                  'drop-shadow(0 0 12px rgba(99, 102, 241, 0.6))',
                ],
              },
              {
                duration: 800,
                easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
                pseudoElement: '::view-transition-new(root)',
              }
            );

            return anim.finished;
          })
          .catch(() => {
            // fallback if transition or animation rejects
          })
          .finally(() => {
            isTransitioningRef.current = false;
          });
      } catch {
        setTheme(nextTheme);
        isTransitioningRef.current = false;
      }
    },
    [theme, setTheme]
  );

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

    // Load theme preference (default to dark)
    const savedTheme = (localStorage.getItem('tedlist_theme') as 'dark' | 'light') || 'dark';
    setTheme(savedTheme);

    // Load language preference
    const savedLang = localStorage.getItem('tedlist_lang') as Language;
    if (savedLang === 'fa' || savedLang === 'en') {
      setLangState(savedLang);
      document.documentElement.dir = savedLang === 'fa' ? 'rtl' : 'ltr';
      document.documentElement.lang = savedLang;
    } else {
      setLangState('fa');
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'fa';
    }

    const loaded = loadTasksFromStorage();

    // Check if any recurring habit task was completed in the past and should roll over for today
    let modified = false;
    const refreshed = loaded.map((task) => {
      if (task.recurrence && task.recurrence !== 'none' && task.completed && task.dueDate < today) {
        modified = true;
        return {
          ...task,
          completed: false,
          dueDate: today,
          updatedAt: new Date().toISOString(),
        };
      }
      return task;
    });

    if (modified) {
      saveTasksToStorage(refreshed);
      setTasks(refreshed);
    } else {
      setTasks(loaded);
    }

    const reviews = loadWeeklyReviewsFromStorage();
    setWeeklyReviews(reviews);

    // Saturday Review popup: If today is Saturday and user logged tasks during the week, show review modal
    if (isSat) {
      const hasWeekTasks = loaded.some(
        (t) => t.dueDate >= prevRange.start && t.dueDate <= prevRange.end
      );
      const dismissed = isSaturdayModalDismissed(prevRange.start);
      if (hasWeekTasks && !dismissed) {
        setIsSaturdayReviewModalOpen(true);
      }
    }

    // First-time onboarding: Tutorial first, then APK prompt
    const tutorialSeen = localStorage.getItem('tedlist_tutorial_seen_v1');
    if (!tutorialSeen) {
      setIsTutorialOpen(true);
    }

    setIsMounted(true);
  }, []);

  const openTutorial = useCallback(() => {
    setIsTutorialOpen(true);
  }, []);

  const openPwaPrompt = useCallback(() => {
    if (!isAppInstalledOrNative()) {
      setIsPwaPromptOpen(true);
    }
  }, []);

  const completeTutorial = useCallback(() => {
    setIsTutorialOpen(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('tedlist_tutorial_seen_v1', 'true');
      const pwaPrompted = localStorage.getItem('tedlist_pwa_prompted');
      // Only open APK download prompt on web browsers, not inside native app or installed PWA
      if (!pwaPrompted && !isAppInstalledOrNative()) {
        setTimeout(() => {
          setIsPwaPromptOpen(true);
        }, 400);
      }
    }
  }, []);

  const dismissPwaPrompt = useCallback(() => {
    setIsPwaPromptOpen(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('tedlist_pwa_prompted', 'true');
      localStorage.setItem('tedlist_apk_installed', 'true');
    }
  }, []);

  const installPwa = useCallback(() => {
    if (typeof window !== 'undefined') {
      const link = document.createElement('a');
      link.href = '/tedlist.apk';
      link.download = 'tedlist.apk';
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
    dismissPwaPrompt();
  }, [dismissPwaPrompt]);

  // Handle Android hardware back button gracefully
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      if (Capacitor.isNativePlatform()) {
        const backListener = CapApp.addListener('backButton', ({ canGoBack }) => {
          if (isTaskModalOpen) {
            setIsTaskModalOpen(false);
            setEditingTask(null);
          } else if (isSaturdayReviewModalOpen) {
            setIsSaturdayReviewModalOpen(false);
          } else if (isBackupModalOpen) {
            setIsBackupModalOpen(false);
          } else if (isTutorialOpen) {
            setIsTutorialOpen(false);
          } else if (isPwaPromptOpen) {
            setIsPwaPromptOpen(false);
          } else if (canGoBack) {
            window.history.back();
          } else {
            CapApp.exitApp();
          }
        });
        return () => {
          backListener.then((h) => h.remove?.()).catch(() => {});
        };
      }
    } catch {
      // Non-native fallback
    }
  }, [
    isTaskModalOpen,
    isSaturdayReviewModalOpen,
    isBackupModalOpen,
    isTutorialOpen,
    isPwaPromptOpen,
  ]);

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
      recurrence?: Recurrence;
    }) => {
      triggerHaptic('light');
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
        recurrence: data.recurrence || 'none',
        streak: 0,
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
          triggerHaptic(nextCompleted ? 'success' : 'light');

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

          // Habit streak logic
          let streak = t.streak || 0;
          let lastCompletedDate = t.lastCompletedDate;
          const currentDayStr = todayStr || getTodayString();

          if (t.recurrence && t.recurrence !== 'none') {
            if (nextCompleted) {
              if (lastCompletedDate !== currentDayStr) {
                streak += 1;
                lastCompletedDate = currentDayStr;
              }
            } else {
              if (lastCompletedDate === currentDayStr) {
                streak = Math.max(0, streak - 1);
                lastCompletedDate = undefined;
              }
            }
          }

          return {
            ...t,
            completed: nextCompleted,
            streak,
            lastCompletedDate,
            completedAt: nextCompleted ? new Date().toISOString() : undefined,
            updatedAt: new Date().toISOString(),
          };
        })
      );
    },
    [updateTasks, todayStr]
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
      triggerHaptic('light');
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
      triggerHaptic('selection');
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

  const completeAllTodayTasks = useCallback(() => {
    const curToday = todayStr || getTodayString();
    triggerHaptic('success');
    updateTasks((prev) =>
      prev.map((t) => {
        if (t.dueDate === curToday && !t.completed) {
          return {
            ...t,
            completed: true,
            completedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        }
        return t;
      })
    );
  }, [updateTasks, todayStr]);

  const [testNotificationToast, setTestNotificationToast] = useState<string | null>(null);

  const clearTestNotificationToast = useCallback(() => {
    setTestNotificationToast(null);
  }, []);

  const runNotificationTest30s = useCallback(async (): Promise<boolean> => {
    const curToday = todayStr || getTodayString();
    const todayPending = tasks.filter((t) => t.dueDate === curToday && !t.completed);
    const success = await schedule30sTestNotification(todayPending);
    if (success) {
      triggerHaptic('success');
      setTestNotificationToast(
        lang === 'fa'
          ? 'اعلان برای ۳۰ ثانیه دیگر زمان‌بندی شد! می‌توانید برنامه را ببندید تا دریافت آن را تست کنید.'
          : 'Notification scheduled for 30s! Close the app to test.'
      );
      setTimeout(() => setTestNotificationToast(null), 7000);
    }
    return success;
  }, [tasks, todayStr, lang]);

  // Sync Native Android Widget & Schedule Nightly 23:00 Tehran Reminder
  useEffect(() => {
    if (!isMounted || typeof window === 'undefined') return;

    const curToday = todayStr || getTodayString();
    const todayTasks = tasks.filter((t) => t.dueDate === curToday);
    const todayPending = todayTasks.filter((t) => !t.completed);
    const todayCompletedCount = todayTasks.filter((t) => t.completed).length;

    // 1. Sync native Android widget
    syncNativeWidget(todayTasks, todayCompletedCount);

    // 2. Schedule 23:00 Tehran nightly reminder
    scheduleNightlyReminder(todayPending);
  }, [tasks, todayStr, isMounted]);

  // Listen for Notification Action Buttons (e.g. Complete All)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let sub: any;
    try {
      LocalNotifications.addListener('localNotificationActionPerformed', (notificationAction) => {
        if (notificationAction.actionId === 'COMPLETE_ALL') {
          completeAllTodayTasks();
        }
      }).then((s) => {
        sub = s;
      });
    } catch {
      // ignore
    }

    return () => {
      try {
        sub?.remove?.();
      } catch {
        // ignore
      }
    };
  }, [completeAllTodayTasks]);

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
        theme,
        setTheme,
        toggleTheme,
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
        completeAllTodayTasks,
        runNotificationTest30s,
        testNotificationToast,
        clearTestNotificationToast,
        isPwaPromptOpen,
        isPwaInstallable: true,
        openPwaPrompt,
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
