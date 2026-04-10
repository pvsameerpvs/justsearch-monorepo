"use client";

import { useEffect, useRef } from 'react';

export function useMeasuredCssVarHeight(varName: string) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const updateHeightVar = () => {
      document.documentElement.style.setProperty(
        varName,
        `${element.offsetHeight}px`,
      );
    };

    updateHeightVar();

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => updateHeightVar());
      resizeObserver.observe(element);
    }

    window.addEventListener('resize', updateHeightVar);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener('resize', updateHeightVar);
      document.documentElement.style.removeProperty(varName);
    };
  }, [varName]);

  return containerRef;
}

