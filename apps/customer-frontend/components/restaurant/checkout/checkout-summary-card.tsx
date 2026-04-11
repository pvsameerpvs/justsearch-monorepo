"use client";

import { ButtonLink } from '@/components/shared/button-link';
import { formatCurrency } from '@/lib/format';

type SummaryItem = {
  itemId: string;
  quantity: number;
  name: string;
  price: number;
  currency: string;
  lineTotal: number;
};

type CheckoutSummaryCardProps = {
  restaurantName: string;
  displayItems: SummaryItem[];
  displaySavings: number;
  currency: string;
  note: string;
  setNote: (val: string) => void;
};

export function CheckoutSummaryCard({
  restaurantName,
  displayItems,
  displaySavings,
  currency,
  note,
  setNote,
}: CheckoutSummaryCardProps) {
  return (
    <div className="rounded-[28px] border border-[rgb(var(--border)/0.8)] bg-white px-5 py-5 shadow-[0_18px_48px_rgba(15,23,42,0.08)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-3xl font-bold tracking-tight text-[rgb(var(--ink))]">Order summary</p>
          <p className="mt-1 text-sm text-[rgb(var(--muted))]">{restaurantName}</p>
        </div>
        <ButtonLink href="/menu" variant="ghost" size="sm">
          Edit
        </ButtonLink>
      </div>

      <div className="mt-5 space-y-4">
        {displayItems.map((item) => (
          <div key={item.itemId} className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-lg font-semibold leading-7 text-[rgb(var(--ink))]">
                {item.quantity} x {item.name}
              </p>
              <p className="mt-1 text-sm text-[rgb(var(--muted))]">One portion</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-[rgb(var(--ink))]">
                {formatCurrency(item.lineTotal, item.currency)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-[18px] border border-[rgb(var(--border)/0.7)] px-4 py-3">
        <input
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="What to do if an item is out of stock?"
          className="w-full bg-transparent text-sm text-[rgb(var(--ink))] outline-none"
        />
      </div>

      <div className="mt-5 rounded-[18px] bg-[rgba(254,249,195,0.85)] px-4 py-3 text-sm font-semibold text-[rgb(146,64,14)]">
        You've got the best deal. {formatCurrency(displaySavings, currency)} off applied as free delivery.
      </div>
    </div>
  );
}
