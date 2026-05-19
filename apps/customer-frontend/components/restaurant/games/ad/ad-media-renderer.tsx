"use client";

import { useState } from "react";
import Image from "next/image";

interface AdMediaRendererProps {
  mediaType: string;
  mediaUrl: string;
  linkUrl: string;
  isMuted: boolean;
  onEnded?: () => void;
}

export function AdMediaRenderer({ mediaType, mediaUrl, linkUrl, isMuted, onEnded }: AdMediaRendererProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-slate-900">
        <span className="text-6xl opacity-50">{mediaUrl || "🎯"}</span>
      </div>
    );
  }

  const hasLink = typeof linkUrl === 'string' && linkUrl.startsWith("http");

  if (mediaType === "video") {
    return (
      <div className="relative h-full w-full">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
          </div>
        )}
        <video
          src={mediaUrl}
          autoPlay
          muted={isMuted}
          loop={false}
          playsInline
          className="h-full w-full object-cover"
          onLoadedData={() => setIsLoading(false)}
          onError={() => { setHasError(true); setIsLoading(false); }}
          onEnded={onEnded}
          onClick={() => hasLink && window.open(linkUrl, '_blank', 'noopener,noreferrer')}
          style={{ cursor: hasLink ? 'pointer' : undefined }}
        />
      </div>
    );
  }

  const isValidUrl = typeof mediaUrl === 'string' && (mediaUrl.startsWith("http://") || mediaUrl.startsWith("https://") || mediaUrl.startsWith("/"));

  if (!isValidUrl) {
    return <div className="flex h-full items-center justify-center text-6xl">{mediaUrl}</div>;
  }

  const imageContent = (
    <div className="relative h-full w-full">
      {isLoading && (
        <div className="absolute inset-0 flex animate-pulse items-center justify-center bg-slate-800" />
      )}
      <Image
        src={mediaUrl}
        alt="Ad"
        fill
        className={`object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        sizes="100vw"
        unoptimized
        onLoad={() => setIsLoading(false)}
        onError={() => { setHasError(true); setIsLoading(false); }}
      />
    </div>
  );

  if (hasLink) {
    return (
      <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="block h-full w-full">
        {imageContent}
      </a>
    );
  }

  return imageContent;
}
