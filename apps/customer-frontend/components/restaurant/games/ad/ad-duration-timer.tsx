"use client";

import { useState, useEffect } from "react";

interface AdDurationTimerProps {
  duration: number;
  onComplete: () => void;
}

export function AdDurationTimer({ duration, onComplete }: AdDurationTimerProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(interval);
        onComplete();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [duration, onComplete]);

  return (
    <div className="h-1 w-full bg-slate-700">
      <div className="h-full bg-amber-500" style={{ width: `${progress}%` }} />
    </div>
  );
}
