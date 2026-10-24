"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2 } from "lucide-react";
import type { PatientProfileDto } from "@nursenest/types";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Panel, Skeleton, ErrorNote } from "@/components/common/panel";

export default function PatientProfilePage() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["patient-profile"], queryFn: () => apiFetch<PatientProfileDto>("/api/v1/patients/me") });
  const update = useMutation({
    mutationFn: (body: Partial<PatientProfileDto>) => apiFetch<PatientProfileDto>("/api/v1/patients/me", { method: "PATCH", body: JSON.stringify(body) }),
    onSuccess: (p) => qc.setQueryData(["patient-profile"], p),
  });
  if (q.isLoading) return <Skeleton className="h-96" />;
  if (q.isError || !q.data) return <ErrorNote message={q.error?.message ?? "Profile not found"} onRetry={() => void q.refetch()} />;
  const p = q.data;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <Panel eyebrow="Patient details" title="Profile">
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const s = (k: string) => String(fd.get(k) ?? "").trim();
          update.mutate({ fullName: s("fullName"), bloodGroup: s("bloodGroup") || null, address: s("address") || null, emergencyContact: s("emergencyContact") || null,
            allergies: s("allergies").split(",").map((a) => a.trim()).filter(Boolean) });
        }}>
          <div className="space-y-2 sm:col-span-2"><Label htmlFor="fullName">Full name</Label><Input id="fullName" name="fullName" required defaultValue={p.fullName} /></div>
          <div className="space-y-2"><Label htmlFor="bloodGroup">Blood group</Label><Input id="bloodGroup" name="bloodGroup" defaultValue={p.bloodGroup ?? ""} /></div>
          <div className="space-y-2"><Label htmlFor="emergencyContact">Emergency contact</Label><Input id="emergencyContact" name="emergencyContact" defaultValue={p.emergencyContact ?? ""} /></div>
          <div className="space-y-2 sm:col-span-2"><Label htmlFor="address">Address</Label><Input id="address" name="address" defaultValue={p.address ?? ""} /></div>
          <div className="space-y-2 sm:col-span-2"><Label htmlFor="allergies">Allergies (comma separated)</Label><Input id="allergies" name="allergies" defaultValue={p.allergies.join(", ")} /></div>
          <div className="space-y-3 sm:col-span-2">
            {update.isError && <ErrorNote message={update.error.message} />}
            {update.isSuccess && <p className="flex items-center gap-2 text-sm text-[hsl(var(--sage))]"><CheckCircle2 className="h-4 w-4" /> Saved.</p>}
            <Button type="submit" disabled={update.isPending} className="rounded-full">{update.isPending ? "Saving" : "Save changes"}</Button>
          </div>
        </form>
      </Panel>
      <Panel eyebrow="Shared with your nurse" title="Care summary">
        <dl className="space-y-3 text-sm">
          <div><dt className="text-muted-foreground">Date of birth</dt><dd>{new Date(p.dateOfBirth).toLocaleDateString("en-IN", { dateStyle: "long" })}</dd></div>
          <div><dt className="text-muted-foreground">Allergies</dt><dd>{p.allergies.join(", ") || "None recorded"}</dd></div>
        </dl>
      </Panel>
    </div>
  );
}
