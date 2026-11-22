"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Compass,
  HeartHandshake,
  Building,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";

export function HomeTracks() {
  return (
    <section className="w-full py-20 lg:py-28 bg-white border-b border-[#E2ECF5]/60">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-[#F2F8FC] border border-[#E2ECF5] px-4 py-1.5 rounded-full mb-4 shadow-sm">
            <Compass className="w-4 h-4 text-[#163063]" />
            <span className="text-xs sm:text-sm font-bold text-[#163063]">
              مسارات الخدمة الرئيسية
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#163063] tracking-tight">
            وجهتان متكاملتان تلبيان تطلعات شركاء النجاح
          </h2>
          <p className="text-base sm:text-lg text-[#526071] mt-4 leading-relaxed font-normal">
            صممت رواسي العمر مساراتها لتقديم حلول تنفيذية دقيقة تلائم الاحتياجات
            المؤسسية للجهات غير الربحية والأهداف التوسعية للشركات الاستثمارية.
          </p>
        </div>

        {/* Split Dual Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {/* Track 1: Non-Profit & Endowments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="bg-[#F2F8FC] rounded-3xl p-8 sm:p-10 border border-[#E2ECF5] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden group text-right"
          >
            <div className="absolute top-0 right-0 left-0 h-2 bg-[#163063]" />
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-[#E2ECF5] flex items-center justify-center text-[#163063]">
                  <HeartHandshake className="w-8 h-8 text-[#163063]" />
                </div>
                <span className="text-xs font-bold text-[#163063] bg-white px-3.5 py-1.5 rounded-full border border-[#E2ECF5] shadow-sm">
                  المؤسسات الأهلية والأوقاف
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#163063] mb-4">
                بوابة القطاع غير الربحي والوقفي
              </h3>
              <p className="text-base text-[#526071] mb-8 leading-relaxed">
                شريككم الاستراتيجي لتأسيس الجمعيات والمؤسسات الأهلية والأوقاف،
                وتطوير الأنظمة وحوكمتها التشغيلية، وصياغة المبادرات المجتمعية ذات
                الأثر التنموي الباقي.
              </p>

              <ul className="space-y-3.5 mb-8">
                {[
                  "التأسيس واستخراج التراخيص النظامية من الجهات الرسمية",
                  "بناء الاستراتيجيات المؤسسية وإعداد الأدلة واللوائح المنظمة",
                  "تطبيق معايير الحوكمة والامتثال للوائح المركز الوطني",
                  "تجهيز وتشغيل المبادرات الوقفية والمشاريع التنموية الكبرى",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#47A3B8] shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base text-[#0E1D2B] font-medium">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/non-profit"
              className="inline-flex items-center gap-2 text-[#163063] hover:text-[#2360A5] font-bold text-base group-hover:gap-3 transition-all pt-4 border-t border-[#E2ECF5]"
            >
              <span>استكشف خدمات القطاع غير الربحي</span>
              <ArrowLeft className="w-5 h-5 text-[#2360A5]" />
            </Link>
          </motion.div>

          {/* Track 2: Commercial & Investors */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="bg-[#F2F8FC] rounded-3xl p-8 sm:p-10 border border-[#E2ECF5] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden group text-right"
          >
            <div className="absolute top-0 right-0 left-0 h-2 bg-[#2360A5]" />
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-[#E2ECF5] flex items-center justify-center text-[#2360A5]">
                  <Building className="w-8 h-8 text-[#2360A5]" />
                </div>
                <span className="text-xs font-bold text-[#2360A5] bg-white px-3.5 py-1.5 rounded-full border border-[#E2ECF5] shadow-sm">
                  قطاع الأعمال والمطورين
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#163063] mb-4">
                بوابة الأعمال والمطورين والمستثمرين
              </h3>
              <p className="text-base text-[#526071] mb-8 leading-relaxed">
                حلول متقدمة في المقاولات العامة، التجهيز والتأثيث المتكامل،
                البنية الرقمية، وإدارة المرافق للمشاريع الكبرى بجودة قياسية
                وسرعة تسليم منضبطة.
              </p>

              <ul className="space-y-3.5 mb-8">
                {[
                  "المقاولات الإنشائية والتطوير العمراني المتخصص",
                  "التجهيز الفندقي، المكتبي، والتوريدات الشاملة للأصول",
                  "حلول البنية التقنية والتحول الرقمي والأنظمة الذكية",
                  "إدارة المرافق وعقود التشغيل والصيانة الوقائية المستمرة",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#3488C4] shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base text-[#0E1D2B] font-medium">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/sectors"
              className="inline-flex items-center gap-2 text-[#163063] hover:text-[#2360A5] font-bold text-base group-hover:gap-3 transition-all pt-4 border-t border-[#E2ECF5]"
            >
              <span>استكشف حلول الأعمال والمستثمرين</span>
              <ArrowLeft className="w-5 h-5 text-[#2360A5]" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default HomeTracks;
