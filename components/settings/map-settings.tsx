"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const mapFormSchema = z.object({
  layout: z.string(),
  autoArrange: z.boolean(),
  showLabels: z.boolean(),
  theme: z.string(),
});

type MapFormValues = z.infer<typeof mapFormSchema>;

const defaultValues: MapFormValues = {
  layout: "hierarchical",
  autoArrange: true,
  showLabels: true,
  theme: "system",
};

export function MapSettings() {
  const form = useForm<MapFormValues>({
    resolver: zodResolver(mapFormSchema),
    defaultValues,
  });

  function onSubmit(data: MapFormValues) {
    console.log(data);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Map Settings</CardTitle>
        <CardDescription>Customize how the network map is displayed.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="layout"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Layout Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select layout type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="hierarchical">Hierarchical</SelectItem>
                      <SelectItem value="circular">Circular</SelectItem>
                      <SelectItem value="grid">Grid</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    How devices are arranged on the network map.
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="autoArrange"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Auto-arrange Devices</FormLabel>
                    <FormDescription>
                      Automatically arrange devices based on network topology.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="showLabels"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Show Labels</FormLabel>
                    <FormDescription>
                      Display device names and details on the map.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="theme"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Map Theme</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select map theme" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="system">System</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the visual theme for the network map.
                  </FormDescription>
                </FormItem>
              )}
            />
            <Button type="submit">Save Changes</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}