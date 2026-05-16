import type { OrderItem } from '@justsearch/types';

interface CheckoutOrderItemsCardProps {
  items: OrderItem[];
}

export function CheckoutOrderItemsCard({ items }: CheckoutOrderItemsCardProps) {
  if (items.length === 0) return null;

  return (
    <div className="rounded-[24px] border border-[rgb(var(--border)/0.56)] bg-white p-5 sm:p-6">
      <p className="text-sm font-semibold text-[rgb(var(--ink))]">Your order</p>
      <div className="mt-3 space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[rgb(var(--ink))]">{item.name}</p>
              <p className="text-xs text-[rgb(var(--muted))]">Qty: {item.quantity}</p>
            </div>
            <p className="text-sm font-semibold text-[rgb(var(--ink))]">
              {item.currency} {item.price}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
