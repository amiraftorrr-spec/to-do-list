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
    <div
      className={`group relative rounded-xl border transition-all duration-200 ${
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
          aria-label={task.completed ? 'Mark uncompleted' : 'Mark completed'}
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
                title="Edit task"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                title="Delete task"
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
                      className="px-2 py-1 text-xs rounded text-slate-500 hover:text-slate-800 cursor-pointer"
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
  );
}
