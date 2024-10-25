"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, RefreshCcw, Search } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";

interface ActivityFiltersProps {
  onSearchChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onDateChange: (date: Date | undefined) => void;
}

export function ActivityFilters({ onSearchChange, onTypeChange, onDateChange }: ActivityFiltersProps) {
  const handleRefresh = () => {
    // Implementation for refresh functionality
    console.log("Refreshing activity feed...");
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search activities..."
          className="pl-9"
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Select defaultValue="all" onValueChange={onTypeChange}>
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="alert">Alerts</SelectItem>
          <SelectItem value="info">Info</SelectItem>
          <SelectItem value="error">Errors</SelectItem>
          <SelectItem value="warning">Warnings</SelectItem>
          <SelectItem value="success">Success</SelectItem>
        </SelectContent>
      </Select>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {onDateChange ? format(new Date(), "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            onSelect={onDateChange}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <Button variant="outline" size="icon" onClick={handleRefresh}>
        <RefreshCcw className="h-4 w-4" />
      </Button>
    </div>
  );
}