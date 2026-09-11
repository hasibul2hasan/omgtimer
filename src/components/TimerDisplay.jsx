import React from 'react';
import { Clock, AlertCircle, Pause } from 'lucide-react';

const pad = (n, width = 2) => String(Math.floor(n)).padStart(width, '0');

export function TimerDisplay({ timeState, appearance = 'blocks', isPaused = false }) {
  const {
    isOvertime,
    days,
    hours,
    totalHours,
    minutes,
    seconds,
    milliseconds,
    totalSeconds,
  } = timeState;

  // Total hours representation for clock display
  const clockHours = pad(totalHours);
  const clockMinutes = pad(minutes);
  const clockSeconds = pad(seconds);
  const clockMs = pad(milliseconds, 3);

  return (
    <div className="flex flex-col items-center justify-center w-full my-auto transition-all duration-300">
      {/* Apple Floating Status Pill */}
      <div className="mb-3 sm:mb-6 select-none animate-scale-in">
        {isPaused ? (
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full apple-glass text-amber-600 dark:text-amber-400 font-semibold text-xs sm:text-sm tracking-wide shadow-xs">
            <Pause className="w-3.5 h-3.5 fill-current" />
            <span>Timer Paused</span>
          </div>
        ) : isOvertime ? (
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-500/15 dark:bg-red-500/20 border border-red-500/30 text-red-600 dark:text-red-400 font-semibold text-xs sm:text-sm tracking-wide shadow-xs animate-pulse-danger">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Overtime Elapsed</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full apple-glass text-indigo-600 dark:text-indigo-400 font-semibold text-xs sm:text-sm tracking-wide shadow-xs">
            <Clock className="w-3.5 h-3.5" />
            <span>Time Remaining</span>
          </div>
        )}
      </div>

      {/* 1. SEPARATE HOURS, MINUTES, SECONDS (APPLE SQUIRCLE GLASS BLOCKS) */}
      {appearance === 'blocks' && (
        <div className="flex items-center justify-center gap-1.5 xs:gap-2 sm:gap-4 md:gap-5 flex-nowrap max-w-full px-1 select-none">
          {/* Overtime Sign Indicator */}
          {isOvertime && (
            <div className="font-mono text-3xl sm:text-7xl md:text-8xl font-bold text-red-500 dark:text-red-400 self-center pb-4 sm:pb-8 flex-shrink-0 animate-scale-in">
              -
            </div>
          )}

          {/* Days block if days > 0 */}
          {days > 0 && (
            <div className="flex flex-col items-center flex-shrink-0">
              <div
                className={`rounded-2xl sm:rounded-3xl p-3 sm:p-6 md:p-8 min-w-[62px] xs:min-w-[72px] sm:min-w-[124px] md:min-w-[152px] lg:min-w-[172px] flex items-center justify-center transition-all duration-300 ${
                  isOvertime
                    ? 'bg-red-500/10 dark:bg-red-950/40 border border-red-500/30 text-red-600 dark:text-red-400 overtime-ambient-glow'
                    : 'apple-glass text-slate-900 dark:text-white'
                }`}
              >
                <span className="font-mono tabular-nums text-3xl xs:text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-semibold tracking-tight leading-none">
                  {pad(days)}
                </span>
              </div>
              <span className="text-[10px] sm:text-xs font-semibold tracking-widest text-slate-500 dark:text-slate-400 uppercase mt-2 sm:mt-3">
                DAYS
              </span>
            </div>
          )}

          {/* Hours Block */}
          <div className="flex flex-col items-center flex-shrink-0">
            <div
              className={`rounded-2xl sm:rounded-3xl p-3 sm:p-6 md:p-8 min-w-[62px] xs:min-w-[72px] sm:min-w-[124px] md:min-w-[152px] lg:min-w-[172px] flex items-center justify-center transition-all duration-300 ${
                isOvertime
                  ? 'bg-red-500/10 dark:bg-red-950/40 border border-red-500/30 text-red-600 dark:text-red-400 overtime-ambient-glow'
                  : 'apple-glass text-slate-900 dark:text-white'
              }`}
            >
              <span className="font-mono tabular-nums text-3xl xs:text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-semibold tracking-tight leading-none">
                {pad(days > 0 ? hours : totalHours)}
              </span>
            </div>
            <span className="text-[10px] sm:text-xs font-semibold tracking-widest text-slate-500 dark:text-slate-400 uppercase mt-2 sm:mt-3">
              HOURS
            </span>
          </div>

          <div
            className={`text-2xl sm:text-6xl md:text-7xl font-light pb-4 sm:pb-8 flex-shrink-0 opacity-40 ${
              isOvertime ? 'text-red-500 dark:text-red-400' : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            :
          </div>

          {/* Minutes Block */}
          <div className="flex flex-col items-center flex-shrink-0">
            <div
              className={`rounded-2xl sm:rounded-3xl p-3 sm:p-6 md:p-8 min-w-[62px] xs:min-w-[72px] sm:min-w-[124px] md:min-w-[152px] lg:min-w-[172px] flex items-center justify-center transition-all duration-300 ${
                isOvertime
                  ? 'bg-red-500/10 dark:bg-red-950/40 border border-red-500/30 text-red-600 dark:text-red-400 overtime-ambient-glow'
                  : 'apple-glass text-slate-900 dark:text-white'
              }`}
            >
              <span className="font-mono tabular-nums text-3xl xs:text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-semibold tracking-tight leading-none">
                {pad(minutes)}
              </span>
            </div>
            <span className="text-[10px] sm:text-xs font-semibold tracking-widest text-slate-500 dark:text-slate-400 uppercase mt-2 sm:mt-3">
              MINUTES
            </span>
          </div>

          <div
            className={`text-2xl sm:text-6xl md:text-7xl font-light pb-4 sm:pb-8 flex-shrink-0 opacity-40 ${
              isOvertime ? 'text-red-500 dark:text-red-400' : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            :
          </div>

          {/* Seconds Block */}
          <div className="flex flex-col items-center flex-shrink-0">
            <div
              className={`rounded-2xl sm:rounded-3xl p-3 sm:p-6 md:p-8 min-w-[62px] xs:min-w-[72px] sm:min-w-[124px] md:min-w-[152px] lg:min-w-[172px] flex items-center justify-center transition-all duration-300 ${
                isOvertime
                  ? 'bg-red-500/10 dark:bg-red-950/40 border border-red-500/30 text-red-600 dark:text-red-400 overtime-ambient-glow'
                  : 'apple-glass text-slate-900 dark:text-white'
              }`}
            >
              <span className="font-mono tabular-nums text-3xl xs:text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-semibold tracking-tight leading-none">
                {pad(seconds)}
              </span>
            </div>
            <span className="text-[10px] sm:text-xs font-semibold tracking-widest text-slate-500 dark:text-slate-400 uppercase mt-2 sm:mt-3">
              SECONDS
            </span>
          </div>

          {/* Symmetrical Overtime Spacer for optical centering */}
          {isOvertime && (
            <div
              className="font-mono text-3xl sm:text-7xl md:text-8xl font-bold opacity-0 pointer-events-none select-none self-center pb-4 sm:pb-8 flex-shrink-0"
              aria-hidden="true"
            >
              -
            </div>
          )}
        </div>
      )}

      {/* 2. CLOCK STYLE (00:00:00) */}
      {appearance === 'clock' && (
        <div
          className={`px-5 sm:px-14 md:px-18 py-4 sm:py-10 md:py-12 rounded-3xl transition-all duration-300 max-w-full overflow-hidden select-none ${
            isOvertime
              ? 'bg-red-500/10 dark:bg-red-950/40 border border-red-500/30 text-red-600 dark:text-red-400 overtime-ambient-glow'
              : 'apple-glass text-slate-900 dark:text-white'
          }`}
        >
          <div className="font-mono tabular-nums text-4xl xs:text-5xl sm:text-8xl md:text-9xl lg:text-[10.5rem] font-semibold tracking-tight leading-none flex items-center justify-center">
            {isOvertime && <span className="select-none mr-2">-</span>}
            <span>{clockHours}:{clockMinutes}:{clockSeconds}</span>
            {isOvertime && <span className="opacity-0 select-none pointer-events-none ml-2" aria-hidden="true">-</span>}
          </div>
        </div>
      )}

      {/* 3. CLOCK STYLE + MILLISECONDS (00:00:00.000) */}
      {appearance === 'clockMs' && (
        <div
          className={`px-4 sm:px-12 md:px-16 py-4 sm:py-10 md:py-12 rounded-3xl transition-all duration-300 max-w-full overflow-hidden select-none ${
            isOvertime
              ? 'bg-red-500/10 dark:bg-red-950/40 border border-red-500/30 text-red-600 dark:text-red-400 overtime-ambient-glow'
              : 'apple-glass text-slate-900 dark:text-white'
          }`}
        >
          <div className="font-mono tabular-nums text-3xl xs:text-4xl sm:text-7xl md:text-8xl lg:text-[9.5rem] font-semibold tracking-tight flex items-baseline justify-center leading-none">
            {isOvertime && <span className="select-none mr-2">-</span>}
            <span>{clockHours}:{clockMinutes}:{clockSeconds}</span>
            <span className="text-base xs:text-xl sm:text-5xl md:text-6xl lg:text-7xl opacity-60 ml-2">
              .{clockMs}
            </span>
            {isOvertime && <span className="opacity-0 select-none pointer-events-none ml-2" aria-hidden="true">-</span>}
          </div>
        </div>
      )}

      {/* 4. SECONDS ONLY (Formatted integer e.g., -14,320s) */}
      {appearance === 'seconds' && (
        <div
          className={`px-5 sm:px-14 md:px-18 py-4 sm:py-10 md:py-12 rounded-3xl transition-all duration-300 max-w-full overflow-hidden select-none ${
            isOvertime
              ? 'bg-red-500/10 dark:bg-red-950/40 border border-red-500/30 text-red-600 dark:text-red-400 overtime-ambient-glow'
              : 'apple-glass text-slate-900 dark:text-white'
          }`}
        >
          <div className="font-mono tabular-nums text-4xl xs:text-5xl sm:text-8xl md:text-9xl lg:text-[10.5rem] font-semibold tracking-tight leading-none flex items-center justify-center">
            {isOvertime && <span className="select-none mr-2">-</span>}
            <span>{totalSeconds.toLocaleString()}s</span>
            {isOvertime && <span className="opacity-0 select-none pointer-events-none ml-2" aria-hidden="true">-</span>}
          </div>
        </div>
      )}
    </div>
  );
}
