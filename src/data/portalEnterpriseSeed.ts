export interface AttendanceRecord {
  id: string;
  staffId: string;
  staffName: string;
  department: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  totalHours?: number;
  status: "present" | "late" | "absent" | "excused";
  notes?: string;
}

export interface LeaveRecord {
  id: string;
  staffId: string;
  staffName: string;
  department: string;
  leaveType: "annual" | "sick" | "emergency";
  leaveTypeName: string;
  startDate: string;
  endDate: string;
  daysCount: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  approvedBy?: string;
  createdAt: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  sectorSlug: "contracting" | "supply" | "tech" | "operations" | "community";
  sectorName: string;
  clientName: string;
  city: string;
  budgetRange: string;
  summary: string;
  scope: string[];
  beforeImage: string;
  afterImage: string;
  status: "completed" | "in_progress";
  isPublished: boolean;
  completionDate: string;
}

export interface InitiativeRecord {
  id: string;
  title: string;
  partnerName: string;
  sector: string;
  targetBeneficiaries: number;
  achievedBeneficiaries: number;
  progressPct: number;
  sroiScore: string;
  status: "active" | "completed" | "planning";
  budget: string;
  milestones: {
    title: string;
    completed: boolean;
  }[];
}

export interface AuditLogRecord {
  id: string;
  actorName: string;
  actorRole: string;
  actionType: string;
  entityType: string;
  entityId: string;
  details: string;
  timestamp: string;
}

export const SEEDED_ATTENDANCE: AttendanceRecord[] = [
  {
    id: "att_1",
    staffId: "tm_1",
    staffName: "م. عبد العزيز بن سلطان",
    department: "الإدارة التنفيذية",
    date: "2026-11-25",
    checkIn: "08:15 ص",
    checkOut: "04:30 م",
    totalHours: 8.25,
    status: "present",
    notes: "حضور في الموعد ومتابعة تقارير المشاريع",
  },
  {
    id: "att_2",
    staffId: "tm_2",
    staffName: "أ. فيصل بن خالد الحربي",
    department: "المشاريع والتطوير الإنشائي",
    date: "2026-11-25",
    checkIn: "08:05 ص",
    checkOut: "04:15 م",
    totalHours: 8.16,
    status: "present",
    notes: "زيارة ميدانية لموقع مشروع الملز",
  },
  {
    id: "att_3",
    staffId: "tm_3",
    staffName: "أ. نورة بنت فهد القحطاني",
    department: "مركز المعرفة والتوثيق الإجرائي",
    date: "2026-11-25",
    checkIn: "08:45 ص",
    checkOut: "04:45 م",
    totalHours: 8.0,
    status: "late",
    notes: "تأخر 15 دقيقة بعذر مسبق",
  },
  {
    id: "att_4",
    staffId: "tm_4",
    staffName: "د. عبد الله بن صالح الغامدي",
    department: "الامتثال والرقابة واللوائح",
    date: "2026-11-25",
    checkIn: "08:20 ص",
    checkOut: "04:20 م",
    totalHours: 8.0,
    status: "present",
    notes: "مراجعة لوائح الحوكمة للأوقاف",
  },
  {
    id: "att_5",
    staffId: "tm_5",
    staffName: "أ. سارة بنت عبد الله السالم",
    department: "الموارد البشرية والشؤون الإدارية",
    date: "2026-11-25",
    checkIn: "08:10 ص",
    checkOut: "04:10 م",
    totalHours: 8.0,
    status: "present",
    notes: "متابعة سجلات الحضور وتأهيل الكوادر",
  },
];

export const SEEDED_LEAVES: LeaveRecord[] = [
  {
    id: "lev_1",
    staffId: "tm_3",
    staffName: "أ. نورة بنت فهد القحطاني",
    department: "مركز المعرفة والتوثيق الإجرائي",
    leaveType: "annual",
    leaveTypeName: "إجازة اعتيادية سنوية",
    startDate: "2026-12-01",
    endDate: "2026-12-05",
    daysCount: 5,
    reason: "إجازة سنوية مجدولة مسبقاً",
    status: "approved",
    approvedBy: "م. عبد العزيز بن سلطان",
    createdAt: "2026-11-20",
  },
  {
    id: "lev_2",
    staffId: "tm_2",
    staffName: "أ. فيصل بن خالد الحربي",
    department: "المشاريع والتطوير الإنشائي",
    leaveType: "emergency",
    leaveTypeName: "إجازة طارئة / استئذان رسمي",
    startDate: "2026-11-28",
    endDate: "2026-11-28",
    daysCount: 1,
    reason: "مراجعة جهة حكومية معمارية",
    status: "pending",
    createdAt: "2026-11-24",
  },
];

