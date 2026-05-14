"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDriverAuth } from "@/lib/driver-auth-store";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, hydrated } = useDriverAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (hydrated && !isLoggedIn && pathname !== "/login") {
      router.push("/login");
    }
  }, [hydrated, isLoggedIn, pathname, router]);

  // Show spinner while checking localStorage to prevent flash redirect
  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    );
  }

  if (!isLoggedIn && pathname !== "/login") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    );
  }

  return <>{children}</>;
}
