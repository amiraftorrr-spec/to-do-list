'use client';

import React from 'react';
import { useTodo } from '@/context/TodoContext';
import { TaskItem } from './TaskItem';
import { getTodayString, getTomorrowString, addDays, formatDisplayDate } from '@/lib/date-utils';
import { CalendarDays, Plus, ArrowRight } from 'lucide-react';

export function DailyPlanner() {
  const {
    todayStr,
    tomorrowStr,
    tasks,
    openCreateModal,
    selectedCategory,
    selectedPriority,
    searchQuery,
    lang,
    t,
  } = useTodo();

  // Next 7 days
  const upcomingDays = todayStr
    ? [
        tomorrowStr,
        addDays(todayStr, 2),
        addDays(todayStr, 3),
        addDays(todayStr, 4),
        addDays(todayStr, 5),
        addDays(todayStr, 6),
        addDays(todayStr, 7),
      ]
    : [];

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
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Hero Planner Banner: Tomorrow Intention */}
      <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-gradient-to-br from-amber-50/50 via-stone-50 to-stone-100/50 dark:from-stone-900/60 dark:via-stone-900/30 dark:to-stone-950 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 dark:text-amber-300 mb-1.5">
              <CalendarDays className="w-3.5 h-3.5" />
              <span>{t.tomorrowBlueprint}</span>
            </div>
            <h3 className="text-lg font-serif font-medium text-stone-900 dark:text-stone-100">
              {t.tomorrowHeadline}
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 max-w-xl">
              {t.tomorrowDesc}
            </p>
          </div>

          <button
            onClick={() => openCreateModal(tomorrowStr)}
            className="self-start sm:self-center shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-white text-xs font-medium cursor-pointer shadow-xs active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{t.planForTomorrowBtn}</span>
          </button>
        </div>

        {/* Tomorrow Tasks Preview */}
        <div className="mt-5 space-y-2">
          {tomorrowTasks.length === 0 ? (
            <div className="py-4 text-center border border-dashed border-stone-200 dark:border-stone-800 rounded-xl">
              <p className="text-xs text-stone-400">
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

      {/* Upcoming Days Timeline */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-2">
          <h3 className="text-sm font-semibold tracking-tight text-stone-900 dark:text-stone-100">
            {t.next7DaysAhead}
          </h3>
          <span className="text-xs text-stone-400 font-mono">
            {t.proactiveScheduling}
          </span>
        </div>

        <div className="space-y-6">
          {upcomingDays.slice(1).map((dayStr) => {
            const dayTasks = tasks.filter((t) => t.dueDate === dayStr).filter(filterTask);
            const dateLabel = formatDisplayDate(dayStr, lang);

            return (
              <div
                key={dayStr}
                className="rounded-xl border border-stone-200/80 dark:border-stone-800/80 bg-white/40 dark:bg-stone-900/20 p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-stone-400" />
                    <h4 className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                      {dateLabel}
                    </h4>
                    <span className="text-[11px] font-mono text-stone-400">
                      {t.taskCountLabel(dayTasks.length)}
                    </span>
                  </div>

                  <button
                    onClick={() => openCreateModal(dayStr)}
                    className="flex items-center gap-1 text-[11px] font-medium text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 px-2 py-1 rounded hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>{t.addToThisDay}</span>
                  </button>
                </div>

                {dayTasks.length > 0 ? (
                  <div className="space-y-2">
                    {dayTasks.map((task) => (
                      <TaskItem key={task.id} task={task} />
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-stone-400 italic pl-4 rtl:pl-0 rtl:pr-4">
                    {t.emptySlot}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
