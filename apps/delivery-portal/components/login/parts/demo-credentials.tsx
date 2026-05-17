"use client";

import { HelpCircle } from "lucide-react";

export function DemoCredentials() {
  return (
    <div className="mt-4 rounded-lg bg-slate-100 border border-slate-200 p-3">
      <div className="flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
        <HelpCircle className="h-3 w-3" />
        How to log in
      </div>
      <div className="mt-2 space-y-1.5 text-[10px] text-slate-500">
        <p className="rounded-md bg-white px-2 py-1.5">
          <span className="font-bold text-slate-700">1.</span> Enter your restaurant subdomain (from the dashboard URL)
        </p>
        <p className="rounded-md bg-white px-2 py-1.5">
          <span className="font-bold text-slate-700">2.</span> Use your driver card username &amp; password
        </p>
        <p className="rounded-md bg-white px-2 py-1.5">
          <span className="font-bold text-slate-700">3.</span> Ask your restaurant manager if you do not have credentials
        </p>
      </div>
    </div>
  );
}
