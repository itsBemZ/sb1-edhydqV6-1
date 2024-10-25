"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeviceProfiles } from "@/lib/contexts/device-profile-context";
import { MapProfile } from "@/lib/types/map-profile";
import { Pencil, Plus, Trash2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["image/svg+xml", "image/png"];

const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  mapImage: z
    .custom<FileList>()
    .refine((files) => files?.length === 1, "Please select a map image")
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      "Max file size is 5MB"
    )
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      "Only .svg and .png files are accepted"
    )
    .optional()
    .or(z.string()),
});

export function MapProfiles() {
  const { profiles, addProfile, updateProfile, deleteProfile } = useDeviceProfiles();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<MapProfile | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      description: "",
      mapImage: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "File too large",
          description: "Max file size is 5MB",
          variant: "destructive",
        });
        return;
      }
      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Only .svg and .png files are accepted",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const onSubmit = async (data: z.infer<typeof profileFormSchema>) => {
    try {
      let mapImagePath = editingProfile?.mapImage;

      if (selectedFile) {
        // In a real app, you would upload the file to a server here
        // For now, we'll create an object URL as a placeholder
        mapImagePath = URL.createObjectURL(selectedFile);
      }

      if (editingProfile) {
        updateProfile(editingProfile.id, {
          name: data.name,
          description: data.description,
          mapImage: mapImagePath || editingProfile.mapImage,
          updatedAt: new Date().toISOString(),
        });
        
        toast({
          title: "Profile updated",
          description: `${data.name} has been updated successfully.`,
        });
      } else {
        if (!mapImagePath) {
          toast({
            title: "Map image required",
            description: "Please select a map image",
            variant: "destructive",
          });
          return;
        }

        const newProfile: MapProfile = {
          id: `profile-${Date.now()}`,
          name: data.name,
          description: data.description,
          mapImage: mapImagePath,
          devices: [],
          config: {
            layout: "hierarchical",
            autoArrange: true,
            showLabels: true,
            theme: "system",
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        addProfile(newProfile);
        
        toast({
          title: "Profile created",
          description: `${data.name} has been created successfully.`,
        });
      }
      
      setIsAddDialogOpen(false);
      setEditingProfile(null);
      setSelectedFile(null);
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (profile: MapProfile) => {
    setEditingProfile(profile);
    form.reset({
      name: profile.name,
      description: profile.description,
      mapImage: profile.mapImage,
    });
    setSelectedFile(null);
    setIsAddDialogOpen(true);
  };

  const handleDelete = (profileId: string) => {
    deleteProfile(profileId);
    toast({
      title: "Profile deleted",
      description: "The profile has been deleted successfully.",
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Map Profiles</CardTitle>
          <CardDescription>Create and manage network map profiles.</CardDescription>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Profile
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 overflow-hidden rounded border bg-muted">
                  {profile.mapImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profile.mapImage}
                      alt={`${profile.name} map`}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">{profile.name}</h4>
                  {profile.description && (
                    <p className="text-sm text-muted-foreground">
                      {profile.description}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {profile.devices.length} devices assigned
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(profile)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(profile.id)}
                  disabled={profile.id === "default"}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingProfile ? "Edit Profile" : "Create Profile"}
            </DialogTitle>
            <DialogDescription>
              {editingProfile
                ? "Update the map profile details below."
                : "Enter the details for the new map profile."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter profile name" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter profile description"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mapImage"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>Map Image</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('mapImage')?.click()}
                            className="w-full"
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            Select Map Image
                          </Button>
                          <Input
                            id="mapImage"
                            type="file"
                            accept=".svg,.png"
                            className="hidden"
                            onChange={handleFileChange}
                            {...field}
                          />
                        </div>
                        {(selectedFile || editingProfile?.mapImage) && (
                          <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={selectedFile ? URL.createObjectURL(selectedFile) : editingProfile?.mapImage}
                              alt="Selected map"
                              className="h-full w-full object-contain"
                            />
                          </div>
                        )}
                        <FormDescription>
                          Upload a .svg or .png file (max 5MB)
                        </FormDescription>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    setEditingProfile(null);
                    setSelectedFile(null);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingProfile ? "Update Profile" : "Create Profile"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}