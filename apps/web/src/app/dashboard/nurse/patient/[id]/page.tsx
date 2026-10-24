"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import type { PatientProfileDto, VisitNoteDto, VitalRecordDto } from "@nursenest/types";
import { apiFetch } from "@/lib/api";
import { VitalsChart } from "@/components/vitals/vitals-chart";
import { Panel, Skeleton, ErrorNote } from "@/components/common/panel";
import { formatDate } from "@/lib/utils";

interface PatientDetail { profile: PatientProfileDto; vitals: VitalRecordDto[]; visitNotes: VisitNoteDto[] }

export default function NursePatientPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";
  const q = useQuery({ queryKey: ["nurse-patient", id], queryFn: () => apiFetch<PatientDetail>(`/api/v1/nurse/patients/${id}`), enabled: !!id });

  if (q.isLoading || !id) return <div className="space-y-4"><Skeleton className="h-40" /><Skeleton className="h-72" /></div>;
  if (q.isError || !q.data) return <ErrorNote message={q.error?.message ?? "Patient not found"} onRetry={() => void q.refetch()} />;
  const { profile: p, vitals, visitNotes } = q.data;

  return (
    <div className="space-y-6">
      <Link href="/dashboard/nurse/schedule" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Schedule</Link>
      <Panel eyebrow="Patient record" title={p.fullName}>
        <dl className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
          {[["Blood group", p.bloodGroup ?? "Not recorded"], ["Allergies", p.allergies.join(", ") || "None recorded"], ["Address", p.address ?? "Not recorded"], ["Emergency contact", p.emergencyContact ?? "Not recorded"]].map(([k, v]) => (
            <div key={k} className="rounded-2xl bg-muted/60 p-4"><dt className="eyebrow">{k}</dt><dd className="mt-1">{v}</dd></div>))}
        </dl>
      </Panel>
      <Panel eyebrow="Trend" title="Vitals">
        {vitals.length > 0 ? <VitalsChart vitals={vitals} /> : <p className="py-6 text-sm text-muted-foreground">No vitals recorded yet.</p>}
      </Panel>
      <Panel eyebrow={`${visitNotes.length} notes`} title="Visit notes">
        {visitNotes.length === 0 ? <p className="py-6 text-sm text-muted-foreground">No visit notes yet.</p> : (
          <ul className="space-y-3">{visitNotes.map((n) => (
            <li key={n.id} className="rounded-2xl border p-4 text-sm">
              <p className="text-xs text-muted-foreground">{formatDate(n.createdAt)}</p>
              <p className="mt-1 whitespace-pre-wrap">{n.observations}</p>
              {n.medications && <p className="mt-2 text-muted-foreground">Medications: {n.medications}</p>}
              {n.nextVisitDate && <p className="text-muted-foreground">Suggested next visit: {formatDate(n.nextVisitDate)}</p>}
            </li>))}</ul>)}
      </Panel>
    </div>
  );
}
