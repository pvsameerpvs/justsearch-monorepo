import { StaffManager } from "@/components/staff/staff-manager";

export default function StaffPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between py-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Staff</h1>
          <p className="text-sm text-slate-500">Manage your restaurant team</p>
        </div>
      </div>
      <StaffManager />
    </div>
  );
}
