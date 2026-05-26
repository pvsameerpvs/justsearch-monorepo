"use client";

import { QrCode, Building2, Briefcase, Truck, Share2 } from "lucide-react";

export type SettingsTab = "qr" | "general" | "business" | "operations" | "socials";

const TABS: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
  { id: "qr", label: "QR & Links", icon: QrCode },
  { id: "general", label: "General", icon: Building2 },
  { id: "business", label: "Business", icon: Briefcase },
  { id: "operations", label: "Operations", icon: Truck },
  { id: "socials", label: "Socials", icon: Share2 },
];

interface SettingsTabsNavProps {
  active: SettingsTab;
  onChange: (tab: SettingsTab) => void;
}

export function SettingsTabsNav({ active, onChange }: SettingsTabsNavProps) {
  return (
    <div className="flex gap-1 overflow-x-auto pb-2">
      {TABS.map((t) => {
        const Icon = t.icon;
        const isActive = active === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
              isActive
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            }`}
          >
            <Icon className="h-4 w-4" strokeWidth={isActive ? 2.5 : 2} />
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
