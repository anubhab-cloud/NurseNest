"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ChatStub() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Messages</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
          In-app chat with your assigned nurse is coming soon. For urgent needs, contact your
          emergency contact or call NurseNest support.
        </p>
        <div className="flex gap-2">
          <Input placeholder="Type a message..." disabled />
          <Button disabled>Send</Button>
        </div>
      </CardContent>
    </Card>
  );
}
