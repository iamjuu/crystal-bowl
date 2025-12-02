"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ResendVerificationPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [verificationUrl, setVerificationUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setVerificationUrl("");

    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      
      if (res.ok) {
        setSuccess(true);
        toast.success(data.message || "Verification email sent!");
        
        // Show verification URL in development
        if (data.data?.verificationUrl) {
          setVerificationUrl(data.data.verificationUrl);
        }
      } else {
        toast.error(data.message || "Failed to send verification email");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-50 via-white to-zinc-100 flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-black">Resend Verification Email</h1>
          <p className="text-zinc-600">
            Enter your email address and we'll send you a new verification link.
          </p>
        </div>

        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-4 bg-white p-8 rounded-lg shadow-sm border border-zinc-200">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-zinc-300 px-3 py-2 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/20"
                placeholder="you@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-black px-4 py-2 text-white transition-colors hover:bg-zinc-800 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Verification Email"}
            </button>
          </form>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-zinc-200">
            <div className="text-center mb-6">
              <div className="mb-4">
                <svg
                  className="mx-auto h-12 w-12 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-black mb-2">Email Sent!</h2>
              <p className="text-zinc-600">
                If an account exists with this email, a verification link has been sent.
                Please check your inbox and spam folder.
              </p>
            </div>

            {verificationUrl && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm font-medium text-blue-900 mb-2">
                  Development Mode - Verification Link:
                </p>
                <a
                  href={verificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 underline break-all hover:no-underline"
                >
                  {verificationUrl}
                </a>
              </div>
            )}

            <Link
              href="/login"
              className="block w-full text-center rounded-md bg-black px-4 py-2 text-white transition-colors hover:bg-zinc-800"
            >
              Back to Login
            </Link>
          </div>
        )}

        <p className="mt-6 text-center text-sm text-zinc-600">
          Remember your password?{" "}
          <Link href="/login" className="font-medium text-black underline hover:no-underline">
            Login
          </Link>
        </p>
        <p className="mt-4 text-center text-sm text-zinc-600">
          <Link href="/home" className="text-black underline hover:no-underline">
            Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
}

