interface CheckoutOrderBreakdownCardProps {
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  currency?: string;
}

export function CheckoutOrderBreakdownCard({
  subtotal,
  deliveryFee,
  tax,
  total,
  currency = 'AED',
}: CheckoutOrderBreakdownCardProps) {
  return (
    <div className="rounded-[24px] border border-[rgb(var(--border)/0.56)] bg-white p-5 sm:p-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[rgb(var(--muted))]">Subtotal</span>
          <span className="font-medium text-[rgb(var(--ink))]">
            {currency} {subtotal}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-[rgb(var(--muted))]">Delivery fee</span>
          <span className="font-medium text-[rgb(var(--ink))]">
            {currency} {deliveryFee}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-[rgb(var(--muted))]">Tax</span>
          <span className="font-medium text-[rgb(var(--ink))]">
            {currency} {tax}
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-[rgb(var(--border)/0.5)] pt-2">
          <span className="text-sm font-semibold text-[rgb(var(--ink))]">Total</span>
          <span className="text-lg font-bold text-[rgb(var(--brand))]">
            {currency} {total}
          </span>
        </div>
      </div>
    </div>
  );
}
