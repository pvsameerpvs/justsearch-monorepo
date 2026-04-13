"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import { CheckCircle2, Clock, Copy, Ticket } from 'lucide-react';
import { Surface } from '@/components/shared/surface';
import { useVoucherWallet } from '../../checkout/use-voucher-wallet';

export function ProfileVoucherWallet() {
  const { wallet } = useVoucherWallet();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const copyTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        window.clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const handleCopy = useCallback(async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      if (copyTimeoutRef.current) {
        window.clearTimeout(copyTimeoutRef.current);
      }
      copyTimeoutRef.current = window.setTimeout(() => {
        setCopiedCode(null);
        copyTimeoutRef.current = null;
      }, 1400);
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
                <button
                  type="button"
                  onClick={() => handleCopy(voucher.code)}
                  className={`relative inline-flex min-h-12 flex-col items-start rounded-2xl border-2 border-dashed px-4 py-2.5 text-left transition-transform active:scale-[0.99] ${
                    voucher.isUsed
                      ? 'border-slate-200 bg-slate-50/50'
                      : 'border-slate-200 bg-slate-50/50 hover:border-[rgb(var(--brand)/0.45)] hover:bg-white'
                  }`}
                  aria-label={`Copy voucher code ${voucher.code}`}
                >
                  {copiedCode === voucher.code ? (
                    <span className="absolute -top-3 right-3 inline-flex h-6 items-center rounded-full bg-[rgb(var(--brand))] px-2.5 text-[10px] font-bold text-white shadow-[0_10px_20px_rgb(var(--brand)/0.18)]">
                      Copied
                    </span>
                  ) : null}

                  <div className="flex items-center gap-2">
                    <Copy className="h-4 w-4 text-[rgb(var(--muted))]" />
                    <p className="font-mono text-sm font-bold tracking-widest text-[rgb(var(--ink))]">
                      {voucher.code}
                    </p>
                  </div>
                </button>
                {voucher.isUsed ? (
                  <CheckCircle2 className="h-6 w-6 text-slate-400" />
                ) : null}
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
      </div>
    </div>
  );
}
