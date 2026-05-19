export function AdLoadingSkeleton() {
  return (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/90">
      <div className="flex items-center gap-3">
        <span className="text-2xl">🎮</span>
        <div className="flex gap-1.5">
          <span className="h-2 w-2 animate-bounce rounded-full bg-amber-400" style={{ animationDelay: '0ms' }} />
          <span className="h-2 w-2 animate-bounce rounded-full bg-amber-400" style={{ animationDelay: '150ms' }} />
          <span className="h-2 w-2 animate-bounce rounded-full bg-amber-400" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
