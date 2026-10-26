'use client';

import React, { useState, useEffect } from 'react';
import { useTodo } from '@/context/TodoContext';
import { ViewMode, Category } from '@/types/todo';
import { isAppInstalledOrNative } from '@/lib/platform';
import {
  Sun,
  CalendarDays,
  Layers,
  CheckCircle2,
  FolderDot,
  Plus,
  HelpCircle,
  Smartphone,
} from 'lucide-react';

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const [isInstalledOrNative, setIsInstalledOrNative] = useState(() => isAppInstalledOrNative());

  useEffect(() => {
    setIsInstalledOrNative(isAppInstalledOrNative());
  }, []);

  const {
    todayStr,
    tasks,
    viewMode,
    setViewMode,
    selectedCategory,
    setSelectedCategory,
    openCreateModal,
    openTutorial,
    openPwaPrompt,
    t,
  } = useTodo();

  // Counts
  const todayTasksCount = todayStr
    ? tasks.filter((t) => t.dueDate === todayStr && !t.completed).length
    : 0;
  const upcomingTasksCount = todayStr
    ? tasks.filter((t) => t.dueDate > todayStr && !t.completed).length
    : 0;
  const completedCount = tasks.filter((t) => t.completed).length;

  const categories: { key: Category; label: string }[] = [
    { key: 'General', label: t.catGeneral },
    { key: 'Personal', label: t.catPersonal },
    { key: 'Work', label: t.catWork },
    { key: 'Habits', label: t.catHabits },
    { key: 'Learning', label: t.catLearning },
    { key: 'Health', label: t.catHealth },
  ];

  return (
    <aside className="w-full md:w-64 border-r border-[var(--color-border)] bg-[var(--color-card)] flex flex-col justify-between shrink-0">
      <div className="p-4 space-y-6">
        {/* Logo / Brand Header */}
        <div className="flex items-center justify-between px-2 pt-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl overflow-hidden shrink-0 shadow-md shadow-indigo-950/40 border border-slate-700/30">
              <img
                src="/icon-192.png"
                alt="tedlist"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-tight text-slate-900 dark:text-slate-100">
                {t.appName}
              </h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {t.appSubtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Add Button */}
        <button
          onClick={() => {
            openCreateModal();
            onClose?.();
          }}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-all shadow-sm shadow-indigo-600/30 cursor-pointer active:scale-[0.98]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t.newTask}</span>
          <span className="ml-auto text-[11px] opacity-75 font-mono">
            {t.quickAddKey}
          </span>
        </button>

        {/* Primary Views */}
        <nav className="space-y-0.5">
          <p className="px-2 text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
            {t.rhythm}
          </p>

          <button
            onClick={() => {
              setViewMode('today');
              onClose?.();
            }}
            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              viewMode === 'today'
                ? 'bg-indigo-500/10 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sun className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              <span>{t.today}</span>
            </div>
            {todayTasksCount > 0 && (
              <span className="text-xs font-mono text-slate-400">
                {todayTasksCount}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setViewMode('upcoming');
              onClose?.();
            }}
            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              viewMode === 'upcoming'
                ? 'bg-indigo-500/10 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <CalendarDays className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
              <span>{t.planner}</span>
            </div>
            {upcomingTasksCount > 0 && (
              <span className="text-xs font-mono text-slate-400">
                {upcomingTasksCount}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setViewMode('all');
              onClose?.();
            }}
            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              viewMode === 'all'
                ? 'bg-indigo-500/10 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4 text-slate-400" />
              <span>{t.allTasks}</span>
            </div>
            <span className="text-xs font-mono text-slate-400">{tasks.length}</span>
          </button>

          <button
            onClick={() => {
              setViewMode('completed');
              onClose?.();
            }}
            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              viewMode === 'completed'
                ? 'bg-indigo-500/10 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
              <span>{t.completedLog}</span>
            </div>
            <span className="text-xs font-mono text-slate-400">{completedCount}</span>
          </button>
        </nav>

        {/* Categories / Tags Filter */}
        <div className="space-y-1">
          <div className="flex items-center justify-between px-2">
            <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              {t.spaces}
            </p>
            {selectedCategory !== 'All' && (
              <button
                onClick={() => setSelectedCategory('All')}
                className="text-[10px] text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer"
              >
                {t.allFilter}
              </button>
            )}
          </div>

          <div className="space-y-0.5">
            <button
              onClick={() => {
                setSelectedCategory('All');
                onClose?.();
              }}
              className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs cursor-pointer transition-colors ${
                selectedCategory === 'All'
                  ? 'bg-indigo-500/10 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-medium'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/40'
              }`}
            >
              <FolderDot className="w-3.5 h-3.5 text-slate-400" />
              <span>{t.allSpaces}</span>
            </button>

            {categories.map((cat) => {
              const count = tasks.filter((t) => t.category === cat.key && !t.completed).length;
              return (
                <button
                  key={cat.key}
                  onClick={() => {
                    setSelectedCategory(cat.key);
                    onClose?.();
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs cursor-pointer transition-colors ${
                    selectedCategory === cat.key
                      ? 'bg-indigo-500/10 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-medium'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600" />
                    <span>{cat.label}</span>
                  </div>
                  {count > 0 && <span className="text-[10px] font-mono text-slate-400">{count}</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Footer Section */}
      <div
        className="p-3 border-t border-[var(--color-border)] space-y-1"
        style={{
          paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 1rem)',
        }}
      >
        {!isInstalledOrNative && (
          <button
            onClick={() => {
              openPwaPrompt();
              onClose?.();
            }}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer font-medium"
          >
            <div className="flex items-center gap-2">
              <Smartphone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{t.apkTitle}</span>
            </div>
            <span className="text-[9px] font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-1.5 py-0.5 rounded">
              APK
            </span>
          </button>
        )}

        <button
          onClick={() => {
            openTutorial();
            onClose?.();
          }}
          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          <span>{t.tutorialTitle}</span>
        </button>

        <div className="px-2 pt-1.5 flex flex-col gap-1 text-[10px] text-slate-400 dark:text-slate-500">
          <div className="flex items-center justify-between">
            <p className="leading-tight">
              {t.localPrivacyNote}
            </p>
            <span className="font-mono font-medium shrink-0 ps-2">
              v2.5.0
            </span>
          </div>
          <div className="flex justify-end text-[10px] font-mono text-slate-400 dark:text-slate-500">
            <span>
              made by{' '}
              <a
                href="https://aftor.ir"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium transition-colors"
              >
                aftor
              </a>
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
