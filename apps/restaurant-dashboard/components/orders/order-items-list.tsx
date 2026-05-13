import type { OrderItem } from "@/lib/stores/order-store";

export function OrderItemsList({ items }: { items: OrderItem[] }) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Ordered Items</p>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
            {item.image ? (
              <img src={item.image} alt={item.name} className="h-14 w-14 rounded-lg object-cover shrink-0" />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-slate-100 shrink-0 text-xs font-bold text-slate-400">
                {item.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-slate-900 truncate">{item.name}</p>
                {item.tags?.map((tag) => (
                  <span key={tag} className="rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-bold text-amber-700">{tag}</span>
                ))}
              </div>
              {item.notes && <p className="text-xs text-amber-600 mt-0.5">{item.notes}</p>}
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                <p className="text-sm font-bold text-slate-900">{item.price * item.quantity} {item.currency}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
