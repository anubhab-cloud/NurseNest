import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { Role } from "@nursenest/types";

const roleRoutes: Record<string, Role> = {
  "/dashboard/patient": "PATIENT",
  "/dashboard/nurse": "NURSE",
  "/dashboard/admin": "ADMIN",
};

export default auth((req) => {
  const path = req.nextUrl.pathname;
  const session = req.auth;

  if (path.startsWith("/dashboard")) {
    if (!session?.user) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    for (const [prefix, role] of Object.entries(roleRoutes)) {
      if (path.startsWith(prefix) && session.user.role !== role) {
        const redirectMap: Record<Role, string> = {
          PATIENT: "/dashboard/patient",
          NURSE: "/dashboard/nurse",
          ADMIN: "/dashboard/admin",
        };
        return NextResponse.redirect(new URL(redirectMap[session.user.role], req.url));
      }
    }
  }

  if ((path === "/login" || path === "/register") && session?.user) {
    const redirectMap: Record<Role, string> = {
      PATIENT: "/dashboard/patient",
      NURSE: "/dashboard/nurse",
      ADMIN: "/dashboard/admin",
    };
    return NextResponse.redirect(new URL(redirectMap[session.user.role], req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
