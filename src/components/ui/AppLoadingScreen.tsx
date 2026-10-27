'use client';

import React, { useEffect, useState } from 'react';
import { ShieldCheck, Sparkles } from 'lucide-react';

export function AppLoadingScreen({
  isMounted,
  lang = 'fa',
}: {
  isMounted: boolean;
  lang?: 'en' | 'fa';
}) {
  const [shouldRender, setShouldRender] = useState(true);
  const [fadingOut, setFadingOut] = useState(false);
  const [progress, setProgress] = useState(18);
  const [statusIndex, setStatusIndex] = useState(0);

  const isRtl = lang === 'fa';

  const statusMessages = isRtl
    ? [
        'در حال آماده‌سازی کارهای امروز...',
        'همگام‌سازی ویجت‌ها و اعلان‌ها...',
        'ذهن شفاف، روز پرانرژی ✨',
      ]
    : [
        'Organizing your daily focus...',
        'Syncing smart widgets & reminders...',
        'Clear mind, purposeful day ✨',
      ];

  // Simulated smooth progression
  useEffect(() => {
    const t1 = setTimeout(() => {
      setProgress(55);
      setStatusIndex(1);
    }, 250);

    const t2 = setTimeout(() => {
      setProgress(88);
      setStatusIndex(2);
    }, 550);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // When isMounted is true, finish to 100% and smoothly fade out
  useEffect(() => {
    if (isMounted) {
      setProgress(100);
      setStatusIndex(2);

      const fadeTimer = setTimeout(() => {
        setFadingOut(true);
      }, 350);

      const removeTimer = setTimeout(() => {
        setShouldRender(false);
      }, 950);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [isMounted]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-between p-6 sm:p-8 bg-[#090d16] select-none transition-all duration-700 ease-out ${
        fadingOut
          ? 'opacity-0 scale-105 pointer-events-none blur-xs'
          : 'opacity-100 scale-100'
      }`}
      style={{
        paddingTop: 'max(env(safe-area-inset-top, 0px), 2.5rem)',
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 2.5rem)',
      }}
    >
      {/* Background Star/Dust elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/6 w-1 h-1 rounded-full bg-indigo-400/40 animate-ping" />
        <div className="absolute top-1/3 right-1/5 w-1.5 h-1.5 rounded-full bg-emerald-400/30 animate-pulse" />
        <div className="absolute bottom-1/3 left-1/4 w-1 h-1 rounded-full bg-indigo-300/30 animate-pulse" />
        <div className="absolute top-2/3 right-1/4 w-1 h-1 rounded-full bg-purple-400/30 animate-ping" />
      </div>

      {/* Top Header Label */}
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[11px] font-mono text-indigo-400">
        <Sparkles className="w-3 h-3 text-indigo-400 animate-spin" />
        <span>tedlist</span>
      </div>

      {/* Center Cinematic Stage */}
      <div className="flex flex-col items-center text-center space-y-7 relative max-w-xs w-full">
        {/* Ambient Deep Radial Aura */}
        <div className="absolute -inset-16 bg-gradient-to-r from-indigo-600/30 via-purple-600/20 to-emerald-500/25 blur-3xl rounded-full -z-10 animate-pulse pointer-events-none" />

        {/* Concentric Expanding Ripple Rings */}
        <div className="relative flex items-center justify-center">
          <div
            className="absolute w-36 h-36 rounded-3xl border border-indigo-500/25 pointer-events-none"
            style={{ animation: 'ripple-ring 2.6s cubic-bezier(0.2, 0.8, 0.2, 1) infinite' }}
          />
          <div
            className="absolute w-44 h-44 rounded-3xl border border-purple-500/15 pointer-events-none"
            style={{ animation: 'ripple-ring 2.6s cubic-bezier(0.2, 0.8, 0.2, 1) infinite 0.9s' }}
          />

          {/* Rotating Conic Aura Ring */}
          <div
            className="absolute -inset-1.5 rounded-[26px] bg-gradient-to-tr from-indigo-500 via-purple-500 to-emerald-400 opacity-80 blur-xs"
            style={{ animation: 'spin-slow 6s linear infinite' }}
          />

          {/* Floating Logo Card */}
          <div
            className="relative w-24 h-24 rounded-[22px] overflow-hidden shadow-2xl shadow-indigo-950/80 border border-slate-700/60 p-1 bg-[#0f172a]"
            style={{ animation: 'float-slow 3s ease-in-out infinite' }}
          >
            <div className="w-full h-full rounded-[18px] overflow-hidden bg-gradient-to-br from-indigo-600/30 to-slate-900 flex items-center justify-center relative">
              <img
                src="/icon-192.png"
                alt="tedlist"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Brand Name & Dynamic Status */}
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2 font-serif">
            tedlist
            <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-sm shadow-indigo-400 animate-pulse" />
          </h1>
          <p className="text-xs text-slate-400 font-medium h-5 transition-all duration-300">
            {statusMessages[statusIndex]}
          </p>
        </div>

        {/* Futuristic Laser Progress Track */}
        <div className="w-full space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 px-0.5">
            <span>{isRtl ? 'آماده‌سازی' : 'Loading'}</span>
            <span className="text-indigo-400 font-bold">{progress}%</span>
          </div>

          <div className="w-full h-1.5 bg-slate-800/90 rounded-full overflow-hidden p-0.5 border border-slate-700/50 relative shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-500 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-md shadow-white animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Offline & Security Badge */}
      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400 shadow-sm">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>{isRtl ? '۱۰۰٪ آفلاین و محلی روی حافظه گوشی' : '100% Offline & Private on Device'}</span>
      </div>
    </div>
  );
}
