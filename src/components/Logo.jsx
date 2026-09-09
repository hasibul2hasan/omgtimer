import React from 'react';

/**
 * Custom Solid Vector Brand Logo Mark for OMGTIMER.
 * Zero gradients - pure solid, high-contrast, razor-sharp vector design.
 */
export function LogoMark({ className = 'w-7 h-7' }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} flex-shrink-0 drop-shadow-sm`}
      aria-hidden="true"
    >
      {/* Outer rounded squircle in solid Indigo */}
      <rect x="2" y="2" width="28" height="28" rx="7.5" fill="#4F46E5" />

      {/* Stopwatch Crown */}
      <rect x="13.5" y="0.5" width="5" height="2.2" rx="1.1" fill="#3730A3" />

      {/* Stopwatch Outer Track (Solid with opacity) */}
      <circle
        cx="16"
        cy="16.5"
        r="9.5"
        stroke="#FFFFFF"
        strokeWidth="1.8"
        strokeOpacity="0.3"
        strokeLinecap="round"
      />

      {/* Active Overtime Countdown Arc (Solid White) */}
      <path
        d="M 16 7 A 9.5 9.5 0 1 1 7.5 20"
        stroke="#FFFFFF"
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* Dynamic Overtime Hand / Energy Bolt (Solid White) */}
      <path
        d="M 16.5 10.5 L 13.8 16.2 H 17.2 L 14.8 22.2 L 19.8 15 H 16.5 L 18 10.5 Z"
        fill="#FFFFFF"
      />

      {/* Overtime Zero Pulse Beacon (Solid Red & White) */}
      <circle cx="23.5" cy="9.5" r="2.2" fill="#EF4444" />
      <circle cx="23.5" cy="9.5" r="0.9" fill="#FFFFFF" />
    </svg>
  );
}

/**
 * Full Brand Logo with Icon & Solid Clean Logotype
 */
export function Logo({ className = '', showText = true, size = 'md' }) {
  const iconSize = size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-9 h-9' : 'w-7 h-7';
  const textSize = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base sm:text-lg' : 'text-sm sm:text-base';

  return (
    <div className={`flex items-center gap-1.5 sm:gap-2 select-none group cursor-pointer ${className}`}>
      <LogoMark
        className={`${iconSize} transition-transform duration-200 group-hover:scale-105 group-active:scale-95`}
      />
      {showText && (
        <div className="flex items-center leading-none">
          <span
            className={`font-black ${textSize} tracking-wider text-indigo-600 dark:text-indigo-400`}
          >
            OMG
          </span>
          <span className={`font-black ${textSize} tracking-wider text-slate-900 dark:text-white ml-0.5`}>
            TIMER
          </span>
          <span
            className="w-1.5 h-1.5 rounded-full bg-red-500 ml-1 mb-2 animate-pulse"
            title="Dynamic Overtime Engine"
          />
        </div>
      )}
    </div>
  );
}
