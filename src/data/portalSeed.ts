import { InquiryRecord } from "@/app/api/inquiries/route";

export const SEEDED_INQUIRIES: InquiryRecord[] = [
  {
    id: "inq_seed_101",
    refId: "RAO-2026-101",
    createdAt: "2024-11-20T08:30:00.000Z",
    entityType: "charity",
    entityTypeName: "جمعية أهلية",
    entityName: "جمعية البر الأهلية بالرياض",
    services: ["governance"],
    serviceNames: ["مسارات تأسيس وحوكمة القطاع غير الربحي"],
    notes: "طلب إعداد وتحديث اللائحة الأساسية وفق معايير المركز الوطني 2024 وتأهيل ملف الحوكمة.",
    projectName: "مشروع الامتثال والحوكمة السنوية",
    city: "الرياض",
    budgetRange: "200,000 - 500,000 ريال",
    timeline: "فوري (خلال 30 يوماً)",
    needType: "دراسة وتخطيط وحوكمة فقط",
    contactName: "أ. صالح بن عبد الله المنصور",
    contactRole: "المدير التنفيذي",
    contactPhone: "+966501234567",
    contactEmail: "s.mansoor@albir-riyadh.sa",
    meetingPreference: "عن بُعد عبر Teams / Zoom",
    status: "new",
    whatsappUrl: "https://wa.me/966575999956?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%20%D8%B7%D9%84%D8%A8%20RAO-2026-101",
  },
  {
    id: "inq_seed_102",
    refId: "RAO-2026-102",
    createdAt: "2024-11-19T10:15:00.000Z",
    entityType: "waqf",
    entityTypeName: "مؤسسة أهلية أو وقف خيري",
    entityName: "وقف الشيخ عبد الرحمن الراجحي",
    services: ["contracting", "procurement"],
    serviceNames: ["المقاولات والتطوير الإنشائي", "التجهيز والتوريد المتكامل"],
    notes: "تأهيل وترميم المقر الوقفي بحي الملز وتجهيزه بأنظمة تأثيث مكتبية ذكية وتسليمه على المفتاح.",
    projectName: "تطوير وتجهيز المقر الوقفي المركزي",
    city: "الرياض",
    budgetRange: "500,000 - 1,500,000 ريال",
    timeline: "فوري (خلال 30 يوماً)",
    needType: "تنفيذ تسليم مفتاح متكامل",
    contactName: "م. بدر بن سعد العتيبي",
    contactRole: "ناظر الوقف ومدير المشاريع",
    contactPhone: "+966559876543",
    contactEmail: "badr@rajhi-waqf.org.sa",
    meetingPreference: "زيارة لمقرنا في الرياض",
    status: "reviewing",
    whatsappUrl: "https://wa.me/966575999956?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%20%D8%B7%D9%84%D8%A8%20RAO-2026-102",
  },
  {
    id: "inq_seed_103",
    refId: "RAO-2026-103",
    createdAt: "2024-11-18T14:40:00.000Z",
    entityType: "private",
    entityTypeName: "شركة أو قطاع خاص",
    entityName: "شركة أصول التطوير العقاري",
    services: ["tech-solutions", "operations"],
    serviceNames: ["التقنية والحلول الذكية", "التشغيل والصيانة المستدامة"],
    notes: "ربط تقني وتشغيل سحابي لإدارة مرافق مجمع سكني وتجاري يشمل 40 وحدة.",
    projectName: "إدارة وتشغيل المرافق الذكية",
    city: "جدة",
    budgetRange: "أكثر من 1,500,000 ريال",
    timeline: "خلال الربع الحالي",
    needType: "تشغيل وصيانة وإسناد دوري",
    contactName: "أ. مشعل بن طارق الزهراني",
    contactRole: "مدير العمليات والتشغيل",
    contactPhone: "+966543210987",
    contactEmail: "m.zahrani@osool-dev.sa",
    meetingPreference: "عن بُعد عبر Teams / Zoom",
    status: "contacted",
    whatsappUrl: "https://wa.me/966575999956?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%20%D8%B7%D9%84%D8%A8%20RAO-2026-103",
  },
  {
    id: "inq_seed_104",
    refId: "RAO-2026-104",
    createdAt: "2024-11-17T09:20:00.000Z",
    entityType: "charity",
    entityTypeName: "جمعية أهلية",
    entityName: "جمعية رعاية الأيتام بعسير (بناء)",
    services: ["governance", "social-initiatives"],
    serviceNames: ["مسارات تأسيس وحوكمة القطاع غير الربحي", "المشاريع والمبادرات المجتمعية"],
    notes: "إصدار ترخيص حملة جمع تبرعات وتأهيل الفرص على منصة إحسان مع قياس SROI التنموي.",
    projectName: "برنامج كفالة وتمكين الأيتام التنموي",
    city: "عسير وأبها",
    budgetRange: "200,000 - 500,000 ريال",
    timeline: "فوري (خلال 30 يوماً)",
    needType: "تنفيذ تسليم مفتاح متكامل",
    contactName: "د. هيفاء بنت أحمد الشهري",
    contactRole: "رئيسة لجنة التنمية والموارد",
    contactPhone: "+966567891234",
    contactEmail: "h.shehri@benaa-asir.org.sa",
    meetingPreference: "اتصال هاتفي مباشر",
    status: "proposal_sent",
    whatsappUrl: "https://wa.me/966575999956?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%20%D8%B7%D9%84%D8%A8%20RAO-2026-104",
  },
];

