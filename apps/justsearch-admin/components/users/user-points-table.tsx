"use client";

import { useState } from "react";

import { Phone, Trophy, ChevronDown, ChevronUp } from "lucide-react";

import { UserStatusBadge } from "./user-status-badge";
import { UserGamePointsBar } from "./user-game-points-bar";
import { UserEmpty } from "./user-empty";
import type { RestaurantUser } from "@/lib/stores/user-store";

interface UserPointsTableProps {
  users: RestaurantUser[];
}

export function UserPointsTable({ users }: UserPointsTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (users.length === 0) return <UserEmpty />;

  const maxPoints = Math.max(...users.map((u) => u.totalPoints), 1);

  return (
    <div className="space-y-2">
      {users.map((user) => {
        const expanded = expandedId === user.id;
        const pct = Math.round((user.totalPoints / maxPoints) * 100);

        return (
          <div key={user.id} className="rounded-xl border border-slate-100 bg-white overflow-hidden hover:shadow-sm transition-shadow">
            <button
              onClick={() => setExpandedId(expanded ? null : user.id)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left"
            >
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-black ${user.status === "active" ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-500"}`}>
                {user.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                  <UserStatusBadge status={user.status} />
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                  <Phone className="h-3 w-3" />
                  {user.phone}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
                    <Trophy className="h-3 w-3" />
                    {user.totalPoints.toLocaleString()}
                  </div>
                  <div className="h-1 w-20 overflow-hidden rounded-full bg-slate-100 mt-1">
                    <div className="h-full rounded-full bg-amber-400" style={{ width: `${pct}%` }} />
                  </div>
                </div>
                {expanded ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
              </div>
            </button>
            {expanded && (
              <div className="border-t border-slate-50 px-4 py-3 bg-slate-50/40">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Game Breakdown</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  {user.gamePoints.map((gp) => (
                    <UserGamePointsBar key={gp.gameId} gamePoints={gp} />
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
