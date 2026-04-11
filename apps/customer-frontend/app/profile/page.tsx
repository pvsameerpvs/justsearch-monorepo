"use client";

import Link from 'next/link';
import { Container } from '@/components/shared/container';
import { Surface } from '@/components/shared/surface';
import { useLoyaltyPoints } from '@/components/restaurant/use-loyalty-points';
import { ProfileMenuItem } from '@/components/restaurant/profile/profile-menu-item';
import { Gamepad2, Gift, HelpCircle, Settings, Star, User } from 'lucide-react';

export default function ProfilePage() {
  const { points } = useLoyaltyPoints();

  const userName = 'Guest';
  const tierLabel =
    points >= 2000 ? 'Platinum' : points >= 1200 ? 'Gold' : points >= 600 ? 'Silver' : 'Member';

  return (
    <section className="py-8 sm:py-10">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[380px_1fr] lg:items-start">
          <Surface className="rounded-[32px] border-white/70 bg-[linear-gradient(145deg,rgb(var(--brand-soft)/0.35),rgba(255,255,255,0.92),rgb(var(--accent-soft)/0.35))] p-6 sm:p-8">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/80 text-slate-500 shadow-sm">
                  <User className="h-7 w-7" />
                </div>
                <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-2xl bg-[rgb(var(--brand))] text-white shadow-lg">
                  <Star className="h-4 w-4" />
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[rgb(var(--brand))]">
                  Demo profile
                </p>
                <h1 className="mt-1 truncate font-display text-2xl font-semibold tracking-[-0.06em] text-[rgb(var(--ink))]">
                  {userName}
                </h1>
                <p className="mt-1 text-sm font-medium text-[rgb(var(--muted))]">
                  Status: {tierLabel} member
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[22px] border border-[rgb(var(--border)/0.9)] bg-white/80 p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[rgb(var(--muted))]">
                  Points
                </p>
                <p className="mt-1 font-display text-2xl font-semibold tracking-[-0.05em] text-[rgb(var(--brand))]">
                  {points}
                </p>
              </div>
              <Link
                href="/eat-play"
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
