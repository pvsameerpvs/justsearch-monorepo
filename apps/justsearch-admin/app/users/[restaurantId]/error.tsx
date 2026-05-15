'use client';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center gap-3 p-4">
      <h2 className="text-sm font-bold text-slate-900">Something went wrong</h2>
      <p className="text-xs text-slate-500">{error.message}</p>
      <button onClick={reset} className="rounded-lg bg-amber-500 px-3 py-2 text-xs font-bold text-white hover:bg-amber-600">
        Try again
      </button>
    </div>
  );
}
