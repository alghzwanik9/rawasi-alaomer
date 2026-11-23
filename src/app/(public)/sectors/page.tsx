import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import {
  HardHat,
  Package,
  Cpu,
  Wrench,
  Sprout,
  Layers,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { SECTORS_DATA } from "@/data/siteContent";

export const metadata: Metadata = {
  title: "قطاعاتنا الخمسة | المنظومة التنفيذية المتكاملة - رواسي العمر",
  description:
    "استعرض القطاعات التنفيذية الخمسة في رواسي العمر: المقاولات والتطوير الإنشائي، التجهيز والتوريد، التقنية والحلول الذكية، التشغيل والصيانة، والمشاريع المجتمعية.",
};

function getSectorIcon(slug: string) {
  switch (slug) {
    case "contracting":
      return <HardHat className="w-7 h-7 text-[#163063]" />;
    case "supply":
      return <Package className="w-7 h-7 text-[#2360A5]" />;
    case "tech":
      return <Cpu className="w-7 h-7 text-[#3488C4]" />;
    case "operations":
      return <Wrench className="w-7 h-7 text-[#2360A5]" />;
    case "community":
      return <Sprout className="w-7 h-7 text-[#47A3B8]" />;
    default:
      return <Layers className="w-7 h-7 text-[#163063]" />;
  }
}

export default function SectorsOverviewPage() {
  return (
    <div className="w-full bg-white font-arabic">
      {/* Hero Section */}
      <section className="hero-pattern border-b border-[#E2ECF5] py-16 lg:py-22">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E2ECF5] shadow-xs mb-6">
            <Layers className="w-4 h-4 text-[#2360A5]" />
            <span className="text-xs font-bold text-[#163063]">
              منظومة التنفيذ المتكاملة
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-[#163063] mb-4 tracking-tight">
            قطاعاتنا الخمسة المتخصصة
          </h1>
          <p className="max-w-3xl mx-auto text-base sm:text-lg text-[#526071] leading-relaxed">
            خمسة أذرع تنفيذية تعمل بتناغم تام تحت قيادة هندسية وإدارية موحدة،
            لتغطي دورة حياة المشروع كاملة دون فجوات بين التصميم والتنفيذ والتشغيل.
          </p>
        </div>
      </section>

      {/* Sectors Grid */}
      <section className="py-16 lg:py-24 bg-[#F2F8FC]/60">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {SECTORS_DATA.map((sector) => (
            <div
              key={sector.slug}
              className="bg-white rounded-3xl border border-[#E2ECF5] p-6 sm:p-10 shadow-sm hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              <div className="lg:col-span-8 space-y-5">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-[#F2F8FC] border border-[#E2ECF5] flex items-center justify-center">
                    {getSectorIcon(sector.slug)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded bg-[#F2F8FC] border border-[#E2ECF5]"
                        style={{ color: sector.accentColor }}
                      >
                        قطاع {sector.number}
                      </span>
                      <span className="text-xs font-bold text-[#47A3B8]">
                        {sector.badgeText}
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold leading-tight text-[#163063] mt-1">
                      {sector.title}
                    </h2>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-[#526071] leading-relaxed">
                  {sector.fullDescription}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {sector.scope.slice(0, 4).map((item) => (
                    <div key={item} className="flex items-start gap-2 text-xs sm:text-sm">
                      <CheckCircle2 className="w-4 h-4 text-[#47A3B8] shrink-0 mt-0.5" />
                      <span className="text-[#0E1D2B] font-medium">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {sector.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-semibold bg-[#F2F8FC] text-[#163063] px-3 py-1 rounded-lg border border-[#E2ECF5]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4 bg-[#F2F8FC] rounded-2xl p-6 border border-[#E2ECF5] flex flex-col justify-between gap-5">
                <div>
                  <span className="text-xs font-bold text-[#2360A5] block mb-1.5">
                    التزام مستوى الخدمة (SLA)
                  </span>
                  <p className="text-sm font-bold text-[#163063] leading-relaxed">
                    {sector.slaHighlight}
                  </p>
                </div>

                <div className="space-y-2.5">
                  <Link
                    href={`/sectors/${sector.slug}`}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#163063] hover:bg-[#2360A5] text-white text-sm font-bold transition-all group"
                  >
                    <span>استعراض تفاصيل القطاع</span>
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  </Link>
                  <Link
                    href={`/start-project?sector=${sector.slug}`}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-[#E2ECF5]/60 border border-[#E2ECF5] text-[#2360A5] text-xs font-bold transition-all"
                  >
                    <span>اطلب هذا المسار لمشروعك</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
