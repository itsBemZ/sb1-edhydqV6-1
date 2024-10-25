"use client";

import { DeviceList } from "@/components/devices/device-list";
import { DeviceFilters } from "@/components/devices/device-filters";
import { useState } from "react";
import { MapProfile } from "@/lib/types/map-profile";

const defaultProfiles: MapProfile[] = [
  {
    id: "default",
    name: "Main Floor",
    description: "Main floor network layout",
    mapImage: "/plant-layout.svg",
    devices: [],
    config: {
      layout: "hierarchical",
      autoArrange: true,
      showLabels: true,
      theme: "system",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function DevicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [profileFilter, setProfileFilter] = useState("all");

  return (
    <div className="space-y-4">
      <DeviceFilters
        onSearchChange={setSearchQuery}
        onTypeChange={setTypeFilter}
        onStatusChange={setStatusFilter}
        onProfileChange={setProfileFilter}
        profiles={defaultProfiles}
      />
      <DeviceList
        searchQuery={searchQuery}
        typeFilter={typeFilter}
        statusFilter={statusFilter}
        profileFilter={profileFilter}
        profiles={defaultProfiles}
      />
    </div>
  );
}