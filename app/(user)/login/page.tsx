"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [needsVerification, setNeedsVerification] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setNeedsVerification(false);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Login failed");
        
        // Check if error is due to unverified email
        if (res.status === 403 && data.message?.toLowerCase().includes("verify")) {
          setNeedsVerification(true);
          toast.error("Please verify your email before logging in");
        } else {
          toast.error(data.message || "Login failed");
        }
        return;
      }

      // Store token in localStorage for client-side auth
      if (data.data?.token) {
        localStorage.setItem("token", data.data.token);
        toast.success("Login successful!");
        router.push("/home");
      }
    } catch {
      setError("Something went wrong. Please try again.");
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-50 via-white to-zinc-100 flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-black">  user Login</h1>
          <p className="text-zinc-600">Welcome back! Please sign in to your account.</p>
        </div>

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
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/20"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/20"
              placeholder="Enter your password"
            />
          </div>
          {error && (
            <div className="text-sm text-red-600">
              <p>{error}</p>
              {needsVerification && (
                <Link
                  href="/resend-verification"
                  className="mt-2 inline-block text-blue-600 underline hover:no-underline"
                >
                  Resend verification email
                </Link>
              )}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-black px-4 py-2 text-white transition-colors hover:bg-zinc-800 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 space-y-3 text-center text-sm text-zinc-600">
          <p>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-medium text-black underline hover:no-underline">
              Sign Up
            </Link>
          </p>
          <p>
            Need to verify your email?{" "}
            <Link href="/resend-verification" className="font-medium text-black underline hover:no-underline">
              Resend verification
            </Link>
          </p>
          <p>
            <Link href="/home" className="text-black underline hover:no-underline">
              Back to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

