import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Calculates initial default target time: exact current time.
 */
export function getDefaultTargetTime() {
  return new Date();
}

export function useCountdown({ onZeroTrigger } = {}) {
  const [targetTime, setTargetTime] = useState(() => getDefaultTargetTime());
  const [isPaused, setIsPaused] = useState(false);
  const pausedDiffRef = useRef(null);

  // Helper to calculate time state from millisecond diff
  const calculateTimeState = (diff) => {
    const isOvertime = diff < 0;
    const absDiff = Math.abs(diff);

    return {
      isOvertime,
      diff,
      days: Math.floor(absDiff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((absDiff / (1000 * 60 * 60)) % 24),
      totalHours: Math.floor(absDiff / (1000 * 60 * 60)),
      minutes: Math.floor((absDiff / (1000 * 60)) % 60),
      seconds: Math.floor((absDiff / 1000) % 60),
      milliseconds: Math.floor(absDiff % 1000),
      totalSeconds: Math.floor(absDiff / 1000),
      rawMs: absDiff,
    };
  };

  // State for timer breakdown
  const [timeState, setTimeState] = useState(() => {
    const now = Date.now();
    const target = getDefaultTargetTime().getTime();
    return calculateTimeState(target - now);
  });

  const hasTriggeredZeroRef = useRef(false);
  const previousDiffRef = useRef(targetTime.getTime() - Date.now());
  const onZeroTriggerRef = useRef(onZeroTrigger);

  useEffect(() => {
    onZeroTriggerRef.current = onZeroTrigger;
  }, [onZeroTrigger]);

  // Pause action
  const pause = useCallback(() => {
    setIsPaused((currentlyPaused) => {
      if (!currentlyPaused) {
        pausedDiffRef.current = targetTime.getTime() - Date.now();
      }
      return true;
    });
  }, [targetTime]);

  // Play action: shifts targetTime forward so elapsed pause duration is preserved
  const play = useCallback(() => {
    setIsPaused((currentlyPaused) => {
      if (currentlyPaused && pausedDiffRef.current !== null) {
        const newTarget = new Date(Date.now() + pausedDiffRef.current);
        setTargetTime(newTarget);
        pausedDiffRef.current = null;
      }
      return false;
    });
  }, []);

  // Reset action: resets target to exact current time (00:00:00) and unpauses
  const reset = useCallback(() => {
    const newTarget = new Date();
    setTargetTime(newTarget);
    setIsPaused(false);
    pausedDiffRef.current = null;
    hasTriggeredZeroRef.current = false;
    previousDiffRef.current = 0;
    setTimeState(calculateTimeState(0));
  }, []);

  // When target changes, reset triggered flag if the new target is in the future
  const setTarget = useCallback((newDate) => {
    setTargetTime(newDate);
    const diff = newDate.getTime() - Date.now();
    if (isPaused) {
      pausedDiffRef.current = diff;
      setTimeState(calculateTimeState(diff));
    }
    hasTriggeredZeroRef.current = diff <= 0;
    previousDiffRef.current = diff;
  }, [isPaused]);

  // requestAnimationFrame loop
  useEffect(() => {
    if (isPaused) return;

    let animId;

    const tick = () => {
      const now = Date.now();
      const target = targetTime.getTime();
      const diff = target - now;

      // Check zero-crossing (was > 0 before, now <= 0)
      if (previousDiffRef.current > 0 && diff <= 0) {
        if (!hasTriggeredZeroRef.current) {
          hasTriggeredZeroRef.current = true;
          if (onZeroTriggerRef.current) {
            onZeroTriggerRef.current();
          }
        }
      }

      previousDiffRef.current = diff;
      setTimeState(calculateTimeState(diff));

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [targetTime, isPaused]);

  return {
    targetTime,
    setTarget,
    timeState,
    isPaused,
    play,
    pause,
    reset,
  };
}
