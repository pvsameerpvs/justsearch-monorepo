"use client";

import { useState } from "react";
import { Copy, Check, Download, Printer, Share2 } from "lucide-react";
import { getQrUrl } from "@/lib/utils/qr-utils";

const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN || "js-restorant.com";

interface Props {
  subdomain: string;
  restaurantName: string;
}

function ActionBtn({ icon: Icon, label, onClick, active }: { icon: React.ElementType; label: string; onClick: () => void; active?: boolean }) {
  return (
    <button onClick={onClick} className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-all active:scale-[0.98] ${
      active ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
    }`}>
      <Icon className="h-4 w-4" /> {label}
    </button>
  );
}

export function SettingsQrActions({ subdomain, restaurantName }: Props) {
  const [copied, setCopied] = useState(false);
  const customerUrl = `https://${subdomain}.${BASE_DOMAIN}`;
  const qrImageUrl = getQrUrl(customerUrl, 400);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(customerUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = qrImageUrl;
    link.download = `${subdomain}-qr-code.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<html><head><title>QR - ${restaurantName}</title><style>body{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:system-ui,sans-serif;margin:0;background:#fff}.card{text-align:center;padding:40px;border-radius:24px;border:1px solid #e2e8f0;box-shadow:0 10px 40px rgba(0,0,0,0.08)}img{width:320px;height:320px;border-radius:16px}h1{margin:24px 0 8px;font-size:28px;font-weight:700;color:#0f172a}p{margin:0 0 4px;color:#64748b;font-size:16px}.url{font-family:monospace;font-size:13px;color:#94a3b8;margin-top:12px}</style></head><body><div class="card"><img src="${qrImageUrl}" alt="QR" /><h1>${restaurantName}</h1><p>Scan to view our menu &amp; order</p><p class="url">${customerUrl}</p></div></body></html>`);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 300);
  };

  const handleShare = async () => {
    try { await navigator.share({ title: restaurantName, url: customerUrl }); } catch { /* ignore */ }
  };

  const canShare = typeof navigator !== "undefined" && "share" in navigator;

  return (
    <div className="mt-4 flex flex-wrap justify-center gap-2 lg:justify-start">
      <ActionBtn icon={copied ? Check : Copy} label={copied ? "Copied" : "Copy URL"} active={copied} onClick={handleCopy} />
      <ActionBtn icon={Download} label="Download" onClick={handleDownload} />
      <ActionBtn icon={Printer} label="Print" onClick={handlePrint} />
      {canShare && <ActionBtn icon={Share2} label="Share" onClick={handleShare} />}
    </div>
  );
}
