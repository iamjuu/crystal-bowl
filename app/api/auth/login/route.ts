import { NextRequest, NextResponse } from "next/server";

// Password-based login is no longer supported
// Use /api/auth/login-otp instead
export async function POST(req: NextRequest) {
  return NextResponse.json(
    { 
      success: false, 
      message: "Password login is no longer supported. Please use OTP login instead." 
    },
    { status: 400 }
  );
}



