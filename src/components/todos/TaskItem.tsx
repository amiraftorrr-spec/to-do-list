'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Task, Priority } from '@/types/todo';
import { useTodo } from '@/context/TodoContext';
import {
  formatDisplayDate,
  isOverdue,
  addDays,
  getNextSaturday,
  parseDate,
  getLocalDateString,
  formatFullDate,
} from '@/lib/date-utils';
import { getCalendarMonthData, shiftMonth } from '@/lib/calendar-utils';
import { triggerHaptic } from '@/lib/haptics';
import {
  Check,
  Clock,
  Calendar,
  CalendarDays,
  Sun,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  Pencil,
  ArrowRightCircle,
  Repeat,
  Flame,
  RotateCcw,
  X,
} from 'lucide-react';

export function TaskItem({ task }: { task: Task }) {
  const {
    todayStr,
    tomorrowStr,
    toggleTask,
    deleteTask,
    rescheduleTask,
    openEditModal,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
    lang,
    t,
  } = useTodo();

  const [isExpanded, setIsExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const [isChoosingDate, setIsChoosingDate] = useState(false);
  const [calendarRefDate, setCalendarRefDate] = useState<Date>(() =>
    task.dueDate ? parseDate(task.dueDate) : new Date()
  );
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);

  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuDropdownRef = useRef<HTMLDivElement>(null);

  const isTaskToday = todayStr ? task.dueDate === todayStr : false;
  const isTaskTomorrow = tomorrowStr ? task.dueDate === tomorrowStr : false;

  const in2DaysStr = todayStr ? addDays(todayStr, 2) : '';
  const nextSatStr = todayStr ? getLocalDateString(getNextSaturday(parseDate(todayStr))) : '';
  const nextWeekStr = todayStr ? addDays(todayStr, 7) : '';

  const isRtl = lang === 'fa';
  const SWIPE_THRESHOLD = 70;

  const miniMonthData = useMemo(() => {
    return getCalendarMonthData(calendarRefDate, lang);
  }, [calendarRefDate, lang]);

  const handleMiniPrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCalendarRefDate((prev) => shiftMonth(prev, -1, lang));
  };

  const handleMiniNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCalendarRefDate((prev) => shiftMonth(prev, 1, lang));
  };

  // Mobile swipe gestures
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const hasTriggeredHapticRef = useRef(false);

  // Close menu on click / tap outside
  useEffect(() => {
    if (!showMenu) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (
        menuDropdownRef.current &&
        !menuDropdownRef.current.contains(target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(target)
      ) {
        setShowMenu(false);
        setIsChoosingDate(false);
      }
    };

    document.addEventListener('pointerdown', handleClickOutside);
    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
    };
  }, [showMenu]);

  const handleToggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!showMenu && menuButtonRef.current) {
      const rect = menuButtonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      // If there is less than 280px below and enough space above, open upward
      setOpenUpward(spaceBelow < 280 && rect.top > 260);
      setIsChoosingDate(false);
      setCalendarRefDate(task.dueDate ? parseDate(task.dueDate) : new Date());
    } else {
      setIsChoosingDate(false);
    }
    setShowMenu((prev) => !prev);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (showMenu || isAddingSubtask) return;
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
    setIsSwiping(false);
    hasTriggeredHapticRef.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null || touchStartY === null) return;
    const diffX = e.touches[0].clientX - touchStartX;
    const diffY = e.touches[0].clientY - touchStartY;

    // Do not hijack vertical scrolling
    if (!isSwiping && Math.abs(diffY) > Math.abs(diffX)) {
      return;
    }

    if (Math.abs(diffX) > 10) {
      setIsSwiping(true);
      const clamped = Math.max(-120, Math.min(120, diffX * 0.75));
      setSwipeOffset(clamped);

      if (Math.abs(clamped) >= SWIPE_THRESHOLD && !hasTriggeredHapticRef.current) {
        hasTriggeredHapticRef.current = true;
        triggerHaptic('medium');
      } else if (Math.abs(clamped) < SWIPE_THRESHOLD && hasTriggeredHapticRef.current) {
        hasTriggeredHapticRef.current = false;
      }
    }
  };

  const handleTouchEnd = () => {
    if (isSwiping) {
      const isCompleteAction = isRtl ? swipeOffset < -SWIPE_THRESHOLD : swipeOffset > SWIPE_THRESHOLD;
      const isPostponeAction = isRtl ? swipeOffset > SWIPE_THRESHOLD : swipeOffset < -SWIPE_THRESHOLD;

      if (isCompleteAction) {
        toggleTask(task.id);
      } else if (isPostponeAction && tomorrowStr) {
        rescheduleTask(task.id, tomorrowStr);
      }
    }
    setTouchStartX(null);
    setTouchStartY(null);
    setSwipeOffset(0);
    setIsSwiping(false);
    hasTriggeredHapticRef.current = false;
  };

  const overdue = todayStr ? isOverdue(task.dueDate, task.completed) : false;
  const dateLabel = formatDisplayDate(task.dueDate, lang);

  const completedSubtasksCount = task.subtasks.filter((s) => s.completed).length;
  const totalSubtasks = task.subtasks.length;

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    addSubtask(task.id, newSubtaskTitle.trim());
    setNewSubtaskTitle('');
    setIsAddingSubtask(false);
  };

  const getPriorityLabel = (priority: Priority) => {
    switch (priority) {
      case 'urgent':
        return t.priorityUrgent;
      case 'high':
        return t.priorityHigh;
      case 'medium':
        return t.priorityMedium;
      case 'low':
      default:
        return t.priorityLow;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'General': return t.catGeneral;
      case 'Personal': return t.catPersonal;
      case 'Work': return t.catWork;
      case 'Habits': return t.catHabits;
      case 'Learning': return t.catLearning;
      case 'Health': return t.catHealth;
      default: return category;
    }
  };

  const getPriorityStyle = (priority: Priority) => {
    switch (priority) {
      case 'urgent':
        return 'text-rose-600 dark:text-rose-400 font-semibold';
      case 'high':
        return 'text-amber-600 dark:text-amber-400 font-medium';
      case 'medium':
        return 'text-slate-500 dark:text-slate-400';
      case 'low':
      default:
        return 'text-slate-400 dark:text-slate-500';
    }
  };

  const isThresholdMet = Math.abs(swipeOffset) >= SWIPE_THRESHOLD;
  const isSwipingRight = swipeOffset > 0;
  const isSwipingLeft = swipeOffset < 0;

  // In RTL: swipeOffset < 0 (left) = Complete, swipeOffset > 0 (right) = Postpone
  // In LTR: swipeOffset > 0 (right) = Complete, swipeOffset < 0 (left) = Postpone
  const isCompleteSwipe = isRtl ? isSwipingLeft : isSwipingRight;
  const isPostponeSwipe = isRtl ? isSwipingRight : isSwipingLeft;

  const badgeIconColor = isCompleteSwipe
    ? task.completed
      ? 'text-amber-600'
      : 'text-emerald-600'
    : 'text-indigo-600';

  return (
    <div
      className={`relative rounded-xl transition-all ${
        showMenu ? 'z-40 overflow-visible' : isSwiping ? 'overflow-hidden' : 'overflow-hidden'
      }`}
    >
      {/* Mobile Swipe Action Reveal Background */}
      {isSwiping && (
        <div
          className={`absolute inset-0 rounded-xl select-none pointer-events-none transition-colors duration-150 overflow-hidden ${
            isCompleteSwipe
              ? task.completed
                ? isThresholdMet
                  ? 'bg-amber-600'
                  : 'bg-amber-600/80'
                : isThresholdMet
                ? 'bg-emerald-600'
                : 'bg-emerald-600/85'
              : isPostponeSwipe
              ? isThresholdMet
                ? 'bg-indigo-600'
                : 'bg-indigo-600/85'
              : 'bg-slate-200 dark:bg-slate-800'
          }`}
        >
          {/* Swiping Left reveals Right edge */}
          {isSwipingLeft && (
            <div
              className={`absolute right-3.5 inset-y-0 flex items-center gap-2 text-white transition-all duration-150 ${
                isThresholdMet ? 'scale-105 font-bold' : 'scale-95 font-medium opacity-90'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all shadow-sm ${
                  isThresholdMet
                    ? `bg-white ${badgeIconColor}`
                    : 'bg-white/20 text-white'
                }`}
              >
                {isCompleteSwipe ? (
                  task.completed ? (
                    <RotateCcw className="w-4 h-4 stroke-[2.5]" />
                  ) : (
                    <Check className="w-4 h-4 stroke-[3]" />
                  )
                ) : (
                  <ArrowRightCircle className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                )}
              </div>
              <span className="text-xs">
                {isCompleteSwipe
                  ? task.completed
                    ? t.markIncomplete
                    : t.markComplete
                  : t.moveTomorrow}
              </span>
            </div>
          )}

          {/* Swiping Right reveals Left edge */}
          {isSwipingRight && (
            <div
              className={`absolute left-3.5 inset-y-0 flex items-center gap-2 text-white transition-all duration-150 ${
                isThresholdMet ? 'scale-105 font-bold' : 'scale-95 font-medium opacity-90'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all shadow-sm ${
                  isThresholdMet
                    ? `bg-white ${badgeIconColor}`
                    : 'bg-white/20 text-white'
                }`}
              >
                {isCompleteSwipe ? (
                  task.completed ? (
                    <RotateCcw className="w-4 h-4 stroke-[2.5]" />
                  ) : (
                    <Check className="w-4 h-4 stroke-[3]" />
                  )
                ) : (
                  <ArrowRightCircle className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                )}
              </div>
              <span className="text-xs">
                {isCompleteSwipe
                  ? task.completed
                    ? t.markIncomplete
                    : t.markComplete
                  : t.moveTomorrow}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Main Task Card */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: isSwiping && swipeOffset !== 0 ? `translateX(${swipeOffset}px)` : undefined,
          transition: isSwiping ? 'none' : 'transform 0.22s cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
        className={`group relative rounded-xl border transition-colors duration-200 ${
          task.completed
            ? 'bg-slate-100/40 border-slate-200/50 dark:bg-slate-900/20 dark:border-slate-800/40 opacity-70'
            : overdue
            ? 'bg-rose-50/30 border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/40 shadow-xs'
            : 'bg-[var(--color-card)] border-[var(--color-border)] hover:border-indigo-400/50 dark:hover:border-indigo-500/30 shadow-xs'
        }`}
      >
        <div className="p-3.5 sm:p-4 flex items-start gap-3">
        {/* Tactile Checkbox Button */}
        <button
          onClick={() => toggleTask(task.id)}
          className={`task-checkbox mt-0.5 shrink-0 w-5 h-5 rounded-md border flex items-center justify-center cursor-pointer transition-all ${
            task.completed
              ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm shadow-emerald-500/30'
              : 'border-slate-300 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-400 bg-white dark:bg-slate-800/80 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20'
          }`}
          aria-label={task.completed ? t.markIncomplete : t.markComplete}
        >
          {task.completed && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
        </button>

        {/* Center Content: Title, Notes, Badges */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3
              onClick={() => setIsExpanded(!isExpanded)}
              className={`text-sm font-medium leading-snug cursor-pointer select-none transition-colors ${
                task.completed
                  ? 'line-through text-slate-400 dark:text-slate-500'
                  : 'text-slate-800 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              {task.title}
            </h3>

            {/* Quick Actions Desktop */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => openEditModal(task)}
                className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title={t.editDetails}
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                title={t.deleteTask}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Description snippet if present and not expanded */}
          {task.description && !isExpanded && (
            <p
              onClick={() => setIsExpanded(true)}
              className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1 cursor-pointer"
            >
              {task.description}
            </p>
          )}

          {/* Clean Meta Details */}
          <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
            {/* Due Date */}
            <span
              className={`inline-flex items-center gap-1 ${
                overdue
                  ? 'text-rose-600 dark:text-rose-400 font-medium'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 opacity-70" />
              <span>{dateLabel}</span>
              {task.dueTime && (
                <span className="flex items-center gap-0.5 ml-0.5 opacity-80 font-mono">
                  <Clock className="w-3 h-3" /> {task.dueTime}
                </span>
              )}
            </span>

            <span className="text-slate-300 dark:text-slate-700">•</span>

            {/* Priority */}
            <span className={`capitalize ${getPriorityStyle(task.priority)}`}>
              {getPriorityLabel(task.priority)}
            </span>

            <span className="text-slate-300 dark:text-slate-700">•</span>

            {/* Category */}
            <span className="text-slate-500 dark:text-slate-400">
              {getCategoryLabel(task.category)}
            </span>

            {/* Recurrence & Streak Badges */}
            {task.recurrence && task.recurrence !== 'none' && (
              <>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="inline-flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                  <Repeat className="w-3 h-3" />
                  <span>
                    {task.recurrence === 'daily'
                      ? t.recDaily
                      : task.recurrence === 'weekdays'
                      ? t.recWeekdays
                      : t.recWeekly}
                  </span>
                </span>
                {typeof task.streak === 'number' && task.streak > 0 && (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[10px] font-medium font-mono">
                    <Flame className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                    <span>{task.streak}</span>
                  </span>
                )}
              </>
            )}

            {/* Subtasks Summary */}
            {totalSubtasks > 0 && (
              <>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="inline-flex items-center gap-1 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  <span>
                    {t.stepsDone(completedSubtasksCount, totalSubtasks)}
                  </span>
                  {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </>
            )}

            {/* Quick Reschedule & Actions dropdown trigger */}
            <div className="relative inline-block ml-auto">
              <button
                ref={menuButtonRef}
                onClick={handleToggleMenu}
                className={`p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
                  showMenu ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200' : ''
                }`}
                title={t.moreOptions}
                aria-label={t.moreOptions}
                aria-expanded={showMenu}
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </button>

              {showMenu && (
                <div
                  ref={menuDropdownRef}
                  className={`absolute ${isRtl ? 'left-0' : 'right-0'} ${
                    openUpward ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
                  } z-50 ${isChoosingDate ? 'w-56' : 'w-48'} rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl py-1.5 text-xs animate-in fade-in zoom-in-95 duration-100 select-none`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {isChoosingDate ? (
                    <div className="space-y-2 p-1" onClick={(e) => e.stopPropagation()}>
                      {/* Header with Title & Close */}
                      <div className="flex items-center justify-between px-2 pb-1.5 border-b border-slate-100 dark:border-slate-700/80">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <CalendarDays className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                          <span className="font-semibold text-slate-800 dark:text-slate-100 text-xs truncate">
                            {t.chooseDateTitle}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsChoosingDate(false)}
                          className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Current Date Display */}
                      <div className="px-2">
                        <span className="inline-block text-[10px] font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-200/50 dark:border-indigo-800/40">
                          {formatFullDate(task.dueDate, lang)}
                        </span>
                      </div>

                      {/* Quick Shortcut Buttons */}
                      <div className="flex flex-wrap gap-1 px-2">
                        {tomorrowStr && tomorrowStr !== task.dueDate && (
                          <button
                            type="button"
                            onClick={() => {
                              rescheduleTask(task.id, tomorrowStr);
                              setShowMenu(false);
                              setIsChoosingDate(false);
                            }}
                            className="px-2 py-0.5 text-[10px] rounded bg-slate-100 dark:bg-slate-700/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                          >
                            {t.moveTomorrow}
                          </button>
                        )}
                        {in2DaysStr && in2DaysStr !== task.dueDate && (
                          <button
                            type="button"
                            onClick={() => {
                              rescheduleTask(task.id, in2DaysStr);
                              setShowMenu(false);
                              setIsChoosingDate(false);
                            }}
                            className="px-2 py-0.5 text-[10px] rounded bg-slate-100 dark:bg-slate-700/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                          >
                            {t.in2Days}
                          </button>
                        )}
                        {nextSatStr && nextSatStr !== task.dueDate && (
                          <button
                            type="button"
                            onClick={() => {
                              rescheduleTask(task.id, nextSatStr);
                              setShowMenu(false);
                              setIsChoosingDate(false);
                            }}
                            className="px-2 py-0.5 text-[10px] rounded bg-slate-100 dark:bg-slate-700/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                          >
                            {t.saturday}
                          </button>
                        )}
                        {nextWeekStr && nextWeekStr !== task.dueDate && (
                          <button
                            type="button"
                            onClick={() => {
                              rescheduleTask(task.id, nextWeekStr);
                              setShowMenu(false);
                              setIsChoosingDate(false);
                            }}
                            className="px-2 py-0.5 text-[10px] rounded bg-slate-100 dark:bg-slate-700/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                          >
                            {t.nextWeek}
                          </button>
                        )}
                      </div>

                      {/* Interactive Mini Calendar: Persian (Solar Hijri) in FA, Gregorian in EN */}
                      <div className="px-2 pt-1 border-t border-slate-100 dark:border-slate-700/80">
                        {/* Month navigation */}
                        <div className="flex items-center justify-between pb-1.5">
                          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                            {miniMonthData.title}
                          </span>
                          <div className="flex items-center gap-0.5">
                            <button
                              type="button"
                              onClick={isRtl ? handleMiniNextMonth : handleMiniPrevMonth}
                              className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                              aria-label="Previous month"
                            >
                              <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
                            </button>
                            <button
                              type="button"
                              onClick={isRtl ? handleMiniPrevMonth : handleMiniNextMonth}
                              className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                              aria-label="Next month"
                            >
                              <ChevronLeft className="w-3.5 h-3.5 rtl:rotate-180" />
                            </button>
                          </div>
                        </div>

                        {/* Weekday headers */}
                        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-medium text-slate-400 dark:text-slate-500 pb-1">
                          {miniMonthData.weekdays.map((w, idx) => (
                            <div key={idx}>{w}</div>
                          ))}
                        </div>

                        {/* Calendar days grid */}
                        <div className="grid grid-cols-7 gap-1">
                          {Array.from({ length: miniMonthData.startOffset }).map((_, idx) => (
                            <div key={`empty-${idx}`} className="h-6 w-6" />
                          ))}

                          {miniMonthData.days.map((day) => {
                            const isSelected = day.dateStr === task.dueDate;
                            const isToday = day.dateStr === todayStr;

                            return (
                              <button
                                key={day.dateStr}
                                type="button"
                                onClick={() => {
                                  rescheduleTask(task.id, day.dateStr);
                                  setShowMenu(false);
                                  setIsChoosingDate(false);
                                }}
                                className={`h-6 w-6 mx-auto rounded-md flex items-center justify-center text-[11px] transition-colors cursor-pointer font-medium ${
                                  isSelected
                                    ? 'bg-indigo-600 text-white font-bold shadow-xs'
                                    : isToday
                                    ? 'border border-indigo-500/50 text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50/50 dark:bg-indigo-950/20'
                                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                                }`}
                              >
                                {day.dayNumber}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="px-3 py-1 text-[10px] uppercase font-semibold text-slate-400 dark:text-slate-500 tracking-wider flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{t.reschedule}</span>
                      </p>
                      {/* Move to Today (only shown if not already for today) */}
                      {!isTaskToday && (
                        <button
                          onClick={() => {
                            if (todayStr) rescheduleTask(task.id, todayStr);
                            setShowMenu(false);
                          }}
                          className="w-full text-left rtl:text-right px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700/60 flex items-center gap-2.5 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                        >
                          <Sun className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span>{t.moveToday}</span>
                        </button>
                      )}

                      {/* Move to Tomorrow (only shown if not already for tomorrow) */}
                      {!isTaskTomorrow && (
                        <button
                          onClick={() => {
                            if (tomorrowStr) rescheduleTask(task.id, tomorrowStr);
                            setShowMenu(false);
                          }}
                          className="w-full text-left rtl:text-right px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700/60 flex items-center gap-2.5 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                        >
                          <Calendar className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                          <span>{t.moveTomorrow}</span>
                        </button>
                      )}

                      {/* Choose Custom Day / Date */}
                      <button
                        type="button"
                        onClick={() => {
                          setCalendarRefDate(task.dueDate ? parseDate(task.dueDate) : new Date());
                          setIsChoosingDate(true);
                        }}
                        className="w-full text-left rtl:text-right px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700/60 flex items-center gap-2.5 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                      >
                        <CalendarDays className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                        <span>{t.chooseDate}</span>
                      </button>

                      <div className="border-t border-slate-100 dark:border-slate-700/80 my-1" />

                      <button
                        onClick={() => {
                          toggleTask(task.id);
                          setShowMenu(false);
                        }}
                        className="w-full text-left rtl:text-right px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700/60 flex items-center gap-2.5 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 stroke-[2.5]" />
                        <span>{task.completed ? t.markIncomplete : t.markComplete}</span>
                      </button>

                      <button
                        onClick={() => {
                          openEditModal(task);
                          setShowMenu(false);
                        }}
                        className="w-full text-left rtl:text-right px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700/60 flex items-center gap-2.5 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{t.editDetails}</span>
                      </button>

                      <button
                        onClick={() => {
                          deleteTask(task.id);
                          setShowMenu(false);
                        }}
                        className="w-full text-left rtl:text-right px-3 py-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2.5 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>{t.deleteTask}</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Expanded Content: Description & Subtasks */}
          {isExpanded && (
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
              {task.description && (
                <div className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                  {task.description}
                </div>
              )}

              {/* Subtasks Checklist */}
              <div className="space-y-1.5">
                <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  {t.checklistHeader(completedSubtasksCount, totalSubtasks)}
                </p>

                {task.subtasks.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between gap-2 py-1 px-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800/40 group/sub"
                  >
                    <button
                      onClick={() => toggleSubtask(task.id, sub.id)}
                      className="flex items-center gap-2 text-xs text-left rtl:text-right cursor-pointer flex-1"
                    >
                      <span
                        className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${
                          sub.completed
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-slate-300 dark:border-slate-600'
                        }`}
                      >
                        {sub.completed && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </span>
                      <span
                        className={
                          sub.completed
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-700 dark:text-slate-200'
                        }
                      >
                        {sub.title}
                      </span>
                    </button>
                    <button
                      onClick={() => deleteSubtask(task.id, sub.id)}
                      className="opacity-0 group-hover/sub:opacity-100 p-0.5 text-slate-400 hover:text-rose-600 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {/* Add Subtask Input */}
                {isAddingSubtask ? (
                  <form onSubmit={handleAddSubtask} className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      autoFocus
                      value={newSubtaskTitle}
                      onChange={(e) => setNewSubtaskTitle(e.target.value)}
                      placeholder={t.stepPlaceholder}
                      className="flex-1 text-xs px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-hidden focus:border-indigo-500 text-slate-800 dark:text-slate-200"
                    />
                    <button
                      type="submit"
                      className="px-2.5 py-1 text-xs rounded bg-indigo-600 text-white hover:bg-indigo-500 font-medium cursor-pointer"
                    >
                      {t.addBtn}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingSubtask(false)}
                      className="px-2 py-1 text-xs rounded text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer transition-colors"
                    >
                      {t.cancelBtn}
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setIsAddingSubtask(true)}
                    className="flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 pt-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>{t.addStep}</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}
