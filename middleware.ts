import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const DASHBOARD_PREFIX = "/dashboard";
const AUTH_ONLY_PATHS = new Set(["/login", "/register"]);

function getDashboardPath(role: string | undefined): string {
  if (role === "2") return "/dashboard-admin";
  if (role === "1") return "/dashboard-business";
  return "/dashboard-user";
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;

  if (pathname.startsWith(DASHBOARD_PREFIX) && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (AUTH_ONLY_PATHS.has(pathname) && token) {
    return NextResponse.redirect(new URL(getDashboardPath(role), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard-user/:path*", "/dashboard-business/:path*", "/dashboard-admin/:path*", "/login", "/register"],
};
