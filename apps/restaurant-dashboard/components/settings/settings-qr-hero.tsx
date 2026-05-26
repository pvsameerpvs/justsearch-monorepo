"use client";

import Image from "next/image";
import { QrCode } from "lucide-react";
import { SettingsQrActions } from "./settings-qr-actions";
import { getQrUrl } from "@/lib/utils/qr-utils";

const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN || "js-restorant.com";

interface SettingsQrHeroProps {
  subdomain: string;
  restaurantName: string;
}

export function SettingsQrHero({ subdomain, restaurantName }: SettingsQrHeroProps) {
  const customerUrl = `https://${subdomain}.${BASE_DOMAIN}`;
  const qrImageUrl = getQrUrl(customerUrl, 400);

  return (
    <div className="elegant-card gradient-border-top p-6 lg:p-8">
      <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start lg:gap-10">
        <div className="relative shrink-0">
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 blur-2xl" />
          <div className="relative rounded-3xl border border-amber-100 bg-white p-4 shadow-xl shadow-amber-500/10">
            <Image src={qrImageUrl} alt="Restaurant QR Code" width={280} height={280} className="h-56 w-56 rounded-2xl object-contain lg:h-72 lg:w-72" priority />
          </div>
        </div>
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 mb-3">
            <QrCode className="h-3.5 w-3.5" /> Main Customer QR
          </div>
          <h2 className="text-2xl font-bold text-slate-900">{restaurantName}</h2>
          <p className="mt-1 text-sm text-slate-500">Customers scan this code to open your digital menu and place orders.</p>
          <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Customer URL</p>
            <p className="mt-1 truncate font-mono text-xs text-slate-700">{customerUrl}</p>
          </div>
          <SettingsQrActions subdomain={subdomain} restaurantName={restaurantName} />
        </div>
      </div>
    </div>
  );
}
