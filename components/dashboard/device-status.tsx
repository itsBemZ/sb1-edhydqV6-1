"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wifi, Server, HardDrive, Cloud } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  {
    name: "WAPs",
    value: "24/25",
    icon: Wifi,
    trend: "up",
    color: "text-green-500",
  },
  {
    name: "Laptops",
    value: "156/180",
    icon: HardDrive,
    trend: "down",
    color: "text-yellow-500",
  },
  {
    name: "DPOs",
    value: "12/12",
    icon: Server,
    trend: "up",
    color: "text-green-500",
  },
  {
    name: "Servers",
    value: "8/8",
    icon: Cloud,
    trend: "up",
    color: "text-green-500",
  },
];

export function DeviceStatusOverview() {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Device Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="flex items-center gap-2 rounded-lg border p-3"
            >
              <stat.icon className={cn("h-5 w-5", stat.color)} />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.name}
                </p>
                <p className="text-xl font-bold">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}