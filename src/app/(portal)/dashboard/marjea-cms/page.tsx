"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpenCheck,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  FileEdit,
  ExternalLink,
  ShieldCheck,
  Scale,
  Sparkles,
  AlertCircle,
  FileText,
  Search,
} from "lucide-react";
import { SEEDED_CMS_ITEMS, MarjeaCmsItem } from "@/data/portalSeed";
import { DEMO_USERS, getCurrentUser, UserProfile } from "@/data/portalAuth";

export default function MarjeaCmsPage() {
  const [items, setItems] = useState<MarjeaCmsItem[]>(SEEDED_CMS_ITEMS);
  const [currentUser, setCurrentUser] = useState<UserProfile>(
    DEMO_USERS.super_admin
  );
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [successToast, setSuccessToast] = useState("");

  useEffect(() => {
    setCurrentUser(getCurrentUser());
    const onRoleChange = () => setCurrentUser(getCurrentUser());
    window.addEventListener("rao-role-changed", onRoleChange);
    return () => window.removeEventListener("rao-role-changed", onRoleChange);
  }, []);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(""), 3000);
  };

  // Maker action: submit draft to review
  const handleSubmitForReview = (itemId: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              status: "in_review",
              lastModified: "اليوم (تم الرفع للمراجعة)",
              notes: "تم رفع المسودة إلى مراجع الحوكمة للتدقيق النظامي.",
            }
          : item
      )
    );
    showToast("تم رفع المسودة بنجاح إلى مراجع الحوكمة (Checker).");
  };

  // Checker action: approve publication
  const handleApprovePublication = (itemId: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              status: "published",
              checkerName: currentUser.name,
              lastModified: "اليوم (معتمد رسمياً)",
              notes: "تمت المصادقة والاعتماد النظامي للنشر في المرجع.",
            }
          : item
      )
    );
    showToast("تم اعتماد ونشر الإجراء في مرجع الجمعيات رسمياً!");
  };

  const filteredItems = items.filter((item) => {
    if (statusFilter !== "all" && item.status !== statusFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        item.code.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>منشور معتمد</span>
          </span>
        );
      case "in_review":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#2360A5] border border-blue-200">
            <Clock className="w-3.5 h-3.5 text-[#2360A5]" />
            <span>قيد المراجعة النظامية</span>
          </span>
        );
      case "draft":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <FileEdit className="w-3.5 h-3.5 text-amber-600" />
            <span>مسودة تحرير</span>
          </span>
        );
      default:
        return null;
    }
  };

  const isChecker =
    currentUser.role === "governance_reviewer" ||
    currentUser.role === "super_admin";
  const isMaker =
    currentUser.role === "marjea_editor" || currentUser.role === "super_admin";

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#163063] text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-[#47A3B8]" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-[#163063] flex items-center gap-2">
              <BookOpenCheck className="w-6 h-6 text-[#47A3B8]" />
              <span>حوكمة وإدارة محتوى مرجع الجمعيات (Maker-Checker CMS)</span>
            </h1>
            <span className="text-xs font-mono font-bold bg-[#2360A5] text-white px-2 py-0.5 rounded-full">
              {items.length} إجراء
            </span>
          </div>
          <p className="text-xs text-[#526071]">
            نظام الاعتماد المزدوج الصارم: صانع المحتوى (Maker) يُعد المسودة، ومراجع الحوكمة (Checker) يعتمد النشر.
          </p>
        </div>

        <Link
          href="/marjea"
          target="_blank"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#E2ECF5] text-xs font-bold text-[#163063] hover:bg-[#F2F8FC] transition-colors self-start md:self-auto"
        >
          <span>معاينة المرجع في الموقع العام</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* MAKER-CHECKER ROLE BADGE BANNER */}
      <div className="p-4 rounded-xl border border-[#2360A5]/20 bg-[#F2F8FC] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Scale className="w-5 h-5 text-[#2360A5] shrink-0" />
          <div>
            <span className="font-bold text-[#163063]">
              حالة صلاحيتك الحالية في نظام الاعتماد (Maker-Checker Workflow):
            </span>{" "}
            {currentUser.role === "marjea_editor" ? (
              <span className="text-[#2360A5]">
                أنت <strong>صانع المعرفة (Maker)</strong>: يمكنك إنشاء مسودات جديدة ورفعها للمراجعة، ولا يمكنك النشر المباشر دون مصادقة الحوكمة.
              </span>
            ) : currentUser.role === "governance_reviewer" ? (
              <span className="text-emerald-700 font-bold">
                أنت <strong>مراجع الحوكمة (Checker)</strong>: تملك صلاحية تدقيق المسودات واعتماد نشرها للجمهور بمرجع الجمعيات.
              </span>
            ) : currentUser.role === "super_admin" ? (
              <span className="text-[#163063]">
                أنت <strong>المدير العام (super_admin)</strong>: تملك صلاحية التحرير والاعتماد المزدوج الفوري.
              </span>
            ) : (
              <span className="text-[#526071]">
                أنت <strong>مدير قطاع</strong>: صلاحية اطلاع على الأدلة المنشورة.
              </span>
            )}
          </div>
        </div>

        <div className="text-[11px] font-mono text-[#526071]">
          الدور النشط: <strong>{currentUser.roleTitle}</strong>
        </div>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="bg-white rounded-2xl border border-[#E2ECF5] p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full md:w-96">
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#526071]">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث برمز الإجراء (GOV-...) أو العنوان أو التصنيف..."
            className="w-full pr-9 pl-3.5 py-2 rounded-xl border border-[#E2ECF5] text-xs text-[#163063] placeholder:text-[#526071]/50 focus:border-[#2360A5] focus:ring-1 focus:ring-[#2360A5]"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: "all", label: "كافة الحالات" },
            { id: "published", label: "منشور معتمد" },
            { id: "in_review", label: "قيد المراجعة" },
            { id: "draft", label: "مسودات تحرير" },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                statusFilter === st.id
                  ? "bg-[#163063] text-white shadow-xs"
                  : "bg-[#F2F8FC] text-[#526071] hover:text-[#163063]"
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* PROCEDURES CMS TABLE */}
      <div className="bg-white rounded-2xl border border-[#E2ECF5] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-[#F2F8FC] border-b border-[#E2ECF5] text-[#163063] font-bold">
              <tr>
                <th className="py-3.5 px-4">رمز الإجراء</th>
                <th className="py-3.5 px-4">عنوان الإجراء الإرشادي</th>
                <th className="py-3.5 px-4">التصنيف</th>
                <th className="py-3.5 px-4">الحالة والاعتماد</th>
                <th className="py-3.5 px-4">الصانع والمحرر</th>
                <th className="py-3.5 px-4">المراجع المعتمد</th>
                <th className="py-3.5 px-4">آخر تحديث</th>
                <th className="py-3.5 px-4 text-center">إجراءات الحوكمة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2ECF5]">
              {filteredItems.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-[#F2F8FC]/50 transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-[#163063]">
                    {item.code}
                  </td>
                  <td className="py-3.5 px-4 max-w-[280px]">
                    <p className="font-bold text-[#163063] leading-snug">
                      {item.title}
                    </p>
                    {item.notes && (
                      <p className="text-[11px] text-[#526071] line-clamp-1 mt-0.5">
                        {item.notes}
                      </p>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-[#526071]">{item.category}</td>
                  <td className="py-3.5 px-4">{getStatusBadge(item.status)}</td>
                  <td className="py-3.5 px-4 font-medium text-[#163063]">
                    {item.makerName}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-[#163063]">
                    {item.checkerName || (
                      <span className="text-[#526071] text-[11px]">
                        بانتظار المراجعة
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-[#526071]">{item.lastModified}</td>

                  {/* Actions based on role and status */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {/* If Draft & user can make -> Submit to Review */}
                      {item.status === "draft" && isMaker && (
                        <button
                          onClick={() => handleSubmitForReview(item.id)}
                          className="px-2.5 py-1 rounded-lg bg-[#2360A5] hover:bg-[#163063] text-white font-bold text-[11px] transition-colors shadow-xs"
                        >
                          رفع للمراجعة
                        </button>
                      )}

                      {/* If In Review & user can check -> Approve to Published */}
                      {item.status === "in_review" && isChecker && (
                        <button
                          onClick={() => handleApprovePublication(item.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors shadow-xs"
                        >
                          اعتماد ونشر
                        </button>
                      )}

                      {/* View Link */}
                      <Link
                        href={`/marjea`}
                        target="_blank"
                        className="p-1 rounded-lg hover:bg-[#F2F8FC] text-[#526071] hover:text-[#163063]"
                        title="معاينة في الموقع"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
