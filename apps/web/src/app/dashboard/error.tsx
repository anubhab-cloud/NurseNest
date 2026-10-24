"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function RouteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div className="grid min-h-[50dvh] place-items-center px-4 text-center">
      <div>
        <p className="eyebrow">Something went wrong</p>
        <h1 className="mt-3 text-3xl font-medium">We couldn&apos;t load this page.</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message || "An unexpected error occurred."}</p>
        <div className="mt-6 flex justify-center gap-3">
          <Button onClick={reset} className="rounded-full">Try again</Button>
          <Button variant="outline" asChild className="rounded-full"><Link href="/dashboard">Go back</Link></Button>
        </div>
      </div>
    </div>
  );
}
