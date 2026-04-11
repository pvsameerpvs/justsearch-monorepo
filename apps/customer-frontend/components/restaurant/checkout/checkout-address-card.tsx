"use client";

import { MapPin, User, PencilLine, Clock3, ShieldCheck } from 'lucide-react';

type CheckoutAddressCardProps = {
  addressTitle: string;
  address: string;
  addressDetails: string;
  handoff: string;
  note: string;
  setAddressTitle: (val: string) => void;
  setAddress: (val: string) => void;
  setAddressDetails: (val: string) => void;
  setHandoff: (updater: (curr: string) => string) => void;
  setNote: (val: string) => void;
};

export function CheckoutAddressCard({
  addressTitle,
  address,
  addressDetails,
  handoff,
  setAddressTitle,
  setAddress,
  setAddressDetails,
  setHandoff,
}: CheckoutAddressCardProps) {
  return (
    <div className="rounded-[28px] border border-[rgb(var(--border)/0.8)] bg-white shadow-[0_18px_48px_rgba(15,23,42,0.08)]">
      <div className="flex items-start gap-3 border-b border-[rgb(var(--border)/0.6)] px-5 py-4">
        <MapPin className="mt-1 h-5 w-5 text-[rgb(var(--brand))]" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-[rgb(var(--card-surface-muted)/0.9)] px-2 py-1 text-xs font-bold text-[rgb(var(--muted))]">
              {addressTitle}
            </span>
            <button
              type="button"
              onClick={() => setAddressTitle(addressTitle === 'Work' ? 'Home' : 'Work')}
              className="text-xs font-semibold text-[rgb(var(--brand))]"
            >
              Switch
            </button>
          </div>
          <input
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            className="mt-2 w-full bg-transparent text-[1.15rem] font-semibold leading-7 text-[rgb(var(--ink))] outline-none"
          />
          <input
            value={addressDetails}
            onChange={(event) => setAddressDetails(event.target.value)}
            className="mt-1 w-full bg-transparent text-sm text-[rgb(var(--muted))] outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 border-b border-[rgb(var(--border)/0.6)] px-5 py-4">
        <User className="h-5 w-5 text-[rgb(var(--brand))]" />
        <button
          type="button"
          onClick={() =>
            setHandoff((current) =>
              current === 'Hand it to me' ? 'Leave at reception' : 'Hand it to me',
            )
          }
          className="flex flex-1 items-center justify-between text-left"
        >
          <span className="text-xl font-semibold text-[rgb(var(--ink))]">{handoff}</span>
          <PencilLine className="h-5 w-5 text-[rgb(var(--muted))]" />
        </button>
      </div>

      <div className="px-5 py-4">
        <div className="flex items-center gap-3 text-[1.05rem] font-semibold text-[rgb(var(--ink))]">
          <Clock3 className="h-5 w-5 text-[rgb(var(--brand))]" />
          Est. arrival 16:05-16:15
        </div>

        <div className="mt-4 rounded-[20px] bg-[rgba(16,185,129,0.12)] px-4 py-3">
          <div className="flex items-center gap-2 text-base font-bold text-[rgb(5,150,105)]">
            <ShieldCheck className="h-5 w-5" />
            On-time Promise
          </div>
          <p className="mt-2 text-sm leading-6 text-[rgb(6,95,70)]">
            If your order arrives late, the customer can receive a small voucher in the real flow.
          </p>
        </div>
      </div>
    </div>
  );
}
