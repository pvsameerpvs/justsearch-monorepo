"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { LogOut, X } from "lucide-react";

export function LogoutConfirmDialog({
  open,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!mounted || !open || typeof window === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative w-full max-w-xs rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl shadow-slate-900/10 text-center space-y-4">
        <button
          onClick={onCancel}
          className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
          <LogOut className="h-5 w-5" />
        </div>

        <div className="space-y-1">
          <p className="text-sm font-bold text-slate-900">Confirm Logout</p>
          <p className="text-xs text-slate-500">
            Are you sure you want to sign out?
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-slate-200 bg-white py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-red-500 py-2 text-xs font-bold text-white hover:bg-red-600 transition-colors shadow-sm shadow-red-500/20"
          >
            Yes, Logout
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
