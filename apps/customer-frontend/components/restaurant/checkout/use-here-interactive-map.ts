"use client";

import { useEffect, useRef, useState } from 'react';
import type { GeolocationCoordinates } from '../use-geolocation';

const HERE_MAP_SCRIPT_URLS = [
  'https://js.api.here.com/v3/3.1/mapsjs-core.js',
  'https://js.api.here.com/v3/3.1/mapsjs-service.js',
  'https://js.api.here.com/v3/3.1/mapsjs-mapevents.js',
];

type HereGlobalWindow = Window & {
  H?: {
    Map: new (...args: any[]) => any;
    map: { Marker: new (...args: any[]) => any };
    service: { Platform: new (...args: any[]) => any };
    mapevents: {
      MapEvents: new (...args: any[]) => any;
      Behavior: new (...args: any[]) => any;
    };
  };
  __hereMapsSdkLoaderPromise?: Promise<void>;
};

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector(
      `script[data-here-sdk-src="${src}"]`,
    ) as HTMLScriptElement | null;

    if (existingScript) {
      if (existingScript.dataset.loaded === 'true') {
        resolve();
        return;
      }

      const onLoad = () => {
        existingScript.dataset.loaded = 'true';
        resolve();
      };
      const onError = () => reject(new Error(`Failed to load HERE SDK script: ${src}`));

      existingScript.addEventListener('load', onLoad, { once: true });
      existingScript.addEventListener('error', onError, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.defer = true;
    script.dataset.hereSdkSrc = src;
    script.onload = () => {
      script.dataset.loaded = 'true';
      resolve();
    };
    script.onerror = () => reject(new Error(`Failed to load HERE SDK script: ${src}`));
    document.head.appendChild(script);
  });
}

async function loadHereMapsSdk() {
  const globalWindow = window as HereGlobalWindow;

  if (globalWindow.H?.Map && globalWindow.H?.service && globalWindow.H?.mapevents) {
    return globalWindow.H;
  }

  if (!globalWindow.__hereMapsSdkLoaderPromise) {
    globalWindow.__hereMapsSdkLoaderPromise = (async () => {
      for (const scriptUrl of HERE_MAP_SCRIPT_URLS) {
        await loadScript(scriptUrl);
      }
    })();
  }

  await globalWindow.__hereMapsSdkLoaderPromise;

  if (!globalWindow.H?.Map || !globalWindow.H?.service || !globalWindow.H?.mapevents) {
    throw new Error('HERE SDK loaded, but map globals are unavailable.');
  }

  return globalWindow.H;
}

type UseHereInteractiveMapOptions = {
  apiKey: string;
  center: GeolocationCoordinates;
  enabled: boolean;
  onTap: (coords: GeolocationCoordinates) => void | Promise<void>;
};

export function useHereInteractiveMap({
  apiKey,
  center,
  enabled,
  onTap,
}: UseHereInteractiveMapOptions) {
  const [isMapReady, setIsMapReady] = useState(false);
  const [mapLoadError, setMapLoadError] = useState<string | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const behaviorRef = useRef<any>(null);
  const mapTapHandlerRef = useRef<((event: any) => void) | null>(null);
  const onTapRef = useRef(onTap);
  const centerRef = useRef(center);

  useEffect(() => {
    onTapRef.current = onTap;
  }, [onTap]);

  useEffect(() => {
    centerRef.current = center;
  }, [center]);

  useEffect(() => {
    if (!enabled || !mapContainerRef.current) {
      return;
    }

    let cancelled = false;
    let onWindowResize: (() => void) | null = null;

    const initializeMap = async () => {
      try {
        setMapLoadError(null);
        setIsMapReady(false);

        const H = await loadHereMapsSdk();

        if (cancelled || !mapContainerRef.current) {
          return;
        }

        const platform = new H.service.Platform({ apikey: apiKey });
        const defaultLayers = platform.createDefaultLayers();
        const initialCenter = centerRef.current;
        const map = new H.Map(mapContainerRef.current, defaultLayers.vector.normal.map, {
          center: { lat: initialCenter.latitude, lng: initialCenter.longitude },
          zoom: 15,
          pixelRatio: window.devicePixelRatio || 1,
        });

        behaviorRef.current = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
        const marker = new H.map.Marker({
          lat: initialCenter.latitude,
          lng: initialCenter.longitude,
        });

        map.addObject(marker);
        mapInstanceRef.current = map;
        markerRef.current = marker;

        const handleTap = async (event: any) => {
          if (!mapInstanceRef.current || !markerRef.current || !event.currentPointer) {
            return;
          }

          const geoPoint = mapInstanceRef.current.screenToGeo(
            event.currentPointer.viewportX,
            event.currentPointer.viewportY,
          );

          if (!geoPoint || typeof geoPoint.lat !== 'number' || typeof geoPoint.lng !== 'number') {
            return;
          }

          const coords: GeolocationCoordinates = {
            latitude: geoPoint.lat,
            longitude: geoPoint.lng,
          };

          markerRef.current.setGeometry({ lat: coords.latitude, lng: coords.longitude });
          mapInstanceRef.current.setCenter(
            { lat: coords.latitude, lng: coords.longitude },
            true,
          );

          await onTapRef.current(coords);
        };

        mapTapHandlerRef.current = handleTap;
        map.addEventListener('tap', handleTap);

        onWindowResize = () => map.getViewPort().resize();
        window.addEventListener('resize', onWindowResize);
        setIsMapReady(true);
      } catch {
        setMapLoadError('Map could not load. Please try again.');
      }
    };

    initializeMap();

    return () => {
      cancelled = true;
      setIsMapReady(false);

      if (onWindowResize) {
        window.removeEventListener('resize', onWindowResize);
      }

      if (mapInstanceRef.current && mapTapHandlerRef.current) {
        mapInstanceRef.current.removeEventListener('tap', mapTapHandlerRef.current);
      }

      if (mapInstanceRef.current) {
        mapInstanceRef.current.dispose();
        mapInstanceRef.current = null;
      }

      markerRef.current = null;
      behaviorRef.current = null;
      mapTapHandlerRef.current = null;
    };
  }, [apiKey, enabled]);

  useEffect(() => {
    if (!enabled || !mapInstanceRef.current || !markerRef.current) {
      return;
    }

    markerRef.current.setGeometry({ lat: center.latitude, lng: center.longitude });
    mapInstanceRef.current.setCenter(
      { lat: center.latitude, lng: center.longitude },
      true,
    );
  }, [center.latitude, center.longitude, enabled]);

  return { mapContainerRef, isMapReady, mapLoadError };
}
