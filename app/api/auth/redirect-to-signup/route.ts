import { NextRequest, NextResponse } from "next/server";

// This endpoint stores email in cookie via POST request and returns redirect
// The email is passed via POST body
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body as { email?: string };

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    // Store email in a temporary cookie (expires in 5 minutes)
    const response = NextResponse.json({
      success: true,
      message: "Redirecting to signup",
      redirect: "/register",
    });

    response.cookies.set({
      name: "pendingSignupEmail",
      value: email,
      httpOnly: false, // Need to read it client-side
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 5, // 5 minutes
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || "Server error" },
      { status: 500 }
    );
  }
}

