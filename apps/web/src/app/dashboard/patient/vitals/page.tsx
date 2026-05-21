"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiFetch } from "@/lib/api";
import type { VitalRecordDto, PaginatedDto } from "@nursenest/types";
import { VitalsChart } from "@/components/vitals/vitals-chart";

export default function PatientVitalsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["patient-vitals-full"],
    queryFn: () => apiFetch<PaginatedDto<VitalRecordDto>>("/api/v1/patients/me/vitals?limit=50"),
  });

  if (isLoading) return <p>Loading vitals...</p>;

  const vitals = data?.items ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vitals History</CardTitle>
      </CardHeader>
      <CardContent>
        {vitals.length > 0 ? <VitalsChart vitals={vitals} /> : <p>No vitals recorded yet.</p>}
      </CardContent>
    </Card>
  );
}
