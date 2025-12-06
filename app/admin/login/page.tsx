"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setSuccess("Registration successful! Please login with your credentials.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // Validate response data
      if (!data.success || !data.data?.token || !data.data?.role) {
        setError("Invalid response from server");
        return;
      }

      // Verify admin role before navigation
      if (data.data.role !== "admin") {
        setError("Access denied. Admin login required.");
        return;
      }

      // Store token in localStorage (for client-side reference)
      localStorage.setItem("adminToken", data.data.token);
      localStorage.setItem("adminRole", "admin");

      // Wait a bit for cookie to be set, then navigate
      // The middleware will verify the cookie token
      await new Promise(resolve => setTimeout(resolve, 100));
      
      router.push("/admin/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-6 py-20">
      <h1 className="mb-6 text-3xl font-bold">Admin Login</h1>
      <p className="mb-6 text-sm text-zinc-600">Crystal Bowl Studio Administration</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full rounded-md border border-zinc-300 px-3 py-2"
            placeholder="admin@crystalbow.com"
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
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full rounded-md border border-zinc-300 px-3 py-2"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-zinc-600">
        Don&apos;t have an account?{" "}
        <Link href="/admin/signup" className="text-black underline">
          Sign Up
        </Link>
      </p>
      <p className="mt-2 text-center text-sm text-zinc-600">
        <Link href="/" className="text-black underline">
          Back to Home
        </Link>
      </p>
    </div>
  );
}

