import { NextRequest, NextResponse } from "next/server";
import {
  getAuthenticatedStaffUser,
  getSupabaseAdminClient,
} from "@/lib/supabase/server";
import { SEEDED_CMS_ITEMS, MarjeaCmsItem } from "@/data/portalSeed";

function mapRowToCmsItem(row: Record<string, unknown>): MarjeaCmsItem {
  const dataObj = (row.data as Record<string, unknown>) || {};
  const updatedRaw = String(row.updated_at || row.created_at || "");
  const dateStr = updatedRaw ? updatedRaw.slice(0, 10) : "2026-11-22";

  return {
    id: String(row.id),
    code: String(row.code || "GOV-NEW-00"),
    title: String(row.title || ""),
    category: String(row.category || "الحوكمة واللوائح"),
    status: (row.status as "draft" | "in_review" | "published") || "draft",
    makerName: String(row.maker_name || "أ. نورة القحطاني"),
    checkerName: row.checker_name ? String(row.checker_name) : undefined,
    lastModified: String(dataObj.lastModifiedLabel || row.last_updated || dateStr),
    version: String(dataObj.version || "v2.4 (معتمد)"),
    notes: dataObj.cmsNotes
      ? String(dataObj.cmsNotes)
      : row.short_summary
      ? String(row.short_summary)
      : undefined,
  };
}

