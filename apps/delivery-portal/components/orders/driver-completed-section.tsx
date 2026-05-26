import { CheckCircle2, Sparkles, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import type { DeliveryOrder } from "@/lib/delivery-types";

type DriverCompletedSectionProps = {
  orders: DeliveryOrder[];
};

export function DriverCompletedSection({ orders }: DriverCompletedSectionProps) {
  const completed = orders.filter((o) => o.status === 'delivered');

  if (completed.length === 0) return null;

  const totalValue = completed.reduce((sum, o) => sum + o.total, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[20px] border border-emerald-100 bg-emerald-50/60 p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-emerald-600" />
          <h3 className="text-sm font-bold text-emerald-900">Completed today</h3>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700">
          <TrendingUp className="h-3 w-3" />
          AED {totalValue.toFixed(2)}
        </div>
      </div>
      <div className="space-y-2">
        {completed.slice(0, 3).map((order, i) => (
          <motion.div
            key={order.assignmentId}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className="flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-2 min-w-0">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
              <span className="font-medium text-slate-700 shrink-0">{order.code}</span>
              <span className="text-slate-500 truncate">{order.customerName}</span>
            </div>
            <span className="font-bold text-slate-900 shrink-0 ml-2">{order.orderValue}</span>
          </motion.div>
        ))}
        {completed.length > 3 && (
          <p className="text-[11px] text-emerald-700 font-semibold pt-1">+ {completed.length - 3} more deliveries</p>
        )}
      </div>
    </motion.div>
  );
}
