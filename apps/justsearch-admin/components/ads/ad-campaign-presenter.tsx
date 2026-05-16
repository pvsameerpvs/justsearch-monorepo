"use client";

import { useState } from "react";
import { AdCampaignStatsCards } from "./ad-campaign-stats-cards";
import { AdCampaignTable } from "./ad-campaign-table";
import { AdPerformanceTable } from "./ad-performance-table";
import { AdPreviewCard } from "./ad-preview-card";
import { AdModal } from "./ad-modal";
import { AdFormContainer } from "./ad-form-container";
import { AdViewTabs } from "./ad-view-tabs";
import type { AdCampaign, AdCampaignFormData } from "@/lib/stores/ad-campaign-types";
import type { GameOption, RestaurantOption } from "./ad-campaign.types";

interface AdCampaignPresenterProps {
  campaigns: AdCampaign[];
  restaurants: RestaurantOption[];
  games: GameOption[];
  onAdd: (data: AdCampaignFormData) => void;
  onUpdate: (id: string, data: Partial<AdCampaignFormData>) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

export function AdCampaignPresenter({ campaigns, restaurants, games, onAdd, onUpdate, onDelete, onToggle }: AdCampaignPresenterProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "grid" | "performance">("table");

  const editingCampaign = editingId ? campaigns.find((c) => c.id === editingId) ?? null : null;

  const handleSave = (data: AdCampaignFormData) => {
    if (editingId) {
      onUpdate(editingId, data);
      setEditingId(null);
    } else {
      onAdd(data);
      setShowForm(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
  };

  return (
    <div className="space-y-5">
      <AdCampaignStatsCards />
      <AdViewTabs viewMode={viewMode} onChange={setViewMode} />

      {viewMode === "table" && (
        <AdCampaignTable campaigns={campaigns} onEdit={setEditingId} onDelete={onDelete} onToggle={onToggle} onAdd={() => setShowForm(true)} />
      )}

      {viewMode === "performance" && <AdPerformanceTable campaigns={campaigns} />}

      {viewMode === "grid" && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((c) => (
            <AdPreviewCard key={c.id} campaign={c} />
          ))}
        </div>
      )}

      {(showForm || editingId) && (
        <AdModal title={editingCampaign ? "Edit Campaign" : "Create Ad Campaign"} onClose={handleCancel}>
          <AdFormContainer campaign={editingCampaign} restaurants={restaurants} games={games} onSave={handleSave} onCancel={handleCancel} />
        </AdModal>
      )}
    </div>
  );
}
