"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { DashboardAuthProvider } from "@/lib/auth-context";
import { AuthGuard } from "@/components/auth-guard";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { NewOrderNotification } from "@/components/new-order-notification";
import { useAudioUnlock } from "@/lib/hooks/use-audio-unlock";
import { useSidebarStore } from "@/lib/stores/sidebar-store";

export function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  const { isCollapsed } = useSidebarStore();

  // Initialize audio context unlock on first user interaction
  useAudioUnlock();

  return (
    <DashboardAuthProvider>
      <AuthGuard>
        <div className="min-h-screen overflow-x-hidden bg-[#F4F6F9]">
          {!isLoginPage && <DashboardSidebar />}
          <main className={!isLoginPage ? `p-4 pt-16 transition-all duration-300 md:p-8 md:pt-6 ${isCollapsed ? 'md:ml-[96px]' : 'md:ml-[296px]'}` : ""}>
            {children}
          </main>
          {!isLoginPage && <NewOrderNotification />}
        </div>
      </AuthGuard>
    </DashboardAuthProvider>
  );
}
