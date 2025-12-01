"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { ReactNode, useState, useEffect } from "react";
import CartLink from "@/components/admin/CartLink";
import { useAuthSync } from "@/hooks/useAuthSync";
import Breadcrumb from "@/components/admin/Breadcrumb";
import DashboardBreadcrumb from "@/components/admin/DashboardBreadcrumb";

// Helper to decode JWT token (client-side only, for route protection)
function decodeToken(token: string): { role?: string; isAdmin?: boolean } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch {
    return null;
  }
}

export default function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const hideHeader = pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Sync cart with authentication state
  useAuthSync();

  // Check if admin is logged in and redirect from customer pages
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setIsLoggedIn(!!token);

    // Only check on customer routes
    if (!hideHeader && token) {
      const payload = decodeToken(token);
      if (payload && (payload.isAdmin || payload.role === "admin")) {
        // Admin is logged in, redirect to dashboard
        router.push("/dashboard");
      }
    }
  }, [pathname, hideHeader, router]);

  const handleProfileClick = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.push("/login");
    } else {
      router.push("/profile");
    }
  };

  return (
    <>
      {!hideHeader && (
        <>
          <header className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
            <Link href="/" className="text-lg font-semibold">
              Crystal Bowl Studio
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/products" className="text-sm font-medium hover:underline">
                Products
              </Link>
              <Link href="/yoga-blog" className="text-sm font-medium hover:underline">
                Yoga Blog
              </Link>
              <CartLink />
              <button
                onClick={handleProfileClick}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-300 bg-white transition-colors hover:bg-zinc-100"
                title={isLoggedIn ? "View Profile" : "Login"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-5 w-5 text-zinc-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
              </button>
            </nav>
          </header>
          <div className="border-b border-zinc-200 bg-zinc-50 px-6 py-2">
            <Breadcrumb />
          </div>
        </>
      )}
      {hideHeader && (
        <div className="border-b border-zinc-800 bg-zinc-950 px-4 py-2 sm:px-8">
          <DashboardBreadcrumb />
        </div>
      )}
      <main>{children}</main>
    </>
  );
}

