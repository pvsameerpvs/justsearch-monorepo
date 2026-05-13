"use client";

import { useState } from "react";
import { ImagePlus } from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";

export function MenuHeroEditor() {
  const [heroUrl, setHeroUrl] = useState("https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=2070");

  return (
    <div className="elegant-card p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
          <ImagePlus className="h-4 w-4" />
        </div>
        <h3 className="text-sm font-bold text-slate-900">Menu Hero Image</h3>
      </div>
      <ImageUpload value={heroUrl} onChange={setHeroUrl} label="Menu Hero" aspect="landscape" />
    </div>
  );
}
