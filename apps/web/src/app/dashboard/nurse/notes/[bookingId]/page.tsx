"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Panel, ErrorNote } from "@/components/common/panel";
import { apiFetch } from "@/lib/api";

export default function VisitNotePage() {
  const params = useParams<{ bookingId: string }>();
  const router = useRouter();
  const qc = useQueryClient();
  const bookingId = params.bookingId;
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setSaving(true);
    setError("");
    try {
      await apiFetch(`/api/v1/nurse/notes/${bookingId}`, {
        method: "POST",
        body: JSON.stringify({
          observations: fd.get("observations"),
          medications: fd.get("medications") || undefined,
          nextVisitDate: fd.get("nextVisitDate") ? new Date(String(fd.get("nextVisitDate"))).toISOString() : undefined,
        }),
      });
      await qc.invalidateQueries({ queryKey: ["nurse-bookings"] });
      router.push("/dashboard/nurse/schedule");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the note.");
      setSaving(false);
    }
  }

  return (
    <Panel eyebrow="After the visit" title="Visit note" className="max-w-2xl">
      <form onSubmit={submit} className="grid gap-5">
        <div className="space-y-2">
          <Label htmlFor="observations">Observations</Label>
          <textarea id="observations" name="observations" required minLength={5}
            className="min-h-[160px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
        </div>
        <div className="space-y-2"><Label htmlFor="medications">Medications noted</Label><Input id="medications" name="medications" /></div>
        <div className="space-y-2"><Label htmlFor="nextVisitDate">Suggested next visit</Label><Input id="nextVisitDate" name="nextVisitDate" type="date" min={new Date().toISOString().slice(0, 10)} /></div>
        {error && <ErrorNote message={error} />}
        <Button type="submit" disabled={saving} className="rounded-full">{saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving</> : "Save note and complete visit"}</Button>
      </form>
    </Panel>
  );
}
