import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export type RoleId =
  | "super_admin"
  | "sector_manager"
  | "marjea_editor"
  | "governance_reviewer";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: RoleId;
  roleTitle: string;
  avatarInitials: string;
  department: string;
  sector?: string;
  badgeColor: string;
}

export const DEMO_STAFF_PASSWORD =
  process.env.NEXT_PUBLIC_DEMO_STAFF_PASSWORD || "Rawasi@2026!";

export const ROLE_BADGE_COLORS: Record<RoleId, string> = {
  super_admin: "bg-[#163063] text-white",
  sector_manager: "bg-[#2360A5] text-white",
  marjea_editor: "bg-[#3488C4] text-white",
  governance_reviewer: "bg-[#47A3B8] text-white",
};

export const ROLE_INITIALS: Record<RoleId, string> = {
  super_admin: "ع.س",
  sector_manager: "ف.ح",
  marjea_editor: "ن.ق",
  governance_reviewer: "ع.غ",
};

export const DEMO_USERS: Record<RoleId, UserProfile> = {
  super_admin: {
    id: "usr_ceo",
    name: "م. عبد العزيز بن سلطان",
    email: "ceo@rawasialomar.sa",
    role: "super_admin",
    roleTitle: "المدير العام والشريك المؤسس",
    avatarInitials: "ع.س",
    department: "الإدارة التنفيذية العليا",
    badgeColor: "bg-[#163063] text-white",
  },
  sector_manager: {
    id: "usr_mgr",
    name: "أ. فيصل بن خالد الحربي",
    email: "f.harbi@rawasialomar.sa",
    role: "sector_manager",
    roleTitle: "مدير قطاع المقاولات والتطوير",
    avatarInitials: "ف.ح",
    department: "إدارة المشاريع والتطوير الإنشائي",
    sector: "contracting",
    badgeColor: "bg-[#2360A5] text-white",
  },
  marjea_editor: {
    id: "usr_editor",
    name: "أ. نورة بنت فهد القحطاني",
    email: "n.qahtani@rawasialomar.sa",
    role: "marjea_editor",
    roleTitle: "أخصائي التحرير والمعرفة غير الربحية",
    avatarInitials: "ن.ق",
    department: "مركز المعرفة والتوثيق الإجرائي",
    badgeColor: "bg-[#3488C4] text-white",
  },
  governance_reviewer: {
    id: "usr_reviewer",
    name: "د. عبد الله بن صالح الغامدي",
    email: "a.ghamdi@rawasialomar.sa",
    role: "governance_reviewer",
    roleTitle: "مستشار الحوكمة والرقابة النظامية",
    avatarInitials: "ع.غ",
    department: "إدارة الامتثال والاستشارات الشرعية والنظامية",
    badgeColor: "bg-[#47A3B8] text-white",
  },
};

const STORAGE_KEY = "rao_current_user_role";
const PROFILE_STORAGE_KEY = "rao_current_user_profile";

export function getProfileByEmail(email?: string | null): UserProfile | null {
  if (!email) return null;
  const normalized = email.trim().toLowerCase();
  const found = Object.values(DEMO_USERS).find(
    (u) => u.email.toLowerCase() === normalized
  );
  return found || null;
}

export function mapStaffRowToUserProfile(row: {
  id?: string;
  name?: string;
  email?: string;
  role_id?: string;
  role_title?: string;
  department?: string;
  sector?: string | null;
}): UserProfile {
  const roleId = (row.role_id as RoleId) || "super_admin";
  const fallback =
    (row.email ? getProfileByEmail(row.email) : null) ||
    DEMO_USERS[roleId] ||
    DEMO_USERS.super_admin;

  return {
    id: row.id || fallback.id,
    name: row.name || fallback.name,
    email: row.email || fallback.email,
    role: roleId,
    roleTitle: row.role_title || fallback.roleTitle,
    avatarInitials: fallback.avatarInitials || ROLE_INITIALS[roleId] || "ر.ع",
    department: row.department || fallback.department,
    sector: row.sector ?? fallback.sector,
    badgeColor: ROLE_BADGE_COLORS[roleId] || fallback.badgeColor,
  };
}

export function getCurrentUser(): UserProfile {
  if (typeof window !== "undefined") {
    try {
      const savedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile) as UserProfile;
        if (parsed && parsed.role && parsed.email) {
          return parsed;
        }
      }
    } catch {
      // ignore JSON parse issues
    }
    const saved = localStorage.getItem(STORAGE_KEY) as RoleId;
    if (saved && DEMO_USERS[saved]) {
      return DEMO_USERS[saved];
    }
  }
  return DEMO_USERS.super_admin;
}

export function setCurrentUserProfile(profile: UserProfile): UserProfile {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, profile.role);
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    window.dispatchEvent(
      new CustomEvent("rao-role-changed", { detail: profile.role })
    );
  }
  return profile;
}

export function setCurrentUserRole(role: RoleId): UserProfile {
  const profile = DEMO_USERS[role];
  return setCurrentUserProfile(profile);
}

/**
 * Fetches the authenticated staff profile from `/api/auth/me` (backed by Supabase Auth + staff_profiles)
 * and syncs local state so all dashboard components update reactively.
 */
export async function syncSessionUser(): Promise<UserProfile | null> {
  if (typeof window === "undefined") return null;
  try {
    const res = await fetch("/api/auth/me", { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    if (data?.authenticated && data?.user) {
      return setCurrentUserProfile(data.user as UserProfile);
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Authenticates a staff member with real Supabase Auth (`signInWithPassword`)
 * and syncs their `staff_profiles` record.
 */
export async function signInWithEmailPassword(
  email: string,
  password: string
): Promise<{
  success: boolean;
  user?: UserProfile;
  error?: string;
}> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return {
      success: false,
      error: "عميل Supabase غير مهيأ. تأكد من إعداد متغيرات البيئة.",
    };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error || !data.user) {
    return {
      success: false,
      error:
        error?.message === "Invalid login credentials"
          ? "بيانات الدخول غير صحيحة. تأكد من البريد الإلكتروني وكلمة المرور."
          : error?.message || "تعذر تسجيل الدخول.",
    };
  }

  // Fetch canonical profile from /api/auth/me (reads public.staff_profiles)
  const synced = await syncSessionUser();
  if (synced) {
    return { success: true, user: synced };
  }

  const fallback = getProfileByEmail(data.user.email);
  if (fallback) {
    setCurrentUserProfile(fallback);
    return { success: true, user: fallback };
  }

  // Not an authorized staff profile
  await supabase.auth.signOut();
  return {
    success: false,
    error: "هذا الحساب غير مسجل في جدول منسوبي رواسي العمر (staff_profiles).",
  };
}

/**
 * Switches to one of the 4 seeded staff accounts using real Supabase Auth.
 */
export async function signInAsRole(role: RoleId): Promise<{
  success: boolean;
  user?: UserProfile;
  error?: string;
}> {
  const target = DEMO_USERS[role];
  return signInWithEmailPassword(target.email, DEMO_STAFF_PASSWORD);
}

/**
 * Signs out of Supabase Auth and clears cached profile state.
 */
export async function signOutCurrentUser(): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(PROFILE_STORAGE_KEY);
  }
}
