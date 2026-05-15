"use client";
import Image from 'next/image';
import { useRef, useState } from "react";
import { Upload, X, Link, ImageIcon } from "lucide-react";

interface CompactImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  aspect?: "square" | "landscape";
  placeholder?: string;
}

export function CompactImageUpload({ value, onChange, label = "Image", aspect = "square", placeholder }: CompactImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlValue, setUrlValue] = useState(value);
  const isSquare = aspect === "square";

  const handleFile = (file: File | null) => {
    if (file && file.type.startsWith("image/")) {
      const blobUrl = URL.createObjectURL(file);
      onChange(blobUrl);
      setUrlValue(blobUrl);
    }
  };

  const handleRemove = () => { onChange(""); setUrlValue(""); };
  const handleUrlSave = () => { onChange(urlValue); setShowUrlInput(false); };

  if (value) {
    return (
      <div className="flex items-center gap-3">
        <div className={`relative shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 ${isSquare ? "h-20 w-20" : "h-16 w-28"}`}>
          <Image src={value} alt={label} fill className="object-cover" sizes={isSquare ? "80px" : "112px"} />
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <button onClick={() => inputRef.current?.click()} className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-200 transition-colors">
              <Upload className="h-3 w-3" /> Change
            </button>
            <button onClick={() => { setShowUrlInput((s) => !s); setUrlValue(value); }} className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 hover:text-slate-600">
              <Link className="h-3 w-3" /> URL
            </button>
            <button onClick={handleRemove} className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          {showUrlInput && (
            <div className="flex gap-1.5">
              <input value={urlValue} onChange={(e) => setUrlValue(e.target.value)} placeholder={placeholder ?? "https://..."} className="elegant-input h-7 flex-1 text-[11px] px-2" />
              <button onClick={handleUrlSave} className="elegant-btn-primary h-7 px-2 text-[11px]">Save</button>
            </div>
          )}
        </div>
        <input ref={inputRef} type="file" accept="image/*" onChange={(e) => handleFile(e.target.files?.[0] ?? null)} className="hidden" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <button onClick={() => inputRef.current?.click()} className="flex h-20 w-20 shrink-0 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 transition-colors hover:border-slate-300 hover:bg-slate-50">
        <ImageIcon className="h-5 w-5 text-slate-300" />
        <span className="text-[10px] font-semibold text-slate-400">Upload</span>
      </button>
      <div className="flex flex-col gap-1.5">
        <button onClick={() => { setShowUrlInput(!showUrlInput); setUrlValue(""); }} className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 hover:text-slate-600">
          <Link className="h-3 w-3" /> Use URL instead
        </button>
        {showUrlInput && (
          <div className="flex gap-1.5">
            <input value={urlValue} onChange={(e) => setUrlValue(e.target.value)} placeholder={placeholder ?? "https://..."} className="elegant-input h-7 flex-1 text-[11px] px-2" />
            <button onClick={handleUrlSave} className="elegant-btn-primary h-7 px-2 text-[11px]">Save</button>
          </div>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" onChange={(e) => handleFile(e.target.files?.[0] ?? null)} className="hidden" />
    </div>
  );
}
