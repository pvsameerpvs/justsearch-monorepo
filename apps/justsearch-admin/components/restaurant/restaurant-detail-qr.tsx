import { QrCode } from "lucide-react";
import { RestaurantQrCode } from "./restaurant-qr-code";
import { RestaurantQrActions } from "./restaurant-qr-actions";

interface RestaurantDetailQrProps {
  subdomain: string;
}

function getQrUrl(data: string, size = 200): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}`;
}

export function RestaurantDetailQr({ subdomain }: RestaurantDetailQrProps) {
  const customerUrl = `https://${subdomain}.mydomain.com`;
  const qrImageUrl = getQrUrl(customerUrl, 200);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
        <QrCode className="h-4 w-4 text-purple-600" />
        Customer Site QR Code
      </h3>
      <div className="flex items-start gap-4">
        <RestaurantQrCode qrImageUrl={qrImageUrl} />
        <RestaurantQrActions customerUrl={customerUrl} qrImageUrl={qrImageUrl} subdomain={subdomain} />
      </div>
    </div>
  );
}
