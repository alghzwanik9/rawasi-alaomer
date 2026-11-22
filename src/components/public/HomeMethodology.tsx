"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Milestone, Shield, Eye } from "lucide-react";

const steps = [
  {
    num: "1",
    title: "التشخيص والدراسة",
    desc: "تحليل الاحتياج، دراسات الجدوى، وفحص المتطلبات النظامية والميدانية المبدئية.",
    phase: "مرحلة التأسيس",
    bgClass: "bg-[#163063]",
    textClass: "text-[#163063]",
  },
  {
    num: "2",
    title: "التخطيط والتصميم",
    desc: "وضع خطة العمل الشاملة، المخططات الهندسية، واعتماد مصفوفة الحوكمة والمخاطر.",
    phase: "مرحلة الهيكلة",
    bgClass: "bg-[#2360A5]",
    textClass: "text-[#2360A5]",
  },
  {
    num: "3",
    title: "التنفيذ والتشييد",
    desc: "تفعيل فرق العمل الميدانية والتوريدات وتطبيق بروتوكولات السلامة ومراقبة الجودة.",
    phase: "مرحلة البناء الميداني",
    bgClass: "bg-[#3488C4]",
    textClass: "text-[#3488C4]",
  },
  {
    num: "4",
    title: "التسليم والاعتماد",
    desc: "الفحص الفني الدقيق، توثيق المخرجات، واستخراج التراخيص والاعتمادات النهائية.",
    phase: "مرحلة المطابقة",
    bgClass: "bg-[#2360A5]",
    textClass: "text-[#2360A5]",
  },
  {
    num: "5",
    title: "التشغيل واستدامة الأثر",
    desc: "إطلاق العمليات التشغيلية، الإشراف المستمر، وقياس مؤشرات العائد الاجتماعي والاقتصادي.",
    phase: "مرحلة الاستدامة",
    bgClass: "bg-[#47A3B8]",
    textClass: "text-[#47A3B8]",
  },
];

export function HomeMethodology() {
  return (
    <section className="w-full py-20 lg:py-28 bg-white border-b border-[#E2ECF5]/60">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-[#F2F8FC] border border-[#E2ECF5] px-4 py-1.5 rounded-full mb-4 shadow-sm">
            <Milestone className="w-4 h-4 text-[#163063]" />
            <span className="text-xs sm:text-sm font-bold text-[#163063]">
              منهجية رواسي العمر
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#163063] tracking-tight">
            رحلة متقنة من الفكرة إلى استقرار الأثر
          </h2>
          <p className="text-base sm:text-lg text-[#526071] mt-4 leading-relaxed font-normal">
            نتبع نموذج عمل تنفيذي منضبط يضمن التحكم الصارم بالجودة وتوثيق
            الاعتمادات في كل مرحلة من مراحل المشروع.
          </p>
        </div>

        {/* Stepper Horizontal Layout */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-5 relative text-right">
          {steps.map((step, index) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-[#F2F8FC] p-6 rounded-2xl border border-[#E2ECF5] flex flex-col justify-between shadow-sm relative group hover:bg-[#EAF3FA] transition-colors"
            >
              <div>
                <div
                  className={`w-11 h-11 rounded-full ${step.bgClass} text-white font-bold flex items-center justify-center text-lg mb-5 shadow-sm font-arabic`}
                >
                  {step.num}
                </div>
                <h3 className="text-lg font-bold text-[#163063] mb-2 font-arabic">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#526071] leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#E2ECF5]">
                <span className={`text-xs font-bold ${step.textClass}`}>
                  {step.phase}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Visual Metric Feature */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-14 bg-[#F2F8FC] border border-[#E2ECF5] p-8 sm:p-10 rounded-3xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-right"
        >
          <div className="lg:col-span-8">
            <div className="flex items-center gap-2 text-[#163063] mb-2">
              <Shield className="w-5 h-5 text-[#2360A5]" />
              <span className="text-sm font-bold text-[#163063]">
                حوكمة موثقة بنسبة 100%
              </span>
            </div>
            <h4 className="text-xl sm:text-2xl font-bold text-[#163063] mb-2">
              تقارير أداء دورية وشفافية مطلقة في كل خطوة
            </h4>
            <p className="text-sm sm:text-base text-[#526071] leading-relaxed">
              يحصل شركاؤنا على لوحات تحكم رقمية وتقارير متابعة دورية تضمن الإشراف
              اللحظي على مراحل المشروع ومؤشرات الأداء الرئيسية (KPIs).
            </p>
          </div>
          <div className="lg:col-span-4 flex justify-start lg:justify-end">
            <Link
              href="/impact"
              className="inline-flex items-center gap-2 bg-white hover:bg-[#E2ECF5] text-[#163063] font-bold text-sm px-6 py-3.5 rounded-xl border border-[#E2ECF5] shadow-sm hover:shadow transition-all"
            >
              <Eye className="w-4 h-4 text-[#2360A5]" />
              <span>استكشف دليل الحوكمة والأثر</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default HomeMethodology;
