"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { DashboardAuthProvider } from "@/lib/auth-context";
import { AuthGuard } from "@/components/auth-guard";
import { DashboardSidebar } from "@/components/dashboard-sidebar";

export function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <DashboardAuthProvider>
      <AuthGuard>
        <div className="min-h-screen overflow-x-hidden bg-slate-50">
          {!isLoginPage && <DashboardSidebar />}
          <main className={!isLoginPage ? "p-4 pt-16 md:ml-[260px] md:p-8 md:pt-8" : ""}>
            {children}
          </main>
        </div>
      </AuthGuard>
    </DashboardAuthProvider>
  );
}
