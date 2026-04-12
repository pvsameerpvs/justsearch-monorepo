import './globals.css';
import { Inter, Space_Grotesk } from 'next/font/google';
import { AppShell } from '@/components/layout/app-shell';
import { RestaurantLayoutManager } from '@/components/layout/restaurant-layout-manager';
import type { ReactNode } from 'react';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
});

import { getCurrentRestaurant } from '@/lib/restaurant-resolver';
import { RestaurantProvider } from '@/components/restaurant/restaurant-context';

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const restaurant = await getCurrentRestaurant();

  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className={inter.className}>
        <AppShell>
          <RestaurantProvider restaurant={restaurant}>
            <RestaurantLayoutManager>{children}</RestaurantLayoutManager>
          </RestaurantProvider>
        </AppShell>
      </body>
    </html>
  );
}
