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
  // Theme state: 'dark' or 'light'
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
  const { playRandomRingtone, stopActiveSounds, isPlaying: isPlayingRingtone, getAudioContext } = useAudioSynth();

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
            console.warn('Native exitFullscreen error:', err);
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
  const { targetTime, setTarget, startTime, setStartTime, timeState, isPaused, play, pause, reset } = useCountdown({
    onZeroTrigger: handleZeroTrigger,
  });

  // Apply theme class to document element
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
      className={`h-[100dvh] max-h-[100dvh] flex flex-col justify-between transition-colors duration-300 overflow-hidden select-none ${
        theme === 'dark'
          ? 'bg-[#000000] text-[#f5f5f7]'
          : 'bg-[#f5f5f7] text-[#1d1d1f]'
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
              className="fixed inset-0 z-30 bg-black/40 backdrop-blur-xs sm:hidden"
            />
          )}

          {/* Controls row for Mobile */}
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

      {/* Exit Fullscreen button - Apple circular floating glass button */}
      {isFullscreen && (
        <button
          type="button"
          onClick={toggleFullscreen}
          className="fixed top-4 right-4 z-50 p-3 rounded-full apple-glass-heavy text-slate-800 dark:text-slate-100 shadow-xl transition-all cursor-pointer apple-press"
          title="Exit Fullscreen (Esc)"
          aria-label="Exit Fullscreen"
        >
          <Minimize2 className="w-5 h-5" />
        </button>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-2 max-w-7xl w-full mx-auto relative z-10 min-h-0">
        <TimerDisplay timeState={timeState} appearance={appearance} isPaused={isPaused} />
      </main>

      {/* Bottom Zone: Status Bar + Actions */}
      {!isFullscreen && (
        <div className="flex flex-col items-center justify-center pb-3 z-10 flex-shrink-0 px-4 gap-2">
          {/* Started vs Targeted Time Bar */}
          <SessionTimeBar
            startTime={startTime}
            targetTime={targetTime}
            onSetStartToNow={() => setStartTime(new Date())}
          />

          {/* Zero-Hour Actions Docked */}
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
