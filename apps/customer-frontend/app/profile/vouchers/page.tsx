"use client";

import { ProfileSectionLayout } from '@/components/restaurant/profile/profile-section-layout';
import { ProfileVoucherWallet } from '@/components/restaurant/profile/sections/profile-voucher-wallet';

export default function VouchersPage() {
  return (
    <ProfileSectionLayout 
      title="Voucher Wallet" 
      description="Collect and manage your personalized rewards, discounts, and gift cards."
    >
      <ProfileVoucherWallet />
    </ProfileSectionLayout>
  );
}
