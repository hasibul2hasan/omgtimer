import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Calendar, RotateCcw, ChevronDown, ChevronUp, Clock, Play, Pause, AlertCircle } from 'lucide-react';

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

  // Readable summary e.g. "Today 10:00 PM"
  const summaryTime = useMemo(() => {
    if (!targetTime) return '';
    const d = new Date(targetTime);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    const timeStr = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
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

  // Formatted string for desktop writing e.g. "2:30 PM"
  const formattedTargetTime = useMemo(() => {
    if (!targetTime) return '';
    const d = new Date(targetTime);
    return d.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    });
  }, [targetTime]);

  const [desktopTimeText, setDesktopTimeText] = useState(formattedTargetTime);
  const [isTypingDesktop, setIsTypingDesktop] = useState(false);

  // Sync desktop text whenever targetTime changes
  useEffect(() => {
    if (!isTypingDesktop) {
      setDesktopTimeText(formattedTargetTime);
    }
  }, [formattedTargetTime, isTypingDesktop]);

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
          hour: 'numeric',
          minute: '2-digit',
        })
      );
    } else {
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
    <div className="relative sm:fixed sm:top-4 sm:left-4 z-40 apple-glass rounded-2xl shadow-lg transition-all duration-200 w-full sm:w-auto sm:max-w-[320px]">
      {/* Header bar / trigger */}
      <div
        onClick={handleToggle}
        className={`flex items-center justify-between gap-2 p-2 sm:px-3.5 cursor-pointer select-none apple-press ${
          !isCollapsed ? 'sm:border-b sm:border-black/5 sm:dark:border-white/10' : ''
        }`}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-indigo-500/10 dark:bg-indigo-400/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-semibold tracking-tight text-slate-800 dark:text-slate-200 truncate">
            {isCollapsed ? 'Target' : 'Target Time'}
          </span>
          {isCollapsed && (
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold truncate max-w-[100px] sm:max-w-none">
              {summaryTime}
            </span>
          )}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 flex-shrink-0">
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
            className={`hidden sm:inline-flex items-center justify-center p-1 rounded-full transition-colors apple-press ${
              isPaused
                ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10'
            }`}
            title={isPaused ? 'Resume countdown (Play)' : 'Pause countdown'}
            aria-label={isPaused ? 'Play' : 'Pause'}
          >
            {isPaused ? (
              <Play className="w-3.5 h-3.5 fill-current text-amber-600 dark:text-amber-400" />
            ) : (
              <Pause className="w-3.5 h-3.5 fill-current" />
            )}
          </button>

          {/* Quick Reset button on desktop */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onReset?.();
            }}
            className="hidden sm:inline-flex items-center justify-center p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10 transition-colors apple-press"
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
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10 transition-colors apple-press"
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

      {/* Expandable Content Popover */}
      {!isCollapsed && (
        <div className="absolute left-0 top-full mt-2 sm:mt-0 sm:static z-50 w-[min(340px,calc(100vw-24px))] sm:w-full rounded-2xl apple-glass-heavy sm:apple-glass-subtle shadow-xl sm:shadow-none p-3 space-y-3 animate-scale-in">
          {/* Apple Segmented Play, Pause & Reset Control Bar */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 block px-0.5">
              Timer Controls
            </span>
            <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
              <button
                type="button"
                onClick={onPlay}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg font-semibold text-xs transition-all cursor-pointer select-none apple-press ${
                  !isPaused
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-white/10'
                }`}
                title="Start / Resume countdown"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play</span>
              </button>

              <button
                type="button"
                onClick={onPause}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg font-semibold text-xs transition-all cursor-pointer select-none apple-press ${
                  isPaused
                    ? 'bg-amber-500 text-slate-950 shadow-xs font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-white/10'
                }`}
                title="Pause countdown"
              >
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </button>

              <button
                type="button"
                onClick={onReset}
                className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg font-semibold text-xs text-slate-700 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-white/10 transition-all cursor-pointer select-none apple-press"
                title="Reset timer to current time (00:00:00)"
              >
                <RotateCcw className="w-3.5 h-3.5 text-indigo-500" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Mini Version of the Timer (Live Preview) - Mobile Only */}
          {timeState && (
            <div
              className={`sm:hidden p-2.5 rounded-xl border transition-all ${
                isPaused
                  ? 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  : timeState.isOvertime
                  ? 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400'
                  : 'border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5'
              }`}
            >
              {/* Mini Status Badge */}
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Timer Preview
                </span>
                {isPaused ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-700 dark:text-amber-300">
                    <Pause className="w-2.5 h-2.5 fill-current" />
                    PAUSED
                  </span>
                ) : timeState.isOvertime ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-500/20 text-red-700 dark:text-red-400 animate-pulse">
                    <AlertCircle className="w-2.5 h-2.5" />
                    OVERTIME
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/20 text-indigo-700 dark:text-indigo-400">
                    <Clock className="w-2.5 h-2.5" />
                    REMAINING
                  </span>
                )}
              </div>

              {/* Smaller version of Timer blocks */}
              <div className="flex items-center justify-center gap-1.5 font-mono">
                {timeState.isOvertime && (
                  <span className="text-red-600 dark:text-red-400 font-bold text-lg self-center pb-1.5 flex-shrink-0">
                    -
                  </span>
                )}

                {/* Days if days > 0 */}
                {timeState.days > 0 && (
                  <>
                    <div className="flex flex-col items-center">
                      <div
                        className={`px-2 py-1 rounded-lg min-w-[34px] text-center font-bold text-sm ${
                          timeState.isOvertime
                            ? 'bg-red-500/20 text-red-700 dark:text-red-300'
                            : 'bg-white/80 dark:bg-white/10 text-slate-900 dark:text-white'
                        }`}
                      >
                        {pad(timeState.days)}
                      </div>
                      <span className="text-[8px] font-sans font-semibold text-slate-400 mt-0.5">DAYS</span>
                    </div>
                    <span className="text-xs font-bold text-slate-400 pb-2">:</span>
                  </>
                )}

                {/* Hours */}
                <div className="flex flex-col items-center">
                  <div
                    className={`px-2 py-1 rounded-lg min-w-[34px] text-center font-bold text-sm ${
                      timeState.isOvertime
                        ? 'bg-red-500/20 text-red-700 dark:text-red-300'
                        : 'bg-white/80 dark:bg-white/10 text-slate-900 dark:text-white'
                    }`}
                  >
                    {pad(timeState.days > 0 ? timeState.hours : timeState.totalHours)}
                  </div>
                  <span className="text-[8px] font-sans font-semibold text-slate-400 mt-0.5">HOURS</span>
                </div>

                <span className="text-xs font-bold text-slate-400 pb-2">:</span>

                {/* Minutes */}
                <div className="flex flex-col items-center">
                  <div
                    className={`px-2 py-1 rounded-lg min-w-[34px] text-center font-bold text-sm ${
                      timeState.isOvertime
                        ? 'bg-red-500/20 text-red-700 dark:text-red-300'
                        : 'bg-white/80 dark:bg-white/10 text-slate-900 dark:text-white'
                    }`}
                  >
                    {pad(timeState.minutes)}
                  </div>
                  <span className="text-[8px] font-sans font-semibold text-slate-400 mt-0.5">MINS</span>
                </div>

                <span className="text-xs font-bold text-slate-400 pb-2">:</span>

                {/* Seconds */}
                <div className="flex flex-col items-center">
                  <div
                    className={`px-2 py-1 rounded-lg min-w-[34px] text-center font-bold text-sm ${
                      timeState.isOvertime
                        ? 'bg-red-500/20 text-red-700 dark:text-red-300'
                        : 'bg-white/80 dark:bg-white/10 text-slate-900 dark:text-white'
                    }`}
                  >
                    {pad(timeState.seconds)}
                  </div>
                  <span className="text-[8px] font-sans font-semibold text-slate-400 mt-0.5">SECS</span>
                </div>
              </div>
            </div>
          )}

          {/* Custom Target Time Section */}
          <div className="space-y-1.5">
            <label
              htmlFor="target-time-input-desktop"
              className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 block px-0.5"
            >
              Target Time
            </label>

            {/* Combined Field Bar with Apple styling */}
            <div className="flex items-center rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 focus-within:ring-2 focus-within:ring-indigo-500/40 transition-all overflow-hidden">
              <div className="relative flex-1 flex items-center min-w-0 px-3 py-2">
                <Clock className="w-4 h-4 text-indigo-500 flex-shrink-0 mr-2" />

                {/* Mobile View: Native time picker */}
                <input
                  id="target-time-input-mobile"
                  type="time"
                  step="1"
                  value={timeInputValue}
                  onChange={handleTimeChange}
                  className="sm:hidden w-full bg-transparent text-slate-900 dark:text-slate-100 font-mono text-sm font-semibold focus:outline-none cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
                  title="Set Target Time"
                  aria-label="Target Time"
                />

                {/* Desktop View: Direct writable input */}
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
                  title="Type your desired time (e.g. 2:30 PM, 14:30, 9am) and press Enter"
                  aria-label="Write Target Time"
                />
              </div>

              {/* Date Button with native date picker */}
              <div
                onClick={handleOpenDatePicker}
                className="relative border-l border-black/5 dark:border-white/10 flex-shrink-0 cursor-pointer"
              >
                <div className="flex items-center gap-1.5 px-3 py-2 bg-black/5 dark:bg-white/5 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-black/10 dark:hover:bg-white/10 transition-colors select-none">
                  <Calendar className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>{dateLabel}</span>
                  <ChevronDown className="w-3 h-3 text-slate-500 dark:text-slate-400" />
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
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10 [color-scheme:light] dark:[color-scheme:dark]"
                  title="Click to choose custom date"
                  aria-label="Choose Target Date"
                />
              </div>
            </div>

            {/* Desktop Helper Hint */}
            <div className="hidden sm:flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 px-1">
              <span>Write time (e.g. 2:30 PM, 14:30)</span>
              <span>↵ Enter to apply</span>
            </div>
          </div>

          {/* Quick presets from now */}
          <div className="space-y-1.5 pt-2 border-t border-black/5 dark:border-white/10">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 block px-0.5">
              Quick Presets
            </span>
            <div className="grid grid-cols-3 gap-1.5 font-mono text-xs">
              <button
                type="button"
                onClick={() => setQuickOffset(5 * 60)}
                className="py-1.5 px-2 text-center rounded-lg bg-black/5 dark:bg-white/5 hover:bg-indigo-500/10 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 border border-black/5 dark:border-white/5 transition-all cursor-pointer select-none apple-press"
                title="Add 5 minutes to current time (+5min)"
              >
                +5min
              </button>
              <button
                type="button"
                onClick={() => setQuickOffset(15 * 60)}
                className="py-1.5 px-2 text-center rounded-lg bg-black/5 dark:bg-white/5 hover:bg-indigo-500/10 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 border border-black/5 dark:border-white/5 transition-all cursor-pointer select-none apple-press"
                title="Add 15 minutes to current time (+15min)"
              >
                +15min
              </button>
              <button
                type="button"
                onClick={() => setQuickOffset(30 * 60)}
                className="py-1.5 px-2 text-center rounded-lg bg-black/5 dark:bg-white/5 hover:bg-indigo-500/10 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 border border-black/5 dark:border-white/5 transition-all cursor-pointer select-none apple-press"
                title="Add 30 minutes to current time (+30min)"
              >
                +30min
              </button>
              <button
                type="button"
                onClick={() => setQuickOffset(-5 * 60)}
                className="py-1.5 px-2 text-center rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 transition-all cursor-pointer select-none apple-press"
                title="Set target to 5 minutes ago (-5min overtime)"
              >
                -5min
              </button>
              <button
                type="button"
                onClick={() => setQuickOffset(-15 * 60)}
                className="py-1.5 px-2 text-center rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 transition-all cursor-pointer select-none apple-press"
                title="Set target to 15 minutes ago (-15min overtime)"
              >
                -15min
              </button>
              <button
                type="button"
                onClick={() => setQuickOffset(-30 * 60)}
                className="py-1.5 px-2 text-center rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 transition-all cursor-pointer select-none apple-press"
                title="Set target to 30 minutes ago (-30min overtime)"
              >
                -30min
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
