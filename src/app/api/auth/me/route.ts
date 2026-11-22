import { NextResponse } from "next/server";
import { getAuthenticatedStaffUser } from "@/lib/supabase/server";

export async function GET() {
  const staffUser = await getAuthenticatedStaffUser();

  if (!staffUser) {
    return NextResponse.json(
      {
        authenticated: false,
        user: null,
        error: "غير مصرح. يرجى تسجيل الدخول بحساب موظف معتمد.",
      },
      { status: 401 }
    );
  }

  return NextResponse.json({
    authenticated: true,
    user: staffUser,
  });
}
