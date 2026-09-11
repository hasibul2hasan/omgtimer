import React from 'react';
import logoSvg from '../assets/logo/omgovertime-logo.svg';

/**
 * Brand Logo Mark for omgovertime.
 */
export function LogoMark({ className = 'w-7 h-7' }) {
  return (
    <img
      src={logoSvg}
      alt="omgovertime logo"
      className={`${className} flex-shrink-0 object-cover rounded-full drop-shadow-sm border border-slate-300 dark:border-slate-700/80 ring-1 ring-indigo-500/20`}
    />
  );
}

/**
 * Full Brand Logo with Icon & Solid Clean Logotype
 */
export function Logo({ className = '', showText = true, size = 'md' }) {
  const iconSize = size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-9 h-9' : 'w-7 h-7 sm:w-8 sm:h-8';
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
            OVERTIME
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
