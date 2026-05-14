"use client";

import { CheckCircle2 } from "lucide-react";

export function DriverSlideDone() {
  return (
    <div className="px-4 pb-4 pt-1">
      <div className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm font-bold text-emerald-700">
        <CheckCircle2 className="h-4 w-4" /> Delivery completed
      </div>
    </div>
  );
}
