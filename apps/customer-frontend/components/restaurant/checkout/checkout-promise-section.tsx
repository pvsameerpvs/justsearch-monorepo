"use client";

import { Clock3, ShieldCheck } from 'lucide-react';

export function CheckoutPromiseSection() {
  return (
    <div className="px-6 py-6">
      <div className="flex items-center gap-3 text-sm font-semibold text-[rgb(var(--ink))]"><Clock3 className="h-5 w-5 text-[rgb(var(--brand))]" />Est. arrival 16:05-16:15</div>
      <div className="mt-5 rounded-[24px] bg-[rgb(var(--brand-soft)/0.15)] px-5 py-4">
        <div className="flex items-center gap-2 text-sm font-bold text-[rgb(var(--brand))]"><ShieldCheck className="h-5 w-5" />On-time Promise</div>
        <p className="mt-2 text-[13px] leading-relaxed text-[rgb(var(--brand)/0.7)]">If your order arrives late, we&apos;ll provide a small gift voucher for your next order.</p>
      </div>
    </div>
  );
}
