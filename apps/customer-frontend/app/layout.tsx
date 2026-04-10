import './globals.css';
import { Inter, Space_Grotesk } from 'next/font/google';
import { AppShell } from '@/components/layout/app-shell';
import type { ReactNode } from 'react';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata = {
  title: 'JustSearch Restaurant Activity | Customer Frontend',
  description:
    'Public restaurant browsing with menu, eat-play, Google reviews, and social media routes.',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className={inter.className}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
