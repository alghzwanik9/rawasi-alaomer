"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Clock,
  Building2,
  FileText,
  Download,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ArrowLeft,
  Share2,
  Check,
  FileSpreadsheet,
} from "lucide-react";
import { Procedure } from "@/data/marjeaSeed";

interface UnifiedProcedureCardProps {
  procedure: Procedure;
  isStandalone?: boolean;
}

export function UnifiedProcedureCard({
  procedure,
  isStandalone = false,
}: UnifiedProcedureCardProps) {
  const [downloadedId, setDownloadedId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleDownload = (templateId: string, filename: string) => {
    setDownloadedId(templateId);
    // Simulate template download with realistic feedback
    setTimeout(() => {
      setDownloadedId(null);
    }, 2500);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(
        `${window.location.origin}/marjea/guide/${procedure.slug}`
      );
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <article
      id="procedure-view"
      className="bg-white rounded-2xl border border-[#E2ECF5] shadow-sm overflow-hidden"
      data-purpose="unified-procedure-card"
    >
      {/* Procedure Card Header */}
      <div className="p-6 md:p-8 border-b border-[#E2ECF5] bg-gradient-to-b from-[#F2F8FC]/60 to-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-md text-xs font-bold bg-[#47A3B8]/15 text-[#163063] border border-[#47A3B8]/30">
              {procedure.lastUpdated}
            </span>
            <span className="text-xs text-[#163063]/60 font-mono font-medium">
              معرف الإجراء: {procedure.code}
            </span>
            <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-[#2360A5]/10 text-[#2360A5]">
              {procedure.category}
            </span>
          </div>

          {/* Meta Tags & Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E2ECF5] text-[#163063] shadow-xs">
              <Clock className="w-4 h-4 text-[#3488C4]" />
              <span>
                زمن الإنجاز: <strong>{procedure.expectedTime}</strong>
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E2ECF5] text-[#163063] shadow-xs">
              <Building2 className="w-4 h-4 text-[#2360A5]" />
              <span>
                الجهة المشرفة: <strong>{procedure.authority}</strong>
              </span>
            </div>

            {/* Share / Direct Page Links */}
            <button
              onClick={handleShare}
              title="نسخ رابط الإجراء المباشر"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E2ECF5] text-[#526071] hover:text-[#163063] hover:bg-[#F2F8FC] transition-colors"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-medium">تم النسخ</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-[#3488C4]" />
                  <span>مشاركة</span>
                </>
              )}
            </button>

            {!isStandalone && (
              <Link
                href={`/marjea/guide/${procedure.slug}`}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#2360A5]/10 hover:bg-[#2360A5]/20 text-[#2360A5] font-semibold transition-colors"
              >
                <span>صفحة مستقلة</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#163063] leading-snug">
          إجراء: {procedure.title}
        </h2>
        <p className="mt-2.5 text-sm md:text-base text-[#526071] leading-relaxed max-w-4xl">
          {procedure.fullDescription}
        </p>
      </div>

      <div className="p-6 md:p-8 space-y-10">
        {/* SECTION 1: Alert Box "اعرف قبل أن تبدأ" */}
        <section
          aria-labelledby="prerequisites-heading"
          className="rounded-xl border border-[#47A3B8]/40 bg-[#47A3B8]/10 p-5 md:p-6"
        >
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-lg bg-[#47A3B8] text-white shrink-0 mt-0.5 shadow-sm">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3
                  id="prerequisites-heading"
                  className="text-lg font-bold text-[#163063]"
                >
                  {procedure.prerequisites.title}
                </h3>
                <span className="text-xs px-2.5 py-0.5 rounded bg-[#47A3B8]/25 text-[#163063] font-bold">
                  {procedure.prerequisites.subtitle}
                </span>
              </div>
              <p className="text-xs md:text-sm text-[#163063]/80 mb-3.5">
                يجب استيفاء هذه المتطلبات المسبقة قبل إصدار أي خطاب أو المضي في
                الإجراء لتفادي بطلان القرارات أو تلقي ملاحظات رقابية:
              </p>
              <ul className="space-y-2.5 text-xs md:text-sm text-[#163063] font-medium list-none">
                {procedure.prerequisites.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#47A3B8] mt-2 shrink-0" />
                    <span>
                      <strong className="text-[#163063] font-bold">
                        {item.headline}:
                      </strong>{" "}
                      <span className="text-[#526071]">{item.detail}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION 2: Sequential Step-by-Step Execution Stepper */}
        <section aria-labelledby="steps-heading">
          <div className="flex items-center justify-between mb-6">
            <h3
              id="steps-heading"
              className="text-xl font-bold text-[#163063] flex items-center gap-2"
            >
              <span className="w-3 h-3 rounded-xs bg-[#2360A5] inline-block" />
              مسار التنفيذ المرحلي المتسلسل (خطوة بخطوة)
            </h3>
            <span className="text-xs font-semibold text-[#526071] bg-[#F2F8FC] px-3 py-1 rounded-full border border-[#E2ECF5]">
              {procedure.steps.length} خطوات متتالية
            </span>
          </div>

          <div className="relative border-r-2 border-[#E2ECF5] mr-4 md:mr-6 space-y-8">
            {procedure.steps.map((step, sIdx) => {
              // Color progression for steps: 1: navy (#163063), 2: corporate (#2360A5), 3: sky (#3488C4), 4: teal (#47A3B8)
              const stepColors = [
                "bg-[#163063]",
                "bg-[#2360A5]",
                "bg-[#3488C4]",
                "bg-[#47A3B8]",
              ];
              const bulletColor =
                stepColors[sIdx % stepColors.length] || "bg-[#163063]";

              return (
                <div key={step.stepNumber} className="relative pr-8 md:pr-10">
                  {/* Stepper Index Bullet */}
                  <div
                    className={`absolute -right-3.5 top-0 w-7 h-7 rounded-full ${bulletColor} text-white flex items-center justify-center text-xs font-bold border-4 border-white shadow-xs`}
                  >
                    {step.stepNumber}
                  </div>

                  <div className="bg-white rounded-xl border border-[#E2ECF5] p-5 shadow-xs hover:border-[#2360A5]/40 transition-colors">
                    <h4 className="text-base md:text-lg font-bold text-[#163063] mb-2.5">
                      {step.title}
                    </h4>
                    <p className="text-xs md:text-sm text-[#526071] leading-relaxed mb-4">
                      {step.description}
                    </p>

                    {/* Dual Badges Container: Strict visual separation */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                      {/* Box 1: المعلومة الرسمية (#163063 badge) */}
                      <div className="bg-[#F2F8FC] p-3.5 rounded-lg border-r-4 border-[#163063]">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#163063] text-white">
                            {step.officialInfo.badge}
                          </span>
                          <span className="text-xs font-bold text-[#163063]">
                            {step.officialInfo.reference}
                          </span>
                        </div>
                        <p className="text-xs text-[#163063]/85 leading-relaxed">
                          {step.officialInfo.text}
                        </p>
                      </div>

                      {/* Box 2: الخبرة الإرشادية من رواسي العمر (#47A3B8 badge) */}
                      <div className="bg-[#47A3B8]/10 p-3.5 rounded-lg border-r-4 border-[#47A3B8]">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#47A3B8] text-white">
                            {step.advisoryTip.badge}
                          </span>
                        </div>
                        <p className="text-xs text-[#163063]/85 leading-relaxed">
                          {step.advisoryTip.text}
                        </p>
                      </div>
                    </div>

                    {/* Extra Regulatory Note if provided */}
                    {step.extraNote && (
                      <div className="mt-3.5 bg-[#F2F8FC] p-3.5 rounded-lg border border-[#E2ECF5] text-xs text-[#163063]/90 leading-relaxed">
                        <strong className="text-[#2360A5] ml-1">
                          {step.extraNote.label}:
                        </strong>
                        <span>{step.extraNote.text}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 3: Downloadable Ready-to-Use Templates Bar */}
        <section aria-labelledby="templates-heading" className="pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h3
                id="templates-heading"
                className="text-xl font-bold text-[#163063] flex items-center gap-2"
              >
                <FileText className="w-5 h-5 text-[#2360A5]" />
                النماذج والمستندات الجاهزة للتحميل
              </h3>
              <p className="text-xs md:text-sm text-[#526071] mt-1">
                نماذج مطابقة لمعايير الحوكمة والاشتراطات الرسمية للمركز الوطني
                لتنمية القطاع غير الربحي
              </p>
            </div>
            <span className="text-xs font-semibold text-[#2360A5] bg-[#F2F8FC] px-3 py-1.5 rounded-full border border-[#E2ECF5] self-start sm:self-auto">
              صيغ معتمدة قابلة للتعديل والتخصيص
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {procedure.templates.map((tmpl) => {
              const isExcel = tmpl.fileType === "XLSX";
              const isDownloaded = downloadedId === tmpl.id;

              return (
                <div
                  key={tmpl.id}
                  className="p-4 rounded-xl border border-[#E2ECF5] bg-white hover:border-[#2360A5]/40 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isExcel
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-blue-100 text-[#2360A5]"
                        }`}
                      >
                        {tmpl.format}
                      </span>
                      {isExcel ? (
                        <FileSpreadsheet className="w-5 h-5 text-[#47A3B8]" />
                      ) : (
                        <FileText className="w-5 h-5 text-[#3488C4]" />
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-[#163063] mb-1.5">
                      {tmpl.title}
                    </h4>
                    <p className="text-xs text-[#526071] mb-4 leading-relaxed">
                      {tmpl.description}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDownload(tmpl.id, tmpl.downloadFileName)}
                    className={`inline-flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${
                      isDownloaded
                        ? "bg-emerald-600 text-white"
                        : "text-[#2360A5] bg-[#F2F8FC] hover:bg-[#2360A5] hover:text-white"
                    }`}
                  >
                    {isDownloaded ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-white" />
                        <span>جاري التحميل ({tmpl.downloadFileName})</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>تحميل النموذج ({tmpl.fileType})</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 4: Subtle Bottom Soft CTA Card */}
        <section
          className="rounded-2xl bg-[#F2F8FC] border border-[#E2ECF5] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6"
          data-purpose="bottom-cta-banner"
        >
          <div className="space-y-2 text-center md:text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E2ECF5] text-[#2360A5] text-xs font-bold mb-1 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#47A3B8]" />
              <span>إشراف وتنفيذ استشاري مباشر لجمعيتك</span>
            </div>
            <h4 className="text-xl md:text-2xl font-extrabold text-[#163063]">
              تحتاج فريق رواسي العمر لتنفيذ هذا الإجراء لجمعيتك بالكامل؟
            </h4>
            <p className="text-xs md:text-sm text-[#526071] max-w-2xl leading-relaxed">
              خبراؤنا يتولون التجهيز النظامي، إعداد المحاضر، والتنسيق والرفع
              المعتمد لضمان الامتثال التام مع المركز الوطني وتجنب أي ملاحظات
              رقابية.
            </p>
          </div>
          <div className="shrink-0 w-full md:w-auto">
            <Link
              href="/start-project"
              className="inline-flex items-center justify-center gap-2 w-full md:w-auto px-8 py-4 rounded-xl text-sm md:text-base font-bold text-white bg-[#163063] hover:bg-[#2360A5] shadow-md hover:shadow-lg transition-all group"
            >
              <span>اطلب الخدمة الآن</span>
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            </Link>
          </div>
        </section>
      </div>
    </article>
  );
}
