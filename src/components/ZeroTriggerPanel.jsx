import React from 'react';
import { PartyPopper, Bell, BellOff, Sparkles, Volume2 } from 'lucide-react';

export function ZeroTriggerPanel({
  enableConfetti,
  setEnableConfetti,
  enableSound,
  setEnableSound,
  onPreviewConfetti,
  onPreviewSound,
}) {
  return (
    <div className="inline-flex items-center gap-2 p-1 rounded-md border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 shadow-xs select-none">
      {/* Confetti Action: Toggle + Preview */}
      <div className="flex items-center rounded-md border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 overflow-hidden">
        <button
          type="button"
          onClick={() => setEnableConfetti((prev) => !prev)}
          className={`p-1.5 sm:p-2 transition-all cursor-pointer select-none active:scale-95 ${
            enableConfetti
              ? 'bg-pink-100 dark:bg-pink-950/70 text-pink-600 dark:text-pink-400'
              : 'bg-transparent text-slate-400 dark:text-slate-600 opacity-50 hover:opacity-90'
          }`}
          title={enableConfetti ? 'Confetti: Active (tap to disable)' : 'Confetti: Disabled (tap to enable)'}
          aria-label={enableConfetti ? 'Disable Confetti' : 'Enable Confetti'}
        >
          <PartyPopper className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onPreviewConfetti}
          className="p-1.5 sm:p-2 border-l border-slate-200 dark:border-slate-800 text-slate-400 hover:text-pink-600 dark:hover:text-pink-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer select-none active:scale-95"
          title="Preview Confetti burst"
          aria-label="Preview Confetti"
        >
          <Sparkles className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 flex-shrink-0" />

      {/* Sound Action: Toggle + Preview */}
      <div className="flex items-center rounded-md border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 overflow-hidden">
        <button
          type="button"
          onClick={() => setEnableSound((prev) => !prev)}
          className={`p-1.5 sm:p-2 transition-all cursor-pointer select-none active:scale-95 ${
            enableSound
              ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400'
              : 'bg-transparent text-slate-400 dark:text-slate-600 opacity-50 hover:opacity-90'
          }`}
          title={enableSound ? 'Sound Alert: Active (tap to disable)' : 'Sound Alert: Muted (tap to enable)'}
          aria-label={enableSound ? 'Disable Sound Alert' : 'Enable Sound Alert'}
        >
          {enableSound ? (
            <Bell className="w-4 h-4" />
          ) : (
            <BellOff className="w-4 h-4" />
          )}
        </button>

        <button
          type="button"
          onClick={onPreviewSound}
          className="p-1.5 sm:p-2 border-l border-slate-200 dark:border-slate-800 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer select-none active:scale-95"
          title="Preview Sound chime"
          aria-label="Preview Sound"
        >
          <Volume2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
