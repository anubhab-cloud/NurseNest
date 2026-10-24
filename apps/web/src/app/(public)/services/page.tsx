import { ClipboardList } from "lucide-react";
import { apiFetchServer } from "@/lib/api";
import type { ServiceDto } from "@nursenest/types";
import { PageIntro } from "@/components/common/page-intro";
import { ServiceCard } from "@/components/services/service-card";
import { EmptyState } from "@/components/common/empty-state";

export const revalidate = 60;

export default async function ServicesPage() {
  let services: ServiceDto[] = [];
  try {
    services = await apiFetchServer<ServiceDto[]>("/api/v1/services");
  } catch {
    services = [];
  }
  const categories = Array.from(new Set(services.map((s) => s.category)));

  return (
    <>
      <PageIntro eyebrow="Services & pricing" title={<>Every visit, <em className="text-[hsl(var(--clay))]">priced up front.</em></>}>
        Prices are per visit and include the nurse&apos;s time at home. Choose a service when you book from your dashboard.
      </PageIntro>
      <div className="container mx-auto px-4 py-14">
        {services.length === 0 ? (
          <EmptyState icon={ClipboardList} title="No services to show yet" body="The service list could not be loaded. Please try again shortly." />
        ) : (
          categories.map((cat) => (
            <section key={cat} className="mb-14">
              <div className="mb-6 flex items-baseline gap-4">
                <h2 className="text-3xl font-medium">{cat}</h2>
                <span className="h-px flex-1 bg-border" />
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {services.filter((s) => s.category === cat).map((s, i) => <ServiceCard key={s.id} service={s} index={i} />)}
              </div>
            </section>
          ))
        )}
      </div>
    </>
  );
}
