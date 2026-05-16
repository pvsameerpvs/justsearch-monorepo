"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Upload, X, Link, ImageIcon, Loader2 } from "lucide-react";
import { useImageUpload } from "./use-image-upload";

type CompactImageUploadProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  aspect?: "square" | "landscape";
  placeholder?: string;
  folder?: string;
};

export function CompactImageUpload({
  value,
  onChange,
  label = "Image",
  aspect = "square",
  placeholder,
  folder = "menu",
}: CompactImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlValue, setUrlValue] = useState(value);
  const { upload, isUploading } = useImageUpload(folder);
  const isSquare = aspect === "square";

  const handleFile = async (file: File | null) => {
    if (!file?.type.startsWith("image/")) return;
    const url = await upload(file);
    onChange(url);
    setUrlValue(url);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleRemove = () => {
    onChange("");
    setUrlValue("");
  };

  const handleUrlSave = () => {
    onChange(urlValue);
    setShowUrlInput(false);
  };

  const triggerFilePicker = () => inputRef.current?.click();

  return (
    <div className="flex items-center gap-3">
      {isUploading ? (
        <UploadingState />
      ) : value ? (
        <>
          <Thumbnail src={value} alt={label} isSquare={isSquare} />
          <ImageActions
            onChangeClick={triggerFilePicker}
            onUrlToggle={() => {
              setShowUrlInput((s) => !s);
              setUrlValue(value);
            }}
            onRemove={handleRemove}
            showUrlInput={showUrlInput}
            urlValue={urlValue}
            onUrlChange={setUrlValue}
            onUrlSave={handleUrlSave}
            placeholder={placeholder}
          />
        </>
      ) : (
        <EmptyState
          onUploadClick={triggerFilePicker}
          showUrlInput={showUrlInput}
          urlValue={urlValue}
          onUrlChange={setUrlValue}
          onUrlToggle={() => {
            setShowUrlInput((s) => !s);
            setUrlValue("");
          }}
          onUrlSave={handleUrlSave}
          placeholder={placeholder}
        />
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        style={{ display: "none" }}
      />
    </div>
  );
}

function UploadingState() {
  return (
    <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
      <span className="text-xs text-slate-500">Uploading...</span>
    </div>
  );
}

function Thumbnail({
  src,
  alt,
  isSquare,
}: {
  src: string;
  alt: string;
  isSquare: boolean;
}) {
  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 ${isSquare ? "h-20 w-20" : "h-16 w-28"}`}
    >
      <Image src={src} alt={alt} fill className="object-cover" sizes={isSquare ? "80px" : "112px"} />
    </div>
  );
}

function ImageActions({
  onChangeClick,
  onUrlToggle,
  onRemove,
  showUrlInput,
  urlValue,
  onUrlChange,
  onUrlSave,
  placeholder,
}: {
  onChangeClick: () => void;
  onUrlToggle: () => void;
  onRemove: () => void;
  showUrlInput: boolean;
  urlValue: string;
  onUrlChange: (v: string) => void;
  onUrlSave: () => void;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <button
          onClick={onChangeClick}
          className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 transition-colors hover:bg-slate-200"
        >
          <Upload className="h-3 w-3" /> Change
        </button>
        <button
          onClick={onUrlToggle}
          className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 transition-colors hover:text-slate-600"
        >
          <Link className="h-3 w-3" /> URL
        </button>
        <button
          onClick={onRemove}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      {showUrlInput && (
        <div className="flex gap-1.5">
          <input
            value={urlValue}
            onChange={(e) => onUrlChange(e.target.value)}
            placeholder={placeholder ?? "https://..."}
            className="elegant-input h-7 flex-1 px-2 text-[11px]"
          />
          <button onClick={onUrlSave} className="elegant-btn-primary h-7 px-2 text-[11px]">
            Save
          </button>
        </div>
      )}
    </div>
  );
}

function EmptyState({
  onUploadClick,
  showUrlInput,
  urlValue,
  onUrlChange,
  onUrlToggle,
  onUrlSave,
  placeholder,
}: {
  onUploadClick: () => void;
  showUrlInput: boolean;
  urlValue: string;
  onUrlChange: (v: string) => void;
  onUrlToggle: () => void;
  onUrlSave: () => void;
  placeholder?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onUploadClick}
        className="flex h-20 w-20 shrink-0 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 transition-colors hover:border-slate-300 hover:bg-slate-50"
      >
        <ImageIcon className="h-5 w-5 text-slate-300" />
        <span className="text-[10px] font-semibold text-slate-400">Upload</span>
      </button>
      <div className="flex flex-col gap-1.5">
        <button
          onClick={onUrlToggle}
          className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 transition-colors hover:text-slate-600"
        >
          <Link className="h-3 w-3" /> Use URL instead
        </button>
        {showUrlInput && (
          <div className="flex gap-1.5">
            <input
              value={urlValue}
              onChange={(e) => onUrlChange(e.target.value)}
              placeholder={placeholder ?? "https://..."}
              className="elegant-input h-7 flex-1 px-2 text-[11px]"
            />
            <button onClick={onUrlSave} className="elegant-btn-primary h-7 px-2 text-[11px]">
              Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
