import { NextRequest, NextResponse } from "next/server";
import {
  getAuthenticatedStaffUser,
  getSupabaseAdminClient,
} from "@/lib/supabase/server";
import { DEMO_STAFF_PASSWORD, RoleId } from "@/data/portalAuth";
import { SEEDED_TEAM_MEMBERS, TeamMember } from "@/data/portalSeed";

const ROLE_TITLES: Record<RoleId, string> = {
  super_admin: "المدير العام والشريك المؤسس",
  sector_manager: "مدير قطاع / مبيعات",
  marjea_editor: "أخصائي التحرير والمعرفة (Maker)",
  governance_reviewer: "مستشار ومراجع الحوكمة (Checker)",
};

const ROLE_SCOPES: Record<RoleId, string> = {
  super_admin: "صلاحيات كاملة شاملة لكافة القطاعات واللوحات",
  sector_manager: "إدارة طلبات المشاريع المسندة إليه أو التابعة لقطاعه فقط",
  marjea_editor: "صانع المعرفة (Maker): إنشاء وتعديل مسودات الأدلة والنماذج",
  governance_reviewer:
    "مراجع معتمد (Checker): مراجعة واعتماد نشر الأدلة ونماذج اللوائح",
};

function mapStaffRowToTeamMember(row: Record<string, unknown>): TeamMember {
  const roleId = String(row.role_id || "sector_manager") as RoleId;
  return {
    id: String(row.id),
    name: String(row.name || ""),
    email: String(row.email || ""),
    role: String(row.role_title || ROLE_TITLES[roleId] || roleId),
    roleId,
    department: String(row.department || "الإدارة التنفيذية"),
    status: (row.status as "نشط" | "في إجازة") || "نشط",
    accessScope: String(row.access_scope || ROLE_SCOPES[roleId] || ""),
    lastLogin: "مفعل في Supabase Auth",
  };
}

export async function GET() {
  const staffUser = await getAuthenticatedStaffUser();
  if (!staffUser) {
    return NextResponse.json(
      { error: "غير مصرح. يرجى تسجيل الدخول." },
      { status: 401 }
    );
  }

  const supabase = getSupabaseAdminClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("staff_profiles")
      .select("*")
      .order("created_at", { ascending: true });

    if (!error && Array.isArray(data) && data.length > 0) {
      return NextResponse.json({
        success: true,
        count: data.length,
        members: data.map(mapStaffRowToTeamMember),
        source: "supabase",
      });
    }
  }

  return NextResponse.json({
    success: true,
    count: SEEDED_TEAM_MEMBERS.length,
    members: SEEDED_TEAM_MEMBERS,
    source: "local_fallback",
  });
}

export async function POST(req: NextRequest) {
  try {
    const staffUser = await getAuthenticatedStaffUser();
    if (!staffUser) {
      return NextResponse.json(
        { error: "غير مصرح. يرجى تسجيل الدخول." },
        { status: 401 }
      );
    }

    if (staffUser.role !== "super_admin") {
      return NextResponse.json(
        {
          error:
            "إضافة أعضاء جدد للفريق وتحديد الأدوار محصورة بصلاحية المدير العام (super_admin) فقط.",
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      name,
      email,
      roleId = "sector_manager",
      department = "المشاريع والتطوير",
      sector = null,
    } = body as {
      name?: string;
      email?: string;
      roleId?: RoleId;
      department?: string;
      sector?: string | null;
    };

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json(
        { error: "الاسم والبريد الإلكتروني المهني مطلوبان." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdminClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "قاعدة بيانات Supabase غير متصلة." },
        { status: 500 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const id = `usr_${Date.now().toString(36)}`;
    const roleTitle = ROLE_TITLES[roleId] || ROLE_TITLES.sector_manager;
    const accessScope = ROLE_SCOPES[roleId] || ROLE_SCOPES.sector_manager;

    // 1. Insert or update in public.staff_profiles
    const { data: inserted, error } = await supabase
      .from("staff_profiles")
      .upsert(
        {
          id,
          name: name.trim(),
          email: normalizedEmail,
          role_id: roleId,
          role_title: roleTitle,
          department: department.trim(),
          sector:
            sector || (roleId === "sector_manager" ? "contracting" : null),
          status: "نشط",
          access_scope: accessScope,
        },
        { onConflict: "email" }
      )
      .select("*")
      .single();

    if (error) {
      return NextResponse.json(
        { error: `تعذر حفظ عضو الفريق في قاعدة البيانات: ${error.message}` },
        { status: 502 }
      );
    }

    // 2. Provision account in Supabase Auth so they can sign in immediately
    await supabase.auth.admin
      .createUser({
        email: normalizedEmail,
        password: DEMO_STAFF_PASSWORD,
        email_confirm: true,
        user_metadata: {
          name: name.trim(),
          role_id: roleId,
          role_title: roleTitle,
          department: department.trim(),
        },
      })
      .catch(() => {
        // Ignore if Auth account already exists
      });

    // 3. Log in audit_logs
    await supabase.from("audit_logs").insert({
      user_email: staffUser.email,
      action: "STAFF_MEMBER_CREATED",
      resource_type: "staff_profiles",
      resource_id: inserted.id,
      details: {
        name: name.trim(),
        email: normalizedEmail,
        role_id: roleId,
        department: department.trim(),
      },
    });

    return NextResponse.json({
      success: true,
      member: mapStaffRowToTeamMember(inserted),
      source: "supabase",
    });
  } catch (err) {
    console.error("Error adding staff member:", err);
    return NextResponse.json(
      { error: "حدث خطأ أثناء إضافة عضو الفريق." },
      { status: 500 }
    );
  }
}
