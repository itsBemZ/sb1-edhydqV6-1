"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NetworkSettings } from "./network-settings";
import { NotificationSettings } from "./notification-settings";
import { MapSettings } from "./map-settings";
import { MapProfiles } from "./map-profiles";
import { UserSettings } from "./user-settings";

export function SettingsTabs() {
  return (
    <Tabs defaultValue="network" className="space-y-4">
      <TabsList>
        <TabsTrigger value="network">Network</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="map">Map</TabsTrigger>
        <TabsTrigger value="profiles">Map Profiles</TabsTrigger>
        <TabsTrigger value="user">User</TabsTrigger>
      </TabsList>
      <TabsContent value="network" className="space-y-4">
        <NetworkSettings />
      </TabsContent>
      <TabsContent value="notifications" className="space-y-4">
        <NotificationSettings />
      </TabsContent>
      <TabsContent value="map" className="space-y-4">
        <MapSettings />
      </TabsContent>
      <TabsContent value="profiles" className="space-y-4">
        <MapProfiles />
      </TabsContent>
      <TabsContent value="user" className="space-y-4">
        <UserSettings />
      </TabsContent>
    </Tabs>
  );
}