"use client";

import { useEffect, useRef } from "react";

/**
 * Calls the callback at a fixed interval, but only while the page is visible.
 * Automatically pauses when the app is backgrounded (saves battery).
 */
export function useIntervalWhileVisible(callback: () => void, intervalMs: number) {
  const savedCallback = useRef(callback);
  const intervalId = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function start() {
      if (intervalId.current) clearInterval(intervalId.current);
      intervalId.current = setInterval(() => savedCallback.current(), intervalMs);
    }
    function stop() {
      if (intervalId.current) {
        clearInterval(intervalId.current);
        intervalId.current = null;
      }
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        start();
      } else {
        stop();
      }
    }

    // Start immediately if visible
    if (document.visibilityState === "visible") start();

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [intervalMs]);
}
