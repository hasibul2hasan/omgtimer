import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Calculates initial default target time: 10:00 PM today.
 * If 10:00 PM today has already passed, sets it to 10:00 PM today anyway
 * (which naturally demonstrates the overtime state immediately), but we can also
 * allow users to easily pick future or use quick buttons.
 */
export function getDefaultTargetTime() {
  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 22, 0, 0, 0);
  return target;
}

export function useCountdown({ onZeroTrigger } = {}) {
  const [targetTime, setTargetTime] = useState(() => getDefaultTargetTime());
  
  // State for timer breakdown
  const [timeState, setTimeState] = useState(() => {
    const now = Date.now();
    const target = getDefaultTargetTime().getTime();
    const diff = target - now;
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
  });

  const hasTriggeredZeroRef = useRef(false);
  const previousDiffRef = useRef(targetTime.getTime() - Date.now());
  const onZeroTriggerRef = useRef(onZeroTrigger);

  useEffect(() => {
    onZeroTriggerRef.current = onZeroTrigger;
  }, [onZeroTrigger]);

  // When target changes, reset triggered flag if the new target is in the future
  const setTarget = useCallback((newDate) => {
    setTargetTime(newDate);
    const diff = newDate.getTime() - Date.now();
    hasTriggeredZeroRef.current = diff <= 0; // If set to past, don't blast zero-trigger alert immediately
    previousDiffRef.current = diff;
  }, []);

  // requestAnimationFrame loop
  useEffect(() => {
    let animId;

    const tick = () => {
      const now = Date.now();
      const target = targetTime.getTime();
      const diff = target - now;
      const isOvertime = diff < 0;
      const absDiff = Math.abs(diff);

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

      const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((absDiff / (1000 * 60 * 60)) % 24);
      const totalHours = Math.floor(absDiff / (1000 * 60 * 60));
      const minutes = Math.floor((absDiff / (1000 * 60)) % 60);
      const seconds = Math.floor((absDiff / 1000) % 60);
      const milliseconds = Math.floor(absDiff % 1000);
      const totalSeconds = Math.floor(absDiff / 1000);

      setTimeState({
        isOvertime,
        diff,
        days,
        hours,
        totalHours,
        minutes,
        seconds,
        milliseconds,
        totalSeconds,
        rawMs: absDiff,
      });

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [targetTime]);

  return {
    targetTime,
    setTarget,
    timeState,
  };
}
