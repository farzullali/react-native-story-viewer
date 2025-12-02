import { useCallback, useEffect, useRef, useState } from 'react';

interface UseStoryTimerProps {
  duration: number;
  isPaused: boolean;
  onComplete: () => void;
  key?: string | number; // Unique key to force timer restart
}

export const useStoryTimer = ({
  duration,
  isPaused,
  onComplete,
  key,
}: UseStoryTimerProps) => {
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number>(0);
  const elapsedRef = useRef<number>(0);
  const prevKeyRef = useRef(key);
  const hasCompletedRef = useRef(false);

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    // clear();
    setProgress(0);
    elapsedRef.current = 0;
    hasCompletedRef.current = false;
  }, []);

  // Store onComplete in a ref to avoid it being a dependency
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    // Only reset progress when key changes (new story), not on pause/resume
    if (prevKeyRef.current !== key) {
      setProgress(0);
      elapsedRef.current = 0;
      hasCompletedRef.current = false;
      prevKeyRef.current = key;
    }

    if (isPaused) {
      if (intervalRef.current) {
        // Timer was running, save the elapsed time
        elapsedRef.current += Date.now() - startTimeRef.current;
        clear();
      } else if (startTimeRef.current > 0) {
        // Timer was running but cleanup already cleared the interval
        // Still need to save elapsed time
        elapsedRef.current += Date.now() - startTimeRef.current;
      }
      // Update progress to reflect paused state
      const pausedProgress = Math.min(elapsedRef.current / duration, 1);
      setProgress(pausedProgress);
      return;
    }

    // Don't restart if already completed
    if (hasCompletedRef.current) {
      return;
    }

    // Start
    startTimeRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      const elapsed = elapsedRef.current + (Date.now() - startTimeRef.current);
      const newProgress = Math.min(elapsed / duration, 1);

      setProgress(newProgress);

      if (newProgress >= 1 && !hasCompletedRef.current) {
        hasCompletedRef.current = true;
        clear();
        onCompleteRef.current();
      }
    }, 16);

    return () => clear();
  }, [key, isPaused, duration, clear]);

  return { progress, reset };
};
