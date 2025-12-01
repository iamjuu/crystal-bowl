"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function AdminLogoutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      try {
        await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
      } catch {
        // ignore network errors, we'll still clear local state
      } finally {
        // Clear all auth data
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // Redirect to home page (admin can now access any page)
        router.push("/");
        router.refresh();
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