export const SEEDED_PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: "prj_1",
    title: "تأهيل وترميم المقر الوقفي المركزي - حي الملز",
    sectorSlug: "contracting",
    sectorName: "المقاولات والتطوير الإنشائي",
    clientName: "وقف الشيخ عبد الرحمن الراجحي",
    city: "الرياض",
    budgetRange: "1,200,000 ريال",
    summary:
      "تنفيذ متكامل بنموذج تسليم المفتاح شمل التدعيم الإنشائي، التشطيبات الذكية، واستيفاء أنظمة الدفاع المدني المعتمدة.",
    scope: [
      "إعادة الهيكلة والتوزيع الفراغي للمكاتب",
      "تشطيبات معمارية فاخرة وأنظمة عزل صوتي",
      "شبكات كهروميكانيك ذكية وتكييف مركزي",
    ],
    beforeImage:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
    afterImage:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    status: "completed",
    isPublished: true,
    completionDate: "2026-10-15",
  },
  {
    id: "prj_2",
    title: "التجهيز والتأثيث المكتبي الذكي لمركز التدريب المجتمعي",
    sectorSlug: "supply",
    sectorName: "التجهيز والتوريد المتكامل",
    clientName: "جمعية البر الأهلية",
    city: "الرياض",
    budgetRange: "450,000 ريال",
    summary:
      "تأثيث وتوريد تجهيزات مكتبية وقاعات تدريبية مجهزة بشاشات تفاعلية وحلول صوتية وبصرية متكاملة.",
    scope: [
      "توريد مقاعد ومكاتب عمل بيئية معتمدة",
      "تجهيز 3 قاعات تدريب بأنظمة العرض الذكي",
      "تجهيزات غرف الاجتماعات والبنية السلكية",
    ],
    beforeImage:
      "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=800&q=80",
    afterImage:
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80",
    status: "completed",
    isPublished: true,
    completionDate: "2026-09-30",
  },
  {
    id: "prj_3",
    title: "الربط التقني وأتمتة العمليات وإدارة مرافق مجمع سكني وتجاري",
    sectorSlug: "tech",
    sectorName: "التقنية والحلول الذكية",
    clientName: "شركة أصول التطوير العقاري",
    city: "جدة",
    budgetRange: "1,850,000 ريال",
    summary:
      "تأسيس البنية السحابية وإدارة المرافق بأنظمة IoT الذكية مع منصة تتبع الصيانة الوقائية الفورية.",
    scope: [
      "نظام المراقبة والتحكم في الدخول الذكي",
      "منصة إدارة المرافق وخدمات الصيانة",
      "لوحات تحكم استهلاك الطاقة والمياه",
    ],
    beforeImage:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    afterImage:
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=800&q=80",
    status: "in_progress",
    isPublished: true,
    completionDate: "2026-12-30",
  },
];

export const SEEDED_INITIATIVES: InitiativeRecord[] = [
  {
    id: "ini_1",
    title: "مبادرة تأهيل وتمكين حوكمة 20 جمعية ناشئة",
    partnerName: "المركز الوطني لتنمية القطاع غير الربحي",
    sector: "الحوكمة والتمكين",
    targetBeneficiaries: 20,
    achievedBeneficiaries: 16,
    progressPct: 80,
    sroiScore: "1 : 4.2 ر.س أثر اجتماعي",
    status: "active",
    budget: "600,000 ريال",
    milestones: [
      { title: "التشخيص الأولي وحصر الاحتياج النظامي", completed: true },
      { title: "صياغة وتعديل اللوائح الأساسية والسياسات", completed: true },
      { title: "التأهيل للاعتماد في منصة إحسان والمنصات الوطنية", completed: true },
      { title: "التقييم الختامي وإصدار شهادات الامتثال", completed: false },
    ],
  },
  {
    id: "ini_2",
    title: "برنامج استدامة الأصول الوقفية وتنمية العوائد",
    partnerName: "الهيئة العامة للأوقاف ونظار أوقاف الرياض",
    sector: "الأوقاف والاستثمار",
    targetBeneficiaries: 10,
    achievedBeneficiaries: 7,
    progressPct: 70,
    sroiScore: "1 : 5.1 ر.س أثر اجتماعي",
    status: "active",
    budget: "850,000 ريال",
    milestones: [
      { title: "المسح الهندسي للأصول العقارية الوقفية", completed: true },
      { title: "إعداد جداول الكميات ودراسات الجدوى للترميم", completed: true },
      { title: "طرح مناقصات التنفيذ والترسية", completed: true },
      { title: "إعادة التشغيل والتسليم للنظار", completed: false },
    ],
  },
];

export const SEEDED_AUDIT_LOGS: AuditLogRecord[] = [
  {
    id: "aud_1",
    actorName: "م. عبد العزيز بن سلطان",
    actorRole: "super_admin",
    actionType: "تعديل إعدادات",
    entityType: "إعدادات المنصة",
    entityId: "CFG-WHATSAPP",
    details: "تحديث رقم الواتساب الرسمي المعتمد للمنصة إلى 966575999956 ومزامنته بجميع الأنظمة",
    timestamp: "2026-11-25 01:52 م",
  },
  {
    id: "aud_2",
    actorName: "د. عبد الله الغامدي",
    actorRole: "governance_reviewer",
    actionType: "اعتماد نشر",
    entityType: "دليل إجرائي",
    entityId: "GOV-AGM-01",
    details: "مصادقة واعتماد دليل عقد اجتماع الجمعية العمومية بعد مواءمته مع لائحة 2026",
    timestamp: "2026-11-25 11:30 ص",
  },
  {
    id: "aud_3",
    actorName: "أ. فيصل الحربي",
    actorRole: "sector_manager",
    actionType: "تحديث طلب",
    entityType: "طلب مشروع CRM",
    entityId: "RAO-2026-102",
    details: "إحالة دراسة جدول الكميات وزيارة الموقع لمشروع ترميم المقر الوقفي بالملز",
    timestamp: "2026-11-25 10:15 ص",
  },
  {
    id: "aud_4",
    actorName: "أ. نورة القحطاني",
    actorRole: "marjea_editor",
    actionType: "إنشاء مسودة",
    entityType: "نموذج سحابي",
    entityId: "TMP-DOCX-18",
    details: "إنشاء وتوليد نموذج محضر اجتماع الجمعية العمومية المعتمد بصيغة OpenXML",
    timestamp: "2026-11-24 03:40 م",
  },
];
