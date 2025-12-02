"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/user/Navbar";
import Footer from "@/components/user/Footer";
import Link from "next/link";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "@/stores/useCart";

const SuccessPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();
  const [isVerifying, setIsVerifying] = useState(true);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    
    if (!sessionId) {
      router.push("/cart");
      return;
    }

    // Verify the payment and create order
    const verifyPayment = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("/api/payment/verify-checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ sessionId }),
        });

        const data = await response.json();

        if (data.success) {
          setOrderDetails(data.data);
          // Clear the cart after successful payment
          clearCart();
        } else {
          console.error("Payment verification failed:", data.message);
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams, router, clearCart]);

  if (isVerifying) {
    return (
      <div className="bg-gradient-to-r from-[#FDECE2] to-[#FEC1A2] min-h-screen">
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#1C3163] mx-auto mb-4"></div>
            <p className="text-[#1C3163] text-lg">Verifying your payment...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-[#FDECE2] to-[#FEC1A2] min-h-screen">
      <Navbar />

      <section className="w-full py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 text-center">
            {/* Success Icon */}
            <div className="mb-6 flex justify-center">
              <div className="bg-green-100 rounded-full p-4">
                <CheckCircle size={64} className="text-green-600" />
              </div>
            </div>

            {/* Success Message */}
            <h1 className="text-[#1C3163] text-3xl md:text-4xl font-semibold mb-4">
              Order Placed Successfully!
            </h1>
            <p className="text-[#2C3E50] text-lg mb-8">
              Thank you for your purchase. Your order has been confirmed and will be shipped soon.
            </p>

            {/* Order Details */}
            {orderDetails && (
              <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
                <h2 className="text-[#1C3163] text-xl font-semibold mb-4 flex items-center gap-2">
                  <Package size={24} />
                  Order Details
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="text-[#1C3163] font-medium">
                      {orderDetails.orderId || "Processing..."}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Status:</span>
                    <span className="text-green-600 font-medium">Paid</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="text-[#1C3163] font-semibold">
                      ₹{orderDetails.amount?.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Confirmation Email Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <p className="text-blue-800 text-sm">
                📧 A confirmation email has been sent to your registered email address with order details and tracking information.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 bg-[#2C3E50] hover:bg-[#1C3163] text-white px-8 py-3 rounded-lg transition-colors font-medium"
              >
                Continue Shopping
                <ArrowRight size={20} />
              </Link>
              <Link
                href="/orders"
                className="inline-flex items-center justify-center gap-2 border-2 border-[#2C3E50] text-[#2C3E50] hover:bg-[#2C3E50] hover:text-white px-8 py-3 rounded-lg transition-colors font-medium"
              >
                View Orders
              </Link>
            </div>
          </div>

          {/* What's Next Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="text-4xl mb-3">📦</div>
              <h3 className="text-[#1C3163] font-semibold mb-2">Processing</h3>
              <p className="text-gray-600 text-sm">
                We&apos;re preparing your order for shipment
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="text-4xl mb-3">🚚</div>
              <h3 className="text-[#1C3163] font-semibold mb-2">Shipping</h3>
              <p className="text-gray-600 text-sm">
                Your order will be shipped within 2-3 business days
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="text-4xl mb-3">✨</div>
              <h3 className="text-[#1C3163] font-semibold mb-2">Delivered</h3>
              <p className="text-gray-600 text-sm">
                Enjoy your crystal singing bowls!
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SuccessPage;

