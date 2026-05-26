import { History, ClipboardList } from "lucide-react";

type Tab = "active" | "history";

interface OrderManagerTabsProps {
  tab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function OrderManagerTabs({ tab, onTabChange }: OrderManagerTabsProps) {
  const isActive = tab === "active";

  return (
    <div className="inline-flex gap-1 rounded-xl bg-slate-100/80 p-1 backdrop-blur-sm border border-slate-200/50">
      <button
        onClick={() => onTabChange("active")}
        className={`flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold transition-all duration-300 ${
          isActive
            ? "bg-white text-slate-900 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.1)]"
            : "text-slate-500 hover:text-slate-700"
        }`}
      >
        <ClipboardList className="h-4 w-4" />
        Active Orders
      </button>
      <button
        onClick={() => onTabChange("history")}
        className={`flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold transition-all duration-300 ${
          !isActive
            ? "bg-white text-slate-900 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.1)]"
            : "text-slate-500 hover:text-slate-700"
        }`}
      >
        <History className="h-4 w-4" />
        Order History
      </button>
    </div>
  );
}
