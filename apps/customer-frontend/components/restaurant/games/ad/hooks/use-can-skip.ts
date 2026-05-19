"use client";

import { useState, useEffect } from "react";

export function useCanSkip(delayMs: number = 4000, resetKey?: number | string) {
  const [canSkip, setCanSkip] = useState(delayMs <= 0);
  const [remaining, setRemaining] = useState(Math.ceil(delayMs / 1000));

  useEffect(() => {
    if (delayMs <= 0) {
      setCanSkip(true);
      return;
    }

    setCanSkip(false);
    setRemaining(Math.ceil(delayMs / 1000));

    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const left = Math.max(0, Math.ceil((delayMs - elapsed) / 1000));
      setRemaining(left);
      if (elapsed >= delayMs) {
        clearInterval(interval);
        setCanSkip(true);
      }
    }, 250);

    return () => clearInterval(interval);
  }, [delayMs, resetKey]);

  return { canSkip, remaining };
}
