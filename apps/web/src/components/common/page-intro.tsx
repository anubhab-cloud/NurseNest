export function PageIntro({ eyebrow, title, children }: { eyebrow: string; title: React.ReactNode; children?: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden border-b">
      <div className="kolam-bg absolute inset-0 opacity-50 [mask-image:linear-gradient(to_right,transparent,black)]" />
      <div className="container relative mx-auto px-4 py-16 md:py-20">
        <p className="eyebrow rise">{eyebrow}</p>
        <h1 className="rise mt-4 max-w-3xl text-4xl font-medium leading-[1.02] md:text-6xl">{title}</h1>
        {children && <div className="rise mt-5 max-w-2xl text-lg text-muted-foreground">{children}</div>}
      </div>
    </section>
  );
}
