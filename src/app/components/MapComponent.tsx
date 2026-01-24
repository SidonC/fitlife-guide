"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface TrackPoint {
  lat: number;
  lon: number;
  timestamp: number;
  accuracy: number;
}

interface MapComponentProps {
  points: TrackPoint[];
}

export default function MapComponent({ points }: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const polylineRef = useRef<L.Polyline | null>(null);
  const startMarkerRef = useRef<L.Marker | null>(null);
  const endMarkerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || points.length === 0) return;

    // Inicializar mapa apenas uma vez
    if (!mapRef.current) {
      const map = L.map(mapContainerRef.current).setView(
        [points[0].lat, points[0].lon],
        15
      );

      // Adicionar camada do OpenStreetMap
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      mapRef.current = map;
    }

    // Atualizar polyline
    const latLngs: [number, number][] = points.map((p) => [p.lat, p.lon]);

    if (polylineRef.current) {
      polylineRef.current.setLatLngs(latLngs);
    } else {
      polylineRef.current = L.polyline(latLngs, {
        color: "#10b981",
        weight: 4,
        opacity: 0.8,
      }).addTo(mapRef.current);
    }

    // Marcador de início
    if (points.length > 0) {
      const startIcon = L.divIcon({
        html: `<div style="background: #10b981; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
        className: "",
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      if (startMarkerRef.current) {
        startMarkerRef.current.setLatLng([points[0].lat, points[0].lon]);
      } else {
        startMarkerRef.current = L.marker([points[0].lat, points[0].lon], {
          icon: startIcon,
        })
          .addTo(mapRef.current)
          .bindPopup("Início");
      }
    }

    // Marcador de fim
    if (points.length > 1) {
      const endIcon = L.divIcon({
        html: `<div style="background: #ef4444; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
        className: "",
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      const lastPoint = points[points.length - 1];

      if (endMarkerRef.current) {
        endMarkerRef.current.setLatLng([lastPoint.lat, lastPoint.lon]);
      } else {
        endMarkerRef.current = L.marker([lastPoint.lat, lastPoint.lon], {
          icon: endIcon,
        })
          .addTo(mapRef.current)
          .bindPopup("Posição Atual");
      }
    }

    // Ajustar visualização para mostrar todo o trajeto
    if (points.length > 1) {
      const bounds = L.latLngBounds(latLngs);
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    } else {
      mapRef.current.setView([points[0].lat, points[0].lon], 15);
    }

    // Cleanup
    return () => {
      // Não destruir o mapa, apenas limpar referências antigas
    };
  }, [points]);

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-[400px] rounded-2xl"
      style={{ minHeight: "400px" }}
    />
  );
}
