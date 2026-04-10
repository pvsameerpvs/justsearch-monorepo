"use client";

import { usePathname } from 'next/navigation';
import { RestaurantMobileHeader } from '@/components/restaurant/restaurant-mobile-header';
import { RestaurantMobileNav } from '@/components/restaurant/restaurant-mobile-nav';
import type { ReactNode } from 'react';

type RestaurantLayoutManagerProps = {
  children: ReactNode;
};

export function RestaurantLayoutManager({ children }: RestaurantLayoutManagerProps) {
  const pathname = usePathname();
  
  // Only show the bottom navigation bar on pages that are NOT the landing page
  const showMobileNav = pathname !== '/';

  return (
    <>
      {showMobileNav && <RestaurantMobileHeader />}
      {showMobileNav && <RestaurantMobileNav />}
      {children}
    </>
  );
}
