"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Flag, ArrowLeft, Phone } from "lucide-react";

export function HomeCta() {
  return (
    <section className="w-full py-20 lg:py-28 bg-[#F2F8FC]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl p-8 sm:p-14 lg:p-16 text-center shadow-xl border border-[#E2ECF5] relative overflow-hidden"
        >
          {/* Architectural Decorative Glow */}
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-[#D5E4F8]/40 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#E2ECF5]/50 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#F2F8FC] border border-[#E2ECF5] text-[#163063] mb-6 shadow-sm">
              <Flag className="w-8 h-8 text-[#163063]" />
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-[#163063] mb-5 tracking-tight">
              هل أنت مستعد لبدء مشروعك القادم بثقة واستدامة؟
            </h2>

            <p className="text-base sm:text-lg text-[#526071] mb-10 max-w-2xl mx-auto leading-relaxed font-normal">
              فريق استشاري وتنفيذي متخصص جاهز للجلوس معك، دراسة احتياجاتك،
              وصياغة خطة عمل متكاملة تقود مشروعك إلى النجاح المؤسسي المشهود.
            </p>

            <div className="flex flex-wrap gap-4 justify-center items-center">
              <Link
                href="/start-project"
                className="inline-flex items-center justify-center bg-[#163063] hover:bg-[#2360A5] text-white font-semibold text-base px-8 py-4 rounded-full shadow-md hover:shadow-xl transition-all duration-200 gap-2.5 group"
              >
                <span>ابدأ مشروعك الآن</span>
                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              </Link>

              <a
                href="tel:+966575999956"
                className="inline-flex items-center justify-center bg-[#F2F8FC] hover:bg-[#E2ECF5] text-[#163063] font-semibold text-base px-8 py-4 rounded-full border border-[#E2ECF5] transition-all duration-200 gap-2.5 dir-ltr"
              >
                <Phone className="w-5 h-5 text-[#2360A5]" />
                <span className="font-bold">+966 57 599 9956</span>
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-[#526071]">
              <span>استشارات أولية متخصصة</span>
              <span>•</span>
              <span>اتفاقيات مستوى خدمة صارمة (SLA)</span>
              <span>•</span>
              <span>تغطية شاملة لكافة مناطق المملكة</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default HomeCta;
