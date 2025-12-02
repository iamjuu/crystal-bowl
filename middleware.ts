import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Decode JWT without verification (for middleware route protection only)
// Full verification happens on server-side API routes
function decodeToken(token: string): { userId?: string; role?: string; isAdmin?: boolean } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch {
    return null;
  }
}

// Routes that should be protected from admin access
const customerRoutes = [
  "/products",
  "/cart",
  "/checkout",
  "/sessions",
  "/yoga-blog",
  "/profile",
  "/login",
  "/register",
  "/verify-email",
];

// Admin routes that require admin authentication
const adminRoutes = ["/dashboard", "/admin"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const tokenCookie = request.cookies.get("token");
  const token = tokenCookie?.value;

  // Check if accessing a customer route
  const isCustomerRoute = customerRoutes.some((route) => pathname.startsWith(route)) || pathname === "/";

  // Check if accessing an admin route
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  // If no token, allow access to customer routes and admin login/signup
  if (!token) {
    // Allow access to admin login and signup pages
    if (pathname.startsWith("/admin/login") || pathname.startsWith("/admin/signup")) {
      return NextResponse.next();
    }
    // Allow access to customer routes
    if (isCustomerRoute) {
      return NextResponse.next();
    }
    // Redirect to admin login if trying to access admin routes
    if (isAdminRoute) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.next();
  }

  // If token exists, decode it to check role
  const payload = decodeToken(token);
  if (payload) {
    const isAdmin = payload.isAdmin || payload.role === "admin";

    // If admin is logged in, prevent access to customer routes
    if (isAdmin && isCustomerRoute) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    // If regular user is logged in, prevent access to admin routes (except admin login/signup)
    if (!isAdmin && isAdminRoute && !pathname.startsWith("/admin/login") && !pathname.startsWith("/admin/signup")) {
      return NextResponse.redirect(new URL("/products", request.url));
    }

    // Redirect to dashboard if admin is logged in and tries to access login/signup pages
    if (isAdmin && (pathname.startsWith("/admin/login") || pathname.startsWith("/admin/signup"))) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  } else {
    // Invalid token format - clear it and allow access
    const response = NextResponse.next();
    response.cookies.delete("token");
    return response;
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
     * - public files (public folder)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};


