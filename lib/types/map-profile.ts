export interface MapProfile {
  id: string;
  name: string;
  description?: string;
  mapImage: string;
  devices: string[];
  config: {
    layout: "hierarchical" | "circular" | "grid";
    autoArrange: boolean;
    showLabels: boolean;
    theme: "system" | "light" | "dark";
  };
  createdAt: string;
  updatedAt: string;
}

export interface DeviceMapAssignment {
  deviceId: string;
  profileId: string;
  x: number;
  y: number;
}