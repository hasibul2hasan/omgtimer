import React, { useMemo, useState, useEffect } from 'react';
import { Calendar, RotateCcw, Zap, ChevronDown, ChevronUp, Clock, Play, Pause } from 'lucide-react';

export function TargetTimePicker({
  targetTime,
  onTargetChange,
  isPaused = false,
  onPlay,
  onPause,
  onReset,
  isMobileOpen = false,
  onToggleMobile,
}) {
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

  // Real-time live clock
  const [currentClock, setCurrentClock] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentClock(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const liveTimeString = useMemo(() => {
    return currentClock.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }, [currentClock]);

  const liveDateString = useMemo(() => {
    return currentClock.toLocaleDateString([], {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  }, [currentClock]);

  // Check if collapsed based on screen mode
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const isCollapsed = isMobile ? !isMobileOpen : isDesktopCollapsed;

  const handleToggle = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 640 && onToggleMobile) {
      onToggleMobile();
    } else {
      setIsDesktopCollapsed((prev) => !prev);
    }
  };

  // Extract time string for <input type="time" step="1">: "HH:MM:SS"
  const timeInputValue = useMemo(() => {
    if (!targetTime) return '';
    const d = new Date(targetTime);
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }, [targetTime]);

  // Extract date string for <input type="date">: "YYYY-MM-DD"
  const dateInputValue = useMemo(() => {
    if (!targetTime) return '';
    const d = new Date(targetTime);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }, [targetTime]);

  // Readable date label for badge e.g. "Today", "Tomorrow", or "Sep 15"
  const dateLabel = useMemo(() => {
    if (!targetTime) return 'Today';
    const d = new Date(targetTime);
    const now = new Date();

    if (d.toDateString() === now.toDateString()) {
      return 'Today';
    }

    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (d.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }

    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }, [targetTime]);

  // Readable summary e.g. "Today 10:00:00 PM"
  const summaryTime = useMemo(() => {
    if (!targetTime) return '';
    const d = new Date(targetTime);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    if (isToday) {
      return timeStr;
    }
    return `${d.toLocaleDateString([], { month: 'short', day: 'numeric' })} ${timeStr}`;
  }, [targetTime]);

  // Handle changing time only (preserving chosen date)
  const handleTimeChange = (e) => {
    const val = e.target.value;
    if (!val) return;
    const parts = val.split(':');
    const hours = parseInt(parts[0], 10) || 0;
    const minutes = parseInt(parts[1], 10) || 0;
    const seconds = parseInt(parts[2], 10) || 0;

    const newDate = new Date(targetTime || Date.now());
    newDate.setHours(hours, minutes, seconds, 0);
    onTargetChange(newDate);
  };

  // Handle changing date only (preserving chosen time)
  const handleDateChange = (e) => {
    const val = e.target.value;
    if (!val) return;
    const [year, month, day] = val.split('-').map(Number);

    const newDate = new Date(targetTime || Date.now());
    newDate.setFullYear(year, month - 1, day);
    onTargetChange(newDate);
  };

  const setDateToToday = () => {
    const now = new Date();
    const newDate = new Date(targetTime || Date.now());
    newDate.setFullYear(now.getFullYear(), now.getMonth(), now.getDate());
    onTargetChange(newDate);
  };

  const setDateToTomorrow = () => {
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const newDate = new Date(targetTime || Date.now());
    newDate.setFullYear(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());
    onTargetChange(newDate);
  };

  // Quick preset helper functions from current time
  const setQuickOffset = (secondsOffset) => {
    const newDate = new Date(Date.now() + secondsOffset * 1000);
    onTargetChange(newDate);
  };

  return (
    <div className="relative sm:fixed sm:top-4 sm:left-4 z-40 glass-panel rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md transition-all w-full sm:w-auto sm:max-w-[320px]">
      {/* Header bar / trigger */}
      <div
        onClick={handleToggle}
        className={`flex items-center justify-between gap-1.5 p-1.5 sm:p-2 sm:px-3 cursor-pointer select-none ${
          !isCollapsed ? 'sm:border-b sm:border-slate-100 sm:dark:border-slate-800/80' : ''
        }`}
      >
        <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
          <Calendar className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 truncate">
            {isCollapsed ? 'Target' : 'Target Time'}
          </span>
          {isCollapsed && (
            <span className="text-[10px] sm:text-[11px] font-mono px-1 sm:px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 font-semibold truncate max-w-[100px] sm:max-w-none">
              {summaryTime}
            </span>
          )}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
          {/* Quick Play/Pause toggle on desktop */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (isPaused) {
                onPlay?.();
              } else {
                onPause?.();
              }
            }}
            className={`hidden sm:inline-flex items-center justify-center p-1 rounded transition-colors ${
              isPaused
                ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 hover:bg-amber-200'
                : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={isPaused ? 'Resume countdown (Play)' : 'Pause countdown'}
            aria-label={isPaused ? 'Play' : 'Pause'}
          >
            {isPaused ? (
              <Play className="w-3.5 h-3.5 fill-current text-amber-600" />
            ) : (
              <Pause className="w-3.5 h-3.5 fill-current text-slate-600 dark:text-slate-300" />
            )}
          </button>

          {/* Quick Reset button on desktop */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onReset?.();
            }}
            className="hidden sm:inline-flex items-center justify-center p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Reset timer to current time"
            aria-label="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Toggle Collapse/Expand */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleToggle();
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
      </div>

      {/* Expandable Content - overlay dropdown on mobile, inline on desktop */}
      {!isCollapsed && (
        <div className="absolute left-0 top-full mt-1.5 sm:mt-0 sm:static z-50 w-[min(340px,calc(100vw-24px))] sm:w-full glass-panel rounded-md border border-slate-200 dark:border-slate-800 sm:border-none bg-white dark:bg-slate-900 shadow-2xl sm:shadow-none p-2.5 sm:p-3 space-y-2.5">
          {/* Primary Play, Pause & Reset Control Bar */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              Timer Controls
            </span>
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-md bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={onPlay}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded font-semibold text-xs transition-colors cursor-pointer select-none ${
                  !isPaused
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
                }`}
                title="Start / Resume countdown"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play</span>
              </button>

              <button
                type="button"
                onClick={onPause}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded font-semibold text-xs transition-colors cursor-pointer select-none ${
                  isPaused
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
                }`}
                title="Pause countdown"
              >
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </button>

              <button
                type="button"
                onClick={onReset}
                className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded font-semibold text-xs bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer select-none"
                title="Reset timer to current time (00:00:00)"
              >
                <RotateCcw className="w-3.5 h-3.5 text-indigo-500" />
                <span>Reset</span>
              </button>
            </div>
          </div>
          {/* Live Current Time Clock Display */}
          <div className="flex items-center justify-between px-3 py-2 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2 min-w-0">
              <div className="relative flex items-center justify-center w-7 h-7 rounded-md bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                <Clock className="w-3.5 h-3.5" />
                <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
                  <span>Current Time</span>
                  <span className="text-[9px] px-1 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold">
                    LIVE
                  </span>
                </div>
                <div className="text-sm font-bold font-mono text-slate-900 dark:text-slate-100 tracking-tight">
                  {liveTimeString}
                </div>
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {liveDateString}
              </div>
            </div>
          </div>

          {/* Redesigned Custom Target Time Section: shows only time on the bar + date selector button */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="target-time-input"
                className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
              >
                Target Time
              </label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={setDateToToday}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                    dateLabel === 'Today'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                  title="Set target date to today"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={setDateToTomorrow}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                    dateLabel === 'Tomorrow'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                  title="Set target date to tomorrow"
                >
                  Tomorrow
                </button>
              </div>
            </div>

            {/* Combined Field Bar: displays ONLY Time on the bar + Date Selector Pill */}
            <div className="flex items-center rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-indigo-500 transition-all overflow-hidden shadow-inner">
              {/* Only Time Field */}
              <div className="relative flex-1 flex items-center min-w-0 px-2.5 py-1.5">
                <Clock className="w-4 h-4 text-indigo-500 flex-shrink-0 mr-2" />
                <input
                  id="target-time-input"
                  type="time"
                  step="1"
                  value={timeInputValue}
                  onChange={handleTimeChange}
                  className="w-full bg-transparent text-slate-900 dark:text-slate-100 font-mono text-sm font-semibold focus:outline-none cursor-pointer"
                  title="Set Target Time (Hours : Minutes : Seconds)"
                  aria-label="Target Time"
                />
              </div>

              {/* Date Button with hidden native date picker */}
              <div className="relative border-l border-slate-200 dark:border-slate-800 flex-shrink-0">
                <div className="flex items-center gap-1.5 px-2.5 py-2 bg-slate-100/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors select-none">
                  <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{dateLabel}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </div>
                <input
                  type="date"
                  value={dateInputValue}
                  onChange={handleDateChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                  title="Click to choose custom date"
                  aria-label="Choose Target Date"
                />
              </div>
            </div>
          </div>

          {/* Quick presets */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              Quick Presets from Now:
            </span>
            <div className="grid grid-cols-3 gap-1">
              <button
                type="button"
                onClick={() => setQuickOffset(60)}
                className="py-1 px-1.5 text-center text-xs font-medium rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
                title="1 minute countdown"
              >
                +1 min
              </button>
              <button
                type="button"
                onClick={() => setQuickOffset(300)}
                className="py-1 px-1.5 text-center text-xs font-medium rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
                title="5 minutes countdown"
              >
                +5 min
              </button>
              <button
                type="button"
                onClick={() => setQuickOffset(3600)}
                className="py-1 px-1.5 text-center text-xs font-medium rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
                title="1 hour countdown"
              >
                +1 hour
              </button>
            </div>

            <div className="grid grid-cols-2 gap-1 pt-0.5">
              <button
                type="button"
                onClick={() => setQuickOffset(10)}
                className="flex items-center justify-center gap-1 py-1 px-2 text-[11px] font-medium rounded-md bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 transition-colors"
                title="Trigger zero in 10 seconds for testing"
              >
                <Zap className="w-2.5 h-2.5 text-amber-500" />
                <span>+10s (Zero alert)</span>
              </button>

              <button
                type="button"
                onClick={() => setQuickOffset(-120)}
                className="flex items-center justify-center gap-1 py-1 px-2 text-[11px] font-medium rounded-md bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 transition-colors"
                title="Set to 2 minutes ago to test Overtime display"
              >
                <RotateCcw className="w-2.5 h-2.5 text-rose-500" />
                <span>-2m (Overtime)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
