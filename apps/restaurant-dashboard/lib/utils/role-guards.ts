export type StaffRole = "owner" | "manager" | "cashier" | "kitchen_staff";

export const ROLE_HIERARCHY: Record<StaffRole, number> = {
  owner: 4,
  manager: 3,
  cashier: 2,
  kitchen_staff: 1,
};

export function isRoleAtLeast(role: StaffRole | string, minimum: StaffRole): boolean {
  return (ROLE_HIERARCHY[role as StaffRole] ?? 0) >= ROLE_HIERARCHY[minimum];
}

export function canAccessRoute(role: StaffRole | string | undefined, route: string): boolean {
  if (!role) return true;
  const normalized = role.trim().toLowerCase() as StaffRole;

  const routeAccess: Record<string, StaffRole[]> = {
    "/": ["owner", "manager", "cashier", "kitchen_staff"],
    "/homepage": ["owner", "manager"],
    "/menu": ["owner", "manager"],
    "/orders": ["owner", "manager", "cashier", "kitchen_staff"],
    "/delivery": ["owner", "manager"],
    "/staff": ["owner", "manager"],
    "/vouchers": ["owner", "manager"],
    "/customers": ["owner", "manager"],
    "/analytics": ["owner", "manager"],
    "/profile": ["owner", "manager", "cashier", "kitchen_staff"],
    "/settings": ["owner", "manager"],
  };

  const allowed = routeAccess[route] ?? ["owner", "manager", "cashier", "kitchen_staff"];
  return allowed.includes(normalized);
}

export interface SidebarSection {
  label: string;
  items: { href: string; label: string; icon: React.ElementType }[];
}

export function filterSidebarSections(role: StaffRole | string | undefined, sections: SidebarSection[]): SidebarSection[] {
  if (!role) return sections;
  return sections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => canAccessRoute(role, item.href)),
    }))
    .filter((section) => section.items.length > 0);
}
