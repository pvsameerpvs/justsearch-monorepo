"use client";

import {
  Globe,
  Bell,
  Shield,
  Store,
  DollarSign,
  Gamepad2,
  CreditCard,
} from "lucide-react";

const SECTIONS = [
  { id: "general" as const, label: "General", icon: Globe },
  { id: "notifications" as const, label: "Alerts", icon: Bell },
  { id: "security" as const, label: "Security", icon: Shield },
  { id: "restaurants" as const, label: "Restaurants", icon: Store },
  { id: "revenue" as const, label: "Revenue", icon: DollarSign },
  { id: "games" as const, label: "Games", icon: Gamepad2 },
  { id: "billing" as const, label: "Billing", icon: CreditCard },
];

interface SettingsTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function SettingsTabs({ activeTab, onTabChange }: SettingsTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {SECTIONS.map((s) => {
        const Icon = s.icon;
        const active = activeTab === s.id;
        return (
          <button
            key={s.id}
            onClick={() => onTabChange(s.id)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
              active
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{s.label}</span>
          </button>
        );
      })}
    </div>
  );
}
