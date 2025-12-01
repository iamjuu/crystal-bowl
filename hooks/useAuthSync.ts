"use client";

import { useEffect } from "react";
import { useCart } from "@/stores/useCart";

// Hook to sync cart with authentication state
export function useAuthSync() {
  const clearCart = useCart((s) => s.clearCart);

  useEffect(() => {
    // Check authentication on mount
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      clearCart();
    }

    // Listen for token removal (logout)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token" && !e.newValue) {
        clearCart();
      }
    };

    // Listen for custom logout event
    const handleLogout = () => {
      clearCart();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("logout", handleLogout);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("logout", handleLogout);
    };
  }, [clearCart]);
}

