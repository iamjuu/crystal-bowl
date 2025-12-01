"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type Props = {
  productId: string;
  className?: string;
};

export default function InstantBuyButton({ productId, className }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleInstantBuy = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      toast.error("Please sign up to buy products");
      router.push("/register");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/orders/instant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      const data = await res.json();
      if (!res.ok) {
        // Handle unauthorized - token might be invalid
        if (res.status === 401 || data.message?.includes("UNAUTHORIZED")) {
          toast.error("Session expired. Please sign up again.");
          localStorage.removeItem("token");
          router.push("/register");
          return;
        }
        toast.error(data.message || "Purchase failed");
        return;
      }

      toast.success("Order created! Redirecting to checkout...");
      // Redirect to checkout or order confirmation
      router.push(`/checkout?orderId=${data.data._id}`);
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleInstantBuy}
      disabled={loading}
      className={
        className ??
        "inline-flex items-center justify-center rounded-md border-2 border-black px-4 py-2 text-black transition-colors hover:bg-black hover:text-white disabled:opacity-50"
      }
    >
      {loading ? "Processing..." : "Buy Now"}
    </button>
  );
}

