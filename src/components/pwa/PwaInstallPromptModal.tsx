'use client';

import React from 'react';
import { useTodo } from '@/context/TodoContext';
import { Download, X, Smartphone } from 'lucide-react';

export function PwaInstallPromptModal() {
  const {
    isPwaPromptOpen,
    dismissPwaPrompt,
    installPwa,
    t,
  } = useTodo();

  if (!isPwaPromptOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-2xl overflow-hidden flex flex-col p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="w-9 h-9 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-800 dark:text-stone-200 shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <button
            onClick={dismissPwaPrompt}
            className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-1.5">
          <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
            {t.pwaTitle}
          </h3>
          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
            {t.pwaDesc}
          </p>
          <p className="text-[11px] text-stone-400 dark:text-stone-500 pt-1">
            {t.pwaIosHint}
          </p>
        </div>

        <div className="pt-3 border-t border-[var(--color-border)] flex items-center justify-end gap-2">
          <button
            onClick={dismissPwaPrompt}
            className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
          >
            {t.pwaLaterBtn}
          </button>

          <button
            onClick={installPwa}
            className="px-4 py-1.5 rounded-lg text-xs font-medium bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-white shadow-xs cursor-pointer active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.pwaInstallBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
