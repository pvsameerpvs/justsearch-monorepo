"use client";

import { useEffect } from "react";

export function usePageVisibilityPoll(onVisible: () => void) {
  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        onVisible();
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    // Also trigger on window focus (app switch back on mobile)
    window.addEventListener("focus", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleVisibilityChange);
    };
  }, [onVisible]);
}
