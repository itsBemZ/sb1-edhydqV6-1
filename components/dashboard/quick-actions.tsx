"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Scan, RefreshCw, Bell, Power } from "lucide-react";

const actions = [
  { name: "Network Scan", icon: Scan },
  { name: "Refresh Status", icon: RefreshCw },
  { name: "Clear Alerts", icon: Bell },
  { name: "Power Cycle", icon: Power },
];

export function QuickActions() {
  return (
    <Card className="col-span-2 lg:col-span-1">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {actions.map((action) => (
            <Button
              key={action.name}
              variant="outline"
              className="h-20 flex-col gap-2"
            >
              <action.icon className="h-5 w-5" />
              {action.name}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}