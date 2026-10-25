'use client';

import React, { useState, useEffect } from 'react';
import { useTodo } from '@/context/TodoContext';
import { Download, X, CheckCircle2, Smartphone, ShieldCheck, Sparkles } from 'lucide-react';
import { Capacitor } from '@capacitor/core';

export function PwaInstallPromptModal() {
  const {
    isPwaPromptOpen,
    dismissPwaPrompt,
    installPwa,
    lang,
    t,
  } = useTodo();

  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        setIsNative(Capacitor.isNativePlatform());
      } catch {
        setIsNative(false);
      }
    }
  }, []);

  // Do not show APK prompt if running inside the native APK or modal is closed
  if (!isPwaPromptOpen || isNative) return null;

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
            <div className="w-11 h-11 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-base tracking-tight shrink-0 shadow-sm">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  {t.apkTitle}
                </h3>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {t.apkBadge}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                tedlist Android v2.3.3 • {t.apkOfflineBadge}
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
          {t.apkDesc}
        </p>

        {/* Feature badges */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-stone-100/80 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 flex items-center gap-2 text-stone-700 dark:text-stone-300">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-[11px] font-medium">{t.apkOfflineBadge}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-stone-100/80 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 flex items-center gap-2 text-stone-700 dark:text-stone-300">
            <Sparkles className="w-4 h-4 text-blue-500 shrink-0" />
            <span className="text-[11px] font-medium">{isRtl ? 'نصب مستقل روی گوشی' : 'Standalone App'}</span>
          </div>
        </div>

        {/* Step-by-step install guide */}
        <div className="p-3.5 rounded-xl bg-stone-100/80 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 space-y-2 text-xs">
          <p className="font-semibold text-stone-800 dark:text-stone-200 text-[11px]">
            {isRtl ? 'راهنمای نصب:' : 'Installation Steps:'}
          </p>
          <div className="flex items-center gap-2.5 text-stone-600 dark:text-stone-300">
            <span className="w-5 h-5 rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
            <span>{t.apkStep1}</span>
          </div>
          <div className="flex items-center gap-2.5 text-stone-600 dark:text-stone-300">
            <span className="w-5 h-5 rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
            <span>{t.apkStep2}</span>
          </div>
          <div className="flex items-center gap-2.5 text-stone-600 dark:text-stone-300">
            <span className="w-5 h-5 rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
            <span>{t.apkStep3}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-[var(--color-border)] flex items-center justify-end gap-2">
          <button
            onClick={dismissPwaPrompt}
            className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer transition-colors"
          >
            {t.apkLaterBtn}
          </button>

          <a
            href="/tedlist.apk"
            download="tedlist.apk"
            onClick={() => {
              installPwa();
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs cursor-pointer active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.apkInstallBtn}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
