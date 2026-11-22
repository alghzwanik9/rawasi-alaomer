"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Building2,
  ArrowLeft,
  Layers,
  CheckCircle2,
  ShieldCheck,
  Handshake,
} from "lucide-react";

export function HomeHero() {
  return (
    <section className="relative w-full overflow-hidden bg-white py-12 lg:py-20 border-b border-[#E2ECF5]/60">
      {/* Subtle Architectural Background Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#D5E4F8_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Right Column: Editorial Typographic Anchor */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-7 flex flex-col items-start text-right"
          >
            {/* Institutional Pill Badge */}
            <div className="inline-flex items-center gap-2 bg-[#F2F8FC] border border-[#E2ECF5] px-4 py-1.5 rounded-full shadow-sm mb-6">
              <Building2 className="w-4 h-4 text-[#163063]" />
              <span className="text-xs sm:text-sm font-bold text-[#163063]">
                كيان سعودي متكامل للتطوير والتنفيذ
              </span>
            </div>

            {/* Bold Display Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#163063] tracking-tight leading-[1.25]">
              نصنع المشاريع... ونبني لها{" "}
              <span className="text-[#2360A5] block sm:inline">
                عمراً من الأثر.
              </span>
            </h1>

            {/* Precision Subtitle */}
            <p className="text-base sm:text-lg text-[#526071] max-w-2xl mt-5 leading-relaxed font-normal">
              نجمع بين التخطيط الاستشاري والتنفيذ الميداني المتكامل تحت مظلة
              واحدة؛ نقود المشاريع من لحظة التأسيس وحتى استقرار التشغيل بمعايير
              حوكمة صارمة وجودة تنفيذ موثقة تواكب مستهدفات رؤية 2030.
            </p>

            {/* Interactive Action Controls */}
            <div className="mt-8 flex flex-wrap gap-4 items-center w-full sm:w-auto">
              <Link
                href="/start-project"
                className="inline-flex items-center justify-center bg-[#163063] hover:bg-[#2360A5] text-white font-semibold text-base px-7 py-3.5 rounded-xl shadow-md hover:shadow-xl transition-all duration-200 gap-2.5 group"
              >
                <span>ابدأ مشروعك الآن</span>
                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              </Link>

              <a
                href="#sectors"
                className="inline-flex items-center justify-center bg-[#F2F8FC] hover:bg-[#E2ECF5] text-[#163063] font-semibold text-base px-7 py-3.5 rounded-xl border border-[#E2ECF5] transition-all duration-200 gap-2.5"
              >
                <Layers className="w-5 h-5 text-[#2360A5]" />
                <span>استكشف قطاعاتنا</span>
              </a>
            </div>

            {/* Micro-Proof Metric Badges */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full bg-[#F2F8FC] border border-[#E2ECF5] p-4 rounded-xl">
              <div className="flex items-center gap-2 text-[#526071]">
                <CheckCircle2 className="w-5 h-5 text-[#47A3B8] shrink-0" />
                <span className="text-xs sm:text-sm font-semibold">
                  ترخيص واعتماد رسمي
                </span>
              </div>
              <div className="flex items-center gap-2 text-[#526071]">
                <ShieldCheck className="w-5 h-5 text-[#2360A5] shrink-0" />
                <span className="text-xs sm:text-sm font-semibold">
                  مواءمة تامة لرؤية 2030
                </span>
              </div>
              <div className="flex items-center gap-2 text-[#526071]">
                <Handshake className="w-5 h-5 text-[#3488C4] shrink-0" />
                <span className="text-xs sm:text-sm font-semibold">
                  شراكات استراتيجية رصينة
                </span>
              </div>
            </div>
          </motion.div>

          {/* Left Column: Architectural Arch Composition */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            className="lg:col-span-5 relative flex justify-center lg:justify-end"
          >
            {/* Backdrop Accent Halo */}
            <div className="absolute -top-10 -right-10 w-72 h-72 bg-[#D5E4F8]/40 rounded-full blur-3xl pointer-events-none" />

            {/* Monumental Arch Visual Plinth */}
            <div className="relative w-full max-w-md bg-white p-3.5 rounded-t-[140px] rounded-b-3xl shadow-2xl border border-[#E2ECF5]">
              <div className="relative w-full h-[460px] sm:h-[480px] rounded-t-[132px] rounded-b-2xl overflow-hidden bg-[#F2F8FC]">
                {/* Architectural Building Image */}
                <img
                  className="w-full h-full object-cover"
                  alt="المقر الرئيسي ومراكز التنفيذ المعمارية لرواسي العمر"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfrSZois5JtD-RtLIgnX9u6aSjZ4wlEuQrGFJ-bx57qPoKNpSjKaHV_icCB5gyTwlpoxj76cL0CZ0zmaElknF-yZtd-4Z98hZSd9jDT1In31PL-VkE07J1J046rsHdMMqocgPx58xu9J2CxFyuFXBrUegEiN1o1MFaO_-MepRigrOovChKL1EikVGlAe6qqdv2wfp5nFXsPcphQX472EnqBmhQwSk1WcFuGNgmMeg"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#163063]/90 via-[#163063]/25 to-transparent" />

                {/* Inset Architectural Spec Box */}
                <div className="absolute bottom-6 right-6 left-6 text-white text-right">
                  <div className="text-xs text-[#E2ECF5] mb-1 font-medium">
                    المقر الرئيسي ومراكز التنفيذ الميدانية
                  </div>
                  <div className="text-lg sm:text-xl font-bold">
                    معايير هندسية بمعايير عالمية
                  </div>
                </div>
              </div>

              {/* Genuine Authority Badge (No fake star ratings) */}
              <div className="absolute -bottom-5 -right-5 bg-white text-[#163063] p-4 rounded-2xl shadow-xl border border-[#E2ECF5] flex items-center gap-3.5 z-20">
                <div className="w-12 h-12 rounded-xl bg-[#163063] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <ShieldCheck className="w-6 h-6 text-[#47A3B8]" />
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-[#163063]">
                    منظومة معتمدة وموثوقة
                  </div>
                  <div className="text-xs text-[#526071] mt-0.5">
                    أعلى معايير الإتقان والتسليم والحوكمة
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default HomeHero;
