import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";
import Link from "next/link";

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6" />
            <CardTitle className="text-2xl">Authentication Error</CardTitle>
          </div>
          <CardDescription>
            There was an error signing in to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <p className="text-sm text-muted-foreground text-center">
            Please check your credentials and try again.
          </p>
          <Button asChild>
            <Link href="/auth/login">
              Return to Login
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}