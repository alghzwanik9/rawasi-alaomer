"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Search,
  X,
  Building2,
  Users,
  Vote,
  CreditCard,
  HeartHandshake,
  FileText,
  Clock,
  ChevronLeft,
  Sparkles,
  BookOpen,
} from "lucide-react";
import {
  Procedure,
  KnowledgeCategory,
  KNOWLEDGE_CATEGORIES,
  QUICK_ACTION_PILLS,
  PROCEDURES_DATA,
} from "@/data/marjeaSeed";
import { UnifiedProcedureCard } from "@/components/marjea/UnifiedProcedureCard";

interface MarjeaClientProps {
  initialProcedures?: Procedure[];
}

export function MarjeaClient({
  initialProcedures = PROCEDURES_DATA,
}: MarjeaClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeProcedureSlug, setActiveProcedureSlug] = useState("agm-meeting");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut Ctrl+K to focus search bar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter procedures based on search query and category
  const filteredProcedures = useMemo(() => {
    return initialProcedures.filter((proc) => {
      // Category filter
      const matchesCategory =
        selectedCategory === "all" || proc.categoryId === selectedCategory;

      if (!matchesCategory) return false;

      // Query filter
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const inTitle = proc.title.toLowerCase().includes(q);
      const inSummary = proc.shortSummary.toLowerCase().includes(q);
      const inDesc = proc.fullDescription.toLowerCase().includes(q);
      const inCode = proc.code.toLowerCase().includes(q);
      const inAuthority = proc.authority.toLowerCase().includes(q);
      const inSteps = proc.steps.some(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.officialInfo.text.toLowerCase().includes(q) ||
          s.advisoryTip.text.toLowerCase().includes(q)
      );
      const inTemplates = proc.templates.some(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      );

      return (
        inTitle ||
        inSummary ||
        inDesc ||
        inCode ||
        inAuthority ||
        inSteps ||
        inTemplates
      );
    });
  }, [initialProcedures, selectedCategory, searchQuery]);

  // Ensure active procedure is part of filtered list or fallback to first
  const activeProcedure = useMemo(() => {
    const match = filteredProcedures.find((p) => p.slug === activeProcedureSlug);
    if (match) return match;
    if (filteredProcedures.length > 0) return filteredProcedures[0];
    return initialProcedures[0];
  }, [filteredProcedures, activeProcedureSlug, initialProcedures]);

  // Handle Quick Action Pill click
  const handleQuickAction = (slug: string) => {
    setActiveProcedureSlug(slug);
    setSelectedCategory("all");
    setSearchQuery("");

    // Smooth scroll to procedure card
    const el = document.getElementById("procedure-view");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Helper icons for quick action pills
  const getPillIcon = (slug: string) => {
    switch (slug) {
      case "founding-association":
        return <Building2 className="w-4 h-4 text-[#2360A5]" />;
      case "agm-meeting":
        return <Users className="w-4 h-4 text-[#2360A5]" />;
      case "board-election":
        return <Vote className="w-4 h-4 text-[#3488C4]" />;
      case "bank-account-opening":
        return <CreditCard className="w-4 h-4 text-[#47A3B8]" />;
      case "ehsan-platform":
        return <HeartHandshake className="w-4 h-4 text-[#3488C4]" />;
      case "fundraising-permit":
        return <FileText className="w-4 h-4 text-[#2360A5]" />;
      default:
        return <Sparkles className="w-4 h-4 text-[#2360A5]" />;
    }
  };

  return (
    <div className="w-full bg-white">
      {/* BEGIN: Hero Knowledge Base Header */}
      <section
        className="hero-pattern border-b border-[#E2ECF5] py-14 sm:py-18 lg:py-20 relative overflow-hidden"
        data-purpose="knowledge-base-hero"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Top Pill Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E2ECF5] shadow-xs mb-6">
            <span className="w-2.5 h-2.5 rounded-full bg-[#47A3B8] animate-pulse" />
            <span className="text-xs font-bold text-[#2360A5] tracking-wide">
              المنصة الإجرائية والمعرفية للقطاع غير الربحي
            </span>
          </div>

          {/* Main Titles */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#163063] mb-3 tracking-tight font-arabic">
            مرجع الجمعيات
          </h1>
          <p className="text-xl sm:text-2xl font-bold text-[#3488C4] mb-4">
            من السؤال المتكرر... إلى المعرفة المستدامة
          </p>
          <p className="max-w-3xl mx-auto text-base sm:text-lg text-[#526071] leading-relaxed mb-10">
            دليلك الإجرائي الشامل لتأسيس وتشغيل وحوكمة الجمعيات الأهلية والأوقاف
            في المملكة، وفق أحدث تنظيمات المركز الوطني لتنمية القطاع غير الربحي.
          </p>

          {/* Prominent Live Procedural Search Bar */}
          <div className="max-w-3xl mx-auto bg-white p-2.5 sm:p-3 rounded-2xl shadow-xl shadow-[#163063]/5 border border-[#2360A5]/25 mb-8 transition-all focus-within:border-[#2360A5] focus-within:ring-2 focus-within:ring-[#2360A5]/20">
            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <div className="relative w-full flex items-center">
                <span className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-[#2360A5]">
                  <Search className="w-5 h-5" />
                </span>
                <input
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-20 pr-12 py-3.5 bg-transparent border-0 text-sm md:text-base text-[#163063] placeholder:text-[#526071]/60 focus:ring-0 focus:outline-none"
                  placeholder="ابحث عن إجراء أو نموذج... مثل: كيف أعقد جمعية عمومية عادية؟"
                  type="text"
                  aria-label="ابحث في مرجع الجمعيات"
                />

                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute left-16 text-[#526071] hover:text-[#163063] p-1"
                    title="مسح البحث"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                {/* Keyboard Shortcut Hint */}
                <span className="absolute left-3 top-1/2 -translate-y-1/2 hidden md:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-[#F2F8FC] border border-[#E2ECF5] text-[#526071]">
                  Ctrl + K
                </span>
              </div>

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#F2F8FC] hover:bg-[#E2ECF5] text-[#163063] text-xs font-bold transition-colors shrink-0"
                >
                  إلغاء التصفية
                </button>
              )}
            </div>
          </div>

          {/* Quick Action Pills ("ابدأ من هنا") */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-[#526071] uppercase tracking-wider mb-3">
              ابدأ من هنا (الإجراءات الأكثر طلباً):
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-4xl">
              {QUICK_ACTION_PILLS.map((pill) => {
                const isActive = activeProcedure?.slug === pill.slug;
                return (
                  <button
                    key={pill.slug}
                    onClick={() => handleQuickAction(pill.slug)}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs ${
                      isActive
                        ? "bg-[#F2F8FC] border-2 border-[#2360A5] text-[#2360A5] font-bold ring-2 ring-[#2360A5]/10"
                        : "bg-white hover:bg-[#F2F8FC] border border-[#E2ECF5] hover:border-[#2360A5]/40 text-[#163063]"
                    }`}
                  >
                    {getPillIcon(pill.slug)}
                    <span>{pill.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      {/* END: Hero Knowledge Base Header */}

      {/* BEGIN: Main Content Container */}
      <main className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        {/* The 9 Knowledge Categories Filter Bar */}
        <div
          className="flex items-center justify-between overflow-x-auto pb-4 mb-6 border-b border-[#E2ECF5] scrollbar-none"
          data-purpose="category-filters"
        >
          <div className="flex items-center gap-2 min-w-max">
            {KNOWLEDGE_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${
                    isSelected
                      ? "bg-[#2360A5] text-white shadow-xs"
                      : "bg-white text-[#526071] hover:text-[#2360A5] hover:bg-[#F2F8FC] border border-[#E2ECF5]"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Procedures Grid / Switcher (Displays all matching procedures) */}
        {filteredProcedures.length > 1 && (
          <div className="mb-8 bg-[#F2F8FC]/60 p-4 rounded-2xl border border-[#E2ECF5]">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-bold text-[#163063] flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#2360A5]" />
                <span>
                  الإجراءات المتاحة في هذا التصنيف ({filteredProcedures.length}):
                </span>
              </span>
              <span className="text-[11px] text-[#526071]">
                اضغط على أي إجراء لعرض خطواته ونماذجه المعتمدة أدناه
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredProcedures.map((proc) => {
                const isSelected = activeProcedure?.slug === proc.slug;
                return (
                  <button
                    key={proc.slug}
                    onClick={() => setActiveProcedureSlug(proc.slug)}
                    className={`text-right p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                      isSelected
                        ? "bg-white border-[#2360A5] shadow-sm ring-2 ring-[#2360A5]/20"
                        : "bg-white/80 hover:bg-white border-[#E2ECF5] hover:border-[#3488C4]/40"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] mb-1.5">
                        <span className="font-mono text-[#526071]">
                          {proc.code}
                        </span>
                        <span className="text-[#3488C4] font-semibold flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {proc.expectedTime}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#163063] mb-1">
                        {proc.title}
                      </h4>
                      <p className="text-[11px] text-[#526071] line-clamp-2 leading-relaxed">
                        {proc.shortSummary}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-[#E2ECF5]/80 flex items-center justify-between text-[11px]">
                      <span className="text-[#2360A5] font-semibold">
                        {proc.templates.length} نماذج جاهزة
                      </span>
                      <span
                        className={`font-bold flex items-center gap-1 ${
                          isSelected ? "text-[#2360A5]" : "text-[#526071]"
                        }`}
                      >
                        {isSelected ? "معروض حالياً" : "عرض الإجراء"}
                        <ChevronLeft className="w-3 h-3" />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* If no procedures matched search */}
        {filteredProcedures.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white rounded-2xl border border-[#E2ECF5]">
            <Search className="w-12 h-12 text-[#3488C4] mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[#163063] mb-1">
              لم نعثر على نتائج مطابقة لبحثك "{searchQuery}"
            </h3>
            <p className="text-sm text-[#526071] max-w-md mx-auto mb-6">
              جرّب استخدام كلمات مفتاحية أخرى مثل: "تأسيس"، "حوكمة"، "حساب بنكي"،
              أو استعرض كافة الإجراءات.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="px-6 py-2.5 rounded-xl bg-[#163063] text-white text-xs font-bold hover:bg-[#2360A5] transition-colors"
            >
              عرض كافة إجراءات المرجع
            </button>
          </div>
        ) : (
          <>
            {/* Breadcrumb Hierarchy */}
            <nav
              aria-label="مسار التصفح"
              className="flex text-xs md:text-sm text-[#526071] mb-6"
            >
              <ol className="inline-flex items-center space-x-reverse space-x-2">
                <li>
                  <Link
                    href="/"
                    className="hover:text-[#2360A5] transition-colors"
                  >
                    الرئيسية
                  </Link>
                </li>
                <li>
                  <span className="text-[#E2ECF5]">/</span>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setSelectedCategory("all");
                      setSearchQuery("");
                    }}
                    className="hover:text-[#2360A5] transition-colors font-medium"
                  >
                    مرجع الجمعيات
                  </button>
                </li>
                <li>
                  <span className="text-[#E2ECF5]">/</span>
                </li>
                <li>
                  <span className="text-[#526071]">
                    {activeProcedure.category}
                  </span>
                </li>
                <li>
                  <span className="text-[#E2ECF5]">/</span>
                </li>
                <li
                  aria-current="page"
                  className="font-bold text-[#163063] truncate max-w-[280px] sm:max-w-none"
                >
                  {activeProcedure.title}
                </li>
              </ol>
            </nav>

            {/* The Unified Procedure Card Component */}
            <UnifiedProcedureCard
              procedure={activeProcedure}
              isStandalone={false}
            />
          </>
        )}
      </main>
      {/* END: Main Content Container */}
    </div>
  );
}
