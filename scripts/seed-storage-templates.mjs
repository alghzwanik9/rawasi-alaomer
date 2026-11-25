import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

const env = {
  ...loadEnvFile(path.resolve(__dirname, "../.env.local")),
  ...process.env,
};

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL;
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const BUCKET_NAME = "marjea-templates";

async function main() {
  console.log("=================================================");
  console.log("🚀 Provisioning and Seeding Supabase Storage");
  console.log("Bucket:", BUCKET_NAME);
  console.log("Target:", SUPABASE_URL);
  console.log("=================================================\n");

  // 1. Verify bucket exists
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) {
    console.error("❌ Error listing buckets:", listError.message);
  }

  const existingBucket = buckets?.find((b) => b.name === BUCKET_NAME);
  if (!existingBucket) {
    console.log(`📦 Creating public bucket '${BUCKET_NAME}'...`);
    const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      fileSizeLimit: 52428800,
    });
    if (createError) {
      console.warn("⚠️ Create bucket response:", createError.message);
    } else {
      console.log("✅ Bucket created successfully.");
    }
  } else {
    console.log(`✅ Bucket '${BUCKET_NAME}' exists and is ready.`);
  }

  // 2. Fetch templates from public.procedure_templates
  const { data: templates, error: tmplError } = await supabase
    .from("procedure_templates")
    .select("*")
    .order("id");

  if (tmplError || !templates || templates.length === 0) {
    console.error("❌ Failed to fetch templates from table:", tmplError?.message);
    process.exit(1);
  }

  console.log(`\n📄 Found ${templates.length} templates to upload:\n`);

  let successCount = 0;

  for (const tmpl of templates) {
    const filename = tmpl.download_file_name;
    const mimeType =
      tmpl.file_type === "XLSX"
        ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        : tmpl.file_type === "PDF"
        ? "application/pdf"
        : "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    const documentContent = `================================================================================
شركة رواسي العمر للاستشارات والتنفيذ المتكامل | منصة مرجع الجمعيات الأهلية
نموذج إسترشادي رسمي معتمد: ${tmpl.title}
رمز المستند: ${tmpl.id} | الإجراء: ${tmpl.procedure_id}
الصيغة المعتمدة: ${tmpl.format} (${tmpl.file_type})
اسم الملف: ${filename}
تاريخ الإصدار: 2026-11-23
الجهة المرجعية: المركز الوطني لتنمية القطاع غير الربحي (NCNP)
================================================================================

[وصف المستند والغرض منه]:
${tmpl.description}

[الاشتراطات النظامية ومعايير الحوكمة]:
1. اعتماد النموذج بقرار رسمي موثق من مجلس الإدارة أو الجمعية العمومية حسب الاختصاص.
2. توثيق أرقام الهويات الوطنية والسجلات المدنية والتواقيع الحية أو الرقمية لكافة الأطراف.
3. الاحتفاظ بالنسخة الأصلية في أرشيف الجمعية ورفع نسخة ممسوحة ضوئياً على منصة المركز الوطني.
4. مطابقة كافة البنود المالية لمصفوفة الصلاحيات المعتمدة للجمعية واللوائح الداخلية.

[هيكل النموذج وجدول البيانات]:
- البند 1: البيانات الأساسية للجمعية (الاسم، رقم الترخيص، النطاق الجغرافي، الحساب البنكي الرئيسي).
- البند 2: جدول القرارات / المحاضر / التكليفات مع بيان الأسباب والمبررات النظامية.
- البند 3: قائمة التواقيع والمصادقات المعتمدة (الرئيس، المشرف المالي، المفوضين).
- البند 4: الملاحق والوثائق المؤيدة ذات الصلة.

================================================================================
حقوق الإعداد والتطوير محفوظة لمنصة رواسي العمر (رواسي للثبات، والعمر لامتداد الأثر).
لطلب مساندة تنفيذية أو مراجعة حوكمة متقدمة:
هاتف / واتساب: +966 57 599 9956
البريد الإلكتروني: contact@rawasialomar.sa
المنصة: https://rawasialomar.sa/marjea
================================================================================
`;

    const fileBuffer = Buffer.from(documentContent, "utf-8");

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filename, fileBuffer, {
        contentType: "text/plain; charset=utf-8",
        upsert: true,
      });

    if (uploadError) {
      console.error(`❌ Failed to upload ${filename}:`, uploadError.message);
    } else {
      const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${filename}`;
      successCount++;
      console.log(`✅ [${successCount}/${templates.length}] Uploaded: ${filename}`);
      console.log(`   URL: ${publicUrl}`);
    }
  }

  // 3. Update download_url in public.procedure_templates table
  console.log("\n🔄 Updating download_url in public.procedure_templates...");
  for (const tmpl of templates) {
    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${tmpl.download_file_name}`;
    await supabase
      .from("procedure_templates")
      .update({ download_url: publicUrl })
      .eq("id", tmpl.id);
  }

  console.log("\n=================================================");
  console.log(`🎉 Completed! ${successCount}/${templates.length} templates seeded in Supabase Storage.`);
  console.log("=================================================");
}

main().catch((err) => {
  console.error("Unhandled error:", err);
  process.exit(1);
});
