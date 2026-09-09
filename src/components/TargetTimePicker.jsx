import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Calendar, RotateCcw, Zap, ChevronDown, ChevronUp, Clock, Play, Pause, AlertCircle } from 'lucide-react';

const pad = (n, width = 2) => String(Math.floor(n)).padStart(width, '0');

export function parseTimeString(inputStr, baseDate = new Date()) {
  if (!inputStr || typeof inputStr !== 'string') return null;
  const str = inputStr.trim().toLowerCase();
  if (!str) return null;

  const isPM = /pm|p(?!\w)/i.test(str);
  const isAM = /am|a(?!\w)/i.test(str);
  const hasMeridiem = isPM || isAM;

  const clean = str.replace(/[^0-9:]/g, ' ').trim();
  const parts = clean.split(/[:\s]+/).filter(Boolean).map(Number);

  if (parts.length === 0) return null;

  let hours = parts[0];
  let minutes = parts.length > 1 ? parts[1] : 0;
  let seconds = parts.length > 2 ? parts[2] : 0;

  if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) return null;

  if (hasMeridiem) {
    if (hours === 12) {
      hours = isPM ? 12 : 0;
    } else if (isPM) {
      hours = (hours % 12) + 12;
    } else {
      hours = hours % 12;
    }
  }

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59) {
    return null;
  }

  const result = new Date(baseDate);
  result.setHours(hours, minutes, seconds, 0);
  return result;
}

