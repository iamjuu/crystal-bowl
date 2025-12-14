"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/user/Navbar";
import Footer from "@/components/user/Footer";
import { CheckCircle2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import ProtectedRoute from "@/components/user/ProtectedRoute";

const SuccessPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [verifying, setVerifying] = useState(true);
  const [bookingDetails, setBookingDetails] = useState<any>(null);

  useEffect(() => {
    if (!sessionId) {
      toast.error("Invalid session");
      router.push("/privateappointment");
      return;
    }

    verifyAndCreateBooking();
  }, [sessionId]);

  const verifyAndCreateBooking = async () => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        toast.error("Please login to continue");
        router.push("/login");
        return;
      }

      // Verify the payment and create booking
      const response = await fetch("/api/payment/verify-private-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sessionId }),
      });

      const data = await response.json();
      
      console.log("Verification response:", data);

      if (data.success) {
        setBookingDetails(data.data);
        toast.success("Booking confirmed successfully!");
      } else {
        console.error("Verification failed:", data.message);
        toast.error(data.message || "Failed to verify payment");
        setTimeout(() => router.push("/privateappointment"), 2000);
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      toast.error(error.message || "Failed to verify payment. Please contact support.");
      setTimeout(() => router.push("/privateappointment"), 2000);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-[#FDECE2] to-[#FEC1A2] min-h-screen">
      <Navbar />
      
      <div className="max-w-2xl mx-auto px-4 py-16">
        {verifying ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <Loader2 className="w-16 h-16 text-[#D5B584] animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-[#1C3163] mb-2">
              Verifying Your Payment...
            </h2>
            <p className="text-gray-600">
              Please wait while we confirm your booking
            </p>
          </div>
        ) : bookingDetails ? (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-[#1C3163] mb-2">
                Booking Confirmed!
              </h1>
              <p className="text-gray-600">
                Your private yoga session has been successfully booked
              </p>
            </div>

            <div className="border-t border-gray-200 pt-6 space-y-4">
              <h3 className="text-xl font-semibold text-[#1C3163] mb-4">
                Booking Details
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Booking ID</p>
                  <p className="font-semibold text-[#1C3163]">
                    #{bookingDetails._id?.slice(-8) || "N/A"}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Payment Status</p>
                  <p className="font-semibold text-green-600">Paid</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Session Date</p>
                  <p className="font-semibold text-[#1C3163]">
                    {bookingDetails.comment?.split(" - ")[1]?.split(" at ")[0] || "N/A"}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Session Time</p>
                  <p className="font-semibold text-[#1C3163]">
                    {bookingDetails.comment?.split(" at ")[1] || "N/A"}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Amount Paid</p>
                  <p className="font-semibold text-[#D5B584] text-lg">
                    ${(bookingDetails.amount / 100).toFixed(2)}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-semibold text-[#1C3163] capitalize">
                    {bookingDetails.paymentProvider || "Stripe"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                📧 A confirmation email has been sent to your registered email address
                with all the details of your booking.
              </p>
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={() => router.push("/profile?tab=sessions")}
                className="flex-1 bg-[#D5B584] hover:bg-[#C4A574] text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                View My Bookings
              </button>
              <button
                onClick={() => router.push("/home")}
                className="flex-1 bg-[#1C3163] hover:bg-[#152649] text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <h2 className="text-2xl font-semibold text-red-600 mb-2">
              Verification Failed
            </h2>
            <p className="text-gray-600 mb-6">
              We couldn't verify your payment. Redirecting...
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default function SuccessPage() {
  return (
    <ProtectedRoute>
      <SuccessPageContent />
    </ProtectedRoute>
  );
}
