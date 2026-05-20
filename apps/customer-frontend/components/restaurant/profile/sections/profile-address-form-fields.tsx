"use client";
import { MapPin, Loader2 } from 'lucide-react';
import { type SavedAddress } from '../../use-address-book';
type ProfileAddressFormFieldsProps = {
  value: Omit<SavedAddress, 'id'>;
  onChange: (value: Omit<SavedAddress, 'id'>) => void;
  onGetCurrentLocation: () => void;
  isLocating: boolean;
};
export function ProfileAddressFormFields({ value, onChange, onGetCurrentLocation, isLocating }: ProfileAddressFormFieldsProps) {
  return (
    <>
      <div>
        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Label</label>
        <div className="mt-2 flex gap-2">
          {(['Home', 'Work', 'Hotel', 'Other'] as const).map(l => (
            <button key={l} type="button" onClick={() => onChange({ ...value, label: l })} className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${value.label === l ? "bg-[rgb(var(--brand))] border-[rgb(var(--brand))] text-white" : "border-slate-100 text-slate-400"}`}>
              {l}
            </button>
          ))}
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Address Line</label>
          <button type="button" onClick={onGetCurrentLocation} disabled={isLocating} className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[rgb(var(--brand))] hover:opacity-80 transition-opacity disabled:opacity-50">
            {isLocating ? <Loader2 className="h-3 w-3 animate-spin" /> : <MapPin className="h-3 w-3" />}
            {isLocating ? 'Locating...' : 'Use Current Location'}
          </button>
        </div>
        <textarea value={value.address} onChange={(e) => onChange({ ...value, address: e.target.value })} placeholder="Area, Street, Building..." className="mt-2 w-full border-none bg-slate-50 p-4 text-sm font-semibold outline-none ring-1 ring-slate-100 focus:ring-[rgb(var(--brand)/0.3)] min-h-[80px] rounded-2xl" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Details</label>
          <input value={value.details} onChange={(e) => onChange({ ...value, details: e.target.value })} placeholder="Flat/Office #" className="mt-2 w-full rounded-2xl bg-slate-50 p-4 text-sm font-semibold outline-none ring-1 ring-slate-100 focus:ring-[rgb(var(--brand)/0.3)]" />
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Alt. Mobile</label>
          <input value={value.alternateNumber} onChange={(e) => onChange({ ...value, alternateNumber: e.target.value })} placeholder="Optional" className="mt-2 w-full rounded-2xl bg-slate-50 p-4 text-sm font-semibold outline-none ring-1 ring-slate-100 focus:ring-[rgb(var(--brand)/0.3)]" />
        </div>
      </div>
    </>
  );
}
