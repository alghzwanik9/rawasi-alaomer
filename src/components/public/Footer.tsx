import React from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { Phone, Mail, MapPin, ArrowLeft } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-[#163063] text-white pt-16 pb-10 border-t border-[#2360A5]/40 mt-auto">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info & Vision */}
          <div className="lg:col-span-5 flex flex-col items-start gap-4">
            <BrandLogo inverted className="h-10 w-auto" />
            <p className="text-sm md:text-base text-[#D4E3FF] max-w-md leading-relaxed mt-2 font-arabic">
              رواسي العمر: منظومة سعودية متكاملة للتطوير والتنفيذ والاستدامة
              المؤسسية، تواكب مستهدفات رؤية المملكة 2030 وترسخ قواعد البناء
              الرصين ("جهة واحدة، مسار واضح").
            </p>
            <div className="inline-flex items-center gap-2 bg-[#2360A5]/30 border border-[#3488C4]/30 px-3.5 py-1.5 rounded-full text-xs text-[#E2ECF5] mt-1">
              <span className="w-2 h-2 rounded-full bg-[#47A3B8] animate-pulse" />
              <span>كيان استشاري وتنفيذي مرخص ومعتمد</span>
            </div>
          </div>

          {/* Sector Links */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <h4 className="text-base font-bold text-white tracking-wide border-b border-[#2360A5]/40 pb-2">
              قطاعاتنا الخمسة
            </h4>
            <ul className="space-y-2 text-sm text-[#D4E3FF]">
              <li>
                <Link
                  href="/sectors/contracting"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-[#3488C4]" />
                  <span>المقاولات والتطوير الإنشائي</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/sectors/supply"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-[#3488C4]" />
                  <span>التجهيز والتوريد المتكامل</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/sectors/tech"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-[#3488C4]" />
                  <span>التقنية والحلول الذكية</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/sectors/operations"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-[#3488C4]" />
                  <span>التشغيل والصيانة المستدامة</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/sectors/community"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-[#3488C4]" />
                  <span>المشاريع المجتمعية والتنموية</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Ecosystem Links */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h4 className="text-base font-bold text-white tracking-wide border-b border-[#2360A5]/40 pb-2">
              المنظومة
            </h4>
            <ul className="space-y-2 text-sm text-[#D4E3FF]">
              <li>
                <Link
                  href="/non-profit"
                  className="hover:text-white transition-colors"
                >
                  القطاع غير الربحي
                </Link>
              </li>
              <li>
                <Link
                  href="/marjea"
                  className="hover:text-white transition-colors"
                >
                  مرجع الجمعيات
                </Link>
              </li>
              <li>
                <Link
                  href="/impact"
                  className="hover:text-white transition-colors"
                >
                  الحوكمة والأثر
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors"
                >
                  من نحن
                </Link>
              </li>
              <li>
                <Link
                  href="/start-project"
                  className="text-[#47A3B8] hover:underline font-semibold"
                >
                  بدء تأهيل مشروع
                </Link>
              </li>
            </ul>
          </div>

          {/* Executive Contact */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h4 className="text-base font-bold text-white tracking-wide border-b border-[#2360A5]/40 pb-2">
              التواصل التنفيذي
            </h4>
            <div className="space-y-3 text-sm text-[#D4E3FF]">
              <a
                href="tel:+966538881885"
                className="flex items-center gap-2 hover:text-white transition-colors dir-ltr justify-end"
              >
                <span>+966 53 888 1885</span>
                <Phone className="w-4 h-4 text-[#47A3B8] shrink-0" />
              </a>
              <a
                href="mailto:info@rawasialomar.sa"
                className="flex items-center gap-2 hover:text-white transition-colors justify-start"
              >
                <Mail className="w-4 h-4 text-[#47A3B8] shrink-0" />
                <span className="text-xs sm:text-sm">info@rawasialomar.sa</span>
              </a>
              <div className="flex items-start gap-2 text-xs sm:text-sm text-[#D4E3FF]">
                <MapPin className="w-4 h-4 text-[#47A3B8] shrink-0 mt-0.5" />
                <span>الرياض، المملكة العربية السعودية</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#D4E3FF]/70">
          <div>
            جميع الحقوق محفوظة لشركة رواسي العمر للتطوير والاستدامة © 2026
          </div>
          <div className="flex items-center gap-4">
            <span>الاستدامة المؤسسية والتميز التنفيذي</span>
            <span>•</span>
            <span>المملكة العربية السعودية</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
