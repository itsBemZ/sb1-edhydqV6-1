"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Search } from "lucide-react";

interface LogFiltersProps {
  onSearchChange: (value: string) => void;
  onLevelChange: (value: string) => void;
  onSourceChange: (value: string) => void;
}

export function LogFilters({ onSearchChange, onLevelChange, onSourceChange }: LogFiltersProps) {
  const handleDownload = () => {
    // Implementation for log download functionality
    console.log("Downloading logs...");
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search logs..."
          className="pl-9"
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Select defaultValue="all" onValueChange={onLevelChange}>
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Levels</SelectItem>
          <SelectItem value="error">Error</SelectItem>
          <SelectItem value="warning">Warning</SelectItem>
          <SelectItem value="info">Info</SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue="all" onValueChange={onSourceChange}>
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Source" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Sources</SelectItem>
          <SelectItem value="server">Servers</SelectItem>
          <SelectItem value="wap">WAPs</SelectItem>
          <SelectItem value="firewall">Firewall</SelectItem>
          <SelectItem value="system">System</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="outline" size="icon" onClick={handleDownload}>
        <Download className="h-4 w-4" />
      </Button>
    </div>
  );
}