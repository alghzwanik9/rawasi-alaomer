import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const templateId = body.templateId;
    const filename = body.filename;

    if (!templateId) {
      return NextResponse.json(
        { error: "Missing templateId" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdminClient();
    let downloadCount = 1;

    if (supabase) {
      // 1. Try atomic RPC increment
      const { data, error } = await supabase.rpc(
        "increment_template_download",
        {
          template_id: templateId,
        }
      );

      if (!error && typeof data === "number") {
        downloadCount = data;
      } else {
        // Fallback: direct update
        const { data: row } = await supabase
          .from("procedure_templates")
          .select("download_count")
          .eq("id", templateId)
          .single();

        const current = (row?.download_count as number) || 0;
        downloadCount = current + 1;

        await supabase
          .from("procedure_templates")
          .update({ download_count: downloadCount })
          .eq("id", templateId);
      }
    }

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      "https://qghyfyktqibycanncbkk.supabase.co";
    const downloadUrl = filename
      ? `${supabaseUrl}/storage/v1/object/public/marjea-templates/${filename}`
      : undefined;

    return NextResponse.json({
      success: true,
      templateId,
      downloadCount,
      downloadUrl,
    });
  } catch (err) {
    console.error("Failed to increment template download:", err);
    return NextResponse.json(
      { success: false, error: String(err) },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const templateId = req.nextUrl.searchParams.get("templateId");
  const procedureId = req.nextUrl.searchParams.get("procedureId");
  const supabase = getSupabaseAdminClient();

  if (supabase) {
    if (templateId) {
      const { data } = await supabase
        .from("procedure_templates")
        .select("id, download_count, download_url")
        .eq("id", templateId)
        .single();

      return NextResponse.json({
        success: true,
        template: data,
      });
    }

    let query = supabase
      .from("procedure_templates")
      .select("id, download_count, download_url");
    if (procedureId) {
      query = query.eq("procedure_id", procedureId);
    }
    const { data } = await query;

    return NextResponse.json({
      success: true,
      templates: data || [],
    });
  }

  return NextResponse.json({ success: true, templates: [] });
}
