import type { ReactNode } from 'react';
import { Inter, Space_Grotesk } from 'next/font/google';
import { AppShell } from '@/components/layout/app-shell';
import { RestaurantLayoutManager } from '@/components/layout/restaurant-layout-manager';
import { getCurrentRestaurant } from '@/lib/restaurant-resolver';
import { RestaurantProvider } from '@/components/restaurant/restaurant-context';
import { ReactQueryProvider } from '@/components/providers/react-query-provider';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const restaurant = await getCurrentRestaurant();

  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className={inter.className}>
        <ReactQueryProvider>
          <AppShell>
            <RestaurantProvider restaurant={restaurant}>
              <RestaurantLayoutManager>{children}</RestaurantLayoutManager>
            </RestaurantProvider>
          </AppShell>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
