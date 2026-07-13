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

  // Handle API proxy requests: propagate auth token from NextAuth session to Fastify Authorization header
  if (path.startsWith("/api/v1")) {
    const isPublicRoute =
      path.startsWith("/api/v1/auth/login") ||
      path.startsWith("/api/v1/auth/register") ||
      path.startsWith("/api/v1/auth/forgot-password") ||
      path.startsWith("/api/v1/auth/reset-password") ||
      path === "/api/v1/services" ||
      path.startsWith("/api/v1/nurses/available") ||
      /^\/api\/v1\/nurses\/[^/]+$/.test(path) ||
      /^\/api\/v1\/nurses\/[^/]+\/reviews$/.test(path);

    if (isPublicRoute) {
      return NextResponse.next();
    }

    if (session?.error === "RefreshAccessTokenError" || !session?.accessToken) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("Authorization", `Bearer ${session.accessToken}`);
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Handle token refresh error on dashboard routes
  if (session?.error === "RefreshAccessTokenError") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

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
  matcher: ["/dashboard/:path*", "/login", "/register", "/api/v1/:path*"],
};
