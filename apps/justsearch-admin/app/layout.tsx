import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import { AdminAuthProvider } from '@/lib/auth-store';
import { AdminAuthGuard } from '@/components/auth-guard';
import { AdminSidebar } from '@/components/admin-sidebar';
import { ReactQueryProvider } from '@/components/providers/react-query-provider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReactQueryProvider>
          <AdminAuthProvider>
            <AdminAuthGuard>
              <div className="min-h-screen bg-slate-50 md:pl-64">
                <AdminSidebar />
                <main className="p-4 pt-16 md:p-8 md:pt-8">{children}</main>
              </div>
            </AdminAuthGuard>
          </AdminAuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
