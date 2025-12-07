import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import SessionEnquiry from "@/models/SessionEnquiry";
import { sendEnquiryNotificationToAdmin, sendEnquiryConfirmationToUser, sendDiscoverySessionConfirmation } from "@/lib/email";

// POST - Submit a new enquiry
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { fullName, services, phone, email, comment, sessionType } = body;

    // For discovery appointments, user info fields are optional
    // For other types, validate required fields
    if (sessionType !== "discovery") {
      if (!fullName || !services || !phone || !email) {
        return NextResponse.json(
          { success: false, message: "All required fields must be provided" },
          { status: 400 }
        );
      }
    }

    // Create new enquiry (use defaults for discovery if fields are missing)
    const enquiry = await SessionEnquiry.create({
      fullName: fullName || "Discovery Appointment",
      services: services || "Discovery Session",
      phone: phone || "N/A",
      email: email || "discovery@example.com",
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
      services: enquiry.services,
      sessionType: enquiry.sessionType,
      comment: enquiry.comment,
      createdAt: enquiry.createdAt.toISOString(),
    }).catch((error) => {
      console.error("Failed to send admin notification email:", error);
      // Don't fail the request if email fails
    });

    // For discovery sessions, send special confirmation email
    if (sessionType === "discovery") {
      // Parse discovery data from comment if available
      let discoveryData: { selectedDate?: string; selectedTime?: string; email?: string } = {};
      try {
        if (comment) {
          const parsed = JSON.parse(comment);
          discoveryData = {
            selectedDate: parsed.selectedDate,
            selectedTime: parsed.selectedTime,
            email: enquiry.email !== "discovery@example.com" ? enquiry.email : undefined,
          };
        }
      } catch (e) {
        // If parsing fails, extract from services string
        const servicesMatch = services.match(/Discovery Session - (.+) at (.+)/);
        if (servicesMatch) {
          discoveryData = {
            selectedDate: servicesMatch[1],
            selectedTime: servicesMatch[2],
            email: enquiry.email !== "discovery@example.com" ? enquiry.email : undefined,
          };
        }
      }

      sendDiscoverySessionConfirmation({
        selectedDate: discoveryData.selectedDate || "Date not specified",
        selectedTime: discoveryData.selectedTime || "Time not specified",
        email: discoveryData.email,
      }).catch((error) => {
        console.error("Failed to send discovery session confirmation email:", error);
        // Don't fail the request if email fails
      });
    } else {
      // Send regular confirmation to user for non-discovery sessions
      sendEnquiryConfirmationToUser({
        fullName: enquiry.fullName,
        email: enquiry.email,
        services: enquiry.services,
        sessionType: enquiry.sessionType,
      }).catch((error) => {
        console.error("Failed to send user confirmation email:", error);
        // Don't fail the request if email fails
      });
    }

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

    const query: Record<string, string> = {};
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