export async function GET(req: NextRequest) {
  const publishedOnly =
    req.nextUrl.searchParams.get("publishedOnly") === "1";

  const supabase = getSupabaseAdminClient();
  if (supabase) {
    try {
      let query = supabase
        .from("marjea_procedures")
        .select("*")
        .order("created_at", { ascending: true });

      if (publishedOnly) {
        query = query.eq("status", "published");
      }

      const { data, error } = await query;
      if (!error && Array.isArray(data) && data.length > 0) {
        return NextResponse.json({
          success: true,
          count: data.length,
          items: data.map(mapRowToCmsItem),
          rawProcedures: data,
          source: "supabase",
        });
      }
    } catch (err) {
      console.warn("Failed to load marjea_procedures from Supabase:", err);
    }
  }

  const fallback = publishedOnly
    ? SEEDED_CMS_ITEMS.filter((i) => i.status === "published")
    : SEEDED_CMS_ITEMS;

  return NextResponse.json({
    success: true,
    count: fallback.length,
    items: fallback,
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

    if (
      staffUser.role !== "marjea_editor" &&
      staffUser.role !== "super_admin"
    ) {
      return NextResponse.json(
        {
          error:
            "صلاحية إنشاء مسودات الأدلة الإجرائية محصورة بصانع المعرفة (Maker) والمدير العام فقط.",
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      code = `GOV-DRF-${Math.floor(10 + Math.random() * 89)}`,
      title,
      category = "الحوكمة واللوائح",
      categoryId = "governance",
      notes = "",
    } = body as {
      code?: string;
      title?: string;
      category?: string;
      categoryId?: string;
      notes?: string;
    };

    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: "عنوان الدليل الإجرائي مطلوب." },
        { status: 400 }
      );
    }

    const slug = `guide-${Date.now().toString(36)}`;
    const id = slug;

    const supabase = getSupabaseAdminClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "قاعدة بيانات Supabase غير متصلة." },
        { status: 500 }
      );
    }

    const { data: inserted, error } = await supabase
      .from("marjea_procedures")
      .insert({
        id,
        slug,
        code: code.trim().toUpperCase(),
        title: title.trim(),
        category,
        category_id: categoryId,
        expected_time: "5 - 10 أيام عمل",
        authority: "المركز الوطني لتنمية القطاع غير الربحي",
        last_updated: "اليوم (مسودة تحرير جديدة)",
        short_summary: notes || title.trim(),
        full_description: notes || title.trim(),
        quick_action_label: title.trim().slice(0, 25),
        status: "draft",
        maker_name: staffUser.name,
        checker_name: null,
        data: {
          version: "v1.0 (مسودة تحرير)",
          cmsNotes: notes || "مسودة أولية قيد الإعداد بواسطة فريق المعرفة.",
          lastModifiedLabel: "الآن (مسودة جديدة)",
        },
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json(
        { error: `تعذر حفظ المسودة في قاعدة البيانات: ${error.message}` },
        { status: 502 }
      );
    }

    // Record workflow & compliance audit logs
    await supabase.from("cms_workflow_logs").insert({
      procedure_id: id,
      action: "draft_created",
      performed_by: staffUser.name,
      role_id: staffUser.role,
      notes: `إنشاء مسودة دليل إجرائي جديد: ${title.trim()}`,
    });

    await supabase.from("audit_logs").insert({
      user_email: staffUser.email,
      action: "CMS_DRAFT_CREATED",
      resource_type: "marjea_procedures",
      resource_id: id,
      details: { code, title: title.trim(), role: staffUser.role },
    });

    return NextResponse.json({
      success: true,
      item: mapRowToCmsItem(inserted),
      source: "supabase",
    });
  } catch (err) {
    console.error("Error creating Marjea draft:", err);
    return NextResponse.json(
      { error: "حدث خطأ أثناء إنشاء مسودة الدليل." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const staffUser = await getAuthenticatedStaffUser();
    if (!staffUser) {
      return NextResponse.json(
        { error: "غير مصرح. يرجى تسجيل الدخول." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { id, action, notes } = body as {
      id?: string;
      action?: "submit_for_review" | "approve_publish" | "return_to_draft";
      notes?: string;
    };

    if (!id || !action) {
      return NextResponse.json(
        { error: "معرف الإجراء ونوع العملية مطلوبان." },
        { status: 400 }
      );
    }

    if (
      action === "submit_for_review" &&
      staffUser.role !== "marjea_editor" &&
      staffUser.role !== "super_admin"
    ) {
      return NextResponse.json(
        {
          error:
            "صلاحية رفع المسودات للمراجعة محصورة بصانع المعرفة (Maker) أو المدير العام.",
        },
        { status: 403 }
      );
    }

    if (
      (action === "approve_publish" || action === "return_to_draft") &&
      staffUser.role !== "governance_reviewer" &&
      staffUser.role !== "super_admin"
    ) {
      return NextResponse.json(
        {
          error:
            "حوكمة الاعتماد (Checker): لا يملك صلاحية اعتماد النشر أو رد المسودة إلا مراجع الحوكمة أو المدير العام.",
        },
        { status: 403 }
      );
    }

    const supabase = getSupabaseAdminClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "قاعدة بيانات Supabase غير متصلة." },
        { status: 500 }
      );
    }

    const { data: existing } = await supabase
      .from("marjea_procedures")
      .select("*")
      .or(`id.eq.${id},code.eq.${id}`)
      .maybeSingle();

    if (!existing) {
      return NextResponse.json(
        { error: "لم يتم العثور على الدليل الإجرائي المطلوب." },
        { status: 404 }
      );
    }

    const prevData = (existing.data as Record<string, unknown>) || {};
    let nextStatus: "draft" | "in_review" | "published" = existing.status;
    let lastUpdated = existing.last_updated;
    let checkerName = existing.checker_name;
    let cmsNotes = notes || prevData.cmsNotes;

    if (action === "submit_for_review") {
      nextStatus = "in_review";
      lastUpdated = "اليوم (مرفوع للمراجعة النظامية)";
      cmsNotes =
        notes || "تم رفع المسودة إلى مراجع الحوكمة للتدقيق والاعتماد النظامي.";
    } else if (action === "approve_publish") {
      nextStatus = "published";
      checkerName = staffUser.name;
      lastUpdated = "اليوم (معتمد ومنشور رسمياً)";
      cmsNotes =
        notes ||
        `تمت المصادقة والاعتماد النظامي للنشر بواسطة ${staffUser.name}.`;
    } else if (action === "return_to_draft") {
      nextStatus = "draft";
      checkerName = staffUser.name;
      lastUpdated = "اليوم (معاد للتحرير)";
      cmsNotes =
        notes || `أُعيدت المسودة إلى المحرر لاستكمال الملاحظات النظامية.`;
    }

    const { data: updated, error } = await supabase
      .from("marjea_procedures")
      .update({
        status: nextStatus,
        last_updated: lastUpdated,
        checker_name: checkerName,
        updated_at: new Date().toISOString(),
        data: {
          ...prevData,
          cmsNotes,
          lastModifiedLabel: lastUpdated,
        },
      })
      .eq("id", existing.id)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json(
        { error: `فشل تحديث حالة الدليل في Supabase: ${error.message}` },
        { status: 502 }
      );
    }

    await supabase.from("cms_workflow_logs").insert({
      procedure_id: existing.id,
      action,
      performed_by: staffUser.name,
      role_id: staffUser.role,
      notes: String(cmsNotes || ""),
    });

    await supabase.from("audit_logs").insert({
      user_email: staffUser.email,
      action: `CMS_${action.toUpperCase()}`,
      resource_type: "marjea_procedures",
      resource_id: existing.id,
      details: {
        code: existing.code,
        from_status: existing.status,
        to_status: nextStatus,
        actor: staffUser.name,
      },
    });

    return NextResponse.json({
      success: true,
      item: mapRowToCmsItem(updated),
      source: "supabase",
    });
  } catch (err) {
    console.error("Error updating Marjea workflow:", err);
    return NextResponse.json(
      { error: "حدث خطأ أثناء تحديث حالة الاعتماد." },
      { status: 500 }
    );
  }
}
