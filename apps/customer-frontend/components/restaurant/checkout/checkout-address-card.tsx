"use client";

import Link from 'next/link';
import { ChevronRight, Clock3, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/cn';

type CheckoutAddressCardProps = {
  addressTitle: string;
  address: string;
  addressDetails: string;
  alternateNumber?: string;
  savedAddressesCount?: number;
  handoff: string;
  note: string;
  setAlternateNumber?: (val: string) => void;
  setHandoff: (updater: (curr: string) => string) => void;
  setNote: (val: string) => void;
  onOpenAddressBook?: () => void;
};

export function CheckoutAddressCard({
  addressTitle,
  address,
  addressDetails,
  alternateNumber,
  savedAddressesCount = 0,
  handoff,
  setHandoff,
  note,
  setAlternateNumber,
  setNote,
  onOpenAddressBook,
}: CheckoutAddressCardProps) {
  return (
    <div className="rounded-[32px] border border-[rgb(var(--border)/0.6)] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="border-b border-[rgb(var(--border)/0.4)] px-6 py-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Delivery Address
            </p>
            <p className="mt-1 text-[12px] text-[rgb(var(--muted))]">
              Choose from your saved profile addresses
            </p>
          </div>
          <span className="rounded-full bg-[rgb(var(--brand-soft)/0.3)] px-3 py-1 text-[11px] font-semibold text-[rgb(var(--brand))]">
            {savedAddressesCount} saved
          </span>
        </div>

        <button
          type="button"
          onClick={onOpenAddressBook}
          className="flex w-full items-start gap-4 rounded-[24px] border border-[rgb(var(--border)/0.66)] bg-[rgb(var(--card-surface-muted)/0.72)] px-4 py-4 text-left transition-colors hover:bg-[rgb(var(--brand-soft)/0.16)]"
        >
          <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[rgb(var(--brand-soft)/0.4)] text-[rgb(var(--brand))]">
            <MapPin className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
              Select delivery address
            </p>
            <p className="mt-1 text-sm font-semibold text-[rgb(var(--ink))]">
              {addressTitle}
            </p>
            <p className="mt-1 text-sm leading-5 text-[rgb(var(--muted))]">
              {address || 'Choose a saved address from your profile'}
            </p>
            {addressDetails ? (
              <p className="mt-2 text-[12px] text-[rgb(var(--muted))]">
                {addressDetails}
              </p>
            ) : null}
            {alternateNumber ? (
              <p className="mt-1 inline-flex items-center gap-1.5 text-[12px] font-medium text-[rgb(var(--muted))]">
                <Phone className="h-3.5 w-3.5" />
                {alternateNumber}
              </p>
            ) : null}
          </div>

          <ChevronRight className="mt-2 h-5 w-5 shrink-0 text-[rgb(var(--muted))]" />
        </button>

        <div className="mt-4 flex justify-end">
          <Link
            href="/profile/addresses"
            className="text-[12px] font-semibold text-[rgb(var(--brand))] transition-opacity hover:opacity-80"
          >
            Manage addresses
          </Link>
        </div>
      </div>

      <div className="border-b border-[rgb(var(--border)/0.4)] px-6 py-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
          Contact Number
        </p>
        <div className="mt-3 flex items-center gap-2 rounded-[18px] border border-[rgb(var(--border)/0.72)] bg-[rgb(var(--card-surface-muted)/0.6)] px-4 py-3">
          <Phone className="h-4 w-4 text-slate-400" />
          <input
            value={alternateNumber ?? ''}
            onChange={(event) => setAlternateNumber?.(event.target.value)}
            placeholder="Alt. number for this order (optional)"
            className="w-full bg-transparent text-sm font-medium text-[rgb(var(--ink))] outline-none placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Handoff Method Selection */}
      <div className="border-b border-[rgb(var(--border)/0.4)] px-6 py-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
          Delivery Method
        </p>
        <div className="mt-4 flex gap-2">
          {['Hand it to me', 'Leave at door', 'Reception'].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setHandoff(() => option)}
              className={cn(
                "flex-1 rounded-2xl border px-2 py-4 text-[12px] font-bold transition-all",
                handoff === option 
                  ? "border-[rgb(var(--brand))] bg-[rgb(var(--brand-soft)/0.2)] text-[rgb(var(--brand))]" 
                  : "border-slate-100 bg-white text-slate-400 hover:border-slate-200"
              )}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50/30 px-4 py-4">
          <input
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Note for the rider? (Gate code, etc.)"
            className="w-full bg-transparent text-[13px] font-medium text-[rgb(var(--ink))] outline-none placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="flex items-center gap-3 text-sm font-semibold text-[rgb(var(--ink))]">
          <Clock3 className="h-5 w-5 text-[rgb(var(--brand))]" />
          Est. arrival 16:05-16:15
        </div>

        <div className="mt-5 rounded-[24px] bg-[rgb(var(--brand-soft)/0.15)] px-5 py-4">
          <div className="flex items-center gap-2 text-sm font-bold text-[rgb(var(--brand))]">
            <ShieldCheck className="h-5 w-5" />
            On-time Promise
          </div>
          <p className="mt-2 text-[13px] leading-relaxed text-[rgb(var(--brand)/0.7)]">
            If your order arrives late, we'll provide a small gift voucher for your next order.
          </p>
        </div>
      </div>
    </div>
  );
}
