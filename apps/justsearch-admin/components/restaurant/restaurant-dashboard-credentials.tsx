"use client";

import { useState } from "react";
import { Lock, UserCircle, Copy, CheckCheck } from "lucide-react";
import type { AdminRestaurant } from "@/lib/stores/restaurant-store";

interface DashboardCredentialsCardProps {
  restaurant: AdminRestaurant;
}

export function DashboardCredentialsCard({ restaurant }: DashboardCredentialsCardProps) {
  const [copiedUser, setCopiedUser] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);

  const username = restaurant.dashboardUsername || "";
  const password = restaurant.dashboardPassword || "";

  if (!username && !password) return null;

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
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
        <Lock className="h-4 w-4 text-indigo-600" />
        Dashboard Login Credentials
      </h3>
      <div className="space-y-3">
        {username && (
          <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3">
            <div className="flex items-center gap-2">
              <UserCircle className="h-4 w-4 text-slate-400" />
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Username</p>
                <p className="text-sm font-medium text-slate-700">{username}</p>
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(username, "user")}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-white hover:text-slate-600 transition-colors"
              title="Copy username"
            >
              {copiedUser ? <CheckCheck className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>
        )}
        {password && (
          <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-slate-400" />
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Password</p>
                <p className="text-sm font-medium text-slate-700">{"•".repeat(password.length)}</p>
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(password, "pass")}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-white hover:text-slate-600 transition-colors"
              title="Copy password"
            >
              {copiedPass ? <CheckCheck className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
