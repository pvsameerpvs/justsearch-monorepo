"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const NAVIGATION_STACK_KEY = 'justsearch:customer:navigation-stack';
const MAX_STACK_SIZE = 32;

function readNavigationStack() {
  if (typeof window === 'undefined') {
    return [] as string[];
  }

  try {
    const raw = window.sessionStorage.getItem(NAVIGATION_STACK_KEY);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((entry): entry is string => typeof entry === 'string')
      : [];
  } catch {
    return [];
  }
}

function writeNavigationStack(stack: string[]) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.sessionStorage.setItem(
      NAVIGATION_STACK_KEY,
      JSON.stringify(stack.slice(-MAX_STACK_SIZE)),
    );
  } catch {
    // Ignore storage errors in demo mode.
  }
}

export function useSmartBackNavigation(
  pathname: string,
  fallbackHref: string,
) {
  const router = useRouter();

  useEffect(() => {
    const stack = readNavigationStack();

    if (stack.at(-1) === pathname) {
      return;
    }

    writeNavigationStack([...stack, pathname]);
  }, [pathname]);

  const goBack = () => {
    const stack = readNavigationStack();

    while (stack.length > 0 && stack.at(-1) === pathname) {
      stack.pop();
    }

    const previousPath = stack.at(-1);
    writeNavigationStack(stack);

    if (previousPath) {
      router.push(previousPath);
      return;
    }

    router.push(fallbackHref);
  };

  return goBack;
}
