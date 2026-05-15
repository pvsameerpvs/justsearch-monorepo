import Image from 'next/image';
import { X } from "lucide-react";

interface RestaurantPhotoGridProps {
  photos: string[];
  onRemove: (index: number) => void;
}

export function RestaurantPhotoGrid({ photos, onRemove }: RestaurantPhotoGridProps) {
  return (
    <>
      {photos.map((photo, index) => (
        <div key={index} className="relative aspect-square rounded-xl border border-slate-200 overflow-hidden group">
          <Image src={photo} alt={"Restaurant photo " + (index + 1)} fill sizes="128px" className="object-cover" />
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="h-3 w-3" />
          </button>
          <span className="absolute bottom-1.5 left-1.5 rounded-full bg-black/50 px-1.5 py-0.5 text-[10px] font-bold text-white">
            {index + 1}
          </span>
        </div>
      ))}
    </>
  );
}
