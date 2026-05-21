"use client";

import { AlertTriangle } from "lucide-react";
import { Surface } from "@/components/shared/surface";

interface ProfileAddressDeleteDialogProps {
  label: string;
  address: string;
  onConfirm: () => void;
  onCancel: () => void;
  isRemoving?: boolean;
}

export function ProfileAddressDeleteDialog({ label, address, onConfirm, onCancel, isRemoving }: ProfileAddressDeleteDialogProps) {
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
      <Surface className="mx-4 w-full max-w-sm rounded-[24px] bg-white p-6 shadow-xl">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <AlertTriangle className="h-7 w-7 text-red-500" />
          </div>
          <p className="text-lg font-bold text-[rgb(var(--ink))]">Delete Address?</p>
          <p className="mt-2 text-sm text-[rgb(var(--muted))]">
            Are you sure you want to remove <span className="font-semibold text-[rgb(var(--ink))]">&quot;{label}&quot;</span>?
          </p>
          <p className="mt-1 text-xs text-[rgb(var(--muted))]">{address}</p>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            onClick={onCancel}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isRemoving}
            className="rounded-xl bg-red-500 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-red-600 disabled:opacity-60"
          >
            {isRemoving ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </Surface>
    </div>
  );
}
