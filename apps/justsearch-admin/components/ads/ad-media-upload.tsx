"use client";

import { useState, useCallback } from "react";
import { AdMediaTypePills } from "./ad-media-type-pills";
import { AdMediaDropzone } from "./ad-media-dropzone";
import type { AdMediaType } from "@/lib/stores/ad-campaign-types";

interface AdMediaUploadProps {
  mediaType: AdMediaType;
  mediaUrl: string;
  onChange: (type: AdMediaType, url: string) => void;
}

export function AdMediaUpload({ mediaType, mediaUrl, onChange }: AdMediaUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (!result) return;
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
      >
        <AdMediaDropzone mediaType={mediaType} mediaUrl={mediaUrl} isDragging={isDragging} onFileSelect={onFileSelect} />
      </div>
    </div>
  );
}
