import React, { useState } from 'react';
import { LayoutGrid, Clock, Gauge, Hash, ChevronDown, ChevronUp } from 'lucide-react';

const options = [
  {
    id: 'blocks',
    name: 'Blocks',
    desc: 'Hours, Min, Sec',
    icon: LayoutGrid,
  },
  {
    id: 'clock',
    name: 'Clock',
    desc: '00:00:00 mono',
    icon: Clock,
  },
  {
    id: 'clockMs',
    name: 'Precision',
    desc: 'Sub-seconds',
    icon: Gauge,
  },
  {
    id: 'seconds',
    name: 'Seconds',
    desc: 'Total count',
    icon: Hash,
  },
];

export function AppearanceSelector({
  value,
  onChange,
  isMobileOpen = false,
  onToggleMobile,
}) {
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(true);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const isCollapsed = isMobile ? !isMobileOpen : isDesktopCollapsed;

  const handleToggle = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 640 && onToggleMobile) {
      onToggleMobile();
    } else {
      setIsDesktopCollapsed((prev) => !prev);
    }
  };

  const currentOption = options.find((o) => o.id === value) || options[0];

  return (
    <div className="relative sm:fixed sm:top-4 sm:right-4 z-40 rounded-md border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md transition-all w-full sm:w-auto sm:max-w-[310px]">
      {/* Header bar of floating box */}
      <div
        onClick={handleToggle}
        className={`flex items-center justify-between gap-1.5 p-1.5 sm:p-2 sm:px-3 cursor-pointer select-none ${
          !isCollapsed ? 'sm:border-b sm:border-slate-200 sm:dark:border-slate-800/80' : ''
        }`}
      >
        <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
          <LayoutGrid className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 truncate">
            {isCollapsed ? 'Mode' : 'Appearance'}
          </span>
          {isCollapsed && (
            <span className="text-[10px] sm:text-[11px] font-mono px-1 sm:px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 font-bold truncate max-w-[80px] sm:max-w-none">
              {currentOption.name}
            </span>
          )}
        </div>

        {/* Toggle Collapse/Expand */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleToggle();
          }}
          className="p-1 rounded text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex-shrink-0"
          title={isCollapsed ? 'Expand Appearance selector' : 'Minimize to compact box'}
          aria-label="Toggle Appearance Box"
        >
          {isCollapsed ? (
            <ChevronDown className="w-3.5 h-3.5" />
          ) : (
            <ChevronUp className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Expandable Options - overlay dropdown on mobile, inline on desktop */}
      {!isCollapsed && (
        <div className="absolute right-0 top-full mt-1.5 sm:mt-0 sm:static z-50 w-[min(320px,calc(100vw-24px))] sm:w-full rounded-md border border-slate-300 dark:border-slate-800 sm:border-none bg-white dark:bg-slate-900 shadow-2xl sm:shadow-none p-2 sm:p-2.5 grid grid-cols-2 gap-1.5">
          {options.map((opt) => {
            const isSelected = value === opt.id;
            const Icon = opt.icon;

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChange(opt.id)}
                className={`flex items-start p-2 rounded-md border text-left cursor-pointer transition-colors select-none active:scale-95 ${
                  isSelected
                    ? 'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-600 dark:border-indigo-500 text-indigo-950 dark:text-indigo-200 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <Icon
                      className={`w-3.5 h-3.5 flex-shrink-0 ${
                        isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'
                      }`}
                    />
                    <span className="text-xs font-bold truncate leading-none">{opt.name}</span>
                  </div>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-1 truncate font-medium">
                    {opt.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
