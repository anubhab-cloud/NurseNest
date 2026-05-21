export default function AboutPage() {
  return (
    <MotionDiv className="container mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-6 text-4xl font-bold">About NurseNest</h1>
      <p className="mb-4 text-lg text-muted-foreground">
        NurseNest was founded to make professional home nursing accessible across India. We
        connect families with certified nurses for elder care, clinical procedures, and recovery
        support — with transparent pricing and real-time health monitoring.
      </p>
      <p className="text-muted-foreground">
        Our platform handles scheduling, payments, vitals tracking, and visit documentation so
        nurses can focus on what matters most: patient care.
      </p>
    </MotionDiv>
  );
}

function MotionDiv({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={className}>{children}</div>;
}
