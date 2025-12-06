import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true, message: "User logged out successfully" });
  
  // Clear user token cookie
  res.cookies.set({
    name: "token",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });
  
  return res;
}

