"use client";

type EmbeddedIframeGameProps = {
  src: string;
  title: string;
};

export function EmbeddedIframeGame({ src, title }: EmbeddedIframeGameProps) {
  return (
    <div className="mx-auto w-full max-w-[960px] overflow-hidden rounded-[28px] border border-[rgb(var(--card-border)/0.9)] bg-black shadow-sm">
      <iframe
        src={src}
        title={title}
        className="h-[70vh] w-full border-none outline-none sm:h-[640px]"
        sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms"
        allow="fullscreen"
      />
    </div>
  );
}
