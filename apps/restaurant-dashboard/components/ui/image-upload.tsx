"use client";

import { NormalImageUpload } from "./normal-image-upload";
import { CompactImageUpload } from "./compact-image-upload";

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  aspect?: "square" | "landscape";
  size?: "compact" | "normal";
  placeholder?: string;
  folder?: string;
}

export function ImageUpload({ size = "normal", folder, ...props }: ImageUploadProps) {
  if (size === "compact") {
    return <CompactImageUpload {...props} folder={folder} />;
  }
  return <NormalImageUpload {...props} folder={folder} />;
}
