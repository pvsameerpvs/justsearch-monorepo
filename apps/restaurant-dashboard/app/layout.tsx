import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import { ClientLayout } from '@/components/client-layout';
import { getCurrentRestaurant } from '@/lib/get-current-restaurant';

const inter = Inter({ subsets: ['latin'] });

export default async function RootLayout({ children }: { children: ReactNode }) {
  const restaurant = await getCurrentRestaurant();

  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientLayout restaurant={restaurant}>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
