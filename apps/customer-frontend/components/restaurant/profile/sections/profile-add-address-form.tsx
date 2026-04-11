"use client";

import { useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { Surface } from '@/components/shared/surface';
import { cn } from '@/lib/cn';
import { useGeolocation } from '../../use-geolocation';
import { type SavedAddress } from '../../use-address-book';

type ProfileAddAddressFormProps = {
  onSave: (address: Omit<SavedAddress, 'id'>) => void;
  onCancel: () => void;
};

export function ProfileAddAddressForm({ onSave, onCancel }: ProfileAddAddressFormProps) {
  const { getCurrentAddress, isLocating, error } = useGeolocation();
  const [newAddr, setNewAddr] = useState<Omit<SavedAddress, 'id'>>({
    label: 'Home',
    address: '',
    details: '',
    alternateNumber: '',
  });

  const handleGetCurrentLocation = async () => {
    const addr = await getCurrentAddress();
    if (addr) {
      setNewAddr(prev => ({ ...prev, address: addr }));
    } else if (error) {
      alert(error);
    }
  };

  const handleSave = () => {
    if (!newAddr.address) return;
    onSave(newAddr);
  };

  return (
    <Surface className="rounded-[28px] border-[rgb(var(--brand)/0.2)] bg-white p-6 shadow-xl ring-2 ring-[rgb(var(--brand)/0.1)]">
       <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Label</label>
            <div className="mt-2 flex gap-2">
              {(['Home', 'Work', 'Other'] as const).map(l => (
                <button 
                  key={l}
                  type="button"
                  onClick={() => setNewAddr({...newAddr, label: l})}
                  className={cn(
                    "flex-1 py-2 rounded-xl text-xs font-bold border transition-all",
                    newAddr.label === l ? "bg-[rgb(var(--brand))] border-[rgb(var(--brand))] text-white" : "border-slate-100 text-slate-400"
                  )}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Address Line</label>
              <button 
                type="button"
                onClick={handleGetCurrentLocation}
                disabled={isLocating}
                className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[rgb(var(--brand))] hover:opacity-80 transition-opacity disabled:opacity-50"
              >
                {isLocating ? <Loader2 className="h-3 w-3 animate-spin" /> : <MapPin className="h-3 w-3" />}
                {isLocating ? 'Locating...' : 'Use Current Location'}
              </button>
            </div>
            <textarea 
              value={newAddr.address}
              onChange={(e) => setNewAddr({...newAddr, address: e.target.value})}
              placeholder="Area, Street, Building..."
              className="mt-2 w-full border-none bg-slate-50 p-4 text-sm font-semibold outline-none ring-1 ring-slate-100 focus:ring-[rgb(var(--brand)/0.3)] min-h-[80px] rounded-2xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
             <div>
               <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Details</label>
               <input 
                 value={newAddr.details}
                 onChange={(e) => setNewAddr({...newAddr, details: e.target.value})}
                 placeholder="Flat/Office #"
                 className="mt-2 w-full rounded-2xl bg-slate-50 p-4 text-sm font-semibold outline-none ring-1 ring-slate-100 focus:ring-[rgb(var(--brand)/0.3)]"
               />
             </div>
             <div>
               <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Alt. Mobile</label>
               <input 
                 value={newAddr.alternateNumber}
                 onChange={(e) => setNewAddr({...newAddr, alternateNumber: e.target.value})}
                 placeholder="Optional"
                 className="mt-2 w-full rounded-2xl bg-slate-50 p-4 text-sm font-semibold outline-none ring-1 ring-slate-100 focus:ring-[rgb(var(--brand)/0.3)]"
               />
             </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button 
              type="button"
              onClick={onCancel}
              className="flex-1 py-4 text-sm font-bold text-slate-400 hover:text-[rgb(var(--ink))] transition-colors"
            >
              Cancel
            </button>
            <button 
              type="button"
              onClick={handleSave}
              className="flex-[2] py-4 rounded-2xl bg-[rgb(var(--brand))] text-white text-sm font-bold shadow-lg shadow-[rgb(var(--brand)/0.2)] transition-transform active:scale-95"
            >
              Save Address
            </button>
          </div>
       </div>
    </Surface>
  );
}
