'use client';

import React, { useState, useMemo } from 'react';
import { useTodo } from '@/context/TodoContext';
import { TaskItem } from './TaskItem';
import { getCalendarMonthData, shiftMonth } from '@/lib/calendar-utils';
import { formatDisplayDate, parseDate, getTodayString } from '@/lib/date-utils';
import { ChevronRight, ChevronLeft, Plus, Calendar as CalendarIcon, Sparkles } from 'lucide-react';
import { triggerHaptic } from '@/lib/haptics';

export function MonthlyCalendarView() {
  const { tasks, todayStr, openCreateModal, lang, t } = useTodo();

  const [activeDate, setActiveDate] = useState(() => new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(todayStr || getTodayString());

  const monthData = useMemo(() => {
    return getCalendarMonthData(activeDate, lang);
  }, [activeDate, lang]);

  // Tasks grouped by dueDate for quick dot indicators
  const tasksByDate = useMemo(() => {
    const map = new Map<string, number>();
    for (const task of tasks) {
      map.set(task.dueDate, (map.get(task.dueDate) || 0) + 1);
    }
    return map;
  }, [tasks]);

  const selectedDayTasks = useMemo(() => {
    return tasks.filter((t) => t.dueDate === selectedDateStr);
  }, [tasks, selectedDateStr]);

  const handlePrevMonth = () => {
    triggerHaptic('light');
    setActiveDate((prev) => shiftMonth(prev, -1, lang));
  };

  const handleNextMonth = () => {
    triggerHaptic('light');
    setActiveDate((prev) => shiftMonth(prev, 1, lang));
  };

  const handleGoToday = () => {
    triggerHaptic('selection');
    const now = new Date();
    setActiveDate(now);
    setSelectedDateStr(todayStr || getTodayString());
  };

  const isRtl = lang === 'fa';

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Calendar Navigation Card */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-[var(--color-card)] p-4 sm:p-5 shadow-xs space-y-4">
        {/* Month Header & Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100">
                {monthData.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleGoToday}
              className="px-2.5 py-1 text-xs font-medium rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-slate-200 dark:border-slate-800"
            >
              {t.today}
            </button>
            <div className="flex items-center">
              <button
                onClick={isRtl ? handleNextMonth : handlePrevMonth}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Previous month"
              >
                <ChevronRight className="w-4 h-4 rtl:rotate-180" />
              </button>
              <button
                onClick={isRtl ? handlePrevMonth : handleNextMonth}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Next month"
              >
                <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
              </button>
            </div>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-400 dark:text-slate-500 pb-1 border-b border-slate-100 dark:border-slate-800/60">
          {monthData.weekdays.map((w, idx) => (
            <div key={idx} className="py-1">
              {w}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
          {/* Empty Offset cells */}
          {Array.from({ length: monthData.startOffset }).map((_, idx) => (
            <div key={`empty-${idx}`} className="h-10 sm:h-12" />
          ))}

          {/* Days */}
          {monthData.days.map((day) => {
            const isToday = day.dateStr === todayStr;
            const isSelected = day.dateStr === selectedDateStr;
            const taskCount = tasksByDate.get(day.dateStr) || 0;

            return (
              <button
                key={day.dateStr}
                onClick={() => {
                  triggerHaptic('selection');
                  setSelectedDateStr(day.dateStr);
                }}
                className={`group relative h-10 sm:h-12 rounded-xl flex flex-col items-center justify-center text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white font-bold shadow-sm shadow-indigo-600/30'
                    : isToday
                    ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-500/30'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                }`}
              >
                <span>{day.dayNumber}</span>

                {/* Dot for scheduled tasks */}
                {taskCount > 0 && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
                      isSelected
                        ? 'bg-white'
                        : 'bg-indigo-500 dark:bg-indigo-400'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Agenda Section */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-[var(--color-card)] p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/60">
          <div>
            <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              {formatDisplayDate(selectedDateStr, lang)}
            </h4>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
              {t.taskCountLabel(selectedDayTasks.length)}
            </p>
          </div>

          <button
            onClick={() => openCreateModal(selectedDateStr)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium cursor-pointer transition-all shadow-sm shadow-indigo-600/30 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.planForThisDay}</span>
          </button>
        </div>

        {/* Tasks list */}
        {selectedDayTasks.length === 0 ? (
          <div className="py-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
            <p className="text-xs text-slate-400">
              {t.noTasksOnSelectedDay}
            </p>
            <button
              onClick={() => openCreateModal(selectedDateStr)}
              className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              + {t.planForThisDay}
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {selectedDayTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
