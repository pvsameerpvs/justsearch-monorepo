"use client";

import { ProfileSectionLayout } from '@/components/restaurant/profile/profile-section-layout';
import { ProfileOrderHistory } from '@/components/restaurant/profile/sections/profile-order-history';

export default function OrdersHistoryPage() {
  return (
    <ProfileSectionLayout 
      title="Order History" 
      description="View details of your past orders, track active deliveries, and reorder your favorites."
    >
      <ProfileOrderHistory />
    </ProfileSectionLayout>
  );
}
