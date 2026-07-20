'use client';

import 'leaflet/dist/leaflet.css';
import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Navigation, MapPin } from 'lucide-react';

interface Props {
  latitude: number;
  longitude: number;
  label?: string;
}

const ACCENT_PIN =
  '<div style="width:22px;height:22px;border-radius:50% 50% 50% 0;background:var(--accent,#C26D5C);transform:rotate(-45deg);box-shadow:0 3px 8px rgba(0,0,0,.4);border:2px solid #fff"></div>';

/**
 * Carte en lecture seule affichant la localisation d'un événement,
 * avec des liens d'itinéraire Google Maps et OpenStreetMap.
 */
export default function EventLocationMap({ latitude, longitude, label }: Props) {
  const t = useTranslations('Events');
  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import('leaflet').Map | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import('leaflet')).default;
      if (cancelled || !mapEl.current || mapRef.current) return;
      const map = L.map(mapEl.current, { scrollWheelZoom: false }).setView([latitude, longitude], 15);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
        maxZoom: 19,
      }).addTo(map);
      const icon = L.divIcon({ className: '', html: ACCENT_PIN, iconSize: [22, 22], iconAnchor: [11, 22] });
      const marker = L.marker([latitude, longitude], { icon }).addTo(map);
      if (label) marker.bindPopup(label);
      mapRef.current = map;
      setTimeout(() => map.invalidateSize(), 250);
    })();
    return () => {
      cancelled = true;
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  }, [latitude, longitude, label]);

  const googleUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
  const osmUrl = `https://www.openstreetmap.org/directions?to=${latitude}%2C${longitude}`;

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-2xl border border-foreground/10">
        <div ref={mapEl} className="h-64 w-full" />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/45">
          <MapPin size={13} className="text-accent" /> {t('getDirections')}
        </span>
        <a
          href={googleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-foreground/15 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest transition-colors hover:border-accent hover:text-accent"
        >
          <Navigation size={12} /> {t('viewOnGoogle')}
        </a>
        <a
          href={osmUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-foreground/15 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest transition-colors hover:border-accent hover:text-accent"
        >
          <Navigation size={12} /> {t('viewOnOsm')}
        </a>
      </div>
    </div>
  );
}
