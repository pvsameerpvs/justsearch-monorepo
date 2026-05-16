"use client";
import { useForm } from 'react-hook-form';
import { ButtonLink } from '@/components/shared/button-link';
import { formatCurrency } from '@/lib/format';
import { CheckoutPromoInput } from './checkout-promo-input';

type SummaryItem = { itemId: string; quantity: number; name: string; price: number; currency: string; lineTotal: number; };

interface Props {
  restaurantName: string;
  displayItems: SummaryItem[];
  displaySavings: number;
  currency: string;
  onApplyPromo: (code: string) => void;
  promoDiscount: number;
  appliedPromoCode: string | null;
}

export function CheckoutSummaryCard({ restaurantName, displayItems, currency, onApplyPromo, promoDiscount, appliedPromoCode }: Props) {
  const { register, watch, setValue } = useForm({ defaultValues: { note: '', promoCode: '' } });
  const promoValue = watch('promoCode');

  const handleApply = () => {
    const code = promoValue.trim().toUpperCase();
    if (!code) return;
    onApplyPromo(code);
  };

  return (
    <div className="rounded-[32px] border border-[rgb(var(--border)/0.6)] bg-white px-6 py-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xl font-bold tracking-tight text-[rgb(var(--ink))]">Order summary</p>
          <p className="mt-1 text-xs font-medium text-slate-400 uppercase tracking-wider">{restaurantName}</p>
        </div>
        <ButtonLink href="/menu" variant="ghost" size="sm" className="h-8 text-[11px] font-bold uppercase tracking-widest text-[rgb(var(--brand))]">Edit</ButtonLink>
      </div>

      <div className="mt-6 space-y-5">
        {displayItems.map((item) => (
          <div key={item.itemId} className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[15px] font-bold leading-6 text-[rgb(var(--ink))]">{item.quantity} x {item.name}</p>
              <p className="mt-0.5 text-[12px] font-medium text-slate-400">Standard portion</p>
            </div>
            <div className="text-right">
              <p className="text-[15px] font-bold text-[rgb(var(--ink))]}">{formatCurrency(item.lineTotal, item.currency)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-7 rounded-2xl border border-slate-100 bg-slate-50/30 px-4 py-4">
        <input {...register('note')} placeholder="Special instructions for the kitchen?" className="w-full bg-transparent text-[13px] font-medium text-[rgb(var(--ink))] outline-none placeholder:text-slate-400" />
      </div>

      <div className="mt-5">
        <CheckoutPromoInput promoValue={promoValue} setPromoValue={(val) => setValue('promoCode', val)} promoDiscount={promoDiscount} currency={currency} appliedPromoCode={appliedPromoCode} onApplyPromo={onApplyPromo} handleApply={handleApply} />
      </div>
    </div>
  );
}
