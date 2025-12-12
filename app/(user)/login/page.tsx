"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import Navbar from "@/components/user/Navbar";
import Footer from "@/components/user/Footer";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1: Send OTP
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email) {
      setError("Email is required");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/login-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to send OTP");
        toast.error(data.message || "Failed to send OTP");
        
        // If user not registered, redirect to signup
        if (res.status === 404 && data.message?.toLowerCase().includes("not found")) {
          setTimeout(() => {
            router.push("/signup");
          }, 1500);
        }
        return;
      }

      toast.success("OTP sent to your email!");
      setStep("otp");
    } catch {
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
      const res = await fetch("/api/auth/login-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to resend OTP");
        toast.error(data.message || "Failed to resend OTP");
        return;
      }

      toast.success("OTP resent to your email!");
    } catch {
      setError("Something went wrong. Please try again.");
      toast.error("Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and login
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
      const res = await fetch("/api/auth/verify-login-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "OTP verification failed");
        toast.error(data.message || "OTP verification failed");
        return;
      }

      // Store token in localStorage for client-side auth
      if (data.data?.token) {
        localStorage.setItem("userToken", data.data.token);
        localStorage.setItem("userRole", "user");
        toast.success("Login successful!");
        router.push("/");
      }
    } catch {
      setError("Something went wrong. Please try again.");
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex-col bg-gradient-to-b from-[#FEC1A2] to-[#FDECE2]  flex items-center justify-center ">
      <Navbar />
      <div className="w-full mt-[150px]  max-w-lg">
        <div className="relative  w-[500px] bg-white p-8 rounded-lg shadow-lg border border-zinc-200">
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
          <h1 className="text-3xl font-[300] text-black mb-6 mt-2">Log In</h1>

          {step === "email" && (
            <form onSubmit={handleSendOTP} className="space-y-5">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-[#FEC1A2] px-3 py-2 focus:border-[#FEC1A2] focus:outline-none focus:ring-2 focus:ring-[#FEC1A2]/20 bg-white"
                  placeholder="you@example.com"
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
                {loading ? "Logging in..." : "Login"}
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
                <p className="text-xs text-zinc-500 mt-1">Check your email for the 6-digit code</p>
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
                {loading ? "Verifying..." : "Log In"}
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

              {/* Change email button */}
              <button
                type="button"
                onClick={() => {
                  setStep("email");
                  setOtp("");
                  setError("");
                }}
                className="w-full text-sm text-[#6B7280] hover:text-black transition-colors"
              >
                Change Email
              </button>
            </form>
          )}
        </div>

        <div className="mt-6 space-y-3 text-center text-sm text-zinc-600">
          <p>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-medium text-black underline hover:no-underline">
              Sign Up
            </Link>
          </p>
          <p>
            <Link href="/" className="text-black underline hover:no-underline">
              Back to Home
            </Link>
          </p>
        </div>
      </div>
      <div className="mt-[100px] w-full" >
      <Footer  />
      </div>
    </div>
  );
}

