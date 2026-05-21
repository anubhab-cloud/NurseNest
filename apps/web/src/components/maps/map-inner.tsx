"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MapInner({
  lat,
  lng,
  label,
  zoom = 13,
}: {
  lat: number;
  lng: number;
  label?: string;
  zoom?: number;
}) {
  return (
    <MapContainer center={[lat, lng]} zoom={zoom} className="h-64 w-full rounded-lg z-0">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]} icon={icon}>
        <Popup>{label ?? "Location"}</Popup>
      </Marker>
    </MapContainer>
  );
}
