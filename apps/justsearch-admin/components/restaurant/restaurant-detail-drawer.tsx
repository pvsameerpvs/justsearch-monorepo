"use client";

import { useState } from "react";
import type { AdminRestaurant } from "@/lib/types/restaurant.types";
import { RestaurantDetailHeader } from "./restaurant-detail-header";
import { RestaurantDetailContent } from "./restaurant-detail-content";

interface RestaurantDetailDrawerProps {
  restaurant: AdminRestaurant;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: (updates: Partial<AdminRestaurant>) => void;
  onRequestDelete: () => void;
}

export function RestaurantDetailDrawer({ restaurant, isOpen, onClose, onUpdate, onRequestDelete }: RestaurantDetailDrawerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<Partial<AdminRestaurant>>({});

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdate?.(form);
    setIsEditing(false);
    setForm({});
  };

  const handleEdit = () => {
    setForm({ ...restaurant });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setForm({});
  };

  const handleChange = (field: keyof AdminRestaurant, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotosChange = (photos: string[]) => {
    setForm((prev) => ({ ...prev, photos }));
    if (!isEditing) onUpdate?.({ photos });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative h-full w-full max-w-xl overflow-y-auto bg-white shadow-2xl">
        <RestaurantDetailHeader
          restaurant={restaurant}
          isEditing={isEditing}
          onEdit={handleEdit}
          onSave={handleSave}
          onCancel={handleCancel}
          onClose={onClose}
        />
        <RestaurantDetailContent
          restaurant={restaurant}
          isEditing={isEditing}
          form={form}
          onChange={handleChange}
          onPhotosChange={handlePhotosChange}
          onUpdate={onUpdate ?? (() => {})}
          onRequestDelete={onRequestDelete}
        />
      </div>
    </div>
  );
}
