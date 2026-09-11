import React, { useMemo, useState, useRef, useEffect } from 'react';
import { Clock, Target, RotateCcw, Check } from 'lucide-react';

function formatDisplayTime(date, includeSeconds = false) {
  if (!date) return '--:--';
  const d = new Date(date);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  const timeOptions = {
    hour: '2-digit',
    minute: '2-digit',
    ...(includeSeconds ? { second: '2-digit' } : {}),
  };
  const timeStr = d.toLocaleTimeString([], timeOptions);

  if (isToday) {
    return timeStr;
  }

  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (d.toDateString() === tomorrow.toDateString()) {
    return `Tomorrow, ${timeStr}`;
  }

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) {
    return `Yesterday, ${timeStr}`;
  }

  return `${d.toLocaleDateString([], { month: 'short', day: 'numeric' })}, ${timeStr}`;
}

export function SessionTimeBar({ startTime, targetTime, onSetStartToNow }) {
  const [internalStartTime, setInternalStartTime] = useState(null);
  const [feedback, setFeedback] = useState(false);
  const lastTapRef = useRef(0);

  // Sync internal state if parent's startTime changes
  useEffect(() => {
    setInternalStartTime(null);
  }, [startTime]);

  const effectiveStartTime = internalStartTime || startTime;

  const startedString = useMemo(
    () => formatDisplayTime(effectiveStartTime, feedback),
    [effectiveStartTime, feedback]
  );
  const targetedString = useMemo(() => formatDisplayTime(targetTime, false), [targetTime]);

  const handleSetToNow = (e) => {
    if (e) {
      e.stopPropagation();
    }
    const nowTs = Date.now();
    if (nowTs - lastTapRef.current < 350) return;
    lastTapRef.current = nowTs;

    const now = new Date();
    setInternalStartTime(now);
    onSetStartToNow?.(now);
    setFeedback(true);
    setTimeout(() => setFeedback(false), 2000);
  };

  // Calculate planned span in human readable form if valid
  const durationLabel = useMemo(() => {
    if (!effectiveStartTime || !targetTime) return null;
    const diffMs = targetTime.getTime() - effectiveStartTime.getTime();
    if (diffMs <= 0) return null;
    const totalSecs = Math.round(diffMs / 1000);
    const hours = Math.floor(totalSecs / 3600);
    const minutes = Math.round((totalSecs % 3600) / 60);

    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (parts.length === 0 && totalSecs > 0) parts.push('<1m');
    return parts.length > 0 ? parts.join(' ') : null;
  }, [effectiveStartTime, targetTime]);

  return (
    <div className="px-3.5 py-2 rounded-2xl apple-glass shadow-sm flex flex-col gap-1.5 select-none w-full max-w-[270px] sm:max-w-[290px]">
      {/* 1. Started Time Row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <Clock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 flex-shrink-0" />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Starteddd
          </span>
        </div>

        <div className="flex items-center gap-1.5 min-w-0">
          {onSetStartToNow && (
            <button
              type="button"
              onClick={handleSetToNow}
              onTouchEnd={handleSetToNow}
              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-semibold transition-all cursor-pointer select-none flex-shrink-0 touch-manipulation apple-press ${feedback
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-black/5 hover:bg-indigo-500/10 dark:bg-white/10 dark:hover:bg-indigo-500/20 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
              title="Set started time to exact current time (Now)"
              aria-label="Set started time to current time"
            >
              {feedback ? (
                <>
                  <Check className="w-2.5 h-2.5 text-white" />
                  <span>Set!</span>
                </>
              ) : (
                <>
                  <RotateCcw className="w-2.5 h-2.5" />
                  <span>Now</span>
                </>
              )}
            </button>
          )}

          <span
            className={`text-xs font-mono tabular-nums font-semibold truncate transition-colors ${feedback
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-slate-900 dark:text-slate-100'
              }`}
          >
            {startedString}
          </span>
        </div>
      </div>

      {/* Subtle Divider */}
      <div className="h-px bg-black/5 dark:bg-white/10 w-full" />

      {/* 2. Targeted Time Row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <Target className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Targeted
          </span>
        </div>

        <div className="flex items-center gap-1.5 min-w-0">
          {durationLabel && (
            <span className="text-[9px] font-mono tabular-nums font-semibold px-1.5 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-slate-700 dark:text-slate-300">
              {durationLabel}
            </span>
          )}
          <span className="text-xs font-mono tabular-nums font-semibold text-indigo-600 dark:text-indigo-400 truncate">
            {targetedString}
          </span>
        </div>
      </div>
    </div>
  );
}
