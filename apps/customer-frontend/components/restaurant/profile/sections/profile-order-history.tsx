"use client";

import { ShoppingBag, ArrowRight, RotateCcw } from 'lucide-react';
import { Surface } from '@/components/shared/surface';
import { RestaurantDeliveryStatusBadge } from '../../restaurant-delivery-status-badge';

type OrderItem = {
  id: string;
  name: string;
  quantity: number;
};

type Order = {
  id: string;
  createdAt: number;
  total: number;
  currency: string;
  status: 'order_confirmed' | 'assigned_delivery_boy' | 'delivered';
  items: OrderItem[];
};

const PAST_ORDERS: Order[] = [
  {
    id: 'ORD-821A',
    createdAt: Date.now() - 3600000 * 2,
    total: 85.00,
    currency: 'AED',
    status: 'delivered',
    items: [
      { id: '1', name: 'Original Burger', quantity: 2 },
      { id: '2', name: 'Sweet Potato Fries', quantity: 1 },
    ]
  },
  {
    id: 'ORD-992C',
    createdAt: Date.now() - 86400000 * 3,
    total: 120.00,
    currency: 'AED',
    status: 'delivered',
    items: [
      { id: '3', name: 'Family Pizza Deal', quantity: 1 },
      { id: '4', name: 'Coke 1.5L', quantity: 1 },
    ]
  }
];

function formatOrderTime(value: number) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(value);
}

export function ProfileOrderHistory() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {PAST_ORDERS.map((order) => (
          <Surface 
            key={order.id}
            className="group overflow-hidden rounded-[28px] border-white/60 bg-white/80 p-6 shadow-sm transition-all hover:bg-white hover:shadow-[0_15px_40px_rgba(15,23,42,0.06)]"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 transition-colors group-hover:bg-[rgb(var(--brand-soft)/0.45)] group-hover:text-[rgb(var(--brand))]">
                  <ShoppingBag className="h-7 w-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-[rgb(var(--ink))]">
                      Order #{order.id}
                    </h3>
                    <RestaurantDeliveryStatusBadge status={order.status} />
                  </div>
                  <p className="text-xs font-medium text-[rgb(var(--muted))]">
                    {formatOrderTime(order.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[rgb(var(--muted))]">Total Amount</p>
                  <p className="font-display text-xl font-bold tracking-tight text-[rgb(var(--ink))]">
                    {order.currency} {order.total.toFixed(2)}
                  </p>
                </div>
                <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100/50 text-slate-400 transition-all hover:bg-[rgb(var(--brand))] hover:text-white hover:shadow-lg hover:shadow-[rgb(var(--brand)/0.25)]">
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
              <div className="flex gap-2 text-xs font-medium text-[rgb(var(--muted))]">
                {order.items.map((item, idx) => (
                  <span key={item.id}>
                    {item.quantity}x {item.name}{idx < order.items.length - 1 ? ',' : ''}
                  </span>
                )).slice(0, 2)}
                {order.items.length > 2 && <span>+{order.items.length - 2} more</span>}
              </div>
              
              <button className="flex items-center gap-2 rounded-xl bg-[rgb(var(--brand-soft)/0.35)] px-4 py-2 text-xs font-bold text-[rgb(var(--brand))] transition-all hover:bg-[rgb(var(--brand))] hover:text-white">
                <RotateCcw className="h-3.5 w-3.5" />
                Reorder
              </button>
            </div>
          </Surface>
        ))}
      </div>

      {PAST_ORDERS.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 text-slate-200">
            <ShoppingBag className="h-10 w-10" />
          </div>
          <h3 className="text-xl font-bold text-[rgb(var(--ink))]">No orders yet</h3>
          <p className="mt-2 text-sm text-[rgb(var(--muted))]">Your hungry journey starts here. Place your first order!</p>
        </div>
      )}
    </div>
  );
}
