import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import {
  HeartHandshake,
  BookOpen,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Landmark,
} from "lucide-react";
import { NON_PROFIT_TRACKS } from "@/data/siteContent";

export const metadata: Metadata = {
  title: "بوابة القطاع غير الربحي والأوقاف | 6 مسارات تمكينية - رواسي العمر",
  description:
    "حلول استشارية وتنفيذية متكاملة للجمعيات الأهلية والأوقاف والجهات المانحة في المملكة عبر 6 مسارات تخصصية ومرجع الجمعيات الإجرائي.",
};

export default function NonProfitPortalPage() {
  return (
    <div className="w-full bg-white font-arabic">
      {/* Hero */}
      <section className="hero-pattern border-b border-[#E2ECF5] py-16 lg:py-22">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E2ECF5] shadow-xs mb-6">
            <HeartHandshake className="w-4 h-4 text-[#47A3B8]" />
            <span className="text-xs font-bold text-[#163063]">
              تمكين الجمعيات الأهلية والأوقاف والجهات المانحة
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#163063] mb-4 tracking-tight">
            بوابة القطاع غير الربحي والوقفي
          </h1>
          <p className="max-w-3xl mx-auto text-base sm:text-lg text-[#526071] leading-relaxed mb-8">
            شراكة مؤسسية شاملة تنقل الجمعيات والأوقاف من التحديات الإجرائية
            المتكررة إلى الحوكمة الرصينة، الاستدامة المالية، وتنفيذ المبادرات
            والمقرات بأعلى المعايير المعتمدة في المملكة.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/start-project?track=governance&entity=charity"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#163063] hover:bg-[#2360A5] text-white font-bold text-sm shadow-md transition-all group"
            >
              <span>اطلب استشارة لجمعيتك أو وقفك</span>
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            </Link>
            <Link
              href="/marjea"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white hover:bg-[#F2F8FC] border border-[#E2ECF5] text-[#2360A5] font-bold text-sm shadow-xs transition-all"
            >
              <BookOpen className="w-4 h-4 text-[#47A3B8]" />
              <span>تصفح مرجع الجمعيات المجاني</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Prominent Banner linking to /marjea */}
      <section className="py-10 bg-white border-b border-[#E2ECF5]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-[#163063] text-white p-7 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="space-y-3 relative z-10 text-center lg:text-right">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#47A3B8]/20 border border-[#47A3B8]/40 text-[#47A3B8] text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>منصة معرفية مفتوحة للقطاع الثالث</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold">
                مرجع الجمعيات: من السؤال المتكرر... إلى المعرفة المستدامة
              </h2>
              <p className="text-sm text-slate-200 max-w-2xl leading-relaxed">
                أدلة إجرائية محدثة خطوة بخطوة (عقد الجمعية العمومية، التأسيس،
                انتخابات المجالس، فتح الحسابات البنكية، منصة إحسان، وتراخيص جمع
                التبرعات) مع نماذج جاهزة للتحميل.
              </p>
            </div>

            <div className="shrink-0 relative z-10 w-full lg:w-auto">
              <Link
                href="/marjea"
                className="w-full lg:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-[#47A3B8] hover:bg-[#3488C4] text-white font-bold text-sm sm:text-base shadow-lg transition-all group"
              >
                <BookOpen className="w-5 h-5" />
                <span>الدخول إلى مرجع الجمعيات</span>
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* The 6 Integrated Tracks */}
      <section className="py-16 lg:py-24 bg-[#F2F8FC]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-[#2360A5]">
              منهجية التمكين الشاملة
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#163063] mt-2">
              المسارات الستة المتكاملة للجمعيات والأوقاف
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {NON_PROFIT_TRACKS.map((track) => (
              <div
                key={track.num}
                className="bg-white rounded-2xl border border-[#E2ECF5] p-7 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between relative overflow-hidden"
              >
                <div
                  className="absolute top-0 right-0 left-0 h-1.5"
                  style={{ backgroundColor: track.color }}
                />
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="text-2xl font-black font-mono"
                      style={{ color: track.color }}
                    >
                      {track.num}
                    </span>
                    <ShieldCheck className="w-5 h-5 text-[#47A3B8]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#163063] mb-3">
                    {track.title}
                  </h3>
                  <p className="text-sm text-[#526071] leading-relaxed mb-6">
                    {track.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E2ECF5] flex items-center justify-between text-xs">
                  <Link
                    href={track.linkToMarjea}
                    className="font-bold text-[#2360A5] hover:underline"
                  >
                    الإجراء في المرجع
                  </Link>
                  <Link
                    href="/start-project?track=governance&entity=charity"
                    className="inline-flex items-center gap-1 font-bold text-[#163063] hover:text-[#2360A5]"
                  >
                    <span>اطلب الخدمة</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awqaf & Donors Alignment */}
      <section className="py-16 bg-white">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-[#F2F8FC] border border-[#E2ECF5] p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#2360A5]">
                <Landmark className="w-4 h-4" />
                <span>خدمات الأوقاف والجهات المانحة</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#163063]">
                من تأسيس الوقف وإدارة أصوله إلى توجيه ريعه للأثر
              </h3>
              <p className="text-sm sm:text-base text-[#526071] leading-relaxed">
                نربط بين قطاع المقاولات والتشغيل وبين الأطر الوقفية والشرعية
                لضمان بناء أو ترميم الأعيان الوقفية وتشغيلها بعقود صيانة مستدامة
                تُنمّي الريع وتضبط الصرف وفق شروط الواقفين.
              </p>
              <div className="flex flex-wrap gap-4 pt-1">
                {[
                  "حوكمة مجالس النظارة",
                  "تطوير وإدارة الأصول الوقفية",
                  "تقارير شفافية للمانحين",
                ].map((pt) => (
                  <span
                    key={pt}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#163063]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#47A3B8]" />
                    {pt}
                  </span>
                ))}
              </div>
            </div>
            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <Link
                href="/start-project?track=governance&entity=waqf"
                className="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-[#163063] hover:bg-[#2360A5] text-white font-bold text-sm shadow-sm transition-all"
              >
                <span>تأهيل مشروع وقفي أو مانح</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
