"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X } from "lucide-react";
import { AdMediaTypeSelector } from "./ad-media-type-selector";
import { AdMediaPreview } from "./ad-media-preview";
import type { AdMediaType } from "@/lib/stores/ad-campaign-types";

interface AdMediaUploadProps {
  mediaType: AdMediaType;
  mediaUrl: string;
  onChange: (type: AdMediaType, url: string) => void;
}

export function AdMediaUpload({ mediaType, mediaUrl, onChange }: AdMediaUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (file.type.startsWith("image/gif")) onChange("gif", result);
      else if (file.type.startsWith("video/")) onChange("video", result);
      else if (file.type.startsWith("image/")) onChange("image", result);
    };
    reader.readAsDataURL(file);
  }, [onChange]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const onFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <div className="space-y-3">
      <AdMediaTypeSelector mediaType={mediaType} onChange={(t) => onChange(t, mediaUrl)} />

      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={`relative rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
          isDragging ? "border-indigo-500 bg-indigo-50" : "border-slate-200 bg-slate-50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={mediaType === "video" ? "video/*" : mediaType === "gif" ? "image/gif" : "image/*"}
          onChange={onFileSelect}
          className="hidden"
        />

        {mediaUrl ? (
          <div className="space-y-3">
            <AdMediaPreview type={mediaType} url={mediaUrl} />
            <div className="flex items-center justify-center gap-2">
              <button onClick={() => fileInputRef.current?.click()} className="text-xs font-bold text-indigo-600 hover:text-indigo-700">Change file</button>
              <span className="text-slate-300">|</span>
              <button onClick={() => onChange(mediaType, "")} className="flex items-center gap-1 text-xs font-bold text-red-500 hover:text-red-600"><X className="h-3 w-3" /> Remove</button>
            </div>
          </div>
        ) : (
          <button onClick={() => fileInputRef.current?.click()} className="space-y-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 mx-auto">
              <Upload className="h-5 w-5 text-indigo-600" />
            </div>
            <p className="text-xs font-bold text-slate-700">Drop {mediaType} here or click to upload</p>
            <p className="text-[10px] text-slate-400">{mediaType === "video" ? "MP4, WebM up to 30MB" : mediaType === "gif" ? "GIF up to 5MB" : "PNG, JPG up to 5MB"}</p>
          </button>
        )}
      </div>
    </div>
  );
}
