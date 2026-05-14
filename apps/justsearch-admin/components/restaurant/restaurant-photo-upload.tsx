"use client";

import { useRef } from "react";
import { ImagePlus, X } from "lucide-react";

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
        {photos.map((photo, index) => (
          <div key={index} className="relative aspect-square rounded-xl border border-slate-200 overflow-hidden group">
            <img src={photo} alt={"Restaurant photo " + (index + 1)} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-3 w-3" />
            </button>
            <span className="absolute bottom-1.5 left-1.5 rounded-full bg-black/50 px-1.5 py-0.5 text-[10px] font-bold text-white">
              {index + 1}
            </span>
          </div>
        ))}
        {remaining > 0 && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 text-slate-400 hover:border-amber-400 hover:bg-amber-50/30 hover:text-amber-600 transition-all"
          >
            <ImagePlus className="h-6 w-6" />
            <span className="text-[10px] font-bold">Add Photo</span>
            <span className="text-[10px]">{remaining} left</span>
          </button>
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
