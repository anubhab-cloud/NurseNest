"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="bg-gradient-to-br from-emerald-50 to-white py-20">
      <div className="container mx-auto px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold tracking-tight md:text-6xl"
        >
          Professional nursing care, <span className="text-primary">at your doorstep</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
        >
          NurseNest connects families with certified nurses for elder care, clinical visits, and
          post-surgery recovery — with live vitals tracking and transparent pricing.
        </motion.p>
        <div className="mt-8 flex justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/register">Book a Nurse</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/services">View Services</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
