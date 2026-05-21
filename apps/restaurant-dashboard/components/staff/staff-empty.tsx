import { Shield, AlertTriangle, RefreshCw } from "lucide-react";

interface StaffEmptyProps {
  onAdd: () => void;
  canManage?: boolean;
}

export function StaffEmpty({ onAdd, canManage }: StaffEmptyProps) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 py-12">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
        <Shield className="h-6 w-6 text-emerald-500" />
      </div>
      <p className="mt-3 text-sm font-medium text-slate-600">No staff members yet</p>
      <p className="mt-1 text-xs text-slate-400">Add team members to manage your restaurant</p>
      {canManage && (
        <button
          onClick={onAdd}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800 transition-colors"
        >
          Add Staff
        </button>
      )}
    </div>
  );
}

interface StaffErrorProps {
  error: Error;
  onRetry: () => void;
}

export function StaffError({ error, onRetry }: StaffErrorProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-12">
      <AlertTriangle className="h-8 w-8 text-red-500" />
      <p className="text-sm font-medium text-slate-900">Failed to load staff</p>
      <p className="text-xs text-slate-500">{error.message}</p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800 transition-colors"
      >
        <RefreshCw className="h-4 w-4" /> Try Again
      </button>
    </div>
  );
}
