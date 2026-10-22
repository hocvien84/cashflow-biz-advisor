'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  APIProvider,
  Map as GoogleMap,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useAdvancedMarkerRef,
} from '@vis.gl/react-google-maps';
import { DiscoveredPOI } from '@/types/business';
import { POI_CATEGORY_META } from '@/data/matrix-constants';
import 'leaflet/dist/leaflet.css';

interface LocationMapViewProps {
  lat: number;
  lng: number;
  radiusKm: number;
  pois: DiscoveredPOI[];
  onSelectLocation: (lat: number, lng: number) => void;
  googleMapsApiKey?: string;
  useGoogleMaps?: boolean;
}

function GooglePOIMarker({ poi }: { poi: DiscoveredPOI }) {
  const [open, setOpen] = useState(false);
  const [markerRef, marker] = useAdvancedMarkerRef();
  const meta = POI_CATEGORY_META[poi.category];

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={{ lat: poi.lat, lng: poi.lng }}
        title={`${poi.name} (${poi.distanceMeters}m)`}
        onClick={() => setOpen(true)}
      >
        <Pin background={meta.color} borderColor="#0f172a" glyphColor="#ffffff" scale={0.85} />
      </AdvancedMarker>
      {open && marker && (
        <InfoWindow anchor={marker} maxWidth={260} onCloseClick={() => setOpen(false)}>
          <div className="text-slate-900 p-1 text-xs">
            <div className="font-bold text-sm mb-0.5">{poi.name}</div>
            <div className="text-indigo-600 font-semibold mb-1">
              {poi.subType} • Cách {poi.distanceMeters}m
            </div>
            <div className="text-slate-600 leading-relaxed">{poi.estimatedCustomerNote}</div>
          </div>
        </InfoWindow>
      )}
    </>
  );
}

export default function LocationMapView({
  lat,
  lng,
  radiusKm,
  pois,
  onSelectLocation,
  googleMapsApiKey,
  useGoogleMaps = false,
}: LocationMapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<import('leaflet').Map | null>(null);
  const layerGroupRef = useRef<import('leaflet').LayerGroup | null>(null);

  // Render Leaflet OpenStreetMap when not in Google Maps mode
  useEffect(() => {
    if (useGoogleMaps && googleMapsApiKey) return;
    let isMounted = true;

    async function initOrUpdateLeaflet() {
      const L = await import('leaflet');
      if (!isMounted || !mapContainerRef.current) return;

      if (!leafletMapRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: [lat, lng],
          zoom: radiusKm <= 0.5 ? 16 : radiusKm <= 1.2 ? 15 : 14,
          zoomControl: true,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(map);

        const group = L.layerGroup().addTo(map);
        layerGroupRef.current = group;

        map.on('click', (e: import('leaflet').LeafletMouseEvent) => {
          onSelectLocation(
            Number(e.latlng.lat.toFixed(5)),
            Number(e.latlng.lng.toFixed(5))
          );
        });

        leafletMapRef.current = map;
      }

      const map = leafletMapRef.current;
      const group = layerGroupRef.current;
      if (!map || !group) return;

      map.setView([lat, lng], radiusKm <= 0.5 ? 16 : radiusKm <= 1.2 ? 15 : 14, {
        animate: true,
      });

      group.clearLayers();

      // Vòng tròn bán kính khảo sát (0.2km - 2.0km)
      L.circle([lat, lng], {
        radius: radiusKm * 1000,
        color: '#6366f1',
        weight: 2,
        fillColor: '#6366f1',
        fillOpacity: 0.14,
        dashArray: '6, 6',
      }).addTo(group);

      // Tâm điểm mặt bằng dự kiến kinh doanh
      const centerMarker = L.circleMarker([lat, lng], {
        radius: 10,
        color: '#ffffff',
        weight: 3,
        fillColor: '#f43f5e',
        fillOpacity: 1,
      }).addTo(group);

      centerMarker.bindPopup(
        `<div style="font-family:sans-serif;padding:2px">
          <strong style="color:#e11d48;font-size:13px">📍 Vị trí mặt bằng khảo sát</strong><br/>
          <span style="font-size:11px;color:#475569">Tọa độ: ${lat.toFixed(4)}, ${lng.toFixed(4)}<br/>Bán kính quét: ${radiusKm} km (${Math.round(radiusKm * 1000)}m)</span>
        </div>`
      );

      // Các điểm POI khách hàng tiềm năng xung quanh
      for (const poi of pois) {
        const meta = POI_CATEGORY_META[poi.category];
        const marker = L.circleMarker([poi.lat, poi.lng], {
          radius: 7,
          color: '#0f172a',
          weight: 1.5,
          fillColor: meta?.color || '#3b82f6',
          fillOpacity: 0.92,
        }).addTo(group);

        marker.bindPopup(
          `<div style="font-family:sans-serif;max-width:240px">
            <strong style="font-size:13px;color:#0f172a">${poi.name}</strong><br/>
            <span style="font-size:11px;font-weight:600;color:${meta?.color || '#2563eb'}">${poi.subType} • Cách ${poi.distanceMeters}m</span>
            <p style="font-size:11px;color:#334155;margin:4px 0 0 0;line-height:1.4">${poi.estimatedCustomerNote}</p>
          </div>`
        );
      }
    }

    initOrUpdateLeaflet();

    return () => {
      isMounted = false;
    };
  }, [lat, lng, radiusKm, pois, useGoogleMaps, googleMapsApiKey, onSelectLocation]);

  // Clean up Leaflet instance on unmount
  useEffect(() => {
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  if (useGoogleMaps && googleMapsApiKey) {
    return (
      <div style={{ height: '480px', width: '100%' }} className="rounded-xl overflow-hidden border border-slate-700/80 relative">
        <APIProvider apiKey={googleMapsApiKey}>
          <GoogleMap
            mapId="DEMO_MAP_ID"
            defaultZoom={15}
            center={{ lat, lng }}
            gestureHandling="greedy"
            internalUsageAttributionIds={['gmp_git_agentskills_v1']}
            onClick={(ev) => {
              if (ev.detail.latLng) {
                onSelectLocation(
                  Number(ev.detail.latLng.lat.toFixed(5)),
                  Number(ev.detail.latLng.lng.toFixed(5))
                );
              }
            }}
          >
            <AdvancedMarker position={{ lat, lng }} title="Vị trí mặt bằng kinh doanh">
              <Pin background="#f43f5e" borderColor="#ffffff" glyphColor="#ffffff" scale={1.2} />
            </AdvancedMarker>
            {pois.map((poi) => (
              <GooglePOIMarker key={poi.id} poi={poi} />
            ))}
          </GoogleMap>
        </APIProvider>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div
        ref={mapContainerRef}
        style={{ height: '480px', width: '100%' }}
        className="rounded-xl overflow-hidden border border-slate-700/80 z-0"
      />
      <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs text-slate-300 bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
        <span className="font-semibold text-slate-200 mr-1">Chú giải POI trên bản đồ:</span>
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Tâm mặt bằng
        </span>
        {(Object.keys(POI_CATEGORY_META) as Array<keyof typeof POI_CATEGORY_META>).map((cat) => (
          <span
            key={cat}
            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700"
          >
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ backgroundColor: POI_CATEGORY_META[cat].color }}
            />
            {POI_CATEGORY_META[cat].label.split(' ')[0]}
          </span>
        ))}
      </div>
    </div>
  );
}
