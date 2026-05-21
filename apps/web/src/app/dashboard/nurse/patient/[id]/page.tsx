"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiFetch } from "@/lib/api";
import type { PatientProfileDto, VitalRecordDto, VisitNoteDto } from "@nursenest/types";
import { VitalsChart } from "@/components/vitals/vitals-chart";

interface PatientDetail {
  profile: PatientProfileDto;
  vitals: VitalRecordDto[];
  visitNotes: VisitNoteDto[];
}

export default function NursePatientPage() {
  const params = useParams();
  const id = params["id"] as string;
  const { data } = useQuery({
    queryKey: ["nurse-patient", id],
    queryFn: () => apiFetch<PatientDetail>(`/api/v1/nurse/patients/${id}`),
  });

  if (!data) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{data.profile.fullName}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <p>Blood group: {data.profile.bloodGroup ?? "—"}</p>
          <p>Allergies: {data.profile.allergies.join(", ") || "None"}</p>
          <p>Address: {data.profile.address ?? "—"}</p>
          <p>Emergency: {data.profile.emergencyContact ?? "—"}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Vitals</CardTitle>
        </CardHeader>
        <CardContent>
          {data.vitals.length > 0 ? <VitalsChart vitals={data.vitals} /> : <p>No vitals yet.</p>}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Visit Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.visitNotes.map((n) => (
            <div key={n.id} className="border-b pb-2 text-sm">
              <p>{n.observations}</p>
              {n.medications && <p className="text-muted-foreground">Meds: {n.medications}</p>}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
