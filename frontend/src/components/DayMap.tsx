import React, { useMemo, useState, useEffect } from 'react';
import Map, { Marker, Source, Layer } from 'react-map-gl';
import type { LineLayer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Activity } from '../types/travel';

interface DayMapProps {
  actividades: Activity[];
}

export function DayMap({ actividades }: DayMapProps) {
  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';
  const [routeGeoJSON, setRouteGeoJSON] = useState<any>(null);

  const locations = useMemo(() => {
    return actividades.filter(a => a.lat !== undefined && a.lng !== undefined && a.lat !== 0 && a.lng !== 0);
  }, [actividades]);

  const viewState = useMemo(() => {
    if (locations.length === 0) {
      return { longitude: -3.703790, latitude: 40.416775, zoom: 5 };
    }
    const avgLat = locations.reduce((sum, loc) => sum + (loc.lat || 0), 0) / locations.length;
    const avgLng = locations.reduce((sum, loc) => sum + (loc.lng || 0), 0) / locations.length;
    return { longitude: avgLng, latitude: avgLat, zoom: 12 };
  }, [locations]);

  useEffect(() => {
    if (!MAPBOX_TOKEN || locations.length < 2) {
      setRouteGeoJSON(null);
      return;
    }

    const fetchRoute = async () => {
      try {
        const coordinates = locations.map(loc => `${loc.lng},${loc.lat}`).join(';');
        const response = await fetch(`https://api.mapbox.com/directions/v5/mapbox/walking/${coordinates}?geometries=geojson&access_token=${MAPBOX_TOKEN}`);
        const data = await response.json();
        
        if (data.routes && data.routes.length > 0) {
          setRouteGeoJSON({
            type: 'Feature',
            properties: {},
            geometry: data.routes[0].geometry
          });
        }
      } catch (error) {
        console.error("Error fetching mapbox direction:", error);
      }
    };

    fetchRoute();
  }, [locations, MAPBOX_TOKEN]);

  if (!MAPBOX_TOKEN) {
    return <div className="p-4 mb-6 bg-gray-100/80 rounded-xl text-center text-gray-500 font-medium">💡 Añade VITE_MAPBOX_TOKEN en tu .env para ver el mapa de la ruta.</div>;
  }

  if (locations.length === 0) {
    return null;
  }

  const lineStyle: LineLayer = {
    id: 'routeLine',
    type: 'line',
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': '#6366f1',
      'line-width': 4
    }
  };

  return (
    <div className="w-full h-[350px] mb-6 rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-indigo-100 relative z-0">
      <Map
        initialViewState={viewState}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        {routeGeoJSON && (
          <Source id="routeSource" type="geojson" data={routeGeoJSON}>
            <Layer {...lineStyle} />
          </Source>
        )}

        {locations.map((loc, index) => (
          <Marker
            key={index}
            longitude={loc.lng!}
            latitude={loc.lat!}
            anchor="bottom"
          >
            <div className="flex flex-col items-center group cursor-pointer relative top-2">
               <div className="bg-white px-3 py-1.5 rounded-lg shadow-lg text-sm font-semibold mb-1 whitespace-nowrap opacity-0 transition-opacity absolute bottom-full mb-2 pointer-events-none group-hover:opacity-100 z-10 text-slate-800">
                  {loc.lugar}
               </div>
               <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center shadow-md border-2 border-white transition-transform hover:scale-110 hover:bg-indigo-700">
                  <span className="text-white font-bold text-xs">{index + 1}</span>
               </div>
            </div>
          </Marker>
        ))}
      </Map>
    </div>
  );
}
