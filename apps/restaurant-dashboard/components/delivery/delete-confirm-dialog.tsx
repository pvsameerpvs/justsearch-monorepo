"use client";

import { AlertTriangle } from "lucide-react";

interface DeleteConfirmDialogProps {
  driverName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isPending?: boolean;
}

export function DeleteConfirmDialog({ driverName, onConfirm, onCancel, isPending }: DeleteConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">Delete Driver?</p>
            <p className="text-xs text-slate-500">This action cannot be undone</p>
          </div>
        </div>

        <p className="text-sm text-slate-600 mb-6">
          Are you sure you want to remove <span className="font-bold text-slate-900">{driverName}</span> from your restaurant? All their delivery history will remain in the system.
        </p>

        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="elegant-btn-secondary flex-1"
            disabled={isPending}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-700 transition-colors disabled:opacity-60"
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete Driver"}
          </button>
        </div>
      </div>
    </div>
  );
}
