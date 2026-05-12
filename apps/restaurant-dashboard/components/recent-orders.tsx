"use client";

import { Badge } from '@justsearch/ui';
import { Clock, ChevronRight } from 'lucide-react';

const MOCK_ORDERS = [
  { id: '#1024', customer: 'Amina Hassan', items: 3, total: 142, status: 'preparing', time: '12 min ago' },
  { id: '#1023', customer: 'Khalid Al Mansoori', items: 2, total: 78, status: 'confirmed', time: '18 min ago' },
  { id: '#1022', customer: 'Priya Nair', items: 4, total: 210, status: 'ready', time: '25 min ago' },
  { id: '#1021', customer: 'James Thornton', items: 1, total: 110, status: 'out_for_delivery', time: '32 min ago' },
  { id: '#1020', customer: 'Sara Al Farsi', items: 2, total: 64, status: 'completed', time: '45 min ago' },
];

const STATUS_CONFIG: Record<string, { label: string; variant: string }> = {
  preparing: { label: 'Preparing', variant: 'warning' },
  confirmed: { label: 'Confirmed', variant: 'secondary' },
  ready: { label: 'Ready', variant: 'success' },
  out_for_delivery: { label: 'Out for Delivery', variant: 'info' },
  completed: { label: 'Delivered', variant: 'success' },
};

export function RecentOrders() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-900">Recent Orders</h3>
        <button type="button" className="flex items-center gap-1 text-sm font-medium text-amber-600">
          View All <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {MOCK_ORDERS.map((order) => {
          const status = STATUS_CONFIG[order.status];
          return (
            <div
              key={order.id}
              className="flex items-center justify-between rounded-xl border border-slate-100 p-3 transition-colors hover:bg-slate-50"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">{order.id}</span>
                  <Badge variant={status.variant as never}>{status.label}</Badge>
                </div>
                <p className="mt-1 text-sm text-slate-600">{order.customer}</p>
                <div className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                  <Clock className="h-3 w-3" />
                  {order.time}
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-900">AED {order.total}</p>
                <p className="text-xs text-slate-400">{order.items} items</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
