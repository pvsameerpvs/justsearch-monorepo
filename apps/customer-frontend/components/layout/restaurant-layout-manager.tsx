"use client";

import { usePathname } from 'next/navigation';
import { RestaurantMobileHeader } from '@/components/restaurant/restaurant-mobile-header';
import { RestaurantMobileNav } from '@/components/restaurant/restaurant-mobile-nav';
import { RegistrationProvider } from '@/components/auth/registration-context';
import { RegistrationModal } from '@/components/auth/registration-modal';
import { RegistrationRouteGuard } from '@/components/auth/registration-route-guard';
import { ActiveOrderTracker } from '@/components/restaurant/checkout/active-order-tracker';
import { RewardManager } from '@/components/restaurant/checkout/reward-manager';
import { FulfillmentProvider } from '@/components/restaurant/use-restaurant-fulfillment';
import { useRestaurant } from '@/components/restaurant/restaurant-context';
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
  
  const showBottomNav = showRestaurantChrome && !hideBottomNavOnCheckout;
  const showOrderTracker = showRestaurantChrome && !hideTrackerOnStatusPage;
  const showRewardManager = !isGameDetailPage;

  return (
    <RegistrationProvider>
      <FulfillmentProvider restaurant={restaurant}>
        <RegistrationRouteGuard />
        {showRestaurantChrome && <RestaurantMobileHeader />}
        {showOrderTracker && <ActiveOrderTracker />}
        {showBottomNav && <RestaurantMobileNav />}
        {children}
        <RegistrationModal />
        {showRewardManager && <RewardManager />}
      </FulfillmentProvider>
    </RegistrationProvider>
  );
}
