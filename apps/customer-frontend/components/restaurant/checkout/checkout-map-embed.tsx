import { Loader2, LocateFixed, MapPin } from 'lucide-react';
import { cn } from '@/lib/cn';
import { HERE_API_KEY } from './checkout-map-types';

type CheckoutMapEmbedProps = {
  mapContainerRef: React.RefObject<HTMLDivElement | null>;
  isMapReady: boolean;
  mapLoadError: string | null;
  mapUrl: string;
  pinnedAddress: string;
  isPinResolving: boolean;
  isLocating: boolean;
  onLocateMe: () => void;
};

export function CheckoutMapEmbed({
  mapContainerRef,
  isMapReady,
  mapLoadError,
  mapUrl,
  pinnedAddress,
  isPinResolving,
  isLocating,
  onLocateMe,
}: CheckoutMapEmbedProps) {
  return (
    <div className="overflow-hidden rounded-[22px] border border-[rgb(var(--border)/0.72)]">
      <div className="relative h-[230px] w-full bg-slate-100">
        {HERE_API_KEY ? (
          <div ref={mapContainerRef as React.RefObject<HTMLDivElement>} aria-label="Delivery location map" className="h-full w-full touch-pan-x touch-pan-y" />
        ) : (
          <iframe src={mapUrl} title="Delivery location map" className="h-full w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        )}
        <div className="absolute left-3 right-3 top-3 rounded-[14px] bg-[rgb(255,221,31)] px-3 py-2 shadow-md">
          <p className="line-clamp-2 text-sm font-semibold leading-5 text-[rgb(35,31,32)]">{pinnedAddress}</p>
        </div>
        {HERE_API_KEY ? (
          <div className="absolute bottom-3 left-3 rounded-full bg-black/70 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur-[2px]">
            <span className="inline-flex items-center gap-1.5">
              {isPinResolving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <MapPin className="h-3.5 w-3.5" />}
              {isPinResolving ? 'Updating pin...' : 'Tap map to choose pin'}
            </span>
          </div>
        ) : (
          <div className="absolute bottom-3 left-3 rounded-full bg-black/70 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur-[2px]">Add HERE API key for interactive pin selection.</div>
        )}
        <button type="button" onClick={onLocateMe} disabled={isLocating} className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border)/0.65)] bg-white px-3 py-2 text-xs font-semibold text-[rgb(var(--ink))] shadow-md disabled:opacity-65">
          <LocateFixed className={cn('h-4 w-4', isLocating && 'animate-pulse')} />
          {isLocating ? 'Locating...' : 'Locate me'}
        </button>
        {HERE_API_KEY && !isMapReady ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/72 backdrop-blur-[1px]">
            <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-semibold text-[rgb(var(--ink))] shadow-md">
              <Loader2 className="h-4 w-4 animate-spin text-[rgb(var(--brand))]" />
              Loading map...
            </p>
          </div>
        ) : null}
        {mapLoadError ? (
          <div className="absolute inset-x-3 bottom-14 rounded-[12px] border border-[rgb(255,139,139)] bg-[rgb(255,243,243)] px-3 py-2 text-[12px] font-medium text-[rgb(170,37,37)]">{mapLoadError}</div>
        ) : null}
      </div>
      <div className="border-t border-[rgb(var(--border)/0.7)] bg-[rgb(255,247,214)] px-4 py-3">
        <p className="text-sm font-medium text-[rgb(91,74,0)]">Your courier will deliver to the pinned location.</p>
      </div>
    </div>
  );
}
