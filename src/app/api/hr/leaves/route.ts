import { NextRequest, NextResponse } from "next/server";
import { SEEDED_LEAVES, LeaveRecord } from "@/data/portalEnterpriseSeed";
import { getAuthenticatedStaffUser, getSupabaseAdminClient } from "@/lib/supabase/server";

let memoryLeaves: LeaveRecord[] = [...SEEDED_LEAVES];

export async function GET(req: NextRequest) {
  const staffUser = await getAuthenticatedStaffUser();
  if (!staffUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdminClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from("staff_leaves").select("*").order("created_at", { ascending: false });
      if (!error && Array.isArray(data) && data.length > 0) {
        return NextResponse.json({ success: true, count: data.length, leaves: data, source: "supabase" });
      }
    } catch {
      // Fallback
    }
  }

  return NextResponse.json({ success: true, count: memoryLeaves.length, leaves: memoryLeaves, source: "memory" });
}

export async function POST(req: NextRequest) {
  const staffUser = await getAuthenticatedStaffUser();
  if (!staffUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body || !body.startDate || !body.endDate) {
    return NextResponse.json({ error: "Invalid leave details" }, { status: 400 });
  }

  const leaveTypeNameMap: Record<string, string> = {
    annual: "إجازة اعتيادية سنوية",
    sick: "إجازة مرضية",
    emergency: "إجازة طارئة / استئذان",
  };

  const newLeave: LeaveRecord = {
    id: `lev_${Date.now()}`,
    staffId: body.staffId || staffUser.id || "tm_1",
    staffName: body.staffName || staffUser.name || "عضو الفريق",
    department: body.department || staffUser.department || "المشاريع",
    leaveType: body.leaveType || "annual",
    leaveTypeName: leaveTypeNameMap[body.leaveType] || "إجازة سنوية",
    startDate: body.startDate,
    endDate: body.endDate,
    daysCount: Number(body.daysCount) || 1,
    reason: body.reason || "طلب إجازة رسمي",
    status: "pending",
    createdAt: new Date().toISOString().split("T")[0],
  };

  memoryLeaves.unshift(newLeave);

  const supabase = getSupabaseAdminClient();
  if (supabase) {
    try {
      await supabase.from("staff_leaves").insert({
        staff_id: newLeave.staffId,
        leave_type: newLeave.leaveType,
        start_date: newLeave.startDate,
        end_date: newLeave.endDate,
        days_count: newLeave.daysCount,
        reason: newLeave.reason,
        status: newLeave.status,
      });
    } catch {
      // Offline fallback
    }
  }

  return NextResponse.json({ success: true, leave: newLeave });
}

export async function PATCH(req: NextRequest) {
  const staffUser = await getAuthenticatedStaffUser();
  if (!staffUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const { id, status } = body || {};

  if (!id || !["approved", "rejected"].includes(status)) {
    return NextResponse.json({ error: "Invalid update parameters" }, { status: 400 });
  }

  const idx = memoryLeaves.findIndex((l) => l.id === id);
  if (idx >= 0) {
    memoryLeaves[idx].status = status;
    memoryLeaves[idx].approvedBy = staffUser.name;
  }

  const supabase = getSupabaseAdminClient();
  if (supabase) {
    try {
      await supabase.from("staff_leaves").update({ status, approved_by: staffUser.name }).eq("id", id);
    } catch {
      // Offline fallback
    }
  }

  return NextResponse.json({ success: true, updated: memoryLeaves[idx] });
}
