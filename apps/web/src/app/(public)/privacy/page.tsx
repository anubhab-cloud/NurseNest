import Link from "next/link";
import { PageIntro } from "@/components/common/page-intro";

export const metadata = { title: "Privacy notice — NurseNest" };

const sections: [string, string[]][] = [
  [
    "Who operates this service",
    [
      "[Operator to complete: legal business name, registered address and a privacy contact.]"
    ]
  ],
  [
    "Information we collect",
    [
      "Account details: email, phone (optional) and password (stored by the platform for sign-in).",
      "Patient profile and care records: name, date of birth, blood group, allergies, emergency contact, address, vitals recorded by nurses, and visit notes.",
      "Nurse profiles: name, certification number, specialisations and experience, which administrators review before verification.",
      "Bookings, invoices and reviews you submit.",
      "Messages sent within a specific booking's conversation.",
      "Messages sent through the public contact form (name, email, message)."
    ]
  ],
  [
    "Location",
    [
      "If a nurse grants browser location permission, their position is sent periodically while the nurse dashboard is open so it can be shown for active visits. Permission is optional and can be withdrawn in browser settings. A patient's address coordinates are stored only if provided."
    ]
  ],
  [
    "Who can see it",
    [
      "Patients see their own records. Nurses assigned to a patient's booking can see that patient's profile, vitals and visit notes. Administrators can access bookings, accounts and records to operate the service. Booking messages are visible to the participants in that booking."
    ]
  ],
  [
    "Payments",
    [
      "When online payment is configured, card and UPI details are entered with and processed by Razorpay. NurseNest stores the order reference and invoice status, not card numbers."
    ]
  ],
  [
    "Retention and your choices",
    [
      "[Operator to complete: how long each category of data is kept, how users can request access, correction or deletion, and how to make a complaint.]"
    ]
  ]
];

export default function Page() {
  return (
    <>
      <PageIntro eyebrow="Privacy" title="Privacy notice">A plain description of how this platform works today.</PageIntro>
      <div className="container mx-auto max-w-3xl px-4 py-14">
        <div role="note" className="rounded-2xl border border-[hsl(var(--marigold)/0.6)] bg-accent p-5 text-sm" data-testid="note-operator-review">
          <p className="font-semibold">Operator review required before launch</p>
          <p className="mt-1 text-accent-foreground/80">This is a template describing the software&apos;s actual features. Before live use, the operator must add their legal business name, contact details, data retention periods and any terms required by applicable law, and have it reviewed by a qualified professional.</p>
        </div>
        {sections.map(([h, ps]) => (
          <section key={h} className="mt-10">
            <h2 className="text-2xl font-medium">{h}</h2>
            {ps.map((p) => <p key={p} className="mt-3 leading-relaxed text-muted-foreground">{p}</p>)}
          </section>
        ))}
        <p className="mt-12 text-sm text-muted-foreground">Questions: use the <Link href="/contact" className="underline">contact form</Link>.</p>
      </div>
    </>
  );
}
