import Link from "next/link";
import { ArrowLeft, MessageSquareQuote, UserX } from "lucide-react";
import { apiFetchServer } from "@/lib/api";
import type { NurseProfileDto, ReviewDto } from "@nursenest/types";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/empty-state";
import { Stars, initials } from "@/components/nurses/stars";
import { formatDate } from "@/lib/utils";

export default async function NurseProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [nurse, reviews] = await Promise.all([
    apiFetchServer<NurseProfileDto>(`/api/v1/nurses/${id}`).catch(() => null),
    apiFetchServer<ReviewDto[]>(`/api/v1/nurses/${id}/reviews`).catch(() => [] as ReviewDto[]),
  ]);

  if (!nurse) {
    return (
      <div className="container mx-auto px-4 py-20">
        <EmptyState icon={UserX} title="Nurse not found" body="This profile may have been removed or the link is incorrect.">
          <Button asChild className="rounded-full"><Link href="/nurses">Back to nurses</Link></Button>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/nurses" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> All nurses
      </Link>
      <div className="mt-8 grid gap-10 lg:grid-cols-[380px_1fr]">
        <aside className="h-fit rounded-[2rem] border bg-card p-8 lg:sticky lg:top-24">
          <span className="grid h-24 w-24 place-items-center rounded-[1.75rem] bg-primary font-display text-3xl text-primary-foreground">{initials(nurse.fullName)}</span>
          <h1 className="mt-6 text-4xl font-medium" data-testid="text-nurse-name">{nurse.fullName}</h1>
          <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <span className={nurse.isAvailable ? "h-2 w-2 rounded-full bg-[hsl(var(--sage))]" : "h-2 w-2 rounded-full bg-muted-foreground/40"} />
            {nurse.isAvailable ? "Available for visits" : "Currently unavailable"}
          </p>
          <dl className="mt-8 grid grid-cols-3 gap-px overflow-hidden rounded-2xl bg-border text-center">
            {[["Rating", nurse.rating.toFixed(1)], ["Years", String(nurse.yearsExp)], ["Visits", String(nurse.totalVisits)]].map(([k, v]) => (
              <div key={k} className="bg-card p-3"><dt className="eyebrow">{k}</dt><dd className="mt-1 font-display text-2xl">{v}</dd></div>
            ))}
          </dl>
          <p className="mt-6 text-xs text-muted-foreground">Certification no. {nurse.certificationNumber}</p>
          <Button asChild className="mt-6 w-full rounded-full"><Link href={`/dashboard/patient/book-now?nurseId=${nurse.userId}`}>Book a visit</Link></Button>
        </aside>
        <div>
          <p className="eyebrow">Specialisations</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {(nurse.specializations.length ? nurse.specializations : ["General care"]).map((s) => (
              <span key={s} className="rounded-full border bg-accent px-4 py-1.5 text-sm text-accent-foreground">{s}</span>
            ))}
          </div>
          <h2 className="mt-14 text-3xl font-medium">Reviews from patients <span className="text-muted-foreground">({reviews.length})</span></h2>
          <div className="mt-6 space-y-4">
            {reviews.length === 0 ? (
              <EmptyState icon={MessageSquareQuote} title="No reviews yet" body="Reviews appear here after patients complete visits and choose to leave one." />
            ) : (
              reviews.map((r) => (
                <article key={r.id} className="rounded-2xl border bg-card p-6">
                  <div className="flex items-center justify-between"><Stars value={r.rating} /><span className="text-xs text-muted-foreground">{formatDate(r.createdAt)}</span></div>
                  {r.comment && <p className="mt-3 font-display text-lg italic leading-snug">&ldquo;{r.comment}&rdquo;</p>}
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
