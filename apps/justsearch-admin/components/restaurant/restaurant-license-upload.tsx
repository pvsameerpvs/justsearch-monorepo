"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, FileCheck } from "lucide-react";

interface RestaurantLicenseUploadProps {
  licenseUrl: string;
  onChange: (url: string) => void;
}

export function RestaurantLicenseUpload({ licenseUrl, onChange }: RestaurantLicenseUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) onChange(result);
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

  const isPdf = licenseUrl.toLowerCase().includes("pdf") || licenseUrl.startsWith("data:application/pdf");

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      className={`relative rounded-xl border-2 border-dashed p-5 text-center transition-all ${
        isDragging ? "border-amber-500 bg-amber-50/50" : licenseUrl ? "border-emerald-200 bg-emerald-50/30" : "border-slate-300 bg-slate-50/50 hover:border-slate-400"
      }`}
    >
      <input ref={fileInputRef} type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={onFileSelect} className="hidden" />

      {licenseUrl ? (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100">
            <FileCheck className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="text-sm font-bold text-slate-700">{isPdf ? "License PDF Uploaded" : "License Document Uploaded"}</p>
            <p className="text-[11px] text-slate-500 truncate">{licenseUrl.slice(0, 60)}...</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button type="button" onClick={() => fileInputRef.current?.click()} className="rounded-lg px-2.5 py-1.5 text-xs font-bold text-amber-600 hover:bg-amber-50 transition-colors">Change</button>
            <button type="button" onClick={() => onChange("")} className="flex h-7 w-7 items-center justify-center rounded-lg text-red-400 hover:bg-red-50 transition-colors">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center gap-2 w-full">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
            <Upload className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-700">Drop license here or click to upload</p>
            <p className="text-[11px] text-slate-400 mt-0.5">PDF, PNG, JPG up to 5MB</p>
          </div>
        </button>
      )}
    </div>
  );
}
