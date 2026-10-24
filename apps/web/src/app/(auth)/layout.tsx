import Image from "next/image";
import { Logo } from "@/components/layout/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-[100dvh] lg:grid-cols-[1fr_1.05fr]">
      <aside className="relative hidden overflow-hidden bg-primary text-primary-foreground lg:block">
        <Image src="/care-notes.jpg" alt="" fill className="object-cover opacity-30 mix-blend-luminosity" sizes="50vw" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <div className="[&_span]:text-primary-foreground"><Logo /></div>
          <div>
            <p className="font-display text-5xl font-medium leading-[1.05]">Care that comes <em className="text-[hsl(var(--marigold))]">home.</em></p>
            <p className="mt-5 max-w-sm opacity-75">One account for bookings, visit notes and vitals &mdash; for families and nurses alike.</p>
          </div>
        </div>
      </aside>
      <main className="kolam-bg relative flex flex-col items-center justify-center py-10">
        <div className="mb-8 lg:hidden"><Logo /></div>
        <div className="rise w-full">{children}</div>
      </main>
    </div>
  );
}
