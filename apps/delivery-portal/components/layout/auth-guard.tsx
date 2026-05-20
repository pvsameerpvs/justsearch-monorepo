"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDriverAuth } from "@/lib/driver-auth-store";

const STORAGE_KEY = 'driver-auth-v1';

function hasPersistedAuth(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return parsed?.isLoggedIn === true;
  } catch {
    return false;
  }
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, hydrated } = useDriverAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !hydrated) return;
    if (!isLoggedIn && pathname !== "/login") {
      router.push("/login");
    }
  }, [mounted, hydrated, isLoggedIn, pathname, router]);

  // During SSR and hydration, render children to match server exactly.
  // The guard's redirect / spinner only applies after mount.
  if (!mounted) {
    return <>{children}</>;
  }

  const persisted = hasPersistedAuth();

  // Show spinner only when loading AND no localStorage hint AND not on login page.
  // If localStorage says auth'd, skip spinner to avoid layout flash.
  if (!hydrated && !persisted && pathname !== "/login") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    );
  }

  if (!isLoggedIn && !persisted && pathname !== "/login") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    );
  }

  return <>{children}</>;
}
