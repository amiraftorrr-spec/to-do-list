'use client';

import React, { useState, useEffect } from 'react';
import { useTodo } from '@/context/TodoContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { AppHeader } from '@/components/layout/AppHeader';
import { TaskItem } from '@/components/todos/TaskItem';
import { DailyPlanner } from '@/components/todos/DailyPlanner';
import { TaskFormModal } from '@/components/todos/TaskFormModal';
import { SaturdayReviewModal } from '@/components/review/SaturdayReviewModal';
import { BackupModal } from '@/components/backup/BackupModal';
import { OnboardingTutorialModal } from '@/components/tutorial/OnboardingTutorialModal';
import { PwaInstallPromptModal } from '@/components/pwa/PwaInstallPromptModal';
import { getTodayString, isOverdue } from '@/lib/date-utils';
import {
  Sun,
  CalendarDays,
  Award,
  Layers,
  CheckCircle2,
  Plus,
  AlertTriangle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  X,
} from 'lucide-react';

export function TodoDashboard() {
  const {
    isMounted,
    todayStr,
    tasks,
    viewMode,
    setViewMode,
    selectedCategory,
    selectedPriority,
    searchQuery,
    openCreateModal,
    isSaturdayToday,
    setIsSaturdayReviewModalOpen,
    t,
    lang,
  } = useTodo();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);

  // Keyboard shortcut listener for 'N' to add task
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === 'n' || e.key === 'N') &&
        !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)
      ) {
        e.preventDefault();
        openCreateModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openCreateModal]);

  // Filter tasks based on search, space/category, priority
  const filterTask = (t: (typeof tasks)[0]) => {
    if (selectedCategory !== 'All' && t.category !== selectedCategory) return false;
    if (selectedPriority !== 'All' && t.priority !== selectedPriority) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchDesc = t.description?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc) return false;
    }
    return true;
  };

  const filteredTasks = tasks.filter(filterTask);

  if (!isMounted) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--color-background)]">
        <div className="flex items-center gap-3 text-stone-500 text-xs">
          <div className="w-5 h-5 border-2 border-stone-400 border-t-transparent rounded-full animate-spin" />
          <span>Opening your workspace...</span>
        </div>
      </div>
    );
  }

  // Grouped tasks for "Today" view
  const overdueTasks = filteredTasks.filter((t) => isOverdue(t.dueDate, t.completed));
  const todayTasks = filteredTasks.filter((t) => t.dueDate === todayStr && !t.completed);
  const todayCompleted = filteredTasks.filter(
    (t) => t.completed && (t.dueDate === todayStr || t.completedAt?.startsWith(todayStr))
  );

  const totalTodayGoal = todayTasks.length + todayCompleted.length;
  const progressPercent = totalTodayGoal > 0 ? Math.round((todayCompleted.length / totalTodayGoal) * 100) : 0;

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-background)]">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-full">
        <Sidebar />
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          <div
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-xs bg-white dark:bg-stone-900 h-full z-50 flex flex-col">
            <div className="p-3 border-b border-stone-200 dark:border-stone-800 flex justify-end">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded text-stone-500 hover:text-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <Sidebar onClose={() => setIsMobileMenuOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Header */}
        <AppHeader onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

        {/* Scrollable View Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          {/* VIEW: TODAY */}
          {viewMode === 'today' && (
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Today's Progress Strip */}
              <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white/60 dark:bg-stone-900/40 p-4 shadow-2xs">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-stone-800 dark:text-stone-200">
                      {t.todayMomentum}
                    </span>
                    <span className="text-stone-400 font-mono">
                      {t.tasksDoneSummary(todayCompleted.length, totalTodayGoal)}
                    </span>
                  </div>
                  <span className="font-mono font-semibold text-stone-700 dark:text-stone-300">
                    {progressPercent}%
                  </span>
                </div>
                <div className="w-full bg-stone-200 dark:bg-stone-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
                  <div
                    className="bg-stone-900 dark:bg-stone-100 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Overdue Section (if any) */}
              {overdueTasks.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-700 dark:text-rose-400">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{t.overdueTasks(overdueTasks.length)}</span>
                  </div>
                  <div className="space-y-2">
                    {overdueTasks.map((task) => (
                      <TaskItem key={task.id} task={task} />
                    ))}
                  </div>
                </div>
              )}

              {/* Today's Active Tasks */}
              <div className="space-y-2">
                <div className="flex items-center justify-between pb-1">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                    {t.focusForToday(todayTasks.length)}
                  </h3>
                  <button
                    onClick={() => openCreateModal(todayStr)}
                    className="flex items-center gap-1 text-xs text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200 font-medium cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{t.addTaskBtn}</span>
                  </button>
                </div>

                {todayTasks.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-stone-200 dark:border-stone-800 rounded-2xl p-6 space-y-3 bg-white/30 dark:bg-stone-900/20">
                    <div className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center mx-auto text-stone-500">
                      <Sparkles className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-stone-800 dark:text-stone-200">
                        {todayCompleted.length > 0
                          ? t.allClearToday
                          : t.nothingScheduledToday}
                      </h4>
                      <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto mt-1">
                        {todayCompleted.length > 0
                          ? t.allClearSubtitle
                          : t.nothingScheduledSubtitle}
                      </p>
                    </div>
                    <button
                      onClick={() => openCreateModal(todayStr)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 text-xs font-medium cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{t.addFirstTask}</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {todayTasks.map((task) => (
                      <TaskItem key={task.id} task={task} />
                    ))}
                  </div>
                )}
              </div>

              {/* Completed Today Dropdown */}
              {todayCompleted.length > 0 && (
                <div className="pt-4 space-y-2">
                  <button
                    onClick={() => setShowCompleted(!showCompleted)}
                    className="flex items-center gap-1.5 text-xs font-medium text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer"
                  >
                    {showCompleted ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    <span>{t.completedTodayCount(todayCompleted.length)}</span>
                  </button>

                  {showCompleted && (
                    <div className="space-y-2 pt-1 animate-in fade-in duration-150">
                      {todayCompleted.map((task) => (
                        <TaskItem key={task.id} task={task} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* VIEW: UPCOMING / PLANNER */}
          {viewMode === 'upcoming' && <DailyPlanner />}

          {/* VIEW: ALL TASKS */}
          {viewMode === 'all' && (
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="flex items-center justify-between pb-1">
                <p className="text-xs text-stone-500 font-mono">
                  Showing {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
                </p>
                <button
                  onClick={() => openCreateModal()}
                  className="flex items-center gap-1 text-xs text-stone-700 hover:text-stone-900 dark:text-stone-300 font-medium cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New task</span>
                </button>
              </div>

              {filteredTasks.length === 0 ? (
                <div className="py-12 text-center text-xs text-stone-400 border border-dashed border-stone-200 dark:border-stone-800 rounded-xl">
                  No tasks match your active filters.
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredTasks.map((task) => (
                    <TaskItem key={task.id} task={task} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* VIEW: COMPLETED LOG */}
          {viewMode === 'completed' && (
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="pb-1">
                <p className="text-xs text-stone-500 font-mono">
                  Archived accomplishments: {tasks.filter((t) => t.completed).length} total finished
                </p>
              </div>

              {tasks.filter((t) => t.completed).length === 0 ? (
                <div className="py-12 text-center text-xs text-stone-400 border border-dashed border-stone-200 dark:border-stone-800 rounded-xl">
                  No completed tasks yet. Finish a task today to see it celebrated here!
                </div>
              ) : (
                <div className="space-y-2">
                  {tasks
                    .filter((t) => t.completed)
                    .map((task) => (
                      <TaskItem key={task.id} task={task} />
                    ))}
                </div>
              )}
            </div>
          )}

          {/* VIEW: SATURDAY REVIEW (If directly navigated) */}
          {viewMode === 'review' && (
            <div className="max-w-2xl mx-auto text-center py-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-medium text-stone-900 dark:text-stone-100">
                Saturday Weekly Review & Scoring
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 max-w-md mx-auto leading-relaxed">
                Click below to launch your weekly evaluation modal, calculate your score out of 100, and audit what was accomplished versus what slipped.
              </p>
              <button
                onClick={() => setIsSaturdayReviewModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 text-xs font-medium cursor-pointer shadow-sm hover:bg-stone-800"
              >
                <span>Launch Weekly Evaluation</span>
              </button>
            </div>
          )}
        </main>

        {/* Mobile Bottom Navigation Bar (PWA Style) */}
        <div className="md:hidden border-t border-[var(--color-border)] bg-[var(--color-card)]/95 backdrop-blur-md flex items-center justify-around py-2.5 px-3 shrink-0 shadow-lg z-20">
          <button
            onClick={() => setViewMode('today')}
            className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors cursor-pointer ${
              viewMode === 'today' ? 'text-stone-900 dark:text-stone-100 font-semibold' : 'text-stone-400'
            }`}
          >
            <Sun className="w-4 h-4" />
            <span>{t.today}</span>
          </button>

          <button
            onClick={() => setViewMode('upcoming')}
            className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors cursor-pointer ${
              viewMode === 'upcoming' ? 'text-stone-900 dark:text-stone-100 font-semibold' : 'text-stone-400'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>{t.planner}</span>
          </button>

          {/* Quick Floating Add */}
          <button
            onClick={() => openCreateModal()}
            className="w-11 h-11 rounded-2xl bg-black text-white flex items-center justify-center -mt-6 shadow-xl active:scale-90 transition-transform cursor-pointer border-2 border-[var(--color-card)] font-bold text-lg"
            title={t.newTask}
          >
            <Plus className="w-5 h-5" />
          </button>

          <button
            onClick={() => setViewMode('completed')}
            className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors cursor-pointer ${
              viewMode === 'completed' ? 'text-stone-900 dark:text-stone-100 font-semibold' : 'text-stone-400'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{t.completedLog}</span>
          </button>

          <button
            onClick={() => setViewMode('all')}
            className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors cursor-pointer ${
              viewMode === 'all' ? 'text-stone-900 dark:text-stone-100 font-semibold' : 'text-stone-400'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{t.allTasks}</span>
          </button>
        </div>
      </div>

      {/* Global Modals */}
      <TaskFormModal />
      <SaturdayReviewModal />
      <BackupModal />
      <OnboardingTutorialModal />
      <PwaInstallPromptModal />
    </div>
  );
}
