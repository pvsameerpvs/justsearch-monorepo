"use client";

import { useState, useEffect, useCallback } from "react";

interface PwaInstallState {
  canInstall: boolean;
  isInstalled: boolean;
  isStandalone: boolean;
  deferredPrompt: Event | null;
}

export function usePwaInstall() {
  const [state, setState] = useState<PwaInstallState>({
    canInstall: false,
    isInstalled: false,
    isStandalone: false,
    deferredPrompt: null,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    setState((prev) => ({ ...prev, isStandalone, isInstalled: isStandalone }));

    const handler = (e: Event) => {
      e.preventDefault();
      setState((prev) => ({ ...prev, canInstall: true, deferredPrompt: e }));
    };

    window.addEventListener("beforeinstallprompt", handler);

    window.addEventListener("appinstalled", () => {
      setState({ canInstall: false, isInstalled: true, isStandalone: true, deferredPrompt: null });
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const install = useCallback(async () => {
    const prompt = (state.deferredPrompt as unknown as { prompt?: () => Promise<void> }) ?? null;
    if (!prompt?.prompt) return { outcome: "dismissed" as const };

    await prompt.prompt();
    const result = await (prompt as unknown as { userChoice?: Promise<{ outcome: "accepted" | "dismissed" }> }).userChoice;

    setState((prev) => ({ ...prev, deferredPrompt: null, canInstall: false }));

    return result ?? { outcome: "dismissed" as const };
  }, [state.deferredPrompt]);

  return { ...state, install };
}
