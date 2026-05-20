"use client";

import { LogOut } from "lucide-react";
import { useDriverAuth } from "@/lib/driver-auth-store";

export function DriverLogoutButton() {
  const { logout } = useDriverAuth();

  return (
    <button
      onClick={logout}
      className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-red-500 transition-colors"
      title="Logout"
    >
      <LogOut className="h-3.5 w-3.5" />
    </button>
  );
}
