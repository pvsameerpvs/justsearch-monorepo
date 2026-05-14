"use client";

import { useState } from "react";
import { useAdCampaignStore } from "@/lib/stores/ad-campaign-store";
import { AdCampaignStatsCards } from "./ad-campaign-stats-cards";
import { AdCampaignTable } from "./ad-campaign-table";
import { AdPerformanceTable } from "./ad-performance-table";
import { AdCampaignFormModal } from "./ad-campaign-form-modal";
import { AdPreviewCard } from "./ad-preview-card";

export function AdCampaignManager() {
  const { campaigns, addCampaign, updateCampaign, deleteCampaign, toggleActive } = useAdCampaignStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "grid" | "performance">("table");

  const editingCampaign = editingId ? campaigns.find((c) => c.id === editingId) ?? null : null;

  return (
    <div className="space-y-5">
      <AdCampaignStatsCards />

      {/* View toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setViewMode("table")}
          className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${viewMode === "table" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
        >
          Manage Table
        </button>
        <button
          onClick={() => setViewMode("performance")}
          className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${viewMode === "performance" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
        >
          Performance Metrics
        </button>
        <button
          onClick={() => setViewMode("grid")}
          className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${viewMode === "grid" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
        >
          Grid Preview
        </button>
      </div>

      {viewMode === "table" && (
        <AdCampaignTable
          campaigns={campaigns}
          onEdit={setEditingId}
          onDelete={deleteCampaign}
          onToggle={toggleActive}
          onAdd={() => setShowForm(true)}
        />
      )}

      {viewMode === "performance" && (
        <AdPerformanceTable campaigns={campaigns} />
      )}

      {viewMode === "grid" && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((c) => (
            <AdPreviewCard key={c.id} campaign={c} />
          ))}
        </div>
      )}

      {(showForm || editingId) && (
        <AdCampaignFormModal
          campaign={editingCampaign}
          onSave={(data) => {
            if (editingId) {
              updateCampaign(editingId, data);
              setEditingId(null);
            } else {
              addCampaign(data);
              setShowForm(false);
            }
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingId(null);
          }}
        />
      )}
    </div>
  );
}
