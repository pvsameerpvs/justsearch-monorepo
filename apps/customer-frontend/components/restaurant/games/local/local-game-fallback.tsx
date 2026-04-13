"use client";

type LocalGameFallbackProps = {
  localGameId: string;
};

export function LocalGameFallback({ localGameId }: LocalGameFallbackProps) {
  return (
    <div className="flex h-[100dvh] w-full items-center justify-center bg-[rgba(15,23,42,0.9)] px-5 text-center text-white">
      <p className="text-sm font-semibold">
        Local game not connected: <span className="font-mono">{localGameId}</span>
      </p>
    </div>
  );
}