export function TargetTimePicker({
  targetTime,
  onTargetChange,
  timeState,
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

  const dateInputRef = useRef(null);

  const handleOpenDatePicker = (e) => {
    e?.stopPropagation?.();
    if (dateInputRef.current) {
      if (typeof dateInputRef.current.showPicker === 'function') {
        try {
          dateInputRef.current.showPicker();
          return;
        } catch (err) {
          // fallback
        }
      }
      dateInputRef.current.focus();
    }
  };

  // Formatted string for desktop writing e.g. "02:30:00 PM"
  const formattedTargetTime = useMemo(() => {
    if (!targetTime) return '';
    const d = new Date(targetTime);
    return d.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }, [targetTime]);

  const [desktopTimeText, setDesktopTimeText] = useState(formattedTargetTime);
  const [isTypingDesktop, setIsTypingDesktop] = useState(false);

  // Sync desktop text whenever targetTime changes from external sources (e.g. presets, reset)
  useEffect(() => {
    if (!isTypingDesktop) {
      setDesktopTimeText(formattedTargetTime);
    }
  }, [formattedTargetTime, isTypingDesktop]);

  // Handle typing freely on desktop
  const handleDesktopTimeChange = (e) => {
    const val = e.target.value;
    setDesktopTimeText(val);
    setIsTypingDesktop(true);

    const parsed = parseTimeString(val, targetTime || new Date());
    if (parsed) {
      onTargetChange(parsed);
    }
  };

  const handleDesktopTimeBlur = () => {
    setIsTypingDesktop(false);
    const parsed = parseTimeString(desktopTimeText, targetTime || new Date());
    if (parsed) {
      onTargetChange(parsed);
      setDesktopTimeText(
        parsed.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    } else {
      // Restore valid formatted string if invalid
      setDesktopTimeText(formattedTargetTime);
    }
  };

  const handleDesktopTimeKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
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
          {/* Mini Version of the Big Timer (Live Countdown / Overtime Preview) - Mobile Only */}
          {timeState && (
            <div
              className={`sm:hidden p-2 rounded-md border transition-colors shadow-sm ${
                isPaused
                  ? 'border-amber-300 dark:border-amber-900/70 bg-amber-50/60 dark:bg-amber-950/30'
                  : timeState.isOvertime
                  ? 'border-red-300 dark:border-red-900/70 bg-red-50/60 dark:bg-red-950/30'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950'
              }`}
            >
              {/* Mini Status Badge */}
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Timer Preview
                </span>
                {isPaused ? (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                    <Pause className="w-2.5 h-2.5 fill-current" />
                    PAUSED
                  </span>
                ) : timeState.isOvertime ? (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-800 animate-pulse">
                    <AlertCircle className="w-2.5 h-2.5" />
                    OVERTIME
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                    <Clock className="w-2.5 h-2.5" />
                    REMAINING
                  </span>
                )}
              </div>

              {/* Smaller version of Big Timer blocks */}
              <div className="flex items-center justify-center gap-1.5 font-mono">
                {timeState.isOvertime && (
                  <span className="text-red-600 dark:text-red-500 font-black text-xl self-center pb-2 flex-shrink-0">
                    -
                  </span>
                )}

                {/* Days if days > 0 */}
                {timeState.days > 0 && (
                  <>
                    <div className="flex flex-col items-center">
                      <div
                        className={`px-2 py-1 rounded min-w-[34px] text-center border font-bold text-sm sm:text-base ${
                          timeState.isOvertime
                            ? 'bg-red-100/80 dark:bg-red-900/40 border-red-300 dark:border-red-800 text-red-700 dark:text-red-300'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white'
                        }`}
                      >
                        {pad(timeState.days)}
                      </div>
                      <span className="text-[8px] font-sans font-bold text-slate-400 mt-0.5">DAYS</span>
                    </div>
                    <span className="text-xs font-bold text-slate-400 pb-2">:</span>
                  </>
                )}

                {/* Hours */}
                <div className="flex flex-col items-center">
                  <div
                    className={`px-2 py-1 rounded min-w-[34px] text-center border font-bold text-sm sm:text-base ${
                      timeState.isOvertime
                        ? 'bg-red-100/80 dark:bg-red-900/40 border-red-300 dark:border-red-800 text-red-700 dark:text-red-300'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white'
                    }`}
                  >
                    {pad(timeState.days > 0 ? timeState.hours : timeState.totalHours)}
                  </div>
                  <span className="text-[8px] font-sans font-bold text-slate-400 mt-0.5">HOURS</span>
                </div>

                <span className="text-xs font-bold text-slate-400 pb-2">:</span>

                {/* Minutes */}
                <div className="flex flex-col items-center">
                  <div
                    className={`px-2 py-1 rounded min-w-[34px] text-center border font-bold text-sm sm:text-base ${
                      timeState.isOvertime
                        ? 'bg-red-100/80 dark:bg-red-900/40 border-red-300 dark:border-red-800 text-red-700 dark:text-red-300'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white'
                    }`}
                  >
                    {pad(timeState.minutes)}
                  </div>
                  <span className="text-[8px] font-sans font-bold text-slate-400 mt-0.5">MINS</span>
                </div>

                <span className="text-xs font-bold text-slate-400 pb-2">:</span>

                {/* Seconds */}
                <div className="flex flex-col items-center">
                  <div
                    className={`px-2 py-1 rounded min-w-[34px] text-center border font-bold text-sm sm:text-base ${
                      timeState.isOvertime
                        ? 'bg-red-100/80 dark:bg-red-900/40 border-red-300 dark:border-red-800 text-red-700 dark:text-red-300'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white'
                    }`}
                  >
                    {pad(timeState.seconds)}
                  </div>
                  <span className="text-[8px] font-sans font-bold text-slate-400 mt-0.5">SECS</span>
                </div>
              </div>
            </div>
          )}

          {/* Custom Target Time Section: shows only time on the bar + date selector pill */}
          <div className="space-y-1.5">
            <label
              htmlFor="target-time-input"
              className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block"
            >
              Target Time
            </label>

            {/* Combined Field Bar: displays ONLY Time on the bar + Date Selector Pill */}
            <div className="flex items-center rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-indigo-500 transition-all overflow-hidden shadow-inner">
              {/* Time Field: Native on mobile, Free-form writable input on desktop */}
              <div className="relative flex-1 flex items-center min-w-0 px-2.5 py-1.5">
                <Clock className="w-4 h-4 text-indigo-500 flex-shrink-0 mr-2" />

                {/* Mobile View: Native time picker (unchanged) */}
                <input
                  id="target-time-input-mobile"
                  type="time"
                  step="1"
                  value={timeInputValue}
                  onChange={handleTimeChange}
                  className="sm:hidden w-full bg-transparent text-slate-900 dark:text-slate-100 font-mono text-sm font-semibold focus:outline-none cursor-pointer"
                  title="Set Target Time"
                  aria-label="Target Time"
                />

                {/* Desktop View: Direct writable input for desired time */}
                <input
                  id="target-time-input-desktop"
                  type="text"
                  spellCheck="false"
                  autoComplete="off"
                  value={desktopTimeText}
                  onChange={handleDesktopTimeChange}
                  onBlur={handleDesktopTimeBlur}
                  onKeyDown={handleDesktopTimeKeyDown}
                  placeholder="e.g. 2:30 PM or 14:30"
                  className="hidden sm:block w-full bg-transparent text-slate-900 dark:text-slate-100 font-mono text-sm font-semibold focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600"
                  title="Type your desire time (e.g. 2:30 PM, 14:30, 9am, 10:00:00) and press Enter"
                  aria-label="Write Target Time"
                />
              </div>

              {/* Date Button with native date picker */}
              <div
                onClick={handleOpenDatePicker}
                className="relative border-l border-slate-200 dark:border-slate-800 flex-shrink-0 cursor-pointer"
              >
                <div className="flex items-center gap-1.5 px-2.5 py-2 bg-slate-100/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors select-none">
                  <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{dateLabel}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </div>
                <input
                  ref={dateInputRef}
                  type="date"
                  value={dateInputValue}
                  onChange={handleDateChange}
                  onClick={(e) => {
                    if (typeof e.currentTarget.showPicker === 'function') {
                      try {
                        e.currentTarget.showPicker();
                      } catch (err) {
                        // ignore
                      }
                    }
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                  title="Click to choose custom date"
                  aria-label="Choose Target Date"
                />
              </div>
            </div>

            {/* Desktop Helper Hint */}
            <div className="hidden sm:flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 px-0.5">
              <span>Write time (e.g. 2:30 PM, 14:30)</span>
              <span>↵ Enter to apply</span>
            </div>
          </div>

          {/* Quick presets */}
          {/* Quick presets from now */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              Quick Presets from Now:
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => setQuickOffset(5 * 60)}
                className="py-1.5 px-2 text-center text-xs font-semibold rounded-md bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-950/60 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-800 transition-colors cursor-pointer select-none active:scale-95"
                title="Add 5 minutes to current time"
              >
                +5min
              </button>
              <button
                type="button"
                onClick={() => setQuickOffset(15 * 60)}
                className="py-1.5 px-2 text-center text-xs font-semibold rounded-md bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-950/60 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-800 transition-colors cursor-pointer select-none active:scale-95"
                title="Add 15 minutes to current time"
              >
                +15min
              </button>
              <button
                type="button"
                onClick={() => setQuickOffset(30 * 60)}
                className="py-1.5 px-2 text-center text-xs font-semibold rounded-md bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-950/60 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-800 transition-colors cursor-pointer select-none active:scale-95"
                title="Add 30 minutes to current time"
              >
                +30min
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
