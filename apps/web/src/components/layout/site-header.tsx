import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold text-primary">
          NurseNest
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/services" className="text-sm hover:text-primary">
            Services
          </Link>
          <Link href="/nurses" className="text-sm hover:text-primary">
            Nurses
          </Link>
          <Link href="/about" className="text-sm hover:text-primary">
            About
          </Link>
          <Link href="/contact" className="text-sm hover:text-primary">
            Contact
          </Link>
        </nav>
        <MotionDiv className="flex gap-2">
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Get Started</Link>
          </Button>
        </MotionDiv>
      </div>
    </header>
  );
}

function MotionDiv({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={className}>{children}</div>;
}
