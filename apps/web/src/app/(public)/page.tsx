import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hero } from "@/components/home/hero";
import { apiFetchServer } from "@/lib/api";
import type { ServiceDto } from "@nursenest/types";
import { formatCurrency } from "@/lib/utils";

export const revalidate = 60;

async function getServices(): Promise<ServiceDto[]> {
  try {
    return await apiFetchServer<ServiceDto[]>("/api/v1/services");
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const services = await getServices();
  const featured = services.slice(0, 3);

  return (
    <>
      <Hero />
      <section className="container mx-auto px-4 py-16">
        <h2 className="mb-8 text-center text-3xl font-bold">Our Services</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {featured.length > 0 ? (
            featured.map((s) => (
              <Card key={s.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{s.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{s.description}</p>
                  <p className="mt-4 font-semibold text-primary">{formatCurrency(s.pricePerVisit)}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="col-span-3 text-center text-muted-foreground">
              Start the API to load services, or run <code>pnpm db:seed</code>.
            </p>
          )}
        </div>
        <MotionDiv className="mt-8 text-center">
          <Button asChild>
            <Link href="/services">See all services</Link>
          </Button>
        </MotionDiv>
      </section>

      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold">Why NurseNest?</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { title: "Certified Nurses", desc: "All nurses are verified with valid certifications." },
              { title: "Live Vitals", desc: "Track heart rate, BP, and SpO2 in real time during visits." },
              { title: "Secure Payments", desc: "Pay safely via Razorpay with instant invoice receipts." },
            ].map((item) => (
              <Card key={item.title}>
                <CardHeader>
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function MotionDiv({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={className}>{children}</div>;
}
