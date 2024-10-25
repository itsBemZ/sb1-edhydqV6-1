"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wifi, Server, HardDrive, Cloud, MoreHorizontal, Pencil, Trash2, Map } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeviceForm } from "./device-form";
import { useToast } from "@/hooks/use-toast";
import { useDeviceProfiles } from "@/lib/contexts/device-profile-context";

interface DeviceListProps {
  searchQuery: string;
  typeFilter: string;
  statusFilter: string;
  profileFilter: string;
}

const getDeviceIcon = (type: string) => {
  switch (type) {
    case "WAP":
      return Wifi;
    case "Server":
      return Server;
    case "Laptop":
      return HardDrive;
    case "DPO":
      return Cloud;
    default:
      return Server;
  }
};

export function DeviceList({
  searchQuery,
  typeFilter,
  statusFilter,
  profileFilter,
}: DeviceListProps) {
  const { devices, profiles, updateDeviceProfiles, updateDevice, deleteDevice } = useDeviceProfiles();
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const { toast } = useToast();

  const filteredDevices = devices.filter(device => {
    const matchesSearch = searchQuery === "" ||
      device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.ip.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.location?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === "all" ||
      device.type.toLowerCase() === typeFilter.toLowerCase();

    const matchesStatus = statusFilter === "all" ||
      device.status.toLowerCase() === statusFilter.toLowerCase();

    const matchesProfile = profileFilter === "all" ||
      (device.profiles && device.profiles.includes(profileFilter));

    return matchesSearch && matchesType && matchesStatus && matchesProfile;
  });

  const handleProfileAssignment = (device: Device, profileId: string) => {
    const currentProfiles = device.profiles || [];
    const newProfiles = currentProfiles.includes(profileId)
      ? currentProfiles.filter(p => p !== profileId)
      : [...currentProfiles, profileId];

    updateDeviceProfiles(device.id, newProfiles);

    toast({
      title: "Profiles updated",
      description: `Updated profile assignments for ${device.name}`,
    });
  };

  const handleUpdateDevice = (updatedDevice: Device) => {
    updateDevice(updatedDevice.id, updatedDevice);
    toast({
      title: "Device updated",
      description: `${updatedDevice.name} has been updated.`,
    });
    setIsEditDialogOpen(false);
    setSelectedDevice(null);
  };

  const confirmDelete = () => {
    if (selectedDevice) {
      deleteDevice(selectedDevice.id);
      toast({
        title: "Device deleted",
        description: `${selectedDevice.name} has been removed.`,
      });
      setIsDeleteDialogOpen(false);
      setSelectedDevice(null);
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Device</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Last Seen</TableHead>
              <TableHead>Profiles</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDevices.map((device) => {
              const Icon = getDeviceIcon(device.type);
              return (
                <TableRow key={device.id}>
                  <TableCell className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {device.name}
                  </TableCell>
                  <TableCell>{device.type}</TableCell>
                  <TableCell>
                    <Badge
                      variant={device.status === "Online" ? "default" : "secondary"}
                    >
                      {device.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{device.ip}</TableCell>
                  <TableCell>{device.location}</TableCell>
                  <TableCell>{device.lastSeen}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {device.profiles?.map(profileId => {
                        const profile = profiles.find(p => p.id === profileId);
                        return profile ? (
                          <Badge key={profileId} variant="outline">
                            {profile.name}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedDevice(device);
                            setIsProfileDialogOpen(true);
                          }}
                        >
                          <Map className="mr-2 h-4 w-4" />
                          Assign to Profiles
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setSelectedDevice(device);
                          setIsEditDialogOpen(true);
                        }}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit Device
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedDevice(device);
                            setIsDeleteDialogOpen(true);
                          }}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Device
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Device</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedDevice?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Device</DialogTitle>
            <DialogDescription>
              Update the device information below.
            </DialogDescription>
          </DialogHeader>
          {selectedDevice && (
            <DeviceForm
              device={selectedDevice}
              onSubmit={handleUpdateDevice}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign to Profiles</DialogTitle>
            <DialogDescription>
              Select the profiles for this device.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {profiles.map(profile => (
              <div
                key={profile.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <p className="font-medium">{profile.name}</p>
                  {profile.description && (
                    <p className="text-sm text-muted-foreground">
                      {profile.description}
                    </p>
                  )}
                </div>
                <Button
                  variant={selectedDevice?.profiles?.includes(profile.id) ? "default" : "outline"}
                  onClick={() => selectedDevice && handleProfileAssignment(selectedDevice, profile.id)}
                >
                  {selectedDevice?.profiles?.includes(profile.id) ? "Assigned" : "Assign"}
                </Button>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsProfileDialogOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}