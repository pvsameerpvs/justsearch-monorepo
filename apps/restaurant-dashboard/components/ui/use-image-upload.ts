"use client";

import { useState } from "react";
import { uploadImage } from "@/lib/api/upload.api";

export function useImageUpload(folder = "general") {
  const [isUploading, setIsUploading] = useState(false);

  const upload = async (file: File): Promise<string> => {
    setIsUploading(true);
    const blobUrl = URL.createObjectURL(file);
    try {
      const { url } = await uploadImage(blobUrl, folder);
      return url;
    } finally {
      URL.revokeObjectURL(blobUrl);
      setIsUploading(false);
    }
  };

  return { upload, isUploading };
}
