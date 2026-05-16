"use client";

export function CheckoutOrderStatusSkeleton() {
  return (
    <section className="py-4 sm:py-6">
      <div className="mx-auto max-w-2xl px-4">
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-[110px] animate-pulse rounded-[24px] border border-[rgb(var(--border)/0.56)] bg-white/70"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
