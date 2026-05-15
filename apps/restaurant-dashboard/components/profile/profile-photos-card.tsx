"use client";

import Image from 'next/image';
import { ImageIcon, X } from "lucide-react";
import type { AdminRestaurant } from "@/lib/types/admin-restaurant";

interface ProfilePhotosCardProps {
  restaurant: AdminRestaurant;
  onUpdate?: (updates: Partial<AdminRestaurant>) => void;
}

export function ProfilePhotosCard({ restaurant, onUpdate }: ProfilePhotosCardProps) {
  const photos = restaurant.photos || [];

  const handleRemove = (index: number) => {
    const updated = photos.filter((_, i) => i !== index);
    onUpdate?.({ photos: updated });
  };

  if (photos.length === 0) {
    return (
      <div className="elegant-card p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50">
            <ImageIcon className="h-5 w-5 text-rose-500" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Restaurant Photos</h3>
        </div>
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-6 text-center">
          <ImageIcon className="mx-auto h-8 w-8 text-slate-300 mb-2" />
          <p className="text-sm text-slate-500">No photos uploaded yet</p>
          <p className="text-xs text-slate-400 mt-1">Admin will upload photos from the platform dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="elegant-card p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50">
          <ImageIcon className="h-5 w-5 text-rose-500" />
        </div>
        <h3 className="text-base font-bold text-slate-900">Restaurant Photos</h3>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">{photos.length} / 4</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {photos.map((photo, index) => (
          <div key={index} className="relative aspect-square rounded-xl border border-slate-200 overflow-hidden group">
            <Image src={photo} alt={`Restaurant photo ${index + 1}`} fill className="object-cover" sizes="(max-width: 640px) 50vw, 25vw" />
            {onUpdate && (
              <button
                onClick={() => handleRemove(index)}
                className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove"
              >
                <X className="h-3 w-3" />
              </button>
            )}
            <span className="absolute bottom-1.5 left-1.5 rounded-full bg-black/50 px-1.5 py-0.5 text-[10px] font-bold text-white">{index + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
