import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import SessionEnquiry from "@/models/SessionEnquiry";
import { sendEnquiryNotificationToAdmin, sendEnquiryConfirmationToUser } from "@/lib/email";

// POST - Submit a new enquiry
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { fullName, address, dateOfBirth, services, phone, email, comment, sessionType } = body;

    // Validate required fields
    if (!fullName || !address || !dateOfBirth || !services || !phone || !email) {
      return NextResponse.json(
        { success: false, message: "All required fields must be provided" },
        { status: 400 }
      );
    }

    // Create new enquiry
    const enquiry = await SessionEnquiry.create({
      fullName,
      address,
      dateOfBirth,
      services,
      phone,
      email,
      comment: comment || "",
      status: "pending",
      sessionType: sessionType || "corporate",
    });

    // Send emails (don't wait for them to complete - send in background)
    // Send notification to admin
    sendEnquiryNotificationToAdmin({
      fullName: enquiry.fullName,
      email: enquiry.email,
      phone: enquiry.phone,
      address: enquiry.address,
      dateOfBirth: enquiry.dateOfBirth,
      services: enquiry.services,
      sessionType: enquiry.sessionType,
      comment: enquiry.comment,
      createdAt: enquiry.createdAt.toISOString(),
    }).catch((error) => {
      console.error("Failed to send admin notification email:", error);
      // Don't fail the request if email fails
    });

    // Send confirmation to user
    sendEnquiryConfirmationToUser({
      fullName: enquiry.fullName,
      email: enquiry.email,
      services: enquiry.services,
      sessionType: enquiry.sessionType,
    }).catch((error) => {
      console.error("Failed to send user confirmation email:", error);
      // Don't fail the request if email fails
    });

    return NextResponse.json(
      { success: true, message: "Enquiry submitted successfully", data: enquiry },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating enquiry:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit enquiry" },
      { status: 500 }
    );
  }
}

// GET - Fetch all enquiries (for admin)
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const sessionType = searchParams.get("sessionType");

    let query: Record<string, string> = {};
    if (status && status !== "all") {
      query.status = status;
    }
    if (sessionType && sessionType !== "all") {
      query.sessionType = sessionType;
    }

    const enquiries = await SessionEnquiry.find(query).sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, data: enquiries },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching enquiries:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch enquiries" },
      { status: 500 }
    );
  }
}

