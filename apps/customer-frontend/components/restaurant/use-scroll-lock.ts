import { useEffect } from 'react';

export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const root = document.documentElement;
    const body = document.body;
    const prev = {
      rootOverflow: root.style.overflow,
      bodyOverflow: body.style.overflow,
      rootOverscroll: root.style.overscrollBehavior,
      bodyOverscroll: body.style.overscrollBehavior,
    };
    root.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    root.style.overscrollBehavior = 'none';
    body.style.overscrollBehavior = 'none';
    return () => {
      root.style.overflow = prev.rootOverflow;
      body.style.overflow = prev.bodyOverflow;
      root.style.overscrollBehavior = prev.rootOverscroll;
      body.style.overscrollBehavior = prev.bodyOverscroll;
    };
  }, [active]);
}
