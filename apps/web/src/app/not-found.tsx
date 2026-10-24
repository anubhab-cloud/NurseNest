import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="kolam-bg grid min-h-[100dvh] place-items-center px-4 text-center">
      <div>
        <p className="font-display text-8xl italic text-[hsl(var(--clay))]">404</p>
        <h1 className="mt-4 text-3xl font-medium">This page isn&apos;t here.</h1>
        <p className="mt-2 text-muted-foreground">The link may be old, or the page may have moved.</p>
        <Button asChild className="mt-8 rounded-full"><Link href="/">Back home</Link></Button>
      </div>
    </div>
  );
}
