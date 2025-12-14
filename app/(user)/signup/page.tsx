"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import Navbar from "@/components/user/Navbar";
import Footer from "@/components/user/Footer";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<"form" | "otp">("form");
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Step 1: Submit form and send OTP
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate all fields
    if (!formData.name || !formData.email || !formData.phone) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          phone: formData.phone,
        }),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to send OTP");
        toast.error(data.message || "Failed to send OTP");
        return;
      }

      toast.success("OTP sent to your email!");
      setStep("otp");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Retry OTP - resend OTP
  const handleRetryOTP = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          phone: formData.phone,
        }),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to resend OTP");
        toast.error(data.message || "Failed to resend OTP");
        return;
      }

      toast.success("OTP resent to your email!");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      toast.error("Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and complete registration
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          otp,
          name: formData.name,
          phone: formData.phone,
        }),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "OTP verification failed");
        toast.error(data.message || "OTP verification failed");
        return;
      }

      toast.success("Account created successfully! You are now logged in.");
      
      // Store token in localStorage
      if (data.data?.token) {
        localStorage.setItem("userToken", data.data.token);
        localStorage.setItem("userRole", "user");
      }

      // Redirect to home
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex-col bg-gradient-to-b from-[#FEC1A2] to-[#FDECE2] flex items-center justify-center">
      <Navbar />
      <div className="w-full mt-[150px] max-w-lg">
        <div className="relative w-[500px] bg-white p-8 rounded-lg shadow-lg border border-zinc-200">
          {/* Close button */}
          <button
            type="button"
            onClick={() => router.push("/home")}
            className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center rounded-full border border-black/20 hover:bg-zinc-50 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-black" />
          </button>

          {/* Title */}
          <h1 className="text-3xl font-[300] text-black mb-6 mt-2">Sign Up</h1>

          {step === "form" && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-black mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  autoComplete="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-md border border-[#FEC1A2] px-3 py-2 focus:border-[#FEC1A2] focus:outline-none focus:ring-2 focus:ring-[#FEC1A2]/20 bg-white"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-black mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-md border border-[#FEC1A2] px-3 py-2 focus:border-[#FEC1A2] focus:outline-none focus:ring-2 focus:ring-[#FEC1A2]/20 bg-white"
                  placeholder="you@example.com"
                />
              </div>

              {/* Phone field */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-black mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-md border border-[#FEC1A2] px-3 py-2 focus:border-[#FEC1A2] focus:outline-none focus:ring-2 focus:ring-[#FEC1A2]/20 bg-white"
                  placeholder="Enter your phone number"
                />
              </div>

              {/* Error message */}
              {error && (
                <div className="text-sm text-red-600">
                  <p>{error}</p>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-[#FEC1A2] border border-[#F5A082] px-4 py-2 text-black font-medium transition-colors hover:bg-[#F5A082] disabled:opacity-50"
              >
                {loading ? "Sending OTP..." : "Sign Up"}
              </button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleVerifyOTP} className="space-y-5">
              {/* OTP field */}
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-black mb-1">
                  Enter OTP <span className="text-red-500">*</span>
                </label>
                <input
                  id="otp"
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="w-full rounded-md border border-[#FEC1A2] px-3 py-2 focus:border-[#FEC1A2] focus:outline-none focus:ring-2 focus:ring-[#FEC1A2]/20 bg-white text-center text-2xl tracking-widest"
                  placeholder="000000"
                />
                <p className="text-xs text-zinc-500 mt-1">Check your email ({formData.email}) for the 6-digit code</p>
              </div>

              {/* Error message */}
              {error && (
                <div className="text-sm text-red-600">
                  <p>{error}</p>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-[#FEC1A2] border border-[#F5A082] px-4 py-2 text-black font-medium transition-colors hover:bg-[#F5A082] disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Complete Registration"}
              </button>

              {/* Retry OTP button */}
              <button
                type="button"
                onClick={handleRetryOTP}
                disabled={loading}
                className="w-full text-sm text-[#6B7280] hover:text-black transition-colors disabled:opacity-50"
              >
                {loading ? "Resending..." : "Resend OTP"}
              </button>

              {/* Back to form button */}
              <button
                type="button"
                onClick={() => {
                  setStep("form");
                  setOtp("");
                  setError("");
                }}
                className="w-full text-sm text-[#6B7280] hover:text-black transition-colors"
              >
                Back to Form
              </button>
            </form>
          )}
        </div>

        <div className="mt-6 space-y-3 text-center text-sm text-zinc-600">
          <p>
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-black underline hover:no-underline">
              Login
            </Link>
          </p>
          <p>
            <Link href="/" className="text-black underline hover:no-underline">
              Back to Home
            </Link>
          </p>
        </div>
      </div>
      <div className="mt-[100px] w-full">
        <Footer />
      </div>
    </div>
  );
}

