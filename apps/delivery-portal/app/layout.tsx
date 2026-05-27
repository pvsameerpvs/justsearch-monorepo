import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { DriverAuthProvider } from "@/lib/driver-auth-store";
import { AuthGuard } from "@/components/layout/auth-guard";
import { ReactQueryProvider } from "@/components/providers/react-query-provider";
import { ServiceWorkerRegister } from "@/components/pwa/service-worker-register";
import { PwaMetaInjector } from "@/components/pwa/pwa-meta-injector";
import { DynamicAppIcon } from "@/components/pwa/dynamic-app-icon";
import { ForegroundPushListener } from "@/components/pwa/foreground-push-listener";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Delivery Portal | JustSearch",
  description: "Operational delivery portal for restaurant dispatch and delivery agents.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
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
          <PwaMetaInjector />
          <DynamicAppIcon />
          <ForegroundPushListener />
        </ReactQueryProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
