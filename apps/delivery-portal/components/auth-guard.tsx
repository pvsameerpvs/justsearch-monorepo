"use client";

import { useDriverAuth } from "@/lib/driver-auth-store";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export function DeliveryAuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, hydrated } = useDriverAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (hydrated && !isLoggedIn && pathname !== "/login") {
      router.push("/login");
    }
  }, [hydrated, isLoggedIn, pathname, router]);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  if (!isLoggedIn && pathname !== "/login") {
    return null;
  }

  return <>{children}</>;
}
