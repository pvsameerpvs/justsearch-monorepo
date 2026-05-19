"use client";

import { useRef, useState, useCallback } from "react";
import Image from "next/image";

interface AdMediaRendererProps {
  mediaType: string;
  mediaUrl: string;
  mediaUrlLow: string;
  linkUrl: string;
  isMuted: boolean;
  onEnded?: () => void;
}

export function AdMediaRenderer({ mediaType, mediaUrl, mediaUrlLow, linkUrl, isMuted, onEnded }: AdMediaRendererProps) {
  const lowRef = useRef<HTMLVideoElement>(null);
  const hdRef = useRef<HTMLVideoElement>(null);
  const [hdReady, setHdReady] = useState(false);
  const [hasError, setHasError] = useState(false);

  const hasLink = typeof linkUrl === "string" && linkUrl.startsWith("http");

  const handleHdReady = useCallback(() => {
    if (!lowRef.current || !hdRef.current) return;
    // Sync playback position so swap is seamless
    hdRef.current.currentTime = lowRef.current.currentTime;
    hdRef.current.muted = lowRef.current.muted;
    setHdReady(true);
    hdRef.current.play().catch(() => {});
  }, []);

  const handleClick = useCallback(() => {
    if (hasLink) window.open(linkUrl, "_blank", "noopener,noreferrer");
  }, [hasLink, linkUrl]);

  if (hasError) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-slate-900">
        <span className="text-6xl opacity-50">{mediaUrl || "🎯"}</span>
      </div>
    );
  }

  if (mediaType === "video") {
    const hasLow = typeof mediaUrlLow === "string" && mediaUrlLow.length > 0;
    const lowSrc = hasLow ? mediaUrlLow : mediaUrl;

    return (
      <div className="relative h-full w-full bg-black" onClick={handleClick} style={{ cursor: hasLink ? "pointer" : undefined }}>
        {/* Low-quality layer: plays instantly, fades out when HD ready */}
        <video
          ref={lowRef}
          src={lowSrc}
          autoPlay
          muted={isMuted}
          loop={false}
          playsInline
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
          style={{ opacity: hdReady ? 0 : 1, zIndex: hdReady ? 0 : 10 }}
          onError={() => setHasError(true)}
          onEnded={onEnded}
        />

        {/* High-quality layer: hidden, preloads, fades in when ready */}
        {hasLow && (
          <video
            ref={hdRef}
            src={mediaUrl}
            muted={isMuted}
            loop={false}
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
            style={{ opacity: hdReady ? 1 : 0, zIndex: hdReady ? 10 : 0 }}
            onCanPlayThrough={handleHdReady}
            onError={() => setHasError(true)}
            onEnded={onEnded}
          />
        )}
      </div>
    );
  }

  const isValidUrl = typeof mediaUrl === "string" && (mediaUrl.startsWith("http://") || mediaUrl.startsWith("https://") || mediaUrl.startsWith("/"));
  if (!isValidUrl) {
    return <div className="flex h-full items-center justify-center text-6xl">{mediaUrl}</div>;
  }

  const imageContent = (
    <div className="relative h-full w-full">
      <Image src={mediaUrl} alt="Ad" fill className="object-cover" sizes="100vw" unoptimized onError={() => setHasError(true)} />
    </div>
  );

  return hasLink ? (
    <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="block h-full w-full">
      {imageContent}
    </a>
  ) : imageContent;
}
