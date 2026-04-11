"use client";

import { Home, Briefcase, MapPin, Trash2, Phone } from 'lucide-react';
import { Surface } from '@/components/shared/surface';
import { type SavedAddress } from '../../use-address-book';

type ProfileAddressCardProps = {
  address: SavedAddress;
  onRemove: (id: string) => void;
};

export function ProfileAddressCard({ address, onRemove }: ProfileAddressCardProps) {
  return (
    <Surface 
      className="group relative flex flex-col justify-between rounded-[28px] border-white/60 bg-white/80 p-6 shadow-sm transition-all hover:-translate-y-1 hover:bg-white hover:shadow-[0_18px_48px_rgba(15,23,42,0.08)]"
    >
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgb(var(--brand-soft)/0.45)] text-[rgb(var(--brand))]">
            {address.label === 'Home' ? <Home className="h-6 w-6" /> : 
             address.label === 'Work' ? <Briefcase className="h-6 w-6" /> : 
             <MapPin className="h-6 w-6" />}
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            {address.label}
          </span>
        </div>
        <p className="text-sm font-semibold leading-relaxed text-[rgb(var(--ink))]">
          {address.address}
        </p>
        <p className="mt-2 text-xs font-medium text-[rgb(var(--muted))]">
          {address.details}
        </p>
        {address.alternateNumber && (
          <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-[rgb(var(--brand))]">
             <Phone className="h-3 w-3" />
             Alt: {address.alternateNumber}
          </p>
        )}
      </div>

      <div className="mt-6 flex items-center justify-end border-t border-slate-100 pt-4">
        <button
          onClick={() => onRemove(address.id)}
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-red-500 transition-colors hover:bg-red-50"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Remove
        </button>
      </div>
    </Surface>
  );
}
