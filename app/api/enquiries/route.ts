import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import SessionEnquiry from "@/models/SessionEnquiry";
import DiscoverySession from "@/models/DiscoverySession";
import PrivateSession from "@/models/PrivateSession";
import { sendEnquiryNotificationToAdmin, sendEnquiryConfirmationToUser, sendDiscoverySessionConfirmation } from "@/lib/email";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

// POST - Submit a new enquiry
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { 
      fullName, 
      services, 
      phone, 
      email, 
      comment, 
      sessionType,
      sessionId, // For private sessions - the PrivateSession ID
      userId, // Optional - if user is logged in
    } = body;

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

    // For private sessions, validate session exists and get price
    if (sessionType === "private") {
      if (!sessionId) {
        return NextResponse.json(
          { success: false, message: "Session ID is required for private sessions" },
          { status: 400 }
        );
      }

      const privateSession = await PrivateSession.findById(sessionId);
      if (!privateSession) {
        return NextResponse.json(
          { success: false, message: "Private session not found" },
          { status: 404 }
        );
      }

      if (privateSession.bookedSeats >= privateSession.totalSeats) {
        return NextResponse.json(
          { success: false, message: "Session is already fully booked" },
          { status: 400 }
        );
      }

      // Create enquiry first with session details
      const enquiry = await SessionEnquiry.create({
        fullName,
        services,
        phone,
        email,
        comment: comment || "",
        status: "pending",
        sessionType: "private",
        sessionId: sessionId,
        bookedDate: privateSession.date,
        bookedTime: privateSession.startTime,
      });

      // Create Stripe checkout session for private session
      let baseUrl = process.env.NEXT_PUBLIC_APP_URL;
      if (!baseUrl) {
        const origin = req.headers.get('origin');
        if (origin && (origin.startsWith('http://') || origin.startsWith('https://'))) {
          baseUrl = origin;
        } else {
          const host = req.headers.get('host') || req.headers.get('x-forwarded-host');
          const protocol = req.headers.get('x-forwarded-proto') || 
                          (host?.includes('localhost') ? 'http' : 'https');
          baseUrl = host ? `${protocol}://${host}` : 'http://localhost:3000';
        }
      }

      // Create Stripe checkout session
      const checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: privateSession.title || "Private Yoga Session",
                description: privateSession.description || `Private Session on ${privateSession.date} at ${privateSession.startTime}`,
              },
              unit_amount: Math.round(privateSession.price * 100), // Convert to smallest currency unit
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${baseUrl}/privateappointment/success?session_id={CHECKOUT_SESSION_ID}&enquiry_id=${enquiry._id}`,
        cancel_url: `${baseUrl}/privateappointment?enquiry_id=${enquiry._id}`,
        metadata: {
          enquiryId: enquiry._id.toString(),
          sessionId: sessionId,
          sessionType: "private",
          userId: userId || "",
        },
        customer_email: email,
      });

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
      });

      return NextResponse.json(
        { 
          success: true, 
          message: "Enquiry created. Please complete payment to confirm booking.",
          data: enquiry,
          requiresPayment: true,
          checkoutUrl: checkoutSession.url,
          checkoutSessionId: checkoutSession.id,
        },
        { status: 201 }
      );
    }

    // For discovery sessions - find the session by date/time and mark as booked
    if (sessionType === "discovery") {
      let discoveryDate: string | null = null;
      let discoveryTime: string | null = null;
      
      // Parse date and time from comment or services
      try {
        if (comment) {
          const parsed = JSON.parse(comment);
          console.log('Parsed comment data:', parsed);
          
          // Prefer ISO format if available
          if (parsed.selectedDateISO && parsed.selectedTime) {
            discoveryDate = parsed.selectedDateISO.trim();
            // Normalize time to HH:mm format
            const timeParts = parsed.selectedTime.trim().split(':');
            if (timeParts.length >= 2) {
              discoveryTime = `${String(parseInt(timeParts[0])).padStart(2, '0')}:${String(parseInt(timeParts[1])).padStart(2, '0')}`;
            } else {
              discoveryTime = parsed.selectedTime.trim();
            }
            console.log('Using ISO date format:', { discoveryDate, discoveryTime });
          } else if (parsed.selectedDate && parsed.selectedTime) {
            // Convert formatted date back to YYYY-MM-DD
            const dateMatch = parsed.selectedDate.match(/(\w+)\s+(\d+),?\s+(\d+)/);
            if (dateMatch) {
              const monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];
              const month = monthNames.indexOf(dateMatch[1]);
              const day = parseInt(dateMatch[2]);
              const year = parseInt(dateMatch[3]);
              if (month !== -1) {
                discoveryDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              }
            }
            // Normalize time to HH:mm format
            const timeParts = parsed.selectedTime.trim().split(':');
            if (timeParts.length >= 2) {
              discoveryTime = `${String(parseInt(timeParts[0])).padStart(2, '0')}:${String(parseInt(timeParts[1])).padStart(2, '0')}`;
            } else {
              discoveryTime = parsed.selectedTime.trim();
            }
            console.log('Using formatted date:', { discoveryDate, discoveryTime });
          }
        }
      } catch (e) {
        console.error('Error parsing comment JSON:', e);
        // Try parsing from services string
        const servicesMatch = services.match(/Discovery Session - (.+) at (.+)/);
        if (servicesMatch) {
          console.log('Parsing from services string:', servicesMatch);
          // Parse date from formatted string
          const dateMatch = servicesMatch[1].match(/(\w+)\s+(\d+),?\s+(\d+)/);
          if (dateMatch) {
            const monthNames = ["January", "February", "March", "April", "May", "June",
              "July", "August", "September", "October", "November", "December"];
            const month = monthNames.indexOf(dateMatch[1]);
            const day = parseInt(dateMatch[2]);
            const year = parseInt(dateMatch[3]);
            if (month !== -1) {
              discoveryDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            }
          }
          // Normalize time to HH:mm format
          const timeParts = servicesMatch[2].trim().split(':');
          if (timeParts.length >= 2) {
            discoveryTime = `${String(parseInt(timeParts[0])).padStart(2, '0')}:${String(parseInt(timeParts[1])).padStart(2, '0')}`;
          } else {
            discoveryTime = servicesMatch[2].trim();
          }
          console.log('Parsed from services:', { discoveryDate, discoveryTime });
        }
      }

      // Find the discovery session by date and time
      let discoverySession = null;
      if (discoveryDate && discoveryTime) {
        // Normalize time format (ensure HH:mm format, remove any seconds)
        const normalizedTime = discoveryTime.includes(':') 
          ? discoveryTime.split(':').slice(0, 2).map(n => String(parseInt(n)).padStart(2, '0')).join(':')
          : discoveryTime;

        const normalizedDate = discoveryDate.trim();
        const normalizedTimeStr = normalizedTime.trim();

        console.log('Looking for discovery session:', { 
          discoveryDate: normalizedDate, 
          discoveryTime: normalizedTimeStr,
          originalDate: discoveryDate,
          originalTime: discoveryTime
        });
        
        // Try exact match first
        discoverySession = await DiscoverySession.findOne({
          date: normalizedDate,
          startTime: normalizedTimeStr,
        });

        // If not found, try without trimming (in case of whitespace issues)
        if (!discoverySession) {
          discoverySession = await DiscoverySession.findOne({
            date: { $regex: new RegExp(`^${normalizedDate.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`) },
            startTime: { $regex: new RegExp(`^${normalizedTimeStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`) },
          });
        }

        console.log('Found discovery session:', discoverySession ? { 
          id: discoverySession._id, 
          date: discoverySession.date, 
          startTime: discoverySession.startTime,
          bookedSeats: discoverySession.bookedSeats,
          totalSeats: discoverySession.totalSeats
        } : 'NOT FOUND');

        if (discoverySession) {
          // Check if already booked
          if (discoverySession.bookedSeats >= discoverySession.totalSeats) {
            console.log('Session already booked - rejecting enquiry');
            return NextResponse.json(
              { success: false, message: "This session is already booked" },
              { status: 400 }
            );
          }

          // Mark as booked
          discoverySession.bookedSeats = 1;
          const saved = await discoverySession.save();
          console.log('Session marked as booked successfully:', {
            id: saved._id,
            bookedSeats: saved.bookedSeats,
            totalSeats: saved.totalSeats
          });
        } else {
          console.error('Discovery session not found for:', { 
            date: normalizedDate, 
            time: normalizedTimeStr,
            'Available sessions on this date:': 'Checking...'
          });
          
          // List all sessions on this date for debugging
          const allSessionsOnDate = await DiscoverySession.find({ date: normalizedDate }).lean();
          console.log('All sessions on date', normalizedDate, ':', allSessionsOnDate.map(s => ({
            id: s._id,
            date: s.date,
            startTime: s.startTime,
            bookedSeats: s.bookedSeats
          })));
          
          // Don't fail the enquiry creation, but log the issue
        }
      } else {
        console.error('Missing date or time:', { discoveryDate, discoveryTime, comment, services });
      }

      // Create enquiry with session details
    const enquiry = await SessionEnquiry.create({
      fullName: fullName || "Discovery Appointment",
      services: services || "Discovery Session",
      phone: phone || "N/A",
      email: email || "discovery@example.com",
      comment: comment || "",
      status: "pending",
        sessionType: "discovery",
        sessionId: discoverySession?._id.toString(),
        bookedDate: discoveryDate || undefined,
        bookedTime: discoveryTime || undefined,
    });

    // Send emails (don't wait for them to complete - send in background)
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
    });

    // For discovery sessions, send special confirmation email
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
      });

      return NextResponse.json(
        { 
          success: true, 
          message: "Discovery session booked successfully", 
          data: enquiry,
          requiresPayment: false,
        },
        { status: 201 }
      );
    }

    // For corporate - create enquiry without payment
    const enquiry = await SessionEnquiry.create({
      fullName: fullName || "Corporate Enquiry",
      services: services || "Corporate Session",
      phone: phone || "N/A",
      email: email || "corporate@example.com",
      comment: comment || "",
      status: "pending",
      sessionType: "corporate",
    });

    // Send regular confirmation to user for corporate sessions
      sendEnquiryConfirmationToUser({
        fullName: enquiry.fullName,
        email: enquiry.email,
        services: enquiry.services,
        sessionType: enquiry.sessionType,
      }).catch((error) => {
        console.error("Failed to send user confirmation email:", error);
      });

    return NextResponse.json(
      { 
        success: true, 
        message: "Enquiry submitted successfully", 
        data: enquiry,
        requiresPayment: false,
      },
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
