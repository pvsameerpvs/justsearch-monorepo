"use client";

import { Gift, HelpCircle, MapPin, Settings, ShoppingBag, Star, Ticket } from 'lucide-react';
import { ProfileMenuItem } from './profile-menu-item';
import { useLoyaltyPoints } from '@/components/restaurant/use-loyalty-points';

export function ProfileMenuList() {
  const { points } = useLoyaltyPoints();

  return (
    <div className="space-y-4">
      <p className="px-2 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">Profile</p>
      <div className="grid gap-3">
        <ProfileMenuItem href="/profile/points" icon={Star} label="Loyalty Points" description="See and manage your points" trailing={points.toLocaleString()} />
        <ProfileMenuItem href="/profile/rewards" icon={Gift} label="Rewards" description="Redeem your earned rewards" />
        <ProfileMenuItem href="/profile/how-to-play" icon={HelpCircle} label="How to Play" description="Rules for each game" />
        <ProfileMenuItem href="/profile/addresses" icon={MapPin} label="Saved Addresses" description="Manage your delivery locations" />
        <ProfileMenuItem href="/profile/vouchers" icon={Ticket} label="Voucher Wallet" description="Your special offers and coupons" />
        <ProfileMenuItem href="/profile/orders" icon={ShoppingBag} label="Order History" description="Track and reorder meals" />
        <ProfileMenuItem href="/profile/settings" icon={Settings} label="Settings" description="Manage your account preferences" />
      </div>
    </div>
  );
}
