import { NextResponse } from "next/server";

// General logout route - clears both user and admin tokens
// For specific logout, use /api/user/logout or /api/admin/logout
export async function POST() {
  const res = NextResponse.json({ 
    success: true, 
    message: "Logged out successfully" 
  });
  
  // Clear user token
  res.cookies.set({
    name: "token",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });
  
  // Clear admin token
  res.cookies.set({
    name: "adminToken",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });
  
  return res;
}



