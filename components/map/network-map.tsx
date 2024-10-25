"use client";

import React, { useState, useImperativeHandle, forwardRef } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Wifi, Server, HardDrive, Cloud } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useDeviceProfiles } from "@/lib/contexts/device-profile-context";
import { Device } from "@/lib/contexts/device-profile-context";

interface NetworkMapProps {
  ref: any;
}

const getDeviceIcon = (type: string) => {
  switch (type.toUpperCase()) {
    case "WAP":
      return Wifi;
    case "SERVER":
      return Server;
    case "LAPTOP":
      return HardDrive;
    case "DPO":
      return Cloud;
    default:
      return Server;
  }
};

const calculateConnectionPath = (
  startX: number,
  startY: number,
  endX: number,
  endY: number
) => {
  const controlX = (startX + endX) / 2;
  const controlY = (startY + endY) / 2;
  
  return `M ${startX}% ${startY}% Q ${controlX}% ${controlY}% ${endX}% ${endY}%`;
};

export const NetworkMap = forwardRef<{
  zoomIn: () => void;
  zoomOut: () => void;
  reset: () => void;
  toggleDeviceType: (type: string) => void;
}, NetworkMapProps>((props, ref) => {
  const { devices, activeProfile, updateDevicePosition } = useDeviceProfiles();
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [visibleTypes] = useState<Set<string>>(
    new Set(["WAP", "SERVER", "LAPTOP", "DPO"])
  );
  const [draggedDevice, setDraggedDevice] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Filter devices that belong to the active profile
  const profileDevices = devices.filter(device => 
    device.profiles?.includes(activeProfile?.id || "default")
  );

  // Generate connections between devices
  const connections = profileDevices.flatMap(device => {
    if (!device.connections) return [];
    
    return device.connections
      .filter(connectedId => 
        profileDevices.some(d => d.id === connectedId)
      )
      .map(connectedId => {
        const connectedDevice = profileDevices.find(d => d.id === connectedId);
        if (!connectedDevice) return null;

        const sourcePos = device.positions?.[activeProfile?.id || "default"] || { x: 50, y: 50 };
        const targetPos = connectedDevice.positions?.[activeProfile?.id || "default"] || { x: 50, y: 50 };

        return {
          id: `${device.id}-${connectedId}`,
          source: device,
          target: connectedDevice,
          sourcePosX: sourcePos.x,
          sourcePosY: sourcePos.y,
          targetPosX: targetPos.x,
          targetPosY: targetPos.y,
        };
      })
      .filter(Boolean);
  });

  useImperativeHandle(ref, () => ({
    zoomIn: () => setZoom(prev => Math.min(prev + 0.2, 3)),
    zoomOut: () => setZoom(prev => Math.max(prev - 0.2, 0.5)),
    reset: () => {
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    },
    toggleDeviceType: (type: string) => {
      // Implement if needed
    },
  }));

  const handleMouseDown = (e: React.MouseEvent, deviceId?: string) => {
    if (deviceId) {
      e.stopPropagation();
      setDraggedDevice(deviceId);
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      setDragOffset({
        x: (e.clientX - rect.left) / zoom,
        y: (e.clientY - rect.top) / zoom
      });
    } else if (e.button === 0) {
      setIsDragging(true);
      setStartPosition({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedDevice && activeProfile) {
      const container = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - container.left) / container.width) * 100;
      const y = ((e.clientY - container.top) / container.height) * 100;

      updateDevicePosition(
        draggedDevice,
        activeProfile.id,
        Math.max(0, Math.min(100, x)),
        Math.max(0, Math.min(100, y))
      );
    } else if (isDragging) {
      setPosition({
        x: e.clientX - startPosition.x,
        y: e.clientY - startPosition.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggedDevice(null);
  };

  const renderDeviceIcon = (type: string) => {
    const Icon = getDeviceIcon(type);
    return <Icon className="h-4 w-4" />;
  };

  return (
    <>
      <Card 
        className="relative flex-1 overflow-hidden cursor-move bg-background h-full"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {activeProfile?.mapImage && (
          <div 
            className="absolute inset-0 bg-no-repeat bg-center bg-contain opacity-10 dark:opacity-20"
            style={{ 
              backgroundImage: `url(${activeProfile.mapImage})`,
              transform: `scale(${zoom})` 
            }}
          />
        )}
        <div 
          className="relative h-full w-full transition-transform duration-100"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
            transformOrigin: "center",
          }}
          onMouseDown={(e) => handleMouseDown(e)}
        >
          {/* Render connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {connections.map(connection => (
              <g key={connection.id}>
                <path
                  d={calculateConnectionPath(
                    connection.sourcePosX,
                    connection.sourcePosY,
                    connection.targetPosX,
                    connection.targetPosY
                  )}
                  className="stroke-muted-foreground"
                  style={{
                    strokeWidth: "2px",
                    fill: "none",
                    strokeDasharray: "4 4",
                    opacity: selectedDevice ? 
                      (selectedDevice.id === connection.source.id || 
                       selectedDevice.id === connection.target.id ? 1 : 0.2) 
                      : 0.5
                  }}
                />
              </g>
            ))}
          </svg>

          {/* Render devices */}
          {profileDevices
            .filter((device) => visibleTypes.has(device.type.toUpperCase()))
            .map((device) => {
              const Icon = getDeviceIcon(device.type);
              const devicePosition = device.positions?.[activeProfile?.id || "default"] || { x: 50, y: 50 };
              
              return (
                <button
                  key={device.id}
                  onClick={() => !draggedDevice && setSelectedDevice(device)}
                  onMouseDown={(e) => handleMouseDown(e, device.id)}
                  className={cn(
                    "absolute flex items-center justify-center rounded-full p-2 transition-all hover:z-10 hover:scale-110",
                    selectedDevice?.id === device.id && "ring-2 ring-primary",
                    device.status === "Online" ? "text-green-500" : "text-red-500",
                    draggedDevice === device.id && "cursor-grabbing z-50",
                    !draggedDevice && "cursor-grab",
                    selectedDevice && selectedDevice.id !== device.id && 
                    !device.connections?.includes(selectedDevice.id) && 
                    !selectedDevice.connections?.includes(device.id) && "opacity-30"
                  )}
                  style={{
                    left: `${devicePosition.x}%`,
                    top: `${devicePosition.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <Icon className="h-6 w-6" />
                  <span className="absolute -bottom-6 whitespace-nowrap text-xs font-medium text-foreground">
                    {device.name}
                  </span>
                </button>
              );
            })}
        </div>
      </Card>

      <Dialog open={!!selectedDevice} onOpenChange={() => setSelectedDevice(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedDevice?.type && (
                <span className="h-5 w-5">
                  {renderDeviceIcon(selectedDevice.type)}
                </span>
              )}
              {selectedDevice?.name}
              <Badge variant={selectedDevice?.status === "Online" ? "default" : "secondary"}>
                {selectedDevice?.status}
              </Badge>
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">IP Address</p>
                <p className="text-sm">{selectedDevice?.ip}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">MAC Address</p>
                <p className="text-sm">{selectedDevice?.mac}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Seen</p>
                <p className="text-sm">{selectedDevice?.lastSeen}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Location</p>
                <p className="text-sm">{selectedDevice?.location}</p>
              </div>
            </div>
            {selectedDevice?.connections && selectedDevice.connections.length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Connected Devices</p>
                <div className="space-y-2">
                  {selectedDevice.connections.map(connectedId => {
                    const connectedDevice = devices.find(d => d.id === connectedId);
                    if (!connectedDevice) return null;
                    return (
                      <div
                        key={connectedId}
                        className="flex items-center gap-2 text-sm p-2 rounded-md bg-muted"
                      >
                        {renderDeviceIcon(connectedDevice.type)}
                        <span>{connectedDevice.name}</span>
                        <Badge
                          variant={connectedDevice.status === "Online" ? "default" : "secondary"}
                          className="ml-auto"
                        >
                          {connectedDevice.status}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
});

NetworkMap.displayName = "NetworkMap";