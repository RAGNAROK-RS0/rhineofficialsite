import { useState, useCallback, useRef } from 'react';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

interface RateLimitState {
  count: number;
  resetTime: number;
}

export function useRateLimit(config: RateLimitConfig = { maxRequests: 5, windowMs: 60000 }) {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const stateRef = useRef<RateLimitState>({ count: 0, resetTime: 0 });

  const checkAndIncrement = useCallback(() => {
    const now = Date.now();
    
    if (now > stateRef.current.resetTime) {
      stateRef.current = { count: 1, resetTime: now + config.windowMs };
      setIsRateLimited(false);
      return true;
    }

    if (stateRef.current.count >= config.maxRequests) {
      setIsRateLimited(true);
      return false;
    }

    stateRef.current.count++;
    setIsRateLimited(false);
    return true;
  }, [config.maxRequests, config.windowMs]);

  const reset = useCallback(() => {
    stateRef.current = { count: 0, resetTime: 0 };
    setIsRateLimited(false);
  }, []);

  return { checkAndIncrement, isRateLimited, reset };
}

export function useDebounce<T extends (...args: Parameters<T>) => void>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return (...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}