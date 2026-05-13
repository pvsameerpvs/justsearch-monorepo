interface OrderTotalsProps {
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
}

export function OrderTotals({ subtotal, deliveryFee, tax, total }: OrderTotalsProps) {
  return (
    <div className="rounded-lg bg-slate-50 border border-slate-100 p-3 space-y-1">
      <TotalRow label="Subtotal" value={subtotal} />
      <TotalRow label="Delivery Fee" value={deliveryFee} />
      <TotalRow label="Tax" value={tax} />
      <div className="flex items-center justify-between pt-2 border-t border-slate-200">
        <span className="text-sm font-bold text-slate-900">Total</span>
        <span className="text-sm font-bold text-slate-900">AED {total}</span>
      </div>
    </div>
  );
}

function TotalRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="text-xs font-bold text-slate-700">AED {value}</span>
    </div>
  );
}
