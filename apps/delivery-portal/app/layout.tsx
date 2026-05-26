import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { DriverAuthProvider } from "@/lib/driver-auth-store";
import { AuthGuard } from "@/components/layout/auth-guard";
import { ReactQueryProvider } from "@/components/providers/react-query-provider";
import { ServiceWorkerRegister } from "@/components/pwa/service-worker-register";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Delivery Portal | JustSearch",
  description: "Operational delivery portal for restaurant dispatch and delivery agents.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Delivery Portal",
  },
  icons: { apple: "/icons/icon-192x192.svg" },
};

export const viewport: Viewport = {
  themeColor: "#059669",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReactQueryProvider>
          <DriverAuthProvider>
            <AuthGuard>{children}</AuthGuard>
          </DriverAuthProvider>
        </ReactQueryProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
