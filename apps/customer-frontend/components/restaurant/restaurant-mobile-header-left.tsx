import { ArrowLeft } from "lucide-react";

interface RestaurantMobileHeaderLeftProps {
  onBack: () => void;
}

export function RestaurantMobileHeaderLeft({ onBack }: RestaurantMobileHeaderLeftProps) {
  return (
    <button
      type="button"
      onClick={onBack}
      className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[rgb(var(--border)/0.9)] bg-white/70 text-[rgb(var(--ink))] shadow-sm transition-all active:scale-90"
      aria-label="Back"
    >
      <ArrowLeft className="h-5 w-5" />
    </button>
  );
}
