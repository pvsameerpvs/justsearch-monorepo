"use client";

import { useState } from "react";
import { AdMediaUpload } from "./ad-media-upload";
import { AdFormField } from "./ad-form-field";
import { AdGameSelector } from "./ad-game-selector";
import type { AdCampaign, AdCampaignFormData, AdCampaignType } from "@/lib/stores/ad-campaign-types";

interface AdCampaignFormModalProps {
  campaign: AdCampaign | null;
  onSave: (data: AdCampaignFormData) => void;
  onCancel: () => void;
}

const DEMO_RESTAURANTS = [
  { id: "mosaic-table", name: "Mosaic Table" },
  { id: "spice-route", name: "Spice Route" },
  { id: "golden-spoon", name: "Golden Spoon" },
];

export function AdCampaignFormModal({ campaign, onSave, onCancel }: AdCampaignFormModalProps) {
  const [form, setForm] = useState<AdCampaignFormData>({
    title: campaign?.title ?? "",
    clientName: campaign?.clientName ?? "",
    companyName: campaign?.companyName ?? "",
    mediaType: campaign?.mediaType ?? "image",
    mediaUrl: campaign?.mediaUrl ?? "",
    duration: campaign?.duration ?? 15,
    type: campaign?.type ?? "restaurant_brought",
    restaurantId: campaign?.restaurantId ?? "mosaic-table",
    restaurantName: campaign?.restaurantName ?? "Mosaic Table",
    assignedGames: campaign?.assignedGames ?? [],
  });

  const isRestaurantBrought = form.type === "restaurant_brought";

  const toggleGame = (gameId: string) => {
    setForm((prev) => ({
      ...prev,
      assignedGames: prev.assignedGames.includes(gameId)
        ? prev.assignedGames.filter((g) => g !== gameId)
        : [...prev.assignedGames, gameId],
    }));
  };

  const setRestaurant = (id: string) => {
    const r = DEMO_RESTAURANTS.find((x) => x.id === id);
    setForm((prev) => ({ ...prev, restaurantId: id, restaurantName: r?.name ?? "" }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="elegant-card p-5 space-y-4">
          <p className="text-sm font-bold text-slate-900">{campaign ? "Edit Campaign" : "Create Ad Campaign"}</p>

          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Ad Media</label>
              <div className="mt-1">
                <AdMediaUpload mediaType={form.mediaType} mediaUrl={form.mediaUrl} onChange={(type, url) => setForm((prev) => ({ ...prev, mediaType: type, mediaUrl: url }))} />
              </div>
            </div>

            <AdFormField label="Ad Title" value={form.title} onChange={(v: string) => setForm({ ...form, title: v })} />
            <AdFormField label="Client Name" value={form.clientName} onChange={(v: string) => setForm({ ...form, clientName: v })} />
            <AdFormField label="Company Name" value={form.companyName} onChange={(v: string) => setForm({ ...form, companyName: v })} />
            <AdFormField label="Duration (seconds)" value={String(form.duration)} onChange={(v: string) => setForm({ ...form, duration: Number(v) })} type="number" />

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Campaign Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as AdCampaignType })} className="elegant-input w-full mt-1">
                <option value="restaurant_brought">Restaurant Brought Client — Restaurant gets 60%</option>
                <option value="platform">Platform Advertiser — Platform gets 60%</option>
              </select>
            </div>

            {isRestaurantBrought && (
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Restaurant</label>
                <select value={form.restaurantId ?? ""} onChange={(e) => setRestaurant(e.target.value)} className="elegant-input w-full mt-1">
                  {DEMO_RESTAURANTS.map((r) => (<option key={r.id} value={r.id}>{r.name}</option>))}
                </select>
              </div>
            )}

            <AdGameSelector assignedGames={form.assignedGames} onToggle={toggleGame} />
          </div>

          <div className="flex gap-2 pt-1">
            <button onClick={onCancel} className="elegant-btn-secondary flex-1">Cancel</button>
            <button onClick={() => onSave(form)} className="elegant-btn-primary flex-1">{campaign ? "Save Changes" : "Create Campaign"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
