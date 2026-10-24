"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, CalendarCheck, HeartPulse, NotebookPen } from "lucide-react";
import { Button } from "@/components/ui/button";

const ease = [0.2, 0.7, 0.2, 1] as const;

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="kolam-bg absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="container relative mx-auto grid items-center gap-12 px-4 pb-20 pt-14 lg:grid-cols-[1.1fr_0.9fr] lg:pt-20">
        <div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="eyebrow">
            Home nursing &middot; India
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease }}
            className="mt-5 text-5xl font-medium leading-[0.98] md:text-7xl"
          >
            Care that comes <em className="text-[hsl(var(--clay))]">home</em>, the way family would want it.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
          >
            Book a nurse for elder care, dressings, injections or recovery support. See who is coming,
            when, and what they recorded &mdash; all in one calm place.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8, ease }}
            className="mt-9 flex flex-wrap gap-3"
          >
            <Button size="lg" asChild className="group rounded-full px-7">
              <Link href="/register" data-testid="link-hero-register">
                Arrange a visit <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="rounded-full px-7">
              <Link href="/services" data-testid="link-hero-services">Browse services</Link>
            </Button>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 1, ease }}
          className="relative"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] rounded-tl-[7rem] border bg-muted">
            <Image src="/hero-care.jpg" alt="A nurse checking an elderly woman's blood pressure at home" fill priority className="object-cover" sizes="(min-width:1024px) 40vw, 100vw" />
          </div>
          <div className="absolute -bottom-6 -left-4 w-64 rounded-2xl border bg-card p-4 shadow-xl md:-left-10">
            <p className="eyebrow">What families see</p>
            <ul className="mt-3 space-y-2.5 text-sm">
              <li className="flex items-center gap-2.5"><CalendarCheck className="h-4 w-4 text-[hsl(var(--clay))]" /> Visit time and status</li>
              <li className="flex items-center gap-2.5"><HeartPulse className="h-4 w-4 text-[hsl(var(--clay))]" /> Vitals the nurse logged</li>
              <li className="flex items-center gap-2.5"><NotebookPen className="h-4 w-4 text-[hsl(var(--clay))]" /> Notes after each visit</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
