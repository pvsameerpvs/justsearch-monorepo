"use client";

import { useState } from 'react';
import { Surface } from '@/components/shared/surface';
import { useGeolocation } from '../../use-geolocation';
import { type SavedAddress } from '../../use-address-book';
import { ProfileAddressFormFields } from './profile-address-form-fields';
import { ProfileAddressFormActions } from './profile-address-form-actions';

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
        <ProfileAddressFormFields
          value={newAddr}
          onChange={setNewAddr}
          onGetCurrentLocation={handleGetCurrentLocation}
          isLocating={isLocating}
        />
        <ProfileAddressFormActions
          onCancel={onCancel}
          onSave={handleSave}
        />
      </div>
    </Surface>
  );
}
