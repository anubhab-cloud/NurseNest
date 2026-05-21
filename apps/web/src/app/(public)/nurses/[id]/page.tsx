import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiFetchServer } from "@/lib/api";
import type { NurseProfileDto, ReviewDto } from "@nursenest/types";

export default async function NurseProfilePage({ params }: { params: { id: string } }) {
  const [nurse, reviews] = await Promise.all([
    apiFetchServer<NurseProfileDto>(`/api/v1/nurses/${params.id}`).catch(() => null),
    apiFetchServer<ReviewDto[]>(`/api/v1/nurses/${params.id}/reviews`).catch(() => []),
  ]);

  if (!nurse) {
    return <div className="container mx-auto px-4 py-12">Nurse not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold">{nurse.fullName}</h1>
      <p className="text-muted-foreground">Cert: {nurse.certificationNumber}</p>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>Specializations: {nurse.specializations.join(", ") || "General"}</p>
            <p>Experience: {nurse.yearsExp} years</p>
            <p>Rating: ⭐ {nurse.rating.toFixed(1)} ({nurse.totalVisits} visits)</p>
            <p>Status: {nurse.isAvailable ? "Available" : "Currently unavailable"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Reviews</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-muted-foreground">No reviews yet.</p>
            ) : (
              reviews.map((r) => (
                <div key={r.id} className="border-b pb-2">
                  <p>⭐ {r.rating}/5</p>
                  {r.comment && <p className="text-sm text-muted-foreground">{r.comment}</p>}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
