import React, { useMemo, useState } from 'react';
import { Calendar, RotateCcw, Zap, ChevronDown, ChevronUp } from 'lucide-react';

export function TargetTimePicker({ targetTime, onTargetChange }) {
  const [isCollapsed, setIsCollapsed] = useState(() => typeof window !== 'undefined' && window.innerWidth < 640);

  // Format targetTime as string for <input type="datetime-local">
  const formattedInputValue = useMemo(() => {
    if (!targetTime) return '';
    const d = new Date(targetTime);
    const pad = (n) => String(n).padStart(2, '0');
    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const date = pad(d.getDate());
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    return `${year}-${month}-${date}T${hours}:${minutes}`;
  }, [targetTime]);

  // Readable summary e.g. "Today 10:00 PM"
  const summaryTime = useMemo(() => {
    if (!targetTime) return '';
    const d = new Date(targetTime);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, [targetTime]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    if (!val) return;
    const newDate = new Date(val);
    if (!isNaN(newDate.getTime())) {
      onTargetChange(newDate);
    }
  };

  // Quick preset helper functions
  const setQuickOffset = (secondsOffset) => {
    const newDate = new Date(Date.now() + secondsOffset * 1000);
    onTargetChange(newDate);
  };

  const setToday10PM = () => {
    const now = new Date();
    const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 22, 0, 0, 0);
    onTargetChange(target);
  };

  return (
    <div className="fixed top-2.5 left-2.5 sm:top-4 sm:left-4 z-40 glass-panel rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md transition-all max-w-[calc(100vw-20px)] sm:max-w-[320px]">
      {/* Header bar of floating box - entire header clickable to toggle */}
      <div
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`flex items-center justify-between gap-2 p-1.5 sm:p-2 sm:px-3 cursor-pointer select-none ${
          !isCollapsed ? 'border-b border-slate-100 dark:border-slate-800/80' : ''
        }`}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <Calendar className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 truncate">
            {isCollapsed ? 'Target' : 'Target Time'}
          </span>
          {isCollapsed && (
            <span className="text-[10px] sm:text-[11px] font-mono px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 font-semibold whitespace-nowrap">
              {summaryTime}
            </span>
          )}
        </div>

        {/* Toggle Collapse/Expand */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsCollapsed(!isCollapsed);
          }}
          className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={isCollapsed ? 'Expand Target Time controls' : 'Minimize to compact box'}
          aria-label="Toggle Target Time Box"
        >
          {isCollapsed ? (
            <ChevronDown className="w-3.5 h-3.5" />
          ) : (
            <ChevronUp className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Expandable Content */}
      {!isCollapsed && (
        <div className="p-2 sm:p-2.5 space-y-2">
          {/* Main Datetime input */}
          <div>
            <input
              id="target-datetime-input"
              type="datetime-local"
              value={formattedInputValue}
              onChange={handleInputChange}
              className="w-full px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-medium text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Quick presets */}
          <div className="flex items-center gap-1 flex-wrap pt-0.5">
            <button
              type="button"
              onClick={setToday10PM}
              className="inline-flex items-center gap-1 px-1.5 py-1 rounded text-[11px] font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
              title="Reset to 10:00 PM Today"
            >
              <RotateCcw className="w-2.5 h-2.5 text-indigo-500" />
              10 PM
            </button>

            <button
              type="button"
              onClick={() => setQuickOffset(10)}
              className="inline-flex items-center gap-0.5 px-1.5 py-1 rounded text-[11px] font-medium bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 transition-colors border border-indigo-200 dark:border-indigo-800"
              title="Trigger zero in 10 seconds for testing"
            >
              <Zap className="w-2.5 h-2.5 text-amber-500" />
              +10s
            </button>

            <button
              type="button"
              onClick={() => setQuickOffset(60)}
              className="inline-flex items-center px-1.5 py-1 rounded text-[11px] font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              +1m
            </button>

            <button
              type="button"
              onClick={() => setQuickOffset(3600)}
              className="inline-flex items-center px-1.5 py-1 rounded text-[11px] font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              +1h
            </button>

            <button
              type="button"
              onClick={() => setQuickOffset(-120)}
              className="inline-flex items-center px-1.5 py-1 rounded text-[11px] font-medium bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 transition-colors border border-rose-200 dark:border-rose-800"
              title="Set to 2 minutes ago to test Overtime display"
            >
              -2m (OT)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
