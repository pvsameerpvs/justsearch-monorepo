"use client";

import { usePathname } from 'next/navigation';
import { RestaurantMobileHeader } from '@/components/restaurant/restaurant-mobile-header';
import { RestaurantMobileNav } from '@/components/restaurant/restaurant-mobile-nav';
import { RegistrationProvider } from '@/components/auth/registration-context';
import { RegistrationModal } from '@/components/auth/registration-modal';
import { RegistrationRouteGuard } from '@/components/auth/registration-route-guard';
import { ActiveOrderTracker } from '@/components/restaurant/checkout/active-order-tracker';
import type { ReactNode } from 'react';

type RestaurantLayoutManagerProps = {
  children: ReactNode;
};

export function RestaurantLayoutManager({ children }: RestaurantLayoutManagerProps) {
  const pathname = usePathname();
  
  const showRestaurantChrome = pathname !== '/';
  const hideBottomNavOnCheckout =
    pathname === '/menu/checkout' || pathname.startsWith('/menu/checkout/');
  const showBottomNav = showRestaurantChrome && !hideBottomNavOnCheckout;

  return (
    <RegistrationProvider>
      <RegistrationRouteGuard />
      {showRestaurantChrome && (
        <>
          <RestaurantMobileHeader />
          <ActiveOrderTracker />
        </>
      )}
      {showBottomNav && <RestaurantMobileNav />}
      {children}
      <RegistrationModal />
    </RegistrationProvider>
  );
}
