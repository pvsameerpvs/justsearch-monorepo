import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { DriverAuthProvider } from '@/lib/driver-auth-store';
import { AuthGuard } from '@/components/layout/auth-guard';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Delivery Portal | JustSearch',
  description: 'Operational delivery portal for restaurant dispatch and delivery agents.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DriverAuthProvider>
          <AuthGuard>{children}</AuthGuard>
        </DriverAuthProvider>
      </body>
    </html>
  );
}
