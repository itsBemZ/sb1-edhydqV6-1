"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useTheme } from "next-themes";

const data = [
  { time: "00:00", value: 45 },
  { time: "04:00", value: 38 },
  { time: "08:00", value: 52 },
  { time: "12:00", value: 78 },
  { time: "16:00", value: 63 },
  { time: "20:00", value: 42 },
  { time: "24:00", value: 45 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              Time
            </span>
            <span className="font-bold text-foreground">{label}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              Value
            </span>
            <span className="font-bold text-foreground">
              {payload[0].value}%
            </span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export function PerformanceMetrics() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Network Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis 
                dataKey="time" 
                stroke={isDark ? "hsl(var(--muted-foreground))" : undefined}
                tick={{ fill: isDark ? "hsl(var(--muted-foreground))" : undefined }}
              />
              <YAxis 
                stroke={isDark ? "hsl(var(--muted-foreground))" : undefined}
                tick={{ fill: isDark ? "hsl(var(--muted-foreground))" : undefined }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}