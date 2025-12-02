import { NextRequest, NextResponse } from "next/server";

// This endpoint retrieves the pending email from cookie (set via POST)
export async function GET(req: NextRequest) {
  try {
    const pendingEmail = req.cookies.get("pendingSignupEmail")?.value;

    if (!pendingEmail) {
      return NextResponse.json({
        success: false,
        message: "No pending email found",
      });
    }

    // Clear the cookie after reading
    const response = NextResponse.json({
      success: true,
      data: { email: pendingEmail },
    });

    response.cookies.set({
      name: "pendingSignupEmail",
      value: "",
      expires: new Date(0),
      path: "/",
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || "Server error" },
      { status: 500 }
    );
  }
}



