"use client";

import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiFetch } from "@/lib/api";

export default function VisitNotePage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params["bookingId"] as string;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await apiFetch(`/api/v1/nurse/notes/${bookingId}`, {
      method: "POST",
      body: JSON.stringify({
        observations: fd.get("observations"),
        medications: fd.get("medications") || undefined,
        nextVisitDate: fd.get("nextVisitDate") || undefined,
      }),
    });
    router.push("/dashboard/nurse/schedule");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Post-Visit Note</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="grid max-w-lg gap-4">
          <div>
            <Label>Observations</Label>
            <textarea
              name="observations"
              className="flex min-h-[120px] w-full rounded-md border px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <Label>Medications</Label>
            <Input name="medications" />
          </div>
          <div>
            <Label>Next visit</Label>
            <Input name="nextVisitDate" type="date" />
          </div>
          <Button type="submit">Submit note & complete visit</Button>
        </form>
      </CardContent>
    </Card>
  );
}