export interface MarjeaCmsItem {
  id: string;
  code: string;
  title: string;
  category: string;
  status: "draft" | "in_review" | "published";
  makerName: string; // المحرر
  checkerName?: string; // المراجع
  lastModified: string;
  version: string;
  notes?: string;
}

export const SEEDED_CMS_ITEMS: MarjeaCmsItem[] = [
  {
    id: "cms_1",
    code: "GOV-AGM-01",
    title: "عقد اجتماع الجمعية العمومية العادية (السنوية)",
    category: "الحوكمة واللوائح",
    status: "published",
    makerName: "أ. نورة القحطاني",
    checkerName: "د. عبد الله الغامدي",
    lastModified: "2024-11-20",
    version: "v2.4 (معتمد 2024)",
    notes: "تمت مواءمة الإجراء مع التعميم الصادر من المركز الوطني رقم 1446-ق-09.",
  },
  {
    id: "cms_2",
    code: "EST-LIC-02",
    title: "تأسيس وترخيص جمعية أهلية جديدة بالمملكة",
    category: "التأسيس والتراخيص",
    status: "published",
    makerName: "أ. نورة القحطاني",
    checkerName: "د. عبد الله الغامدي",
    lastModified: "2024-11-18",
    version: "v2.1",
    notes: "تحديث شروط الأهلية والربط مع النفاذ الوطني.",
  },
  {
    id: "cms_3",
    code: "GOV-ELE-03",
    title: "انتخاب وتشكيل مجلس إدارة جديد للجمعية",
    category: "الحوكمة واللوائح",
    status: "published",
    makerName: "أ. نورة القحطاني",
    checkerName: "د. عبد الله الغامدي",
    lastModified: "2024-11-15",
    version: "v1.9",
    notes: "إضافة ضوابط الاقتراع السري الإلكتروني.",
  },
  {
    id: "cms_4",
    code: "FIN-BNK-04",
    title: "فتح وتفعيل الحسابات البنكية وإدارة التواقيع المعتمدة",
    category: "المالية والمصارف",
    status: "in_review",
    makerName: "أ. نورة القحطاني",
    checkerName: "د. عبد الله الغامدي",
    lastModified: "2024-11-21",
    version: "v2.0 (مسودة للمراجعة)",
    notes: "بانتظار مصادقة مراجع الحوكمة على التعديل الخاص باشتراط التوقيع المزدوج الإلكتروني.",
  },
  {
    id: "cms_5",
    code: "DIG-EHS-05",
    title: "التسجيل والاعتماد في المنصة الوطنية للعمل الخيري (إحسان)",
    category: "المنصات الحكومية والرقمية",
    status: "published",
    makerName: "أ. نورة القحطاني",
    checkerName: "د. عبد الله الغامدي",
    lastModified: "2024-11-12",
    version: "v1.8",
  },
  {
    id: "cms_6",
    code: "WQF-BYL-07",
    title: "صياغة اللائحة الأساسية للأوقاف العائلية والاستثمارية",
    category: "الأوقاف والوصايا",
    status: "draft",
    makerName: "أ. نورة القحطاني",
    lastModified: "2024-11-22",
    version: "v1.0 (مسودة تحرير أولية)",
    notes: "إعداد مسودة بنود مجلس النظارة وآلية توزيع المصارف وإعادة الاستثمار.",
  },
];

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  roleId: string;
  department: string;
  status: "نشط" | "في إجازة";
  accessScope: string;
  lastLogin: string;
}

export const SEEDED_TEAM_MEMBERS: TeamMember[] = [
  {
    id: "tm_1",
    name: "م. عبد العزيز بن سلطان",
    email: "ceo@rawasialomar.sa",
    role: "المدير العام والشريك المؤسس",
    roleId: "super_admin",
    department: "الإدارة التنفيذية",
    status: "نشط",
    accessScope: "صلاحيات كاملة شاملة لكافة القطاعات واللوحات",
    lastLogin: "الآن (نشط)",
  },
  {
    id: "tm_2",
    name: "أ. فيصل بن خالد الحربي",
    email: "f.harbi@rawasialomar.sa",
    role: "مدير قطاع المقاولات والتطوير",
    roleId: "sector_manager",
    department: "المشاريع والتطوير الإنشائي",
    status: "نشط",
    accessScope: "إدارة طلبات قطاع المقاولات والتجهيز وإرسال العروض",
    lastLogin: "اليوم 08:30 ص",
  },
  {
    id: "tm_3",
    name: "أ. نورة بنت فهد القحطاني",
    email: "n.qahtani@rawasialomar.sa",
    role: "أخصائي التحرير والمعرفة غير الربحية",
    roleId: "marjea_editor",
    department: "مركز المعرفة والتوثيق الإجرائي",
    status: "نشط",
    accessScope: "صانع المعرفة (Maker): إنشاء وتعديل مسودات الأدلة والنماذج",
    lastLogin: "اليوم 09:12 ص",
  },
  {
    id: "tm_4",
    name: "د. عبد الله بن صالح الغامدي",
    email: "a.ghamdi@rawasialomar.sa",
    role: "مستشار الحوكمة والرقابة النظامية",
    roleId: "governance_reviewer",
    department: "الامتثال والرقابة واللوائح",
    status: "نشط",
    accessScope: "مراجع معتمد (Checker): مراجعة واعتماد نشر الأدلة ونماذج اللوائح",
    lastLogin: "أمس 04:45 م",
  },
];
