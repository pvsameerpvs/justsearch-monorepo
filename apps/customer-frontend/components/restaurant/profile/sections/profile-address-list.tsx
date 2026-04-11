"use client";

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAddressBook, type SavedAddress } from '../../use-address-book';
import { ProfileAddressCard } from './profile-address-card';
import { ProfileAddAddressForm } from './profile-add-address-form';

export function ProfileAddressList() {
  const { addresses, addAddress, removeAddress, hydrated } = useAddressBook();
  const [isAdding, setIsAdding] = useState(false);

  if (!hydrated) return null;

  const handleSave = (newAddr: Omit<SavedAddress, 'id'>) => {
    addAddress(newAddr);
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {addresses.map((addr: SavedAddress) => (
          <ProfileAddressCard 
            key={addr.id} 
            address={addr} 
            onRemove={removeAddress} 
          />
        ))}

        {isAdding ? (
          <ProfileAddAddressForm 
            onSave={handleSave} 
            onCancel={() => setIsAdding(false)} 
          />
        ) : (
          <button 
            type="button"
            onClick={() => setIsAdding(true)}
            className="flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-[28px] border-2 border-dashed border-slate-200 bg-white/40 transition-all hover:border-[rgb(var(--brand)/0.5)] hover:bg-[rgb(var(--brand-soft)/0.15)] group"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-400 group-hover:bg-[rgb(var(--brand-soft))] group-hover:text-[rgb(var(--brand))] transition-colors shadow-sm">
              <Plus className="h-6 w-6" />
            </div>
            <p className="text-sm font-bold text-slate-400 group-hover:text-[rgb(var(--brand))] transition-colors">Add new address</p>
          </button>
        )}
      </div>
    </div>
  );
}
