import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}
