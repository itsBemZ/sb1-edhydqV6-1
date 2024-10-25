"use client";

import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WifiOff, Server, HardDrive, Shield, Activity } from "lucide-react";

interface ActivityEvent {
  id: number;
  title: string;
  description: string;
  timestamp: string;
  type: string;
  icon: any;
}

interface ActivityFeedProps {
  searchQuery: string;
  typeFilter: string;
  dateFilter: Date | undefined;
}

const activities: ActivityEvent[] = [
  {
    id: 1,
    title: "Server CPU Threshold",
    description: "Server-01 CPU usage exceeded 90%",
    timestamp: "2 minutes ago",
    type: "alert",
    icon: Server,
  },
  {
    id: 2,
    title: "Device Connected",
    description: "New laptop LT-15 joined the network",
    timestamp: "5 minutes ago",
    type: "info",
    icon: HardDrive,
  },
  {
    id: 3,
    title: "Security Update",
    description: "Firewall rules updated on DPO-01",
    timestamp: "10 minutes ago",
    type: "success",
    icon: Shield,
  },
  {
    id: 4,
    title: "Connection Lost",
    description: "WAP-03 connection lost",
    timestamp: "15 minutes ago",
    type: "error",
    icon: WifiOff,
  },
  {
    id: 5,
    title: "Performance Alert",
    description: "Network latency spike detected",
    timestamp: "20 minutes ago",
    type: "warning",
    icon: Activity,
  },
];

const getAlertVariant = (type: string) => {
  switch (type) {
    case "error":
      return "destructive";
    case "warning":
      return "default";
    case "success":
      return "default";
    default:
      return "default";
  }
};

export function ActivityFeed({ searchQuery, typeFilter, dateFilter }: ActivityFeedProps) {
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = searchQuery === "" ||
      activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === "all" ||
      activity.type.toLowerCase() === typeFilter.toLowerCase();

    // Simple date filtering - in a real app, you'd want to use proper date comparison
    const matchesDate = !dateFilter || activity.timestamp.includes(dateFilter.toLocaleDateString());

    return matchesSearch && matchesType && matchesDate;
  });

  return (
    <Card>
      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="space-y-4 p-4">
          {filteredActivities.map((activity) => (
            <Alert
              key={activity.id}
              variant={getAlertVariant(activity.type)}
            >
              <activity.icon className="h-4 w-4" />
              <AlertTitle className="flex items-center justify-between">
                {activity.title}
                <span className="text-xs text-muted-foreground">
                  {activity.timestamp}
                </span>
              </AlertTitle>
              <AlertDescription>{activity.description}</AlertDescription>
            </Alert>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}