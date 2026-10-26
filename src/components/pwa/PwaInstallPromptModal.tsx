'use client';

import React, { useState, useEffect } from 'react';
import { useTodo } from '@/context/TodoContext';
import { Download, X, CheckCircle2, Smartphone, ShieldCheck, Sparkles } from 'lucide-react';
import { isAppInstalledOrNative } from '@/lib/platform';

export function PwaInstallPromptModal() {
  const {
    isPwaPromptOpen,
    dismissPwaPrompt,
    installPwa,
    lang,
    t,
  } = useTodo();

  const [isInstalledOrNative, setIsInstalledOrNative] = useState(() => isAppInstalledOrNative());

  useEffect(() => {
    setIsInstalledOrNative(isAppInstalledOrNative());
  }, []);

  // Do not show APK prompt if running inside the native APK or modal is closed
  if (!isPwaPromptOpen || isInstalledOrNative) return null;

  const isRtl = lang === 'fa';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-2xl overflow-hidden flex flex-col p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 shadow-md border border-slate-700/30">
              <img
                src="/icon-192.png"
                alt="tedlist"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {t.apkTitle}
                </h3>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {t.apkBadge}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                tedlist Android v2.5.0 • {t.apkOfflineBadge}
              </p>
            </div>
          </div>
          <button
            onClick={dismissPwaPrompt}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {t.apkDesc}
        </p>

        {/* Feature badges */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800/80 flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="text-[11px] font-medium">{t.apkOfflineBadge}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800/80 flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="text-[11px] font-medium">{isRtl ? 'نصب مستقل روی گوشی' : 'Standalone App'}</span>
          </div>
        </div>

        {/* Step-by-step install guide */}
        <div className="p-3.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800/80 space-y-2 text-xs">
          <p className="font-semibold text-slate-800 dark:text-slate-200 text-[11px]">
            {isRtl ? 'راهنمای نصب:' : 'Installation Steps:'}
          </p>
          <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
            <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
            <span>{t.apkStep1}</span>
          </div>
          <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
            <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
            <span>{t.apkStep2}</span>
          </div>
          <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
            <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
            <span>{t.apkStep3}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-[var(--color-border)] flex items-center justify-end gap-2">
          <button
            onClick={dismissPwaPrompt}
            className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
          >
            {t.apkLaterBtn}
          </button>

          <a
            href="/tedlist.apk"
            download="tedlist.apk"
            onClick={() => {
              installPwa();
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-600/30 cursor-pointer active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.apkInstallBtn}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
