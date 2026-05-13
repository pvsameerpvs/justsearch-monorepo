"use client";

import { useState } from "react";
import type { Restaurant } from "@justsearch/utils";
import { updateRestaurant } from "@justsearch/utils";
import { PageHeader } from "@justsearch/ui";
import { HomepageEditorForm } from "./homepage-editor-form";
import { HomepagePreview } from "./homepage-preview";

export function HomepageEditor({ restaurant }: { restaurant: Restaurant }) {
  const [previewRestaurant, setPreviewRestaurant] = useState(restaurant);

  const handleUpdate = (updates: Partial<Restaurant>) => {
    const updated = { ...previewRestaurant, ...updates };
    setPreviewRestaurant(updated);
    updateRestaurant(restaurant.slug, updates);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Homepage" description="Edit what customers see on your homepage" />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,480px)]">
        <HomepageEditorForm restaurant={previewRestaurant} onUpdate={handleUpdate} />
        <HomepagePreview restaurant={previewRestaurant} />
      </div>
    </div>
  );
}
