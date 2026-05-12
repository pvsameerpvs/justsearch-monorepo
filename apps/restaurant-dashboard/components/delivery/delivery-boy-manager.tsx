"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@justsearch/ui';
import { useDeliveryBoyStore } from '@/lib/stores/delivery-boy-store';
import { Plus, Trash2, Star, MapPin } from 'lucide-react';

const agentSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(5),
  email: z.string().email(),
});

type AgentFormData = z.infer<typeof agentSchema>;

export function DeliveryBoyManager() {
  const { agents, addAgent, removeAgent } = useDeliveryBoyStore();
  const [showForm, setShowForm] = useState(false);

  const form = useForm<AgentFormData>({
    resolver: zodResolver(agentSchema),
    defaultValues: { name: '', phone: '', email: '' },
  });

  const handleAdd = (data: AgentFormData) => {
    addAgent({ ...data, isActive: true });
    form.reset();
    setShowForm(false);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-900">Delivery Agents</h3>

      <div className="space-y-3">
        {agents.map((agent) => (
          <div key={agent.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                  {agent.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{agent.name}</p>
                  <p className="text-xs text-slate-500">{agent.uniqueId}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeAgent(agent.id)}
                className="text-slate-400 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-2 flex gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {agent.phone}
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 text-amber-500" />
                {agent.rating} ({agent.totalDeliveries} deliveries)
              </span>
            </div>
            <div className="mt-2 text-xs font-mono text-amber-700">
              Portal: restaurantname-{agent.uniqueId}.js-restorant.com
            </div>
          </div>
        ))}
      </div>

      {showForm ? (
        <form onSubmit={form.handleSubmit(handleAdd)} className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
          <input {...form.register('name')} placeholder="Full name" className="w-full rounded-lg border p-2 text-sm" />
          <input {...form.register('phone')} placeholder="Phone" className="w-full rounded-lg border p-2 text-sm" />
          <input {...form.register('email')} placeholder="Email" className="w-full rounded-lg border p-2 text-sm" />
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" className="bg-amber-500">
              Add Agent
            </Button>
          </div>
        </form>
      ) : (
        <Button variant="outline" className="w-full" onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Delivery Agent
        </Button>
      )}
    </div>
  );
}
