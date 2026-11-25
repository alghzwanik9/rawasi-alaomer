import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getGeminiClient, isGeminiConfigured, DEFAULT_AI_MODEL, BACKUP_AI_MODELS } from "@/lib/ai/geminiClient";
import { buildSystemInstruction, AI_TOOLS_DECLARATION } from "@/lib/ai/knowledgeBase";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { InquiryRecord } from "@/app/api/inquiries/route";
import { SEEDED_INQUIRIES } from "@/data/portalSeed";

// In-memory rate limiting map: sessionId/IP -> { count, expiresAt }
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 25;
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

function checkRateLimit(key: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.expiresAt) {
    rateLimitMap.set(key, { count: 1, expiresAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1 };
  }

  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, remaining: 0 };
  }

  entry.count += 1;
  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - entry.count };
}

// Inquiries store file path for offline/fallback persistence
const INQUIRIES_FILE_PATH = path.join(
  process.cwd(),
  "src",
  "data",
  "inquiriesStore.json"
);

function readStoredInquiries(): InquiryRecord[] {
  try {
    if (fs.existsSync(INQUIRIES_FILE_PATH)) {
      const data = fs.readFileSync(INQUIRIES_FILE_PATH, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (error) {
    console.error("Failed to read inquiries from file:", error);
  }
  return [...SEEDED_INQUIRIES];
}

function writeStoredInquiries(inquiries: InquiryRecord[]) {
  try {
    const dir = path.dirname(INQUIRIES_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(
      INQUIRIES_FILE_PATH,
      JSON.stringify(inquiries, null, 2),
      "utf-8"
    );
  } catch (error) {
    console.error("Failed to persist inquiries:", error);
  }
}

function refNumber(refId?: string): number {
  return Number(refId?.split("-").pop()) || 0;
}

async function getNextRefNumber(): Promise<number> {
  const local = readStoredInquiries();
  const nums = local.map((i) => refNumber(i.refId));
  const supabase = getSupabaseAdminClient();

  if (supabase) {
    try {
      const { data } = await supabase
        .from("inquiries")
        .select("ref_id")
        .like("ref_id", "RAO-2026-%");
      for (const row of data ?? []) {
        nums.push(refNumber(String(row.ref_id)));
      }
    } catch {
      // Supabase query failed, continue with local numbers
    }
  }

  return Math.max(104, ...nums) + 1;
}

function buildExecutiveWhatsappUrl(params: {
  refId: string;
  contactName: string;
  contactPhone: string;
  entityName?: string;
  sectorName?: string;
  cityName?: string;
  projectSummary?: string;
}): string {
  const message = `السلام عليكم ورحمة الله وبركاته،
أنا العميل: *${params.contactName}*
تواصلت عبر المساعد الذكي لمنصة رواسي العمر وأرغب في متابعة طلبي التنفيذي.

*الرقم المرجعي:* ${params.refId}
*رقم الجوال:* ${params.contactPhone}
${params.entityName ? `*الجهة:* ${params.entityName}\n` : ""}${params.sectorName ? `*القطاع المطلوب:* ${params.sectorName}\n` : ""}${params.cityName ? `*المدينة:* ${params.cityName}\n` : ""}${params.projectSummary ? `*ملخص الاحتياج:* ${params.projectSummary}\n` : ""}
نأمل التنسيق لبدء الدراسة الهندسية وتحديد موعد للنقاش. شكراً لكم.`;

  return `https://wa.me/966538881885?text=${encodeURIComponent(message)}`;
}

const SECTOR_NAME_MAP: Record<string, string> = {
  contracting: "المقاولات والتطوير الإنشائي",
  supply: "التجهيز والتوريد المتكامل",
  tech: "التقنية والحلول الذكية",
  operations: "التشغيل والصيانة وإدارة المرافق",
  community: "تمكين القطاع غير الربحي وحوكمة الأوقاف",
  general: "استشارة عامة وتسليم مفتاح",
};

const ENTITY_NAME_MAP: Record<string, string> = {
  charity: "جمعية أهلية",
  waqf: "مؤسسة أهلية أو وقف خيري",
  private: "شركة أو قطاع خاص",
  individual: "فرد / جهة خاصة",
};

async function persistAssistantLead(args: {
  contactName: string;
  contactPhone: string;
  entityType?: string;
  sector?: string;
  cityName?: string;
  projectSummary?: string;
}) {
  const refNum = await getNextRefNumber();
  const refId = `RAO-2026-${refNum}`;
  const sectorKey = args.sector || "general";
  const entityKey = args.entityType || "charity";
  const sectorName = SECTOR_NAME_MAP[sectorKey] || "استشارة عامة";
  const entityTypeName = ENTITY_NAME_MAP[entityKey] || "جهة غير ربحية أو خاصة";

  const whatsappUrl = buildExecutiveWhatsappUrl({
    refId,
    contactName: args.contactName,
    contactPhone: args.contactPhone,
    entityName: entityTypeName,
    sectorName,
    cityName: args.cityName || "الرياض",
    projectSummary: args.projectSummary,
  });

  const newRecord: InquiryRecord = {
    id: `inq_ai_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    refId,
    createdAt: new Date().toISOString(),
    entityType: entityKey,
    entityTypeName,
    entityName: entityTypeName,
    services: [sectorKey],
    serviceNames: [sectorName],
    notes: `[طلب مسجل عبر المساعد الذكي] ${args.projectSummary || "استشارة عبر الدردشة الذكية"}`,
    projectName: args.projectSummary
      ? args.projectSummary.slice(0, 60)
      : `مشروع ${sectorName}`,
    city: args.cityName || "المملكة العربية السعودية",
    budgetRange: "قيد الدراسة الهندسية",
    timeline: "فوري",
    needType: "تنفيذ تسليم مفتاح متكامل",
    contactName: args.contactName,
    contactRole: "ممثل الجهة (طلب ذكي)",
    contactPhone: args.contactPhone,
    contactEmail: "ai-lead@rawasialomar.sa",
    meetingPreference: "واتساب / اتصال هاتفي مباشر",
    status: "new",
    whatsappUrl,
  };

  // 1. Try persisting to Supabase
  const supabase = getSupabaseAdminClient();
  if (supabase) {
    try {
      await supabase.from("inquiries").insert({
        ref_id: newRecord.refId,
        entity_type: newRecord.entityType,
        entity_type_name: newRecord.entityTypeName,
        entity_name: newRecord.entityName,
        services: newRecord.services,
        service_names: newRecord.serviceNames,
        notes: newRecord.notes,
        project_name: newRecord.projectName,
        city: newRecord.city,
        budget_range: newRecord.budgetRange,
        timeline: newRecord.timeline,
        need_type: newRecord.needType,
        contact_name: newRecord.contactName,
        contact_role: newRecord.contactRole,
        contact_phone: newRecord.contactPhone,
        contact_email: newRecord.contactEmail,
        meeting_preference: newRecord.meetingPreference,
        status: newRecord.status,
        whatsapp_url: newRecord.whatsappUrl,
      });
    } catch (dbErr) {
      console.warn("Failed to insert AI lead into Supabase:", dbErr);
    }
  }

  // 2. Always persist to local backup store
  const stored = readStoredInquiries();
  stored.unshift(newRecord);
  writeStoredInquiries(stored);

  return {
    refId,
    contactName: args.contactName,
    contactPhone: args.contactPhone,
    whatsappUrl,
    sectorName,
  };
}

/**
 * Smart contextual fallback engine when Gemini API is unconfigured or during temporary outages.
 * Guarantees dynamic, intelligent answers instead of repeating a single static string.
 */
function getSmartFallbackResponse(userPrompt: string): {
  reply: string;
  leadCreated?: any;
  suggestions: string[];
} {
  const p = userPrompt.toLowerCase();

  // 1. Contact / WhatsApp intent
  if (
    p.includes("واتساب") ||
    p.includes("تواصل") ||
    p.includes("اتصال") ||
    p.includes("رقم") ||
    p.includes("هاتف")
  ) {
    const directUrl =
      "https://wa.me/966538881885?text=" +
      encodeURIComponent(
        "السلام عليكم ورحمة الله، تواصلت عبر منصة رواسي العمر وأرغب في استشارة الإدارة التنفيذية بخصوص مشروعي."
      );
    return {
      reply: `يسعدنا تواصلكم المباشر مع **الإدارة التنفيذية لشركة رواسي العمر** 🏛️
فريقنا الهندسي والاستشاري متاح لخدمتكم ومناقشة تفاصيل المشروع، أو تحديد موعد اجتماع عمل (حضوري أو عن بُعد).

**رقم الاتصال والواتساب المباشر:**
[+966538881885](${directUrl})

يمكنكم النقر على الزر أدناه للانتقال الفوري إلى المحادثة مع الإدارة.`,
      leadCreated: {
        refId: "RAO-DIRECT",
        contactName: "الإدارة التنفيذية",
        contactPhone: "+966538881885",
        whatsappUrl: directUrl,
      },
      suggestions: [
        "المقاولات والتطوير الإنشائي",
        "أدلة ونماذج مرجع الجمعيات",
        "تأهيل مقر وقفي",
      ],
    };
  }

  // 2. Contracting & Construction
  if (
    p.includes("مقاول") ||
    p.includes("بناء") ||
    p.includes("إنشاء") ||
    p.includes("ترميم") ||
    p.includes("تأهيل") ||
    p.includes("تشطيب")
  ) {
    return {
      reply: `يتولى **قطاع المقاولات والتطوير الإنشائي** في رواسي العمر تنفيذ وتهيئة المقرات المؤسسية والمباني الوقفية والمراكز التجارية بنموذج **تسليم المفتاح**:
- الأعمال الإنشائية والهيكلية المتكاملة.
- إعادة التأهيل المعماري والترميم الذكي للمقرات القائمة.
- أعمال التشطيبات الفاخرة والهويات المكانية.
- أنظمة السلامة والدفاع المدني والكهروميكانيك (MEP).

*المخرجات:* تصاميم معتمدة، رخص بناء، جدول كميات شفاف (BOQ)، وإشراف هندسي ميداني موثق.`,
      suggestions: [
        "طلب تسعير ودراسة مشروع",
        "التجهيز والتوريد المتكامل",
        "التواصل عبر واتساب",
      ],
    };
  }

  // 3. Marjea & Non-profit Licensing
  if (
    p.includes("جمعية") ||
    p.includes("تأسيس") ||
    p.includes("ترخيص") ||
    p.includes("حوكمة") ||
    p.includes("وقف") ||
    p.includes("أوقاف")
  ) {
    return {
      reply: `توفر رواسي العمر **6 مسارات تخصصية متكاملة لتمكين القطاع غير الربحي والأوقاف**:
1. **التأسيس والتراخيص:** استيفاء متطلبات المركز الوطني لتنمية القطاع غير الربحي.
2. **الحوكمة واللوائح:** إعداد وتحديث اللوائح الأساسية ومعايير الامتثال والشفافية.
3. **الأوقاف والوصايا:** صياغة لوائح النظارة وتطوير الأصول الوقفية المدرة للدخل.
4. **الاعتماد الحكومي:** التأهيل للتسجيل في منصة إحسان والمنابر الرسمية.

يمكنك تصفح الأدلة التفصيلية مجاناً عبر بوابة **مرجع الجمعيات** في المنصة.`,
      suggestions: [
        "أدلة ونماذج مرجع الجمعيات",
        "تأسيس وترخيص جمعية أهلية",
        "التواصل مع مستشار الحوكمة",
      ],
    };
  }

  // 4. Downloadable Templates
  if (
    p.includes("نماذج") ||
    p.includes("مرجع") ||
    p.includes("تحميل") ||
    p.includes("ملف") ||
    p.includes("وورد") ||
    p.includes("pdf")
  ) {
    return {
      reply: `توفر منصة **مرجع الجمعيات** أكثر من **18 نموذجاً معتمداً بصيغ OpenXML حقيقية** (.docx و .xlsx و .pdf) جاهزة للتحميل الفوري:
- نموذج عقد اجتماع الجمعية العمومية ومحاضر الاجتماع.
- لائحة تنظيم مجلس الإدارة واللجان المنبثقة.
- نموذج خطة جمع التبرعات والحملات التنموية.
- نماذج فتح الحسابات البنكية والتفويضات المزدوجة.

جميع النماذج مجهزة بترويسة الشركة وخانات التعبئة النظامية وقابلة للتعديل.`,
      suggestions: [
        "الانتقال إلى مرجع الجمعيات",
        "تأسيس وترخيص جمعية",
        "التواصل عبر واتساب",
      ],
    };
  }

  // 5. Procurement & Supply
  if (
    p.includes("توريد") ||
    p.includes("تجهيز") ||
    p.includes("أثاث") ||
    p.includes("مكاتب")
  ) {
    return {
      reply: `يقدم **قطاع التجهيز والتوريد المتكامل** حلولاً شاملة لتأثيث وتجهيز المقرات المؤسسية:
- تأثيث المكاتب الإدارية والقاعات الذكية وأنظمة العرض والصوتيات.
- توريد التجهيزات التقنية والمكتبية المعتمدة مع الضمانات الرسمية.
- تجهيز مراكز التدريب والمساحات المجتمعية التفاعلية.`,
      suggestions: [
        "المقاولات والتطوير الإنشائي",
        "طلب تأهيل وتجهيز مقر",
        "التواصل عبر واتساب",
      ],
    };
  }

  // General fallback
  return {
    reply: `أهلاً بك في **رواسي العمر للاستشارات والتنفيذ المتكامل** ("جهة واحدة، مسار واضح") 🏛️
نحن نجمع بين التخطيط الهندسي الاستشاري، الحوكمة المؤسسية، والتنفيذ الميداني المتكامل في 5 قطاعات رئيسية:
1. المقاولات والتطوير الإنشائي
2. التجهيز والتوريد المتكامل
3. التقنية والحلول الذكية
4. التشغيل والصيانة وإدارة المرافق
5. تمكين الجمعيات الأهلية وحوكمة الأوقاف

تفضل باختيار موضوع استفسارك أو اكتب تفاصيل مشروعك لنساعدك فوراً.`,
    suggestions: [
      "المقاولات والتطوير الإنشائي",
      "أدلة ونماذج مرجع الجمعيات",
      "تجهيز وتأثيث مقرات",
      "التواصل عبر واتساب",
    ],
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    if (!body || !Array.isArray(body.messages) || body.messages.length === 0) {
      return NextResponse.json(
        { error: "الرجاء إرسال محادثة صالحة تحتوي على رسائل." },
        { status: 400 }
      );
    }

    // Rate Limiting check
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      body.sessionId ||
      "anonymous-client";
    const limit = checkRateLimit(clientIp);

    if (!limit.allowed) {
      return NextResponse.json({
        success: true,
        reply:
          "وصلت إلى الحد الأقصى للمحادثات التلقائية في هذه الجلسة لحماية الموارد. يسعدنا وفريقنا التنفيذي خدمتكم ومتابعة طلبكم مباشرة عبر الواتساب على الرقم المباشر: +966538881885.",
        rateLimited: true,
        suggestions: ["المتابعة عبر واتساب", "استعراض القطاعات", "مرجع الجمعيات"],
      });
    }

    const lastUserMessage = [...body.messages]
      .reverse()
      .find((m: { role: string; content: string }) => m.role === "user");

    const userPrompt = lastUserMessage?.content || "";

    // If Gemini is unconfigured or key is not provided yet, use smart contextual fallback
    if (!isGeminiConfigured()) {
      const fallbackData = getSmartFallbackResponse(userPrompt);
      return NextResponse.json({
        success: true,
        reply: fallbackData.reply,
        leadCreated: fallbackData.leadCreated,
        fallback: true,
        suggestions: fallbackData.suggestions,
      });
    }

    const client = getGeminiClient();
    if (!client) {
      const fallbackData = getSmartFallbackResponse(userPrompt);
      return NextResponse.json({
        success: true,
        reply: fallbackData.reply,
        leadCreated: fallbackData.leadCreated,
        fallback: true,
        suggestions: fallbackData.suggestions,
      });
    }

    // Convert messages format for Gemini
    const recentMessages = body.messages.slice(-8);
    const contents = recentMessages.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" || m.role === "model" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    // Attempt generation with primary model then fallbacks
    const candidateModels = [DEFAULT_AI_MODEL, ...BACKUP_AI_MODELS];
    let geminiResponse: any = null;
    let selectedModel = DEFAULT_AI_MODEL;

    for (const model of candidateModels) {
      try {
        geminiResponse = await client.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction: buildSystemInstruction(),
            temperature: 0.3,
            tools: AI_TOOLS_DECLARATION,
          },
        });
        selectedModel = model;
        break;
      } catch (err: any) {
        console.warn(`Model ${model} failed with:`, err.message || err);
      }
    }

    if (!geminiResponse) {
      const fallbackData = getSmartFallbackResponse(userPrompt);
      return NextResponse.json({
        success: true,
        reply: fallbackData.reply,
        leadCreated: fallbackData.leadCreated,
        fallback: true,
        suggestions: fallbackData.suggestions,
      });
    }

    // Check if Gemini invoked the saveProjectInquiry tool
    const functionCalls = geminiResponse.functionCalls;
    if (functionCalls && functionCalls.length > 0) {
      const call = functionCalls.find(
        (f: { name: string }) => f.name === "saveProjectInquiry"
      );

      if (call && call.args) {
        const lead = await persistAssistantLead({
          contactName: String(call.args.contactName || "عميل منصة رواسي العمر"),
          contactPhone: String(call.args.contactPhone || ""),
          entityType: call.args.entityType ? String(call.args.entityType) : undefined,
          sector: call.args.sector ? String(call.args.sector) : undefined,
          cityName: call.args.cityName ? String(call.args.cityName) : undefined,
          projectSummary: call.args.projectSummary
            ? String(call.args.projectSummary)
            : userPrompt,
        });

        const reply = `سُعدنا بتواصلكم أستاذ ${lead.contactName}!
تم قيد وتأهيل طلبكم بنجاح في نظام رواسي العمر تحت الرقم المرجعي الرسمي:
**${lead.refId}**

تم توثيق بياناتكم لقطاع (${lead.sectorName})، ويمكنكم الآن بنقرة واحدة أدناه الانتقال المباشر إلى واتساب الإدارة التنفيذية بملخص الطلب الموثق لمتابعة الدراسة الهندسية وتحديد موعد الاجتماع.`;

        return NextResponse.json({
          success: true,
          reply,
          leadCreated: {
            refId: lead.refId,
            contactName: lead.contactName,
            contactPhone: lead.contactPhone,
            whatsappUrl: lead.whatsappUrl,
          },
          suggestions: [
            "الانتقال إلى واتساب الإدارة التنفيذية",
            "استعراض نماذج مرجع الجمعيات",
            "استفسار آخر عن خدماتنا",
          ],
        });
      }
    }

    // Standard text reply
    const replyText =
      geminiResponse.text?.trim() ||
      "أهلاً بك. كيف يمكن لفريق رواسي العمر مساعدتك في مشاريعك واستشاراتك اليوم؟";

    return NextResponse.json({
      success: true,
      reply: replyText,
      modelUsed: selectedModel,
      suggestions: [
        "ما هي خدمات قطاع المقاولات؟",
        "كيف تؤهلون مقرات الأوقاف والجمعيات؟",
        "أرغب في تسجيل طلب تأهيل مشروع",
        "ما هي نماذج مرجع الجمعيات المعتمدة؟",
      ],
    });
  } catch (error: any) {
    console.error("AI Assistant API route error:", error);
    return NextResponse.json(
      {
        success: false,
        reply:
          "حدث خطأ غير متوقع أثناء معالجة استفسارك. يمكنك التواصل معنا مباشرة على واتساب الإدارة التنفيذية (+966538881885).",
        error: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
