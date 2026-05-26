"use client";

import { useEffect } from "react";
import { unlockAudioOnInteraction, prepareAudioContext } from "@/lib/utils/notification-sound";

/**
 * Initialize the shared AudioContext on mount and unlock it
 * on the first user click/keypress/touch.
 *
 * Place this hook once at the app root (e.g. inside ClientLayout).
 */
export function useAudioUnlock() {
  useEffect(() => {
    prepareAudioContext();
    unlockAudioOnInteraction();
  }, []);
}
