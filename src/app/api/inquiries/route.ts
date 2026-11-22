import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { SEEDED_INQUIRIES } from "@/data/portalSeed";
import {
  getAuthenticatedStaffUser,
  getSupabaseAdminClient,
} from "@/lib/supabase/server";
import { UserProfile } from "@/data/portalAuth";

export interface InquiryRecord {
  id: string;
  refId: string;
  createdAt: string;
  entityType: string;
  entityTypeName: string;
  entityName?: string;
  services: string[];
  serviceNames: string[];
  notes?: string;
  projectName?: string;
  city: string;
  budgetRange: string;
  timeline: string;
  needType?: string;
  contactName: string;
  contactRole: string;
  contactPhone: string;
  contactEmail: string;
  meetingPreference?: string;
  assignedTo?: string; // email of assigned sector manager
  status: "new" | "reviewing" | "contacted" | "proposal_sent" | "closed_won";
  whatsappUrl: string;
}

const INQUIRIES_FILE_PATH = path.join(
  process.cwd(),
  "src",
  "data",
  "inquiriesStore.json"
);

// In-memory fallback
let memoryInquiries: InquiryRecord[] = [...SEEDED_INQUIRIES];

function readStoredInquiries(): InquiryRecord[] {
  try {
    if (fs.existsSync(INQUIRIES_FILE_PATH)) {
      const data = fs.readFileSync(INQUIRIES_FILE_PATH, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryInquiries = parsed;
        return parsed;
      }
    }
  } catch (error) {
    console.error("Failed to read inquiries from file:", error);
  }

  // Initialize with seed data if file doesn't exist
  try {
    const dir = path.dirname(INQUIRIES_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(
      INQUIRIES_FILE_PATH,
      JSON.stringify(SEEDED_INQUIRIES, null, 2),
      "utf-8"
    );
  } catch (err) {
    // Ignore in read-only environments
  }

  return memoryInquiries;
}

function writeStoredInquiries(inquiries: InquiryRecord[]) {
  memoryInquiries = inquiries;
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
    console.error("Failed to persist inquiries to file:", error);
  }
}

// Map service IDs to Arabic labels
const SERVICE_LABELS: Record<string, string> = {
  governance: "مسارات تأسيس وحوكمة القطاع غير الربحي",
  contracting: "المقاولات والتطوير الإنشائي",
  procurement: "التجهيز والتوريد المتكامل",
  "tech-solutions": "التقنية والحلول الذكية",
  operations: "التشغيل والصيانة المستدامة",
  "social-initiatives": "المشاريع والمبادرات المجتمعية",
};

// Map entity IDs to Arabic labels
const ENTITY_LABELS: Record<string, string> = {
  charity: "جمعية أهلية",
  waqf: "مؤسسة أهلية / وقف خيري",
  donor: "جهة مانحة / صندوق تنموي",
  private: "شركة / قطاع خاص",
  government: "جهة حكومية / شبه حكومية",
};

function mapSupabaseRowToInquiry(row: any): InquiryRecord {
  return {
    id: String(row.id),
    refId: row.ref_id,
    createdAt: row.created_at,
    entityType: row.entity_type,
    entityTypeName: row.entity_type_name || ENTITY_LABELS[row.entity_type] || row.entity_type,
    entityName: row.entity_name || "",
    services: row.services || [],
    serviceNames: row.service_names || [],
    notes: row.notes || "",
    projectName: row.project_name || "",
    city: row.city || "الرياض",
    budgetRange: row.budget_range || "لم تحدد بعد",
    timeline: row.timeline || "فوري",
    needType: row.need_type || "تنفيذ تسليم مفتاح متكامل",
    contactName: row.contact_name,
    contactRole: row.contact_role || "",
    contactPhone: row.contact_phone,
    contactEmail: row.contact_email || "",
    meetingPreference: row.meeting_preference || "عن بُعد عبر Teams / Zoom",
    assignedTo: row.assigned_to || undefined,
    status: row.status || "new",
    whatsappUrl: row.whatsapp_url || "",
  };
}

