"use client";

import { X } from "lucide-react";
import { ReactNode } from "react";

interface AdModalProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
}

export function AdModal({ title, children, onClose }: AdModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-sm px-6 py-4">
          <div>
            <h3 className="text-lg font-black text-slate-900">{title}</h3>
            <p className="text-xs text-slate-500 mt-0.5">Fill in the details below to configure the ad campaign</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-800"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
