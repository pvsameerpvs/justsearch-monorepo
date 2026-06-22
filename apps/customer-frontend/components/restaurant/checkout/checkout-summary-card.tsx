"use client";
import { useForm } from 'react-hook-form';
import { ButtonLink } from '@/components/shared/button-link';
import { formatCurrency } from '@/lib/format';
import { formatDeliveryFeeLabel } from '@/lib/delivery-fee-format';
import { CheckoutPromoInput } from './checkout-promo-input';

type SummaryItem = { itemId: string; quantity: number; name: string; price: number; currency: string; lineTotal: number; };

interface Props {
  restaurantName: string;
  displayItems: SummaryItem[];
  displaySavings: number;
  currency: string;
  onApplyPromo: (code: string) => void;
  promoDiscount: number;
  promoError: string | null;
  isValidating: boolean;
  appliedPromoCode: string | null;
  subtotal: number;
  deliveryFee: number;
  total: number;
  isDeliveryEnabled: boolean;
  deliveryDistanceKm?: number;
}

export function CheckoutSummaryCard({ restaurantName, displayItems, currency, onApplyPromo, promoDiscount, promoError, isValidating, appliedPromoCode, subtotal, deliveryFee, total, isDeliveryEnabled, deliveryDistanceKm }: Props) {
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

      <div className="mt-6 space-y-2 border-t border-slate-100 pt-5">
        <div className="flex items-center justify-between text-sm font-medium text-slate-500">
          <span>Subtotal</span>
          <span className="font-bold text-[rgb(var(--ink))]">{formatCurrency(subtotal, currency)}</span>
        </div>
        {isDeliveryEnabled && (
          <div className="flex items-center justify-between text-sm font-medium text-slate-500">
            <span>Delivery{deliveryDistanceKm ? ` • ${deliveryDistanceKm.toFixed(1)} km` : ''}</span>
            <span className={`font-bold ${deliveryFee <= 0 ? 'text-emerald-600' : 'text-[rgb(var(--ink))]'}`}>{formatDeliveryFeeLabel(deliveryFee, currency)}</span>
          </div>
        )}
        {promoDiscount > 0 && (
          <div className="flex items-center justify-between text-sm font-medium text-emerald-600">
            <span>Discount</span>
            <span className="font-bold">-{formatCurrency(promoDiscount, currency)}</span>
          </div>
        )}
        <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-base font-bold text-[rgb(var(--ink))]">
          <span>Total</span>
          <span>{formatCurrency(total, currency)}</span>
        </div>
      </div>

      <div className="mt-7 rounded-2xl border border-slate-100 bg-slate-50/30 px-4 py-4">
        <input {...register('note')} placeholder="Special instructions for the kitchen?" className="w-full bg-transparent text-[13px] font-medium text-[rgb(var(--ink))] outline-none placeholder:text-slate-400" />
      </div>

      <div className="mt-5">
        <CheckoutPromoInput promoValue={promoValue} setPromoValue={(val) => setValue('promoCode', val)} promoDiscount={promoDiscount} currency={currency} appliedPromoCode={appliedPromoCode} promoError={promoError} isValidating={isValidating} onApplyPromo={onApplyPromo} handleApply={handleApply} />
      </div>
    </div>
  );
}
