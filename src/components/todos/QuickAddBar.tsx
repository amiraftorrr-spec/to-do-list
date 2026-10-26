'use client';

import React, { useState } from 'react';
import { useTodo } from '@/context/TodoContext';
import { parseQuickTask } from '@/lib/quick-parse';
import { Plus, Calendar, Clock, Hash, Zap } from 'lucide-react';
import { formatDisplayDate } from '@/lib/date-utils';

export function QuickAddBar() {
  const { todayStr, addTask, lang, t } = useTodo();
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const parsed = value.trim() ? parseQuickTask(value, todayStr || '') : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || !parsed) return;

    addTask({
      title: parsed.title,
      dueDate: parsed.dueDate,
      dueTime: parsed.dueTime,
      priority: parsed.priority,
      category: parsed.category,
    });

    setValue('');
  };

  const hasChips = parsed && (
    parsed.detected.hasDate ||
    parsed.detected.hasTime ||
    parsed.detected.hasPriority ||
    parsed.detected.hasCategory
  );

  return (
    <form
      onSubmit={handleSubmit}
      className={`rounded-xl border transition-all duration-200 bg-[var(--color-card)] ${
        isFocused
          ? 'border-indigo-500/60 ring-2 ring-indigo-500/15 shadow-sm'
          : 'border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      <div className="flex items-center gap-2 p-1.5 sm:p-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder={t.quickAddPlaceholder}
          className="flex-1 px-3 py-1.5 text-xs bg-transparent border-none outline-hidden text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
        />

        <button
          type="submit"
          disabled={!value.trim()}
          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white text-xs font-medium cursor-pointer transition-all active:scale-95 shadow-sm shadow-indigo-600/30"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t.quickAddButton}</span>
        </button>
      </div>

      {/* Auto-detected Tag Badges */}
      {hasChips && (
        <div className="flex flex-wrap items-center gap-1.5 px-3 pb-2 pt-0.5 text-[10px] animate-in fade-in duration-150">
          {parsed.detected.hasDate && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium border border-indigo-500/20">
              <Calendar className="w-3 h-3" />
              <span>{formatDisplayDate(parsed.dueDate, lang)}</span>
            </span>
          )}

          {parsed.detected.hasTime && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium font-mono border border-blue-500/20">
              <Clock className="w-3 h-3" />
              <span>{parsed.dueTime}</span>
            </span>
          )}

          {parsed.detected.hasCategory && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-500/10 text-slate-700 dark:text-slate-300 font-medium border border-slate-500/20">
              <Hash className="w-3 h-3" />
              <span>{parsed.category}</span>
            </span>
          )}

          {parsed.detected.hasPriority && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium border border-amber-500/20">
              <Zap className="w-3 h-3" />
              <span>{parsed.priority}</span>
            </span>
          )}
        </div>
      )}
    </form>
  );
}
