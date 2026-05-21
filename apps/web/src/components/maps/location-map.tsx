"use client";

import dynamic from "next/dynamic";

const MapInner = dynamic(() => import("./map-inner"), {
  ssr: false,
  loading: () => <div className="h-64 animate-pulse rounded-lg bg-muted" />,
});

export function LocationMap(props: { lat: number; lng: number; label?: string; zoom?: number }) {
  return <MapInner {...props} />;
}
