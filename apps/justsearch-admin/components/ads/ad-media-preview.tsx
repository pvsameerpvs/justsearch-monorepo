import type { AdMediaType } from "@/lib/stores/ad-campaign-types";

interface AdMediaPreviewProps {
  type: AdMediaType;
  url: string;
}

export function AdMediaPreview({ type, url }: AdMediaPreviewProps) {
  if (type === "video") {
    return <video src={url} controls className="mx-auto max-h-48 rounded-lg" />;
  }
  if (type === "gif" || type === "image") {
    return <img src={url} alt="Ad preview" className="mx-auto max-h-48 rounded-lg object-cover" />;
  }
  return null;
}
