"use client";

import { LogViewer } from "@/components/logs/log-viewer";
import { LogFilters } from "@/components/logs/log-filters";
import { useState } from "react";

export default function LogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">System Logs</h3>
        <p className="text-sm text-muted-foreground">
          View and analyze system logs and events.
        </p>
      </div>
      <LogFilters
        onSearchChange={setSearchQuery}
        onLevelChange={setLevelFilter}
        onSourceChange={setSourceFilter}
      />
      <LogViewer
        searchQuery={searchQuery}
        levelFilter={levelFilter}
        sourceFilter={sourceFilter}
      />
    </div>
  );
}