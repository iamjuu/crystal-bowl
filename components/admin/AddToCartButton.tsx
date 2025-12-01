"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/stores/useCart";
import toast from "react-hot-toast";

type Props = {
  id: string;
  name: string;
  price: number; // in paise/cents
  imageUrl?: string;
  quantity?: number;
  className?: string;
};

export default function AddToCartButton({ id, name, price, imageUrl, quantity = 1, className }: Props) {
  const router = useRouter();
  const addItem = useCart((s) => s.addItem);

  const handleAddToCart = async () => {
    // Check if user is logged in
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    
    if (!token) {
      toast.error("Please login to add items to cart");
      router.push("/login");
      return;
    }

    // Verify token is valid by checking user
    try {
      const res = await fetch("/api/auth/verify-token", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        // Token invalid or user not registered
        const data = await res.json();
        if (data.message?.includes("not registered") || res.status === 404) {
          toast.error("Please sign up with your email");
          router.push("/register");
          return;
        }
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        router.push("/login");
        return;
      }
    } catch (err) {
      // If verify endpoint doesn't exist, just proceed
      console.warn("Token verification endpoint not available");
    }

    addItem({ id, name, price, imageUrl }, quantity);
    toast.success(`${name} added to cart!`);
  };

  return (
    <button
      onClick={handleAddToCart}
      className={
        className ??
        "inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-white"
      }
    >
      Add to Cart
    </button>
  );
}

