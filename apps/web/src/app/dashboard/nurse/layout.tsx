import { DashboardShell } from "@/components/layout/dashboard-shell";

const links = [
  { href: "/dashboard/nurse", label: "Overview" },
  { href: "/dashboard/nurse/schedule", label: "Schedule" },
  { href: "/dashboard/nurse/vitals/log", label: "Log Vitals" },
  { href: "/dashboard/nurse/earnings", label: "Earnings" },
  { href: "/dashboard/nurse/profile", label: "Profile" },
];

export default function NurseDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell title="Nurse Dashboard" links={links}>
      {children}
    </DashboardShell>
  );
}
