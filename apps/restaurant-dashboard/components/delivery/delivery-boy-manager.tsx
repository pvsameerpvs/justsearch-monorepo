"use client";

import { useState } from "react";
import { useDeliveryAgentsQuery, useCreateDeliveryAgentMutation, useUpdateDeliveryAgentMutation, useDeleteDeliveryAgentMutation } from "@/lib/hooks/use-delivery-agents-query";
import { DeliveryBoyStats } from "./delivery-boy-stats";
import { DeliveryBoyHeader } from "./delivery-boy-header";
import { DeliveryBoyList } from "./delivery-boy-list";
import { DeliveryEmpty } from "./delivery-empty";
import { DeliverySkeleton } from "./delivery-skeleton";
import { DeliveryError } from "./delivery-error";
import { DeliveryAgentForm } from "./delivery-agent-form";
import { DriverEditForm } from "./driver-edit-form";
import { DeliveryBoyOrdersDrawer } from "./delivery-boy-orders-drawer";

export function DeliveryBoyManager() {
  const { data, isLoading, error, refetch } = useDeliveryAgentsQuery();
  const createMutation = useCreateDeliveryAgentMutation();
  const updateMutation = useUpdateDeliveryAgentMutation();
  const deleteMutation = useDeleteDeliveryAgentMutation();
  const [showForm, setShowForm] = useState(false);
  const [editingAgentId, setEditingAgentId] = useState<string | null>(null);
  const [viewingAgentId, setViewingAgentId] = useState<string | null>(null);

  if (isLoading) return <DeliverySkeleton />;
  if (error) return <DeliveryError error={error} onRetry={refetch} />;
  if (!data?.agents.length) return <DeliveryEmpty onAdd={() => setShowForm(true)} />;

  const agents = data.agents;
  const editingAgent = agents.find((a) => a.id === editingAgentId) ?? null;

  return (
    <div className="space-y-5">
      <DeliveryBoyStats agents={agents} />
      <DeliveryBoyHeader total={agents.length} onAdd={() => setShowForm(true)} />
      <DeliveryBoyList
        agents={agents}
        onToggleActive={(id) => {
          const agent = agents.find((a) => a.id === id);
          if (agent) updateMutation.mutate({ id, data: { isActive: !agent.isActive } });
        }}
        onRemove={(id) => deleteMutation.mutate(id)}
        onEdit={setEditingAgentId}
        onViewOrders={setViewingAgentId}
      />
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md">
            <DeliveryAgentForm
              onSubmit={(data) => createMutation.mutate(data, { onSuccess: () => setShowForm(false) })}
              onCancel={() => setShowForm(false)}
              isPending={createMutation.isPending}
            />
          </div>
        </div>
      )}
      {editingAgent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md">
            <DriverEditForm
              agent={editingAgent}
              onSave={(data) => updateMutation.mutate({ id: editingAgent.id, data }, { onSuccess: () => setEditingAgentId(null) })}
              onCancel={() => setEditingAgentId(null)}
              isPending={updateMutation.isPending}
            />
          </div>
        </div>
      )}
      {viewingAgentId && (
        <DeliveryBoyOrdersDrawer agentId={viewingAgentId} onClose={() => setViewingAgentId(null)} />
      )}
    </div>
  );
}
