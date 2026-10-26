'use client';

import React from 'react';
import { useTodo } from '@/context/TodoContext';
import { TaskItem } from './TaskItem';
import { MonthlyCalendarView } from './MonthlyCalendarView';
import { CalendarDays, Plus } from 'lucide-react';

export function DailyPlanner() {
  const {
    tomorrowStr,
    tasks,
    openCreateModal,
    selectedCategory,
    selectedPriority,
    searchQuery,
    t,
  } = useTodo();

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

  const tomorrowTasks = tasks.filter((t) => t.dueDate === tomorrowStr).filter(filterTask);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Hero Planner Banner: Tomorrow Intention */}
      <div className="rounded-2xl border border-indigo-200 dark:border-indigo-500/20 bg-gradient-to-br from-indigo-50/70 via-white to-slate-50 dark:from-indigo-950/30 dark:via-slate-900/40 dark:to-slate-900 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1.5">
              <CalendarDays className="w-3.5 h-3.5" />
              <span>{t.tomorrowBlueprint}</span>
            </div>
            <h3 className="text-lg font-serif font-medium text-slate-900 dark:text-slate-100">
              {t.tomorrowHeadline}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
              {t.tomorrowDesc}
            </p>
          </div>

          <button
            onClick={() => openCreateModal(tomorrowStr)}
            className="self-start sm:self-center shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium cursor-pointer shadow-sm shadow-indigo-600/30 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{t.planForTomorrowBtn}</span>
          </button>
        </div>

        {/* Tomorrow Tasks Preview */}
        <div className="mt-5 space-y-2">
          {tomorrowTasks.length === 0 ? (
            <div className="py-4 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              <p className="text-xs text-slate-400">
                {t.noTasksTomorrow}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {tomorrowTasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Monthly Interactive Calendar */}
      <MonthlyCalendarView />
    </div>
  );
}
