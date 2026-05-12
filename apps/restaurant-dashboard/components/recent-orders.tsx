"use client";

import { Clock, ChevronRight } from 'lucide-react';

const ORDERS = [
  { id: '#1024', customer: 'Amina Hassan', items: 3, total: 142, status: 'preparing', time: '12 min ago', initial: 'AH', color: 'bg-rose-100 text-rose-600' },
  { id: '#1023', customer: 'Khalid Al Mansoori', items: 2, total: 78, status: 'confirmed', time: '18 min ago', initial: 'KA', color: 'bg-sky-100 text-sky-600' },
  { id: '#1022', customer: 'Priya Nair', items: 4, total: 210, status: 'ready', time: '25 min ago', initial: 'PN', color: 'bg-amber-100 text-amber-600' },
  { id: '#1021', customer: 'James Thornton', items: 1, total: 110, status: 'out_for_delivery', time: '32 min ago', initial: 'JT', color: 'bg-emerald-100 text-emerald-600' },
  { id: '#1020', customer: 'Sara Al Farsi', items: 2, total: 64, status: 'completed', time: '45 min ago', initial: 'SF', color: 'bg-violet-100 text-violet-600' },
];

const STATUS: Record<string, { label: string; class: string }> = {
  preparing: { label: 'Preparing', class: 'bg-amber-50 text-amber-700 border-amber-200' },
  confirmed: { label: 'Confirmed', class: 'bg-sky-50 text-sky-700 border-sky-200' },
  ready: { label: 'Ready', class: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  out_for_delivery: { label: 'Out for Delivery', class: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  completed: { label: 'Delivered', class: 'bg-slate-100 text-slate-700 border-slate-200' },
};

export function RecentOrders() {
  return (
    <div className="elegant-card p-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">Recent Orders</h3>
          <p className="text-sm text-slate-500">Latest orders from customers</p>
        </div>
        <button className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900">
          View all <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {ORDERS.map((o) => {
          const s = STATUS[o.status];
          return (
            <div key={o.id} className="flex items-center gap-4 rounded-lg border border-slate-100 bg-white p-3 transition-colors hover:bg-slate-50/50">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${o.color}`}>
                {o.initial}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-900">{o.id}</span>
                  <span className={`status-chip border ${s.class}`}>{s.label}</span>
                </div>
                <p className="mt-0.5 text-sm text-slate-600">{o.customer}</p>
                <div className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
                  <Clock className="h-3 w-3" /> {o.time}
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold text-slate-900">AED {o.total}</p>
                <p className="text-xs text-slate-400">{o.items} items</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
