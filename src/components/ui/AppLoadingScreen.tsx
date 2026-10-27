'use client';

import React, { useEffect, useState } from 'react';

export function AppLoadingScreen({
  isMounted,
}: {
  isMounted: boolean;
  lang?: 'en' | 'fa';
}) {
  const [shouldRender, setShouldRender] = useState(true);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    if (isMounted) {
      const fadeTimer = setTimeout(() => {
        setFadingOut(true);
      }, 150);

      const removeTimer = setTimeout(() => {
        setShouldRender(false);
      }, 450);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [isMounted]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#090d16] select-none transition-opacity duration-300 ease-out ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center gap-3">
        {/* Minimal App Icon */}
        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-[#0f172a] border border-slate-800/80 p-0.5 shadow-sm">
          <img
            src="/icon-192.png"
            alt="tedlist"
            className="w-full h-full rounded-[14px] object-cover"
          />
        </div>

        {/* Minimal Brand Name */}
        <h1 className="text-lg font-semibold tracking-tight text-white/90 font-mono">
          tedlist
        </h1>

        {/* Sleek Minimal Loading Line */}
        <div className="w-20 h-0.5 bg-slate-800/80 rounded-full overflow-hidden mt-1 relative">
          <div className="absolute inset-y-0 w-1/2 bg-emerald-500/80 rounded-full animate-[shimmer_1.2s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
}
