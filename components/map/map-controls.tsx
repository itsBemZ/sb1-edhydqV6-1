"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ZoomIn, ZoomOut, Maximize2, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

interface MapControlsProps {
  mapRef: React.RefObject<{
    zoomIn: () => void;
    zoomOut: () => void;
    reset: () => void;
    toggleDeviceType: (type: string) => void;
  }>;
}

export function MapControls({ mapRef }: MapControlsProps) {
  const [deviceTypes, setDeviceTypes] = useState({
    wap: true,
    server: true,
    laptop: true,
    dpo: true,
  });

  const handleZoomIn = () => {
    mapRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapRef.current?.zoomOut();
  };

  const handleReset = () => {
    mapRef.current?.reset();
  };

  const handleToggleDeviceType = (type: string) => {
    mapRef.current?.toggleDeviceType(type);
    setDeviceTypes((prev) => ({
      ...prev,
      [type]: !prev[type as keyof typeof prev],
    }));
  };

  return (
    <Card className="flex flex-col gap-2 p-2">
      <Button variant="outline" size="icon" onClick={handleZoomIn}>
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={handleZoomOut}>
        <ZoomOut className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={handleReset}>
        <Maximize2 className="h-4 w-4" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem 
            checked={deviceTypes.wap}
            onCheckedChange={() => handleToggleDeviceType("wap")}
          >
            WAPs
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem 
            checked={deviceTypes.server}
            onCheckedChange={() => handleToggleDeviceType("server")}
          >
            Servers
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem 
            checked={deviceTypes.laptop}
            onCheckedChange={() => handleToggleDeviceType("laptop")}
          >
            Laptops
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem 
            checked={deviceTypes.dpo}
            onCheckedChange={() => handleToggleDeviceType("dpo")}
          >
            DPOs
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Card>
  );
}