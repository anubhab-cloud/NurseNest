import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiFetchServer } from "@/lib/api";
import type { NurseProfileDto } from "@nursenest/types";

export const revalidate = 60;

export default async function NursesPage() {
  let nurses: NurseProfileDto[] = [];
  try {
    nurses = await apiFetchServer<NurseProfileDto[]>("/api/v1/nurses/available");
  } catch {
    nurses = [];
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-4xl font-bold">Find a Nurse</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {nurses.map((n) => (
          <Link key={n.userId} href={`/nurses/${n.userId}`}>
            <Card className="transition hover:shadow-md">
              <CardHeader>
                <CardTitle>{n.fullName}</CardTitle>
                <Badge variant={n.isAvailable ? "success" : "secondary"}>
                  {n.isAvailable ? "Available" : "Busy"}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {n.specializations.join(", ") || "General care"}
                </p>
                <p className="mt-2">
                  ⭐ {n.rating.toFixed(1)} · {n.yearsExp} yrs · {n.totalVisits} visits
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
