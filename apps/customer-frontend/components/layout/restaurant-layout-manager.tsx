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
  
  const showRestaurantChrome = pathname !== '/';

  return (
    <>
      {showRestaurantChrome && <RestaurantMobileHeader />}
      {showRestaurantChrome && <RestaurantMobileNav />}
      {children}
    </>
  );
}
