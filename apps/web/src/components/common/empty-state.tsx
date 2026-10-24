import type { LucideIcon } from "lucide-react";

export function EmptyState({ icon: Icon, title, body, children }: { icon: LucideIcon; title: string; body: string; children?: React.ReactNode }) {
  return (
    <div className="col-span-full flex flex-col items-center rounded-3xl border border-dashed bg-card/60 px-6 py-16 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-accent text-accent-foreground">
        <Icon className="h-6 w-6" />
      </span>
      <h3 className="mt-5 text-xl">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{body}</p>
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}
