"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function DashboardBreadcrumb() {
  const pathname = usePathname();

  if (!pathname) {
    return null;
  }

  // Split pathname into segments
  const segments = pathname.split("/").filter(Boolean);

  // Determine root link based on path
  const isAdminRoute = pathname.startsWith("/admin");
  const isDashboardRoute = pathname.startsWith("/dashboard");
  
  // Don't show breadcrumb on root dashboard page
  if (isDashboardRoute && pathname === "/dashboard") {
    return null;
  }

  // Create breadcrumb items
  const breadcrumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const isLast = index === segments.length - 1;
    
    // Format segment name (capitalize and replace hyphens)
    const label = segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return {
      href,
      label,
      isLast,
    };
  });

  // Get root link and label
  const rootHref = isDashboardRoute ? "/dashboard" : "/";
  const rootLabel = isDashboardRoute ? "Dashboard" : "Home";

  return (
    <nav className="flex items-center gap-2 text-sm text-zinc-400" aria-label="Breadcrumb">
      <Link
        href={rootHref}
        className="hover:text-white transition-colors"
      >
        {rootLabel}
      </Link>
      {breadcrumbs.map((crumb, index) => {
        // Skip the first segment if it matches the root
        const firstSegment = segments[0]?.toLowerCase();
        if (index === 0 && (
          (isDashboardRoute && firstSegment === "dashboard") ||
          (isAdminRoute && firstSegment === "admin")
        )) {
          return null;
        }
        return (
          <span key={crumb.href} className="flex items-center gap-2">
            <span className="text-zinc-600">/</span>
            {crumb.isLast ? (
              <span className="text-white font-medium">{crumb.label}</span>
            ) : (
              <Link
                href={crumb.href}
                className="hover:text-white transition-colors"
              >
                {crumb.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}

