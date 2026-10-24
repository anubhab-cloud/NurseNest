import Link from "next/link";

export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <rect width="40" height="40" rx="12" fill="hsl(var(--primary))" />
      <path d="M10 26c4-9 16-9 20 0" stroke="hsl(var(--marigold))" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <path d="M20 10v10M15 15h10" stroke="hsl(var(--primary-foreground))" strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="20" cy="29.5" r="2" fill="hsl(var(--marigold))" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5" data-testid="link-home-logo">
      <LogoMark />
      <span className="font-display text-xl font-semibold tracking-tight">
        Nurse<span className="italic text-[hsl(var(--clay))]">Nest</span>
      </span>
    </Link>
  );
}
