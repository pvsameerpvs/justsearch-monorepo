"use client";

import { usePathname } from 'next/navigation';
import { RestaurantMobileHeader } from '@/components/restaurant/restaurant-mobile-header';
import { RestaurantMobileNav } from '@/components/restaurant/restaurant-mobile-nav';
import { RegistrationProvider } from '@/components/auth/registration-context';
import { AuthGuard } from '@/components/auth/auth-guard';
import { RegistrationModal } from '@/components/auth/registration-modal';
import { ActiveOrderTracker } from '@/components/restaurant/checkout/active-order-tracker';
import { RewardManager } from '@/components/restaurant/checkout/reward-manager';
import { FulfillmentProvider } from '@/components/restaurant/use-restaurant-fulfillment';
import { useRestaurant } from '@/components/restaurant/restaurant-context';
import { useChromeStore } from '@/lib/stores/chrome-store';
import type { ReactNode } from 'react';

type RestaurantLayoutManagerProps = {
  children: ReactNode;
};

export function RestaurantLayoutManager({ children }: RestaurantLayoutManagerProps) {
  const restaurant = useRestaurant();
  const pathname = usePathname();
  const isGameProfilePage = pathname === '/eat-play/profile';
  const isGameDetailPage =
    pathname.startsWith('/eat-play/') && pathname !== '/eat-play' && !isGameProfilePage;

  const showRestaurantChrome = pathname !== '/' && !isGameDetailPage;
  const hideBottomNavOnCheckout =
    pathname === '/menu/checkout' || pathname.startsWith('/menu/checkout/') || isGameDetailPage;
  const hideTrackerOnStatusPage = pathname.startsWith('/menu/checkout/status');
  
  const isChromeHidden = useChromeStore((s) => s.refCount > 0);

  const showRewardManager = !isGameDetailPage;

  const showHeader = showRestaurantChrome && !isChromeHidden;
  const showBottomNavFinal = showRestaurantChrome && !hideBottomNavOnCheckout && !isChromeHidden;
  const showTracker = showRestaurantChrome && !hideTrackerOnStatusPage && !isChromeHidden;
  const showReward = showRewardManager && !isChromeHidden;

  return (
    <RegistrationProvider>
      <AuthGuard />
      <FulfillmentProvider restaurant={restaurant}>
        {showHeader && <RestaurantMobileHeader />}
        {showTracker && <ActiveOrderTracker />}
        {showBottomNavFinal && <RestaurantMobileNav />}
        {children}
        <RegistrationModal />
        {showReward && <RewardManager />}
      </FulfillmentProvider>
    </RegistrationProvider>
  );
}
