'use client';

import React, { useState } from 'react';
import { Task, Priority } from '@/types/todo';
import { useTodo } from '@/context/TodoContext';
import { formatDisplayDate, isOverdue, getTodayString, getTomorrowString, addDays } from '@/lib/date-utils';
import {
  Check,
  Clock,
  Calendar,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Pencil,
  ArrowRightCircle,
  Repeat,
  Flame,
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
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);

  // Mobile swipe gestures
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const isRtl = lang === 'fa';
  const SWIPE_THRESHOLD = 70;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (showMenu || isAddingSubtask) return;
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
    setIsSwiping(false);
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
      const clamped = Math.max(-110, Math.min(110, diffX * 0.75));
      setSwipeOffset(clamped);
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

  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* Mobile Swipe Action Reveal Backgrounds */}
      {isSwiping && (
        <div className="absolute inset-0 rounded-xl flex items-center justify-between px-4 text-xs font-semibold select-none pointer-events-none">
          {/* Postpone Indicator */}
          <div
            className={`flex items-center gap-1.5 transition-opacity ${
              (isRtl ? swipeOffset > 20 : swipeOffset < -20)
                ? 'opacity-100 text-indigo-500'
                : 'opacity-0'
            }`}
          >
            <ArrowRightCircle className="w-4 h-4" />
            <span>{t.moveTomorrow}</span>
          </div>

          {/* Complete Indicator */}
          <div
            className={`flex items-center gap-1.5 transition-opacity ${
              (isRtl ? swipeOffset < -20 : swipeOffset > 20)
                ? 'opacity-100 text-emerald-500'
                : 'opacity-0'
            }`}
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>{task.completed ? t.markIncomplete : t.markComplete}</span>
          </div>
        </div>
      )}

      {/* Main Task Card */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `translateX(${swipeOffset}px)`,
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

            {/* Quick Reschedule dropdown trigger */}
            <div className="relative inline-block ml-auto">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title={t.reschedule}
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </button>

              {showMenu && (
                <div
                  className="absolute right-0 rtl:right-auto rtl:left-0 top-6 z-30 w-44 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl py-1 text-xs"
                  onMouseLeave={() => setShowMenu(false)}
                >
                  <p className="px-3 py-1 text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                    {t.reschedule}
                  </p>
                  <button
                    onClick={() => {
                      if (todayStr) rescheduleTask(task.id, todayStr);
                      setShowMenu(false);
                    }}
                    className="w-full text-left rtl:text-right px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2 text-slate-700 dark:text-slate-200"
                  >
                    <ArrowRightCircle className="w-3 h-3 text-amber-500 shrink-0" />
                    <span>{t.moveToday}</span>
                  </button>
                  <button
                    onClick={() => {
                      if (tomorrowStr) rescheduleTask(task.id, tomorrowStr);
                      setShowMenu(false);
                    }}
                    className="w-full text-left rtl:text-right px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2 text-slate-700 dark:text-slate-200"
                  >
                    <ArrowRightCircle className="w-3 h-3 text-indigo-500 shrink-0" />
                    <span>{t.moveTomorrow}</span>
                  </button>
                  <button
                    onClick={() => {
                      if (todayStr) rescheduleTask(task.id, addDays(todayStr, 3));
                      setShowMenu(false);
                    }}
                    className="w-full text-left rtl:text-right px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2 text-slate-700 dark:text-slate-200"
                  >
                    <ArrowRightCircle className="w-3 h-3 text-purple-500 shrink-0" />
                    <span>{t.move3Days}</span>
                  </button>

                  <div className="border-t border-slate-100 dark:border-slate-700 my-1" />

                  <button
                    onClick={() => {
                      openEditModal(task);
                      setShowMenu(false);
                    }}
                    className="w-full text-left rtl:text-right px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                  >
                    {t.editDetails}
                  </button>
                  <button
                    onClick={() => {
                      deleteTask(task.id);
                      setShowMenu(false);
                    }}
                    className="w-full text-left rtl:text-right px-3 py-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-rose-600 dark:text-rose-400"
                  >
                    {t.deleteTask}
                  </button>
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
