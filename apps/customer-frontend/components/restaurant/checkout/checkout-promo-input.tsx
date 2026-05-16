"use client";
import { useMemo } from 'react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/format';
import { useVoucherWallet } from './use-voucher-wallet';

interface PromoInputProps {
  promoValue: string;
  setPromoValue: (val: string) => void;
  promoDiscount: number;
  currency: string;
  appliedPromoCode: string | null;
  onApplyPromo: (code: string) => void;
  handleApply: () => void;
}

export function CheckoutPromoInput({ promoValue, setPromoValue, promoDiscount, currency, appliedPromoCode, onApplyPromo, handleApply }: PromoInputProps) {
  const { activeVouchers, wallet, findVoucherByCode } = useVoucherWallet();
  const isPromoApplied = !!appliedPromoCode;
  const appliedVoucher = appliedPromoCode ? findVoucherByCode(appliedPromoCode) : null;
  const availableVouchers = useMemo(() => activeVouchers.slice(0, 3), [activeVouchers]);

  const promoError = promoValue && !appliedPromoCode && findVoucherByCode(promoValue.trim().toUpperCase())?.isUsed
    ? 'This voucher has already been used'
    : promoValue && !appliedPromoCode && !findVoucherByCode(promoValue.trim().toUpperCase())
    ? 'Voucher not found'
    : null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3 overflow-hidden rounded-2xl border border-slate-100 bg-white px-2 py-2">
        <input value={promoValue} onChange={(e) => setPromoValue(e.target.value)} placeholder="Promo code?" className="flex-1 px-3 bg-transparent text-[13px] font-bold uppercase tracking-widest text-[rgb(var(--brand))] placeholder:font-normal placeholder:lowercase placeholder:tracking-normal outline-none" />
        <button type="button" onClick={handleApply} disabled={isPromoApplied || !promoValue} className="rounded-xl bg-slate-900 px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest text-white transition-all active:scale-95 disabled:opacity-40">Apply</button>
      </div>
      {promoError && <p className="px-1 text-[11px] text-red-500">{promoError}</p>}
      {isPromoApplied && appliedVoucher && (
        <div className="flex items-center justify-between rounded-xl bg-emerald-50 px-3 py-2">
          <p className="text-[12px] font-bold text-emerald-700">{appliedVoucher.discountLabel} off applied!</p>
          <button type="button" onClick={() => onApplyPromo('')} className="text-[11px] font-bold text-emerald-600 underline">Remove</button>
        </div>
      )}
      {promoDiscount > 0 && (
        <div className="rounded-2xl bg-amber-50 px-4 py-4 text-[12px] font-bold text-amber-900/80 leading-relaxed">
          You've got the best deal. {formatCurrency(promoDiscount, currency)} discount applied!
        </div>
      )}
      {availableVouchers.length > 0 && !isPromoApplied && (
        <div className="rounded-xl bg-slate-50 px-3 py-2.5">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Available vouchers</p>
            <Link href="/profile/vouchers" className="text-[10px] font-bold text-[rgb(var(--brand))] underline">View all</Link>
          </div>
          <div className="space-y-1">
            {availableVouchers.map((v) => (
              <div key={v.id} className="flex items-center justify-between">
                <p className="text-[11px] font-semibold text-slate-700">{v.code} — {v.discountLabel} {v.title ? `(${v.title})` : ''}</p>
                <button type="button" onClick={() => setPromoValue(v.code)} className="text-[10px] font-bold text-[rgb(var(--brand))] underline">Apply</button>
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
    </div>
  );
}
