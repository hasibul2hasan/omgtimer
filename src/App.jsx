import React, { useState, useEffect, useCallback } from 'react';
import { Minimize2 } from 'lucide-react';
import { Header } from './components/Header';
import { TimerDisplay } from './components/TimerDisplay';
import { TargetTimePicker } from './components/TargetTimePicker';
import { ZeroTriggerPanel } from './components/ZeroTriggerPanel';
import { SessionTimeBar } from './components/SessionTimeBar';
import { AppearanceSelector } from './components/AppearanceSelector';
import { MultiplatformModal } from './components/MultiplatformModal';
import { useCountdown } from './hooks/useCountdown';
import { useAudioSynth } from './hooks/useAudioSynth';
import { triggerConfettiBurst } from './utils/confetti';

export function App() {
  // Theme state: only 'dark' or 'light' (white) mode
  const [theme, setTheme] = useState('dark');

  // Appearance mode: 'blocks' | 'clock' | 'clockMs' | 'seconds'
  const [appearance, setAppearance] = useState('blocks');

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Feature toggles
  const [enableConfetti, setEnableConfetti] = useState(true);
  const [enableSound, setEnableSound] = useState(true);

  // Multiplatform guide modal
  const [isMultiplatformOpen, setIsMultiplatformOpen] = useState(false);

  // Audio synthesizer hook (~10s randomized melodic ringtones)
  const { playRandomRingtone, playChime, stopActiveSounds, isPlaying: isPlayingRingtone, getAudioContext } = useAudioSynth();

  // Helper to get active fullscreen element across all browser engines
  const getFullscreenElement = () => {
    return (
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement ||
      null
    );
  };

  // Handle native fullscreen changes (via API or Esc key)
  useEffect(() => {
    const handleFullscreenChange = () => {
      const nativeFs = !!getFullscreenElement();
      setIsFullscreen(nativeFs);
    };

    const events = ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'];
    events.forEach((evt) => document.addEventListener(evt, handleFullscreenChange));

    return () => {
      events.forEach((evt) => document.removeEventListener(evt, handleFullscreenChange));
    };
  }, []);

  const toggleFullscreen = () => {
    const isCurrentlyFs = isFullscreen || !!getFullscreenElement();

    if (!isCurrentlyFs) {
      // Enter Fullscreen
      setIsFullscreen(true);

      const docEl = document.documentElement;
      const requestMethod =
        docEl.requestFullscreen ||
        docEl.webkitRequestFullscreen ||
        docEl.webkitRequestFullScreen ||
        docEl.mozRequestFullScreen ||
        docEl.msRequestFullscreen;

      if (requestMethod) {
        try {
          const promise = requestMethod.call(docEl);
          if (promise && promise.catch) {
            promise.catch((err) => {
              // iOS Safari or restricted iframe: fallback to React-only fullscreen view
              console.warn('Native requestFullscreen not allowed, using UI fullscreen:', err);
            });
          }
        } catch (err) {
          console.warn('Native requestFullscreen error, using UI fullscreen:', err);
        }
      }
    } else {
      // Exit Fullscreen
      setIsFullscreen(false);

      const exitMethod =
        document.exitFullscreen ||
        document.webkitExitFullscreen ||
        document.webkitCancelFullScreen ||
        document.mozCancelFullScreen ||
        document.msExitFullscreen;

      if (exitMethod && getFullscreenElement()) {
        try {
          const promise = exitMethod.call(document);
          if (promise && promise.catch) {
            promise.catch((err) => {
              console.warn('Native exitFullscreen error:', err);
            });
          }
        } catch (err) {
          console.warn('Native exitFullscreen error:', err);
        }
      }
    }
  };

  // Zero-hour action triggered exactly once
  const handleZeroTrigger = useCallback(() => {
    if (enableConfetti) {
      triggerConfettiBurst();
    }
    if (enableSound) {
      playRandomRingtone();
    }
  }, [enableConfetti, enableSound, playRandomRingtone]);

  // Countdown hook
  const { targetTime, setTarget, startTime, timeState, isPaused, play, pause, reset } = useCountdown({
    onZeroTrigger: handleZeroTrigger,
  });

  // Apply theme class to document element (dark or white only)
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-gradient');
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Preview triggers
  const handlePreviewConfetti = () => {
    triggerConfettiBurst();
  };

  const [activeMobileDropdown, setActiveMobileDropdown] = useState(null);

  const handlePreviewSound = () => {
    if (isPlayingRingtone) {
      stopActiveSounds();
    } else {
      getAudioContext();
      playRandomRingtone();
    }
  };

  return (
    <div
      className={`h-[100dvh] max-h-[100dvh] flex flex-col justify-between transition-colors duration-200 overflow-hidden ${
        theme === 'dark'
          ? 'bg-slate-950 text-slate-100'
          : 'bg-slate-100/70 text-slate-900'
      }`}
    >
      {/* Hide surrounding UI when in fullscreen */}
      {!isFullscreen && (
        <div className="w-full relative z-30 flex-shrink-0">
          {/* Main Navigation Header */}
          <Header
            theme={theme}
            setTheme={setTheme}
            onOpenMultiplatformModal={() => setIsMultiplatformOpen(true)}
            isFullscreen={isFullscreen}
            toggleFullscreen={toggleFullscreen}
          />

          {/* Mobile backdrop to dismiss open dropdown on outside tap */}
          {activeMobileDropdown && (
            <div
              onClick={() => setActiveMobileDropdown(null)}
              className="fixed inset-0 z-30 bg-black/30 backdrop-blur-[1px] sm:hidden"
            />
          )}

          {/* Controls row for Mobile (side-by-side with zero overlap), transparent on desktop via sm:contents */}
          <div className="flex sm:contents items-center justify-center px-3 pt-0.5 pb-1 gap-2 max-w-lg mx-auto w-full">
            <div className="flex-1 min-w-0 sm:flex-none">
              <TargetTimePicker
                targetTime={targetTime}
                onTargetChange={setTarget}
                timeState={timeState}
                isPaused={isPaused}
                onPlay={play}
                onPause={pause}
                onReset={reset}
                isMobileOpen={activeMobileDropdown === 'target'}
                onToggleMobile={() =>
                  setActiveMobileDropdown((prev) => (prev === 'target' ? null : 'target'))
                }
              />
            </div>

            <div className="flex-1 min-w-0 sm:flex-none">
              <AppearanceSelector
                value={appearance}
                onChange={setAppearance}
                isMobileOpen={activeMobileDropdown === 'appearance'}
                onToggleMobile={() =>
                  setActiveMobileDropdown((prev) => (prev === 'appearance' ? null : 'appearance'))
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* Exit Fullscreen button (only in Fullscreen mode) - High Visibility Colored Icon Button */}
      {isFullscreen && (
        <button
          type="button"
          onClick={toggleFullscreen}
          className="fixed top-3 right-3 sm:top-4 sm:right-4 z-50 p-2.5 sm:p-3 rounded-md bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white border border-indigo-400/50 shadow-xl transition-all select-none cursor-pointer"
          title="Exit Fullscreen (Esc)"
          aria-label="Exit Fullscreen"
        >
          <Minimize2 className="w-5 h-5 text-white" />
        </button>
      )}

      {/* Main Content Area - In fullscreen, the clock takes full screen center stage */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-2 max-w-7xl w-full mx-auto relative z-10 min-h-0">
        <TimerDisplay timeState={timeState} appearance={appearance} isPaused={isPaused} />
      </main>

      {/* Bottom Zone: Status Bar + Actions */}
      {!isFullscreen && (
        <>
          {/* Started vs Targeted Time Bar (Horizontal layout on desktop) */}
          <div className="flex items-center justify-center pb-2 z-10 flex-shrink-0 px-4">
            <SessionTimeBar
              startTime={startTime}
              targetTime={targetTime}
              onSetStartToNow={() => setStartTime(new Date())}
            />
          </div>

          {/* Zero-Hour Actions Docked at the Bottom */}
          <div className="flex items-center justify-center pb-2 z-10 flex-shrink-0 px-4">
            <ZeroTriggerPanel
              enableConfetti={enableConfetti}
              setEnableConfetti={setEnableConfetti}
              enableSound={enableSound}
              setEnableSound={(val) => {
                setEnableSound((prev) => {
                  const nextVal = typeof val === 'function' ? val(prev) : val;
                  if (!nextVal && isPlayingRingtone) {
                    stopActiveSounds();
                  }
                  return nextVal;
                });
              }}
              onPreviewConfetti={handlePreviewConfetti}
              onPreviewSound={handlePreviewSound}
              isPlayingSound={isPlayingRingtone}
            />
          </div>

          {/* Modern Compact Footer */}
          <footer className="w-full py-1.5 text-center text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-300 dark:border-slate-800 relative z-10 flex-shrink-0">
            <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-1">
              <span>OMGTIMER &bull; Zero-Hour Precision & Overtime Engine</span>
              <button
                type="button"
                onClick={() => setIsMultiplatformOpen(true)}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 underline underline-offset-4 transition-colors font-medium"
              >
                Deploy on Mac, Windows, iOS & Android &rarr;
              </button>
            </div>
          </footer>
        </>
      )}

      {/* Multiplatform Guide & Commands Modal */}
      <MultiplatformModal
        isOpen={isMultiplatformOpen}
        onClose={() => setIsMultiplatformOpen(false)}
      />
    </div>
  );
}

export default App;
