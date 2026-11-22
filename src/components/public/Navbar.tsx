"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/BrandLogo";
import { Menu, X, ArrowLeft, User } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "الرئيسية", href: "/" },
  { label: "من نحن", href: "/about" },
  { label: "قطاعاتنا", href: "/sectors" },
  { label: "القطاع غير الربحي", href: "/non-profit" },
  { label: "مرجع الجمعيات", href: "/marjea" },
  { label: "الأثر", href: "/impact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-[0_4px_20px_rgba(22,48,99,0.06)] border-b border-[#E2ECF5]"
          : "bg-white/90 backdrop-blur-sm border-b border-[#E2ECF5]/60"
      }`}
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <BrandLogo />

        {/* Desktop Navigation Links */}
        <nav
          className="hidden xl:flex items-center gap-7 text-[15px] font-medium"
          aria-label="القائمة الرئيسية"
        >
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative py-1.5 transition-colors duration-200 ${
                  isActive
                    ? "text-[#163063] font-bold"
                    : "text-[#526071] hover:text-[#163063]"
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 right-0 left-0 h-0.5 bg-[#2360A5] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls & Portal */}
        <div className="flex items-center gap-3">
          {/* Employee Portal Link */}
          <Link
            href="/login"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-[#526071] hover:text-[#163063] transition-colors px-3 py-2 rounded-lg hover:bg-[#F2F8FC]"
          >
            <User className="w-4 h-4 text-[#2360A5]" />
            <span>بوابة الموظفين</span>
          </Link>

          {/* Primary CTA: ابدأ مشروعك */}
          <Link
            href="/start-project"
            className="inline-flex items-center justify-center gap-2 bg-[#163063] hover:bg-[#2360A5] text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-[0_2px_8px_rgba(22,48,99,0.15)] hover:shadow-[0_4px_16px_rgba(22,48,99,0.25)] transition-all duration-200 group"
          >
            <span>ابدأ مشروعك</span>
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          </Link>

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 text-[#163063] hover:bg-[#F2F8FC] rounded-lg transition-colors"
            aria-label={mobileMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-[#E2ECF5] shadow-xl px-6 py-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                    isActive
                      ? "bg-[#F2F8FC] text-[#163063] font-bold"
                      : "text-[#526071] hover:bg-[#F2F8FC] hover:text-[#163063]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-[#E2ECF5] flex flex-col gap-3">
            <Link
              href="/login"
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold text-[#526071] hover:bg-[#F2F8FC] hover:text-[#163063]"
            >
              <span className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#2360A5]" />
                بوابة الموظفين
              </span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