function isLeadAccessibleToStaff(
  inq: InquiryRecord,
  staffUser: UserProfile
): boolean {
  if (staffUser.role === "super_admin") return true;
  if (staffUser.role === "sector_manager") {
    const isAssigned =
      Boolean(inq.assignedTo) &&
      inq.assignedTo!.toLowerCase() === staffUser.email.toLowerCase();
    const matchesSector =
      Boolean(staffUser.sector) && inq.services.includes(staffUser.sector!);
    return isAssigned || matchesSector;
  }
  return false;
}

export async function GET() {
  const staffUser = await getAuthenticatedStaffUser();
  if (!staffUser) {
    return NextResponse.json(
      {
        success: false,
        error: "غير مصرح. يرجى تسجيل الدخول للوصول إلى سجل طلبات المشاريع.",
      },
      { status: 401 }
    );
  }

  if (
    staffUser.role !== "super_admin" &&
    staffUser.role !== "sector_manager"
  ) {
    return NextResponse.json(
      {
        success: false,
        error:
          "صلاحيات دورك الحالي لا تخولك الوصول إلى سجل طلبات المشاريع (CRM). الوصول محصور بالمدير العام ومديري القطاعات.",
        role: staffUser.role,
      },
      { status: 403 }
    );
  }

  const supabase = getSupabaseAdminClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("inquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        const mapped = data
          .map(mapSupabaseRowToInquiry)
          .filter((inq) => isLeadAccessibleToStaff(inq, staffUser));
        return NextResponse.json({
          success: true,
          count: mapped.length,
          inquiries: mapped,
          role: staffUser.role,
          source: "supabase",
        });
      }
    } catch (err) {
      console.warn("Supabase query failed, using local fallback:", err);
    }
  }

  // Graceful local fallback with RBAC lead isolation
  const inquiries = readStoredInquiries().filter((inq) =>
    isLeadAccessibleToStaff(inq, staffUser)
  );
  return NextResponse.json({
    success: true,
    count: inquiries.length,
    inquiries,
    role: staffUser.role,
    source: "local_fallback",
  });
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type AdminClient = ReturnType<typeof getSupabaseAdminClient>;

function refNumber(refId?: string): number {
  return Number(refId?.split("-").pop()) || 0;
}

/** Next sequential reference number across Supabase + local backup. */
async function getNextRefNumber(
  local: InquiryRecord[],
  supabase: AdminClient
): Promise<number> {
  const nums = local.map((i) => refNumber(i.refId));
  if (supabase) {
    const { data } = await supabase
      .from("inquiries")
      .select("ref_id")
      .like("ref_id", "RAO-2026-%");
    for (const row of data ?? []) nums.push(refNumber(String(row.ref_id)));
  }
  return Math.max(104, ...nums) + 1;
}

function buildWhatsappUrl(r: Omit<InquiryRecord, "whatsappUrl">): string {
  const formattedServices =
    r.serviceNames.length > 0 ? r.serviceNames.join("، ") : "استشارة عامة";

  const message = `السلام عليكم ورحمة الله وبركاته،
أرغب في متابعة طلب تأهيل المشروع لدى رواسي العمر.

*الرقم المرجعي:* ${r.refId}
*نوع الجهة:* ${r.entityTypeName} ${r.entityName ? `(${r.entityName})` : ""}
*المسارات المطلوبة:* ${formattedServices}
*المدينة:* ${r.city}
*الإطار الزمني:* ${r.timeline}
*المسؤول:* ${r.contactName} - ${r.contactRole || "ممثل الجهة"}
*رقم الجوال:* ${r.contactPhone}
${r.notes ? `*ملاحظات:* ${r.notes}` : ""}`;

  return `https://wa.me/966538881885?text=${encodeURIComponent(message)}`;
}

