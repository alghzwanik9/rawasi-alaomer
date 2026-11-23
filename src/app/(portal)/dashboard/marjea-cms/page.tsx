"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpenCheck,
  Plus,
  CheckCircle2,
  Clock,
  FileEdit,
  ExternalLink,
  Scale,
  Search,
  RefreshCw,
  RotateCcw,
  X,
} from "lucide-react";
import { SEEDED_CMS_ITEMS, MarjeaCmsItem } from "@/data/portalSeed";
import { DEMO_USERS, getCurrentUser, UserProfile } from "@/data/portalAuth";

export default function MarjeaCmsPage() {
  const [items, setItems] = useState<MarjeaCmsItem[]>(SEEDED_CMS_ITEMS);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile>(
    DEMO_USERS.super_admin
  );
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [successToast, setSuccessToast] = useState("");
  const [showNewModal, setShowNewModal] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("الحوكمة واللوائح");
  const [newCategoryId, setNewCategoryId] = useState("governance");
  const [newNotes, setNewNotes] = useState("");

  useEffect(() => {
    setCurrentUser(getCurrentUser());
    fetchCmsItems();
    const onRoleChange = () => {
      setCurrentUser(getCurrentUser());
      fetchCmsItems();
    };
    window.addEventListener("rao-role-changed", onRoleChange);
    return () => window.removeEventListener("rao-role-changed", onRoleChange);
  }, []);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(""), 3500);
  };

  const fetchCmsItems = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/marjea", { cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.items)) {
        setItems(data.items);
      }
    } catch (e) {
      console.error("Failed to fetch Marjea CMS items:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWorkflowAction = async (
    itemId: string,
    action: "submit_for_review" | "approve_publish" | "return_to_draft"
  ) => {
    setIsMutating(true);
    try {
      const res = await fetch("/api/marjea", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: itemId, action }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.error || "تعذر تنفيذ الإجراء في قاعدة البيانات.");
        return;
      }

      setItems((prev) =>
        prev.map((item) => (item.id === itemId ? data.item : item))
      );

      if (action === "submit_for_review") {
        showToast("تم رفع المسودة وحفظها في Supabase لمراجع الحوكمة (Checker).");
      } else if (action === "approve_publish") {
        showToast("تم اعتماد ونشر الإجراء في قاعدة بيانات Supabase رسمياً!");
      } else {
        showToast("تمت إعادة الدليل إلى حالة المسودة في قاعدة البيانات.");
      }
    } catch (e) {
      console.error("Workflow action failed:", e);
      showToast("حدث خطأ أثناء الاتصال بالخادم.");
    } finally {
      setIsMutating(false);
    }
  };

  const handleCreateDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setIsMutating(true);
    try {
      const res = await fetch("/api/marjea", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code:
            newCode.trim() || `GOV-DRF-${Math.floor(10 + Math.random() * 89)}`,
          title: newTitle.trim(),
          category: newCategory,
          categoryId: newCategoryId,
          notes: newNotes.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.error || "تعذر إنشاء المسودة.");
        return;
      }

      setItems((prev) => [data.item, ...prev]);
      setShowNewModal(false);
      setNewCode("");
      setNewTitle("");
      setNewNotes("");
      showToast("تم إنشاء مسودة الدليل وحفظها في جدول marjea_procedures بنجاح!");
    } catch (e) {
      console.error("Failed to create draft:", e);
    } finally {
      setIsMutating(false);
    }
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
            <h1 className="text-2xl font-bold text-[#163063] flex items-center gap-2">
              <BookOpenCheck className="w-6 h-6 text-[#47A3B8]" />
              <span>حوكمة وإدارة محتوى مرجع الجمعيات (Maker-Checker CMS)</span>
            </h1>
            <span className="text-xs font-semibold bg-[#2360A5] text-white px-2.5 py-0.5 rounded-full">
              {items.length} إجراء
            </span>
          </div>
          <p className="text-xs text-[#526071]">
            نظام الاعتماد المزدوج المتصل مباشرة بجدول{" "}
            <code className="font-mono">marjea_procedures</code> وسجل{" "}
            <code className="font-mono">cms_workflow_logs</code> في Supabase.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={fetchCmsItems}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white border border-[#E2ECF5] text-xs font-bold text-[#163063] hover:bg-[#F2F8FC] transition-colors"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
            />
            <span>مزامنة من Supabase</span>
          </button>

          {isMaker && (
            <button
              onClick={() => setShowNewModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#163063] hover:bg-[#2360A5] text-white text-xs font-bold transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>إنشاء مسودة دليل جديد</span>
            </button>
          )}

          <Link
            href="/marjea"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#E2ECF5] text-xs font-bold text-[#163063] hover:bg-[#F2F8FC] transition-colors"
          >
            <span>معاينة المرجع العام</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
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
                أنت <strong>صانع المعرفة (Maker)</strong>: يمكنك إنشاء مسودات
                جديدة ورفعها للمراجعة، ولا يمكنك النشر المباشر دون مصادقة
                الحوكمة.
              </span>
            ) : currentUser.role === "governance_reviewer" ? (
              <span className="text-emerald-700 font-bold">
                أنت <strong>مراجع الحوكمة (Checker)</strong>: تملك صلاحية تدقيق
                المسودات واعتماد نشرها للجمهور بمرجع الجمعيات.
              </span>
            ) : currentUser.role === "super_admin" ? (
              <span className="text-[#163063]">
                أنت <strong>المدير العام (super_admin)</strong>: تملك صلاحية
                التحرير والاعتماد المزدوج الفوري.
              </span>
            ) : (
              <span className="text-[#526071]">
                أنت <strong>مدير قطاع</strong>: صلاحية اطلاع على الأدلة المنشورة.
              </span>
            )}
          </div>
        </div>

        <div className="text-[11px] font-medium text-[#526071]">
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
                  <td className="py-3.5 px-4 font-bold text-[#163063] tracking-wide">
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
                  <td className="py-3.5 px-4 text-[#526071]">
                    {item.lastModified}
                  </td>

                  {/* Actions based on role and status */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {/* If Draft & user can make -> Submit to Review */}
                      {item.status === "draft" && isMaker && (
                        <button
                          disabled={isMutating}
                          onClick={() =>
                            handleWorkflowAction(item.id, "submit_for_review")
                          }
                          className="px-2.5 py-1 rounded-lg bg-[#2360A5] hover:bg-[#163063] disabled:opacity-50 text-white font-bold text-[11px] transition-colors shadow-xs"
                        >
                          رفع للمراجعة
                        </button>
                      )}

                      {/* If In Review & user can check -> Approve or Return */}
                      {item.status === "in_review" && isChecker && (
                        <>
                          <button
                            disabled={isMutating}
                            onClick={() =>
                              handleWorkflowAction(item.id, "approve_publish")
                            }
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-[11px] transition-colors shadow-xs"
                          >
                            اعتماد ونشر
                          </button>
                          <button
                            disabled={isMutating}
                            onClick={() =>
                              handleWorkflowAction(item.id, "return_to_draft")
                            }
                            title="إعادة للمحرر"
                            className="p-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}

                      {/* View Link */}
                      <Link
                        href="/marjea"
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

      {/* Create New Draft Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-[#163063]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E2ECF5] max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2ECF5] pb-3">
              <h3 className="text-base font-semibold text-[#163063]">
                إنشاء مسودة دليل إجرائي جديد (Supabase Live)
              </h3>
              <button
                onClick={() => setShowNewModal(false)}
                className="text-[#526071] hover:text-[#163063]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDraft} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#163063] mb-1">
                  رمز الإجراء (اختياري):
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="GOV-NEW-08"
                  className="w-full px-3 py-2 rounded-xl border border-[#E2ECF5] text-[#163063]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#163063] mb-1">
                  عنوان الدليل الإجرائي:
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="مثال: ضوابط التعاقد مع المكاتب المحاسبية المعتمدة"
                  className="w-full px-3 py-2 rounded-xl border border-[#E2ECF5] text-[#163063]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#163063] mb-1">
                  التصنيف المعرفي:
                </label>
                <select
                  value={newCategoryId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setNewCategoryId(id);
                    const map: Record<string, string> = {
                      governance: "الحوكمة واللوائح",
                      licensing: "التأسيس والتراخيص",
                      finance: "المالية والمصارف",
                      fundraising: "جمع التبرعات وتنمية الموارد",
                      digital: "المنصات الحكومية والرقمية",
                      awqaf: "الأوقاف والوصايا",
                    };
                    setNewCategory(map[id] || "الحوكمة واللوائح");
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2ECF5] text-[#163063]"
                >
                  <option value="governance">الحوكمة واللوائح</option>
                  <option value="licensing">التأسيس والتراخيص</option>
                  <option value="finance">المالية والمصارف</option>
                  <option value="fundraising">جمع التبرعات وتنمية الموارد</option>
                  <option value="digital">المنصات الحكومية والرقمية</option>
                  <option value="awqaf">الأوقاف والوصايا</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#163063] mb-1">
                  ملخص وملاحظات التحرير:
                </label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="نبذة مختصرة عن الإجراء والمرجعية النظامية..."
                  className="w-full px-3 py-2 rounded-xl border border-[#E2ECF5] text-[#163063]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#E2ECF5] text-[#526071] font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isMutating}
                  className="px-4 py-2 rounded-xl bg-[#163063] hover:bg-[#2360A5] text-white font-bold"
                >
                  {isMutating ? "جاري الحفظ..." : "حفظ المسودة في Supabase"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
