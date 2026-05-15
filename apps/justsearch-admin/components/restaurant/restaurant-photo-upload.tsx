"use client";

import { useRef } from "react";
import { RestaurantPhotoGrid } from "./restaurant-photo-grid";
import { RestaurantUploadTrigger } from "./restaurant-upload-trigger";

interface RestaurantPhotoUploadProps {
  photos: string[];
  onChange: (photos: string[]) => void;
}

export function RestaurantPhotoUpload({ photos, onChange }: RestaurantPhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_PHOTOS = 4;

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const fileArray = Array.from(files);
    const remainingSlots = MAX_PHOTOS - photos.length;
    const toProcess = fileArray.slice(0, remainingSlots);

    let newPhotos: string[] = [];
    let processed = 0;

    toProcess.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        if (result) newPhotos.push(result);
        processed++;
        if (processed === toProcess.length) {
          onChange([...photos, ...newPhotos]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemove = (index: number) => {
    onChange(photos.filter((_, i) => i !== index));
  };

  const remaining = MAX_PHOTOS - photos.length;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <RestaurantPhotoGrid photos={photos} onRemove={handleRemove} />
        {remaining > 0 && (
          <RestaurantUploadTrigger remaining={remaining} onClick={() => fileInputRef.current?.click()} />
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
