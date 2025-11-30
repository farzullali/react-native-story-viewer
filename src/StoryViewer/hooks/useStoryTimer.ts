import { useCallback, useEffect, useRef, useState } from 'react';

interface UseStoryTimerProps {
  duration: number;
  isPaused: boolean;
  onComplete: () => void;
  key?: string | number; // Unique key to force timer restart
}

export const useStoryTimer = ({ duration, isPaused, onComplete, key }: UseStoryTimerProps) => {
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number>(0);
  const elapsedRef = useRef<number>(0);

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
  }, [clear]);

  useEffect(() => {
    // Reset progress when key changes (new story)
    setProgress(0);
    elapsedRef.current = 0;

    if (isPaused) {
      if (intervalRef.current) {
        elapsedRef.current += Date.now() - startTimeRef.current;
        clear();
      }
      return;
    }

    // Start
    startTimeRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      const elapsed = elapsedRef.current + (Date.now() - startTimeRef.current);
      const newProgress = Math.min(elapsed / duration, 1);

      setProgress(newProgress);

      if (newProgress >= 1) {
        clear();
        onComplete();
      }
    }, 16);

    return () => clear();
  }, [key, isPaused, duration, onComplete, clear]);

  return { progress, reset };
};