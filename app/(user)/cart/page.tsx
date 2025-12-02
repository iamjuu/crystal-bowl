"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/user/Navbar";
import Footer from "@/components/user/Footer";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/stores/useCart";
import { Trash2, ShoppingBag, Lock, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const CartPage = () => {
  const router = useRouter();
  const { items, removeItem, increment, decrement, subtotal, totalQuantity, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Calculate totals
  const itemsSubtotal = subtotal();
  const shippingCost = itemsSubtotal > 0 ? (itemsSubtotal > 5000 ? 0 : 200) : 0;
  const tax = Math.round(itemsSubtotal * 0.18); // 18% GST
  const totalAmount = itemsSubtotal + shippingCost + tax;

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to proceed to checkout");
      router.push("/login");
      return;
    }

    setIsLoading(true);

    try {
      // Create Stripe checkout session
      const response = await fetch("/api/payment/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            imageUrl: item.imageUrl,
          })),
          amount: totalAmount,
          currency: "INR",
        }),
      });

      const data = await response.json();

      if (data.success && data.data?.url) {
        // Redirect to Stripe checkout
        window.location.href = data.data.url;
      } else {
        toast.error(data.message || "Failed to create checkout session");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isClient) {
    return (
      <div className="bg-gradient-to-r from-[#FDECE2] to-[#FEC1A2] min-h-screen">
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <p className="text-[#1C3163] text-lg">Loading cart...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-gradient-to-r from-[#FDECE2] to-[#FEC1A2] min-h-screen">
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center py-16">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="mb-6 flex justify-center">
              <ShoppingBag size={80} className="text-[#1C3163] opacity-30" />
            </div>
            <h2 className="text-[#1C3163] text-2xl md:text-3xl font-medium mb-4">
              Your Cart is Empty
            </h2>
            <p className="text-[#2C3E50] mb-8">
              Looks like you haven&apos;t added anything to your cart yet.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-[#2C3E50] hover:bg-[#1C3163] text-white px-8 py-3 rounded-lg transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-[#FDECE2] to-[#FEC1A2] min-h-screen">
      <Navbar />

      <section className="w-full py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-[#1C3163] text-3xl md:text-4xl font-medium mb-2">
              Shopping Cart
            </h1>
            <p className="text-[#2C3E50]">
              {totalQuantity()} {totalQuantity() === 1 ? "item" : "items"} in your cart
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Cart Items Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className={`p-4 md:p-6 ${
                      index !== items.length - 1 ? "border-b border-gray-200" : ""
                    }`}
                  >
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="relative w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="text-gray-400" size={40} />
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between gap-4 mb-2">
                          <h3 className="text-[#1C3163] text-base md:text-lg font-medium line-clamp-2">
                            {item.name}
                          </h3>
                          <button
                            onClick={() => {
                              removeItem(item.id);
                              toast.success("Item removed from cart");
                            }}
                            className="text-red-500 hover:text-red-700 transition-colors shrink-0"
                            aria-label="Remove item"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>

                        <p className="text-[#2C3E50] text-lg md:text-xl font-semibold mb-3">
                          ₹{item.price.toLocaleString("en-IN")}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                            <button
                              onClick={() => decrement(item.id)}
                              className="px-3 py-2 hover:bg-gray-100 transition-colors text-[#1C3163] font-medium"
                              aria-label="Decrease quantity"
                            >
                              −
                            </button>
                            <span className="px-4 py-2 border-x border-gray-300 text-[#1C3163] font-medium min-w-[50px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => increment(item.id)}
                              className="px-3 py-2 hover:bg-gray-100 transition-colors text-[#1C3163] font-medium"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                          <span className="text-sm text-gray-600">
                            Subtotal: ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Continue Shopping Link */}
              <div className="mt-6">
                <Link
                  href="/shop"
                  className="text-[#1C3163] hover:text-[#2C3E50] font-medium inline-flex items-center gap-2"
                >
                  ← Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order Summary Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                <h2 className="text-[#1C3163] text-xl font-semibold mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-[#2C3E50]">
                    <span>Subtotal ({totalQuantity()} items)</span>
                    <span>₹{itemsSubtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-[#2C3E50]">
                    <span>Shipping</span>
                    <span className={shippingCost === 0 ? "text-green-600 font-medium" : ""}>
                      {shippingCost === 0 ? "FREE" : `₹${shippingCost}`}
                    </span>
                  </div>
                  {shippingCost > 0 && (
                    <p className="text-xs text-green-600">
                      Add ₹{(5000 - itemsSubtotal).toLocaleString("en-IN")} more for FREE shipping
                    </p>
                  )}
                  <div className="flex justify-between text-[#2C3E50]">
                    <span>Tax (GST 18%)</span>
                    <span>₹{tax.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-[#1C3163] text-lg font-semibold">
                      <span>Total</span>
                      <span>₹{totalAmount.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={isLoading}
                  className="w-full bg-[#2C3E50] hover:bg-[#1C3163] text-white py-4 rounded-lg transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      Proceed to Checkout
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>

                {/* Stripe Badge */}
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-4">
                  <Lock size={16} />
                  <span>Secured by Stripe</span>
                </div>

                {/* Trust Badges */}
                <div className="border-t border-gray-200 pt-4 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Easy returns</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Fast delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CartPage;

