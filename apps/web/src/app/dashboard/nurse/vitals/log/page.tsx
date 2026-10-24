"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Loader2 } from "lucide-react";
import type { PatientProfileDto } from "@nursenest/types";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Panel, Skeleton, ErrorNote } from "@/components/common/panel";

const fields = [
  { name: "heartRate", label: "Heart rate (bpm)", min: 20, max: 250, step: 1 },
  { name: "systolic", label: "Systolic (mmHg)", min: 50, max: 260, step: 1 },
  { name: "diastolic", label: "Diastolic (mmHg)", min: 30, max: 160, step: 1 },
  { name: "spo2", label: "SpO2 (%)", min: 50, max: 100, step: 1 },
  { name: "temperature", label: "Temperature (°C)", min: 30, max: 45, step: 0.1 },
];

export default function NurseVitalsLogPage() {
  const qc = useQueryClient();
  const [patientId, setPatientId] = useState("");
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const q = useQuery({ queryKey: ["nurse-patients"], queryFn: () => apiFetch<PatientProfileDto[]>("/api/v1/nurse/me/patients") });
  const save = useMutation({
    mutationFn: (body: Record<string, unknown>) => apiFetch("/api/v1/vitals", { method: "POST", body: JSON.stringify(body) }),
    onSuccess: (_d, body) => { setSavedAt(new Date().toLocaleTimeString("en-IN")); void qc.invalidateQueries({ queryKey: ["nurse-patient", body["patientId"]] }); },
  });

  return (
    <Panel eyebrow="During a visit" title="Log vitals" className="max-w-2xl">
      {q.isLoading ? <Skeleton className="h-64" /> : q.isError ? <ErrorNote message={q.error.message} onRetry={() => void q.refetch()} /> : (
        <form className="grid gap-5" onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const body: Record<string, unknown> = { patientId };
          fields.forEach((x) => { body[x.name] = Number(fd.get(x.name)); });
          setSavedAt(null);
          save.mutate(body, { onSuccess: () => (e.target as HTMLFormElement).reset() });
        }}>
          <div className="space-y-2">
            <Label htmlFor="patientId">Patient</Label>
            <select id="patientId" required value={patientId} onChange={(e) => setPatientId(e.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" data-testid="select-patient">
              <option value="">{q.data?.length ? "Select patient" : "No assigned patients"}</option>
              {(q.data ?? []).map((p) => <option key={p.userId} value={p.userId}>{p.fullName}</option>)}
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map((x) => <div key={x.name} className="space-y-2"><Label htmlFor={x.name}>{x.label}</Label><Input id={x.name} name={x.name} type="number" min={x.min} max={x.max} step={x.step} required /></div>)}
          </div>
          {save.isError && <ErrorNote message={save.error.message} />}
          {savedAt && <p className="flex items-center gap-2 text-sm text-[hsl(var(--sage))]"><CheckCircle2 className="h-4 w-4" /> Saved at {savedAt}.</p>}
          <Button type="submit" disabled={save.isPending || !patientId} className="rounded-full">{save.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving</> : "Save reading"}</Button>
        </form>)}
    </Panel>
  );
}
