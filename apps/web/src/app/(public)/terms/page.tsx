import Link from "next/link";
import { PageIntro } from "@/components/common/page-intro";

export const metadata = { title: "Terms of use — NurseNest" };

const sections: [string, string[]][] = [
  [
    "Operator",
    [
      "[Operator to complete: legal business name, contact details and governing jurisdiction.]"
    ]
  ],
  [
    "What the platform does",
    [
      "NurseNest lets patients and families book home nursing visits, lets nurses manage assigned visits and record vitals and notes, and lets administrators manage bookings, accounts and nurse verification."
    ]
  ],
  [
    "Not an emergency service",
    [
      "The platform does not provide emergency response. In an emergency, call 112 or go to the nearest hospital. Visit notes and vitals are records, not a diagnosis."
    ]
  ],
  [
    "Bookings and cancellation",
    [
      "Bookings start as pending and move to confirmed, in progress and completed. Patients can cancel pending or confirmed visits in the app up to 2 hours before the scheduled time.",
      "[Operator to complete: fees, refund handling and late-cancellation terms. No refund is guaranteed by the software.]"
    ]
  ],
  [
    "Payments",
    [
      "When configured, payments are processed by Razorpay. A booking is not marked paid unless the payment is verified."
    ]
  ],
  [
    "Accounts and conduct",
    [
      "Keep your sign-in details private and provide accurate information. Administrators may deactivate accounts.",
      "[Operator to complete: liability, dispute and any other legally required terms.]"
    ]
  ]
];

export default function Page() {
  return (
    <>
      <PageIntro eyebrow="Terms" title="Terms of use">A plain description of how this platform works today.</PageIntro>
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
