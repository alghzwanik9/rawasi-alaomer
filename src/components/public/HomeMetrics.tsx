"use client";

import React from "react";
import { motion } from "framer-motion";
import { Network, RefreshCw, GitFork, CheckCircle2 } from "lucide-react";

const metrics = [
  {
    num: "5",
    label: "قطاعات تنفيذية",
    desc: "منظومة متكاملة تحت مظلة واحدة تغطي التطوير، التجهيز، التقنية، التشغيل، والمشاريع المجتمعية.",
    icon: Network,
    accent: "#163063",
    colorClass: "text-[#163063]",
  },
  {
    num: "360°",
    label: "دورة حياة كاملة",
    desc: "مرافقة مؤسسية وميدانية شاملة تبدأ من دراسة الجدوى وتستمر حتى استقرار التشغيل والأثر.",
    icon: RefreshCw,
    accent: "#2360A5",
    colorClass: "text-[#2360A5]",
  },
  {
    num: "6",
    label: "مسارات تخصصية",
    desc: "حلول دقيقة للقطاع غير الربحي تشمل التراخيص، الحوكمة الرشيدة، وبناء الأصول الوقفية المستدامة.",
    icon: GitFork,
    accent: "#3488C4",
    colorClass: "text-[#3488C4]",
  },
  {
    num: "100%",
    label: "التزام وحوكمة",
    desc: "مخرجات تنفيذية تتوافق تماماً مع الأنظمة واللوائح الرسمية ومعايير المركز الوطني لتنمية القطاع غير الربحي.",
    icon: CheckCircle2,
    accent: "#47A3B8",
    colorClass: "text-[#47A3B8]",
  },
];

export function HomeMetrics() {
  return (
    <section className="w-full bg-[#F2F8FC] py-14 border-b border-[#E2ECF5]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 sm:p-7 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-[#E2ECF5] group relative overflow-hidden text-right"
              >
                {/* Accent top pill */}
                <div
                  className="h-1.5 w-14 rounded-full mb-5"
                  style={{ backgroundColor: item.accent }}
                />

                <div className="flex items-baseline justify-between mb-2">
                  <span
                    className={`text-3xl sm:text-4xl font-bold ${item.colorClass} tracking-tight font-arabic`}
                  >
                    {item.num}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-[#F2F8FC] flex items-center justify-center text-[#163063] group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5 text-[#2360A5]" />
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-[#163063] mb-2 font-arabic">
                  {item.label}
                </h3>
                <p className="text-sm text-[#526071] leading-relaxed font-normal font-arabic">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HomeMetrics;
