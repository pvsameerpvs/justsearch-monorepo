import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import { ClientLayout } from '@/components/client-layout';
import { getCurrentRestaurant } from '@/lib/get-current-restaurant';
import { ReactQueryProvider } from '@/components/providers/react-query-provider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default async function RootLayout({ children }: { children: ReactNode }) {
  const restaurant = await getCurrentRestaurant();

  return (
    <html lang="en">
      <body className={inter.className}>
        <ReactQueryProvider>
          <ClientLayout restaurant={restaurant}>
            {children}
          </ClientLayout>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
