"use client";

import React, { useEffect, useRef, useState, createContext, useContext } from "react";
import maplibregl from "maplibre-gl";

interface MapContextProps {
  map: maplibregl.Map | null;
}

const MapContext = createContext<MapContextProps>({ map: null });

export const useMap = () => useContext(MapContext);

interface MapProps {
  center: [number, number]; // [lng, lat]
  zoom?: number;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const Map = ({ 
  center, 
  zoom = 14, 
  className = "", 
  style = {}, 
  children 
}: MapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Force Dark Matter style as requested
    const mapStyle = "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

    const mapInstance = new maplibregl.Map({
      container: mapContainerRef.current,
      style: mapStyle,
      center: center,
      zoom: zoom,
      attributionControl: false,
    });

    mapInstance.on("load", () => {
      setMap(mapInstance);
    });

    return () => {
      mapInstance.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync center when it changes
  useEffect(() => {
    if (map) {
      map.easeTo({ center, duration: 1000 });
    }
  }, [map, center]);

  return (
    <div 
      ref={mapContainerRef} 
      className={`relative overflow-hidden rounded-xl border border-white/10 ${className}`}
      style={{ width: "100%", height: "100%", ...style }}
    >
      <MapContext.Provider value={{ map }}>
        {map && children}
      </MapContext.Provider>
    </div>
  );
};

interface MapMarkerProps {
  position: [number, number]; // [lng, lat]
  color?: string;
}

export const MapMarker = ({ position, color = "#c5a47e" }: MapMarkerProps) => {
  const { map } = useMap();
  const markerRef = useRef<maplibregl.Marker | null>(null);

  useEffect(() => {
    if (!map) return;

    // Create marker
    const marker = new maplibregl.Marker({ color })
      .setLngLat(position)
      .addTo(map);

    markerRef.current = marker;

    return () => {
      marker.remove();
    };
  }, [map, position, color]);

  return null;
};
