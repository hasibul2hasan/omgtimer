import React from 'react';
import { PartyPopper, Bell } from 'lucide-react';

export function ZeroTriggerPanel({
  enableConfetti,
  setEnableConfetti,
  enableSound,
  setEnableSound,
  onPreviewConfetti,
  onPreviewSound,
}) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
      <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 whitespace-nowrap">
        Zero-Hour Actions:
      </span>

      <div className="flex items-center gap-2 flex-wrap justify-center">
        {/* 1. DROP CONFETTI */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={enableConfetti}
              onChange={(e) => setEnableConfetti(e.target.checked)}
              className="w-3.5 h-3.5 rounded-sm text-indigo-600 focus:ring-1 focus:ring-indigo-500 border-slate-300 dark:border-slate-600 dark:bg-slate-800 cursor-pointer"
            />
            <PartyPopper className="w-3.5 h-3.5 text-pink-500 flex-shrink-0" />
            <span className="font-medium text-slate-700 dark:text-slate-200">
              Confetti
            </span>
          </label>
          <button
            type="button"
            onClick={onPreviewConfetti}
            className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-pink-50 hover:bg-pink-100 dark:bg-pink-950/50 dark:hover:bg-pink-900/60 text-pink-600 dark:text-pink-300 border border-pink-200 dark:border-pink-800 transition-colors ml-1"
            title="Preview Confetti"
          >
            🎉
          </button>
        </div>

        {/* 2. PLAY AUDIBLE ALERT */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={enableSound}
              onChange={(e) => setEnableSound(e.target.checked)}
              className="w-3.5 h-3.5 rounded-sm text-indigo-600 focus:ring-1 focus:ring-indigo-500 border-slate-300 dark:border-slate-600 dark:bg-slate-800 cursor-pointer"
            />
            <Bell className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
            <span className="font-medium text-slate-700 dark:text-slate-200">
              Sound alert
            </span>
          </label>
          <button
            type="button"
            onClick={onPreviewSound}
            className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/50 dark:hover:bg-amber-900/60 text-amber-600 dark:text-amber-300 border border-amber-200 dark:border-amber-800 transition-colors ml-1"
            title="Preview Sound Alert"
          >
            🔔
          </button>
        </div>
      </div>
    </div>
  );
}
