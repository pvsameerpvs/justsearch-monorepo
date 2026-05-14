"use client";

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
    return <img src={mediaUrl} alt="Ad" className="h-full w-full object-cover" />;
  }
  return <div className="flex h-full items-center justify-center text-6xl">{mediaUrl}</div>;
}
