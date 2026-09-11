import React, { useState, useEffect } from 'react';
import {
  Sun,
  Moon,
  Maximize2,
  Minimize2,
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
    <header className="w-full flex items-center justify-center pt-2 sm:pt-3 pb-1 sm:pb-2 px-3 sm:px-4 relative z-20">
      <div className="flex items-center justify-between sm:justify-center w-full max-w-xl gap-2 sm:gap-3 apple-glass rounded-full px-3 sm:px-4 py-1.5 shadow-sm">
        {/* Brand logo / title */}
        <Logo />

        <div className="h-4 w-px bg-black/10 dark:bg-white/15 hidden sm:block" />

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Apple Segmented Theme Switcher */}
          <div className="flex items-center p-0.5 rounded-full bg-black/5 dark:bg-black/40 border border-black/5 dark:border-white/10">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold apple-press ${
                theme === 'light'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title="White Mode"
              aria-label="White Mode"
            >
              <Sun className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Light</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold apple-press ${
                theme === 'dark'
                  ? 'bg-slate-800 text-indigo-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
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
            className="p-1.5 rounded-full border border-black/5 dark:border-white/10 bg-white/60 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 transition-colors apple-press"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            )}
          </button>

          {/* Multiplatform / Native App Guide Button */}
          <button
            type="button"
            onClick={handleInstallPWA}
            className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border border-black/5 dark:border-white/10 bg-white/60 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 transition-colors apple-press"
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
