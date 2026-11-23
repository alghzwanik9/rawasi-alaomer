import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BookOpen, Clock, ChevronLeft } from "lucide-react";
import { PROCEDURES_DATA, Procedure } from "@/data/marjeaSeed";
import { UnifiedProcedureCard } from "@/components/marjea/UnifiedProcedureCard";

interface GuidePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return PROCEDURES_DATA.map((procedure) => ({
    slug: procedure.slug,
  }));
}

export async function generateMetadata({
  params,
}: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const procedure = PROCEDURES_DATA.find((p) => p.slug === slug);

  if (!procedure) {
    return {
      title: "الإجراء غير موجود | مرجع الجمعيات",
    };
  }

  return {
    title: `${procedure.title} | مرجع الجمعيات - رواسي العمر`,
    description: procedure.shortSummary,
    keywords: [
      procedure.title,
      procedure.category,
      procedure.code,
      procedure.authority,
      "مرجع الجمعيات",
      "رواسي العمر",
    ],
  };
}

export default async function ProcedureGuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const procedure = PROCEDURES_DATA.find((p) => p.slug === slug);

  if (!procedure) {
    notFound();
  }

  // Get other procedures in the same category or related
  const relatedProcedures = PROCEDURES_DATA.filter(
    (p) => p.slug !== procedure.slug
  ).slice(0, 3);

  return (
    <div className="w-full bg-white py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation & Breadcrumb Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-[#E2ECF5]">
          <nav aria-label="مسار التصفح" className="text-xs md:text-sm text-[#526071]">
            <ol className="inline-flex items-center space-x-reverse space-x-2">
              <li>
                <Link
                  href="/"
                  className="hover:text-[#2360A5] transition-colors"
                >
                  الرئيسية
                </Link>
              </li>
              <li>
                <span className="text-[#E2ECF5]">/</span>
              </li>
              <li>
                <Link
                  href="/marjea"
                  className="hover:text-[#2360A5] transition-colors"
                >
                  مرجع الجمعيات
                </Link>
              </li>
              <li>
                <span className="text-[#E2ECF5]">/</span>
              </li>
              <li>
                <span className="text-[#526071]">{procedure.category}</span>
              </li>
              <li>
                <span className="text-[#E2ECF5]">/</span>
              </li>
              <li
                aria-current="page"
                className="font-bold text-[#163063] truncate max-w-[240px] sm:max-w-none"
              >
                {procedure.title}
              </li>
            </ol>
          </nav>

          <Link
            href="/marjea"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#2360A5] hover:text-[#163063] transition-colors self-start sm:self-auto"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة إلى مرجع الجمعيات</span>
          </Link>
        </div>

        {/* The Full Unified Procedure Card */}
        <UnifiedProcedureCard procedure={procedure} isStandalone={true} />

        {/* Related Procedures Section */}
        {relatedProcedures.length > 0 && (
          <section className="mt-14 pt-10 border-t border-[#E2ECF5]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-[#163063] flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#2360A5]" />
                  <span>إجراءات ذات صلة في مرجع الجمعيات</span>
                </h3>
                <p className="text-xs md:text-sm text-[#526071] mt-1">
                  استكشف أدلة إجرائية إضافية يحتاجها قادة ومسؤولو الجمعيات
                  الأهلية
                </p>
              </div>
              <Link
                href="/marjea"
                className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-[#2360A5] hover:underline"
              >
                <span>استعراض كل الإجراءات</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedProcedures.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/marjea/guide/${rel.slug}`}
                  className="p-5 rounded-xl border border-[#E2ECF5] bg-white hover:border-[#2360A5]/40 hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-semibold text-[#526071] text-[11px] tracking-wide">
                        {rel.code}
                      </span>
                      <span className="text-[#3488C4] font-semibold flex items-center gap-1 text-[11px]">
                        <Clock className="w-3 h-3" />
                        {rel.expectedTime}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-[#163063] group-hover:text-[#2360A5] transition-colors mb-2 leading-snug">
                      {rel.title}
                    </h4>
                    <p className="text-xs text-[#526071] line-clamp-2 leading-relaxed">
                      {rel.shortSummary}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#E2ECF5] flex items-center justify-between text-xs">
                    <span className="text-[#526071] text-[11px]">
                      {rel.templates.length} نماذج
                    </span>
                    <span className="font-bold text-[#2360A5] flex items-center gap-1 group-hover:-translate-x-1 transition-transform">
                      <span>عرض الإجراء</span>
                      <ChevronLeft className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
