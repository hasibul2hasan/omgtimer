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

  // Format representations
  const formattedSecondsOnly = `${isOvertime ? '-' : ''}${totalSeconds.toLocaleString()}s`;

  // Total hours representation for clock display
  const clockHours = pad(totalHours);
  const clockMinutes = pad(minutes);
  const clockSeconds = pad(seconds);
  const clockMs = pad(milliseconds, 3);

  const clockStyle = `${isOvertime ? '-' : ''}${clockHours}:${clockMinutes}:${clockSeconds}`;
  const clockStyleMs = `${isOvertime ? '-' : ''}${clockHours}:${clockMinutes}:${clockSeconds}.${clockMs}`;

  return (
    <div className="flex flex-col items-center justify-center w-full my-1 sm:my-2">
      {/* Dynamic Status Badge */}
      <div className="mb-2 sm:mb-4">
        {isPaused ? (
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-300 font-bold text-xs sm:text-sm tracking-wider shadow-sm">
            <Pause className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 fill-current" />
            <span>TIMER PAUSED</span>
          </div>
        ) : isOvertime ? (
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-red-100 dark:bg-red-950/70 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-300 font-bold text-xs sm:text-sm tracking-wider animate-pulse-danger shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
            </span>
            <AlertCircle className="w-3.5 h-3.5 text-red-700 dark:text-red-400" />
            <span>OVERTIME ELAPSED</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-300 dark:border-indigo-800 text-indigo-900 dark:text-indigo-300 font-bold text-xs sm:text-sm tracking-wider shadow-sm">
            <Clock className="w-3.5 h-3.5 text-indigo-700 dark:text-indigo-400" />
            <span>TIME REMAINING</span>
          </div>
        )}
      </div>

      {/* 1. SEPARATE HOURS, MINUTES, SECONDS (BLOCK STYLE) */}
      {appearance === 'blocks' && (
        <div className="flex items-center justify-center gap-1 xs:gap-1.5 sm:gap-4 md:gap-5 flex-nowrap max-w-full overflow-x-auto px-1">
          {/* Overtime Sign Indicator if Overtime */}
          {isOvertime && (
            <div className="font-mono text-2xl sm:text-7xl md:text-8xl font-extrabold text-red-600 dark:text-red-500 self-center pb-3 sm:pb-8 flex-shrink-0 select-none">
              -
            </div>
          )}

          {/* Days block if days > 0 */}
          {days > 0 && (
            <div className="flex flex-col items-center flex-shrink-0">
              <div
                className={`rounded-md p-2 sm:p-6 md:p-8 min-w-[56px] xs:min-w-[66px] sm:min-w-[120px] md:min-w-[150px] lg:min-w-[170px] flex items-center justify-center transition-colors shadow-sm sm:shadow-md border ${
                  isOvertime
                    ? 'border-red-400 dark:border-red-800 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30'
                    : 'border-slate-300 dark:border-slate-800 text-slate-950 dark:text-white bg-white dark:bg-slate-900'
                }`}
              >
                <span className="font-mono text-2xl xs:text-3xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight">
                  {pad(days)}
                </span>
              </div>
              <span className="text-[9px] sm:text-xs md:text-sm tracking-wider font-bold text-slate-700 dark:text-slate-400 uppercase mt-1 sm:mt-2">
                DAYS
              </span>
            </div>
          )}

          {/* Hours Block */}
          <div className="flex flex-col items-center flex-shrink-0">
            <div
              className={`rounded-md p-2 sm:p-6 md:p-8 min-w-[56px] xs:min-w-[66px] sm:min-w-[120px] md:min-w-[150px] lg:min-w-[170px] flex items-center justify-center transition-colors shadow-sm sm:shadow-md border ${
                isOvertime
                  ? 'border-red-400 dark:border-red-800 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30'
                  : 'border-slate-300 dark:border-slate-800 text-slate-950 dark:text-white bg-white dark:bg-slate-900'
              }`}
            >
              <span className="font-mono text-2xl xs:text-3xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight">
                {pad(days > 0 ? hours : totalHours)}
              </span>
            </div>
            <span className="text-[9px] sm:text-xs md:text-sm tracking-wider font-bold text-slate-700 dark:text-slate-400 uppercase mt-1 sm:mt-2">
                HOURS
            </span>
          </div>

          <div className={`text-xl sm:text-6xl md:text-7xl font-bold pb-3 sm:pb-8 flex-shrink-0 ${isOvertime ? 'text-red-600 dark:text-red-500' : 'text-slate-800 dark:text-slate-400'}`}>
            :
          </div>

          {/* Minutes Block */}
          <div className="flex flex-col items-center flex-shrink-0">
            <div
              className={`rounded-md p-2 sm:p-6 md:p-8 min-w-[56px] xs:min-w-[66px] sm:min-w-[120px] md:min-w-[150px] lg:min-w-[170px] flex items-center justify-center transition-colors shadow-sm sm:shadow-md border ${
                isOvertime
                  ? 'border-red-400 dark:border-red-800 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30'
                  : 'border-slate-300 dark:border-slate-800 text-slate-950 dark:text-white bg-white dark:bg-slate-900'
              }`}
            >
              <span className="font-mono text-2xl xs:text-3xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight">
                {pad(minutes)}
              </span>
            </div>
            <span className="text-[9px] sm:text-xs md:text-sm tracking-wider font-bold text-slate-700 dark:text-slate-400 uppercase mt-1 sm:mt-2">
                MINUTES
            </span>
          </div>

          <div className={`text-xl sm:text-6xl md:text-7xl font-bold pb-3 sm:pb-8 flex-shrink-0 ${isOvertime ? 'text-red-600 dark:text-red-500' : 'text-slate-800 dark:text-slate-400'}`}>
            :
          </div>

          {/* Seconds Block */}
          <div className="flex flex-col items-center flex-shrink-0">
            <div
              className={`rounded-md p-2 sm:p-6 md:p-8 min-w-[56px] xs:min-w-[66px] sm:min-w-[120px] md:min-w-[150px] lg:min-w-[170px] flex items-center justify-center transition-colors shadow-sm sm:shadow-md border ${
                isOvertime
                  ? 'border-red-400 dark:border-red-800 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30'
                  : 'border-slate-300 dark:border-slate-800 text-slate-950 dark:text-white bg-white dark:bg-slate-900'
              }`}
            >
              <span className="font-mono text-2xl xs:text-3xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight">
                {pad(seconds)}
              </span>
            </div>
            <span className="text-[9px] sm:text-xs md:text-sm tracking-wider font-bold text-slate-700 dark:text-slate-400 uppercase mt-1 sm:mt-2">
                SECONDS
            </span>
          </div>

          {/* Symmetrical Overtime Spacer: Ensures clock blocks remain perfectly centered */}
          {isOvertime && (
            <div
              className="font-mono text-2xl sm:text-7xl md:text-8xl font-extrabold opacity-0 pointer-events-none select-none self-center pb-3 sm:pb-8 flex-shrink-0"
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
          className={`px-4 sm:px-12 md:px-16 py-3 sm:py-8 md:py-10 rounded-md transition-colors shadow-sm sm:shadow-md max-w-full overflow-hidden border ${
            isOvertime
              ? 'border-red-400 dark:border-red-800 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30'
              : 'border-slate-300 dark:border-slate-800 text-slate-950 dark:text-white bg-white dark:bg-slate-900'
          }`}
        >
          <div className="font-mono text-3xl xs:text-4xl sm:text-8xl md:text-9xl lg:text-[10.5rem] font-bold tracking-tight tabular-nums leading-none flex items-center justify-center">
            {isOvertime && <span className="select-none">-</span>}
            <span>{clockHours}:{clockMinutes}:{clockSeconds}</span>
            {isOvertime && <span className="opacity-0 select-none pointer-events-none" aria-hidden="true">-</span>}
          </div>
        </div>
      )}

      {/* 3. CLOCK STYLE + MILLISECONDS (00:00:00.000) */}
      {appearance === 'clockMs' && (
        <div
          className={`px-3 sm:px-10 md:px-14 py-3 sm:py-8 md:py-10 rounded-md transition-colors shadow-sm sm:shadow-md max-w-full overflow-hidden border ${
            isOvertime
              ? 'border-red-400 dark:border-red-800 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30'
              : 'border-slate-300 dark:border-slate-800 text-slate-950 dark:text-white bg-white dark:bg-slate-900'
          }`}
        >
          <div className="font-mono text-2xl xs:text-3xl sm:text-7xl md:text-8xl lg:text-[9.5rem] font-bold tracking-tight tabular-nums flex items-baseline justify-center leading-none">
            {isOvertime && <span className="select-none">-</span>}
            <span>{clockHours}:{clockMinutes}:{clockSeconds}</span>
            <span className="text-sm xs:text-lg sm:text-4xl md:text-6xl lg:text-7xl opacity-75 ml-1 sm:ml-2">
              .{clockMs}
            </span>
            {isOvertime && <span className="opacity-0 select-none pointer-events-none" aria-hidden="true">-</span>}
          </div>
        </div>
      )}

      {/* 4. SECONDS ONLY (Formatted integer e.g., -14,320s) */}
      {appearance === 'seconds' && (
        <div
          className={`px-4 sm:px-12 md:px-16 py-3 sm:py-8 md:py-10 rounded-md transition-colors shadow-sm sm:shadow-md max-w-full overflow-hidden border ${
            isOvertime
              ? 'border-red-400 dark:border-red-800 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30'
              : 'border-slate-300 dark:border-slate-800 text-slate-950 dark:text-white bg-white dark:bg-slate-900'
          }`}
        >
          <div className="font-mono text-3xl xs:text-5xl sm:text-8xl md:text-9xl lg:text-[10.5rem] font-extrabold tracking-tight tabular-nums leading-none flex items-center justify-center">
            {isOvertime && <span className="select-none">-</span>}
            <span>{totalSeconds.toLocaleString()}s</span>
            {isOvertime && <span className="opacity-0 select-none pointer-events-none" aria-hidden="true">-</span>}
          </div>
        </div>
      )}
    </div>
  );
}
