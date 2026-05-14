"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { DashboardAuthProvider } from "@/lib/auth-context";
import { AuthGuard } from "@/components/auth-guard";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import type { Restaurant } from "@justsearch/utils";

export function ClientLayout({ children, restaurant }: { children: ReactNode; restaurant: Restaurant }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <DashboardAuthProvider>
      <AuthGuard>
        <div className="min-h-screen overflow-x-hidden bg-slate-50">
          {!isLoginPage && <DashboardSidebar restaurant={restaurant} />}
          <main className={!isLoginPage ? "p-4 pt-16 md:ml-[260px] md:p-8 md:pt-8" : ""}>
            {children}
          </main>
        </div>
      </AuthGuard>
    </DashboardAuthProvider>
  );
}
