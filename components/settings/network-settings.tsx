"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const networkFormSchema = z.object({
  scanInterval: z.string(),
  discoveryEnabled: z.boolean(),
  ipRange: z.string(),
  snmpCommunity: z.string(),
  protocol: z.string(),
});

type NetworkFormValues = z.infer<typeof networkFormSchema>;

const defaultValues: NetworkFormValues = {
  scanInterval: "300",
  discoveryEnabled: true,
  ipRange: "192.168.1.0/24",
  snmpCommunity: "public",
  protocol: "snmpv3",
};

export function NetworkSettings() {
  const form = useForm<NetworkFormValues>({
    resolver: zodResolver(networkFormSchema),
    defaultValues,
  });

  function onSubmit(data: NetworkFormValues) {
    console.log(data);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Network Configuration</CardTitle>
        <CardDescription>Configure network scanning and discovery settings.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="scanInterval"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scan Interval (seconds)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min="60" />
                  </FormControl>
                  <FormDescription>
                    How often the network should be scanned for changes.
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="discoveryEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Auto Discovery</FormLabel>
                    <FormDescription>
                      Automatically discover new devices on the network.
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
              name="ipRange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IP Range</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="192.168.1.0/24" />
                  </FormControl>
                  <FormDescription>
                    The IP range to scan for devices (CIDR notation).
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="protocol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SNMP Protocol Version</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select SNMP version" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="snmpv2c">SNMP v2c</SelectItem>
                      <SelectItem value="snmpv3">SNMP v3</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The SNMP protocol version to use for device monitoring.
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