export function ProfileOrderDetailsLoading() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="h-[120px] animate-pulse rounded-[24px] border border-[rgb(var(--border)/0.56)] bg-white/70"
        />
      ))}
    </div>
  );
}
