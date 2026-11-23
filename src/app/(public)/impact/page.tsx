import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import {
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowLeft,
  BarChart3,
  FileSpreadsheet,
  Compass,
  Database,
  Sliders,
  CheckCircle,
  Sparkles,
  Lock,
} from "lucide-react";
import { TURNKEY_BLUEPRINTS, STRUCTURAL_METRICS } from "@/data/siteContent";

export const metadata: Metadata = {
  title: "منهجية قياس الأثر ونماذج التنفيذ | رواسي العمر",
  description:
    "منهجية قياس الأثر ونماذج التنفيذ الجاهزة للانطلاق (Turnkey Blueprints) في رواسي العمر، وحوكمة قياس العائد الاجتماعي على الاستثمار (SROI) المهيأة للربط المباشر مع لوحة الإدارة.",
};

export default function ImpactPage() {
  return (
    <div className="w-full bg-white font-arabic">
      {/* Hero */}
      <section className="hero-pattern border-b border-[#E2ECF5] py-16 lg:py-22">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E2ECF5] shadow-xs mb-6">
            <TrendingUp className="w-4 h-4 text-[#47A3B8]" />
            <span className="text-xs font-bold text-[#163063]">
              منهجية قياس الأثر ونماذج التنفيذ
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-[#163063] mb-4 tracking-tight">
            منهجية قياس الأثر ونماذج التنفيذ الجاهزة للانطلاق
          </h1>
          <p className="max-w-3xl mx-auto text-base sm:text-lg text-[#526071] leading-relaxed">
            في رواسي العمر، نعتمد نموذجاً علمياً منضبطاً لقياس العائد الاجتماعي على
            الاستثمار (SROI) ونماذج تنفيذية معيارية (Turnkey Blueprints) مهيأة بالكامل للربط
            الرقمي الحي مع لوحة التحكم الإدارية، بما يضمن الشفافية والامتثال بنسبة 100%
            دون أي ادعاءات غير موثقة.
          </p>

          {/* Structural Metrics Pill Bar */}
          <div className="mt-8 flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {STRUCTURAL_METRICS.map((metric) => (
              <div
                key={metric.label}
                className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-[#E2ECF5] shadow-xs text-xs font-bold text-[#163063]"
              >
                <span
                  className="px-2 py-0.5 rounded text-[11px] font-black"
                  style={{
                    backgroundColor: `${metric.accent}15`,
                    color: metric.accent,
                  }}
                >
                  {metric.num}
                </span>
                <span>{metric.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SROI & Post-Handover Measurement Framework */}
      <section className="py-16 lg:py-22 border-b border-[#E2ECF5] bg-white">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold text-[#2360A5]">
                إطار القياس المعتمد
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-[#163063] mt-1">
                منهجية قياس العائد الاجتماعي والأثر بعد التسليم (SROI)
              </h2>
            </div>
            <span className="text-xs font-bold text-[#47A3B8] bg-[#F2F8FC] px-4 py-2 rounded-full border border-[#E2ECF5]">
              مؤشرات كمية ونوعية موثقة
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {[
              {
                step: "01",
                title: "تحديد خط الأساس (Baseline)",
                desc: "رصد الوضع الراهن ودراسة الفجوة التنموية أو التشغيلية والاحتياج الفعلي قبل البدء الميداني.",
                icon: <Compass className="w-5 h-5 text-[#163063]" />,
                color: "#163063",
              },
              {
                step: "02",
                title: "ضبط المدخلات والموارد",
                desc: "حوكمة التكلفة وساعات العمل والموارد المخصصة لكل بند من بنود المشروع دون هدر أو تكاليف خفية.",
                icon: <FileSpreadsheet className="w-5 h-5 text-[#2360A5]" />,
                color: "#2360A5",
              },
              {
                step: "03",
                title: "تحقق المخرجات والجودة",
                desc: "الفحص الفني الدقيق والمطابقة الهندسية والنظامية عند التسليم لضمان الجاهزية بنسبة 100%.",
                icon: <ShieldCheck className="w-5 h-5 text-[#3488C4]" />,
                color: "#3488C4",
              },
              {
                step: "04",
                title: "قياس الأثر المستدام (SROI)",
                desc: "تقييم العائد الاجتماعي والاقتصادي المتحقق للمستفيدين والجهة بعد 6 و12 شهراً من استقرار التشغيل.",
                icon: <BarChart3 className="w-5 h-5 text-[#47A3B8]" />,
                color: "#47A3B8",
              },
            ].map((phase) => (
              <div
                key={phase.step}
                className="bg-[#F2F8FC] rounded-2xl p-6 border border-[#E2ECF5] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white border border-[#E2ECF5] flex items-center justify-center">
                      {phase.icon}
                    </div>
                    <span
                      className="text-xl font-bold"
                      style={{ color: phase.color }}
                    >
                      {phase.step}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#163063] mb-2">
                    {phase.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#526071] leading-relaxed">
                    {phase.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3 Ready-to-Deploy Turnkey Blueprints */}
      <section className="py-16 lg:py-24 bg-[#F2F8FC] border-b border-[#E2ECF5]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold text-[#2360A5]">
              نماذج تنفيذية جاهزة للانطلاق (Turnkey Blueprints)
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-[#163063] mt-2">
              ثلاث باقات معيارية تبدأ التنفيذ من اليوم الأول
            </h2>
            <p className="text-sm sm:text-base text-[#526071] mt-3 leading-relaxed">
              صممنا نماذج تشغيلية متكاملة تختصر مرحلة التخطيط وتجمع القطاعات
              المطلوبة في جدول زمني محدد ومخرجات تعاقدية واضحة.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {TURNKEY_BLUEPRINTS.map((bp) => (
              <div
                key={bp.code}
                className="bg-white rounded-3xl border border-[#E2ECF5] p-8 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between relative overflow-hidden"
              >
                <div
                  className="absolute top-0 right-0 left-0 h-2"
                  style={{ backgroundColor: bp.accentColor }}
                />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold text-[#526071] tracking-wide">
                      {bp.code}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2360A5] bg-[#F2F8FC] px-3 py-1 rounded-full border border-[#E2ECF5]">
                      <Clock className="w-3.5 h-3.5" />
                      {bp.duration}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-[#163063] mb-3 leading-snug">
                    {bp.title}
                  </h3>
                  <p className="text-sm text-[#526071] leading-relaxed mb-5">
                    {bp.summary}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {bp.sectors.map((sec) => (
                      <span
                        key={sec}
                        className="text-[11px] font-bold bg-[#F2F8FC] text-[#163063] px-2.5 py-1 rounded-lg border border-[#E2ECF5]"
                      >
                        {sec}
                      </span>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-[#E2ECF5] space-y-2.5 mb-8">
                    <span className="text-xs font-bold text-[#163063] block">
                      أبرز المخرجات المعتمدة:
                    </span>
                    {bp.deliverables.map((del) => (
                      <div key={del} className="flex items-start gap-2 text-xs">
                        <CheckCircle2 className="w-4 h-4 text-[#47A3B8] shrink-0 mt-0.5" />
                        <span className="text-[#526071] leading-relaxed">
                          {del}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href={`/start-project?blueprint=${bp.code}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-[#163063] hover:bg-[#2360A5] text-white text-xs sm:text-sm font-bold transition-all group"
                >
                  <span>تفعيل هذا النموذج لمشروعك</span>
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Projects Registry & Dashboard Readiness */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-[#F2F8FC] border border-[#E2ECF5] p-8 sm:p-12">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#E2ECF5] text-xs font-bold text-[#2360A5] mb-3 shadow-xs">
                <Database className="w-3.5 h-3.5 text-[#47A3B8]" />
                <span>سجل المشاريع الحية ودراسات الحالة (Live Impact Registry)</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-[#163063]">
                منظومة جاهزة لاستقبال ونشر المشاريع الحقيقية المعتمدة
              </h2>
              <p className="text-sm sm:text-base text-[#526071] mt-3 leading-relaxed">
                يرتبط هذا السجل مباشرة بقاعدة بيانات المنصة ولوحة التحكم الإدارية
                (Admin Dashboard)، لتوثيق ونشر دراسات الحالة الحقيقية فور اعتماد تسليمها
                الميداني وقياس أثرها التنموي الفعلي.
              </p>
            </div>

            {/* Live Pipeline Architecture (3 Stages) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white rounded-2xl p-6 border border-[#E2ECF5] shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-[#F2F8FC] border border-[#E2ECF5] flex items-center justify-center mb-4">
                  <Sliders className="w-5 h-5 text-[#163063]" />
                </div>
                <span className="text-xs font-bold text-[#163063] block mb-1">
                  المرحلة الأولى
                </span>
                <h3 className="text-base font-bold text-[#163063] mb-2">
                  تأهيل واستقبال الطلب
                </h3>
                <p className="text-xs sm:text-sm text-[#526071] leading-relaxed">
                  يصل الطلب عبر معالج التأهيل التفاعلي برقم مرجعي رسمي ومسارات واضحة
                  مباشرة إلى نظام إدارة الطلبات.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-[#E2ECF5] shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-[#F2F8FC] border border-[#E2ECF5] flex items-center justify-center mb-4">
                  <Database className="w-5 h-5 text-[#2360A5]" />
                </div>
                <span className="text-xs font-bold text-[#2360A5] block mb-1">
                  المرحلة الثانية
                </span>
                <h3 className="text-base font-bold text-[#163063] mb-2">
                  الإشراف والحوكمة في لوحة الإدارة
                </h3>
                <p className="text-xs sm:text-sm text-[#526071] leading-relaxed">
                  يتابع مديرو القطاعات وفريق الحوكمة مراحل الإنجاز الميداني ونسب
                  التنفيذ المعتمدة خطوة بخطوة.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-[#E2ECF5] shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-[#F2F8FC] border border-[#E2ECF5] flex items-center justify-center mb-4">
                  <CheckCircle className="w-5 h-5 text-[#47A3B8]" />
                </div>
                <span className="text-xs font-bold text-[#47A3B8] block mb-1">
                  المرحلة الثالثة
                </span>
                <h3 className="text-base font-bold text-[#163063] mb-2">
                  التوثيق ونشر الأثر المعتمد
                </h3>
                <p className="text-xs sm:text-sm text-[#526071] leading-relaxed">
                  عند اكتمال التسليم النهائي وقياس مؤشرات SROI، تُنشر دراسة الحالة
                  المحققة بالأرقام والوثائق الرسمية في هذا السجل.
                </p>
              </div>
            </div>

            {/* Credibility & Zero Slop Pledge Banner */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2ECF5] shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-start gap-4 text-right">
                <div className="w-12 h-12 rounded-xl bg-[#163063] text-white flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 text-[#47A3B8]" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#163063] mb-1">
                    ميثاق الشفافية والمصداقية المهنية
                  </h4>
                  <p className="text-xs sm:text-sm text-[#526071] leading-relaxed max-w-2xl">
                    تلتزم رواسي العمر بالمصداقية المؤسسية التامة؛ لذا نتجنب تماماً نشر أي أرقام
                    مشاريع وهمية سابقة، أو آراء عملاء مصطنعة، أو تقييمات نجوم دعائية.
                    المشاريع المنشورة ستكون دائماً موثقة ومبنية على وقائع تسليم فعلية.
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex flex-wrap gap-3 w-full md:w-auto">
                <Link
                  href="/start-project"
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#163063] hover:bg-[#2360A5] text-white text-xs sm:text-sm font-bold shadow-sm transition-all"
                >
                  <span>ابدأ تأهيل مشروعك</span>
                  <ArrowLeft className="w-4 h-4" />
                </Link>
                <Link
                  href="/login"
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#F2F8FC] hover:bg-[#E2ECF5] text-[#2360A5] text-xs sm:text-sm font-bold border border-[#E2ECF5] transition-all"
                >
                  <Lock className="w-4 h-4 text-[#2360A5]" />
                  <span>دخول لوحة التحكم</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
