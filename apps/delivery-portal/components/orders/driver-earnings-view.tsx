import { Banknote, CreditCard, TrendingUp, Package } from "lucide-react";

type DriverEarningsViewProps = {
  agentName: string;
  totalDeliveries: number;
  totalEarned: number;
  cashCollected: number;
  cardCollected: number;
};

export function DriverEarningsView({ agentName, totalDeliveries, totalEarned, cashCollected, cardCollected }: DriverEarningsViewProps) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-slate-900">{agentName}</h1>
        <p className="text-xs text-slate-500">Today&apos;s earnings</p>
      </div>

      {/* Total earned big card */}
      <div className="rounded-[20px] bg-emerald-600 p-5 text-white">
        <div className="flex items-center gap-2 text-emerald-100 text-xs font-bold uppercase tracking-wider mb-1">
          <TrendingUp className="h-3.5 w-3.5" /> Total earned
        </div>
        <p className="text-3xl font-black">AED {totalEarned.toFixed(2)}</p>
        <p className="text-xs text-emerald-200 mt-1">{totalDeliveries} delivery{totalDeliveries !== 1 ? "ies" : "y"} completed</p>
      </div>

      {/* Cash vs Card */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-[16px] border border-amber-100 bg-amber-50 p-4">
          <div className="flex items-center gap-1.5 text-amber-600 text-[10px] font-bold uppercase tracking-wider mb-2">
            <Banknote className="h-3.5 w-3.5" /> Cash
          </div>
          <p className="text-xl font-black text-amber-800">AED {cashCollected.toFixed(2)}</p>
          <p className="text-[10px] text-amber-600 mt-1">COD collected</p>
        </div>

        <div className="rounded-[16px] border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">
            <CreditCard className="h-3.5 w-3.5" /> Card
          </div>
          <p className="text-xl font-black text-slate-900">AED {cardCollected.toFixed(2)}</p>
          <p className="text-[10px] text-slate-500 mt-1">Prepaid orders</p>
        </div>
      </div>

      {/* Deliveries count */}
      <div className="rounded-[16px] border border-slate-200 bg-white p-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50">
          <Package className="h-5 w-5 text-emerald-600" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">{totalDeliveries}</p>
          <p className="text-xs text-slate-500">Deliveries completed today</p>
        </div>
      </div>
    </div>
  );
}
