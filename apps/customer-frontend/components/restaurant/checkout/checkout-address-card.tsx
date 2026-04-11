"use client";

import { MapPin, Clock3, ShieldCheck, Phone, Loader2, Save } from 'lucide-react';
import { useGeolocation } from '../use-geolocation';
import { cn } from '@/lib/cn';

type CheckoutAddressCardProps = {
  addressTitle: string;
  address: string;
  addressDetails: string;
  alternateNumber?: string;
  handoff: string;
  note: string;
  setAddress: (val: string) => void;
  setAddressDetails: (val: string) => void;
  setAlternateNumber?: (val: string) => void;
  setHandoff: (updater: (curr: string) => string) => void;
  setNote: (val: string) => void;
  onSwitch?: () => void;
  onSaveToProfile?: () => void;
};

export function CheckoutAddressCard({
  addressTitle,
  address,
  addressDetails,
  alternateNumber,
  handoff,
  setAddress,
  setAddressDetails,
  setAlternateNumber,
  setHandoff,
  note,
  setNote,
  onSwitch,
  onSaveToProfile,
}: CheckoutAddressCardProps) {
  const { getCurrentAddress, isLocating, error } = useGeolocation();

  const handleGetCurrentLocation = async () => {
    const addr = await getCurrentAddress();
    if (addr) {
      setAddress(addr);
    } else if (error) {
      alert(error);
    }
  };

  return (
    <div className="rounded-[32px] border border-[rgb(var(--border)/0.6)] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="border-b border-[rgb(var(--border)/0.4)] px-6 py-7">
        <div className="flex items-start gap-4">
          <button 
            type="button"
            onClick={handleGetCurrentLocation}
            disabled={isLocating}
            className={cn(
              "mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition-all active:scale-95",
              isLocating ? "bg-slate-100" : "bg-[rgb(var(--brand-soft)/0.4)] text-[rgb(var(--brand))] hover:bg-[rgb(var(--brand-soft)/0.6)]"
            )}
          >
            {isLocating ? <Loader2 className="h-5 w-5 animate-spin text-slate-400" /> : <MapPin className="h-5 w-5" />}
          </button>
          
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {addressTitle}
                </span>
                {onSwitch && (
                  <button
                    type="button"
                    onClick={onSwitch}
                    className="text-xs font-bold text-[rgb(var(--brand))] transition-colors hover:opacity-80"
                  >
                    Switch
                  </button>
                )}
              </div>
              
              {onSaveToProfile && (
                <button
                  type="button"
                  onClick={onSaveToProfile}
                  className="flex items-center gap-1.5 rounded-full bg-[rgb(var(--brand-soft)/0.3)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[rgb(var(--brand))] transition-all hover:bg-[rgb(var(--brand-soft)/0.5)] active:scale-95"
                >
                  <Save className="h-3 w-3" />
                  Save to Profile
                </button>
              )}
            </div>

            <textarea
              rows={2}
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              className="mt-3 w-full resize-none border-none bg-transparent p-0 text-[15px] font-bold leading-relaxed text-[rgb(var(--ink))] outline-none placeholder:font-normal placeholder:text-slate-300"
              placeholder="Your delivery address..."
            />

            <div className="mt-3 space-y-3">
              <input
                value={addressDetails}
                onChange={(event) => setAddressDetails(event.target.value)}
                placeholder="Flat/Office #"
                className="w-full rounded-xl bg-slate-50 px-3 py-3.5 text-[13px] font-semibold text-[rgb(var(--ink))] outline-none ring-1 ring-slate-100 focus:ring-[rgb(var(--brand)/0.2)]"
              />
              <div className="flex w-full items-center gap-2 rounded-xl bg-slate-50 px-3 py-3.5 outline-none ring-1 ring-slate-100 focus-within:ring-[rgb(var(--brand)/0.2)]">
                <Phone className="h-4 w-4 text-slate-400" />
                <input
                  value={alternateNumber || ''}
                  onChange={(event) => setAlternateNumber?.(event.target.value)}
                  placeholder="Alt. Mobile (Optional)"
                  className="w-full bg-transparent text-[13px] font-semibold text-[rgb(var(--ink))] outline-none"
                />
              </div>
            </div>
          </div>
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
