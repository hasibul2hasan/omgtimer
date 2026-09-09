import React, { useState, useEffect } from 'react';
import {
  Sun,
  Moon,
  Sparkles,
  Maximize2,
  Minimize2,
  Download,
  Laptop,
  Timer,
} from 'lucide-react';

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
    <header className="w-full flex items-center justify-center pt-11 sm:pt-2.5 pb-1 sm:pb-2 px-2 sm:px-4 relative z-20">
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center max-w-xl">
        {/* Brand logo / title */}
        <div className="flex items-center gap-1.5">
          <div className="w-7 h-7 rounded-md bg-indigo-600 flex items-center justify-center shadow-sm text-white">
            <Timer className="w-3.5 h-3.5" />
          </div>
          <h1 className="text-sm font-black tracking-wider text-slate-900 dark:text-white">
            OMGTIMER
          </h1>
        </div>

        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

        {/* Theme Switcher: Dark and White mode only */}
        <div className="flex items-center p-0.5 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
              theme === 'light'
                ? 'bg-white text-indigo-600 shadow-sm border border-slate-200'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
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
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
              theme === 'dark'
                ? 'bg-slate-800 text-indigo-400 shadow-sm border border-slate-700'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
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
          className="p-1.5 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          aria-label="Toggle Fullscreen"
        >
          {isFullscreen ? (
            <Minimize2 className="w-3.5 h-3.5 text-indigo-500" />
          ) : (
            <Maximize2 className="w-3.5 h-3.5 text-indigo-500" />
          )}
        </button>

        {/* Multiplatform / Native App Guide Button */}
        <button
          type="button"
          onClick={onOpenMultiplatformModal}
          className="hidden md:inline-flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-medium border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
          title="Install for Mac, Windows, iOS & Android"
        >
          <Laptop className="w-3.5 h-3.5 text-indigo-500" />
          <span>App</span>
        </button>
      </div>
    </header>
  );
}
