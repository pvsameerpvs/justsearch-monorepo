"use client";

import { useState, useEffect } from "react";
import { useDashboardAuth } from "@/lib/auth-context";
import { LogoutConfirmDialog } from "./dashboard/logout-confirm-dialog";
import { SidebarUserCard } from "./sidebar/sidebar-user-card";
import { getInitials } from "./sidebar/sidebar-user-meta";

interface SidebarFooterProps {
  collapsed?: boolean;
}

export function SidebarFooter({ collapsed = false }: SidebarFooterProps) {
  const { user, logout } = useDashboardAuth();
  const [mounted, setMounted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const name = user?.name ?? 'User';
  const role = user?.role ?? 'staff';
  const initials = getInitials(name);

  return (
    <>
      <div className="border-t border-amber-100/70 p-3">
        <SidebarUserCard
          collapsed={collapsed}
          initials={initials}
          mounted={mounted}
          name={name}
          role={role}
          onLogoutClick={() => setShowConfirm(true)}
        />
      </div>

      <LogoutConfirmDialog
        open={showConfirm}
        onConfirm={() => { setShowConfirm(false); logout(); }}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
