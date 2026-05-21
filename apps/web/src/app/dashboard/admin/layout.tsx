import { DashboardShell } from "@/components/layout/dashboard-shell";

const links = [
  { href: "/dashboard/admin", label: "Overview" },
  { href: "/dashboard/admin/users", label: "Users" },
  { href: "/dashboard/admin/bookings", label: "Bookings" },
  { href: "/dashboard/admin/analytics", label: "Analytics" },
];

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell title="Admin Dashboard" links={links}>
      {children}
    </DashboardShell>
  );
}
