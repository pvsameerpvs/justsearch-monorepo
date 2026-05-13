"use client";

import { useState } from "react";
import { useDeliveryBoyStore, type UpdateAgentData } from "@/lib/stores/delivery-boy-store";
import { DeliveryBoyStats } from "./delivery-boy-stats";
import { DeliveryBoyHeader } from "./delivery-boy-header";
import { DeliveryBoyList } from "./delivery-boy-list";
import { DeliveryBoyEmpty } from "./delivery-boy-empty";
import { DeliveryAgentForm } from "./delivery-agent-form";
import { DriverEditForm } from "./driver-edit-form";
import { DeliveryBoyOrdersDrawer } from "./delivery-boy-orders-drawer";

export function DeliveryBoyManager() {
  const { agents, addAgent, removeAgent, toggleActive, updateAgent } = useDeliveryBoyStore();
  const [showForm, setShowForm] = useState(false);
  const [editingAgentId, setEditingAgentId] = useState<string | null>(null);
  const [viewingAgentId, setViewingAgentId] = useState<string | null>(null);

  const onAddSubmit = (data: { name: string; phone: string; email: string; location: string; password: string }) => {
    addAgent({ name: data.name, phone: data.phone, email: data.email, location: data.location, password: data.password, isActive: true });
    setShowForm(false);
  };

  const onEditSubmit = (data: { name: string; phone: string; email: string; location: string; password?: string }) => {
    if (editingAgentId) {
      const updateData: UpdateAgentData = {
        name: data.name,
        phone: data.phone,
        email: data.email,
        location: data.location,
      };
      if (data.password && data.password.length > 0) {
        updateData.password = data.password;
      }
      updateAgent(editingAgentId, updateData);
      setEditingAgentId(null);
    }
  };

  const editingAgent = editingAgentId ? agents.find((a) => a.id === editingAgentId) ?? null : null;

  return (
    <div className="space-y-5">
      <DeliveryBoyStats agents={agents} />
      <DeliveryBoyHeader total={agents.length} onAdd={() => setShowForm(true)} />

      {agents.length === 0 ? (
        <DeliveryBoyEmpty onAdd={() => setShowForm(true)} />
      ) : (
        <DeliveryBoyList
          agents={agents}
          onToggleActive={toggleActive}
          onRemove={removeAgent}
          onEdit={setEditingAgentId}
          onViewOrders={setViewingAgentId}
        />
      )}

      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md">
            <DeliveryAgentForm
              onSubmit={onAddSubmit}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {editingAgent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md">
            <DriverEditForm
              agent={editingAgent}
              onSave={onEditSubmit}
              onCancel={() => setEditingAgentId(null)}
            />
          </div>
        </div>
      )}

      {viewingAgentId && (
        <DeliveryBoyOrdersDrawer
          agentId={viewingAgentId}
          onClose={() => setViewingAgentId(null)}
        />
      )}
    </div>
  );
}
