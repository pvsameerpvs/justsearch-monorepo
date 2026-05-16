"use client";

import { useState } from "react";
import { uploadImage } from "@/lib/api/upload.api";

export function useImageUpload(folder = "general") {
  const [isUploading, setIsUploading] = useState(false);

  const upload = async (file: File): Promise<string> => {
    setIsUploading(true);
    try {
      const { url } = await uploadImage(URL.createObjectURL(file), folder);
      return url;
    } finally {
      setIsUploading(false);
    }
  };

  return { upload, isUploading };
}
