import { Users, Plus } from "lucide-react";

interface StaffHeaderProps {
  total: number;
  onAdd: () => void;
  canManage?: boolean;
}

export function StaffHeader({ total, onAdd, canManage }: StaffHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
          <Users className="h-5 w-5 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">Staff</h3>
          <p className="text-xs text-slate-500">{total} team members</p>
        </div>
      </div>
      {canManage && (
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-800 transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" /> Add Staff
        </button>
      )}
    </div>
  );
}
