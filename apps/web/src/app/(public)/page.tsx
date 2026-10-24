import Link from "next/link";
import Image from "next/image";
import { CalendarClock, ClipboardList, HeartPulse, MessageCircle, ShieldCheck, UserRoundSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Hero } from "@/components/home/hero";
import { ServiceCard } from "@/components/services/service-card";
import { EmptyState } from "@/components/common/empty-state";
import { apiFetchServer } from "@/lib/api";
import type { ServiceDto } from "@nursenest/types";

export const revalidate = 60;

async function getServices(): Promise<ServiceDto[]> {
  try {
    return await apiFetchServer<ServiceDto[]>("/api/v1/services");
  } catch {
    return [];
  }
}

const steps = [
  { icon: UserRoundSearch, title: "Choose the care", body: "Pick a service and a time that suits the household. Prices are shown per visit before you book." },
  { icon: CalendarClock, title: "A nurse is assigned", body: "Your booking moves from pending to confirmed once a nurse accepts it. You can follow every status change." },
  { icon: ClipboardList, title: "Visit, then record", body: "After the visit the nurse logs vitals and observations, so the whole family can read the same notes." },
];

const features = [
  { icon: HeartPulse, title: "Vitals in one timeline", body: "Heart rate, blood pressure, SpO2 and temperature as recorded by your nurse, charted over time." },
  { icon: ClipboardList, title: "Visit notes you can reread", body: "Observations, medications noted and the suggested next visit — written down, not just said at the door." },
  { icon: MessageCircle, title: "Booking-linked messages", body: "Message about a specific booking, so questions stay attached to the visit they concern." },
  { icon: ShieldCheck, title: "Clear roles", body: "Families, nurses and administrators each see only what their role needs." },
];

export default async function HomePage() {
  const services = await getServices();
  const featured = services.slice(0, 4);

  return (
    <>
      <Hero />

      <section className="container mx-auto px-4 py-20">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Services</p>
            <h2 className="mt-3 max-w-xl text-4xl font-medium md:text-5xl">What a visit can cover</h2>
          </div>
          <Button variant="outline" asChild className="rounded-full">
            <Link href="/services" data-testid="link-all-services">See all services</Link>
          </Button>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.length > 0 ? (
            featured.map((s, i) => <ServiceCard key={s.id} service={s} index={i} />)
          ) : (
            <EmptyState icon={ClipboardList} title="Services are loading slowly" body="We could not reach the service list just now. Please refresh in a moment." />
          )}
        </div>
      </section>

      <section className="bg-primary text-primary-foreground">
        <div className="container mx-auto grid gap-14 px-4 py-24 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="eyebrow !text-[hsl(var(--marigold))]">How it works</p>
            <h2 className="mt-3 text-4xl font-medium md:text-5xl">Three steps, written plainly.</h2>
            <p className="mt-5 max-w-sm opacity-75">No call-centre loops. You book, a nurse confirms, and the record stays with you.</p>
          </div>
          <ol className="space-y-px overflow-hidden rounded-3xl bg-white/10">
            {steps.map((s, i) => (
              <li key={s.title} className="flex gap-6 bg-primary p-7">
                <span className="font-display text-4xl italic text-[hsl(var(--marigold))]">{i + 1}</span>
                <div>
                  <h3 className="flex items-center gap-2 text-xl"><s.icon className="h-5 w-5 opacity-70" /> {s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed opacity-75">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container mx-auto grid items-center gap-14 px-4 py-24 lg:grid-cols-2">
        <div className="relative aspect-[5/4] overflow-hidden rounded-[2rem] rounded-br-[6rem] border">
          <Image src="/care-notes.jpg" alt="A visit notebook, stethoscope and marigolds on a table" fill className="object-cover" sizes="(min-width:1024px) 50vw, 100vw" />
        </div>
        <div>
          <p className="eyebrow">For families</p>
          <h2 className="mt-3 text-4xl font-medium md:text-5xl">Everyone reads the <em className="text-[hsl(var(--clay))]">same</em> page.</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            {features.map((f) => (
              <div key={f.title}>
                <f.icon className="h-6 w-6 text-[hsl(var(--clay))]" />
                <h3 className="mt-3 text-lg font-medium">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4">
        <div className="grid gap-6 rounded-[2rem] border bg-accent p-8 md:grid-cols-2 md:p-14">
          <div>
            <p className="eyebrow">For nurses</p>
            <h2 className="mt-3 text-3xl font-medium md:text-4xl">Your schedule, notes and earnings in one place.</h2>
          </div>
          <div className="flex flex-col justify-between gap-6">
            <p className="text-accent-foreground/80">Accept visits, log vitals during care, write visit notes and see invoices for completed work. Registration asks for your nursing certification number.</p>
            <div className="flex flex-wrap gap-3">
              <Button asChild className="rounded-full"><Link href="/register">Register as a nurse</Link></Button>
              <Button variant="ghost" asChild className="rounded-full"><Link href="/contact">Ask a question</Link></Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pt-24 text-center">
        <h2 className="mx-auto max-w-3xl text-4xl font-medium md:text-6xl">Someone at home needs looking after?</h2>
        <p className="mx-auto mt-5 max-w-lg text-muted-foreground">Create an account, add the patient&apos;s details and choose a visit time.</p>
        <Button size="lg" asChild className="mt-8 rounded-full px-8"><Link href="/register">Start now</Link></Button>
      </section>
    </>
  );
}
