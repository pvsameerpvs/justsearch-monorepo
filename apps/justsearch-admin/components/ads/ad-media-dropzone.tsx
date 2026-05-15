"use client";

import { useRef } from "react";
import { Upload, Image as ImageIcon, Video, FileImage } from "lucide-react";
import Image from "next/image";
import type { AdMediaType } from "@/lib/stores/ad-campaign-types";

interface AdMediaDropzoneProps {
  mediaType: AdMediaType;
  mediaUrl: string;
  isDragging: boolean;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function AdMediaDropzone({ mediaType, mediaUrl, isDragging, onFileSelect }: AdMediaDropzoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasUrl = mediaUrl && mediaUrl.trim() !== "";

  return (
    <div
      className={`relative rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
        isDragging ? "border-indigo-500 bg-indigo-50 scale-[1.01] shadow-sm" : "border-slate-200 bg-slate-50"
      }`}
    >
      <input ref={fileInputRef} type="file" accept={mediaType === "video" ? "video/*" : mediaType === "gif" ? "image/gif" : "image/*"} onChange={onFileSelect} className="hidden" />
      {hasUrl ? (
        <div className="space-y-3">
          {mediaType === "video" ? (
            <video src={mediaUrl} className="mx-auto h-32 rounded-xl object-cover shadow-sm" muted loop playsInline />
          ) : (
            <div className="relative mx-auto h-32 w-32">
              <Image src={mediaUrl} alt="Preview" fill sizes="128px" className="rounded-xl object-cover shadow-sm" />
            </div>
          )}
          <button type="button" onClick={() => fileInputRef.current?.click()} className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
            Replace file
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center gap-2 w-full">
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${isDragging ? "bg-indigo-100 text-indigo-600" : "bg-white text-slate-400 shadow-sm"} transition-colors`}>
            <Upload className="h-5 w-5" />
          </div>
          <p className="text-sm font-bold text-slate-700">Drop file here or click to upload</p>
          <p className="text-xs text-slate-500">Supports images, GIFs, and short videos</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="flex items-center gap-1 rounded-md bg-white px-2 py-0.5 text-[10px] font-bold text-slate-500 shadow-sm ring-1 ring-slate-100"><ImageIcon className="h-3 w-3" /> Image</span>
            <span className="flex items-center gap-1 rounded-md bg-white px-2 py-0.5 text-[10px] font-bold text-slate-500 shadow-sm ring-1 ring-slate-100"><FileImage className="h-3 w-3" /> GIF</span>
            <span className="flex items-center gap-1 rounded-md bg-white px-2 py-0.5 text-[10px] font-bold text-slate-500 shadow-sm ring-1 ring-slate-100"><Video className="h-3 w-3" /> Video</span>
          </div>
        </button>
      )}
    </div>
  );
}
