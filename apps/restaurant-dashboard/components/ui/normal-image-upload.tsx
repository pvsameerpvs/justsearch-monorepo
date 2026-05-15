"use client";

import Image from 'next/image';
import { useRef, useState } from "react";
import { Upload, X, Link } from "lucide-react";

interface NormalImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  aspect?: "square" | "landscape";
  placeholder?: string;
}

export function NormalImageUpload({ value, onChange, label = "Image", aspect = "landscape", placeholder }: NormalImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlValue, setUrlValue] = useState(value);

  const handleFile = (file: File | null) => {
    if (file && file.type.startsWith("image/")) {
      const blobUrl = URL.createObjectURL(file);
      onChange(blobUrl);
      setUrlValue(blobUrl);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0] ?? null);
  };

  const handleRemove = () => { onChange(""); setUrlValue(""); };
  const handleUrlSave = () => { onChange(urlValue); setShowUrlInput(false); };

  return (
    <div className="space-y-2">
      {value ? (
        <div className={`relative rounded-xl border border-slate-200 overflow-hidden bg-slate-50 max-h-48 ${aspect === "landscape" ? "aspect-video" : "aspect-square max-w-48"}`}>
          <Image src={value} alt={label} fill className="object-cover" sizes={aspect === "landscape" ? "400px" : "200px"} />
          <button onClick={handleRemove} className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow-sm hover:bg-white hover:text-red-500 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} onClick={() => inputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-6 transition-colors hover:border-slate-400 hover:bg-slate-50">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100"><Upload className="h-5 w-5 text-slate-400" /></div>
          <div className="text-center"><p className="text-sm font-semibold text-slate-700">Click to upload</p><p className="text-xs text-slate-400">or drag and drop</p></div>
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" onChange={(e) => handleFile(e.target.files?.[0] ?? null)} className="hidden" />
      <div className="flex items-center gap-2">
        <button onClick={() => { setShowUrlInput(!showUrlInput); setUrlValue(value); }} className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors">
          <Link className="h-3 w-3" /> {showUrlInput ? "Hide URL" : "Use URL instead"}
        </button>
      </div>
      {showUrlInput && (
        <div className="flex gap-2">
          <input value={urlValue} onChange={(e) => setUrlValue(e.target.value)} placeholder={placeholder ?? "https://..."} className="elegant-input flex-1 text-xs" />
          <button onClick={handleUrlSave} className="elegant-btn-primary text-xs px-3">Save URL</button>
        </div>
      )}
    </div>
  );
}
