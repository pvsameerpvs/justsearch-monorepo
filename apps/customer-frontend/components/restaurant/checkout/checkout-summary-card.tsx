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
  promoCode: string;
  setPromoCode: (val: string) => void;
};

export function CheckoutSummaryCard({
  restaurantName,
  displayItems,
  displaySavings,
  currency,
  note,
  setNote,
  promoCode,
  setPromoCode,
}: CheckoutSummaryCardProps) {
  return (
    <div className="rounded-[32px] border border-[rgb(var(--border)/0.6)] bg-white px-6 py-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xl font-bold tracking-tight text-[rgb(var(--ink))]">Order summary</p>
          <p className="mt-1 text-xs font-medium text-slate-400 uppercase tracking-wider">{restaurantName}</p>
        </div>
        <ButtonLink href="/menu" variant="ghost" size="sm" className="h-8 text-[11px] font-bold uppercase tracking-widest text-[rgb(var(--brand))]">
          Edit
        </ButtonLink>
      </div>

      <div className="mt-6 space-y-5">
        {displayItems.map((item) => (
          <div key={item.itemId} className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[15px] font-bold leading-6 text-[rgb(var(--ink))]">
                {item.quantity} x {item.name}
              </p>
              <p className="mt-0.5 text-[12px] font-medium text-slate-400">Standard portion</p>
            </div>
            <div className="text-right">
              <p className="text-[15px] font-bold text-[rgb(var(--ink))]">
                {formatCurrency(item.lineTotal, item.currency)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-7 rounded-2xl border border-slate-100 bg-slate-50/30 px-4 py-4">
        <input
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Special instructions for the kitchen?"
          className="w-full bg-transparent text-[13px] font-medium text-[rgb(var(--ink))] outline-none placeholder:text-slate-400"
        />
      </div>

      {/* Promo Code Section */}
      <div className="mt-5 flex items-center gap-3 overflow-hidden rounded-2xl border border-slate-100 bg-white px-2 py-2">
        <input
          value={promoCode}
          onChange={(event) => setPromoCode(event.target.value.toUpperCase())}
          placeholder="Promo code?"
          className="flex-1 px-3 bg-transparent text-[13px] font-bold uppercase tracking-widest text-[rgb(var(--brand))] placeholder:font-normal placeholder:lowercase placeholder:tracking-normal outline-none"
        />
        <button 
          type="button"
          className="rounded-xl bg-slate-900 px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest text-white transition-all active:scale-95"
        >
          Apply
        </button>
      </div>

      <div className="mt-5 rounded-2xl bg-amber-50 px-4 py-4 text-[12px] font-bold text-amber-900/80 leading-relaxed">
        You've got the best deal. {formatCurrency(displaySavings, currency)} discount applied!
      </div>
    </div>
  );
}
