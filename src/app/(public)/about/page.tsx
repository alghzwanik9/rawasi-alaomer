import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import {
  Anchor,
  Compass,
  ShieldCheck,
  Target,
  Eye,
  Award,
  Layers,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "من نحن | فلسفة الرواسي والعمر وميثاق العمل - رواسي العمر",
  description:
    "تعرّف على قصة وفلسفة رواسي العمر: الرواسي للثبات والمتانة، والعمر لامتداد القيمة والأثر بعد التسليم، وميثاقنا التنفيذي لخدمة القطاع غير الربحي والأعمال.",
};

export default function AboutPage() {
  return (
    <div className="w-full bg-white font-arabic">
      {/* Hero Header */}
      <section className="hero-pattern border-b border-[#E2ECF5] py-16 lg:py-24">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E2ECF5] shadow-xs mb-6">
            <span className="w-2 h-2 rounded-full bg-[#47A3B8]" />
            <span className="text-xs font-bold text-[#2360A5]">
              فلسفة التأسيس والهوية المؤسسية
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-[#163063] mb-5 tracking-tight">
            جهة واحدة، مسار واضح للتطوير والتنفيذ
          </h1>
          <p className="max-w-3xl mx-auto text-base sm:text-lg text-[#526071] leading-relaxed">
            شركة رواسي العمر منظومة سعودية متكاملة تجمع بين الرصانة الاستشارية،
            الضبط الحوكمي، والقدرة التنفيذية الميدانية؛ لتجنيب شركائنا تشتت
            الموردين وضمان مشاريع تعمّر بأثرها وجودتها.
          </p>
        </div>
      </section>

      {/* Brand Philosophy: الرواسي & العمر */}
      <section className="py-16 lg:py-24 border-b border-[#E2ECF5]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-[#3488C4] tracking-wide uppercase">
              دلالة الاسم والمنهج
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-[#163063] mt-2">
              فلسفة «الرواسي» و«العمر»
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Al-Rawasi Card */}
            <div className="bg-[#F2F8FC] rounded-3xl p-8 sm:p-10 border border-[#E2ECF5] relative overflow-hidden">
              <div className="absolute top-0 right-0 left-0 h-2 bg-[#163063]" />
              <div className="w-14 h-14 rounded-2xl bg-white border border-[#E2ECF5] flex items-center justify-center mb-6 shadow-xs">
                <Anchor className="w-7 h-7 text-[#163063]" />
              </div>
              <h3 className="text-2xl font-semibold text-[#163063] mb-3">
                «الرواسي» — الثبات والمتانة
              </h3>
              <p className="text-sm sm:text-base text-[#526071] leading-relaxed mb-6">
                تمثل الرواسي الأساس المتين الذي يُبنى عليه كل مشروع دون ارتجال؛
                حيث نبدأ بتأصيل الحوكمة، استيفاء التراخيص النظامية، ضبط العقود
                والمواصفات الهندسية، وبناء القواعد التي تحفظ الكيان من التعثر أو
                المخاطر التشغيلية.
              </p>
              <div className="flex flex-wrap gap-2">
                {["حوكمة رصينة", "معايير هندسية دقيقة", "استقرار تنظيمي"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="text-xs font-bold bg-white text-[#163063] px-3 py-1 rounded-lg border border-[#E2ECF5]"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Al-Omar Card */}
            <div className="bg-[#F2F8FC] rounded-3xl p-8 sm:p-10 border border-[#E2ECF5] relative overflow-hidden">
              <div className="absolute top-0 right-0 left-0 h-2 bg-[#47A3B8]" />
              <div className="w-14 h-14 rounded-2xl bg-white border border-[#E2ECF5] flex items-center justify-center mb-6 shadow-xs">
                <Sparkles className="w-7 h-7 text-[#47A3B8]" />
              </div>
              <h3 className="text-2xl font-semibold text-[#163063] mb-3">
                «العمر» — امتداد القيمة والأثر بعد التسليم
              </h3>
              <p className="text-sm sm:text-base text-[#526071] leading-relaxed mb-6">
                لا ينتهي دورنا عند قص شريط الافتتاح أو تسليم المفاتيح؛ بل يعني
                «العمر» أن يبقى المشروع حياً، منتجاً، ومستداماً مالياً وتشغيلياً
                ومجتمعياً لسنوات طويلة عبر أنظمة الصيانة الوقائية وقياس العائد
                الاجتماعي.
              </p>
              <div className="flex flex-wrap gap-2">
                {["استدامة تشغيلية", "أثر تنموي باقٍ", "حماية قيمة الأصول"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="text-xs font-bold bg-white text-[#2360A5] px-3 py-1 rounded-lg border border-[#E2ECF5]"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 lg:py-20 bg-white border-b border-[#E2ECF5]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-2xl border border-[#E2ECF5] bg-white shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-[#163063] text-white">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold text-[#163063]">رؤيتنا</h3>
            </div>
            <p className="text-sm sm:text-base text-[#526071] leading-relaxed">
              أن نكون الشريك الاستشاري والتنفيذي الأكثر موثوقية في المملكة
              العربية السعودية لتمكين منظمات القطاع غير الربحي وقطاع الأعمال من
              بناء مشاريع متكاملة، عالية الحوكمة، ومستدامة الأثر وفق مستهدفات
              رؤية المملكة 2030.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-[#E2ECF5] bg-white shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-[#2360A5] text-white">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold text-[#163063]">رسالتنا</h3>
            </div>
            <p className="text-sm sm:text-base text-[#526071] leading-relaxed">
              توحيد رحلة المشروع من الفكرة والتأسيس النظامي إلى البناء والتجهيز
              والتقنية والتشغيل المستدام تحت مظلة قيادية واحدة، وبوضوح تعاقدي
              ومعياري يرفع كفاءة الإنفاق ويعظّم العائد المؤسسي والمجتمعي.
            </p>
          </div>
        </div>
      </section>

      {/* The 3 Execution Pillars */}
      <section className="py-16 lg:py-24 bg-[#F2F8FC] border-b border-[#E2ECF5]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-[#2360A5]">
              كيف نحقق الوعد؟
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-[#163063] mt-2">
              ركائز التنفيذ الثلاث في رواسي العمر
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                num: "01",
                title: "مظلة واحدة",
                desc: "نقطة اتصال ومسؤولية واحدة تدير جميع التخصصات (الاستشاري، الإنشائي، التوريد، التقني، والتشغيلي) بدلاً من تشتت الجهة بين عشرات المقاولين والمكاتب.",
                color: "#163063",
                icon: <Layers className="w-6 h-6 text-[#163063]" />,
              },
              {
                num: "02",
                title: "وضوح قبل التنفيذ",
                desc: "لا نبدأ العمل الميداني قبل اكتمال دراسة الاحتياج، اعتماد جدول الكميات والمواصفات، وتحديد المهل الزمنية والمعايير النظامية بشفافية كاملة.",
                color: "#2360A5",
                icon: <Compass className="w-6 h-6 text-[#2360A5]" />,
              },
              {
                num: "03",
                title: "تمام في الختام",
                desc: "تسليم موثق خالٍ من الملاحظات، مقروناً بتدريب الكوادر، خطط الصيانة الوقائية، وأدوات قياس الأثر لضمان استدامة التشغيل بعد الإنجاز.",
                color: "#47A3B8",
                icon: <Award className="w-6 h-6 text-[#47A3B8]" />,
              },
            ].map((pillar) => (
              <div
                key={pillar.num}
                className="bg-white rounded-2xl p-8 border border-[#E2ECF5] shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#F2F8FC] border border-[#E2ECF5] flex items-center justify-center">
                      {pillar.icon}
                    </div>
                    <span
                      className="text-3xl font-bold opacity-20"
                      style={{ color: pillar.color }}
                    >
                      {pillar.num}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-[#163063] mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-[#526071] leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Pledge: ميثاق رواسي العمر */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#163063] text-white rounded-3xl p-8 sm:p-12 lg:p-14 relative overflow-hidden">
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#47A3B8] text-xs font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>ميثاق رواسي العمر</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold leading-tight">
                  التزامنا الأخلاقي والمهني أمام كل شريك
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {[
                    "الشفافية المطلقة في التسعير والمواصفات دون بنود مخفية",
                    "الالتزام التام بلوائح المركز الوطني لتنمية القطاع غير الربحي",
                    "حماية سرية بيانات الجهات والجمعيات والمستفيدين",
                    "المصداقية الواقعية في المواعيد والقدرات التنفيذية",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-[#47A3B8] shrink-0 mt-0.5" />
                      <span className="text-slate-200">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col gap-3">
                <Link
                  href="/start-project"
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white hover:bg-[#F2F8FC] text-[#163063] font-bold text-sm shadow-md transition-all group"
                >
                  <span>ابدأ تأهيل مشروعك الآن</span>
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                </Link>
                <Link
                  href="/sectors"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-white/25 hover:bg-white/10 text-white font-semibold text-sm transition-all"
                >
                  <span>استكشف قطاعاتنا الخمسة</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
