import { Shield, Pencil, Trash2 } from "lucide-react";
import type { StaffMember } from "@/lib/hooks/use-staff-query";

const ROLE_META: Record<string, { label: string; color: string; bg: string }> = {
  owner: { label: "Owner", color: "text-amber-700", bg: "bg-amber-50" },
  manager: { label: "Manager", color: "text-sky-700", bg: "bg-sky-50" },
  cashier: { label: "Cashier", color: "text-violet-700", bg: "bg-violet-50" },
  kitchen_staff: { label: "Kitchen", color: "text-emerald-700", bg: "bg-emerald-50" },
};

interface StaffCardProps {
  member: StaffMember;
  onEdit: () => void;
  onRemove: () => void;
  canManage?: boolean;
}

export function StaffCard({ member, onEdit, onRemove, canManage }: StaffCardProps) {
  const meta = ROLE_META[member.role] || { label: member.role, color: "text-slate-600", bg: "bg-slate-100" };
  const isDisabled = !member.isActive;

  return (
    <div className={`elegant-card p-4 transition-opacity ${isDisabled ? "opacity-60" : ""}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-sm font-bold text-emerald-700">
            {member.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">{member.name}</p>
            <p className="text-[10px] font-mono text-slate-500">@{member.username}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${meta.bg} ${meta.color}`}>
            {meta.label}
          </span>
          {canManage && (
            <>
              <button onClick={onEdit} className="flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button onClick={onRemove} className="flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
      {isDisabled && (
        <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-red-500">Inactive</p>
      )}
    </div>
  );
}
