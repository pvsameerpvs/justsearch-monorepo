"use client";

import { LogOut } from "lucide-react";
import { getRestaurantInitials } from '@justsearch/utils';
import { useDashboardAuth } from "@/lib/auth-context";
import type { Restaurant } from '@justsearch/utils';

export function SidebarFooter({ restaurant }: { restaurant: Restaurant }) {
  const initials = getRestaurantInitials(restaurant.name);
  const { logout } = useDashboardAuth();

  return (
    <div className="border-t border-white/5 p-3">
      <div className="flex items-center gap-3 rounded-lg bg-white/5 p-3">
        <div className="h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center text-xs font-bold text-amber-500">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-white">Admin</p>
          <div className="flex items-center gap-1">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <p className="text-[10px] text-emerald-500">Online</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 hover:bg-white/10 hover:text-red-400 transition-colors"
          title="Logout"
        >
          <LogOut className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
