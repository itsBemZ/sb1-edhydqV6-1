"use client";

import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Log {
  id: number;
  timestamp: string;
  level: string;
  source: string;
  message: string;
}

interface LogViewerProps {
  searchQuery: string;
  levelFilter: string;
  sourceFilter: string;
}

const logs: Log[] = [
  {
    id: 1,
    timestamp: "2024-03-20 10:15:23",
    level: "ERROR",
    source: "SERVER-01",
    message: "Failed to establish database connection",
  },
  {
    id: 2,
    timestamp: "2024-03-20 10:15:20",
    level: "INFO",
    source: "WAP-02",
    message: "Client device connected: MAC 00:1B:44:11:3A:B7",
  },
  {
    id: 3,
    timestamp: "2024-03-20 10:15:18",
    level: "WARNING",
    source: "FIREWALL",
    message: "Suspicious traffic detected from IP 192.168.1.155",
  },
  {
    id: 4,
    timestamp: "2024-03-20 10:15:15",
    level: "INFO",
    source: "SYSTEM",
    message: "Scheduled backup completed successfully",
  },
  {
    id: 5,
    timestamp: "2024-03-20 10:15:10",
    level: "ERROR",
    source: "WAP-03",
    message: "Device offline: Connection timeout",
  },
];

const getLevelColor = (level: string) => {
  switch (level) {
    case "ERROR":
      return "text-red-500 border-red-500";
    case "WARNING":
      return "text-yellow-500 border-yellow-500";
    case "INFO":
      return "text-blue-500 border-blue-500";
    default:
      return "text-gray-500 border-gray-500";
  }
};

export function LogViewer({ searchQuery, levelFilter, sourceFilter }: LogViewerProps) {
  const filteredLogs = logs.filter(log => {
    const matchesSearch = searchQuery === "" ||
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.source.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLevel = levelFilter === "all" ||
      log.level.toLowerCase() === levelFilter.toLowerCase();

    const matchesSource = sourceFilter === "all" ||
      log.source.toLowerCase().includes(sourceFilter.toLowerCase());

    return matchesSearch && matchesLevel && matchesSource;
  });

  return (
    <Card>
      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="space-y-1 p-4 font-mono text-sm">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-center gap-4 rounded-md border p-2 hover:bg-muted"
            >
              <span className="text-xs text-muted-foreground">
                {log.timestamp}
              </span>
              <Badge
                variant="outline"
                className={cn("w-16 justify-center", getLevelColor(log.level))}
              >
                {log.level}
              </Badge>
              <span className="font-medium">{log.source}</span>
              <span className="flex-1">{log.message}</span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}