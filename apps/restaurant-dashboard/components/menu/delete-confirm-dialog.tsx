"use client";

import { useState } from "react";
import { AlertTriangle, X, Trash2 } from "lucide-react";

interface DeleteConfirmDialogProps {
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmDialog({ title, description, onConfirm, onCancel }: DeleteConfirmDialogProps) {
  const [confirmText, setConfirmText] = useState("");
  const expected = "delete";
  const isValid = confirmText.trim().toLowerCase() === expected;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative mx-4 w-full max-w-sm rounded-2xl border border-red-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          </div>
          <button onClick={onCancel} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-sm text-slate-500 mb-4">{description}</p>

        <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700 mb-4">
          This action <strong>cannot be undone</strong>.
        </div>

        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Type &quot;delete&quot; to confirm
          </label>
          <input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="delete"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-100"
          />
        </div>

        <div className="mt-5 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!isValid}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
