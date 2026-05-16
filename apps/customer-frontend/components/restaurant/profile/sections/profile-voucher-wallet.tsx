"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import { useVoucherWallet } from '../../checkout/use-voucher-wallet';
import { ProfileVoucherApplyInput } from './profile-voucher-apply-input';
import { ProfileVoucherListItem } from './profile-voucher-list-item';

export function ProfileVoucherWallet() {
  const { wallet, findVoucherByCode } = useVoucherWallet();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [applyMessage, setApplyMessage] = useState<string | null>(null);
  const copyTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) window.clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  const handleCopy = useCallback(async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      if (copyTimeoutRef.current) window.clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = window.setTimeout(() => { setCopiedCode(null); copyTimeoutRef.current = null; }, 1400);
    } catch { /* ignore */ }
  }, []);

  const handleApply = useCallback((code: string) => {
    const normalized = code.trim().toUpperCase();
    const found = findVoucherByCode(normalized);
    setApplyMessage(found ? 'Voucher found in wallet' : 'Voucher not found');
  }, [findVoucherByCode]);

  return (
    <div className="space-y-6">
      <ProfileVoucherApplyInput onApply={handleApply} />
      {applyMessage && <p className={`px-1 text-[11px] font-bold ${applyMessage.includes('found') && !applyMessage.includes('not') ? 'text-emerald-600' : 'text-red-500'}`}>{applyMessage}</p>}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {wallet.map((voucher) => (
          <ProfileVoucherListItem key={voucher.id} voucher={voucher} copiedCode={copiedCode} onCopy={handleCopy} />
        ))}
      </div>
      <div className="rounded-[28px] bg-[rgb(var(--brand-soft)/0.25)] p-6 border border-[rgb(var(--brand)/0.1)]">
        <h4 className="text-sm font-bold text-[rgb(var(--brand))]">How to redeem?</h4>
        <p className="mt-2 text-sm leading-relaxed text-[rgb(var(--muted))]">
          Copy the voucher code and paste it into the promo code section during checkout to apply your discount. Scratch rewards and welcome offers are stored here automatically.
        </p>
      </div>
    </div>
  );
}
