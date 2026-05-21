import { DashboardShell } from "@/components/layout/dashboard-shell";

const links = [
  { href: "/dashboard/patient", label: "Overview" },
  { href: "/dashboard/patient/vitals", label: "Vitals" },
  { href: "/dashboard/patient/bookings", label: "Bookings" },
  { href: "/dashboard/patient/book-now", label: "Book Now" },
  { href: "/dashboard/patient/messages", label: "Messages" },
  { href: "/dashboard/patient/profile", label: "Profile" },
];

export default function PatientDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell title="Patient Dashboard" links={links}>
      {children}
    </DashboardShell>
  );
}
