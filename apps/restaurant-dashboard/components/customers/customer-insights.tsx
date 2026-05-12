"use client";

import { User, Phone, Mail, Cake, Star, ShoppingBag } from 'lucide-react';

const DEMO_CUSTOMERS = [
  {
    id: '1',
    name: 'Amina Hassan',
    phone: '+971 55 111 2222',
    email: 'amina@email.com',
    birthday: '15 March',
    totalOrders: 24,
    totalSpent: 3840,
    vipTier: 'Gold',
    points: 2450,
    lastVisit: '2 days ago',
  },
  {
    id: '2',
    name: 'Khalid Al Mansoori',
    phone: '+971 50 333 4444',
    email: 'khalid@email.com',
    birthday: '22 July',
    totalOrders: 18,
    totalSpent: 2900,
    vipTier: 'Silver',
    points: 890,
    lastVisit: '1 week ago',
  },
  {
    id: '3',
    name: 'Priya Nair',
    phone: '+971 52 555 6666',
    email: 'priya@email.com',
    birthday: '8 November',
    totalOrders: 12,
    totalSpent: 1680,
    vipTier: 'Bronze',
    points: 340,
    lastVisit: '3 days ago',
  },
];

const TIER_COLORS: Record<string, string> = {
  Bronze: 'bg-amber-100 text-amber-700',
  Silver: 'bg-slate-100 text-slate-700',
  Gold: 'bg-yellow-100 text-yellow-700',
  Platinum: 'bg-purple-100 text-purple-700',
};

export function CustomerInsights() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-900">Customer Insights</h3>

      <div className="space-y-3">
        {DEMO_CUSTOMERS.map((customer) => (
          <div key={customer.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                  {customer.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{customer.name}</p>
                  <p className="text-xs text-slate-500">Last visit: {customer.lastVisit}</p>
                </div>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${TIER_COLORS[customer.vipTier]}`}>
                {customer.vipTier}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {customer.phone}
              </span>
              <span className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {customer.email}
              </span>
              <span className="flex items-center gap-1">
                <Cake className="h-3 w-3" />
                {customer.birthday}
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 text-amber-500" />
                {customer.points} points
              </span>
            </div>

            <div className="mt-2 flex gap-4 border-t border-slate-100 pt-2 text-xs">
              <span className="flex items-center gap-1 text-slate-500">
                <ShoppingBag className="h-3 w-3" />
                {customer.totalOrders} orders
              </span>
              <span className="text-slate-500">
                AED {customer.totalSpent.toLocaleString()} spent
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
