"use client";

import { useState, useRef, useCallback } from "react";
import { AdMediaTypePills } from "./ad-media-type-pills";
import { AdMediaDropzoneContent } from "./ad-media-dropzone-content";
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
      <AdMediaTypePills mediaType={mediaType} onChange={(t) => onChange(t, mediaUrl)} />
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={`relative rounded-xl border-2 border-dashed p-8 text-center transition-all ${
          isDragging ? "border-indigo-500 bg-indigo-50 scale-[1.01]" : "border-slate-300 bg-slate-50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={mediaType === "video" ? "video/*" : mediaType === "gif" ? "image/gif" : "image/*"}
          onChange={onFileSelect}
          className="hidden"
        />
        <AdMediaDropzoneContent
          mediaType={mediaType}
          mediaUrl={mediaUrl}
          isDragging={isDragging}
          fileInputRef={fileInputRef}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
