"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { DeviceForm } from "./device-form";
import { Device } from "./device-list";
import { useToast } from "@/hooks/use-toast";
import { MapProfile } from "@/lib/types/map-profile";

interface DeviceFiltersProps {
  onSearchChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onProfileChange: (value: string) => void;
  profiles: MapProfile[];
}

export function DeviceFilters({
  onSearchChange,
  onTypeChange,
  onStatusChange,
  onProfileChange,
  profiles,
}: DeviceFiltersProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAddDevice = (device: Device) => {
    toast({
      title: "Device added",
      description: `${device.name} has been added successfully.`,
    });
    setIsAddDialogOpen(false);
  };

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search devices..."
              className="pl-9"
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <Select defaultValue="all" onValueChange={onTypeChange}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="wap">WAP</SelectItem>
              <SelectItem value="server">Server</SelectItem>
              <SelectItem value="laptop">Laptop</SelectItem>
              <SelectItem value="dpo">DPO</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all" onValueChange={onStatusChange}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all" onValueChange={onProfileChange}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Profile" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Profiles</SelectItem>
              {profiles.map(profile => (
                <SelectItem key={profile.id} value={profile.id}>
                  {profile.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Device
        </Button>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Device</DialogTitle>
            <DialogDescription>
              Enter the details for the new device below.
            </DialogDescription>
          </DialogHeader>
          <DeviceForm
            onSubmit={handleAddDevice}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}