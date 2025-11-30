import { useCallback, useEffect, useRef, useState } from 'react';

interface UseStoryTimerProps {
  duration: number;
  isPaused: boolean;
  onComplete: () => void;
}

export const useStoryTimer = ({ duration, isPaused, onComplete }: UseStoryTimerProps) => {
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
  }, [isPaused, duration, onComplete, clear]);

  return { progress, reset };
};