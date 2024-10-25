import { Card } from "@/components/ui/card";
import { DeviceStatusOverview } from "@/components/dashboard/device-status";
import { PerformanceMetrics } from "@/components/dashboard/performance-metrics";
import { RecentAlerts } from "@/components/dashboard/recent-alerts";
import { QuickActions } from "@/components/dashboard/quick-actions";

export default function DashboardPage() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <DeviceStatusOverview />
      <PerformanceMetrics />
      <RecentAlerts />
      <QuickActions />
    </div>
  );
}