"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { DashboardAuthProvider, useDashboardAuth } from "@/lib/auth-context";
import { AuthGuard } from "@/components/auth-guard";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { StaffTopBar } from "@/components/staff-top-bar";
import { NewOrderNotification } from "@/components/new-order-notification";
import { useAudioUnlock } from "@/lib/hooks/use-audio-unlock";
import { useSidebarStore } from "@/lib/stores/sidebar-store";

function LayoutContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  const { isCollapsed } = useSidebarStore();
  const { user } = useDashboardAuth();
  const isOwner = user?.role === 'owner';

  // Initialize audio context unlock on first user interaction
  useAudioUnlock();

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F4F6F9]">
      {!isLoginPage && isOwner && <DashboardSidebar />}
      {!isLoginPage && !isOwner && <StaffTopBar />}
      <main className={!isLoginPage ? `p-4 pt-16 transition-all duration-300 md:p-8 md:pt-6 ${isOwner ? (isCollapsed ? 'md:ml-[96px]' : 'md:ml-[296px]') : ''}` : ""}>
        {children}
      </main>
      {!isLoginPage && <NewOrderNotification />}
    </div>
  );
}

export function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardAuthProvider>
      <AuthGuard>
        <LayoutContent>{children}</LayoutContent>
      </AuthGuard>
    </DashboardAuthProvider>
  );
}
