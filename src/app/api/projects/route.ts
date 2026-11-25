import { NextRequest, NextResponse } from "next/server";
import { SEEDED_PORTFOLIO_PROJECTS, PortfolioProject } from "@/data/portalEnterpriseSeed";
import { getAuthenticatedStaffUser, getSupabaseAdminClient } from "@/lib/supabase/server";

let memoryProjects: PortfolioProject[] = [...SEEDED_PORTFOLIO_PROJECTS];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sector = searchParams.get("sector");

  const supabase = getSupabaseAdminClient();
  if (supabase) {
    try {
      let query = supabase.from("portfolio_projects").select("*").order("completion_date", { ascending: false });
      if (sector && sector !== "all") {
        query = query.eq("sector_slug", sector);
      }
      const { data, error } = await query;
      if (!error && Array.isArray(data) && data.length > 0) {
        return NextResponse.json({ success: true, count: data.length, projects: data, source: "supabase" });
      }
    } catch {
      // Fallback
    }
  }

  let filtered = [...memoryProjects];
  if (sector && sector !== "all") {
    filtered = filtered.filter((p) => p.sectorSlug === sector);
  }

  return NextResponse.json({ success: true, count: filtered.length, projects: filtered, source: "memory" });
}

export async function POST(req: NextRequest) {
  const staffUser = await getAuthenticatedStaffUser();
  if (!staffUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body || !body.title || !body.clientName) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const sectorNameMap: Record<string, string> = {
    contracting: "المقاولات والتطوير الإنشائي",
    supply: "التجهيز والتوريد المتكامل",
    tech: "التقنية والحلول الذكية",
    operations: "التشغيل والصيانة وإدارة المرافق",
    community: "التنمية المجتمعية وتمكين القطاع غير الربحي",
  };

  const newProject: PortfolioProject = {
    id: `prj_${Date.now()}`,
    title: body.title,
    sectorSlug: body.sectorSlug || "contracting",
    sectorName: sectorNameMap[body.sectorSlug] || "المقاولات والتطوير الإنشائي",
    clientName: body.clientName,
    city: body.city || "الرياض",
    budgetRange: body.budgetRange || "حسب الدراسة الهندسية",
    summary: body.summary || "مشروع تسليم مفتاح متكامل بإشراف هندسي وتنفيذي من رواسي العمر.",
    scope: Array.isArray(body.scope) && body.scope.length > 0 ? body.scope : ["دراسة وتخطيط هندسي", "تنفيذ ميداني", "تسليم وضمانات"],
    beforeImage: body.beforeImage || "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
    afterImage: body.afterImage || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    status: body.status || "completed",
    isPublished: body.isPublished ?? true,
    completionDate: body.completionDate || new Date().toISOString().split("T")[0],
  };

  memoryProjects.unshift(newProject);

  const supabase = getSupabaseAdminClient();
  if (supabase) {
    try {
      await supabase.from("portfolio_projects").insert({
        id: newProject.id,
        title: newProject.title,
        sector_slug: newProject.sectorSlug,
        client_name: newProject.clientName,
        city: newProject.city,
        budget_range: newProject.budgetRange,
        summary: newProject.summary,
        scope: newProject.scope,
        before_image_url: newProject.beforeImage,
        after_image_url: newProject.afterImage,
        status: newProject.status,
        is_published: newProject.isPublished,
      });
    } catch {
      // Offline fallback
    }
  }

  return NextResponse.json({ success: true, project: newProject });
}

export async function PATCH(req: NextRequest) {
  const staffUser = await getAuthenticatedStaffUser();
  if (!staffUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const { id, isPublished, status } = body || {};

  if (!id) {
    return NextResponse.json({ error: "Project ID required" }, { status: 400 });
  }

  const idx = memoryProjects.findIndex((p) => p.id === id);
  if (idx >= 0) {
    if (isPublished !== undefined) memoryProjects[idx].isPublished = isPublished;
    if (status) memoryProjects[idx].status = status;
  }

  const supabase = getSupabaseAdminClient();
  if (supabase) {
    try {
      const updates: any = {};
      if (isPublished !== undefined) updates.is_published = isPublished;
      if (status) updates.status = status;
      await supabase.from("portfolio_projects").update(updates).eq("id", id);
    } catch {
      // Offline fallback
    }
  }

  return NextResponse.json({ success: true, updated: memoryProjects[idx] });
}
