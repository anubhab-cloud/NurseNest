"use client";

import { useQuery } from "@tanstack/react-query";
import { HeartPulse } from "lucide-react";
import type { PaginatedDto, VitalRecordDto } from "@nursenest/types";
import { apiFetch } from "@/lib/api";
import { VitalsChart } from "@/components/vitals/vitals-chart";
import { Panel, Skeleton, ErrorNote } from "@/components/common/panel";
import { EmptyState } from "@/components/common/empty-state";
import { formatDate } from "@/lib/utils";

export default function PatientVitalsPage() {
  const q = useQuery({ queryKey: ["patient-vitals", 50], queryFn: () => apiFetch<PaginatedDto<VitalRecordDto>>("/api/v1/patients/me/vitals?limit=50") });
  if (q.isLoading) return <Skeleton className="h-96" />;
  if (q.isError) return <ErrorNote message={q.error.message} onRetry={() => void q.refetch()} />;
  const vitals = q.data?.items ?? [];
  if (!vitals.length) return <EmptyState icon={HeartPulse} title="No vitals recorded yet" body="Readings appear here when your nurse logs them during a visit." />;

  return (
    <div className="space-y-6">
      <Panel eyebrow="Trend" title="Vitals history"><VitalsChart vitals={vitals} /></Panel>
      <Panel title="Readings">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-xs uppercase tracking-wider text-muted-foreground"><th className="py-2">Recorded</th><th>HR</th><th>BP</th><th>SpO2</th><th>Temp</th></tr></thead>
            <tbody className="divide-y">{vitals.map((v) => (
              <tr key={v.id}><td className="py-2.5">{formatDate(v.recordedAt)}</td><td>{v.heartRate}</td><td>{v.systolic}/{v.diastolic}</td><td>{v.spo2}%</td><td>{v.temperature}°C</td></tr>))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">These are readings as recorded, not a diagnosis. Discuss concerns with a doctor.</p>
      </Panel>
    </div>
  );
}
