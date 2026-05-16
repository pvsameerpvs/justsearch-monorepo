"use client";

import { useState } from "react";
import { AdCampaignStatsCards } from "./ad-campaign-stats-cards";
import { AdCampaignTable } from "./ad-campaign-table";
import { AdPerformanceTable } from "./ad-performance-table";
import { AdPreviewCard } from "./ad-preview-card";
import { AdModal } from "./ad-modal";
import { AdFormContainer } from "./ad-form-container";
import { AdViewTabs } from "./ad-view-tabs";
import { AdDeleteDialog } from "./ad-delete-dialog";
import type { AdCampaign, AdCampaignFormData } from "@/lib/stores/ad-campaign-types";
import type { GameOption, RestaurantOption } from "./ad-campaign.types";

interface AdCampaignPresenterProps {
  campaigns: AdCampaign[];
  restaurants: RestaurantOption[];
  games: GameOption[];
  onAdd: (data: AdCampaignFormData) => Promise<unknown>;
  onUpdate: (id: string, data: Partial<AdCampaignFormData>) => Promise<unknown>;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  isCreatePending: boolean;
  isUpdatePending: boolean;
  createError: Error | null;
  updateError: Error | null;
}

export function AdCampaignPresenter({ campaigns, restaurants, games, onAdd, onUpdate, onDelete, onToggle, isCreatePending, isUpdatePending, createError, updateError }: AdCampaignPresenterProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "grid" | "performance">("table");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const editingCampaign = editingId ? campaigns.find((c) => c.id === editingId) ?? null : null;
  const deleteTarget = deleteTargetId ? campaigns.find((c) => c.id === deleteTargetId) ?? null : null;
  const isPending = isCreatePending || isUpdatePending;
  const serverError = submitError ?? createError?.message ?? updateError?.message ?? null;

  const handleSave = async (data: AdCampaignFormData) => {
    setSubmitError(null);
    try {
      if (editingId) {
        await onUpdate(editingId, data);
        setEditingId(null);
      } else {
        await onAdd(data);
        setShowForm(false);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save campaign";
      setSubmitError(message);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setSubmitError(null);
  };

  const handleDeleteConfirm = () => {
    if (deleteTargetId) {
      onDelete(deleteTargetId);
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="space-y-5">
      <AdCampaignStatsCards />
      <AdViewTabs viewMode={viewMode} onChange={setViewMode} />

      {viewMode === "table" && (
        <AdCampaignTable campaigns={campaigns} onEdit={setEditingId} onDelete={setDeleteTargetId} onToggle={onToggle} onAdd={() => setShowForm(true)} />
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
          <AdFormContainer
            key={editingId ?? "create"}
            campaign={editingCampaign}
            restaurants={restaurants}
            games={games}
            onSave={handleSave}
            onCancel={handleCancel}
            isPending={isPending}
            serverError={serverError}
          />
        </AdModal>
      )}

      {deleteTarget && (
        <AdDeleteDialog
          campaignName={deleteTarget.title}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTargetId(null)}
        />
      )}
    </div>
  );
}
