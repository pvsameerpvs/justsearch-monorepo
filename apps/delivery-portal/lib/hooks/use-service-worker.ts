"use client";

import { useEffect, useRef, useCallback } from "react";

export function useServiceWorker() {
  const registeredRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    if (registeredRef.current) return;
    registeredRef.current = true;

    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((reg) => {
        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                // New version available — notify user if desired
                window.dispatchEvent(new CustomEvent("sw:update-available"));
              }
            });
          }
        });
      })
      .catch(() => {
        // Fail silently — PWA features are progressive
      });
  }, []);

  const skipWaiting = useCallback(() => {
    if (typeof window === "undefined") return;
    navigator.serviceWorker.ready.then((reg) => {
      reg.waiting?.postMessage({ type: "SKIP_WAITING" });
    });
  }, []);

  return { skipWaiting };
}
