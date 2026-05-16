"use client";

import { useEffect, useState } from "react";
import { useUpdateRestaurantMutation } from "@/lib/hooks/use-restaurant-query";
import { HomepageEditorForm } from "./homepage-editor-form";
import { HomepagePreview } from "./homepage-preview";
import { HomepageError } from "./homepage-error";
import type { RestaurantProfile } from "@/lib/hooks/use-restaurant-query";

interface HomepageEditorProps {
  restaurant: RestaurantProfile;
}

export function HomepageEditor({ restaurant }: HomepageEditorProps) {
  const [preview, setPreview] = useState(restaurant);
  const { mutate, isPending, error, reset } = useUpdateRestaurantMutation();

  useEffect(() => { setPreview(restaurant); }, [restaurant]);

  const handleUpdate = (updates: Partial<RestaurantProfile>) => {
    setPreview((p) => ({ ...p, ...updates }));
    mutate(updates);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,480px)]">
      <div className="space-y-5">
        {error && <HomepageError error={error} onRetry={reset} />}
        <HomepageEditorForm restaurant={preview} onUpdate={handleUpdate} isSaving={isPending} />
      </div>
      <HomepagePreview restaurant={preview} />
    </div>
  );
}
