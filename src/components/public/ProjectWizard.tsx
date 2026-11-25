"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  Check,
  ArrowLeft,
  ArrowRight,
  Phone,
  Building,
  Landmark,
  HeartHandshake,
  Briefcase,
  Layers,
  MapPin,
  Calendar,
  Wallet,
  Clock,
  User,
  Mail,
  MessageCircle,
  Copy,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ExternalLink,
} from "lucide-react";

// Track / Sector Definitions
interface ServiceOption {
  id: string;
  badge: string;
  title: string;
  description: string;
  tags: string[];
}

const SERVICES_LIST: ServiceOption[] = [
  {
    id: "governance",
    badge: "مسار قيادي",
    title: "مسارات تأسيس وحوكمة القطاع غير الربحي",
    description:
      "استخراج التراخيص، إعداد اللوائح الأساسية، وامتثال معايير الحوكمة الشاملة وفق متطلبات المركز الوطني.",
    tags: ["تأسيس وترخيص", "حوكمة 100%", "استشارات إدارية"],
  },
  {
    id: "contracting",
    badge: "تنفيذ هندسي",
    title: "المقاولات والتطوير الإنشائي",
    description:
      "تجهيز المقرات، التأهيل المعماري، وأعمال التشطيبات الفاخرة المعتمدة للمباني والمقرات الوقفية والمجتمعية.",
    tags: ["مقاولات معتمدة", "تسليم مفتاح", "جودة تنفيذ"],
  },
  {
    id: "procurement",
    badge: "إمداد وتجهيز",
    title: "التجهيز والتوريد المتكامل",
    description:
      "تأثيث وتجهيز المكاتب والمقرات والمراكز التعليمية والمجتمعية بأحدث المعايير الوظيفية.",
    tags: ["توريد شامل", "سلاسل إمداد", "تجهيز مقرات"],
  },
  {
    id: "tech-solutions",
    badge: "تحول رقمي",
    title: "التقنية والحلول الذكية",
    description:
      "بناء البنى الرقمية، منصات ERP المتخصصة، الأرشفة، والربط التقني مع المنصات الوطنية الرسمية.",
    tags: ["تحول رقمي", "أنظمة سحابية ERP", "بوابات إلكترونية"],
  },
  {
    id: "operations",
    badge: "تشغيل واستدامة",
    title: "التشغيل والصيانة المستدامة",
    description:
      "إدارة المرافق، خطط الصيانة الوقائية والتشغيل المنهجي للحفاظ على القيمة السوقية والإنتاجية للأصول.",
    tags: ["إدارة مرافق", "صيانة وقائية دورية", "استدامة الأصول"],
  },
  {
    id: "social-initiatives",
    badge: "أثر مجتمعي",
    title: "المشاريع والمبادرات المجتمعية",
    description:
      "صياغة المبادرات ذات الأثر المستدام، وإعداد مؤشرات قياس العائد الاجتماعي على الاستثمار (SROI).",
    tags: ["استدامة الأثر", "قياس SROI المعتمد", "تصميم مبادرات"],
  },
];

// Entity Types
interface EntityOption {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

const ENTITY_OPTIONS: EntityOption[] = [
  {
    id: "charity",
    title: "جمعية أهلية",
    subtitle: "مرخصة من المركز الوطني لتنمية القطاع غير الربحي",
    icon: <HeartHandshake className="w-6 h-6 text-[#2360A5]" />,
  },
  {
    id: "waqf",
    title: "مؤسسة أهلية أو وقف خيري",
    subtitle: "أوقاف عائلية، وصايا، مؤسسات أهلية مانحة ومستدامة",
    icon: <Landmark className="w-6 h-6 text-[#2360A5]" />,
  },
  {
    id: "donor",
    title: "جهة مانحة أو صندوق تنموي",
    subtitle: "صناديق استثمارية، برامج المسؤولية الاجتماعية للشركات",
    icon: <Layers className="w-6 h-6 text-[#3488C4]" />,
  },
  {
    id: "private",
    title: "شركة أو قطاع خاص",
    subtitle: "شركات استثمار وتطوير عقاري، مقاولات، وخدمات عامة",
    icon: <Building className="w-6 h-6 text-[#47A3B8]" />,
  },
  {
    id: "government",
    title: "جهة حكومية أو شبه حكومية",
    subtitle: "مبادرات رؤية 2030، هيئات وطنية، وبرامج قطاعية تنموية",
    icon: <Briefcase className="w-6 h-6 text-[#163063]" />,
  },
];

export function ProjectWizard() {
  const searchParams = useSearchParams();

  // Wizard Step (1 to 4)
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [entityType, setEntityType] = useState("charity");
  const [entityName, setEntityName] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([
    "governance",
    "contracting",
  ]);
  const [projectNotes, setProjectNotes] = useState("");

  // Step 3 Fields
  const [projectName, setProjectName] = useState("");
  const [city, setCity] = useState("الرياض");
  const [budgetRange, setBudgetRange] = useState("500,000 - 1,500,000 ريال");
  const [timeline, setTimeline] = useState("فوري (خلال 30 يوماً)");
  const [needType, setNeedType] = useState("تنفيذ تسليم مفتاح متكامل");

  // Step 4 Fields
  const [contactName, setContactName] = useState("");
  const [contactRole, setContactRole] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [meetingPreference, setMeetingPreference] = useState(
    "عن بُعد عبر Teams / Zoom"
  );
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedRefId, setSubmittedRefId] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [copiedRef, setCopiedRef] = useState(false);

