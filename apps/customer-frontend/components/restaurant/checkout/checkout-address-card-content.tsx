"use client";

import { Phone, Clock3, ShieldCheck } from 'lucide-react';
import type { CheckoutAddressCardProps } from './checkout-address-card';
import { CheckoutAddressCardBadge } from './checkout-address-card-badge';
import { CheckoutAddressCardInfo } from './checkout-address-card-info';
import { CheckoutAddressCardActions } from './checkout-address-card-actions';

export function CheckoutAddressCardContent({
  addressTitle, address, addressDetails, userPhone, alternateNumber, savedAddressesCount = 0,
  note, setAlternateNumber, setNote, onOpenAddressBook,
}: CheckoutAddressCardProps) {
  return (
    <>
      <div className="border-b border-[rgb(var(--border)/0.4)] px-6 py-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Delivery Address</p><p className="mt-1 text-[12px] text-[rgb(var(--muted))]">Choose from your saved profile addresses</p></div>
          <CheckoutAddressCardBadge count={savedAddressesCount} />
        </div>
        <CheckoutAddressCardActions onOpenAddressBook={onOpenAddressBook}>
          <CheckoutAddressCardInfo addressTitle={addressTitle} address={address} addressDetails={addressDetails} alternateNumber={alternateNumber} />
        </CheckoutAddressCardActions>
      </div>
      <div className="border-b border-[rgb(var(--border)/0.4)] px-6 py-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Contact Number</p>
        {userPhone && (
          <div className="mt-3 flex items-center gap-2 rounded-[18px] border border-[rgb(var(--brand)/0.35)] bg-[rgb(var(--brand-soft)/0.12)] px-4 py-3">
            <Phone className="h-4 w-4 text-[rgb(var(--brand))]" />
            <span className="text-sm font-bold text-[rgb(var(--brand))]">{userPhone}</span>
            <span className="ml-1 text-[10px] font-bold uppercase tracking-wider text-[rgb(var(--brand)/0.6)]">Primary</span>
          </div>
        )}
        <div className="mt-3 flex items-center gap-2 rounded-[18px] border border-[rgb(var(--border)/0.72)] bg-[rgb(var(--card-surface-muted)/0.6)] px-4 py-3">
          <Phone className="h-4 w-4 text-slate-400" />
          <input value={alternateNumber ?? ''} onChange={(e) => setAlternateNumber?.(e.target.value)} placeholder="Alternate number (optional)" className="w-full bg-transparent text-sm font-medium text-[rgb(var(--ink))] outline-none placeholder:text-slate-400" />
        </div>
      </div>
      <div className="border-b border-[rgb(var(--border)/0.4)] px-6 py-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Note for the rider</p>
        <div className="mt-3 rounded-2xl border border-slate-100 bg-slate-50/30 px-4 py-4">
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Gate code, building entry, etc." className="w-full bg-transparent text-[13px] font-medium text-[rgb(var(--ink))] outline-none placeholder:text-slate-400" />
        </div>
      </div>
      <div className="px-6 py-6">
        <div className="flex items-center gap-3 text-sm font-semibold text-[rgb(var(--ink))]"><Clock3 className="h-5 w-5 text-[rgb(var(--brand))]" />Est. arrival 16:05-16:15</div>
        <div className="mt-5 rounded-[24px] bg-[rgb(var(--brand-soft)/0.15)] px-5 py-4">
          <div className="flex items-center gap-2 text-sm font-bold text-[rgb(var(--brand))]"><ShieldCheck className="h-5 w-5" />On-time Promise</div>
          <p className="mt-2 text-[13px] leading-relaxed text-[rgb(var(--brand)/0.7)]">If your order arrives late, we&apos;ll provide a small gift voucher for your next order.</p>
        </div>
      </div>
    </>
  );
}
