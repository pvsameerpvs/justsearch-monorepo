import Link from "next/link";
import { User } from "lucide-react";
import { EatPlayHeaderWalletLink } from "@/components/restaurant/games/profile/eat-play-header-wallet-link";

interface RestaurantMobileHeaderRightProps {
  isEatPlayProfileContext: boolean;
}

export function RestaurantMobileHeaderRight({ isEatPlayProfileContext }: RestaurantMobileHeaderRightProps) {
  if (isEatPlayProfileContext) {
    return <EatPlayHeaderWalletLink />;
  }

  return (
    <Link
      href="/profile"
      className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[rgb(var(--border)/0.9)] bg-[rgb(var(--brand-soft)/0.7)] text-[rgb(var(--brand))] shadow-sm transition-all active:scale-90"
      aria-label="Profile"
    >
      <User className="h-5 w-5" />
    </Link>
  );
}
