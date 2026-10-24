import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageIntro } from "@/components/common/page-intro";

const principles = [
  ["Say what happens", "Booking status, the nurse assigned and what was recorded are visible to the family, not kept on a clipboard."],
  ["Write it down", "Each visit can end with notes and vitals, so the next nurse and the family start from the same information."],
  ["Keep roles clear", "Patients, nurses and administrators have separate dashboards with only the actions their role needs."],
  ["Don't overpromise", "We are a booking and records platform, not an emergency service. Urgent situations need 112 or a hospital."],
];

export default function AboutPage() {
  return (
    <>
      <PageIntro eyebrow="About" title={<>Home nursing, <em className="text-[hsl(var(--clay))]">arranged in the open.</em></>}>
        NurseNest helps families across India arrange professional nursing visits at home &mdash; elder care, clinical procedures and recovery support &mdash; with scheduling, payments, vitals and visit notes handled in one place.
      </PageIntro>
      <section className="container mx-auto px-4 py-20">
        <div className="grid gap-px overflow-hidden rounded-[2rem] border bg-border md:grid-cols-2">
          {principles.map(([t, b], i) => (
            <div key={t} className="bg-card p-8 md:p-10">
              <span className="font-display text-sm italic text-[hsl(var(--clay))]">0{i + 1}</span>
              <h2 className="mt-3 text-2xl font-medium">{t}</h2>
              <p className="mt-2 text-muted-foreground">{b}</p>
            </div>
          ))}
        </div>
        <div className="mt-16 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <p className="max-w-xl font-display text-2xl">So nurses can spend their time on the patient, not the paperwork.</p>
          <Button asChild className="rounded-full"><Link href="/contact">Get in touch</Link></Button>
        </div>
      </section>
    </>
  );
}
