"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    
    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing");
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await res.json();

        if (res.ok) {
          setStatus("success");
          setMessage(data.message || "Email verified successfully!");
          toast.success("Email verified! You can now log in.");
          
          // Redirect to login after 3 seconds
          setTimeout(() => {
            router.push("/login");
          }, 3000);
        } else {
          setStatus("error");
          setMessage(data.message || "Verification failed");
          toast.error(data.message || "Verification failed");
        }
      } catch (err) {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
        toast.error("Verification failed. Please try again.");
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-50 via-white to-zinc-100 flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-zinc-200 text-center">
          {status === "loading" && (
            <>
              <div className="mb-4">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
              </div>
              <h1 className="text-2xl font-bold text-black mb-2">Verifying Your Email</h1>
              <p className="text-zinc-600">Please wait while we verify your email address...</p>
            </>
          )}

          {status === "success" && (
            <>
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
              <h1 className="text-2xl font-bold text-black mb-2">Email Verified!</h1>
              <p className="text-zinc-600 mb-6">{message}</p>
              <p className="text-sm text-zinc-500">Redirecting to login page...</p>
              <Link
                href="/login"
                className="mt-4 inline-block text-black underline hover:no-underline"
              >
                Click here if not redirected
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <div className="mb-4">
                <svg
                  className="mx-auto h-12 w-12 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-black mb-2">Verification Failed</h1>
              <p className="text-zinc-600 mb-6">{message}</p>
              <div className="space-y-3">
                <Link
                  href="/resend-verification"
                  className="block w-full rounded-md bg-black px-4 py-2 text-white transition-colors hover:bg-zinc-800"
                >
                  Resend Verification Email
                </Link>
                <Link
                  href="/login"
                  className="block text-black underline hover:no-underline"
                >
                  Back to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

