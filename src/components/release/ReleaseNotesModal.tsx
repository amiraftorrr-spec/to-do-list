'use client';

import React from 'react';
import { useTodo } from '@/context/TodoContext';
import { CURRENT_APP_VERSION } from '@/constants/version';
import {
  Sparkles,
  Download,
  X,
  Smartphone,
  Layers,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { triggerHaptic } from '@/lib/haptics';
import { openExternalUrl } from '@/lib/widget-bridge';

export function ReleaseNotesModal({
  isOpen,
  onClose,
  version = CURRENT_APP_VERSION,
}: {
  isOpen: boolean;
  onClose: () => void;
  version?: string;
}) {
  const { lang, isNative } = useTodo();

  if (!isOpen) return null;

  const handleDownloadUpdate = async () => {
    triggerHaptic('success');
    if (isNative) {
      await openExternalUrl('https://tedlist.vercel.app/?update=apk');
    } else {
      if (typeof window !== 'undefined') {
        const a = document.createElement('a');
        a.href = '/tedlist.apk';
        a.download = 'tedlist.apk';
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    }
    onClose();
  };

  const isRtl = lang === 'fa';

  const features = [
    {
      icon: Zap,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      title: isRtl ? 'رفع گیرکردن برنامه هنگام اجرا' : 'Fixed startup loading hang',
      desc: isRtl
        ? 'نمایش مستقیم برنامه هنگام اجرا و حذف صفحهٔ بارگذاری مسدودکننده؛ همراه با به‌روزرسانی نسخهٔ برنامه.'
        : 'The app now opens directly without a blocking startup screen, with an updated app version.',
    },
    {
      icon: Smartphone,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      title: isRtl ? 'تقویم هوشمند شمسی و میلادی' : 'Smart Solar Hijri & Gregorian Calendar',
      desc: isRtl
        ? 'پشتیبانی کامل از تاریخ ایرانی در زبان فارسی و تاریخ میلادی در زبان انگلیسی، همراه با مینی تقویم انتخاب تاریخ.'
        : 'Full support for Iranian calendar in Persian and Gregorian calendar in English with interactive date picker.',
    },
    {
      icon: Layers,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      title: isRtl ? 'ریسپانسیو کامل نوار ناوبری پایین' : 'Full Navigation Bar Responsiveness',
      desc: isRtl
        ? 'نمایش کامل عنوان تمام تب‌ها بدون بریدگی در انواع ابعاد گوشی‌های موبایل.'
        : 'Clean and complete tab titles without any truncation across all mobile screen sizes.',
    },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[var(--color-border)] bg-gradient-to-r from-indigo-950/40 to-slate-900/40 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {isRtl ? 'نسخه جدید در دسترس است! 🚀' : 'New Update Available! 🚀'}
                </h3>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  v{version}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {isRtl
                  ? isNative
                    ? 'نسخه جدید در سایت tedlist.vercel.app در دسترس است'
                    : 'فایل نصبی مستقیم نسخه جدید را دریافت کنید'
                  : 'New update available on tedlist.vercel.app'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Feature List (Scrollable) */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1 text-xs">
          {features.map((feat, idx) => {
            const IconComp = feat.icon;
            return (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/80 flex items-start gap-3"
              >
                <div className={`p-2 rounded-lg border shrink-0 mt-0.5 ${feat.color}`}>
                  <IconComp className="w-4 h-4" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                    {feat.title}
                  </h4>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">
                    {feat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[var(--color-border)] bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-center"
          >
            {isRtl ? 'باشه برای بعداً' : 'Maybe Later'}
          </button>

          <button
            onClick={handleDownloadUpdate}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium cursor-pointer shadow-sm shadow-indigo-600/30 active:scale-95 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>
              {isRtl
                ? isNative
                  ? 'ورود به سایت و دانلود نسخه جدید'
                  : 'دانلود مستقیم فایل نصبی (APK)'
                : isNative
                  ? 'Open Website & Update'
                  : 'Download Latest APK'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
