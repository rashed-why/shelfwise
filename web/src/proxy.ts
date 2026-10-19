import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { homePathForRole } from "@/lib/post-login-redirect";

function dashboardUrlForRole(role: string | undefined, origin: string): URL {
  return new URL(homePathForRole(role), origin);
}

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const user = req.auth?.user;

  if (pathname === "/login" || pathname === "/register") {
    if (user) {
      return NextResponse.redirect(dashboardUrlForRole(user.role, req.nextUrl.origin));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (!user) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set(
        "callbackUrl",
        `${req.nextUrl.pathname}${req.nextUrl.search}`,
      );
      return NextResponse.redirect(loginUrl);
    }

    if (user.role !== "ADMIN") {
      return NextResponse.redirect(
        dashboardUrlForRole(user.role, req.nextUrl.origin),
      );
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/login", "/register", "/admin", "/admin/:path*"],
};
