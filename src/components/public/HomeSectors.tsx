"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Layers,
  HardHat,
  Package,
  Cpu,
  Wrench,
  Sprout,
  ArrowLeft,
} from "lucide-react";

export function HomeSectors() {
  return (
    <section className="w-full py-20 lg:py-28 bg-[#F2F8FC] border-b border-[#E2ECF5]" id="sectors">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl text-right">
            <div className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full mb-4 shadow-sm border border-[#E2ECF5]">
              <Layers className="w-4 h-4 text-[#163063]" />
              <span className="text-xs sm:text-sm font-bold text-[#163063]">
                منظومة رواسي العمر
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-[#163063] tracking-tight">
              خمسة قطاعات تنفيذية متخصصة
            </h2>
            <p className="text-base sm:text-lg text-[#526071] mt-3 leading-relaxed">
              تتكامل قطاعاتنا لتمنح مشاريعكم كفاءة التنسيق، سرعة الإنجاز، وضمان
              الجودة الشاملة تحت قيادة موحدة.
            </p>
          </div>
          <div className="shrink-0">
            <Link
              href="/sectors"
              className="inline-flex items-center gap-2 text-[#163063] hover:text-[#2360A5] font-bold text-sm sm:text-base group"
            >
              <span>عرض تفاصيل كافة القطاعات</span>
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 text-right">
          {/* Sector 01 (Major Feature Card - Spans 7 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 bg-white p-8 sm:p-9 rounded-3xl border border-[#E2ECF5] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden group"
          >
            <div className="flex items-center justify-between mb-6">
              <span className="text-4xl sm:text-5xl font-bold text-[#163063]/15 font-arabic">
                01
              </span>
              <div className="w-14 h-14 rounded-2xl bg-[#F2F8FC] border border-[#E2ECF5] flex items-center justify-center text-[#163063]">
                <HardHat className="w-7 h-7 text-[#163063]" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-[#163063] mb-3">
                المقاولات والتطوير الإنشائي
              </h3>
              <p className="text-base text-[#526071] mb-6 leading-relaxed">
                تنفيذ المشاريع الإنشائية، التطوير العمراني، التأهيل المعماري،
                وأعمال التشطيبات الفاخرة المعتمدة على أرقى المعايير الهندسية
                وأنظمة السلامة والجودة العالمية.
              </p>
              <div className="flex flex-wrap gap-2">
                {["إنشاءات متقدمة", "تشطيبات معمارية", "إشراف هندسي موثق"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="bg-[#F2F8FC] border border-[#E2ECF5] text-[#163063] text-xs font-semibold px-3 py-1.5 rounded-lg"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </div>
          </motion.div>

          {/* Sector 02 (Spans 5 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-5 bg-white p-8 sm:p-9 rounded-3xl border border-[#E2ECF5] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden group"
          >
            <div className="flex items-center justify-between mb-6">
              <span className="text-4xl sm:text-5xl font-bold text-[#2360A5]/15 font-arabic">
                02
              </span>
              <div className="w-14 h-14 rounded-2xl bg-[#F2F8FC] border border-[#E2ECF5] flex items-center justify-center text-[#2360A5]">
                <Package className="w-7 h-7 text-[#2360A5]" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-[#163063] mb-3">
                التجهيز والتوريد المتكامل
              </h3>
              <p className="text-base text-[#526071] mb-6 leading-relaxed">
                تأثيث المقرات الإدارية والتعليمية والفندقية، وتوريد التجهيزات
                الميدانية مع إدارة سلاسل إمداد موثوقة تضمن الجودة وسرعة التوريد.
              </p>
              <div className="flex flex-wrap gap-2">
                {["تأثيث مقرات", "تجهيز مكتبي شامل", "سلاسل إمداد"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="bg-[#F2F8FC] border border-[#E2ECF5] text-[#2360A5] text-xs font-semibold px-3 py-1.5 rounded-lg"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </div>
          </motion.div>

          {/* Sector 03 (Spans 4 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-4 bg-white p-7 sm:p-8 rounded-3xl border border-[#E2ECF5] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden group"
          >
            <div className="flex items-center justify-between mb-5">
              <span className="text-3xl sm:text-4xl font-bold text-[#3488C4]/20 font-arabic">
                03
              </span>
              <div className="w-12 h-12 rounded-2xl bg-[#F2F8FC] border border-[#E2ECF5] flex items-center justify-center text-[#3488C4]">
                <Cpu className="w-6 h-6 text-[#3488C4]" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#163063] mb-2.5">
                التقنية والحلول الذكية
              </h3>
              <p className="text-sm text-[#526071] mb-5 leading-relaxed">
                بناء البنى التحتية الرقمية، المنصات السحابية، ربط أنظمة إدارة
                المؤسسات (ERP)، وتوفير منظومات الأمان الذكي.
              </p>
              <div className="flex flex-wrap gap-2">
                {["منصات سحابية", "تحول رقمي"].map((tag) => (
                  <span
                    key={tag}
                    className="bg-[#F2F8FC] border border-[#E2ECF5] text-[#3488C4] text-xs font-semibold px-2.5 py-1 rounded-lg"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Sector 04 (Spans 4 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="lg:col-span-4 bg-white p-7 sm:p-8 rounded-3xl border border-[#E2ECF5] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden group"
          >
            <div className="flex items-center justify-between mb-5">
              <span className="text-3xl sm:text-4xl font-bold text-[#2360A5]/20 font-arabic">
                04
              </span>
              <div className="w-12 h-12 rounded-2xl bg-[#F2F8FC] border border-[#E2ECF5] flex items-center justify-center text-[#2360A5]">
                <Wrench className="w-6 h-6 text-[#2360A5]" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#163063] mb-2.5">
                التشغيل والصيانة المستدامة
              </h3>
              <p className="text-sm text-[#526071] mb-5 leading-relaxed">
                إدارة شاملة للمرافق الحيوية وبرامج صيانة وقائية وطارئة ترفع
                الكفاءة التشغيلية وتحمي القيمة السوقية للأصول.
              </p>
              <div className="flex flex-wrap gap-2">
                {["إدارة مرافق", "صيانة وقائية"].map((tag) => (
                  <span
                    key={tag}
                    className="bg-[#F2F8FC] border border-[#E2ECF5] text-[#2360A5] text-xs font-semibold px-2.5 py-1 rounded-lg"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Sector 05 (Spans 4 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-4 bg-white p-7 sm:p-8 rounded-3xl border border-[#E2ECF5] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden group"
          >
            <div className="flex items-center justify-between mb-5">
              <span className="text-3xl sm:text-4xl font-bold text-[#47A3B8]/25 font-arabic">
                05
              </span>
              <div className="w-12 h-12 rounded-2xl bg-[#F2F8FC] border border-[#E2ECF5] flex items-center justify-center text-[#47A3B8]">
                <Sprout className="w-6 h-6 text-[#47A3B8]" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#163063] mb-2.5">
                المشاريع والمبادرات المجتمعية
              </h3>
              <p className="text-sm text-[#526071] mb-5 leading-relaxed">
                تصميم وتنفيذ المبادرات التنموية المستدامة، صياغة برامج المسؤولية
                المجتمعية، وقياس العائد الاجتماعي للأثر (SROI).
              </p>
              <div className="flex flex-wrap gap-2">
                {["أثر مجتمعي", "حوكمة التنمية"].map((tag) => (
                  <span
                    key={tag}
                    className="bg-[#F2F8FC] border border-[#E2ECF5] text-[#47A3B8] text-xs font-semibold px-2.5 py-1 rounded-lg"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default HomeSectors;
