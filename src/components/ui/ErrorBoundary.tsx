'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('App ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  private handleReset = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('tedlist_theme');
        localStorage.removeItem('tedlist_lang');
      } catch {
        // ignore
      }
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-full items-center justify-center bg-[#090d16] text-white p-6 select-none">
          <div className="max-w-md w-full bg-[#0f172a] border border-slate-800 rounded-2xl p-6 text-center space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 mx-auto flex items-center justify-center text-xl font-bold border border-indigo-500/20">
              ✓
            </div>
            <h2 className="text-lg font-bold text-slate-100">
              تدلیست — لیست کارها
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              مشکلی در اجرای برنامه به وجود آمد. با فشردن دکمه زیر می‌توانید برنامه را مجدداً باز کنید.
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all cursor-pointer active:scale-95"
              >
                بارگذاری مجدد برنامه
              </button>
              <button
                onClick={this.handleReset}
                className="w-full py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-all cursor-pointer"
              >
                تنظیم مجدد
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
