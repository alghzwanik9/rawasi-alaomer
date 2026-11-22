/**
 * Rawasi Al-Omar — Supabase Auth & Staff Profiles Provisioning Script
 *
 * Creates or updates the 4 internal RBAC staff accounts in Supabase Auth
 * and links their auth user IDs to `public.staff_profiles`.
 *
 * Usage:
 *   node scripts/seed-auth-users.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, "utf8");
  const env = {};
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#") || !line.includes("=")) continue;
    const idx = line.indexOf("=");
    const key = line.slice(0, idx).trim();
    const val = line.slice(idx + 1).trim();
    env[key] = val;
  }
  return env;
}

const rootDir = process.cwd();
const fileEnv = loadEnvFile(path.join(rootDir, ".env.local"));

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || fileEnv.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || fileEnv.SUPABASE_SERVICE_ROLE_KEY;
const DEFAULT_PASSWORD =
  process.env.DEMO_STAFF_PASSWORD || fileEnv.DEMO_STAFF_PASSWORD || "Rawasi@2026!";

if (!SUPABASE_URL || !SERVICE_ROLE_KEY || SERVICE_ROLE_KEY.includes("PASTE_")) {
  console.error(
    "❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local"
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const STAFF_ACCOUNTS = [
  {
    id: "usr_ceo",
    email: "ceo@rawasialomar.sa",
    password: DEFAULT_PASSWORD,
    name: "م. عبد العزيز بن سلطان",
    role_id: "super_admin",
    role_title: "المدير العام والشريك المؤسس",
    department: "الإدارة التنفيذية العليا",
    sector: null,
    status: "نشط",
    access_scope: "صلاحيات كاملة شاملة لكافة القطاعات واللوحات",
  },
  {
    id: "usr_mgr",
    email: "f.harbi@rawasialomar.sa",
    password: DEFAULT_PASSWORD,
    name: "أ. فيصل بن خالد الحربي",
    role_id: "sector_manager",
    role_title: "مدير قطاع المقاولات والتطوير",
    department: "إدارة المشاريع والتطوير الإنشائي",
    sector: "contracting",
    status: "نشط",
    access_scope: "إدارة طلبات قطاع المقاولات والتجهيز وإرسال العروض",
  },
  {
    id: "usr_editor",
    email: "n.qahtani@rawasialomar.sa",
    password: DEFAULT_PASSWORD,
    name: "أ. نورة بنت فهد القحطاني",
    role_id: "marjea_editor",
    role_title: "أخصائي التحرير والمعرفة غير الربحية",
    department: "مركز المعرفة والتوثيق الإجرائي",
    sector: null,
    status: "نشط",
    access_scope:
      "صانع المعرفة (Maker): إنشاء وتعديل مسودات الأدلة والنماذج",
  },
  {
    id: "usr_reviewer",
    email: "a.ghamdi@rawasialomar.sa",
    password: DEFAULT_PASSWORD,
    name: "د. عبد الله بن صالح الغامدي",
    role_id: "governance_reviewer",
    role_title: "مستشار الحوكمة والرقابة النظامية",
    department: "إدارة الامتثال والاستشارات الشرعية والنظامية",
    sector: null,
    status: "نشط",
    access_scope:
      "مراجع معتمد (Checker): مراجعة واعتماد نشر الأدلة ونماذج اللوائح",
  },
];

async function provisionStaffUsers() {
  console.log("🚀 Provisioning Rawasi Al-Omar staff accounts in Supabase Auth...");

  const { data: listData, error: listErr } =
    await supabase.auth.admin.listUsers();

  if (listErr) {
    console.error("❌ Failed to list Supabase Auth users:", listErr.message);
    process.exit(1);
  }

  const existingByEmail = new Map(
    (listData?.users || []).map((u) => [u.email?.toLowerCase(), u])
  );

  for (const staff of STAFF_ACCOUNTS) {
    const existing = existingByEmail.get(staff.email.toLowerCase());
    let authUserId = existing?.id;

    if (existing) {
      const { data: updated, error: updateErr } =
        await supabase.auth.admin.updateUserById(existing.id, {
          password: staff.password,
          email_confirm: true,
          user_metadata: {
            name: staff.name,
            role_id: staff.role_id,
            role_title: staff.role_title,
            department: staff.department,
            sector: staff.sector,
          },
        });

      if (updateErr) {
        console.error(
          `❌ Failed to update auth user ${staff.email}:`,
          updateErr.message
        );
        continue;
      }
      authUserId = updated.user.id;
      console.log(`✅ Updated Auth user: ${staff.email} (${staff.role_id}) -> ${authUserId}`);
    } else {
      const { data: created, error: createErr } =
        await supabase.auth.admin.createUser({
          email: staff.email,
          password: staff.password,
          email_confirm: true,
          user_metadata: {
            name: staff.name,
            role_id: staff.role_id,
            role_title: staff.role_title,
            department: staff.department,
            sector: staff.sector,
          },
        });

      if (createErr) {
        console.error(
          `❌ Failed to create auth user ${staff.email}:`,
          createErr.message
        );
        continue;
      }
      authUserId = created.user.id;
      console.log(`✅ Created Auth user: ${staff.email} (${staff.role_id}) -> ${authUserId}`);
    }

    // Sync with public.staff_profiles table
    const { error: upsertErr } = await supabase.from("staff_profiles").upsert(
      {
        id: staff.id,
        name: staff.name,
        email: staff.email,
        role_id: staff.role_id,
        role_title: staff.role_title,
        department: staff.department,
        sector: staff.sector,
        status: staff.status,
        access_scope: staff.access_scope,
      },
      { onConflict: "email" }
    );

    if (upsertErr) {
      console.error(
        `❌ Failed to sync staff_profiles for ${staff.email}:`,
        upsertErr.message
      );
    } else {
      console.log(`   ↳ Linked to public.staff_profiles (${staff.role_id})`);
    }
  }

  console.log("\n🎉 All 4 staff accounts are active and ready for login!");
  console.log(`🔑 Default Unified Password: ${DEFAULT_PASSWORD}`);
}

provisionStaffUsers();
