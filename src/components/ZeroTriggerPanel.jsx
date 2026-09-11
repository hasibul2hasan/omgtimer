import React from 'react';
import { PartyPopper, Bell, BellOff, Sparkles, Volume2, Square } from 'lucide-react';

export function ZeroTriggerPanel({
  enableConfetti,
  setEnableConfetti,
  enableSound,
  setEnableSound,
  onPreviewConfetti,
  onPreviewSound,
  isPlayingSound = false,
}) {
  return (
    <div className="inline-flex items-center gap-2 select-none apple-glass rounded-full px-2.5 py-1.5 shadow-sm">
      {/* Confetti Action: Toggle + Preview */}
      <div className="flex items-center rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 overflow-hidden">
        <button
          type="button"
          onClick={() => setEnableConfetti((prev) => !prev)}
          className={`p-1.5 sm:p-2 transition-all cursor-pointer select-none apple-press ${
            enableConfetti
              ? 'bg-pink-500/20 text-pink-600 dark:text-pink-400 font-bold'
              : 'bg-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
          title={enableConfetti ? 'Confetti: Active (tap to disable)' : 'Confetti: Disabled (tap to enable)'}
          aria-label={enableConfetti ? 'Disable Confetti' : 'Enable Confetti'}
        >
          <PartyPopper className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onPreviewConfetti}
          className="p-1.5 sm:p-2 border-l border-black/5 dark:border-white/10 text-slate-400 hover:text-pink-600 dark:hover:text-pink-400 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer select-none apple-press"
          title="Preview Confetti burst"
          aria-label="Preview Confetti"
        >
          <Sparkles className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="h-4 w-px bg-black/10 dark:bg-white/15 flex-shrink-0" />

      {/* Sound Action: Toggle + Preview */}
      <div className="flex items-center rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 overflow-hidden">
        <button
          type="button"
          onClick={() => setEnableSound((prev) => !prev)}
          className={`p-1.5 sm:p-2 transition-all cursor-pointer select-none apple-press ${
            enableSound
              ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold'
              : 'bg-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
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
          className={`p-1.5 sm:p-2 border-l border-black/5 dark:border-white/10 transition-colors cursor-pointer select-none apple-press ${
            isPlayingSound
              ? 'text-amber-600 dark:text-amber-400 bg-amber-500/20 animate-pulse'
              : 'text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-black/5 dark:hover:bg-white/10'
          }`}
          title={isPlayingSound ? 'Stop Ringtone' : 'Preview Ringtone (~10s, randomized)'}
          aria-label={isPlayingSound ? 'Stop Ringtone' : 'Preview Ringtone'}
        >
          {isPlayingSound ? (
            <Square className="w-3.5 h-3.5 fill-current" />
          ) : (
            <Volume2 className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}
