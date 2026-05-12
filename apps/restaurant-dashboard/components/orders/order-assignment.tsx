"use client";

import { useState } from 'react';
import { Button } from '@justsearch/ui';
import { useOrderStore } from '@/lib/stores/order-store';
import { useDeliveryBoyStore } from '@/lib/stores/delivery-boy-store';
import { Truck, UserCheck, MapPin } from 'lucide-react';

export function OrderAssignment() {
  const { orders, assignAgent } = useOrderStore();
  const { agents } = useDeliveryBoyStore();
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const unassigned = orders.filter(
    (o) => o.type === 'delivery' && !o.assignedAgentId && o.status !== 'completed'
  );

  const activeAgents = agents.filter((a) => a.isActive);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-900">Delivery Assignment</h3>

      {unassigned.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-center">
          <p className="text-sm text-slate-500">No unassigned delivery orders</p>
        </div>
      ) : (
        <div className="space-y-3">
          {unassigned.map((order) => (
            <div key={order.id} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{order.code}</span>
                    <span className="rounded-full bg-orange-50 px-2 py-0.5 text-xs font-bold text-orange-700">
                      {order.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-700">{order.customerName}</p>
                  <p className="text-xs text-slate-500">
                    <MapPin className="mr-1 inline h-3 w-3" />
                    {order.address}
                  </p>
                  <p className="text-xs text-slate-500">{order.items} items · AED {order.total}</p>
                </div>
                <div className="text-right">
                  {selectedOrder === order.id ? (
                    <div className="space-y-2">
                      {activeAgents.map((agent) => (
                        <button
                          key={agent.id}
                          type="button"
                          onClick={() => {
                            assignAgent(order.id, agent.uniqueId);
                            setSelectedOrder(null);
                          }}
                          className="block w-full rounded-lg bg-blue-50 px-3 py-2 text-left text-xs font-bold text-blue-700 hover:bg-blue-100"
                        >
                          {agent.name} ({agent.uniqueId})
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(null)}
                        className="text-xs text-slate-400"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedOrder(order.id)}
                    >
                      <UserCheck className="mr-1 h-4 w-4" />
                      Assign
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
