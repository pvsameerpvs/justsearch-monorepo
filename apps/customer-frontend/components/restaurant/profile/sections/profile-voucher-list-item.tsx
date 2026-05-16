"use client";
import { CheckCircle2, Clock, Copy, Ticket } from 'lucide-react';
import { Surface } from '@/components/shared/surface';
import type { VoucherWalletEntry } from '../../checkout/reward-types';
interface ProfileVoucherListItemProps {
  voucher: VoucherWalletEntry;
  copiedCode: string | null;
  onCopy: (code: string) => void;
}
export function ProfileVoucherListItem({ voucher, copiedCode, onCopy }: ProfileVoucherListItemProps) {
  const used = voucher.isUsed;
  const isCopied = copiedCode === voucher.code;
  return (
    <Surface className={`group relative overflow-hidden rounded-[28px] border-white/60 p-6 transition-all ${used ? 'bg-slate-50/80 grayscale' : 'bg-white/80 hover:-translate-y-1 hover:bg-white hover:shadow-[0_20px_50px_rgba(15,23,42,0.1)]'}`}>
      <div className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-[rgb(var(--background))]" /><div className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-[rgb(var(--background))]" />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl ${used ? 'bg-slate-200 text-slate-400' : 'bg-[rgb(var(--brand-soft)/0.45)] text-[rgb(var(--brand))]'}`}><Ticket className="h-8 w-8" /></div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[rgb(var(--brand))]">{voucher.discountLabel}</h3>
            <p className="mt-0.5 text-lg font-bold text-[rgb(var(--ink))]">{voucher.title}</p>
            <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-[rgb(var(--muted))]"><Clock className="h-3 w-3" />{voucher.expiryLabel}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => onCopy(voucher.code)} className={`relative inline-flex min-h-12 flex-col items-start rounded-2xl border-2 border-dashed px-4 py-2.5 text-left transition-transform active:scale-[0.99] ${used ? 'border-slate-200 bg-slate-50/50' : 'border-slate-200 bg-slate-50/50 hover:border-[rgb(var(--brand)/0.45)] hover:bg-white'}`} aria-label={`Copy voucher code ${voucher.code}`}>
            {isCopied ? <span className="absolute -top-3 right-3 inline-flex h-6 items-center rounded-full bg-[rgb(var(--brand))] px-2.5 text-[10px] font-bold text-white shadow-[0_10px_20px_rgb(var(--brand)/0.18)]">Copied</span> : null}
            <div className="flex items-center gap-2"><Copy className="h-4 w-4 text-[rgb(var(--muted))]" /><p className="font-mono text-sm font-bold tracking-widest text-[rgb(var(--ink))]">{voucher.code}</p></div>
          </button>
          {used ? <CheckCircle2 className="h-6 w-6 text-slate-400" /> : null}
        </div>
      </div>
    </Surface>
  );
}
