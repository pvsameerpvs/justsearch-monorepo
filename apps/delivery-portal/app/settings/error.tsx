"use client";

export default function SettingsError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
        <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 className="text-lg font-bold text-slate-900">Something went wrong</h2>
      <p className="text-sm text-slate-500 max-w-xs">{error.message || "Failed to load settings"}</p>
      <button
        onClick={reset}
        className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white active:bg-emerald-700 transition"
      >
        Try Again
      </button>
    </div>
  );
}
