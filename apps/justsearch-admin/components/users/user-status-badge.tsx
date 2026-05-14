import type { RestaurantStatus } from "./types/user.types";

type UserStatus = RestaurantStatus | "inactive";

const STATUS_META: Record<UserStatus, { label: string; bg: string; text: string; ring: string }> = {
  active: { label: "Active", bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-200" },
  inactive: { label: "Inactive", bg: "bg-slate-100", text: "text-slate-500", ring: "ring-slate-200" },
  draft: { label: "Draft", bg: "bg-slate-100", text: "text-slate-500", ring: "ring-slate-200" },
  suspended: { label: "Suspended", bg: "bg-red-50", text: "text-red-700", ring: "ring-red-200" },
};

interface UserStatusBadgeProps {
  status: UserStatus;
}

export function UserStatusBadge({ status }: UserStatusBadgeProps) {
  const meta = STATUS_META[status];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold ring-1 ${meta.bg} ${meta.text} ${meta.ring}`}>
      {meta.label}
    </span>
  );
}
