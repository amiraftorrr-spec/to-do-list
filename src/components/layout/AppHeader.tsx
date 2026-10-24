'use client';

import React from 'react';
import { useTodo } from '@/context/TodoContext';
import { Priority } from '@/types/todo';
import { Search, Plus, Award, Filter, X } from 'lucide-react';
import { formatDisplayDate, getTodayString } from '@/lib/date-utils';

export function AppHeader({ onOpenMobileMenu }: { onOpenMobileMenu?: () => void }) {
  const {
    todayStr,
    viewMode,
    searchQuery,
    setSearchQuery,
    selectedPriority,
    setSelectedPriority,
    openCreateModal,
    isSaturdayToday,
    setIsSaturdayReviewModalOpen,
    lang,
    toggleLanguage,
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
    <header className="border-b border-[var(--color-border)] bg-[var(--color-card)]/80 backdrop-blur-xs sticky top-0 z-20 px-4 md:px-8 py-4 space-y-4">
      {/* Top Bar: Title & Primary Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenMobileMenu}
              className="md:hidden p-1.5 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300"
              aria-label="Open menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h2 className="text-xl md:text-2xl font-serif tracking-tight font-medium text-stone-900 dark:text-stone-100">
              {getTitle()}
            </h2>
            <span className="hidden sm:inline text-xs text-stone-400 font-mono">/ {dateHeading}</span>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">{getSubtitle()}</p>
        </div>

        {/* Right actions: Language toggle, Review & New task */}
        <div className="flex items-center gap-2">
          {/* Language Switcher Button */}
          <button
            onClick={toggleLanguage}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700"
            title={lang === 'en' ? 'تغییر زبان به فارسی' : 'Switch to English'}
          >
            <span>{lang === 'en' ? 'فارسی' : 'English'}</span>
          </button>

          {/* Saturday Review Quick Button */}
          <button
            onClick={() => setIsSaturdayReviewModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <Award className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />
            <span>{t.weeklyReviewBtn}</span>
          </button>

          {/* New Task Button */}
          <button
            onClick={() => openCreateModal()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-white text-xs font-medium cursor-pointer transition-all shadow-xs active:scale-95"
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
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 rtl:left-auto rtl:right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-8 rtl:pl-8 rtl:pr-8 pr-8 py-1.5 text-xs rounded-lg bg-stone-100/70 dark:bg-stone-800/70 border border-stone-200/80 dark:border-stone-700/80 focus:bg-white dark:focus:bg-stone-900 focus:outline-hidden focus:border-stone-400 dark:focus:border-stone-500 transition-all text-stone-900 dark:text-stone-100 placeholder:text-stone-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 rtl:right-auto rtl:left-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Priority Filter Links (No badges/pills) */}
        <div className="flex items-center gap-3 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
          <span className="text-stone-400 flex items-center gap-1 font-medium">
            <Filter className="w-3 h-3" /> {t.filterLabel}
          </span>
          {priorities.map((prio) => (
            <button
              key={prio.value}
              onClick={() => setSelectedPriority(prio.value)}
              className={`cursor-pointer transition-colors ${
                selectedPriority === prio.value
                  ? 'text-stone-900 dark:text-stone-100 font-semibold underline underline-offset-4 decoration-stone-400'
                  : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
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
