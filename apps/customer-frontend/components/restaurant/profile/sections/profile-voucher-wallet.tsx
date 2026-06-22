"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import { useVoucherWallet } from '../../checkout/use-voucher-wallet';
import { useMyScratchRewardsQuery } from '../../checkout/use-scratch-rewards';
import { useActivePromos } from '../../checkout/use-active-promos';
import { useRestaurant } from '@/components/restaurant/restaurant-context';
import { ProfileVoucherApplyInput } from './profile-voucher-apply-input';
import { ProfileVoucherListItem } from './profile-voucher-list-item';

export function ProfileVoucherWallet() {
  const { wallet, findVoucherByCode } = useVoucherWallet();
  const restaurant = useRestaurant();
  const { data: rewardsData } = useMyScratchRewardsQuery();
  const { data: activePromos = [] } = useActivePromos();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [applyMessage, setApplyMessage] = useState<string | null>(null);
  const copyTimeoutRef = useRef<number | null>(null);

  const myRewards = rewardsData?.rewards ?? [];

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

  const activeVouchers = wallet.filter((v) => !v.isUsed);
  const usedVouchers = wallet.filter((v) => v.isUsed);

  return (
    <div className="space-y-6">
      <ProfileVoucherApplyInput onApply={handleApply} />
      {applyMessage && <p className={`px-1 text-[11px] font-bold ${applyMessage.includes('found') && !applyMessage.includes('not') ? 'text-emerald-600' : 'text-red-500'}`}>{applyMessage}</p>}

      {/* Active Vouchers */}
      {activeVouchers.length > 0 && (
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[rgb(var(--brand))] mb-3">
            Active ({activeVouchers.length})
          </h3>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {activeVouchers.map((voucher) => (
              <ProfileVoucherListItem key={voucher.id} voucher={voucher} copiedCode={copiedCode} onCopy={handleCopy} />
            ))}
          </div>
        </div>
      )}

      {/* Used Vouchers */}
      {usedVouchers.length > 0 && (
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[rgb(var(--muted))] mb-3">
            Used ({usedVouchers.length})
          </h3>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {usedVouchers.map((voucher) => (
              <ProfileVoucherListItem key={voucher.id} voucher={voucher} copiedCode={copiedCode} onCopy={handleCopy} />
            ))}
          </div>
        </div>
      )}

      {/* Scratch Rewards from Backend */}
      {myRewards.length > 0 && (
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[rgb(var(--brand))] mb-3">
            Scratch Rewards from {restaurant.name}
          </h3>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {myRewards.map((reward) => (
              <div key={reward.id} className={`rounded-[28px] border p-6 ${reward.isUsed ? 'bg-slate-50/80 border-slate-200 grayscale' : 'bg-white/80 border-white/60'}`}>
                <div className="flex items-center gap-3">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${reward.isUsed ? 'bg-slate-200 text-slate-400' : 'bg-[rgb(var(--brand-soft)/0.45)] text-[rgb(var(--brand))]'}`}>
                    <span className="text-lg">🎁</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[rgb(var(--ink))]">{reward.voucherCode}</p>
                    <p className="text-xs text-[rgb(var(--muted))]">
                      {reward.trigger === 'welcome' ? 'Welcome Offer' : reward.trigger === 'order' ? 'Post-Order Offer' : 'Auto-Reward'}
                      {reward.isUsed ? ' — Used' : ' — Active'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Promos from Restaurant */}
      {activePromos.length > 0 && (
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-3">
            Available offers from {restaurant.name}
          </h3>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {activePromos.map((promo) => {
              const discountLabel = promo.type === 'percentage' ? `${promo.value}% OFF` : `AED ${promo.value} OFF`;
              return (
                <div key={promo.id} className="rounded-[28px] border border-amber-100 bg-amber-50/40 p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                      <span className="text-lg">🏷️</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[rgb(var(--ink))]">{promo.code}</p>
                      <p className="text-xs font-semibold text-amber-600">{discountLabel}</p>
                      {promo.title && <p className="text-[10px] text-[rgb(var(--muted))] mt-0.5">{promo.title}</p>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {wallet.length === 0 && myRewards.length === 0 && activePromos.length === 0 && (
        <div className="rounded-[28px] bg-[rgb(var(--brand-soft)/0.25)] p-8 text-center border border-[rgb(var(--brand)/0.1)]">
          <p className="font-display text-lg font-semibold text-[rgb(var(--ink))]">No vouchers yet</p>
          <p className="mt-2 text-sm text-[rgb(var(--muted))]">
            Visit a restaurant and scratch to claim your first reward!
          </p>
        </div>
      )}

      <div className="rounded-[28px] bg-[rgb(var(--brand-soft)/0.25)] p-6 border border-[rgb(var(--brand)/0.1)]">
        <h4 className="text-sm font-bold text-[rgb(var(--brand))]">How to redeem?</h4>
        <p className="mt-2 text-sm leading-relaxed text-[rgb(var(--muted))]">
          Copy the voucher code and paste it into the promo code section during checkout to apply your discount. Scratch rewards and welcome offers are stored here automatically.
        </p>
      </div>
    </div>
  );
}