  // Handle URL query pre-selection (e.g., ?track=governance, ?sector=tech, ?procedure=agm-meeting)
  useEffect(() => {
    if (!searchParams) return;

    const trackParam =
      searchParams.get("track") || searchParams.get("sector");
    const entityParam = searchParams.get("entity");
    const procParam = searchParams.get("procedure");
    const blueprintParam = searchParams.get("blueprint");

    if (blueprintParam) {
      if (blueprintParam === "BP-NPO-01") {
        setEntityType("charity");
        setSelectedServices(["governance", "contracting", "procurement", "tech-solutions"]);
        setProjectNotes((prev) =>
          prev || "طلب تنفيذ نموذج إطلاق وتشغيل مقر جمعية أهلية متكامل (BP-NPO-01)."
        );
      } else if (blueprintParam === "BP-WQF-02") {
        setEntityType("waqf");
        setSelectedServices(["contracting", "operations", "social-initiatives"]);
        setProjectNotes((prev) =>
          prev || "طلب تنفيذ نموذج تأهيل وتشغيل الأصل الوقفي المستدام (BP-WQF-02)."
        );
      } else if (blueprintParam === "BP-CSR-03") {
        setEntityType("private");
        setSelectedServices(["social-initiatives", "governance", "tech-solutions"]);
        setProjectNotes((prev) =>
          prev || "طلب تنفيذ نموذج مبادرة مسؤولية اجتماعية للشركات (BP-CSR-03)."
        );
      }
    }

    if (trackParam) {
      const trackMap: Record<string, string> = {
        governance: "governance",
        "non-profit": "governance",
        contracting: "contracting",
        supply: "procurement",
        procurement: "procurement",
        tech: "tech-solutions",
        operations: "operations",
        community: "social-initiatives",
      };
      const mapped = trackMap[trackParam];
      if (mapped) {
        setSelectedServices((prev) =>
          prev.includes(mapped) ? prev : [...prev, mapped]
        );
      }
    }

    if (entityParam && ENTITY_OPTIONS.some((e) => e.id === entityParam)) {
      setEntityType(entityParam);
    }

    if (procParam) {
      setSelectedServices((prev) =>
        prev.includes("governance") ? prev : [...prev, "governance"]
      );
      setProjectNotes((prev) =>
        prev
          ? prev
          : `طلب تنفيذ إجرائي رسمي عبر مرجع الجمعيات: رمز الإجراء (${procParam}).`
      );
    }
  }, [searchParams]);

