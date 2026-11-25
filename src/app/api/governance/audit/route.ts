import { NextRequest, NextResponse } from "next/server";
import { SEEDED_AUDIT_LOGS, AuditLogRecord } from "@/data/portalEnterpriseSeed";
import { getAuthenticatedStaffUser, getSupabaseAdminClient } from "@/lib/supabase/server";

let memoryAuditLogs: AuditLogRecord[] = [...SEEDED_AUDIT_LOGS];

export async function GET(req: NextRequest) {
  const staffUser = await getAuthenticatedStaffUser();
  if (!staffUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdminClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from("audit_logs").select("*").order("created_at", { ascending: false });
      if (!error && Array.isArray(data) && data.length > 0) {
        return NextResponse.json({ success: true, count: data.length, logs: data, source: "supabase" });
      }
    } catch {
      // Fallback
    }
  }

  return NextResponse.json({ success: true, count: memoryAuditLogs.length, logs: memoryAuditLogs, source: "memory" });
}

export async function POST(req: NextRequest) {
  const staffUser = await getAuthenticatedStaffUser();
  if (!staffUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body || !body.actionType || !body.details) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const newLog: AuditLogRecord = {
    id: `aud_${Date.now()}`,
    actorName: staffUser.name,
    actorRole: staffUser.role,
    actionType: body.actionType,
    entityType: body.entityType || "النظام",
    entityId: body.entityId || "SYS",
    details: body.details,
    timestamp: new Date().toLocaleString("ar-SA"),
  };

  memoryAuditLogs.unshift(newLog);

  const supabase = getSupabaseAdminClient();
  if (supabase) {
    try {
      await supabase.from("audit_logs").insert({
        actor_name: newLog.actorName,
        actor_role: newLog.actorRole,
        action_type: newLog.actionType,
        entity_type: newLog.entityType,
        entity_id: newLog.entityId,
        details: newLog.details,
      });
    } catch {
      // Offline fallback
    }
  }

  return NextResponse.json({ success: true, log: newLog });
}
