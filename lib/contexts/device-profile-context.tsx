"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';

export interface Device {
  id: string;
  name: string;
  type: string;
  status: string;
  ip: string;
  mac?: string;
  location?: string;
  lastSeen: string;
  profiles?: string[];
  positions?: Record<string, { x: number; y: number }>;
  connections?: string[];
}

export interface MapProfile {
  id: string;
  name: string;
  description?: string;
  mapImage?: string;
  devices: string[];
}

interface DeviceProfileContextType {
  devices: Device[];
  profiles: MapProfile[];
  activeProfile: MapProfile | null;
  setActiveProfile: (profile: MapProfile) => void;
  addProfile: (profile: MapProfile) => void;
  updateProfile: (profile: MapProfile) => void;
  deleteProfile: (profileId: string) => void;
  updateDevicePosition: (deviceId: string, profileId: string, x: number, y: number) => void;
  assignDeviceToProfile: (deviceId: string, profileId: string) => void;
  removeDeviceFromProfile: (deviceId: string, profileId: string) => void;
}

const initialDevices: Device[] = [
  {
    id: "wap-1",
    name: "WAP-01",
    type: "WAP",
    status: "Online",
    ip: "192.168.1.10",
    mac: "00:1B:44:11:3A:B7",
    location: "Floor 1",
    lastSeen: "2 mins ago",
    profiles: ["default", "floor-1"],
    positions: { 
      default: { x: 25, y: 30 },
      "floor-1": { x: 35, y: 40 }
    },
    connections: ["laptop-1", "server-1"],
  },
  {
    id: "server-1",
    name: "SERVER-01",
    type: "Server",
    status: "Online",
    ip: "192.168.1.20",
    mac: "00:1B:44:11:3A:B8",
    location: "Server Room",
    lastSeen: "1 min ago",
    profiles: ["default", "server-room"],
    positions: { 
      default: { x: 50, y: 50 },
      "server-room": { x: 60, y: 45 }
    },
    connections: ["wap-1", "laptop-1"],
  },
  {
    id: "laptop-1",
    name: "LT-01",
    type: "Laptop",
    status: "Offline",
    ip: "192.168.1.30",
    mac: "00:1B:44:11:3A:B9",
    location: "Floor 2",
    lastSeen: "15 mins ago",
    profiles: ["default", "floor-2"],
    positions: { 
      default: { x: 75, y: 30 },
      "floor-2": { x: 65, y: 35 }
    },
    connections: ["wap-1", "server-1"],
  },
];

const initialProfiles: MapProfile[] = [
  {
    id: "default",
    name: "Default View",
    description: "Default network layout",
    devices: ["wap-1", "server-1", "laptop-1"],
  },
  {
    id: "floor-1",
    name: "Floor 1",
    description: "First floor network layout",
    devices: ["wap-1"],
  },
  {
    id: "server-room",
    name: "Server Room",
    description: "Server room layout",
    devices: ["server-1"],
  },
];

const DeviceProfileContext = createContext<DeviceProfileContextType | undefined>(undefined);

export function DeviceProfileProvider({ children }: { children: React.ReactNode }) {
  const [devices, setDevices] = useState<Device[]>(initialDevices);
  const [profiles, setProfiles] = useState<MapProfile[]>(initialProfiles);
  const [activeProfile, setActiveProfile] = useState<MapProfile>(initialProfiles[0]);

  const addProfile = useCallback((profile: MapProfile) => {
    setProfiles(prev => [...prev, profile]);
  }, []);

  const updateProfile = useCallback((updatedProfile: MapProfile) => {
    setProfiles(prev => prev.map(p => 
      p.id === updatedProfile.id ? updatedProfile : p
    ));
  }, []);

  const deleteProfile = useCallback((profileId: string) => {
    setProfiles(prev => prev.filter(p => p.id !== profileId));
  }, []);

  const updateDevicePosition = useCallback((deviceId: string, profileId: string, x: number, y: number) => {
    setDevices(prev => prev.map(device => {
      if (device.id === deviceId) {
        return {
          ...device,
          positions: {
            ...device.positions,
            [profileId]: { x, y },
          },
        };
      }
      return device;
    }));
  }, []);

  const assignDeviceToProfile = useCallback((deviceId: string, profileId: string) => {
    setDevices(prev => prev.map(device => {
      if (device.id === deviceId) {
        const profiles = device.profiles || [];
        if (!profiles.includes(profileId)) {
          return {
            ...device,
            profiles: [...profiles, profileId],
          };
        }
      }
      return device;
    }));

    setProfiles(prev => prev.map(profile => {
      if (profile.id === profileId && !profile.devices.includes(deviceId)) {
        return {
          ...profile,
          devices: [...profile.devices, deviceId],
        };
      }
      return profile;
    }));
  }, []);

  const removeDeviceFromProfile = useCallback((deviceId: string, profileId: string) => {
    setDevices(prev => prev.map(device => {
      if (device.id === deviceId) {
        return {
          ...device,
          profiles: (device.profiles || []).filter(id => id !== profileId),
        };
      }
      return device;
    }));

    setProfiles(prev => prev.map(profile => {
      if (profile.id === profileId) {
        return {
          ...profile,
          devices: profile.devices.filter(id => id !== deviceId),
        };
      }
      return profile;
    }));
  }, []);

  return (
    <DeviceProfileContext.Provider
      value={{
        devices,
        profiles,
        activeProfile,
        setActiveProfile,
        addProfile,
        updateProfile,
        deleteProfile,
        updateDevicePosition,
        assignDeviceToProfile,
        removeDeviceFromProfile,
      }}
    >
      {children}
    </DeviceProfileContext.Provider>
  );
}

export function useDeviceProfiles() {
  const context = useContext(DeviceProfileContext);
  if (context === undefined) {
    throw new Error('useDeviceProfiles must be used within a DeviceProfileProvider');
  }
  return context;
}