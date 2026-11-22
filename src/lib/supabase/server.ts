import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import {
  getProfileByEmail,
  mapStaffRowToUserProfile,
  RoleId,
  UserProfile,
} from "@/data/portalAuth";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const VALID_ROLES: RoleId[] = [
  "super_admin",
  "sector_manager",
  "marjea_editor",
  "governance_reviewer",
];

export function isSupabaseServerConfigured(): boolean {
  if (!supabaseUrl) return false;
  const key = supabaseServiceRoleKey || supabaseAnonKey;
  if (!key) return false;
  if (
    key.includes("PASTE_") ||
    key === "your_supabase_anon_key_here" ||
    key === "your_supabase_service_role_key_here"
  ) {
    return false;
  }
  return true;
}

/**
 * Returns a Supabase admin client using the service_role key (bypasses RLS),
 * or anon key if service_role is not available.
 * Returns null if Supabase is not configured or keys are placeholders.
 */
export function getSupabaseAdminClient(): SupabaseClient | null {
  if (!isSupabaseServerConfigured()) {
    return null;
  }

  const key =
    supabaseServiceRoleKey && !supabaseServiceRoleKey.includes("PASTE_")
      ? supabaseServiceRoleKey
      : supabaseAnonKey!;

  return createClient(supabaseUrl!, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * Returns a request-scoped Supabase Server Client using `@supabase/ssr` and Next.js cookies.
 */
export async function getSupabaseServerClient() {
  if (!supabaseUrl || !supabaseAnonKey || supabaseAnonKey.includes("PASTE_")) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from a Server Component where setting cookies is a no-op
        }
      },
    },
  });
}

/**
 * Resolves a staff profile from `public.staff_profiles` by email.
 */
export async function getStaffProfileByEmail(
  email: string
): Promise<UserProfile | null> {
  const normalizedEmail = email.trim().toLowerCase();
  const admin = getSupabaseAdminClient();

  if (admin) {
    const { data: row, error } = await admin
      .from("staff_profiles")
      .select("*")
      .ilike("email", normalizedEmail)
      .maybeSingle();

    if (!error && row) {
      if (row.status && row.status !== "نشط") {
        return null;
      }
      if (!VALID_ROLES.includes(row.role_id as RoleId)) {
        return null;
      }
      return mapStaffRowToUserProfile(row);
    }
  }

  return getProfileByEmail(normalizedEmail);
}

/**
 * Verifies the current request's Supabase Auth session cookie and resolves
 * the staff member's RBAC role from `public.staff_profiles`.
 */
export async function getAuthenticatedStaffUser(): Promise<UserProfile | null> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return null;

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user || !user.email) {
    return null;
  }

  return getStaffProfileByEmail(user.email);
}
