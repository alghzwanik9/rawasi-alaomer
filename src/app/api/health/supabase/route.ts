import { NextResponse } from "next/server";
import { getSupabaseAdminClient, isSupabaseServerConfigured } from "@/lib/supabase/server";

export async function GET() {
  const configured = isSupabaseServerConfigured();

  if (!configured) {
    return NextResponse.json({
      connected: false,
      mode: "local_fallback",
      message: "مفاتيح Supabase غير مكتملة أو تحتوي على قيم افتراضية. المنصة تعمل حالياً بأمان عبر التخزين المحلي (Local JSON Fallback).",
      projectUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || null,
      timestamp: new Date().toISOString(),
    });
  }

  const client = getSupabaseAdminClient();
  if (!client) {
    return NextResponse.json(
      {
        connected: false,
        mode: "local_fallback",
        message: "تعذر إنشاء عميل Supabase.",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }

  try {
    // Attempt querying inquiries table to verify database connection and schema
    // Note: HEAD requests (head: true) swallow the error body on 404, so a
    // missing table would look "connected". Use a real GET with limit(1).
    const { count: inquiriesCount, error: inquiriesError } = await client
      .from("inquiries")
      .select("id", { count: "exact" })
      .limit(1);

    if (inquiriesError) {
      return NextResponse.json(
        {
          connected: false,
          mode: "error",
          message: `فشل الاتصال بقاعدة البيانات: ${inquiriesError.message}`,
          code: inquiriesError.code,
          hint: "يرجى التأكد من تشغيل ملف supabase/schema.sql داخل SQL Editor في لوحة تحكم Supabase.",
          timestamp: new Date().toISOString(),
        },
        { status: 502 }
      );
    }

    // Also check marjea_procedures count if available
    const { count: proceduresCount } = await client
      .from("marjea_procedures")
      .select("id", { count: "exact" })
      .limit(1);

    return NextResponse.json({
      connected: true,
      mode: "supabase",
      message: "تم الاتصال بنجاح بقاعدة بيانات Supabase السحابية الحية (Live).",
      projectUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      stats: {
        inquiriesCount: inquiriesCount ?? 0,
        proceduresCount: proceduresCount ?? 0,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      {
        connected: false,
        mode: "error",
        message: `خطأ أثناء فحص اتصال Supabase: ${errorMessage}`,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
