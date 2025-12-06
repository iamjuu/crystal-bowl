"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function AdminLogoutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      try {
        // Call admin-specific logout endpoint
        await fetch("/api/admin/logout", { 
          method: "POST", 
          credentials: "include" 
        });
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        // Clear all admin auth data from localStorage
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminRole");
        localStorage.removeItem("user");
        
        // Redirect to admin login page
        router.push("/admin/login");
        
        // Force a hard refresh to clear any cached state
        setTimeout(() => {
          router.refresh();
        }, 100);
      }
    });
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className="rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white disabled:opacity-60 transition-colors"
    >
      {isPending ? "Logging out..." : "Logout"}
    </button>
  );
}



