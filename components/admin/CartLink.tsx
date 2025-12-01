"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/stores/useCart";

export default function CartLink() {
  const [mounted, setMounted] = useState(false);
  const total = useCart((s) => s.totalQuantity());

  // Fix hydration error - only render count after client-side mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check if user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setIsLoggedIn(!!token);
  }, []);

  // Only show cart count if user is logged in and component is mounted
  const displayCount = mounted && isLoggedIn ? total : 0;

  return (
    <Link href="/cart" className="relative inline-flex items-center gap-2">
      <span className="font-medium">Cart</span>
      {displayCount > 0 && (
        <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-black px-2 text-xs font-semibold text-white">
          {displayCount}
        </span>
      )}
    </Link>
  );
}

