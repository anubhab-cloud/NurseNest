import Link from "next/link";
import { Clock, ArrowUpRight } from "lucide-react";
import type { ServiceDto } from "@nursenest/types";
import { formatCurrency } from "@/lib/utils";

export function ServiceCard({ service, index }: { service: ServiceDto; index: number }) {
  return (
    <Link
      href={`/dashboard/patient/book-now?serviceId=${service.id}`}
      data-testid={`card-service-${service.id}`}
      className="group relative flex flex-col justify-between rounded-3xl border bg-card p-7 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-28px_hsl(var(--primary)/0.45)]"
    >
      <div>
        <div className="flex items-start justify-between">
          <span className="font-display text-sm italic text-[hsl(var(--clay))]">{String(index + 1).padStart(2, "0")}</span>
          <span className="rounded-full bg-accent px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-accent-foreground">
            {service.category}
          </span>
        </div>
        <h3 className="mt-6 text-2xl font-medium">{service.name}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{service.description}</p>
      </div>
      <div className="mt-8 flex items-end justify-between border-t border-dashed pt-5">
        <div>
          <p className="font-display text-2xl">{formatCurrency(service.pricePerVisit)}</p>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" /> {service.durationMinutes} min per visit
          </p>
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground transition group-hover:rotate-45">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
