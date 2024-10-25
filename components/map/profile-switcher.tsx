"use client";

import { useDeviceProfiles } from "@/lib/contexts/device-profile-context";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { MapIcon } from "lucide-react";

export function ProfileSwitcher() {
  const { profiles, activeProfile, setActiveProfile } = useDeviceProfiles();

  return (
    <div className="w-64 rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Map Profiles</h3>
      </div>
      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="p-2">
          {profiles.map((profile) => (
            <Button
              key={profile.id}
              variant="ghost"
              className={cn(
                "w-full justify-start gap-2 mb-1",
                activeProfile?.id === profile.id && "bg-accent"
              )}
              onClick={() => setActiveProfile(profile)}
            >
              <MapIcon className="h-4 w-4" />
              {profile.name}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}