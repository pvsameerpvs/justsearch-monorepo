"use client";

import { useDashboardAuth } from "@/lib/auth-context";
import { isRoleAtLeast, type StaffRole } from "@/lib/utils/role-guards";

interface RoleGuardProps {
  minimumRole: StaffRole;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGuard({ minimumRole, children, fallback }: RoleGuardProps) {
  const { user } = useDashboardAuth();
  const allowed = user?.role ? isRoleAtLeast(user.role, minimumRole) : false;
  if (!allowed) return fallback ?? null;
  return <>{children}</>;
}