function toSupabaseRow(r: InquiryRecord) {
  return {
    ref_id: r.refId,
    entity_type: r.entityType,
    entity_type_name: r.entityTypeName,
    entity_name: r.entityName,
    services: r.services,
    service_names: r.serviceNames,
    notes: r.notes,
    project_name: r.projectName,
    city: r.city,
    budget_range: r.budgetRange,
    timeline: r.timeline,
    need_type: r.needType,
    contact_name: r.contactName,
    contact_role: r.contactRole,
    contact_phone: r.contactPhone,
    contact_email: r.contactEmail,
    meeting_preference: r.meetingPreference,
    status: r.status,
    whatsapp_url: r.whatsappUrl,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      entityType = "charity",
      entityName = "",
      services = [],
      notes = "",
      projectName = "",
      city = "الرياض",
      budgetRange = "لم تحدد بعد",
      timeline = "فوري",
      needType = "تنفيذ تسليم مفتاح متكامل",
      contactName = "",
      contactRole = "",
      contactPhone = "",
      contactEmail = "",
      meetingPreference = "عن بُعد عبر Teams / Zoom",
    } = body;

    // Validate minimum required fields
    if (!contactName || !contactPhone) {
      return NextResponse.json(
        { error: "الرجاء إدخال اسم المسؤول ورقم الجوال للتواصل." },
        { status: 400 }
      );
    }

    const inquiries = readStoredInquiries();
    const supabase = getSupabaseAdminClient();

    const base: Omit<InquiryRecord, "whatsappUrl"> = {
      id: `inq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      refId: `RAO-2026-${await getNextRefNumber(inquiries, supabase)}`,
      createdAt: new Date().toISOString(),
      entityType,
      entityTypeName: ENTITY_LABELS[entityType] || entityType,
      entityName,
      services,
      serviceNames: (services as string[]).map((s) => SERVICE_LABELS[s] || s),
      notes,
      projectName,
      city,
      budgetRange,
      timeline,
      needType,
      contactName,
      contactRole,
      contactPhone,
      contactEmail,
      meetingPreference,
      status: "new",
    };
    let record: InquiryRecord = { ...base, whatsappUrl: buildWhatsappUrl(base) };

    // Supabase is the source of truth when configured.
    let source: "supabase" | "local_fallback" = "local_fallback";
    if (supabase) {
      for (let attempt = 0; attempt < 3; attempt++) {
        const { data, error } = await supabase
          .from("inquiries")
          .insert(toSupabaseRow(record))
          .select("id")
          .single();

        if (!error) {
          record = { ...record, id: String(data.id) };
          source = "supabase";
          await supabase.from("lead_timeline_events").insert({
            inquiry_id: data.id,
            from_status: null,
            to_status: "new",
            actor: contactName || "بوابة تأهيل المشاريع (/start-project)",
            comment: `استلام طلب تأهيل مشروع جديد (${record.refId}) من ${entityName || record.entityTypeName}`,
          });
          await supabase.from("audit_logs").insert({
            user_email: contactEmail || "public_visitor",
            action: "INQUIRY_SUBMITTED",
            resource_type: "inquiries",
            resource_id: record.refId,
            details: {
              ref_id: record.refId,
              entity_type: entityType,
              city,
              services,
            },
          });
          break;
        }
        if (error.code === "23505") {
          // ref_id collision (concurrent submission) — take the next number.
          const next = { ...record, refId: `RAO-2026-${refNumber(record.refId) + 1}` };
          record = { ...next, whatsappUrl: buildWhatsappUrl(next) };
          continue;
        }
        console.error("Supabase insert failed, saving locally:", error.message);
        break;
      }
    }

    // Local store is kept as an offline backup / fallback.
    inquiries.unshift(record);
    writeStoredInquiries(inquiries);

    return NextResponse.json({
      success: true,
      refId: record.refId,
      inquiry: record,
      whatsappUrl: record.whatsappUrl,
      source,
    });
  } catch (error) {
    console.error("Error creating inquiry:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء معالجة الطلب. يرجى المحاولة مرة أخرى." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const staffUser = await getAuthenticatedStaffUser();
    if (!staffUser) {
      return NextResponse.json(
        {
          error: "غير مصرح. يرجى تسجيل الدخول لتحديث حالة الطلب.",
        },
        { status: 401 }
      );
    }

    if (
      staffUser.role !== "super_admin" &&
      staffUser.role !== "sector_manager"
    ) {
      return NextResponse.json(
        {
          error:
            "صلاحيات دورك الحالي لا تسمح بتعديل حالات الطلبات أو إسنادها.",
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { id, status, assignedTo } = body as {
      id?: string;
      status?: InquiryRecord["status"];
      assignedTo?: string;
    };

    if (!id) {
      return NextResponse.json({ error: "معرف الطلب مطلوب." }, { status: 400 });
    }

    if (assignedTo !== undefined && staffUser.role !== "super_admin") {
      return NextResponse.json(
        {
          error: "إسناد الطلبات لمديري القطاعات محصور بصلاحية المدير العام فقط.",
        },
        { status: 403 }
      );
    }

    const supabase = getSupabaseAdminClient();
    const inquiries = readStoredInquiries();
    const index = inquiries.findIndex((inq) => inq.id === id || inq.refId === id);

    // If sector_manager, verify ownership/sector access before mutating
    if (staffUser.role === "sector_manager") {
      let targetInquiry: InquiryRecord | null =
        index !== -1 ? inquiries[index] : null;

      if (supabase) {
        const refId = index !== -1 ? inquiries[index].refId : id;
        const lookup = supabase.from("inquiries").select("*");
        const { data: existingRow } = await (UUID_RE.test(id)
          ? lookup.eq("id", id)
          : lookup.eq("ref_id", refId)
        ).maybeSingle();
        if (existingRow) {
          targetInquiry = mapSupabaseRowToInquiry(existingRow);
        }
      }

      if (!targetInquiry) {
        return NextResponse.json(
          { error: "لم يتم العثور على الطلب المطلوب." },
          { status: 404 }
        );
      }

      if (!isLeadAccessibleToStaff(targetInquiry, staffUser)) {
        return NextResponse.json(
          {
            error:
              "عزل الصلاحيات (RBAC): لا تملك صلاحية تعديل طلب غير مسند إليك أو خارج نطاق قطاعك.",
          },
          { status: 403 }
        );
      }
    }

    const updates: Partial<InquiryRecord> = {};
    if (status) updates.status = status;
    if (assignedTo !== undefined) updates.assignedTo = assignedTo;

    if (index !== -1) {
      inquiries[index] = { ...inquiries[index], ...updates };
      writeStoredInquiries(inquiries);
    }

    if (supabase) {
      const payload: Record<string, unknown> = {};
      if (status) payload.status = status;
      if (assignedTo !== undefined) payload.assigned_to = assignedTo || null;

      // Never compare a non-UUID against the uuid column (Postgres would error).
      const refId = index !== -1 ? inquiries[index].refId : id;
      const query = supabase.from("inquiries").update(payload);
      const { data, error } = await (UUID_RE.test(id)
        ? query.eq("id", id)
        : query.eq("ref_id", refId)
      )
        .select("*")
        .maybeSingle();

      if (error) {
        console.error("Supabase update failed:", error.message);
        return NextResponse.json(
          { error: "تعذر تحديث الطلب في قاعدة البيانات." },
          { status: 502 }
        );
      }
      if (data) {
        if (status) {
          await supabase.from("lead_timeline_events").insert({
            inquiry_id: data.id,
            from_status: index !== -1 ? inquiries[index]?.status : null,
            to_status: status,
            actor: staffUser.name,
            comment: `تحديث حالة الطلب (${data.ref_id}) إلى ${status} بواسطة ${staffUser.name}`,
          });
        }
        await supabase.from("audit_logs").insert({
          user_email: staffUser.email,
          action: "INQUIRY_UPDATED",
          resource_type: "inquiries",
          resource_id: data.ref_id,
          details: {
            ref_id: data.ref_id,
            status: status ?? data.status,
            assigned_to: assignedTo ?? data.assigned_to,
            actor: staffUser.name,
          },
        });
        return NextResponse.json({
          success: true,
          inquiry: mapSupabaseRowToInquiry(data),
          source: "supabase",
        });
      }
    }

    if (index === -1) {
      return NextResponse.json(
        { error: "لم يتم العثور على الطلب المطلوب." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      inquiry: inquiries[index],
      source: "local_fallback",
    });
  } catch (error) {
    console.error("Error updating inquiry:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء تحديث حالة الطلب." },
      { status: 500 }
    );
  }
}
