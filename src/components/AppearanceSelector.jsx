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
    <div className="relative sm:fixed sm:top-4 sm:right-4 z-40 apple-glass rounded-2xl shadow-lg transition-all duration-200 w-full sm:w-auto sm:max-w-[320px]">
      {/* Header bar of floating capsule */}
      <div
        onClick={handleToggle}
        className={`flex items-center justify-between gap-2 p-2 sm:px-3.5 cursor-pointer select-none apple-press ${
          !isCollapsed ? 'sm:border-b sm:border-black/5 sm:dark:border-white/10' : ''
        }`}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-indigo-500/10 dark:bg-indigo-400/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
            <LayoutGrid className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-semibold tracking-tight text-slate-800 dark:text-slate-200 truncate">
            {isCollapsed ? 'Mode' : 'Appearance'}
          </span>
          {isCollapsed && (
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold truncate max-w-[80px] sm:max-w-none">
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
          className="p-1 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10 transition-colors flex-shrink-0 apple-press"
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

      {/* Expandable Options Grid */}
      {!isCollapsed && (
        <div className="absolute right-0 top-full mt-2 sm:mt-0 sm:static z-50 w-[min(320px,calc(100vw-24px))] sm:w-full rounded-2xl apple-glass-heavy sm:apple-glass-subtle shadow-xl sm:shadow-none p-2 sm:p-3 grid grid-cols-2 gap-2 animate-scale-in">
          {options.map((opt) => {
            const isSelected = value === opt.id;
            const Icon = opt.icon;

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChange(opt.id)}
                className={`flex items-start p-2.5 rounded-xl text-left cursor-pointer transition-all select-none apple-press ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-black/5 dark:bg-white/5 text-slate-800 dark:text-slate-200 hover:bg-black/10 dark:hover:bg-white/10'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <Icon
                      className={`w-3.5 h-3.5 flex-shrink-0 ${
                        isSelected ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'
                      }`}
                    />
                    <span className="text-xs font-semibold truncate leading-none">{opt.name}</span>
                  </div>
                  <p
                    className={`text-[10px] mt-1 truncate font-medium ${
                      isSelected ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
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
