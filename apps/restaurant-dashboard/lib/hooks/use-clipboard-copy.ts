"use client";

import { useState, useCallback } from "react";

export function useClipboardCopy(timeout = 2000) {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = useCallback(async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), timeout);
  }, [timeout]);

  return { copied, handleCopy };
}
