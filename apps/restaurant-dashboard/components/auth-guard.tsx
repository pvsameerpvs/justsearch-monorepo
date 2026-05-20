"use client";

import { useDashboardAuth } from "@/lib/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

const STORAGE_KEY = 'staff-auth-v1';

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

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useDashboardAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  useEffect(() => {
    if (isLoading) return;
    const persisted = hasPersistedAuth();
    // Only redirect if there is no persisted auth AND user is not authenticated AND not on login page
    if (!isAuthenticated && !persisted && !isLoginPage) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, isLoginPage, router]);

  // Always render children — pages handle their own loading skeletons.
  // Redirect only happens after auth check completes and user is not authenticated.
  return <>{children}</>;
}
