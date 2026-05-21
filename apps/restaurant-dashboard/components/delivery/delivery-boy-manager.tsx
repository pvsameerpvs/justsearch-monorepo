"use client";

import { useState } from "react";
import { useDeliveryAgentsQuery, useCreateDeliveryAgentMutation, useUpdateDeliveryAgentMutation, useDeleteDeliveryAgentMutation } from "@/lib/hooks/use-delivery-agents-query";
import type { DeliveryAgent } from "@/lib/hooks/use-delivery-agents-query";
import { useDashboardAuth } from "@/lib/auth-context";
import { isRoleAtLeast } from "@/lib/utils/role-guards";
import { DeliveryBoyStats } from "./delivery-boy-stats";
import { DeliveryBoyHeader } from "./delivery-boy-header";
import { DeliveryBoyList } from "./delivery-boy-list";
import { DeliveryEmpty } from "./delivery-empty";
import { DeliverySkeleton } from "./delivery-skeleton";
import { DeliveryError } from "./delivery-error";
import { DeliveryAgentForm } from "./delivery-agent-form";
import { DriverEditForm } from "./driver-edit-form";
import { DeliveryBoyOrdersDrawer } from "./delivery-boy-orders-drawer";
import { DeleteConfirmDialog } from "./delete-confirm-dialog";

export function DeliveryBoyManager() {
  const { data, isLoading, error, refetch } = useDeliveryAgentsQuery();
  const createMutation = useCreateDeliveryAgentMutation();
  const updateMutation = useUpdateDeliveryAgentMutation();
  const deleteMutation = useDeleteDeliveryAgentMutation();
  const { user } = useDashboardAuth();
  const canManage = isRoleAtLeast(user?.role ?? "", "manager");
  const [showForm, setShowForm] = useState(false);
  const [editingAgentId, setEditingAgentId] = useState<string | null>(null);
  const [viewingAgentId, setViewingAgentId] = useState<string | null>(null);
  const [deletingAgent, setDeletingAgent] = useState<DeliveryAgent | null>(null);

  if (isLoading) return <DeliverySkeleton />;
  if (error) return <DeliveryError error={error} onRetry={refetch} />;

  const agents = data?.agents ?? [];
  const editingAgent = agents.find((a) => a.id === editingAgentId) ?? null;

  return (
    <div className="space-y-5">
      {agents.length === 0 ? (
        <DeliveryEmpty onAdd={() => { createMutation.reset(); setShowForm(true); }} canManage={canManage} />
      ) : (
        <>
          <DeliveryBoyStats agents={agents} />
          <DeliveryBoyHeader total={agents.length} onAdd={() => { createMutation.reset(); setShowForm(true); }} canManage={canManage} />
          <DeliveryBoyList
            agents={agents}
            onToggleActive={(id) => {
              if (!canManage) return;
              const agent = agents.find((a) => a.id === id);
              if (agent) updateMutation.mutate({ id, data: { isActive: !agent.isActive } });
            }}
            onRemove={(id) => {
              if (!canManage) return;
              const agent = agents.find((a) => a.id === id);
              if (agent) setDeletingAgent(agent);
            }}
            onEdit={(id) => {
              if (!canManage) return;
              updateMutation.reset();
              setEditingAgentId(id);
            }}
            onViewOrders={setViewingAgentId}
            canManage={canManage}
          />
        </>
      )}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md">
            <DeliveryAgentForm
              onSubmit={(data) => createMutation.mutate(data, { onSuccess: () => setShowForm(false) })}
              onCancel={() => { createMutation.reset(); setShowForm(false); }}
              isPending={createMutation.isPending}
              error={createMutation.error instanceof Error ? createMutation.error.message : null}
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
              onCancel={() => { updateMutation.reset(); setEditingAgentId(null); }}
              isPending={updateMutation.isPending}
              error={updateMutation.error instanceof Error ? updateMutation.error.message : null}
            />
          </div>
        </div>
      )}
      {viewingAgentId && (
        <DeliveryBoyOrdersDrawer agentId={viewingAgentId} onClose={() => setViewingAgentId(null)} />
      )}
      {deletingAgent && (
        <DeleteConfirmDialog
          driverName={deletingAgent.name}
          onConfirm={() => {
            deleteMutation.mutate(deletingAgent.id, {
              onSuccess: () => setDeletingAgent(null),
              onError: () => setDeletingAgent(null),
            });
          }}
          onCancel={() => setDeletingAgent(null)}
          isPending={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
