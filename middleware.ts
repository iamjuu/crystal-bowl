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
const adminRoutes = ["/admin/dashboard"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get both user and admin tokens
  const adminTokenCookie = request.cookies.get("adminToken");
  const adminToken = adminTokenCookie?.value;

  // Check if accessing a customer route
  const isCustomerRoute = customerRoutes.some((route) => pathname.startsWith(route)) || pathname === "/";

  // Allow access to admin login and signup pages (public pages)
  if (pathname.startsWith("/admin/login") || pathname.startsWith("/admin/signup")) {
    // If admin is already logged in, redirect to dashboard
    if (adminToken) {
      const adminPayload = decodeToken(adminToken);
      if (adminPayload?.isAdmin || adminPayload?.role === "admin") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
    }
    return NextResponse.next();
  }

  // Check if accessing an admin route (protected routes only)
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  // Handle admin routes
  if (isAdminRoute) {
    if (!adminToken) {
      // No admin token, redirect to admin login
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    
    // Verify admin token
    const adminPayload = decodeToken(adminToken);
    if (!adminPayload || (!adminPayload.isAdmin && adminPayload.role !== "admin")) {
      // Invalid or non-admin token, clear it and redirect
      const response = NextResponse.redirect(new URL("/admin/login", request.url));
      response.cookies.delete("adminToken");
      return response;
    }
    
    // Valid admin token, allow access
    return NextResponse.next();
  }

  // Handle customer routes
  if (isCustomerRoute) {
    // If admin is logged in, redirect to admin dashboard
    if (adminToken) {
      const adminPayload = decodeToken(adminToken);
      if (adminPayload?.isAdmin || adminPayload?.role === "admin") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
    }
    
    // Allow access to customer routes (with or without user token)
    return NextResponse.next();
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


