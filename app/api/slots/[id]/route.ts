import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import AvailableSlot from "@/models/AvailableSlot";

// DELETE - Delete a slot
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Slot ID is required" },
        { status: 400 }
      );
    }

    const slot = await AvailableSlot.findByIdAndDelete(id);

    if (!slot) {
      return NextResponse.json(
        { success: false, message: "Slot not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Slot deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting slot:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete slot" },
      { status: 500 }
    );
  }
}

