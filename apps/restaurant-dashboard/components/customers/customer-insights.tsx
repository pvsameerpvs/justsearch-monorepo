"use client";

import { CustomerCard } from './customer-card';

const DEMO_CUSTOMERS = [
  {
    id: '1', name: 'Amina Hassan', phone: '+971 55 111 2222', email: 'amina@email.com',
    birthday: '15 March', totalOrders: 24, totalSpent: 3840,
    vipTier: 'Gold', points: 2450, lastVisit: '2 days ago', location: 'Dubai Marina',
  },
  {
    id: '2', name: 'Khalid Al Mansoori', phone: '+971 50 333 4444', email: 'khalid@email.com',
    birthday: '22 July', totalOrders: 18, totalSpent: 2900,
    vipTier: 'Silver', points: 890, lastVisit: '1 week ago', location: 'JLT',
  },
  {
    id: '3', name: 'Priya Nair', phone: '+971 52 555 6666', email: 'priya@email.com',
    birthday: '8 November', totalOrders: 12, totalSpent: 1680,
    vipTier: 'Bronze', points: 340, lastVisit: '3 days ago', location: 'Downtown',
  },
];

export function CustomerInsights() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {DEMO_CUSTOMERS.map((customer) => (
          <CustomerCard key={customer.id} customer={customer} />
        ))}
      </div>
    </div>
  );
}
