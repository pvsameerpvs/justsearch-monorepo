import { Upload, X } from "lucide-react";
import { AdMediaPreview } from "./ad-media-preview";
import type { AdMediaType } from "@/lib/stores/ad-campaign-types";

interface AdMediaDropzoneContentProps {
  mediaType: AdMediaType;
  mediaUrl: string;
  isDragging: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onChange: (type: AdMediaType, url: string) => void;
}

export function AdMediaDropzoneContent({ mediaType, mediaUrl, isDragging, fileInputRef, onChange }: AdMediaDropzoneContentProps) {
  if (mediaUrl) {
    return (
      <div className="space-y-4">
        <AdMediaPreview type={mediaType} url={mediaUrl} />
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition-colors"
          >
            Change File
          </button>
          <button
            type="button"
            onClick={() => onChange(mediaType, "")}
            className="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100 transition-colors"
          >
            <X className="h-3 w-3" /> Remove
          </button>
        </div>
      </div>
    );
  }

  return (
    <button type="button" onClick={() => fileInputRef.current?.click()} className="space-y-3 w-full">
      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl mx-auto transition-colors ${isDragging ? "bg-indigo-200" : "bg-indigo-100"}`}>
        <Upload className="h-6 w-6 text-indigo-600" />
      </div>
      <div>
        <p className="text-sm font-bold text-slate-700">Drop {mediaType} here or click to upload</p>
        <p className="text-xs text-slate-400 mt-1">
          {mediaType === "video" ? "MP4, WebM up to 30MB" : mediaType === "gif" ? "GIF up to 5MB" : "PNG, JPG up to 5MB"}
        </p>
      </div>
    </button>
  );
}
