'use client';

import React, { useState, useRef } from 'react';
import { useTodo } from '@/context/TodoContext';
import { exportDataAsJSON, importDataFromJSON, saveTasksToStorage, getInitialSeedTasks } from '@/lib/storage';
import { X, Download, Upload, RotateCcw, ShieldCheck, Check } from 'lucide-react';

export function BackupModal() {
  const {
    isBackupModalOpen,
    setIsBackupModalOpen,
    tasks,
    reloadFromStorage,
    t,
  } = useTodo();

  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isBackupModalOpen) return null;

  const handleExport = () => {
    exportDataAsJSON();
    setMessage(t.backupDownloaded);
    setIsSuccess(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const result = importDataFromJSON(content);
      if (result.success) {
        reloadFromStorage();
        setMessage(t.restoredSuccess(result.taskCount));
        setIsSuccess(true);
      } else {
        setMessage(result.message);
        setIsSuccess(false);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleReset = () => {
    if (window.confirm(t.resetConfirm)) {
      const seeds = getInitialSeedTasks();
      saveTasksToStorage(seeds);
      reloadFromStorage();
      setMessage(t.backupDownloaded);
      setIsSuccess(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-md rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)] bg-stone-50/70 dark:bg-stone-900/50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
              {t.backupTitle}
            </h3>
          </div>
          <button
            onClick={() => setIsBackupModalOpen(false)}
            className="p-1 rounded-md text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs text-stone-600 dark:text-stone-300">
          <p className="leading-relaxed">
            {t.backupIntro}
          </p>

          <div className="p-3 rounded-xl bg-stone-100/70 dark:bg-stone-800/50 flex items-center justify-between text-xs">
            <span className="text-stone-500">{t.storedOnDevice(tasks.length)}</span>
          </div>

          {message && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                isSuccess
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900'
                  : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900'
              }`}
            >
              <Check className="w-3.5 h-3.5 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              onClick={handleExport}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 font-medium transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-stone-500" />
              <span>{t.exportJson}</span>
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 font-medium transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4 text-stone-500" />
              <span>{t.restoreJson}</span>
            </button>

            <button
              onClick={handleReset}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 font-medium transition-colors cursor-pointer text-[11px]"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{t.resetSample}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[var(--color-border)] bg-stone-50/70 dark:bg-stone-900/50 flex justify-end">
          <button
            onClick={() => setIsBackupModalOpen(false)}
            className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-white cursor-pointer"
          >
            {t.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
