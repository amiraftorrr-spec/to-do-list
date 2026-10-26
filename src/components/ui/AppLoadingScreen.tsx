'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';

export function AppLoadingScreen({ isMounted, lang = 'fa' }: { isMounted: boolean; lang?: 'en' | 'fa' }) {
  const [shouldRender, setShouldRender] = useState(!isMounted);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    if (isMounted) {
      setFadingOut(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 550);
      return () => clearTimeout(timer);
    }
  }, [isMounted]);

  if (!shouldRender) return null;

  const isRtl = lang === 'fa';

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-between p-8 bg-[var(--color-background)] transition-opacity duration-500 ease-out select-none ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        paddingTop: 'max(env(safe-area-inset-top, 0px), 2rem)',
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 2rem)',
      }}
    >
      {/* Top spacer */}
      <div />

      {/* Center Hero Logo & Pulse */}
      <div className="flex flex-col items-center text-center space-y-6 relative">
        {/* Ambient Glow */}
        <div className="absolute -inset-10 bg-indigo-600/20 dark:bg-indigo-500/25 blur-3xl rounded-full -z-10 animate-pulse pointer-events-none" />

        {/* Logo Container with Ring Pulse */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-28 h-28 rounded-3xl bg-indigo-500/15 animate-ping duration-1000 -z-10" />
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-2xl shadow-indigo-950/60 border border-indigo-400/30 p-0.5 bg-gradient-to-br from-indigo-500/40 via-slate-800 to-indigo-950">
            <img
              src="/icon-192.png"
              alt="tedlist"
              className="w-full h-full object-cover rounded-[14px]"
            />
          </div>
        </div>

        {/* Brand Text */}
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center justify-center gap-1.5 font-serif">
            tedlist
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500" />
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {isRtl ? 'مدیریت ساده و هوشمند کارهای روزانه' : 'Mindful Daily Productivity'}
          </p>
        </div>

        {/* High-end Shimmering Progress Bar */}
        <div className="w-44 h-1.5 bg-slate-200 dark:bg-slate-800/80 rounded-full overflow-hidden relative shadow-inner">
          <div className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-r from-indigo-500 via-indigo-300 dark:via-indigo-400 to-emerald-400 rounded-full animate-[shimmer_1.4s_infinite_linear]" />
        </div>
      </div>

      {/* Footer Pill */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 shadow-xs">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>{isRtl ? '۱۰۰٪ آفلاین و محلی روی گوشی' : '100% Offline & Private'}</span>
      </div>
    </div>
  );
}
