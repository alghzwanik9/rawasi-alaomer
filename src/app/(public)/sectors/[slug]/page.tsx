import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  HardHat,
  Package,
  Cpu,
  Wrench,
  Sprout,
  Layers,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Users,
  FileCheck2,
} from "lucide-react";
import { SECTORS_DATA } from "@/data/siteContent";

interface SectorPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return SECTORS_DATA.map((sector) => ({
    slug: sector.slug,
  }));
}

export async function generateMetadata({
  params,
}: SectorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const sector = SECTORS_DATA.find((s) => s.slug === slug);

  if (!sector) {
    return {
      title: "القطاع غير موجود | رواسي العمر",
    };
  }

  return {
    title: `${sector.title} | قطاعات رواسي العمر`,
    description: sector.summary,
  };
}

function getSectorIcon(slug: string) {
  switch (slug) {
    case "contracting":
      return <HardHat className="w-8 h-8 text-[#163063]" />;
    case "supply":
      return <Package className="w-8 h-8 text-[#2360A5]" />;
    case "tech":
      return <Cpu className="w-8 h-8 text-[#3488C4]" />;
    case "operations":
      return <Wrench className="w-8 h-8 text-[#2360A5]" />;
    case "community":
      return <Sprout className="w-8 h-8 text-[#47A3B8]" />;
    default:
      return <Layers className="w-8 h-8 text-[#163063]" />;
  }
}

export default async function SectorDetailPage({ params }: SectorPageProps) {
  const { slug } = await params;
  const sector = SECTORS_DATA.find((s) => s.slug === slug);

  if (!sector) {
    notFound();
  }

  const otherSectors = SECTORS_DATA.filter((s) => s.slug !== sector.slug);

  return (
    <div className="w-full bg-white font-arabic">
      {/* Breadcrumb & Hero */}
      <section className="hero-pattern border-b border-[#E2ECF5] py-12 lg:py-20">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <nav
            aria-label="مسار التصفح"
            className="flex items-center justify-between mb-8 text-xs sm:text-sm text-[#526071]"
          >
            <ol className="inline-flex items-center space-x-reverse space-x-2">
              <li>
                <Link href="/" className="hover:text-[#163063]">
                  الرئيسية
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/sectors" className="hover:text-[#163063]">
                  قطاعاتنا الخمسة
                </Link>
              </li>
              <li>/</li>
              <li className="font-bold text-[#163063]">{sector.title}</li>
            </ol>

            <Link
              href="/sectors"
              className="hidden sm:inline-flex items-center gap-1.5 font-bold text-[#2360A5] hover:text-[#163063]"
            >
              <ArrowRight className="w-4 h-4" />
              <span>جميع القطاعات</span>
            </Link>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-white border border-[#E2ECF5] shadow-xs flex items-center justify-center">
                  {getSectorIcon(sector.slug)}
                </div>
                <div>
                  <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-white border border-[#E2ECF5] text-[#2360A5]">
                    قطاع {sector.number} • {sector.badgeText}
                  </span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#163063] leading-tight">
                {sector.title}
              </h1>
              <p className="text-lg sm:text-xl font-semibold text-[#3488C4]">
                {sector.subtitle}
              </p>
              <p className="text-sm sm:text-base text-[#526071] leading-relaxed max-w-3xl">
                {sector.fullDescription}
              </p>
            </div>

            <div className="lg:col-span-4">
              <div className="bg-white rounded-2xl border-2 border-[#2360A5]/25 p-6 shadow-md space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-[#47A3B8]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>اتفاقية مستوى التنفيذ</span>
                </div>
                <p className="text-sm font-bold text-[#163063] leading-relaxed">
                  {sector.slaHighlight}
                </p>
                <Link
                  href={`/start-project?sector=${sector.slug}`}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#163063] hover:bg-[#2360A5] text-white font-bold text-sm shadow-sm transition-all group"
                >
                  <span>بدء مشروع في هذا القطاع</span>
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scope, Deliverables, Target Beneficiaries */}
      <section className="py-16 lg:py-20 border-b border-[#E2ECF5]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          {/* Scope & Beneficiaries */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 bg-[#F2F8FC] rounded-3xl p-8 border border-[#E2ECF5]">
              <h2 className="text-2xl font-extrabold text-[#163063] mb-6 flex items-center gap-2.5">
                <Layers className="w-6 h-6 text-[#2360A5]" />
                <span>نطاق العمل والخدمات التنفيذية</span>
              </h2>
              <ul className="space-y-3.5">
                {sector.scope.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#47A3B8] shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base text-[#163063] font-medium leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-5 bg-white rounded-3xl p-8 border border-[#E2ECF5] shadow-xs flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-extrabold text-[#163063] mb-6 flex items-center gap-2.5">
                  <Users className="w-6 h-6 text-[#3488C4]" />
                  <span>الجهات المستفيدة</span>
                </h2>
                <ul className="space-y-4">
                  {sector.beneficiaries.map((ben) => (
                    <li
                      key={ben}
                      className="p-3.5 rounded-xl bg-[#F2F8FC] border border-[#E2ECF5] text-sm font-semibold text-[#163063]"
                    >
                      {ben}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-5 border-t border-[#E2ECF5] flex flex-wrap gap-2">
                {sector.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-bold bg-[#F2F8FC] text-[#2360A5] px-3 py-1 rounded-lg border border-[#E2ECF5]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Deliverables */}
          <div>
            <div className="mb-8">
              <span className="text-xs font-bold text-[#47A3B8]">
                الوضوح قبل التنفيذ
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#163063] mt-1 flex items-center gap-2.5">
                <FileCheck2 className="w-7 h-7 text-[#2360A5]" />
                <span>المخرجات والوثائق المسلمة للشريك</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {sector.deliverables.map((del, idx) => (
                <div
                  key={del.title}
                  className="p-6 rounded-2xl bg-white border border-[#E2ECF5] shadow-xs hover:border-[#2360A5]/40 transition-colors"
                >
                  <span className="inline-flex w-8 h-8 rounded-lg bg-[#163063] text-white text-xs font-bold items-center justify-center mb-4">
                    0{idx + 1}
                  </span>
                  <h3 className="text-base font-bold text-[#163063] mb-2">
                    {del.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#526071] leading-relaxed">
                    {del.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Other Sectors Navigation */}
      <section className="py-14 bg-[#F2F8FC]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-extrabold text-[#163063]">
              تكامل مع قطاعاتنا الأخرى
            </h3>
            <Link
              href={`/start-project?sector=${sector.slug}`}
              className="text-xs sm:text-sm font-bold text-[#2360A5] hover:underline"
            >
              تأهيل مشروع يشمل هذا القطاع ←
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {otherSectors.map((other) => (
              <Link
                key={other.slug}
                href={`/sectors/${other.slug}`}
                className="p-5 rounded-2xl bg-white border border-[#E2ECF5] hover:border-[#2360A5] transition-all flex flex-col justify-between group"
              >
                <div>
                  <span className="text-xs font-mono font-bold text-[#3488C4]">
                    قطاع {other.number}
                  </span>
                  <h4 className="text-sm font-bold text-[#163063] group-hover:text-[#2360A5] mt-1 mb-2">
                    {other.title}
                  </h4>
                </div>
                <span className="text-xs font-bold text-[#2360A5] flex items-center gap-1 mt-2">
                  <span>استعراض القطاع</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
