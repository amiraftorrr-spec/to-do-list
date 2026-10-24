'use client';

import React, { useState, useEffect } from 'react';
import { useTodo } from '@/context/TodoContext';
import { Download, X, CheckCircle2 } from 'lucide-react';

export function PwaInstallPromptModal() {
  const {
    isPwaPromptOpen,
    isPwaInstallable,
    dismissPwaPrompt,
    installPwa,
    lang,
    t,
  } = useTodo();

  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ua = navigator.userAgent;
      const iosCheck = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      setIsIos(iosCheck);

      const standaloneCheck = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone === true;
      setIsStandalone(standaloneCheck);
    }
  }, []);

  if (!isPwaPromptOpen || isStandalone) return null;

  const isRtl = lang === 'fa';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-2xl overflow-hidden flex flex-col p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-black flex items-center justify-center text-white font-black text-base tracking-tight shrink-0 shadow-sm border border-stone-800">
              Do
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                {t.pwaTitle}
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                tedlist PWA • {isRtl ? 'نصب روی گوشی و تبلت' : 'Install on Mobile & Tablet'}
              </p>
            </div>
          </div>
          <button
            onClick={dismissPwaPrompt}
            className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Description */}
        <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
          {t.pwaDesc}
        </p>

        {/* Platform Specific Instructions */}
        {isIos ? (
          /* iOS Safari Guide */
          <div className="p-3.5 rounded-xl bg-stone-100/80 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 space-y-2 text-xs">
            <p className="font-semibold text-stone-800 dark:text-stone-200 text-[11px]">
              {isRtl ? 'راهنمای نصب در آیفون (Safari):' : 'Install Guide for iPhone (Safari):'}
            </p>
            <div className="flex items-center gap-2.5 text-stone-600 dark:text-stone-300">
              <span className="w-5 h-5 rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
              <svg className="w-3.5 h-3.5 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span>{isRtl ? 'در نوار پایین مرورگر، دکمه اشتراک‌گذاری (Share) را بزنید.' : 'Tap the Share button at the bottom of Safari.'}</span>
            </div>
            <div className="flex items-center gap-2.5 text-stone-600 dark:text-stone-300">
              <span className="w-5 h-5 rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
              <svg className="w-3.5 h-3.5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span>{isRtl ? 'گزینه «Add to Home Screen» (افزودن به صفحه اصلی) را انتخاب کنید.' : "Select 'Add to Home Screen' from the menu."}</span>
            </div>
          </div>
        ) : (
          /* Android / Desktop Instructions */
          <div className="p-3 rounded-xl bg-stone-100/80 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 space-y-1.5 text-xs text-stone-600 dark:text-stone-300">
            <div className="flex items-center gap-2 text-stone-700 dark:text-stone-200 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{isRtl ? 'قابلیت نصب آفلاین و آیکون اختصاصی روی صفحه گوشی' : 'Offline ready & standalone app experience'}</span>
            </div>
            {!isPwaInstallable && (
              <p className="text-[11px] text-stone-500 dark:text-stone-400 pt-0.5">
                {isRtl
                  ? 'اگر دکمه نصب باز نشد، در منوی ۳ نقطه مرورگر (⋮)، گزینه «Install app» یا «افزودن به صفحه اصلی» را انتخاب کنید.'
                  : "If prompt doesn't open, tap browser menu (⋮) and select 'Install app' or 'Add to Home screen'."}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-3 border-t border-[var(--color-border)] flex items-center justify-end gap-2">
          <button
            onClick={dismissPwaPrompt}
            className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer transition-colors"
          >
            {t.pwaLaterBtn}
          </button>

          <button
            onClick={installPwa}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-white shadow-xs cursor-pointer active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isIos ? (isRtl ? 'متوجه شدم' : 'Got it') : t.pwaInstallBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
