"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, WifiOff, Server } from "lucide-react";

const alerts = [
  {
    id: 1,
    title: "Server CPU High",
    description: "Server-01 CPU usage above 90%",
    icon: Server,
    severity: "error",
  },
  {
    id: 2,
    title: "WAP Offline",
    description: "WAP-03 connection lost",
    icon: WifiOff,
    severity: "warning",
  },
];

export function RecentAlerts() {
  return (
    <Card className="col-span-2 lg:col-span-1">
      <CardHeader>
        <CardTitle>Recent Alerts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.map((alert) => (
          <Alert
            key={alert.id}
            variant={alert.severity === "error" ? "destructive" : "default"}
          >
            <alert.icon className="h-4 w-4" />
            <AlertTitle>{alert.title}</AlertTitle>
            <AlertDescription>{alert.description}</AlertDescription>
          </Alert>
        ))}
      </CardContent>
    </Card>
  );
}