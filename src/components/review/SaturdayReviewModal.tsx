'use client';

import React, { useState, useEffect } from 'react';
import { useTodo } from '@/context/TodoContext';
import { getPreviousWeekRange, getCurrentWeekRange, formatWeekLabel, getTodayString } from '@/lib/date-utils';
import { calculateWeeklyScore } from '@/lib/storage';
import { Award, CheckCircle2, AlertCircle, ArrowRight, X, Sparkles, History, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

export function SaturdayReviewModal() {
  const {
    tasks,
    isSaturdayReviewModalOpen,
    setIsSaturdayReviewModalOpen,
    dismissSaturdayNotice,
    saveWeeklyReview,
    weeklyReviews,
    rescheduleTask,
    isSaturdayToday,
    prevWeekRange,
    currentWeekRange,
    todayStr,
    lang,
    t,
  } = useTodo();

  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');
  const [reflectionText, setReflectionText] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  // If today is Saturday, default to previous week. Otherwise, allow toggling or viewing previous week.
  const [selectedRange, setSelectedRange] = useState<'prev' | 'current'>('prev');

  const range = selectedRange === 'prev' ? prevWeekRange : currentWeekRange;
  const reviewScore = range.start && range.end
    ? calculateWeeklyScore(tasks, range.start, range.end, lang)
    : {
        weekStart: '',
        weekEnd: '',
        score: 100,
        totalTasks: 0,
        completedTasks: 0,
        urgentHighCompleted: 0,
        urgentHighTotal: 0,
        consistencyScore: 100,
        ratingLabel: lang === 'fa' ? 'آماده ارزیابی 🎯' : 'Ready',
        feedback: lang === 'fa' ? 'کاری برای ارزیابی این هفته ثبت نشده است.' : 'No tasks to evaluate.',
      };
  const weekLabel = range.start && range.end ? formatWeekLabel(range.start, range.end, lang) : '';

  const weekTasks = tasks.filter((t) => t.dueDate >= range.start && t.dueDate <= range.end);
  const completedTasks = weekTasks.filter((t) => t.completed);
  const incompleteTasks = weekTasks.filter((t) => !t.completed);

  // Confetti on opening high score
  useEffect(() => {
    if (isSaturdayReviewModalOpen && reviewScore.score >= 80) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
    }
  }, [isSaturdayReviewModalOpen, reviewScore.score]);

  if (!isSaturdayReviewModalOpen) return null;

  const handleSaveReview = () => {
    const record = {
      id: `review-${range.start}-${range.end}`,
      ...reviewScore,
      reflection: reflectionText.trim() || undefined,
      reviewedAt: new Date().toISOString(),
    };
    saveWeeklyReview(record);
    setIsSaved(true);
    setTimeout(() => {
      dismissSaturdayNotice();
      setIsSaturdayReviewModalOpen(false);
      setIsSaved(false);
    }, 1200);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/5';
    if (score >= 70) return 'text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/5';
    if (score >= 50) return 'text-indigo-600 dark:text-indigo-400 border-indigo-500/30 bg-indigo-500/5';
    return 'text-slate-600 dark:text-slate-400 border-slate-500/30 bg-slate-500/5';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)] bg-slate-50/70 dark:bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {t.satReviewTitle}
                </h2>
                {isSaturdayToday && (
                  <span className="text-xs text-indigo-400 font-mono">
                    {t.satMorningLabel}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {t.retrospectiveFor(weekLabel)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <div className="flex bg-slate-200/60 dark:bg-slate-800 p-0.5 rounded-lg text-xs mr-2">
              <button
                onClick={() => setActiveTab('current')}
                className={`px-2.5 py-1 rounded-md font-medium cursor-pointer transition-colors ${
                  activeTab === 'current'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {t.weeklyScoreTab}
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-2.5 py-1 rounded-md font-medium cursor-pointer transition-colors flex items-center gap-1 ${
                  activeTab === 'history'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <History className="w-3 h-3" />
                <span>{t.historyTab(weeklyReviews.length)}</span>
              </button>
            </div>

            <button
              onClick={() => {
                dismissSaturdayNotice();
                setIsSaturdayReviewModalOpen(false);
              }}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        {activeTab === 'current' ? (
          <div className="p-6 space-y-6 overflow-y-auto">
            {/* Week Range Switcher */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 text-xs">
              <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium pl-1 rtl:pl-0 rtl:pr-1">
                {t.evaluatingCycle}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => setSelectedRange('prev')}
                  className={`px-3 py-1 rounded-lg font-medium cursor-pointer transition-colors ${
                    selectedRange === 'prev'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {t.concludedWeek(formatWeekLabel(prevWeekRange.start, prevWeekRange.end, lang))}
                </button>
                <button
                  onClick={() => setSelectedRange('current')}
                  className={`px-3 py-1 rounded-lg font-medium cursor-pointer transition-colors ${
                    selectedRange === 'current'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {t.ongoingWeek}
                </button>
              </div>
            </div>

            {/* Score Showcase Hero */}
            <div
              className={`rounded-2xl border p-6 flex flex-col sm:flex-row items-center justify-between gap-6 transition-all ${getScoreColor(
                reviewScore.score
              )}`}
            >
              <div className="text-center sm:text-left rtl:sm:text-right space-y-1.5 flex-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{reviewScore.ratingLabel}</span>
                </div>
                <h3 className="text-base font-serif font-medium text-slate-900 dark:text-slate-100 pt-1">
                  {t.perfAssessment}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
                  {reviewScore.feedback}
                </p>
              </div>

              {/* Big Circular/Numeric Score Badge */}
              <div className="shrink-0 flex flex-col items-center justify-center w-28 h-28 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-2">
                <span className="text-4xl font-serif font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  {reviewScore.score}
                </span>
                <span className="text-[11px] font-mono font-medium text-slate-400 uppercase tracking-widest mt-0.5">
                  {t.outOf100}
                </span>
              </div>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
                <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                  {t.completionRate}
                </p>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                    {reviewScore.totalTasks > 0
                      ? Math.round((reviewScore.completedTasks / reviewScore.totalTasks) * 100)
                      : 0}
                    %
                  </span>
                  <span className="text-xs text-slate-500">
                    ({reviewScore.completedTasks}/{reviewScore.totalTasks})
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        reviewScore.totalTasks > 0
                          ? (reviewScore.completedTasks / reviewScore.totalTasks) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
                <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                  {t.keyPrioritiesHit}
                </p>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                    {reviewScore.urgentHighCompleted}/{reviewScore.urgentHighTotal}
                  </span>
                  <span className="text-xs text-slate-500">{t.urgentHighBadge}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  {t.keyPrioritiesWeight}
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
                <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                  {t.consistencyScore}
                </p>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                    {reviewScore.consistencyScore}/15
                  </span>
                  <span className="text-xs text-slate-500">{t.ptsLabel}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  {t.consistencyDesc}
                </p>
              </div>
            </div>

            {/* Tasks Audit: What Slipped vs What Succeeded */}
            <div className="space-y-4">
              {incompleteTasks.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{t.tasksSlippedTitle(incompleteTasks.length)}</span>
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      {t.tasksSlippedSubtitle}
                    </span>
                  </div>

                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {incompleteTasks.map((tItem) => (
                      <div
                        key={tItem.id}
                        className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-rose-50/40 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40"
                      >
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {tItem.title}
                        </span>
                        <button
                          onClick={() => {
                            if (todayStr) rescheduleTask(tItem.id, todayStr);
                          }}
                          className="flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-400 cursor-pointer transition-colors"
                        >
                          <RotateCcw className="w-3 h-3 text-amber-500" />
                          <span>{t.moveToday}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {completedTasks.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{t.completedVictoriesTitle(completedTasks.length)}</span>
                  </h4>
                  <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                    {completedTasks.map((tItem) => (
                      <div
                        key={tItem.id}
                        className="text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800/30 text-slate-600 dark:text-slate-400 flex items-center gap-2"
                      >
                        <span className="text-emerald-500">✓</span>
                        <span className="line-through">{tItem.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Reflection Note */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200">
                {t.satReflectionLabel}
              </label>
              <textarea
                rows={2}
                value={reflectionText}
                onChange={(e) => setReflectionText(e.target.value)}
                placeholder={t.satReflectionPlaceholder}
                className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:border-indigo-500 text-slate-800 dark:text-slate-200 resize-none"
              />
            </div>
          </div>
        ) : (
          /* History of past weekly reviews */
          <div className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {t.pastReportsTitle}
            </h3>
            {weeklyReviews.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                {t.noPastReports}
              </div>
            ) : (
              <div className="space-y-3">
                {weeklyReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {formatWeekLabel(rev.weekStart, rev.weekEnd, lang)}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          • {rev.ratingLabel}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        {t.historyTaskSummary(rev.completedTasks, rev.totalTasks, rev.urgentHighCompleted)}
                      </p>
                      {rev.reflection && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 italic bg-white dark:bg-slate-800 p-2 rounded border border-slate-100 dark:border-slate-700 mt-2">
                          "{rev.reflection}"
                        </p>
                      )}
                    </div>

                    <div className="text-right rtl:text-left shrink-0">
                      <span className="text-2xl font-serif font-bold text-slate-900 dark:text-slate-100">
                        {rev.score}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-mono">/100</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Modal Footer */}
        <div className="p-4 border-t border-[var(--color-border)] bg-slate-50/70 dark:bg-slate-900/60 flex items-center justify-between">
          <p className="text-[11px] text-slate-400">
            {t.reviewsSavedLocally}
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                dismissSaturdayNotice();
                setIsSaturdayReviewModalOpen(false);
              }}
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
            >
              {t.dismissBtn}
            </button>

            {activeTab === 'current' && (
              <button
                onClick={handleSaveReview}
                disabled={isSaved}
                className="px-4 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-600/30 cursor-pointer active:scale-95 transition-all flex items-center gap-1.5"
              >
                <span>{isSaved ? t.savedDone : t.saveReviewBtn}</span>
                {!isSaved && <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
