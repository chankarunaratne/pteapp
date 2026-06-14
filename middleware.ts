import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("pb_session");
  const { pathname } = request.nextUrl;

  const isProtectedRoute =
    pathname.startsWith("/dashboard");

  // If the user is logged in and tries to access the landing page (/), redirect to /practice
  if (session && pathname === "/") {
    return NextResponse.redirect(new URL("/practice", request.url));
  }

  // If the user is not logged in and tries to access a protected route, redirect to the landing page (/)
  if (!session && isProtectedRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.) containing a dot
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
