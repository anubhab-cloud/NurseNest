import Link from "next/link";
import { UsersRound } from "lucide-react";
import { apiFetchServer } from "@/lib/api";
import type { NurseProfileDto } from "@nursenest/types";
import { PageIntro } from "@/components/common/page-intro";
import { EmptyState } from "@/components/common/empty-state";
import { Stars, initials } from "@/components/nurses/stars";

export const revalidate = 60;

export default async function NursesPage() {
  let nurses: NurseProfileDto[] = [];
  try {
    nurses = await apiFetchServer<NurseProfileDto[]>("/api/v1/nurses/available");
  } catch {
    nurses = [];
  }

  return (
    <>
      <PageIntro eyebrow="Nurses" title="The people who may visit you.">
        Profiles list specialisations, experience and ratings left by patients after completed visits.
      </PageIntro>
      <div className="container mx-auto grid gap-5 px-4 py-14 sm:grid-cols-2 lg:grid-cols-3">
        {nurses.length === 0 && (
          <EmptyState icon={UsersRound} title="No nurses available right now" body="Availability changes through the day. Check back later or book a visit and one will be assigned." />
        )}
        {nurses.map((n) => (
          <Link key={n.userId} href={`/nurses/${n.userId}`} data-testid={`card-nurse-${n.userId}`}
            className="group rounded-3xl border bg-card p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-28px_hsl(var(--primary)/0.45)]">
            <div className="flex items-center gap-4">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary font-display text-lg text-primary-foreground">{initials(n.fullName)}</span>
              <div>
                <h3 className="text-xl font-medium">{n.fullName}</h3>
                <p className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className={n.isAvailable ? "h-2 w-2 rounded-full bg-[hsl(var(--sage))]" : "h-2 w-2 rounded-full bg-muted-foreground/40"} />
                  {n.isAvailable ? "Available" : "Busy"}
                </p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-1.5">
              {(n.specializations.length ? n.specializations : ["General care"]).map((s) => (
                <span key={s} className="rounded-full bg-accent px-2.5 py-1 text-xs text-accent-foreground">{s}</span>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-dashed pt-4 text-sm">
              <span className="flex items-center gap-2"><Stars value={n.rating} /> {n.rating.toFixed(1)}</span>
              <span className="text-muted-foreground">{n.yearsExp} yrs &middot; {n.totalVisits} visits</span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
