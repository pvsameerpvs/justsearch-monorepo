"use client";

import Image from 'next/image';

interface AdMediaRendererProps {
  mediaType: string;
  mediaUrl: string;
  isMuted: boolean;
  onEnded?: () => void;
}

export function AdMediaRenderer({ mediaType, mediaUrl, isMuted, onEnded }: AdMediaRendererProps) {
  if (mediaType === "video") {
    return (
      <video
        src={mediaUrl}
        autoPlay
        muted={isMuted}
        loop={false}
        playsInline
        className="h-full w-full object-cover"
        onEnded={onEnded}
      />
    );
  }
  if (mediaType === "image" || mediaType === "gif") {
    const isValidUrl = mediaUrl.startsWith("http://") || mediaUrl.startsWith("https://") || mediaUrl.startsWith("/");
    if (!isValidUrl) {
      return <div className="flex h-full items-center justify-center text-6xl">{mediaUrl}</div>;
    }
    return (
      <div className="relative h-full w-full">
        <Image src={mediaUrl} alt="Ad" fill className="object-cover" sizes="100vw" />
      </div>
    );
  }
  return <div className="flex h-full items-center justify-center text-6xl">{mediaUrl}</div>;
}