  // Toggle multi-select services
  const toggleService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  // Step 1 validation & proceed
  const proceedToStep2 = () => {
    if (!entityType) {
      setErrorMsg("الرجاء اختيار نوع الجهة للمتابعة.");
      return;
    }
    setErrorMsg("");
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Step 2 validation & proceed
  const proceedToStep3 = () => {
    if (selectedServices.length === 0) {
      setErrorMsg("الرجاء تحديد قطاع أو خدمة واحدة على الأقل.");
      return;
    }
    setErrorMsg("");
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Step 3 validation & proceed
  const proceedToStep4 = () => {
    setErrorMsg("");
    setCurrentStep(4);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Step 4: Handle Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!contactName.trim()) {
      setErrorMsg("الرجاء إدخال اسم ممثل الجهة.");
      return;
    }
    if (!contactPhone.trim()) {
      setErrorMsg("الرجاء إدخال رقم الجوال للتواصل.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entityType,
          entityName,
          services: selectedServices,
          notes: projectNotes,
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
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "فشل إرسال الطلب.");
      }

      setSubmittedRefId(data.refId);
      setWhatsappUrl(data.whatsappUrl);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setErrorMsg(err.message || "حدث خطأ غير متوقع. يرجى المحاولة لاحقاً.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyRef = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(submittedRefId);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  return (
    <div className="w-full bg-white flex-1 flex flex-col font-arabic">
      {/* Top Banner with Hotline and Breadcrumb */}
      <div className="w-full bg-[#F2F8FC] border-b border-[#E2ECF5] py-3.5 px-4 sm:px-8">
        <div className="max-w-[1720px] mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-[#526071]">
            <Link href="/" className="hover:text-[#163063] transition-colors">
              الرئيسية
            </Link>
            <span className="text-[#E2ECF5]">/</span>
            <span className="text-[#163063] font-bold">
              معالج تأهيل وبدء المشاريع
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[#163063]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#47A3B8] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#47A3B8]" />
            </span>
            <span className="text-[#526071]">استشارات المشاريع والجهات:</span>
            <a
              href="tel:+966575999956"
              dir="ltr"
              className="font-bold text-[#2360A5] hover:text-[#163063]"
            >
              +966 57 599 9956
            </a>
          </div>
        </div>
      </div>

      {/* Main Split Layout: Right Sidebar + Left Form Canvas */}
      <main className="flex-1 flex flex-col lg:flex-row w-full max-w-[1720px] mx-auto">
        {/* RIGHT SIDEBAR (Executive Deep Royal Navy #163063) */}
        <aside
          className="w-full lg:w-[36%] bg-[#163063] text-white architectural-pattern p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden border-l border-[#E2ECF5]/20 shrink-0"
          data-purpose="sidebar-stepper"
        >
          {/* Architectural Background Watermark */}
          <div className="arch-watermark">
            <div className="arch-watermark-inner" />
          </div>

          <div className="relative z-10">
            {/* Wizard Title Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3488C4]/20 border border-[#3488C4]/40 text-[#3488C4] text-xs font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-[#3488C4]" />
              <span>معالج دراسة وتأهيل المشروع</span>
            </div>

            {/* Main Title & Positioning */}
            <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight tracking-tight mb-3">
              لنصنع معاً مشروعاً مستداماً
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mb-10 font-normal">
              منظومة تنفيذية وتطويرية واحدة تتولى فكرتك من دراسة المتطلبات
              وتأطير الحوكمة حتى استقرار التشغيل الميداني الفعلي.
            </p>

            {/* Vertical Stepper Component */}
            <nav aria-label="مراحل تأهيل المشروع" className="space-y-6">
              {/* Step 1 */}
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-all ${
                      currentStep > 1 || isSubmitted
                        ? "bg-[#47A3B8]/20 border-2 border-[#47A3B8] text-[#47A3B8]"
                        : currentStep === 1
                        ? "bg-[#3488C4] border-2 border-white text-white ring-4 ring-[#3488C4]/30"
                        : "bg-[#163063] border-2 border-white/30 text-white/60"
                    }`}
                  >
                    {currentStep > 1 || isSubmitted ? (
                      <Check className="w-5 h-5 text-[#47A3B8]" />
                    ) : (
                      "01"
                    )}
                  </div>
                  <div
                    className={`w-0.5 h-12 my-1 ${
                      currentStep > 1 ? "bg-[#47A3B8]/40" : "bg-white/20"
                    }`}
                  />
                </div>
                <div className="pt-1">
                  <span
                    className={`text-xs ${
                      currentStep === 1
                        ? "font-bold text-[#3488C4]"
                        : currentStep > 1
                        ? "text-[#47A3B8] font-medium"
                        : "text-white/60"
                    }`}
                  >
                    {currentStep > 1 ? "الخطوة 01 (مكتملة)" : "الخطوة 01"}
                  </span>
                  <h2 className="text-sm font-bold text-white">
                    نوع الجهة والشريك
                  </h2>
                  <p className="text-xs text-slate-300 mt-0.5 font-light">
                    {ENTITY_OPTIONS.find((e) => e.id === entityType)?.title ||
                      "تصنيف الكيان النظامي"}
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-all ${
                      currentStep > 2 || isSubmitted
                        ? "bg-[#47A3B8]/20 border-2 border-[#47A3B8] text-[#47A3B8]"
                        : currentStep === 2
                        ? "bg-[#3488C4] border-2 border-white text-white ring-4 ring-[#3488C4]/30"
                        : "bg-[#163063] border-2 border-white/30 text-white/60"
                    }`}
                  >
                    {currentStep > 2 || isSubmitted ? (
                      <Check className="w-5 h-5 text-[#47A3B8]" />
                    ) : (
                      "02"
                    )}
                  </div>
                  <div
                    className={`w-0.5 h-12 my-1 ${
                      currentStep > 2 ? "bg-[#47A3B8]/40" : "bg-white/20"
                    }`}
                  />
                </div>
                <div className="pt-1">
                  <span
                    className={`text-xs ${
                      currentStep === 2
                        ? "font-bold text-[#3488C4]"
                        : currentStep > 2
                        ? "text-[#47A3B8] font-medium"
                        : "text-white/60"
                    }`}
                  >
                    {currentStep > 2
                      ? "الخطوة 02 (مكتملة)"
                      : currentStep === 2
                      ? "قيد التحديد الآن"
                      : "الخطوة القادمة"}
                  </span>
                  <h2 className="text-sm font-bold text-white">
                    القطاعات ومجالات الخدمة
                  </h2>
                  <p className="text-xs text-slate-300 mt-0.5 font-light">
                    {selectedServices.length > 0
                      ? `${selectedServices.length} مسارات محددة`
                      : "تحديد مسارات الإسناد والتكامل"}
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-all ${
                      currentStep > 3 || isSubmitted
                        ? "bg-[#47A3B8]/20 border-2 border-[#47A3B8] text-[#47A3B8]"
                        : currentStep === 3
                        ? "bg-[#3488C4] border-2 border-white text-white ring-4 ring-[#3488C4]/30"
                        : "bg-[#163063] border-2 border-white/30 text-white/60"
                    }`}
                  >
                    {currentStep > 3 || isSubmitted ? (
                      <Check className="w-5 h-5 text-[#47A3B8]" />
                    ) : (
                      "03"
                    )}
                  </div>
                  <div
                    className={`w-0.5 h-12 my-1 ${
                      currentStep > 3 ? "bg-[#47A3B8]/40" : "bg-white/20"
                    }`}
                  />
                </div>
                <div className="pt-1">
                  <span
                    className={`text-xs ${
                      currentStep === 3
                        ? "font-bold text-[#3488C4]"
                        : currentStep > 3
                        ? "text-[#47A3B8] font-medium"
                        : "text-white/60"
                    }`}
                  >
                    {currentStep > 3
                      ? "الخطوة 03 (مكتملة)"
                      : currentStep === 3
                      ? "قيد التحديد الآن"
                      : "الخطوة القادمة"}
                  </span>
                  <h2 className="text-sm font-bold text-white">
                    نطاق المشروع والميزانية
                  </h2>
                  <p className="text-xs text-slate-300 mt-0.5 font-light">
                    {city} • {timeline}
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-all ${
                      isSubmitted
                        ? "bg-[#47A3B8]/20 border-2 border-[#47A3B8] text-[#47A3B8]"
                        : currentStep === 4
                        ? "bg-[#3488C4] border-2 border-white text-white ring-4 ring-[#3488C4]/30"
                        : "bg-[#163063] border-2 border-white/30 text-white/60"
                    }`}
                  >
                    {isSubmitted ? (
                      <Check className="w-5 h-5 text-[#47A3B8]" />
                    ) : (
                      "04"
                    )}
                  </div>
                </div>
                <div className="pt-1">
                  <span
                    className={`text-xs ${
                      currentStep === 4
                        ? "font-bold text-[#3488C4]"
                        : isSubmitted
                        ? "text-[#47A3B8] font-medium"
                        : "text-white/60"
                    }`}
                  >
                    {isSubmitted ? "تم التسليم" : "الخطوة النهائية"}
                  </span>
                  <h2 className="text-sm font-bold text-white">
                    بيانات التواصل وموعد الجلسة
                  </h2>
                  <p className="text-xs text-slate-300 mt-0.5 font-light">
                    {contactName || "الممثل المعتمد"}
                  </p>
                </div>
              </div>
            </nav>
          </div>

          {/* Bottom Trust Badge in Sidebar */}
          <div className="relative z-10 mt-12 pt-6 border-t border-white/10">
            <div className="rounded-xl p-4 bg-white/5 border border-[#47A3B8]/30 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-[#47A3B8]/20 text-[#47A3B8]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white leading-tight">
                    جهة واحدة، مسار واضح، والتزام 100%
                  </p>
                  <p className="text-[11px] text-[#47A3B8] font-medium mt-0.5">
                    حوكمة وامتثال لكافة الضوابط الرسمية
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-300 font-light mt-2 pt-2 border-t border-white/10 leading-relaxed">
                فريق استشاري وهندسي معتمد يتولى فحص المتطلبات والتواصل معكم خلال
                24 ساعة عمل.
              </p>
            </div>
          </div>
        </aside>

        {/* LEFT FORM CANVAS (Interactive White #FFFFFF Canvas) */}
        <section
          className="w-full lg:w-[64%] bg-white p-6 sm:p-10 lg:p-14 flex flex-col justify-between"
          data-purpose="form-interactive-canvas"
        >
          {/* CONFIRMATION SCREEN (Shown on successful submit) */}
          {isSubmitted ? (
            <div className="py-6 sm:py-10 max-w-2xl mx-auto text-center">
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-emerald-50 border-4 border-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F2F8FC] border border-[#E2ECF5] text-[#2360A5] text-xs font-bold mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#3488C4]" />
                <span>تم تأهيل وتسجيل الطلب بنجاح</span>
              </span>

              <h2 className="text-2xl sm:text-3xl font-bold text-[#163063] mb-3 leading-tight">
                شكراً لتواصلكم مع رواسي العمر
              </h2>
              <p className="text-sm sm:text-base text-[#526071] leading-relaxed mb-8 max-w-xl mx-auto">
                تم استلام طلب تأهيل مشروعكم رسمياً في منظومتنا الاستشارية، وسيقوم
                المستشار التنفيذي المخصص بمراجعة المتطلبات والتواصل معكم خلال 24
                ساعة عمل.
              </p>

              {/* Reference ID Card with Instant Copy */}
              <div className="bg-[#F2F8FC] border-2 border-[#2360A5]/30 rounded-2xl p-5 mb-8 text-right max-w-lg mx-auto shadow-sm">
                <div className="flex items-center justify-between mb-3 border-b border-[#E2ECF5] pb-2.5">
                  <span className="text-xs font-bold text-[#526071]">
                    الرقم المرجعي الرسمي للطلب:
                  </span>
                  <button
                    onClick={handleCopyRef}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2360A5] hover:text-[#163063] transition-colors"
                  >
                    {copiedRef ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">تم النسخ</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>نسخ الرقم</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-[#163063] tracking-wide">
                    {submittedRefId}
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-md bg-white border border-[#E2ECF5] text-[#163063] font-semibold">
                    {city} • {timeline}
                  </span>
                </div>
              </div>

              {/* Direct 1-Click Formatted WhatsApp Handoff Button */}
              <div className="space-y-4 max-w-lg mx-auto mb-8">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-3 py-4 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all group"
                >
                  <MessageCircle className="w-5 h-5 transition-transform group-hover:scale-110" />
                  <span>المتابعة الفورية عبر واتساب بالرقم المرجعي</span>
                  <ExternalLink className="w-4 h-4 opacity-75" />
                </a>

                <p className="text-xs text-[#526071]">
                  يحتوي الرابط على رسالة رسمية مهيأة تتضمن رقمكم المرجعي والمسارات
                  المختارة لبدء المحادثة المباشرة مع فريق رواسي العمر.
                </p>
              </div>

              {/* Navigation Back / Next Options */}
              <div className="pt-6 border-t border-[#E2ECF5] flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#E2ECF5] text-xs font-bold text-[#163063] hover:bg-[#F2F8FC] transition-colors"
                >
                  <span>العودة للصفحة الرئيسية</span>
                </Link>
                <Link
                  href="/marjea"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2360A5]/10 text-xs font-bold text-[#2360A5] hover:bg-[#2360A5]/20 transition-colors"
                >
                  <span>استكشاف مرجع الجمعيات</span>
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div>
              {/* Error Alert */}
              {errorMsg && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* STEP 1: نوع الجهة والشريك */}
              {currentStep === 1 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-sm font-bold text-[#2360A5] tracking-wide">
                      الخطوة 1 من 4: تصنيف الكيان
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-[#F2F8FC] border border-[#E2ECF5] rounded-md text-[#2360A5]">
                      25% مكتمل
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-[#163063] mb-2 tracking-tight leading-tight">
                    ما هو تصنيف ونوع جهتك أو منظمتكم؟
                  </h2>
                  <p className="text-sm sm:text-base text-[#526071] mb-8 font-normal leading-relaxed">
                    نخصص المسار الإجرائي والاستشاري والتنفيذي بحسب الطبيعة
                    القانونية والتنظيمية لكيانكم لضمان أعلى معايير الامتثال.
                  </p>

                  {/* Entity Choices */}
                  <div className="space-y-3 mb-8">
                    {ENTITY_OPTIONS.map((opt) => {
                      const isSelected = entityType === opt.id;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => setEntityType(opt.id)}
                          className={`p-4 sm:p-5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between gap-4 ${
                            isSelected
                              ? "border-[#2360A5] bg-[#F2F8FC] shadow-sm"
                              : "border-[#E2ECF5] bg-white hover:border-[#2360A5]/40 hover:bg-[#F2F8FC]/50"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-white border border-[#E2ECF5] shadow-xs">
                              {opt.icon}
                            </div>
                            <div>
                              <h3 className="text-sm sm:text-base font-bold text-[#163063]">
                                {opt.title}
                              </h3>
                              <p className="text-xs text-[#526071] mt-0.5">
                                {opt.subtitle}
                              </p>
                            </div>
                          </div>

                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                              isSelected
                                ? "border-[#2360A5] bg-[#2360A5] text-white"
                                : "border-[#E2ECF5] bg-white"
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Optional Entity Name Input */}
                  <div className="pt-2">
                    <label
                      htmlFor="entity-name"
                      className="block text-xs sm:text-sm font-bold text-[#163063] mb-2"
                    >
                      اسم الجمعية أو الوقف أو الشركة{" "}
                      <span className="text-xs font-normal text-[#526071]">
                        (اختياري):
                      </span>
                    </label>
                    <input
                      id="entity-name"
                      type="text"
                      value={entityName}
                      onChange={(e) => setEntityName(e.target.value)}
                      placeholder="مثال: جمعية رواسي الخيرية، وقف عبد الله العمر، شركة..."
                      className="w-full rounded-xl border border-[#E2ECF5] p-3.5 text-sm text-[#163063] placeholder:text-[#526071]/50 focus:border-[#2360A5] focus:ring-1 focus:ring-[#2360A5] transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: القطاعات ومجالات الخدمة */}
              {currentStep === 2 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-sm font-bold text-[#2360A5] tracking-wide">
                      الخطوة 2 من 4: حدد متطلبات مشروعك
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-[#F2F8FC] border border-[#E2ECF5] rounded-md text-[#2360A5]">
                      50% مكتمل
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-[#163063] mb-2 tracking-tight leading-tight">
                    ما هي القطاعات أو الخدمات التي تحتاجها منظمتكم؟
                  </h2>
                  <p className="text-sm sm:text-base text-[#526071] mb-8 font-normal leading-relaxed">
                    يمكنكم تحديد أكثر من مسار لتنفيذ مشروع تكاملي متجانس تحت
                    إشراف وإدارة تنفيذية موحدة من رواسي العمر.
                  </p>

                  {/* Multi-select Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {SERVICES_LIST.map((srv) => {
                      const isSelected = selectedServices.includes(srv.id);
                      return (
                        <div
                          key={srv.id}
                          onClick={() => toggleService(srv.id)}
                          className={`relative flex flex-col p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                            isSelected
                              ? "border-[#2360A5] bg-[#F2F8FC] shadow-sm hover:shadow-md"
                              : "border-[#E2ECF5] bg-white hover:border-[#2360A5]/60 hover:bg-slate-50/50"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div
                              className={`w-7 h-7 rounded-md flex items-center justify-center transition-all ${
                                isSelected
                                  ? "bg-[#2360A5] text-white shadow-inner"
                                  : "border border-[#E2ECF5] bg-white text-transparent"
                              }`}
                            >
                              <Check className="w-4 h-4 stroke-[3]" />
                            </div>
                            <span
                              className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
                                isSelected
                                  ? "text-[#2360A5] bg-white border-[#E2ECF5]"
                                  : "text-[#526071] bg-slate-50 border-[#E2ECF5]"
                              }`}
                            >
                              {srv.badge}
                            </span>
                          </div>

                          <h3 className="text-base font-bold text-[#163063] mb-1.5 leading-snug">
                            {srv.title}
                          </h3>
                          <p className="text-xs text-[#526071] leading-relaxed mb-4 flex-grow font-normal">
                            {srv.description}
                          </p>

                          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#E2ECF5]/80">
                            {srv.tags.map((tag, tIdx) => (
                              <span
                                key={tIdx}
                                className="text-[10px] font-medium bg-white text-[#163063] px-2 py-0.5 rounded border border-[#E2ECF5]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Supplementary Requirement Box */}
                  <div className="mt-8">
                    <label
                      htmlFor="project-notes"
                      className="block text-xs sm:text-sm font-bold text-[#163063] mb-2"
                    >
                      ملاحظات إضافية أو وصف موجز للمشروع{" "}
                      <span className="text-xs font-normal text-[#526071]">
                        (اختياري):
                      </span>
                    </label>
                    <textarea
                      id="project-notes"
                      value={projectNotes}
                      onChange={(e) => setProjectNotes(e.target.value)}
                      placeholder="اكتب هنا أية تفاصيل خاصة، موقع المشروع المستهدف، أو أي اشتراطات تود إبلاغ الفريق الاستشاري بها..."
                      rows={3}
                      className="w-full rounded-xl border border-[#E2ECF5] p-3.5 text-sm text-[#163063] placeholder:text-[#526071]/50 focus:border-[#2360A5] focus:ring-1 focus:ring-[#2360A5] transition-colors resize-none"
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: نطاق المشروع، المدينة، والجدول الزمني */}
              {currentStep === 3 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-sm font-bold text-[#2360A5] tracking-wide">
                      الخطوة 3 من 4: الإطار الجغرافي والمالي
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-[#F2F8FC] border border-[#E2ECF5] rounded-md text-[#2360A5]">
                      75% مكتمل
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-[#163063] mb-2 tracking-tight leading-tight">
                    نطاق المشروع، النطاق الجغرافي، والميزانية
                  </h2>
                  <p className="text-sm sm:text-base text-[#526071] mb-8 font-normal leading-relaxed">
                    تساعدنا هذه البيانات على تحديد الموارد الهندسية والكوادر
                    الميدانية الأنسب لمشروعكم.
                  </p>

                  <div className="space-y-6">
                    {/* Project Title */}
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-[#163063] mb-2">
                        اسم المشروع أو المبادرة (اسم تقديري):
                      </label>
                      <input
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        placeholder="مثال: مشروع تهيئة مقر الجمعية الرئيسي، تطوير حوكمة الوقف..."
                        className="w-full rounded-xl border border-[#E2ECF5] p-3.5 text-sm text-[#163063] placeholder:text-[#526071]/50 focus:border-[#2360A5] focus:ring-1 focus:ring-[#2360A5]"
                      />
                    </div>

                    {/* City & Timeline Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-[#163063] mb-2 flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-[#2360A5]" />
                          <span>المدينة / المنطقة بالمملكة:</span>
                        </label>
                        <select
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full rounded-xl border border-[#E2ECF5] p-3.5 text-sm text-[#163063] bg-white focus:border-[#2360A5] focus:ring-1 focus:ring-[#2360A5]"
                        >
                          <option value="الرياض">الرياض (المقر الرئيسي)</option>
                          <option value="جدة">جدة</option>
                          <option value="مكة المكرمة">مكة المكرمة</option>
                          <option value="المدينة المنورة">المدينة المنورة</option>
                          <option value="الدمام والخبر">المنطقة الشرقية (الدمام / الخبر)</option>
                          <option value="القصيم">القصيم (بريدة / عنيزة)</option>
                          <option value="عسير وأبها">عسير (أبها / خميس مشيط)</option>
                          <option value="تبوك">تبوك</option>
                          <option value="حائل">حائل</option>
                          <option value="أخرى">مدينة / منطقة أخرى</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-[#163063] mb-2 flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-[#3488C4]" />
                          <span>الجدول الزمني المستهدف للبدء:</span>
                        </label>
                        <select
                          value={timeline}
                          onChange={(e) => setTimeline(e.target.value)}
                          className="w-full rounded-xl border border-[#E2ECF5] p-3.5 text-sm text-[#163063] bg-white focus:border-[#2360A5] focus:ring-1 focus:ring-[#2360A5]"
                        >
                          <option value="فوري (خلال 30 يوماً)">
                            فوري (خلال 30 يوماً عمل)
                          </option>
                          <option value="خلال الربع الحالي">
                            خلال الربع الحالي (1-3 أشهر)
                          </option>
                          <option value="تخطيط استراتيجي للعام القادم">
                            تخطيط مستقبلي (أكثر من 3 أشهر)
                          </option>
                        </select>
                      </div>
                    </div>

                    {/* Budget Range & Need Type */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-[#163063] mb-2 flex items-center gap-1.5">
                          <Wallet className="w-4 h-4 text-[#47A3B8]" />
                          <span>الميزانية التقديرية المرصودة:</span>
                        </label>
                        <select
                          value={budgetRange}
                          onChange={(e) => setBudgetRange(e.target.value)}
                          className="w-full rounded-xl border border-[#E2ECF5] p-3.5 text-sm text-[#163063] bg-white focus:border-[#2360A5] focus:ring-1 focus:ring-[#2360A5]"
                        >
                          <option value="أقل من 200,000 ريال">أقل من 200,000 ريال</option>
                          <option value="200,000 - 500,000 ريال">200,000 - 500,000 ريال</option>
                          <option value="500,000 - 1,500,000 ريال">500,000 - 1,500,000 ريال</option>
                          <option value="أكثر من 1,500,000 ريال">أكثر من 1,500,000 ريال</option>
                          <option value="لم تحدد بعد">لم تحدد الميزانية بعد</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-[#163063] mb-2 flex items-center gap-1.5">
                          <Layers className="w-4 h-4 text-[#2360A5]" />
                          <span>طبيعة ونموذج الإسناد المطلوب:</span>
                        </label>
                        <select
                          value={needType}
                          onChange={(e) => setNeedType(e.target.value)}
                          className="w-full rounded-xl border border-[#E2ECF5] p-3.5 text-sm text-[#163063] bg-white focus:border-[#2360A5] focus:ring-1 focus:ring-[#2360A5]"
                        >
                          <option value="تنفيذ تسليم مفتاح متكامل">
                            تنفيذ تسليم مفتاح متكامل (استشارة + تنفيذ ميداني)
                          </option>
                          <option value="دراسة وتخطيط وحوكمة فقط">
                            دراسة وتخطيط وحوكمة استشارية فقط
                          </option>
                          <option value="تشغيل وصيانة وإسناد دوري">
                            تشغيل وصيانة وإسناد تنفيذي مرحلي
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: بيانات التواصل ومسؤول المشروع */}
              {currentStep === 4 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-sm font-bold text-[#2360A5] tracking-wide">
                      الخطوة 4 من 4: بيانات التواصل والاعتماد
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-md text-emerald-700">
                      95% مكتمل
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-[#163063] mb-2 tracking-tight leading-tight">
                    بيانات التواصل ومسؤول المشروع المعتمد
                  </h2>
                  <p className="text-sm sm:text-base text-[#526071] mb-8 font-normal leading-relaxed">
                    يرجى إدخال بيانات ضابط الاتصال أو صاحب القرار ليتمكن فريق
                    رواسي العمر من عقد جلسة المواءمة المبدئية وتزويدكم بالملف
                    التنفيذي.
                  </p>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-[#163063] mb-2 flex items-center gap-1.5">
                          <User className="w-4 h-4 text-[#2360A5]" />
                          <span>اسم ممثل الجهة / صاحب الطلب *</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="مثال: أ. عبد العزيز الدوسري"
                          className="w-full rounded-xl border border-[#E2ECF5] p-3.5 text-sm text-[#163063] placeholder:text-[#526071]/50 focus:border-[#2360A5] focus:ring-1 focus:ring-[#2360A5]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-[#163063] mb-2 flex items-center gap-1.5">
                          <Briefcase className="w-4 h-4 text-[#3488C4]" />
                          <span>المسمى الوظيفي:</span>
                        </label>
                        <input
                          type="text"
                          value={contactRole}
                          onChange={(e) => setContactRole(e.target.value)}
                          placeholder="مثال: الرئيس التنفيذي، ناظر الوقف، مدير المشاريع..."
                          className="w-full rounded-xl border border-[#E2ECF5] p-3.5 text-sm text-[#163063] placeholder:text-[#526071]/50 focus:border-[#2360A5] focus:ring-1 focus:ring-[#2360A5]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-[#163063] mb-2 flex items-center gap-1.5">
                          <Phone className="w-4 h-4 text-[#47A3B8]" />
                          <span>رقم الجوال للتواصل المباشر *</span>
                        </label>
                        <input
                          type="tel"
                          required
                          dir="ltr"
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          placeholder="+966 5x xxx xxxx"
                          className="w-full rounded-xl border border-[#E2ECF5] p-3.5 text-sm text-[#163063] placeholder:text-[#526071]/50 focus:border-[#2360A5] focus:ring-1 focus:ring-[#2360A5] text-right"
                        />
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-[#163063] mb-2 flex items-center gap-1.5">
                          <Mail className="w-4 h-4 text-[#2360A5]" />
                          <span>البريد الإلكتروني الرسمي:</span>
                        </label>
                        <input
                          type="email"
                          dir="ltr"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="info@yourorganization.sa"
                          className="w-full rounded-xl border border-[#E2ECF5] p-3.5 text-sm text-[#163063] placeholder:text-[#526071]/50 focus:border-[#2360A5] focus:ring-1 focus:ring-[#2360A5] text-right"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-[#163063] mb-2">
                        الأسلوب المفضل لعقد جلسة المواءمة الأولية:
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {[
                          "عن بُعد عبر Teams / Zoom",
                          "اتصال هاتفي مباشر",
                          "زيارة لمقرنا في الرياض",
                        ].map((pref) => (
                          <button
                            type="button"
                            key={pref}
                            onClick={() => setMeetingPreference(pref)}
                            className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                              meetingPreference === pref
                                ? "bg-[#2360A5] text-white border-[#2360A5] shadow-xs"
                                : "bg-white text-[#526071] border-[#E2ECF5] hover:bg-[#F2F8FC]"
                            }`}
                          >
                            {pref}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Terms Checkbox */}
                    <div className="pt-2 flex items-start gap-2.5">
                      <input
                        id="terms"
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="mt-1 w-4 h-4 rounded text-[#2360A5] border-[#E2ECF5] focus:ring-[#2360A5]"
                      />
                      <label
                        htmlFor="terms"
                        className="text-xs text-[#526071] leading-relaxed cursor-pointer"
                      >
                        أوافق على قيام فريق رواسي العمر بدراسة متطلبات المشروع
                        المقدم والتواصل الرسمي لمناقشة خطة العمل وعروض الأسعار
                        وفق سياسة الخصوصية وسرية البيانات.
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* NAVIGATION TOOLBAR (Previous / Next / Submit) */}
              <footer
                className="mt-10 pt-6 border-t border-[#E2ECF5] flex flex-col-reverse sm:flex-row items-center justify-between gap-4"
                data-purpose="form-actions-toolbar"
              >
                {/* Previous Step Button */}
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep((prev) => prev - 1)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-[#2360A5] text-[#2360A5] hover:bg-[#F2F8FC] text-sm font-bold transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>السابق</span>
                  </button>
                ) : (
                  <Link
                    href="/"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-[#E2ECF5] text-[#526071] hover:text-[#163063] hover:bg-[#F2F8FC] text-sm font-medium transition-colors"
                  >
                    <span>إلغاء والعودة</span>
                  </Link>
                )}

                {/* Status & Next Step Button Group */}
                <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-4">
                  {currentStep === 2 && (
                    <span className="text-xs font-medium text-[#526071] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#47A3B8]" />
                      تم اختيار {selectedServices.length} مسارات
                    </span>
                  )}

                  {currentStep === 1 && (
                    <button
                      type="button"
                      onClick={proceedToStep2}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl bg-[#163063] hover:bg-[#2360A5] text-white text-sm font-bold transition-all shadow-md hover:shadow-lg group"
                    >
                      <span>المتابعة إلى اختيار القطاعات (الخطوة 2)</span>
                      <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    </button>
                  )}

                  {currentStep === 2 && (
                    <button
                      type="button"
                      onClick={proceedToStep3}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl bg-[#163063] hover:bg-[#2360A5] text-white text-sm font-bold transition-all shadow-md hover:shadow-lg group"
                    >
                      <span>المتابعة إلى نطاق المشروع (الخطوة 3)</span>
                      <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    </button>
                  )}

                  {currentStep === 3 && (
                    <button
                      type="button"
                      onClick={proceedToStep4}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl bg-[#163063] hover:bg-[#2360A5] text-white text-sm font-bold transition-all shadow-md hover:shadow-lg group"
                    >
                      <span>المتابعة إلى بيانات التواصل (الخطوة 4)</span>
                      <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    </button>
                  )}

                  {currentStep === 4 && (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting || !agreeTerms}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl bg-[#163063] hover:bg-[#2360A5] disabled:bg-slate-300 text-white text-sm font-bold transition-all shadow-md hover:shadow-lg group"
                    >
                      {isSubmitting ? (
                        <span>جاري اعتماد وتسجيل الطلب...</span>
                      ) : (
                        <>
                          <span>إرسال طلب التأهيل واعتماد الرقم المرجعي</span>
                          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </footer>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
