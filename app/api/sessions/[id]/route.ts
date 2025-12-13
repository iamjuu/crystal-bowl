import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import DiscoverySession from "@/models/DiscoverySession";
import PrivateSession from "@/models/PrivateSession";
import YogaSession from "@/models/YogaSession";
import { requireAdmin } from "@/lib/auth";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    await connectDB();
    const { id } = await context.params;
    
    // Try to find in all collections
    let session: any = await DiscoverySession.findById(id).lean();
    if (session) {
      return NextResponse.json({ success: true, data: { ...session, sessionType: "discovery" } });
    }
    
    session = await PrivateSession.findById(id).lean();
    if (session) {
      return NextResponse.json({ success: true, data: { ...session, sessionType: "private" } });
    }
    
    session = await YogaSession.findById(id).lean();
    if (session) {
      return NextResponse.json({ success: true, data: session });
    }
    
    return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  } catch {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    await requireAdmin(req);
    await connectDB();
    const body = await req.json();
    const { id } = await context.params;
    const { sessionType, date, startTime, duration, ...updateData } = body;

    // Determine which collection to update
    let existingSession: any = null;
    let SessionModel: any = null;
    
    if (sessionType === "discovery") {
      existingSession = await DiscoverySession.findById(id);
      SessionModel = DiscoverySession;
    } else if (sessionType === "private") {
      existingSession = await PrivateSession.findById(id);
      SessionModel = PrivateSession;
    } else if (sessionType === "corporate") {
      existingSession = await YogaSession.findById(id);
      SessionModel = YogaSession;
    } else {
      // Try to find in all collections
      existingSession = await DiscoverySession.findById(id);
      if (existingSession) {
        SessionModel = DiscoverySession;
      } else {
        existingSession = await PrivateSession.findById(id);
        if (existingSession) {
          SessionModel = PrivateSession;
        } else {
          existingSession = await YogaSession.findById(id);
          SessionModel = YogaSession;
        }
      }
    }

    if (!existingSession) {
      return NextResponse.json({ success: false, message: "Session not found" }, { status: 404 });
    }

    // If updating date/time for discovery or private, check for conflicts
    if ((sessionType === "discovery" || sessionType === "private") && (date || startTime || duration)) {
      const checkDate = date || existingSession.date;
      const checkStartTime = startTime || existingSession.startTime;
      const checkDuration = duration || existingSession.duration;

      if (checkDate && checkStartTime && checkDuration) {
        // Calculate endTime
        const [hours, minutes] = checkStartTime.split(':').map(Number);
        const startMinutes = hours * 60 + minutes;
        const endMinutes = startMinutes + Number(checkDuration);
        const endHours = Math.floor(endMinutes / 60);
        const endMins = endMinutes % 60;
        const endTime = `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;

        // Check for conflicts (excluding current session)
        const discoveryConflicts = await DiscoverySession.find({
          date: String(checkDate).trim(),
          _id: { $ne: id }, // Exclude current session
        }).lean();

        const privateConflicts = await PrivateSession.find({
          date: String(checkDate).trim(),
          _id: { $ne: id }, // Exclude current session
        }).lean();

        const allConflicts = [...discoveryConflicts, ...privateConflicts];

        // Check for exact time match
        const exactMatch = allConflicts.find(
          (s) => s.startTime === String(checkStartTime).trim()
        );

        if (exactMatch) {
          return NextResponse.json(
            {
              success: false,
              message: `A session already exists on ${checkDate} at ${checkStartTime}. Please choose a different date or time.`,
            },
            { status: 400 }
          );
        }

        // Check for time overlaps
        for (const conflict of allConflicts) {
          const conflictStart = conflict.startTime.split(':').map(Number);
          const conflictEnd = conflict.endTime.split(':').map(Number);
          const conflictStartMinutes = conflictStart[0] * 60 + conflictStart[1];
          const conflictEndMinutes = conflictEnd[0] * 60 + conflictEnd[1];
          const newStartMinutes = hours * 60 + minutes;
          const newEndMinutes = endHours * 60 + endMins;

          if (
            (newStartMinutes >= conflictStartMinutes && newStartMinutes < conflictEndMinutes) ||
            (newEndMinutes > conflictStartMinutes && newEndMinutes <= conflictEndMinutes) ||
            (newStartMinutes <= conflictStartMinutes && newEndMinutes >= conflictEndMinutes)
          ) {
            return NextResponse.json(
              {
                success: false,
                message: `Time conflict: A session already exists on ${checkDate} from ${conflict.startTime} to ${conflict.endTime}. Please choose a different time.`,
              },
              { status: 400 }
            );
          }
        }

        // Update endTime if duration or startTime changed
        if (duration || startTime) {
          updateData.endTime = endTime;
        }
      }
    }

    const updated = await SessionModel.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) {
      return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (e: any) {
    const status = e?.message === "FORBIDDEN" || e?.message === "UNAUTHORIZED" ? 403 : 500;
    return NextResponse.json({ success: false, message: e?.message || "Server error" }, { status });
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    await requireAdmin(req);
    await connectDB();
    const { id } = await context.params;
    
    // Try to delete from all collections
    let deleted = await DiscoverySession.findByIdAndDelete(id);
    if (deleted) {
      return NextResponse.json({ success: true });
    }
    
    deleted = await PrivateSession.findByIdAndDelete(id);
    if (deleted) {
      return NextResponse.json({ success: true });
    }
    
    deleted = await YogaSession.findByIdAndDelete(id);
    if (deleted) {
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ success: false, message: "Session not found" }, { status: 404 });
  } catch (e: any) {
    const status = e?.message === "FORBIDDEN" || e?.message === "UNAUTHORIZED" ? 403 : 500;
    return NextResponse.json({ success: false, message: e?.message || "Server error" }, { status });
  }
}
