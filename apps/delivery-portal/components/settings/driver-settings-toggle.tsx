"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface DriverSettingsToggleProps {
  icon: ReactNode;
  activeIcon: ReactNode;
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}

export function DriverSettingsToggle({
  icon,
  activeIcon,
  label,
  description,
  enabled,
  onToggle,
}: DriverSettingsToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between rounded-xl bg-slate-50 p-3 active:bg-slate-100 transition"
    >
      <div className="flex items-center gap-3">
        <div className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
          enabled ? "bg-emerald-100" : "bg-slate-200"
        )}>
          {enabled ? activeIcon : icon}
        </div>
        <div className="text-left">
          <p className="text-sm font-semibold text-slate-900">{label}</p>
          <p className="text-[11px] text-slate-500">{description}</p>
        </div>
      </div>
      <div className={cn("relative h-6 w-11 rounded-full transition", enabled ? "bg-emerald-500" : "bg-slate-300")}>
        <div
          className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all"
          style={{ left: enabled ? 22 : 2 }}
        />
      </div>
    </button>
  );
}
