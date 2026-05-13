const TABS = [
  { value: "overview", label: "Overview" },
  { value: "orders", label: "Orders" },
  { value: "games", label: "Games" },
  { value: "vouchers", label: "Vouchers" },
];

interface CustomerDetailTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function CustomerDetailTabs({ activeTab, onTabChange }: CustomerDetailTabsProps) {
  return (
    <div className="flex gap-1 border-b border-slate-100 pb-1">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onTabChange(tab.value)}
          className={`px-3 py-2 text-xs font-bold rounded-lg transition-colors ${
            activeTab === tab.value
              ? "bg-indigo-50 text-indigo-700"
              : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
