"use client";

import { useCallback } from "react";
import { X } from "lucide-react";

type ProfileOrderLeaveDialogProps = {
  open: boolean;
  currentRestaurantName: string;
  targetRestaurantName: string;
  targetUrl: string;
  onCancel: () => void;
};

export function ProfileOrderLeaveDialog({
  open,
  currentRestaurantName,
  targetRestaurantName,
  targetUrl,
  onCancel,
}: ProfileOrderLeaveDialogProps) {
  const handleConfirm = useCallback(() => {
    window.location.href = targetUrl;
  }, [targetUrl]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-[radial-gradient(circle_at_50%_10%,rgba(var(--brand),0.34),rgba(6,18,34,0.82)_60%)] px-5 backdrop-blur-[3px]"
      role="dialog"
      aria-modal="true"
      aria-label="Leave restaurant confirmation"
    >
      <div className="relative w-full max-w-[360px] rounded-[32px] border-2 border-[rgb(var(--accent)/0.7)] bg-[linear-gradient(180deg,rgba(var(--accent-soft),0.96),rgba(255,255,255,0.98))] px-6 pb-6 pt-10 text-center shadow-[0_30px_80px_rgba(4,19,33,0.45)]">
        <button
          type="button"
          onClick={onCancel}
          className="absolute -right-3 -top-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-[rgb(var(--brand)/0.65)] bg-[linear-gradient(180deg,rgb(var(--brand)/0.95),rgb(var(--brand)/0.72))] text-white shadow-[0_10px_24px_rgb(var(--brand)/0.45)] transition-transform active:scale-95"
          aria-label="Close leave dialog"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="rounded-[26px] border border-[rgb(var(--border)/0.9)] bg-[rgb(var(--card-surface))] px-4 py-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
          <h2 className="text-2xl font-black leading-[1.05] tracking-[-0.03em] text-[rgb(var(--ink))]">
            Leave {currentRestaurantName}?
          </h2>
          <p className="mt-3 font-sans text-[15px] font-semibold leading-6 text-[rgb(var(--ink))] opacity-80">
            You are about to leave{" "}
            <span className="font-bold">{currentRestaurantName}</span> and go
            to{" "}
            <span className="font-bold">{targetRestaurantName}</span>&apos;s
            menu. Your cart and session will stay here.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={handleConfirm}
            className="inline-flex h-12 items-center justify-center rounded-full border border-[rgb(var(--brand)/0.65)] bg-[linear-gradient(180deg,rgb(var(--brand)/0.95),rgb(var(--brand)/0.8))] text-sm font-extrabold tracking-[0.04em] text-white shadow-[0_12px_26px_rgb(var(--brand)/0.38)] transition-all hover:brightness-105 active:scale-[0.98]"
          >
            Go to {targetRestaurantName}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-12 items-center justify-center rounded-full border border-[rgb(var(--accent)/0.72)] bg-[linear-gradient(180deg,rgb(var(--accent)/0.94),rgb(var(--accent)/0.72))] text-sm font-extrabold tracking-[0.04em] text-white shadow-[0_12px_26px_rgb(var(--accent)/0.3)] transition-all hover:brightness-105 active:scale-[0.98]"
          >
            Stay
          </button>
        </div>
      </div>
    </div>
  );
}
