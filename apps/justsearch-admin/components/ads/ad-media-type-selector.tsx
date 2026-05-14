import { Image, Video, FileImage } from "lucide-react";
import type { AdMediaType } from "@/lib/stores/ad-campaign-types";

interface AdMediaTypeSelectorProps {
  mediaType: AdMediaType;
  onChange: (type: AdMediaType) => void;
}

export function AdMediaTypeSelector({ mediaType, onChange }: AdMediaTypeSelectorProps) {
  const options = [
    { value: "image" as AdMediaType, label: "Image", icon: Image },
    { value: "video" as AdMediaType, label: "Video", icon: Video },
    { value: "gif" as AdMediaType, label: "GIF", icon: FileImage },
  ];

  return (
    <div className="flex gap-2">
      {options.map((opt) => {
        const Icon = opt.icon;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition-colors ${
              mediaType === opt.value
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
