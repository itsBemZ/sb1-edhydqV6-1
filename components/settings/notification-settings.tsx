"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

const notificationFormSchema = z.object({
  emailEnabled: z.boolean(),
  emailAddress: z.string().email().optional(),
  slackEnabled: z.boolean(),
  slackWebhook: z.string().optional(),
  alertThreshold: z.string(),
});

type NotificationFormValues = z.infer<typeof notificationFormSchema>;

const defaultValues: NotificationFormValues = {
  emailEnabled: true,
  emailAddress: "admin@example.com",
  slackEnabled: false,
  slackWebhook: "",
  alertThreshold: "critical",
};

export function NotificationSettings() {
  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues,
  });

  function onSubmit(data: NotificationFormValues) {
    console.log(data);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Configure how you want to receive alerts and notifications.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="emailEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Email Notifications</FormLabel>
                    <FormDescription>
                      Receive notifications via email.
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
              name="emailAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="admin@example.com" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slackEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Slack Notifications</FormLabel>
                    <FormDescription>
                      Receive notifications in Slack.
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
              name="slackWebhook"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slack Webhook URL</FormLabel>
                  <FormControl>
                    <Input {...field} type="url" placeholder="https://hooks.slack.com/..." />
                  </FormControl>
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