"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type ProtectedRouteProps = {
  children: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
};

export default function ProtectedRoute({ 
  children, 
  redirectTo = "/login",
  requireAuth = true 
}: ProtectedRouteProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("userToken");
      
      if (!token && requireAuth) {
        toast.error("Please login to continue");
        router.push(redirectTo);
        return;
      }
      
      setIsAuthenticated(!!token);
      setIsLoading(false);
    };

    checkAuth();
  }, [router, redirectTo, requireAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#FDECE2] to-[#FEC1A2]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1C3163] mx-auto mb-4"></div>
          <p className="text-[#1C3163]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && requireAuth) {
    return null;
  }

  return <>{children}</>;
}



