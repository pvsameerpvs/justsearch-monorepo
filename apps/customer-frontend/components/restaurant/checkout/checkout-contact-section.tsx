"use client";

import { Phone } from 'lucide-react';

interface CheckoutContactSectionProps {
  userPhone?: string;
  alternateNumber?: string;
  onAlternateChange?: (val: string) => void;
}

export function CheckoutContactSection({ userPhone, alternateNumber, onAlternateChange }: CheckoutContactSectionProps) {
  return (
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
        <input value={alternateNumber ?? ''} onChange={(e) => onAlternateChange?.(e.target.value)} placeholder="Alternate number (optional)" className="w-full bg-transparent text-sm font-medium text-[rgb(var(--ink))] outline-none placeholder:text-slate-400" />
      </div>
    </div>
  );
}
