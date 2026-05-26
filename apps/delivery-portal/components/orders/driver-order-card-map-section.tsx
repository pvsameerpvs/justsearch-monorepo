import { MapPin, Navigation } from 'lucide-react';

type DriverOrderCardMapSectionProps = {
  address: string;
  lat: number;
  lng: number;
};

function buildMapEmbedUrl(lat: number, lng: number) {
  const d = 0.006;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - d}%2C${lat - d}%2C${lng + d}%2C${lat + d}&layer=mapnik&marker=${lat}%2C${lng}`;
}

function buildOpenInMapsUrl(lat: number, lng: number) {
  return `geo:${lat},${lng}?q=${lat},${lng}(Drop-off)`;
}

export function DriverOrderCardMapSection({ address, lat, lng }: DriverOrderCardMapSectionProps) {
  return (
    <div className="px-4 pb-3">
      <div className="flex items-start gap-2 rounded-[14px] border border-slate-100 bg-slate-50 px-3 py-2.5 mb-2">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
        <p className="text-xs text-slate-700 leading-5">{address}</p>
      </div>
      <div className="relative h-[160px] w-full rounded-[16px] overflow-hidden bg-slate-100">
        <iframe
          src={buildMapEmbedUrl(lat, lng)}
          title="Delivery map"
          className="h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <a
          href={buildOpenInMapsUrl(lat, lng)}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1.5 text-[10px] font-bold text-slate-900 shadow-md active:scale-95 transition"
        >
          <Navigation className="h-3 w-3" />
          Navigate
        </a>
      </div>
    </div>
  );
}
