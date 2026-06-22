export function ScratchCardError() {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
      <h3 className="text-sm font-bold uppercase tracking-wider text-red-900 mb-2">Scratch Card Rewards — Error</h3>
      <p className="text-xs text-red-700 mb-3">Failed to load settings. Please refresh.</p>
      <button type="button" onClick={() => window.location.reload()} className="rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white">Refresh</button>
    </div>
  );
}
