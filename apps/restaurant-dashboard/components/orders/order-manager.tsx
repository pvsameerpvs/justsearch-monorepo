"use client";

import { useState } from 'react';
import { Button } from '@justsearch/ui';
import { useOrderStore } from '@/lib/stores/order-store';
import { Check, X, Clock, Package, ChefHat, Truck, CheckCircle } from 'lucide-react';

const STATUS_FLOW = [
  { value: 'pending', label: 'Pending', icon: Clock, color: 'text-amber-600 bg-amber-50' },
  { value: 'confirmed', label: 'Confirmed', icon: Check, color: 'text-blue-600 bg-blue-50' },
  { value: 'preparing', label: 'Preparing', icon: ChefHat, color: 'text-orange-600 bg-orange-50' },
  { value: 'ready', label: 'Ready', icon: Package, color: 'text-purple-600 bg-purple-50' },
  { value: 'out_for_delivery', label: 'Out for Delivery', icon: Truck, color: 'text-indigo-600 bg-indigo-50' },
  { value: 'completed', label: 'Completed', icon: CheckCircle, color: 'text-green-600 bg-green-50' },
];

export function OrderManager() {
  const { orders, updateStatus } = useOrderStore();
  const [filter, setFilter] = useState<'all' | 'pending' | 'active'>('all');

  const filtered = orders.filter((o) => {
    if (filter === 'pending') return o.status === 'pending';
    if (filter === 'active') return o.status !== 'completed' && o.status !== 'cancelled';
    return true;
  });

  const handleAccept = (id: string) => updateStatus(id, 'confirmed');
  const handleReject = (id: string) => updateStatus(id, 'cancelled');
  const handleNextStatus = (id: string, currentStatus: string) => {
    const currentIndex = STATUS_FLOW.findIndex((s) => s.value === currentStatus);
    const nextStatus = STATUS_FLOW[currentIndex + 1]?.value;
    if (nextStatus) updateStatus(id, nextStatus as never);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(['all', 'pending', 'active'] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-xl px-4 py-2 text-sm font-bold capitalize transition-all ${
              filter === f ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((order) => {
          const statusConfig = STATUS_FLOW.find((s) => s.value === order.status);
          const StatusIcon = statusConfig?.icon ?? Clock;

          return (
            <div key={order.id} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{order.code}</span>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${statusConfig?.color}`}>
                      <StatusIcon className="h-3 w-3" />
                      {statusConfig?.label}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-700">{order.customerName}</p>
                  <p className="text-xs text-slate-500">
                    {order.items} items · AED {order.total} · {order.type}
                  </p>
                </div>

                <div className="flex gap-2">
                  {order.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReject(order.id)}
                        className="border-red-200 text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleAccept(order.id)}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  {order.status !== 'pending' && order.status !== 'completed' && order.status !== 'cancelled' && (
                    <Button
                      size="sm"
                      onClick={() => handleNextStatus(order.id, order.status)}
                      className="bg-amber-500 hover:bg-amber-600"
                    >
                      Next →
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
