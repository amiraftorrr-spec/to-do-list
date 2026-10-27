'use client';

import React from 'react';
import { useTodo } from '@/context/TodoContext';
import {
  Sparkles,
  Download,
  X,
  Smartphone,
  Bell,
  Calendar,
  Flame,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { triggerHaptic } from '@/lib/haptics';

export function ReleaseNotesModal({
  isOpen,
  onClose,
  version = '2.7.3',
}: {
  isOpen: boolean;
  onClose: () => void;
  version?: string;
}) {
  const { lang } = useTodo();

  if (!isOpen) return null;

  const handleDownloadUpdate = () => {
    triggerHaptic('success');
    if (typeof window !== 'undefined') {
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', '/tedlist.apk');
      downloadAnchor.setAttribute('download', 'tedlist.apk');
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    }
    onClose();
  };

  const isRtl = lang === 'fa';

  const features = [
    {
      icon: Bell,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      title: isRtl ? 'لوگوی شیک در نوار اعلان و رفع علامت خطر' : 'Crisp Status Bar Notification Icon',
      desc: isRtl
        ? 'آیکون مینیمال چک‌لیست سفید در نوار اعلان گوشی بدون ارور یا علامت خطر اندروید.'
        : 'Pure monochrome vector checkmark in the Android status bar instead of default alert triangle.',
    },
    {
      icon: Smartphone,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      title: isRtl ? 'استایل شیک‌تر ویجت‌ها (سایز ۲ و ۸ اپ)' : 'Upgraded Android Widgets',
      desc: isRtl
        ? 'طراحی زیباتر با بک‌گراند عمیق نئونی، نوار پیشرفت، دکمه سریع + و تیترهای بامزه دولینگو.'
        : 'Enhanced 2-app and 8-app home screen widgets with neon gradients and real-time sync.',
    },
    {
      icon: Calendar,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      title: isRtl ? 'یادآوری کارهای آینده (روز قبل ساعت ۸ شب)' : 'Advance Task Reminder (8 PM)',
      desc: isRtl
        ? 'اگر برای روزهای آینده برنامه‌ریزی کنید، شب قبل ساعت ۲۰ اعلان مرور برنامه فردا برایتان ارسال می‌شود.'
        : 'Automatic heads-up reminder at 8:00 PM the evening before scheduled future tasks.',
    },
    {
      icon: Zap,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      title: isRtl ? 'تست اعلان ۱۰ ثانیه‌ای و تاریخ در هدر' : '10s Notification Test & Mobile Date',
      desc: isRtl
        ? 'دکمه تست سریع اعلان برای ۱۰ ثانیه بعد و نمایش شفاف تاریخ روز در هدر گوشی موبایل.'
        : 'Instant 10-second notification test and persistent date display in the mobile header.',
    },
    {
      icon: CheckCircle2,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      title: isRtl ? 'رفع کامل تداخل دکمه‌های هوم گوشی' : 'Fixed Android Nav Bar Overlap',
      desc: isRtl
        ? 'پدینگ هوشمند و سازگاری کامل با دکمه‌های ناوبری ۳تایی پایین صفحه گوشی.'
        : 'Optimized viewport insets and bottom bar padding for Android hardware/soft buttons.',
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
                  {isRtl ? 'نسخه جدید از راه رسید! 🚀' : "What's New in tedlist! 🚀"}
                </h3>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  v{version}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {isRtl
                  ? 'امکانات جدید، ویجت‌های کاربردی و ارتقای چشمگیر اپلیکیشن'
                  : 'Exciting new features and user experience improvements'}
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
            {isRtl ? 'عالیه، متوجه شدم!' : 'Got it, thanks!'}
          </button>

          <button
            onClick={handleDownloadUpdate}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium cursor-pointer shadow-sm shadow-indigo-600/30 active:scale-95 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>{isRtl ? 'دانلود مستقیم فایل نصبی (APK)' : 'Download APK Update'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
