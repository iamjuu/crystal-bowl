import { ReactNode } from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAuthUserFromToken } from "@/lib/auth";
import DashboardNav from "@/components/admin/DashboardNav";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";
import DashboardBreadcrumb from "@/components/admin/DashboardBreadcrumb";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const navItems = [
  { label: "Overview", href: "/admin/dashboard" },
  { label: "Orders", href: "/admin/dashboard/orders" },
  { label: "Yoga Sessions", href: "/admin/dashboard/sessions" },
  { label: "Session Types", href: "/admin/dashboard/session-types" },
  { label: "Products", href: "/admin/dashboard/products" },
  { label: "Users", href: "/admin/dashboard/users" },
  { label: "Blogs", href: "/admin/dashboard/blogs" },
  { label: "Events", href: "/admin/dashboard/events" },
];

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token");
  const token = tokenCookie?.value;
  if (!token) {
    redirect("/admin/login");
  }

  const user = await getAuthUserFromToken(token);
  if (!user || user.role !== "admin") {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-zinc-900">
      <aside className="hidden w-64 border-r border-zinc-800 bg-zinc-950 px-6 py-8 lg:block">
        <div>
          <Link href="/admin/dashboard" className="text-lg font-semibold text-white">
            Crystal Bowl Studio
          </Link>
          <p className="mt-1 text-xs text-zinc-400">Admin Dashboard</p>
        </div>
        <DashboardNav items={navItems} />
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-4 py-4 sm:px-8">
          <div className="lg:hidden">
            <Link href="/admin/dashboard" className="text-lg font-semibold text-white">
              Crystal Bowl Studio
            </Link>
          </div>
          <AdminLogoutButton />
        </header>
        <div className="border-b border-zinc-800 bg-zinc-950 px-4 py-2 sm:px-8">
          <DashboardBreadcrumb />
        </div>
        <main>{children}</main>
      </div>
    </div>
  );
}

