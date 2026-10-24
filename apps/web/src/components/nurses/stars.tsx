import { Star } from "lucide-react";

export function Stars({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${value.toFixed(1)} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={i <= Math.round(value) ? "h-3.5 w-3.5 fill-[hsl(var(--marigold))] text-[hsl(var(--marigold))]" : "h-3.5 w-3.5 text-border"} />
      ))}
    </span>
  );
}

export function initials(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");
}
