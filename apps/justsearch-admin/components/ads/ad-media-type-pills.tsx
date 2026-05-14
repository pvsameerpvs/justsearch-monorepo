import { Image, Film, FileImage } from "lucide-react";
import type { AdMediaType } from "@/lib/stores/ad-campaign-types";

interface AdMediaTypePillsProps {
  mediaType: AdMediaType;
  onChange: (type: AdMediaType) => void;
}

export function AdMediaTypePills({ mediaType, onChange }: AdMediaTypePillsProps) {
  const options = [
    { key: "image" as AdMediaType, label: "Image", icon: Image },
    { key: "video" as AdMediaType, label: "Video", icon: Film },
    { key: "gif" as AdMediaType, label: "GIF", icon: FileImage },
  ];

  return (
    <div className="flex gap-2">
      {options.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition-colors ${
            mediaType === key
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Icon className="h-3.5 w-3.5" />
          {label}
        </button>
      ))}
    </div>
  );
}
