interface RestaurantQrCodeProps {
  qrImageUrl: string;
  alt?: string;
}

export function RestaurantQrCode({ qrImageUrl, alt = "Customer QR Code" }: RestaurantQrCodeProps) {
  return (
    <div className="shrink-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={qrImageUrl} alt={alt} width={128} height={128} className="rounded-xl border border-slate-200 bg-white object-contain" />
    </div>
  );
}
