'use client';

import React from 'react';
import { useTodo } from '@/context/TodoContext';
import { Priority } from '@/types/todo';
import { Search, Plus, Filter, X, Sun, Moon, Download } from 'lucide-react';
import { formatDisplayDate } from '@/lib/date-utils';
import { CURRENT_APP_VERSION } from '@/constants/version';

export function AppHeader({ onOpenMobileMenu }: { onOpenMobileMenu?: () => void }) {
  const {
    todayStr,
    viewMode,
    searchQuery,
    setSearchQuery,
    selectedPriority,
    setSelectedPriority,
    openCreateModal,
    lang,
    toggleLanguage,
    theme,
    toggleTheme,
    isNative,
    t,
  } = useTodo();

  const dateHeading = todayStr ? formatDisplayDate(todayStr, lang) : '';

  const getTitle = () => {
    switch (viewMode) {
      case 'today':
        return t.todayHeading;
      case 'upcoming':
        return t.plannerHeading;
      case 'review':
        return t.reviewHeading;
      case 'completed':
        return t.completedHeading;
      case 'all':
      default:
        return t.allHeading;
    }
  };

  const getSubtitle = () => {
    switch (viewMode) {
      case 'today':
        return t.todaySubtitle;
      case 'upcoming':
        return t.plannerSubtitle;
      case 'review':
        return t.reviewSubtitle;
      case 'completed':
        return t.completedSubtitle;
      case 'all':
      default:
        return t.allSubtitle;
    }
  };

  const priorities: { value: Priority | 'All'; label: string }[] = [
    { value: 'All', label: t.allFilter },
    { value: 'urgent', label: t.priorityUrgent },
    { value: 'high', label: t.priorityHigh },
    { value: 'medium', label: t.priorityMedium },
    { value: 'low', label: t.priorityLow },
  ];

  return (
    <header
      className="border-b border-[var(--color-border)] bg-[var(--color-card)]/80 backdrop-blur-md sticky top-0 z-20 px-4 md:px-8 py-4 space-y-4"
      style={{
        paddingTop: 'max(env(safe-area-inset-top, 0px), 1rem)',
      }}
    >
      {/* Top Bar: Title & Primary Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onOpenMobileMenu}
              className="md:hidden p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
              aria-label="Open menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h2 className="text-xl md:text-2xl font-serif tracking-tight font-medium text-slate-900 dark:text-slate-100">
              {getTitle()}
            </h2>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">/ {dateHeading}</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{getSubtitle()}</p>
        </div>

        {/* Right actions: Theme toggle, Language toggle, Review & New task */}
        <div className="flex items-center gap-2">
          {/* Theme Switcher Button */}
          <button
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              toggleTheme({
                clientX: rect.left + rect.width / 2,
                clientY: rect.top + rect.height / 2,
              });
            }}
            className="p-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
            title={theme === 'dark' ? t.themeToggleLight : t.themeToggleDark}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600 transition-transform hover:-rotate-12" />
            )}
          </button>

          {/* Language Switcher Button */}
          <button
            onClick={toggleLanguage}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
            title={lang === 'en' ? 'تغییر زبان به فارسی' : 'Switch to English'}
          >
            <span>{lang === 'en' ? 'فارسی' : 'English'}</span>
          </button>

          {/* Web-Only APK Download Button */}
          {!isNative && (
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  const a = document.createElement('a');
                  a.href = '/tedlist.apk';
                  a.download = 'tedlist.apk';
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                }
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-medium cursor-pointer transition-all shadow-xs active:scale-95"
              title={lang === 'fa' ? 'دانلود مستقیم فایل نصبی اندروید (APK)' : 'Download Android APK'}
            >
              <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">
                {lang === 'fa' ? `دانلود APK (v${CURRENT_APP_VERSION})` : `Download APK (v${CURRENT_APP_VERSION})`}
              </span>
              <span className="sm:hidden font-mono text-[11px]">
                APK
              </span>
            </button>
          )}

          {/* New Task Button */}
          <button
            onClick={() => openCreateModal()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium cursor-pointer transition-all shadow-sm shadow-indigo-600/30 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.addTaskBtn}</span>
            <span className="sm:hidden">{t.addTaskBtn}</span>
          </button>
        </div>
      </div>

      {/* Second Row: Search & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 rtl:left-auto rtl:right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-8 rtl:pl-8 rtl:pr-8 pr-8 py-1.5 text-xs rounded-lg bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 rtl:right-auto rtl:left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Priority Filter Links */}
        <div className="flex items-center gap-3 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
          <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1 font-medium">
            <Filter className="w-3 h-3" /> {t.filterLabel}
          </span>
          {priorities.map((prio) => (
            <button
              key={prio.value}
              onClick={() => setSelectedPriority(prio.value)}
              className={`cursor-pointer transition-colors ${
                selectedPriority === prio.value
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold underline underline-offset-4 decoration-indigo-500'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              {prio.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
