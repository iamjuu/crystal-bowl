import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import SessionEnquiry from "@/models/SessionEnquiry";

// PATCH - Update enquiry status
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (!status || !["pending", "contacted", "completed"].includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 }
      );
    }

    const enquiry = await SessionEnquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!enquiry) {
      return NextResponse.json(
        { success: false, message: "Enquiry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Enquiry updated successfully", data: enquiry },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating enquiry:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update enquiry" },
      { status: 500 }
    );
  }
}

// DELETE - Delete an enquiry
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;

    const enquiry = await SessionEnquiry.findByIdAndDelete(id);

    if (!enquiry) {
      return NextResponse.json(
        { success: false, message: "Enquiry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Enquiry deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting enquiry:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete enquiry" },
      { status: 500 }
    );
  }
}

