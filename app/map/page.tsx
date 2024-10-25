"use client";

import { NetworkMap } from "@/components/map/network-map";
import { MapControls } from "@/components/map/map-controls";
import { ProfileSwitcher } from "@/components/map/profile-switcher";
import { useRef } from "react";

export default function MapPage() {
  const mapRef = useRef(null);

  return (
    <div className="flex h-[calc(100vh-6rem)] gap-4">
      <ProfileSwitcher />
      <div className="relative flex-1">
        <div className="absolute right-4 top-4 z-10">
          <MapControls mapRef={mapRef} />
        </div>
        <NetworkMap ref={mapRef} />
      </div>
    </div>
  );
}