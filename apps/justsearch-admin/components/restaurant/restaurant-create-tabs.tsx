import { Info, MapPin, FileText, Check, AlertCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type TabKey = "basic" | "location" | "business";

const TABS: { key: TabKey; label: string; icon: LucideIcon }[] = [
  { key: "basic", label: "Basic Info", icon: Info },
  { key: "location", label: "Location", icon: MapPin },
  { key: "business", label: "Business", icon: FileText },
];

interface RestaurantCreateTabsProps {
  activeTab: TabKey;
  onTabClick: (tab: TabKey) => void;
  tabErrors?: Record<TabKey, boolean>;
}

export function RestaurantCreateTabs({ activeTab, onTabClick, tabErrors }: RestaurantCreateTabsProps) {
  return (
    <div className="flex gap-2">
      {TABS.map((t, i) => {
        const Icon = t.icon;
        const isActive = activeTab === t.key;
        const isDone = TABS.findIndex((x) => x.key === activeTab) > i;
        const hasError = tabErrors?.[t.key];
        return (
          <button
            key={t.key}
            type="button"
            onClick={() => onTabClick(t.key)}
            className={`flex flex-1 flex-col items-center gap-1 rounded-xl border px-2 py-2.5 text-center transition-all ${
              hasError
                ? "border-red-300 bg-red-50 shadow-sm"
                : isActive
                ? "border-amber-300 bg-amber-50 shadow-sm"
                : isDone
                ? "border-emerald-200 bg-emerald-50/50"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                hasError
                  ? "bg-red-500 text-white"
                  : isActive
                  ? "bg-amber-500 text-white"
                  : isDone
                  ? "bg-emerald-500 text-white"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {hasError ? <AlertCircle className="h-3 w-3" /> : isDone ? <Check className="h-3 w-3" /> : <Icon className="h-3 w-3" />}
            </div>
            <p className={`text-[10px] font-bold ${hasError ? "text-red-700" : isActive ? "text-amber-700" : isDone ? "text-emerald-700" : "text-slate-500"}`}>
              {t.label}
            </p>
          </button>
        );
      })}
    </div>
  );
}
