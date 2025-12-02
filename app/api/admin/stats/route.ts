import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getDashboardStats } from "@/lib/admin/stats";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const stats = await getDashboardStats();

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (e: any) {
    const status = e?.message === "FORBIDDEN" || e?.message === "UNAUTHORIZED" ? 403 : 500;
    return NextResponse.json({ success: false, message: e?.message || "Server error" }, { status });
  }
}



