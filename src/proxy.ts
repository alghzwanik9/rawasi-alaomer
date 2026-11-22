import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { getProfileByEmail, RoleId } from "@/data/portalAuth";

const VALID_ROLES: RoleId[] = [
  "super_admin",
  "sector_manager",
  "marjea_editor",
  "governance_reviewer",
];

// Route-level RBAC matrix for /dashboard/*
const ROUTE_PERMISSIONS: { prefix: string; roles: RoleId[] }[] = [
  {
    prefix: "/dashboard/leads",
    roles: [
      "super_admin",
      "sector_manager",
      "marjea_editor",
      "governance_reviewer",
    ],
  },
  {
    prefix: "/dashboard/marjea-cms",
    roles: [
      "super_admin",
      "marjea_editor",
      "governance_reviewer",
      "sector_manager",
    ],
  },
  {
    prefix: "/dashboard/team",
    roles: [
      "super_admin",
      "sector_manager",
      "marjea_editor",
      "governance_reviewer",
    ],
  },
  {
    prefix: "/dashboard",
    roles: [
      "super_admin",
      "sector_manager",
      "marjea_editor",
      "governance_reviewer",
    ],
  },
];

async function resolveStaffRole(email: string): Promise<RoleId | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && serviceKey && !serviceKey.includes("PASTE_")) {
    try {
      const admin = createClient(supabaseUrl, serviceKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
      const { data: row, error } = await admin
        .from("staff_profiles")
        .select("role_id, status")
        .ilike("email", email.trim())
        .maybeSingle();

      if (!error && row) {
        if (row.status && row.status !== "نشط") return null;
        if (VALID_ROLES.includes(row.role_id as RoleId)) {
          return row.role_id as RoleId;
        }
        return null;
      }
    } catch {
      // Fallback to seeded map if network hiccup occurs
    }
  }

  const fallback = getProfileByEmail(email);
  return fallback?.role ?? null;
}

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey || supabaseAnonKey.includes("PASTE_")) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // 1. Protect all /dashboard/* routes
  if (pathname.startsWith("/dashboard")) {
    if (!user || !user.email) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const role = await resolveStaffRole(user.email);
    if (!role) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("error", "unauthorized_staff");
      return NextResponse.redirect(loginUrl);
    }

    // Check route-level RBAC permission
    const matchedRule = ROUTE_PERMISSIONS.find((r) =>
      pathname.startsWith(r.prefix)
    );
    if (matchedRule && !matchedRule.roles.includes(role)) {
      const dashUrl = new URL("/dashboard", request.url);
      dashUrl.searchParams.set("denied", pathname);
      return NextResponse.redirect(dashUrl);
    }

    response.headers.set("x-staff-role", role);
    response.headers.set("x-staff-email", user.email);
    return response;
  }

  // 2. If already logged in as active staff and visiting /login (without ?switch=1), redirect to /dashboard
  if (pathname === "/login" && user?.email) {
    const wantsSwitch = request.nextUrl.searchParams.get("switch") === "1";
    if (!wantsSwitch) {
      const role = await resolveStaffRole(user.email);
      if (role) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
