import { useEffect, useRef } from 'react';

const IDLE_LIMIT_MS = 15 * 60 * 1000; // 15 minutes of inactivity => session locked

/**
 * Security hardening: automatically locks the session (logout + redirect to
 * login) after 15 minutes without any user activity.
 */
export function useIdleLock(onLock: () => void) {
  const cbRef = useRef(onLock);
  cbRef.current = onLock;

  useEffect(() => {
    let timer: any = setTimeout(() => cbRef.current(), IDLE_LIMIT_MS);

    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(() => cbRef.current(), IDLE_LIMIT_MS);
    };

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach(e => window.addEventListener(e, reset, { passive: true }));

    return () => {
      clearTimeout(timer);
      events.forEach(e => window.removeEventListener(e, reset));
    };
  }, []);
}
