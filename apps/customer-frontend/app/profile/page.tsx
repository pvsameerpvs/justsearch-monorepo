"use client";

import Link from 'next/link';
import { Container } from '@/components/shared/container';
import { Surface } from '@/components/shared/surface';
import { useLoyaltyPoints } from '@/components/restaurant/use-loyalty-points';
import { ProfileMenuItem } from '@/components/restaurant/profile/profile-menu-item';
import { Gamepad2, Gift, HelpCircle, MapPin, Settings, ShoppingBag, Star, Ticket, User } from 'lucide-react';
import { useRegistration } from '@/components/auth/registration-context';
import { getLoyaltyTier, getStablePlayerId } from '@/lib/loyalty-utils';
export default function ProfilePage() {
  const { points } = useLoyaltyPoints();
  const { user, isRegistered, openModal } = useRegistration();

  const userName = user?.name ?? 'Guest explorer';
  const tier = getLoyaltyTier(points);
  const playerId = getStablePlayerId(user?.mobile || userName);

  return (
    <section className="py-8 sm:py-10">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[380px_1fr] lg:items-start">
          <Surface className="rounded-[32px] border-white/70 bg-[linear-gradient(145deg,rgb(var(--brand-soft)/0.35),rgba(255,255,255,0.92),rgb(var(--accent-soft)/0.35))] p-6 sm:p-8 shadow-xl shadow-black/5 ring-1 ring-black/[0.03]">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/80 text-slate-500 shadow-sm ring-1 ring-black/[0.05]">
                  <User className="h-7 w-7" />
                </div>
                <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-2xl bg-[rgb(var(--brand))] text-white shadow-lg ring-2 ring-white">
                  <Star className="h-4 w-4" />
                </div>
              </div>
              <div className="min-w-0">
                 <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[rgb(var(--brand))]">
                    PLAYER ID: PLR_{playerId}
                 </p>
                <h1 className="mt-1 truncate font-display text-2xl font-black tracking-tight text-[rgb(var(--ink))]">
                  {userName}
                </h1>
                 <div className="mt-1 space-y-1 text-[11px] font-bold text-[rgb(var(--muted))] uppercase tracking-tight">
                  <p className="flex items-center gap-1.5"><Star className="h-3 w-3 text-amber-500 fill-current" /> {tier} member</p>
                  {isRegistered && user ? (
                    <p className="font-mono text-[rgb(var(--brand))]">{user.mobile}</p>
                  ) : (
                    <button
                      type="button"
                      onClick={openModal}
                      className="text-left font-black text-[rgb(var(--brand))] hover:underline"
                    >
                      Verify mobile to unlock rewards
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Link
                href="/eat-play/profile"
                className="group relative overflow-hidden rounded-[26px] border border-white bg-white/60 p-5 shadow-sm ring-1 ring-black/[0.02] transition-all hover:bg-white"
              >
                <p className="text-[10px] font-black uppercase tracking-widest text-[rgb(var(--muted))]">
                  Wallet Balance
                </p>
                <div className="mt-1 flex items-baseline gap-2">
                  <p className="font-display text-3xl font-black tracking-tight text-[rgb(var(--brand))]">
                    {points.toLocaleString()}
                  </p>
                </div>
              </Link>

              <Link
                href="/eat-play/profile"
                className="flex items-center justify-between rounded-[22px] border border-[rgb(var(--border)/0.9)] bg-white/80 p-4 transition-all hover:bg-white"
              >

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[rgb(var(--muted))]">
                    Play
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[rgb(var(--ink))]">
                    Earn more points
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[rgb(var(--brand-soft)/0.55)] text-[rgb(var(--brand))]">
                  <Gamepad2 className="h-5 w-5" />
                </div>
              </Link>
            </div>
          </Surface>

          <div className="space-y-4">
            <p className="px-2 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
              Profile
            </p>

            <div className="grid gap-3">
              <ProfileMenuItem
                href="/profile/points"
                icon={Star}
                label="Loyalty Points"
                description="See and manage your points"
                trailing={`${points}`}
              />
              <ProfileMenuItem
                href="/profile/rewards"
                icon={Gift}
                label="Rewards"
                description="Unlocked offers (demo)"
              />
              <ProfileMenuItem
                href="/profile/how-to-play"
                icon={HelpCircle}
                label="How to Play"
                description="Rules for each game"
              />
              <ProfileMenuItem
                href="/profile/addresses"
                icon={MapPin}
                label="Saved Addresses"
                description="Manage your delivery locations"
              />
              <ProfileMenuItem
                href="/profile/vouchers"
                icon={Ticket}
                label="Voucher Wallet"
                description="Your special offers and coupons"
              />
              <ProfileMenuItem
                href="/profile/orders"
                icon={ShoppingBag}
                label="Order History"
                description="Track and reorder meals"
              />
              <ProfileMenuItem
                href="/profile/settings"
                icon={Settings}
                label="Settings"
                description="Preferences and privacy (demo)"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
