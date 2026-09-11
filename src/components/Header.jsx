import React, { useState, useEffect } from 'react';
import {
  Sun,
  Moon,
  Sparkles,
  Maximize2,
  Minimize2,
  Download,
  Laptop,
  Smartphone,
} from 'lucide-react';
import { Logo } from './Logo';

export function Header({
  theme,
  setTheme,
  onOpenMultiplatformModal,
  isFullscreen,
  toggleFullscreen,
}) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallPWA = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          setDeferredPrompt(null);
        }
      });
    } else {
      onOpenMultiplatformModal();
    }
  };

  return (
    <header className="w-full flex items-center justify-center pt-2 sm:pt-2.5 pb-1 sm:pb-2 px-3 sm:px-4 relative z-20">
      <div className="flex items-center justify-between sm:justify-center w-full max-w-xl gap-2 sm:gap-3">
        {/* Brand logo / title */}
        <Logo />

        <div className="h-4 w-px bg-slate-300 dark:bg-slate-800 hidden sm:block" />

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Theme Switcher: Dark and White mode only */}
          <div className="flex items-center p-0.5 rounded-md bg-slate-200/80 dark:bg-slate-900 border border-slate-300 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded text-xs transition-colors ${
                theme === 'light'
                  ? 'bg-white text-indigo-700 font-bold shadow-sm border border-slate-300'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-medium'
              }`}
              title="White Mode"
              aria-label="White Mode"
            >
              <Sun className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">White</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded text-xs transition-colors ${
                theme === 'dark'
                  ? 'bg-slate-800 text-indigo-300 font-bold shadow-sm border border-slate-700'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-medium'
              }`}
              title="Dark Mode"
              aria-label="Dark Mode"
            >
              <Moon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Dark</span>
            </button>
          </div>

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-1.5 rounded-md border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition-colors shadow-xs"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            )}
          </button>

          {/* Multiplatform / Native App Guide Button (Visible across all viewports) */}
          <button
            type="button"
            onClick={onOpenMultiplatformModal}
            className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-md text-xs font-semibold border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition-colors shadow-xs active:scale-95"
            title="Install for Mac, Windows, iOS & Android"
          >
            <Smartphone className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 sm:hidden" />
            <Laptop className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 hidden sm:inline" />
            <span>App</span>
          </button>
        </div>
      </div>
    </header>
  );
}
