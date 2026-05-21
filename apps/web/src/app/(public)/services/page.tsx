import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiFetchServer } from "@/lib/api";
import type { ServiceDto } from "@nursenest/types";
import { formatCurrency } from "@/lib/utils";

export const revalidate = 60;

export default async function ServicesPage() {
  let services: ServiceDto[] = [];
  try {
    services = await apiFetchServer<ServiceDto[]>("/api/v1/services");
  } catch {
    services = [];
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-2 text-4xl font-bold">Our Services</h1>
      <p className="mb-8 text-muted-foreground">Transparent pricing for every home visit.</p>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <Card key={s.id}>
            <CardHeader>
              <CardTitle>{s.name}</CardTitle>
              <p className="text-sm text-primary">{s.category}</p>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{s.description}</p>
              <p className="mt-4 font-semibold">{formatCurrency(s.pricePerVisit)}</p>
              <p className="text-sm text-muted-foreground">{s.durationMinutes} minutes</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
