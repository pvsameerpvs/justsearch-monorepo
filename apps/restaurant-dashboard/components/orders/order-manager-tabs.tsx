import { History, ClipboardList } from "lucide-react";

type Tab = "active" | "history";

interface OrderManagerTabsProps {
  tab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function OrderManagerTabs({ tab, onTabChange }: OrderManagerTabsProps) {
  const isActive = tab === "active";

  return (
    <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
      <button
        onClick={() => onTabChange("active")}
        className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold transition-all ${
          isActive ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
        }`}
      >
        <ClipboardList className="h-4 w-4" />
        Active Orders
      </button>
      <button
        onClick={() => onTabChange("history")}
        className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold transition-all ${
          !isActive ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
        }`}
      >
        <History className="h-4 w-4" />
        Order History
      </button>
    </div>
  );
}
