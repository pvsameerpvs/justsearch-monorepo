"use client";

import { ProfileSectionLayout } from '@/components/restaurant/profile/profile-section-layout';
import { ProfileAddressList } from '@/components/restaurant/profile/sections/profile-address-list';

export default function AddressesPage() {
  return (
    <ProfileSectionLayout 
      title="Saved Addresses" 
      description="Select or manage your primary delivery locations for a faster checkout."
    >
      <ProfileAddressList />
    </ProfileSectionLayout>
  );
}
