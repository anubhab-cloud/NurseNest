"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import type { NurseProfileDto } from "@nursenest/types";
import { useQuery } from "@tanstack/react-query";

export default function NurseProfilePage() {
  const { data: profile, refetch } = useQuery({
    queryKey: ["nurse-me"],
    queryFn: () => apiFetch<NurseProfileDto>("/api/v1/nurse/me"),
  });
  const [available, setAvailable] = useState<boolean | null>(null);
  const isAvailable = available ?? profile?.isAvailable ?? true;

  async function saveAvailability() {
    await apiFetch("/api/v1/nurses/me/availability", {
      method: "PATCH",
      body: JSON.stringify({ isAvailable }),
    });
    void refetch();
    alert("Availability updated");
  }

  if (!profile) return <p>Loading...</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{profile.fullName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">Cert: {profile.certificationNumber}</p>
        <p className="text-sm">Specializations: {profile.specializations.join(", ") || "—"}</p>
        <p className="text-sm">⭐ {profile.rating} · {profile.totalVisits} visits</p>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isAvailable}
            onChange={(e) => setAvailable(e.target.checked)}
          />
          Available for new bookings
        </label>
        <Button onClick={() => void saveAvailability()}>Save availability</Button>
      </CardContent>
    </Card>
  );
}
