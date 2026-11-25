import { NextRequest, NextResponse } from "next/server";
import { SEEDED_INITIATIVES, InitiativeRecord } from "@/data/portalEnterpriseSeed";
import { getAuthenticatedStaffUser, getSupabaseAdminClient } from "@/lib/supabase/server";

let memoryInitiatives: InitiativeRecord[] = [...SEEDED_INITIATIVES];

export async function GET(req: NextRequest) {
  const supabase = getSupabaseAdminClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from("initiatives").select("*").order("created_at", { ascending: false });
      if (!error && Array.isArray(data) && data.length > 0) {
        return NextResponse.json({ success: true, count: data.length, initiatives: data, source: "supabase" });
      }
    } catch {
      // Fallback
    }
  }

  return NextResponse.json({ success: true, count: memoryInitiatives.length, initiatives: memoryInitiatives, source: "memory" });
}

export async function POST(req: NextRequest) {
  const staffUser = await getAuthenticatedStaffUser();
  if (!staffUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body || !body.title || !body.partnerName) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const milestones = Array.isArray(body.milestones)
    ? body.milestones
    : [
        { title: "التشخيص وحصر الاحتياج", completed: true },
        { title: "التخطيط والتنفيذ الميداني", completed: false },
        { title: "قياس الأثر وإصدار التقرير", completed: false },
      ];

  const newInitiative: InitiativeRecord = {
    id: `ini_${Date.now()}`,
    title: body.title,
    partnerName: body.partnerName,
    sector: body.sector || "الحوكمة والتمكين",
    targetBeneficiaries: Number(body.targetBeneficiaries) || 20,
    achievedBeneficiaries: Number(body.achievedBeneficiaries) || 0,
    progressPct: Number(body.progressPct) || 10,
    sroiScore: body.sroiScore || "1 : 3.5 ر.س أثر اجتماعي",
    status: body.status || "active",
    budget: body.budget || "500,000 ريال",
    milestones,
  };

  memoryInitiatives.unshift(newInitiative);

  const supabase = getSupabaseAdminClient();
  if (supabase) {
    try {
      await supabase.from("initiatives").insert({
        title: newInitiative.title,
        partner_name: newInitiative.partnerName,
        sector: newInitiative.sector,
        target_beneficiaries: newInitiative.targetBeneficiaries,
        achieved_beneficiaries: newInitiative.achievedBeneficiaries,
        progress_pct: newInitiative.progressPct,
        sroi_score: newInitiative.sroiScore,
        status: newInitiative.status,
      });
    } catch {
      // Offline fallback
    }
  }

  return NextResponse.json({ success: true, initiative: newInitiative });
}

export async function PATCH(req: NextRequest) {
  const staffUser = await getAuthenticatedStaffUser();
  if (!staffUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const { id, milestoneIdx, progressPct, status } = body || {};

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const idx = memoryInitiatives.findIndex((i) => i.id === id);
  if (idx >= 0) {
    if (milestoneIdx !== undefined && memoryInitiatives[idx].milestones[milestoneIdx]) {
      const current = memoryInitiatives[idx].milestones[milestoneIdx].completed;
      memoryInitiatives[idx].milestones[milestoneIdx].completed = !current;
      // Re-calculate progress
      const completedCount = memoryInitiatives[idx].milestones.filter((m) => m.completed).length;
      memoryInitiatives[idx].progressPct = Math.round((completedCount / memoryInitiatives[idx].milestones.length) * 100);
    }
    if (progressPct !== undefined) memoryInitiatives[idx].progressPct = progressPct;
    if (status) memoryInitiatives[idx].status = status;
  }

  return NextResponse.json({ success: true, updated: memoryInitiatives[idx] });
}
