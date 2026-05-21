"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiFetch } from "@/lib/api";
import type { PatientProfileDto } from "@nursenest/types";

export default function PatientProfilePage() {
  const qc = useQueryClient();
  const { data: profile } = useQuery({
    queryKey: ["patient-profile"],
    queryFn: () => apiFetch<PatientProfileDto>("/api/v1/patients/me"),
  });

  const update = useMutation({
    mutationFn: (body: Partial<PatientProfileDto>) =>
      apiFetch<PatientProfileDto>("/api/v1/patients/me", {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["patient-profile"] }),
  });

  if (!profile) return <p>Loading...</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="grid max-w-md gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            update.mutate({
              fullName: String(fd.get("fullName")),
              address: String(fd.get("address")),
              emergencyContact: String(fd.get("emergencyContact")),
              bloodGroup: String(fd.get("bloodGroup")),
            });
          }}
        >
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" name="fullName" defaultValue={profile.fullName} />
          </div>
          <div>
            <Label htmlFor="bloodGroup">Blood Group</Label>
            <Input id="bloodGroup" name="bloodGroup" defaultValue={profile.bloodGroup ?? ""} />
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input id="address" name="address" defaultValue={profile.address ?? ""} />
          </div>
          <div>
            <Label htmlFor="emergencyContact">Emergency Contact</Label>
            <Input id="emergencyContact" name="emergencyContact" defaultValue={profile.emergencyContact ?? ""} />
          </div>
          <Button type="submit" disabled={update.isPending}>
            Save
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
