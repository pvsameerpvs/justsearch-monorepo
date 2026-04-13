"use client";

import { useCallback, useState } from 'react';
import { CheckCircle2, Clock, Info, Ticket } from 'lucide-react';
import { Surface } from '@/components/shared/surface';
import { useVoucherWallet } from '../../checkout/use-voucher-wallet';

export function ProfileVoucherWallet() {
  const { wallet } = useVoucherWallet();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = useCallback(async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      window.setTimeout(() => setCopiedCode(null), 1400);
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {wallet.map((voucher) => (
          <Surface 
            key={voucher.id}
            className={`group relative overflow-hidden rounded-[28px] border-white/60 p-6 transition-all ${
              voucher.isUsed ? 'bg-slate-50/80 grayscale' : 'bg-white/80 hover:-translate-y-1 hover:bg-white hover:shadow-[0_20px_50px_rgba(15,23,42,0.1)]'
            }`}
          >
            {/* Ticket Cutout Effect */}
            <div className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-[rgb(var(--background))]" />
            <div className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-[rgb(var(--background))]" />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-[rgb(var(--brand-soft)/0.45)] text-[rgb(var(--brand))] ${voucher.isUsed ? 'bg-slate-200 text-slate-400' : ''}`}>
                  <Ticket className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[rgb(var(--brand))]">
                    {voucher.discountLabel}
                  </h3>
                  <p className="mt-0.5 text-lg font-bold text-[rgb(var(--ink))]">
                    {voucher.title}
                  </p>
                  <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-[rgb(var(--muted))]">
                    <Clock className="h-3 w-3" />
                    {voucher.expiryLabel}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-2xl border-2 border-dashed border-slate-200 px-4 py-2.5 bg-slate-50/50">
                  <p className="font-mono text-sm font-bold tracking-widest text-[rgb(var(--ink))]">
                    {voucher.code}
                  </p>
                </div>
                {voucher.isUsed ? (
                   <CheckCircle2 className="h-6 w-6 text-slate-400" />
                ) : (
                  <button
                    type="button"
                    onClick={() => handleCopy(voucher.code)}
                    className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg transition-transform hover:scale-110"
                    aria-label={`Copy ${voucher.code}`}
                  >
                    <Info className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </Surface>
        ))}
      </div>

      <div className="rounded-[28px] bg-[rgb(var(--brand-soft)/0.25)] p-6 border border-[rgb(var(--brand)/0.1)]">
        <h4 className="text-sm font-bold text-[rgb(var(--brand))]">How to redeem?</h4>
        <p className="mt-2 text-sm leading-relaxed text-[rgb(var(--muted))]">
          Copy the voucher code and paste it into the promo code section during checkout to apply your discount. Scratch rewards and welcome offers are stored here automatically.
        </p>
        {copiedCode ? (
          <p className="mt-2 text-xs font-semibold text-[rgb(var(--brand))]">
            Copied {copiedCode}
          </p>
        ) : null}
      </div>
    </div>
  );
}
