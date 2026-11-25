import { NextRequest, NextResponse } from "next/server";
import { SEEDED_ATTENDANCE, AttendanceRecord } from "@/data/portalEnterpriseSeed";
import { getAuthenticatedStaffUser, getSupabaseAdminClient } from "@/lib/supabase/server";

// In-memory store for fallback
let memoryAttendance: AttendanceRecord[] = [...SEEDED_ATTENDANCE];

export async function GET(req: NextRequest) {
  const staffUser = await getAuthenticatedStaffUser();
  if (!staffUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const dateFilter = searchParams.get("date");
  const staffFilter = searchParams.get("staffId");

  const supabase = getSupabaseAdminClient();
  if (supabase) {
    try {
      let query = supabase.from("staff_attendance").select("*").order("date", { ascending: false });
      if (dateFilter) query = query.eq("date", dateFilter);
      if (staffFilter) query = query.eq("staff_id", staffFilter);
      const { data, error } = await query;
      if (!error && Array.isArray(data) && data.length > 0) {
        return NextResponse.json({ success: true, count: data.length, records: data, source: "supabase" });
      }
    } catch {
      // Fallback
    }
  }

  let filtered = [...memoryAttendance];
  if (dateFilter) filtered = filtered.filter((r) => r.date === dateFilter);
  if (staffFilter) filtered = filtered.filter((r) => r.staffId === staffFilter);

  return NextResponse.json({ success: true, count: filtered.length, records: filtered, source: "memory" });
}

export async function POST(req: NextRequest) {
  const staffUser = await getAuthenticatedStaffUser();
  if (!staffUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const now = new Date();
  const timeStr = now.toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" });
  const todayStr = now.toISOString().split("T")[0];

  const action = body.action || "check_in"; // 'check_in' or 'check_out'
  const staffId = body.staffId || staffUser.id || "tm_1";
  const staffName = body.staffName || staffUser.name || "عضو الفريق";
  const department = body.department || staffUser.department || "المشاريع";

  const existingIdx = memoryAttendance.findIndex(
    (a) => a.staffId === staffId && a.date === todayStr
  );

  let record: AttendanceRecord;

  if (action === "check_out" && existingIdx >= 0) {
    record = {
      ...memoryAttendance[existingIdx],
      checkOut: timeStr,
      totalHours: 8.0,
      notes: body.notes || memoryAttendance[existingIdx].notes || "تم تسجيل الانصراف في الموعد",
    };
    memoryAttendance[existingIdx] = record;
  } else {
    record = {
      id: `att_${Date.now()}`,
      staffId,
      staffName,
      department,
      date: todayStr,
      checkIn: timeStr,
      status: now.getHours() >= 9 ? "late" : "present",
      notes: body.notes || (now.getHours() >= 9 ? "تأخر عن موعد الحضور الرسمي" : "حضور منتظم"),
    };
    memoryAttendance.unshift(record);
  }

  const supabase = getSupabaseAdminClient();
  if (supabase) {
    try {
      await supabase.from("staff_attendance").upsert({
        staff_id: record.staffId,
        date: record.date,
        check_in_time: record.checkIn,
        check_out_time: record.checkOut,
        total_hours: record.totalHours,
        status: record.status,
        notes: record.notes,
      });
    } catch {
      // Ignored for offline
    }
  }

  return NextResponse.json({ success: true, record });
}
