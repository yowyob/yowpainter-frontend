'use client';

import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Search, Loader2, MapPin } from 'lucide-react';

export interface LocationValue {
  address: string;
  latitude: number | null;
  longitude: number | null;
}

interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
}

interface Props {
  value: LocationValue;
  onChange: (value: LocationValue) => void;
}

const YAOUNDE: [number, number] = [3.848, 11.502];
const ACCENT_PIN =
  '<div style="width:22px;height:22px;border-radius:50% 50% 50% 0;background:var(--accent,#C26D5C);transform:rotate(-45deg);box-shadow:0 3px 8px rgba(0,0,0,.4);border:2px solid #fff"></div>';

/**
 * Sélecteur de localisation : recherche d'adresse (Nominatim / OpenStreetMap,
 * sans clé API) + placement d'un repère sur la carte. Leaflet est chargé
 * dynamiquement côté client uniquement (dépend de `window`).
 */
export default function LocationPicker({ value, onChange }: Props) {
  const t = useTranslations('Events');
  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import('leaflet').Map | null>(null);
  const markerRef = useRef<import('leaflet').Marker | null>(null);
  const LRef = useRef<typeof import('leaflet') | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const [query, setQuery] = useState(value.address || '');
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [ready, setReady] = useState(false);

  const placeMarker = useCallback((lat: number, lng: number) => {
    const L = LRef.current;
    const map = mapRef.current;
    if (!L || !map) return;
    const icon = L.divIcon({ className: '', html: ACCENT_PIN, iconSize: [22, 22], iconAnchor: [11, 22] });
    if (markerRef.current) markerRef.current.setLatLng([lat, lng]);
    else markerRef.current = L.marker([lat, lng], { icon }).addTo(map);
    map.setView([lat, lng], 15);
  }, []);

  // Initialisation de la carte (client only)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import('leaflet')).default;
      if (cancelled || !mapEl.current || mapRef.current) return;
      LRef.current = L;
      const hasCoords = value.latitude != null && value.longitude != null;
      const start: [number, number] = hasCoords ? [value.latitude!, value.longitude!] : YAOUNDE;
      const map = L.map(mapEl.current).setView(start, hasCoords ? 15 : 6);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
        maxZoom: 19,
      }).addTo(map);
      mapRef.current = map;
      if (hasCoords) placeMarker(value.latitude!, value.longitude!);

      map.on('click', async (e: import('leaflet').LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        placeMarker(lat, lng);
        onChangeRef.current({ address: query, latitude: lat, longitude: lng });
        // Reverse-geocode pour renseigner l'adressage lisible
        try {
          const r = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
            { headers: { 'Accept-Language': 'fr' } }
          );
          const data = await r.json();
          if (data?.display_name) {
            setQuery(data.display_name);
            onChangeRef.current({ address: data.display_name, latitude: lat, longitude: lng });
          }
        } catch { /* pas bloquant */ }
      });

      setReady(true);
      setTimeout(() => map.invalidateSize(), 250);
    })();
    return () => {
      cancelled = true;
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; markerRef.current = null; }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runSearch = useCallback(async () => {
    const q = query.trim();
    if (!q) return;
    setSearching(true);
    setResults([]);
    try {
      const r = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(q)}`,
        { headers: { 'Accept-Language': 'fr' } }
      );
      setResults(await r.json());
    } catch { /* ignore */ } finally {
      setSearching(false);
    }
  }, [query]);

  const selectResult = (res: NominatimResult) => {
    const lat = parseFloat(res.lat);
    const lng = parseFloat(res.lon);
    setQuery(res.display_name);
    setResults([]);
    placeMarker(lat, lng);
    onChange({ address: res.display_name, latitude: lat, longitude: lng });
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="flex items-center gap-2 border-b border-foreground/10 focus-within:border-accent transition-colors">
          <Search size={14} className="text-foreground/40 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); onChange({ ...value, address: e.target.value }); }}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); runSearch(); } }}
            placeholder={t('searchPlaceholder')}
            className="w-full bg-transparent py-2 text-sm outline-none"
          />
          <button
            type="button"
            onClick={runSearch}
            className="shrink-0 rounded-full bg-accent/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-accent hover:bg-accent hover:text-white transition-colors"
          >
            {searching ? <Loader2 size={12} className="animate-spin" /> : t('searchButton')}
          </button>
        </div>

        {results.length > 0 && (
          <ul className="absolute z-[10000] mt-1 max-h-56 w-full overflow-y-auto rounded-xl border border-foreground/10 bg-background shadow-2xl">
            {results.map((res, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => selectResult(res)}
                  className="flex w-full items-start gap-2 px-3 py-2 text-left text-xs hover:bg-accent/10 transition-colors"
                >
                  <MapPin size={13} className="mt-0.5 shrink-0 text-accent" />
                  <span className="line-clamp-2">{res.display_name}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
        {searching && results.length === 0 && (
          <p className="mt-1 text-[10px] text-foreground/40">{t('searching')}</p>
        )}
      </div>

      <div className="relative overflow-hidden rounded-xl border border-foreground/10">
        {!ready && (
          <div className="absolute inset-0 z-[1] flex items-center justify-center bg-foreground/5 text-[10px] text-foreground/40">
            {t('mapLoading')}
          </div>
        )}
        <div ref={mapEl} className="h-56 w-full" />
      </div>

      <div className="flex items-center justify-between text-[10px] text-foreground/40">
        <span>{t('pickOnMap')}</span>
        {value.latitude != null && value.longitude != null && (
          <span className="font-mono">{value.latitude.toFixed(5)}, {value.longitude.toFixed(5)}</span>
        )}
      </div>
    </div>
  );
}
