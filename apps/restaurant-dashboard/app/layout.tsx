import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import { DashboardSidebar } from '@/components/dashboard-sidebar';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-slate-50 md:pl-64">
          <DashboardSidebar />
          <main className="p-4 pt-16 md:p-8 md:pt-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
