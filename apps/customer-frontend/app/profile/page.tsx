"use client";

import { Container } from '@/components/shared/container';
import { useLoyaltyPoints } from '@/components/restaurant/use-loyalty-points';
import { User, Settings, CreditCard, Bell, LogOut, ChevronRight, Star, Clock } from 'lucide-react';

export default function ProfilePage() {
  const { points } = useLoyaltyPoints();
  const user = {
    name: "Sameer",
    email: "sameer@example.com",
    avatar: null,
    points,
    tier: "Gold Member"
  };

  const menuItems = [
    { icon: User, label: "Personal Information", sub: "Name, email, phone" },
    { icon: Clock, label: "Order History", sub: "View previous meals" },
    { icon: CreditCard, label: "Payment Methods", sub: "Cards, Apple Pay, Wallet" },
    { icon: Bell, label: "Notifications", sub: "Messages, promos, alerts" },
    { icon: Settings, label: "Settings", sub: "Preferences, Privacy" }
  ];

  return (
    <div className="min-h-screen bg-[rgb(var(--surface))]">
      {/* Header section */}
      <div className="bg-white pb-8 pt-16 shadow-sm">
        <Container>
          <div className="flex flex-col items-center text-center">
            <div className="relative group">
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-slate-100 text-slate-400 shadow-xl transition-all group-hover:bg-slate-200">
                <User className="h-10 w-10" />
                <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-2xl bg-[rgb(var(--brand))] text-white shadow-lg border-2 border-white">
                   <Star className="h-4 w-4" />
                </div>
              </div>
            </div>
            
            <div className="mt-6 space-y-1">
              <h1 className="font-display text-2xl font-bold tracking-tight text-[rgb(var(--ink))]">
                {user.name}
              </h1>
              <p className="text-sm font-medium text-slate-400">{user.email}</p>
            </div>

            <div className="mt-8 flex gap-4 w-full max-w-sm">
              <div className="flex-1 rounded-2xl bg-slate-50 p-4 border border-slate-100">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Points</p>
                <p className="mt-1 font-display text-xl font-bold text-[rgb(var(--brand))]">{user.points}</p>
              </div>
              <div className="flex-1 rounded-2xl bg-slate-50 p-4 border border-slate-100">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</p>
                <p className="mt-1 font-display text-xl font-bold text-slate-700">{user.tier}</p>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Settings list */}
      <Container className="py-8">
        <div className="space-y-4">
          <p className="px-2 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Account Settings</p>
          <div className="overflow-hidden rounded-[24px] border border-slate-100 bg-white shadow-sm">
            {menuItems.map((item, idx) => (
              <button 
                key={item.label}
                className={`flex w-full items-center justify-between p-5 transition-all hover:bg-slate-50 active:bg-slate-100 ${
                  idx !== menuItems.length - 1 ? 'border-b border-slate-50' : ''
                }`}
              >
                <div className="flex items-center gap-4 text-left">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700">{item.label}</p>
                    <p className="text-xs text-slate-400 font-medium">{item.sub}</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-300" />
              </button>
            ))}
          </div>

          <button className="flex w-full items-center gap-4 rounded-[24px] border border-red-50 p-5 text-red-500 transition-all hover:bg-red-50 active:bg-red-100 mt-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50/50">
              <LogOut className="h-5 w-5" />
            </div>
            <p className="text-sm font-bold">Sign Out</p>
          </button>
        </div>
      </Container>
    </div>
  );
}
