"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Upload, X, Link, Loader2 } from "lucide-react";
import { useImageUpload } from "./use-image-upload";

type NormalImageUploadProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  aspect?: "square" | "landscape";
  placeholder?: string;
  folder?: string;
};

export function NormalImageUpload({
  value,
  onChange,
  label = "Image",
  aspect = "landscape",
  placeholder,
  folder = "menu",
}: NormalImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlValue, setUrlValue] = useState(value);
  const { upload, isUploading } = useImageUpload(folder);
  const isLandscape = aspect === "landscape";

  const handleFile = async (file: File | null) => {
    if (!file?.type.startsWith("image/")) return;
    const url = await upload(file);
    onChange(url);
    setUrlValue(url);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    await handleFile(e.dataTransfer.files[0] ?? null);
  };

  const handleRemove = () => {
    onChange("");
    setUrlValue("");
  };

  const handleUrlSave = () => {
    onChange(urlValue);
    setShowUrlInput(false);
  };

  return (
    <div className="space-y-2">
      {isUploading ? (
        <UploadingPlaceholder />
      ) : value ? (
        <ImagePreview
          src={value}
          alt={label}
          isLandscape={isLandscape}
          onRemove={handleRemove}
          onChangeClick={() => inputRef.current?.click()}
        />
      ) : (
        <DropZone onDrop={handleDrop} onClick={() => inputRef.current?.click()} />
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        style={{ display: "none" }}
      />
      <UrlToggle
        show={showUrlInput}
        value={urlValue}
        onChange={setUrlValue}
        onToggle={() => {
          setShowUrlInput((s) => !s);
          setUrlValue(value);
        }}
        onSave={handleUrlSave}
        placeholder={placeholder}
      />
    </div>
  );
}

function UploadingPlaceholder() {
  return (
    <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-6">
      <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
      <span className="text-sm text-slate-500">Uploading...</span>
    </div>
  );
}

function ImagePreview({
  src,
  alt,
  isLandscape,
  onRemove,
  onChangeClick,
}: {
  src: string;
  alt: string;
  isLandscape: boolean;
  onRemove: () => void;
  onChangeClick: () => void;
}) {
  return (
    <div
      className={`relative max-h-48 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 ${isLandscape ? "aspect-video" : "aspect-square max-w-48"}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes={isLandscape ? "400px" : "200px"}
      />
      <div className="absolute right-2 top-2 flex gap-1.5">
        <button
          onClick={onChangeClick}
          className="flex h-8 items-center gap-1 rounded-full bg-white/90 px-2.5 text-xs font-semibold text-slate-600 shadow-sm transition-colors hover:bg-white hover:text-slate-900"
        >
          <Upload className="h-3 w-3" /> Change
        </button>
        <button
          onClick={onRemove}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow-sm transition-colors hover:bg-white hover:text-red-500"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function DropZone({
  onDrop,
  onClick,
}: {
  onDrop: (e: React.DragEvent) => void;
  onClick: () => void;
}) {
  return (
    <div
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={onClick}
      className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-6 transition-colors hover:border-slate-400 hover:bg-slate-50"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
        <Upload className="h-5 w-5 text-slate-400" />
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-slate-700">Click to upload</p>
        <p className="text-xs text-slate-400">or drag and drop</p>
      </div>
    </div>
  );
}

function UrlToggle({
  show,
  value,
  onChange,
  onToggle,
  onSave,
  placeholder,
}: {
  show: boolean;
  value: string;
  onChange: (v: string) => void;
  onToggle: () => void;
  onSave: () => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <button
        onClick={onToggle}
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 transition-colors hover:text-slate-600"
      >
        <Link className="h-3 w-3" />
        {show ? "Hide URL" : "Use URL instead"}
      </button>
      {show && (
        <div className="flex gap-2">
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder ?? "https://..."}
            className="elegant-input flex-1 text-xs"
          />
          <button onClick={onSave} className="elegant-btn-primary px-3 text-xs">
            Save URL
          </button>
        </div>
      )}
    </div>
  );
}
