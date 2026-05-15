"use client";

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { ButtonLink } from '@/components/shared/button-link';
import { formatCurrency } from '@/lib/format';
import { useVoucherWallet } from './use-voucher-wallet';

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
  onApplyPromo: (code: string) => void;
  promoDiscount: number;
  appliedPromoCode: string | null;
};

export function CheckoutSummaryCard({
  restaurantName,
  displayItems,
  currency,
  onApplyPromo,
  promoDiscount,
  appliedPromoCode,
}: CheckoutSummaryCardProps) {
  const { activeVouchers, wallet, findVoucherByCode } = useVoucherWallet();

  const { register, watch, setValue } = useForm({
    defaultValues: { note: '', promoCode: '' },
  });

  const promoValue = watch('promoCode');
  const isPromoApplied = !!appliedPromoCode;
  const appliedVoucher = appliedPromoCode ? findVoucherByCode(appliedPromoCode) : null;

  const handleApply = () => {
    const code = promoValue.trim().toUpperCase();
    if (!code) return;
    const voucher = findVoucherByCode(code);
    if (!voucher || voucher.isUsed) return;
    onApplyPromo(code);
  };

  const promoError = promoValue && !appliedPromoCode && findVoucherByCode(promoValue.trim().toUpperCase())?.isUsed
    ? 'This voucher has already been used'
    : promoValue && !appliedPromoCode && !findVoucherByCode(promoValue.trim().toUpperCase())
    ? 'Voucher not found'
    : null;

  const availableVouchers = useMemo(
    () => activeVouchers.slice(0, 3),
    [activeVouchers],
  );

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
        <input
          {...register('note')}
          placeholder="Special instructions for the kitchen?"
          className="w-full bg-transparent text-[13px] font-medium text-[rgb(var(--ink))] outline-none placeholder:text-slate-400"
        />
      </div>

      <div className="mt-5 space-y-2">
        <div className="flex items-center gap-3 overflow-hidden rounded-2xl border border-slate-100 bg-white px-2 py-2">
          <input
            {...register('promoCode')}
            placeholder="Promo code?"
            className="flex-1 px-3 bg-transparent text-[13px] font-bold uppercase tracking-widest text-[rgb(var(--brand))] placeholder:font-normal placeholder:lowercase placeholder:tracking-normal outline-none"
          />
          <button
            type="button"
            onClick={handleApply}
            disabled={isPromoApplied || !promoValue}
            className="rounded-xl bg-slate-900 px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest text-white transition-all active:scale-95 disabled:opacity-40"
          >
            Apply
          </button>
        </div>
        {promoError && (
          <p className="px-1 text-[11px] text-red-500">{promoError}</p>
        )}
        {isPromoApplied && appliedVoucher && (
          <div className="flex items-center justify-between rounded-xl bg-emerald-50 px-3 py-2">
            <p className="text-[12px] font-bold text-emerald-700">{appliedVoucher.discountLabel} off applied!</p>
            <button
              type="button"
              onClick={() => onApplyPromo('')}
              className="text-[11px] font-bold text-emerald-600 underline"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      {availableVouchers.length > 0 && !isPromoApplied && (
        <div className="mt-3 rounded-xl bg-slate-50 px-3 py-2.5">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Available vouchers</p>
            <Link href="/profile/vouchers" className="text-[10px] font-bold text-[rgb(var(--brand))] underline">
              View all
            </Link>
          </div>
          <div className="space-y-1">
            {availableVouchers.map((v) => (
              <div key={v.id} className="flex items-center justify-between">
                <p className="text-[11px] font-semibold text-slate-700">
                  {v.code} — {v.discountLabel} {v.title && `(${v.title})`}
                </p>
                <button
                  type="button"
                  onClick={() => { setValue('promoCode', v.code); handleApply(); }}
                  className="text-[10px] font-bold text-[rgb(var(--brand))] underline"
                >
                  Apply
                </button>
              </div>
            ))}
          </div>
          {wallet.filter((v) => v.isUsed).length > 0 && (
            <details className="mt-2">
              <summary className="text-[10px] font-bold text-slate-400 cursor-pointer">Used vouchers</summary>
              <div className="mt-1 space-y-0.5">
                {wallet.filter((v) => v.isUsed).map((v) => (
                  <p key={v.id} className="text-[10px] text-slate-400 line-through">{v.code} — {v.discountLabel}</p>
                ))}
              </div>
            </details>
          )}
        </div>
      )}

      {promoDiscount > 0 && (
        <div className="mt-5 rounded-2xl bg-amber-50 px-4 py-4 text-[12px] font-bold text-amber-900/80 leading-relaxed">
          You've got the best deal. {formatCurrency(promoDiscount, currency)} discount applied!
        </div>
      )}
    </div>
  );
}
