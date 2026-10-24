import Link from "next/link";
import { LogoMark } from "./logo";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-[hsl(232_38%_14%)] text-[hsl(38_35%_88%)]">
      <div className="container mx-auto grid gap-10 px-4 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <LogoMark />
            <span className="font-display text-xl">NurseNest</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-[hsl(38_20%_70%)]">
            Home nursing visits, arranged with care. NurseNest is not an emergency service — in an
            emergency, call 112 or go to the nearest hospital.
          </p>
        </div>
        <div className="space-y-2 text-sm">
          <p className="eyebrow !text-[hsl(34_92%_60%)]">Explore</p>
          <Link className="block hover:underline" href="/services">Services</Link>
          <Link className="block hover:underline" href="/nurses">Nurses</Link>
          <Link className="block hover:underline" href="/about">About</Link>
        </div>
        <div className="space-y-2 text-sm">
          <p className="eyebrow !text-[hsl(34_92%_60%)]">Account</p>
          <Link className="block hover:underline" href="/login">Sign in</Link>
          <Link className="block hover:underline" href="/register">Create an account</Link>
          <Link className="block hover:underline" href="/contact">Contact us</Link>
          <Link className="block hover:underline" href="/privacy">Privacy</Link>
          <Link className="block hover:underline" href="/terms">Terms</Link>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-[hsl(38_20%_62%)]">
        &copy; {new Date().getFullYear()} NurseNest. Nursing care at home, across India.
      </div>
    </footer>
  );
}
