"use client";

import { useDashboardAuth } from "@/lib/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useDashboardAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isLoginPage) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, isLoginPage, router]);

  // Always render children — pages handle their own loading skeletons.
  // Redirect only happens after auth check completes and user is not authenticated.
  return <>{children}</>;
}
