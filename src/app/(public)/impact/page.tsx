import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import {
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Clock,
  ArrowLeft,
  BarChart3,
  FileSpreadsheet,
  Compass,
} from "lucide-react";
import { TURNKEY_BLUEPRINTS } from "@/data/siteContent";

export const metadata: Metadata = {
  title: "مختبر الأثر والنماذج التنفيذية | قياس SROI - رواسي العمر",
  description:
    "منهجية رواسي العمر في قياس العائد الاجتماعي على الاستثمار (SROI)، حوكمة ما بعد التسليم، و3 نماذج تنفيذية جاهزة للانطلاق الفوري (Turnkey Blueprints).",
};

export default function ImpactLabPage() {
  return (
    <div className="w-full bg-white font-arabic">
      {/* Hero */}
      <section className="hero-pattern border-b border-[#E2ECF5] py-16 lg:py-22">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E2ECF5] shadow-xs mb-6">
            <TrendingUp className="w-4 h-4 text-[#47A3B8]" />
            <span className="text-xs font-bold text-[#163063]">
              مختبر الأثر والاستدامة المؤسسية
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#163063] mb-4 tracking-tight">
            الحوكمة، قياس الأثر، والنماذج الجاهزة للانطلاق
          </h1>
          <p className="max-w-3xl mx-auto text-base sm:text-lg text-[#526071] leading-relaxed">
            في رواسي العمر، تُبنى الثقة عبر منهجيات قياس دقيقة ونماذج تنفيذية
            معيارية (Turnkey Blueprints) تختصر الوقت وتضمن الامتثال والعائد
            الاجتماعي والاقتصادي بعد التسليم.
          </p>
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
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#163063] mt-1">
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
                desc: "رصد الوضع الراهن قبل التدخل أو البناء وتحديد الفجوة التنموية أو التشغيلية بدقة.",
                icon: <Compass className="w-5 h-5 text-[#163063]" />,
                color: "#163063",
              },
              {
                step: "02",
                title: "ضبط المدخلات والموارد",
                desc: "توثيق التكلفة الفعلية وساعات العمل والموارد المخصصة لكل مخرج من مخرجات المشروع.",
                icon: <FileSpreadsheet className="w-5 h-5 text-[#2360A5]" />,
                color: "#2360A5",
              },
              {
                step: "03",
                title: "تحقق المخرجات والجودة",
                desc: "اختبار المطابقة الهندسية والنظامية عند التسليم والتأكد من جاهزية التشغيل بنسبة 100%.",
                icon: <ShieldCheck className="w-5 h-5 text-[#3488C4]" />,
                color: "#3488C4",
              },
              {
                step: "04",
                title: "قياس الأثر المستدام (SROI)",
                desc: "تقييم العائد الاجتماعي والاقتصادي المتحقق للمستفيدين والجهة بعد 6 و12 شهراً من التشغيل.",
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
                      className="text-xl font-black font-mono"
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
      <section className="py-16 lg:py-24 bg-[#F2F8FC]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold text-[#2360A5]">
              نماذج تنفيذية جاهزة للانطلاق (Turnkey Blueprints)
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#163063] mt-2">
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
                    <span className="text-xs font-mono font-bold text-[#526071]">
                      {bp.code}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2360A5] bg-[#F2F8FC] px-3 py-1 rounded-full border border-[#E2ECF5]">
                      <Clock className="w-3.5 h-3.5" />
                      {bp.duration}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-[#163063] mb-3 leading-snug">
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
                  href="/start-project"
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
    </div>
  );
}
