"use client";

import { ActivityFeed } from "@/components/activity/activity-feed";
import { ActivityFilters } from "@/components/activity/activity-filters";
import { useState } from "react";

export default function ActivityPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState<Date>();

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Activity Log</h3>
        <p className="text-sm text-muted-foreground">
          Track and monitor network activity and events.
        </p>
      </div>
      <ActivityFilters
        onSearchChange={setSearchQuery}
        onTypeChange={setTypeFilter}
        onDateChange={setDateFilter}
      />
      <ActivityFeed
        searchQuery={searchQuery}
        typeFilter={typeFilter}
        dateFilter={dateFilter}
      />
    </div>
  );
}