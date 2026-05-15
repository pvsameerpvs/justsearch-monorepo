'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log error to monitoring service in production
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      <h2 className="text-lg font-bold text-slate-900">Something went wrong</h2>
      <p className="text-sm text-slate-500">{error.message}</p>
      <button
        onClick={reset}
        className="rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-amber-600 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
