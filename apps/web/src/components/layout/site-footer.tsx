export function SiteFooter() {
  return (
    <footer className="border-t py-8">
      <MotionDiv className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} NurseNest. Professional home nursing care.</p>
      </MotionDiv>
    </footer>
  );
}

function MotionDiv({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={className}>{children}</div>;
}
