"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiFetch } from "@/lib/api";
import type { PatientProfileDto } from "@nursenest/types";

export default function NurseVitalsLogPage() {
  const [patientId, setPatientId] = useState("");
  const { data: patients = [] } = useQuery({
    queryKey: ["nurse-patients"],
    queryFn: () => apiFetch<PatientProfileDto[]>("/api/v1/nurse/me/patients"),
  });

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await apiFetch("/api/v1/vitals", {
      method: "POST",
      body: JSON.stringify({
        patientId: fd.get("patientId"),
        heartRate: Number(fd.get("heartRate")),
        systolic: Number(fd.get("systolic")),
        diastolic: Number(fd.get("diastolic")),
        spo2: Number(fd.get("spo2")),
        temperature: Number(fd.get("temperature")),
      }),
    });
    alert("Vitals recorded and broadcast.");
    e.currentTarget.reset();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log Vitals</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="grid max-w-md gap-4">
          <div>
            <Label>Patient</Label>
            <select
              name="patientId"
              className="flex h-10 w-full rounded-md border px-3"
              required
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
            >
              <option value="">Select patient</option>
              {patients.map((p) => (
                <option key={p.userId} value={p.userId}>
                  {p.fullName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Heart Rate</Label>
            <Input name="heartRate" type="number" required />
          </div>
          <div>
            <Label>Systolic / Diastolic</Label>
            <div className="flex gap-2">
              <Input name="systolic" type="number" required />
              <Input name="diastolic" type="number" required />
            </div>
          </div>
          <div>
            <Label>SpO2</Label>
            <Input name="spo2" type="number" required />
          </div>
          <div>
            <Label>Temperature (°C)</Label>
            <Input name="temperature" type="number" step="0.1" required />
          </div>
          <Button type="submit">Submit & Broadcast</Button>
        </form>
      </CardContent>
    </Card>
  );
}
