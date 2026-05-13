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
}

export function ImageUpload({ size = "normal", ...props }: ImageUploadProps) {
  if (size === "compact") {
    return <CompactImageUpload {...props} />;
  }
  return <NormalImageUpload {...props} />;
}
