'use client';

import React, { useState } from 'react';
import { useTodo } from '@/context/TodoContext';
import { Sun, CalendarDays, Award, ShieldCheck, ArrowRight, ArrowLeft, X } from 'lucide-react';

export function OnboardingTutorialModal() {
  const {
    isTutorialOpen,
    completeTutorial,
    t,
    lang,
  } = useTodo();

  const [step, setStep] = useState(0);

  if (!isTutorialOpen) return null;

  const steps = [
    {
      icon: Sun,
      title: t.tutorialStep1Title,
      desc: t.tutorialStep1Desc,
    },
    {
      icon: CalendarDays,
      title: t.tutorialStep2Title,
      desc: t.tutorialStep2Desc,
    },
    {
      icon: Award,
      title: t.tutorialStep3Title,
      desc: t.tutorialStep3Desc,
    },
    {
      icon: ShieldCheck,
      title: t.tutorialStep4Title,
      desc: t.tutorialStep4Desc,
    },
  ];

  const current = steps[step];
  const IconComponent = current.icon;
  const isLast = step === steps.length - 1;

  const handleNext = () => {
    if (isLast) {
      completeTutorial();
    } else {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const isRtl = lang === 'fa';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-2xl overflow-hidden flex flex-col p-6 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-serif font-semibold text-stone-900 dark:text-stone-100">
              {t.tutorialTitle}
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              {t.tutorialSubtitle}
            </p>
          </div>
          <button
            onClick={completeTutorial}
            className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer"
            title={t.tutorialSkip}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Content */}
        <div className="py-4 space-y-4 text-center sm:text-start">
          <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-800 dark:text-stone-200">
            <IconComponent className="w-5 h-5" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
              {current.title}
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              {current.desc}
            </p>
          </div>
        </div>

        {/* Indicator dots & navigation */}
        <div className="pt-2 border-t border-[var(--color-border)] flex items-center justify-between">
          {/* Step dots */}
          <div className="flex items-center gap-1.5">
            {steps.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step
                    ? 'w-6 bg-stone-900 dark:bg-stone-100'
                    : 'w-1.5 bg-stone-300 dark:bg-stone-700'
                }`}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2">
            {step > 0 && (
              <button
                onClick={handlePrev}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer flex items-center gap-1"
              >
                {isRtl ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
                <span>{t.tutorialPrev}</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-4 py-1.5 rounded-lg text-xs font-medium bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-white shadow-xs cursor-pointer active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span>{isLast ? t.tutorialStart : t.tutorialNext}</span>
              {!isLast && (
                isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
