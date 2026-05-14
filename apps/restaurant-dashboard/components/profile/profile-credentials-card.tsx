"use client";

import { useState } from "react";
import { Lock, UserCircle, Copy, Check } from "lucide-react";
import type { AdminRestaurant } from "@/lib/types/admin-restaurant";

interface ProfileCredentialsCardProps {
  restaurant: AdminRestaurant;
}

export function ProfileCredentialsCard({ restaurant }: ProfileCredentialsCardProps) {
  const [copiedUser, setCopiedUser] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);

  const copyToClipboard = async (text: string, type: "user" | "pass") => {
    await navigator.clipboard.writeText(text);
    if (type === "user") {
      setCopiedUser(true);
      setTimeout(() => setCopiedUser(false), 2000);
    } else {
      setCopiedPass(true);
      setTimeout(() => setCopiedPass(false), 2000);
    }
  };

  return (
    <div className="elegant-card p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
          <Lock className="h-5 w-5 text-indigo-600" />
        </div>
        <h3 className="text-base font-bold text-slate-900">Dashboard Credentials</h3>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3">
          <div className="flex items-center gap-2">
            <UserCircle className="h-4 w-4 text-slate-400" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Username</p>
              <p className="text-sm font-medium text-slate-700">{restaurant.dashboardUsername}</p>
            </div>
          </div>
          <button
            onClick={() => copyToClipboard(restaurant.dashboardUsername, "user")}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-white hover:text-slate-600 transition-colors"
            title="Copy username"
          >
            {copiedUser ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-slate-400" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Password</p>
              <p className="text-sm font-medium text-slate-700">{"•".repeat(restaurant.dashboardPassword?.length || 0)}</p>
            </div>
          </div>
          <button
            onClick={() => copyToClipboard(restaurant.dashboardPassword, "pass")}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-white hover:text-slate-600 transition-colors"
            title="Copy password"
          >
            {copiedPass ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-slate-50 p-3">
        <p className="text-xs text-slate-600 leading-relaxed">
          To change your password, contact your <strong>JustSearch platform administrator</strong>.
        </p>
      </div>
    </div>
  );
}
