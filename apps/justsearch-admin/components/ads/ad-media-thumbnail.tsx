import { Image as ImageIcon, Video, FileImage } from "lucide-react";
import type { AdCampaign } from "@/lib/stores/ad-campaign-types";

interface AdMediaThumbnailProps {
  campaign: AdCampaign;
  className?: string;
}

export function AdMediaThumbnail({ campaign, className = "h-10 w-10" }: AdMediaThumbnailProps) {
  const hasUrl = campaign.mediaUrl && campaign.mediaUrl.trim() !== "";

  if (campaign.mediaType === "video") {
    return (
      <div className={`relative flex items-center justify-center rounded-lg bg-slate-100 overflow-hidden ${className}`}>
        {hasUrl ? (
          <video src={campaign.mediaUrl.trim()} className="h-full w-full object-cover" muted preload="metadata" />
        ) : (
          <Video className="h-4 w-4 text-slate-500" />
        )}
      </div>
    );
  }

  if (campaign.mediaType === "gif") {
    return (
      <div className={`relative flex items-center justify-center rounded-lg bg-slate-100 overflow-hidden ${className}`}>
        {hasUrl ? (
          <img src={campaign.mediaUrl.trim()} alt="" className="h-full w-full object-cover" />
        ) : (
          <FileImage className="h-4 w-4 text-slate-500" />
        )}
      </div>
    );
  }

  return (
    <div className={`relative flex items-center justify-center rounded-lg bg-slate-100 overflow-hidden ${className}`}>
      {hasUrl ? (
        <img src={campaign.mediaUrl.trim()} alt="" className="h-full w-full object-cover" />
      ) : (
        <ImageIcon className="h-4 w-4 text-slate-500" />
      )}
    </div>
  );
}
