"use client";

import { useState } from "react";
import { useDeliveryBoyStore } from "@/lib/stores/delivery-boy-store";
import { Plus, Bike } from "lucide-react";
import { DeliveryAgentCard } from "./delivery-agent-card";
import { DeliveryAgentForm } from "./delivery-agent-form";

export function DeliveryBoyManager() {
  const { agents, addAgent, removeAgent } = useDeliveryBoyStore();
  const [showForm, setShowForm] = useState(false);

  const onSubmit = (data: { name: string; phone: string; email: string }) => {
    addAgent({ ...data, isActive: true });
    setShowForm(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bike className="h-5 w-5 text-slate-400" />
          <p className="text-sm text-slate-500">{agents.length} agents</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {agents.map((agent) => (
          <DeliveryAgentCard
            key={agent.id}
            agent={agent}
            onRemove={() => removeAgent(agent.id)}
          />
        ))}
      </div>

      {showForm ? (
        <DeliveryAgentForm onSubmit={onSubmit} onCancel={() => setShowForm(false)} />
      ) : (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="w-full rounded-xl border-2 border-dashed border-slate-200 py-3 text-sm font-medium text-slate-400 hover:border-slate-300 hover:text-slate-600"
        >
          <Plus className="mx-auto mb-1 h-5 w-5" />
          Add Delivery Agent
        </button>
      )}
    </div>
  );
}
