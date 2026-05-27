'use client';

import { RefreshCw } from 'lucide-react';
interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <main className="grid min-h-screen place-items-center bg-[#fbfaf7] px-4">
      <div className="max-w-md rounded-lg border border-red-100 bg-white p-6 text-center shadow-sm">
        <p className="text-sm font-semibold text-tomato">Something went wrong</p>
        <h1 className="mt-3 text-2xl font-semibold text-ink">{error.message}</h1>
        <button
          onClick={reset}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white"
        >
          <RefreshCw size={16} />
          Retry
        </button>
      </div>
    </main>
  );
}
