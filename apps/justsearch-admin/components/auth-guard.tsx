"use client";

import { useAdminAuth } from "@/lib/auth-store";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const STORAGE_KEY = 'admin-auth-v1';

function hasPersistedAuth(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return parsed?.isAuthenticated === true;
  } catch {
    return false;
  }
}

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || isLoading) return;
    if (!isAuthenticated && pathname !== "/login") {
      router.push("/login");
    }
  }, [mounted, isLoading, isAuthenticated, pathname, router]);

  // During SSR and hydration, render children to match server exactly.
  if (!mounted) {
    return <>{children}</>;
  }

  const persisted = hasPersistedAuth();

  // Only show spinner when we are genuinely loading AND have no reason to believe user is auth'd.
  // If localStorage says auth'd, skip spinner to avoid layout flash.
  if (isLoading && !persisted && pathname !== "/login") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated && !persisted && pathname !== "/login") {
    return null;
  }

  return <>{children}</>;
}
