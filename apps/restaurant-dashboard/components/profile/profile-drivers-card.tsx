"use client";

import { useState } from "react";
import { Truck } from "lucide-react";
import { useDeliveryBoyStore } from "@/lib/stores/delivery-boy-store";
import { ProfileDriverItem } from "./profile-driver-item";

interface ProfileDriversCardProps {
  subdomain: string;
}

const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN || "js-restorant.com";
const SEPARATOR = "--";

export function ProfileDriversCard({ subdomain }: ProfileDriversCardProps) {
  const { agents } = useDeliveryBoyStore();
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  if (agents.length === 0) {
    return (
      <div className="elegant-card p-5">
        <h3 className="text-base font-bold text-slate-900 mb-4">Delivery Drivers</h3>
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-center">
          <Truck className="mx-auto h-6 w-6 text-slate-300 mb-2" />
          <p className="text-sm text-slate-500">No delivery drivers yet</p>
          <p className="text-xs text-slate-400 mt-1">Go to /delivery to add drivers</p>
        </div>
      </div>
    );
  }

  return (
    <div className="elegant-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-slate-900">Delivery Drivers</h3>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">{agents.length} total</span>
      </div>
      <div className="space-y-3">
        {agents.map((agent) => (
          <ProfileDriverItem
            key={agent.id}
            agent={agent}
            portalUrl={`https://${subdomain}${SEPARATOR}${agent.uniqueId}.${BASE_DOMAIN}/login`}
            copied={copied}
            onCopy={handleCopy}
          />
        ))}
      </div>
    </div>
  );
}
