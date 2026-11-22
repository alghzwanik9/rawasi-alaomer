"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Inbox,
  Search,
  Filter,
  RefreshCw,
  MessageCircle,
  Clock,
  MapPin,
  Building,
  User,
  Phone,
  Mail,
  ChevronDown,
  Check,
  ShieldAlert,
  UserCheck,
  ExternalLink,
  Calendar,
  Wallet,
  Sparkles,
  Layers,
  X,
} from "lucide-react";
import { InquiryRecord } from "@/app/api/inquiries/route";
import { DEMO_USERS, getCurrentUser, UserProfile } from "@/data/portalAuth";

export default function LeadsCrmPage() {
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserProfile>(
    DEMO_USERS.super_admin
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryRecord | null>(
    null
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [rbacBypass, setRbacBypass] = useState(false);
  const [accessDeniedMsg, setAccessDeniedMsg] = useState<string | null>(null);

  useEffect(() => {
    setCurrentUser(getCurrentUser());
    fetchInquiries();
    const onRoleChange = () => {
      setCurrentUser(getCurrentUser());
      fetchInquiries();
    };
    window.addEventListener("rao-role-changed", onRoleChange);
    return () => window.removeEventListener("rao-role-changed", onRoleChange);
  }, []);

  const fetchInquiries = async () => {
    setIsLoading(true);
    setAccessDeniedMsg(null);
    try {
      const res = await fetch("/api/inquiries", { cache: "no-store" });
      const data = await res.json();
      if (res.status === 401 || res.status === 403) {
        setInquiries([]);
        setAccessDeniedMsg(
          data.error ||
            "صلاحيات دورك الحالي لا تخولك الوصول إلى سجل طلبات المشاريع (CRM)."
        );
        return;
      }
      if (data.success && Array.isArray(data.inquiries)) {
        setInquiries(data.inquiries);
      }
    } catch (e) {
      console.error("Error fetching inquiries:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (inquiryId: string, newStatus: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: inquiryId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setInquiries((prev) =>
          prev.map((item) =>
            item.id === inquiryId || item.refId === inquiryId
              ? { ...item, status: newStatus as any }
              : item
          )
        );
        if (selectedInquiry) {
          setSelectedInquiry((prev) =>
            prev ? { ...prev, status: newStatus as any } : null
          );
        }
      }
    } catch (e) {
      console.error("Failed to update status", e);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAssignToManager = async (
    inquiryId: string,
    managerEmail: string
  ) => {
    setIsUpdating(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: inquiryId, assignedTo: managerEmail }),
      });
      const data = await res.json();
      if (data.success) {
        setInquiries((prev) =>
          prev.map((item) =>
            item.id === inquiryId || item.refId === inquiryId
              ? { ...item, assignedTo: managerEmail }
              : item
          )
        );
      }
    } catch (e) {
      console.error("Failed to assign manager", e);
    } finally {
      setIsUpdating(false);
    }
  };

  // Enforce RBAC Lead Isolation
  const visibleInquiries = useMemo(() => {
    return inquiries.filter((inq) => {
      // If Super Admin or bypass enabled -> sees all
      if (currentUser.role === "super_admin" || rbacBypass) {
        // Continue to search/status filters
      } else if (currentUser.role === "sector_manager") {
        // Sector manager sees leads assigned to them or containing their sector ("contracting")
        const isAssigned = inq.assignedTo === currentUser.email;
        const matchesSector =
          currentUser.sector && inq.services.includes(currentUser.sector);
        if (!isAssigned && !matchesSector) {
          return false;
        }
      }

      // Filter by status
      if (statusFilter !== "all" && inq.status !== statusFilter) {
        return false;
      }

      // Filter by search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inRef = inq.refId.toLowerCase().includes(q);
        const inEntity = (inq.entityName || inq.entityTypeName)
          .toLowerCase()
          .includes(q);
        const inContact = inq.contactName.toLowerCase().includes(q);
        const inPhone = inq.contactPhone.toLowerCase().includes(q);
        const inCity = inq.city.toLowerCase().includes(q);
        return inRef || inEntity || inContact || inPhone || inCity;
      }

      return true;
    });
  }, [inquiries, currentUser, rbacBypass, statusFilter, searchQuery]);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "new":
        return {
          label: "جديد",
          className: "bg-amber-50 text-amber-700 border-amber-200",
        };
      case "reviewing":
        return {
          label: "قيد الدراسة",
          className: "bg-blue-50 text-[#2360A5] border-blue-200",
        };
      case "contacted":
        return {
          label: "تم التواصل",
          className: "bg-purple-50 text-purple-700 border-purple-200",
        };
      case "proposal_sent":
        return {
          label: "تم إرسال العرض",
          className: "bg-emerald-50 text-emerald-700 border-emerald-200",
        };
      case "closed_won":
        return {
          label: "مغلق بنجاح",
          className: "bg-emerald-100 text-emerald-800 border-emerald-300",
        };
      default:
        return {
          label: status,
          className: "bg-slate-100 text-slate-700 border-slate-200",
        };
    }
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-[#163063] flex items-center gap-2">
              <Inbox className="w-6 h-6 text-[#2360A5]" />
              <span>إدارة وتأهيل طلبات المشاريع (CRM Pipeline)</span>
            </h1>
            <span className="text-xs font-mono font-bold bg-[#163063] text-white px-2 py-0.5 rounded-full">
              {visibleInquiries.length} طلب
            </span>
          </div>
          <p className="text-xs text-[#526071]">
            ربط مباشر مع معالج /start-project، توليد الأرقام المرجعية، والمتابعة عبر الواتساب.
          </p>
        </div>

        {/* Actions & Refresh */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchInquiries}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#E2ECF5] text-xs font-bold text-[#163063] hover:bg-[#F2F8FC] transition-colors"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
            />
            <span>تحديث البيانات</span>
          </button>
        </div>
      </div>

      {/* RBAC ROLE NOTIFICATION BANNER */}
      <div
        className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${
          currentUser.role === "super_admin"
            ? "bg-[#163063]/5 border-[#163063]/20 text-[#163063]"
            : currentUser.role === "sector_manager"
            ? "bg-[#2360A5]/5 border-[#2360A5]/20 text-[#2360A5]"
            : "bg-slate-100 border-slate-200 text-slate-700"
        }`}
      >
        <div className="flex items-center gap-2.5">
          <UserCheck className="w-5 h-5 shrink-0" />
          <div>
            <span className="font-bold">
              نظام عزل وتوزيع الصلاحيات (RBAC Lead Isolation):
            </span>{" "}
            {currentUser.role === "super_admin" ? (
              <span>
                أنت مسجل بصلاحية <strong>المدير العام (super_admin)</strong> — تشاهد
                كافة الطلبات وتملك حق إسنادها لمديري القطاعات وتعديل كافة الحالات.
              </span>
            ) : currentUser.role === "sector_manager" ? (
              <span>
                أنت مسجل بصلاحية <strong>مدير قطاع المقاولات (sector_manager)</strong>{" "}
                — تقتصر شاشتك على الطلبات المسندة إليك أو المشمولة بقطاع المقاولات.
              </span>
            ) : (
              <span>
                أنت مسجل بصلاحية <strong>{currentUser.roleTitle}</strong> —{" "}
                {accessDeniedMsg ||
                  "وصول محجوب عن واجهة طلبات المشاريع (/api/inquiries) بموجب سياسة عزل الأدوار."}
              </span>
            )}
          </div>
        </div>

        {currentUser.role === "sector_manager" && (
          <button
            onClick={() => setRbacBypass(!rbacBypass)}
            className="text-[11px] underline font-bold text-[#2360A5] hover:text-[#163063] shrink-0"
          >
            {rbacBypass ? "تفعيل العزل (عرض قطاعي فقط)" : "تعطيل العزل للتجربة (عرض الكل)"}
          </button>
        )}
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
            placeholder="ابحث بالرقم المرجعي (RAO-...)، اسم الجهة، أو المسؤول..."
            className="w-full pr-9 pl-3.5 py-2 rounded-xl border border-[#E2ECF5] text-xs text-[#163063] placeholder:text-[#526071]/50 focus:border-[#2360A5] focus:ring-1 focus:ring-[#2360A5]"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: "all", label: "كافة الحالات" },
            { id: "new", label: "جديد" },
            { id: "reviewing", label: "قيد الدراسة" },
            { id: "contacted", label: "تم التواصل" },
            { id: "proposal_sent", label: "تم إرسال العرض" },
            { id: "closed_won", label: "مغلق بنجاح" },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                statusFilter === st.id
                  ? "bg-[#2360A5] text-white shadow-xs"
                  : "bg-[#F2F8FC] text-[#526071] hover:text-[#163063] hover:bg-[#E2ECF5]"
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* LEADS TABLE */}
      <div className="bg-white rounded-2xl border border-[#E2ECF5] shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-[#526071]">
            جاري تحميل طلبات المشاريع...
          </div>
        ) : visibleInquiries.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#526071]">
            لا توجد طلبات مطابقة لمعايير البحث الحالية.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#F2F8FC] border-b border-[#E2ECF5] text-[#163063] font-bold">
                <tr>
                  <th className="py-3.5 px-4">الرقم المرجعي</th>
                  <th className="py-3.5 px-4">اسم الكيان / الشريك</th>
                  <th className="py-3.5 px-4">المسارات والقطاعات</th>
                  <th className="py-3.5 px-4">المدينة والميزانية</th>
                  <th className="py-3.5 px-4">مسؤول التواصل</th>
                  <th className="py-3.5 px-4">حالة الطلب</th>
                  <th className="py-3.5 px-4">الإسناد</th>
                  <th className="py-3.5 px-4 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2ECF5]">
                {visibleInquiries.map((inq) => {
                  const statusInfo = getStatusInfo(inq.status);
                  const isAssignedToHarbi =
                    inq.assignedTo === "f.harbi@rawasialomar.sa";

                  return (
                    <tr
                      key={inq.id}
                      className="hover:bg-[#F2F8FC]/50 transition-colors"
                    >
                      {/* Ref ID */}
                      <td className="py-3.5 px-4 font-mono font-extrabold text-[#163063]">
                        <button
                          onClick={() => setSelectedInquiry(inq)}
                          className="hover:underline text-[#2360A5]"
                          title="عرض التفاصيل الكاملة"
                        >
                          {inq.refId}
                        </button>
                      </td>

                      {/* Entity */}
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-[#163063]">
                          {inq.entityName || inq.entityTypeName}
                        </p>
                        <span className="text-[11px] text-[#526071]">
                          {inq.entityTypeName}
                        </span>
                      </td>

                      {/* Services */}
                      <td className="py-3.5 px-4 max-w-[200px]">
                        <p className="line-clamp-1 font-semibold text-[#163063]">
                          {inq.serviceNames.join("، ")}
                        </p>
                        {inq.notes && (
                          <p className="text-[10px] text-[#526071] line-clamp-1 mt-0.5">
                            {inq.notes}
                          </p>
                        )}
                      </td>

                      {/* City & Budget */}
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-[#163063]">{inq.city}</p>
                        <span className="text-[10px] text-[#526071]">
                          {inq.budgetRange}
                        </span>
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-[#163063]">
                          {inq.contactName}
                        </p>
                        <span className="text-[11px] text-[#526071]" dir="ltr">
                          {inq.contactPhone}
                        </span>
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3.5 px-4">
                        <select
                          value={inq.status}
                          disabled={
                            isUpdating ||
                            (currentUser.role !== "super_admin" &&
                              currentUser.role !== "sector_manager")
                          }
                          onChange={(e) =>
                            handleStatusChange(inq.id, e.target.value)
                          }
                          className={`text-[11px] font-bold px-2 py-1 rounded-lg border cursor-pointer focus:ring-0 ${statusInfo.className}`}
                        >
                          <option value="new">جديد</option>
                          <option value="reviewing">قيد الدراسة</option>
                          <option value="contacted">تم التواصل</option>
                          <option value="proposal_sent">تم إرسال العرض</option>
                          <option value="closed_won">مغلق بنجاح</option>
                        </select>
                      </td>

                      {/* Assignment */}
                      <td className="py-3.5 px-4">
                        {currentUser.role === "super_admin" ? (
                          <select
                            value={inq.assignedTo || ""}
                            onChange={(e) =>
                              handleAssignToManager(inq.id, e.target.value)
                            }
                            className="text-[11px] bg-[#F2F8FC] border border-[#E2ECF5] rounded px-1.5 py-0.5 text-[#163063]"
                          >
                            <option value="">غير مسند</option>
                            <option value="f.harbi@rawasialomar.sa">
                              أ. فيصل الحربي (المقاولات)
                            </option>
                            <option value="ceo@rawasialomar.sa">
                              م. عبد العزيز (المدير العام)
                            </option>
                          </select>
                        ) : (
                          <span className="text-[11px] text-[#526071]">
                            {isAssignedToHarbi ? "أ. فيصل الحربي" : "الإدارة العامة"}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* 1-Click WhatsApp Follow-up */}
                          <a
                            href={inq.whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors shadow-xs"
                            title="متابعة عبر واتساب مباشرة بالرقم المرجعي"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>متابعة</span>
                          </a>

                          {/* Inspect Drawer Button */}
                          <button
                            onClick={() => setSelectedInquiry(inq)}
                            className="p-1 rounded-lg hover:bg-[#F2F8FC] text-[#526071] hover:text-[#163063]"
                            title="التفاصيل الكاملة"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DETAIL MODAL / DRAWER */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E2ECF5] max-w-xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#E2ECF5] pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-[#2360A5]">
                  {selectedInquiry.refId}
                </span>
                <h3 className="text-lg font-extrabold text-[#163063]">
                  {selectedInquiry.entityName || selectedInquiry.entityTypeName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="p-1.5 rounded-lg text-[#526071] hover:bg-[#F2F8FC]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-[#F2F8FC] p-3 rounded-xl border border-[#E2ECF5]">
                <span className="text-[#526071] block mb-1">نوع الكيان:</span>
                <span className="font-bold text-[#163063]">
                  {selectedInquiry.entityTypeName}
                </span>
              </div>
              <div className="bg-[#F2F8FC] p-3 rounded-xl border border-[#E2ECF5]">
                <span className="text-[#526071] block mb-1">المدينة والمنطقة:</span>
                <span className="font-bold text-[#163063]">
                  {selectedInquiry.city}
                </span>
              </div>
              <div className="bg-[#F2F8FC] p-3 rounded-xl border border-[#E2ECF5]">
                <span className="text-[#526071] block mb-1">الميزانية المرصودة:</span>
                <span className="font-bold text-[#163063]">
                  {selectedInquiry.budgetRange}
                </span>
              </div>
              <div className="bg-[#F2F8FC] p-3 rounded-xl border border-[#E2ECF5]">
                <span className="text-[#526071] block mb-1">الإطار الزمني:</span>
                <span className="font-bold text-[#163063]">
                  {selectedInquiry.timeline}
                </span>
              </div>
            </div>

            <div className="text-xs space-y-2">
              <div className="p-3 rounded-xl bg-white border border-[#E2ECF5]">
                <span className="text-[#526071] block mb-1">المسارات المطلوبة:</span>
                <span className="font-bold text-[#163063]">
                  {selectedInquiry.serviceNames.join("، ")}
                </span>
              </div>

              {selectedInquiry.notes && (
                <div className="p-3 rounded-xl bg-[#F2F8FC] border border-[#E2ECF5]">
                  <span className="text-[#526071] block mb-1">
                    الملاحظات وتوصيف الاحتياج:
                  </span>
                  <p className="text-[#163063] leading-relaxed">
                    {selectedInquiry.notes}
                  </p>
                </div>
              )}

              <div className="p-3 rounded-xl bg-white border border-[#E2ECF5] flex items-center justify-between">
                <div>
                  <span className="text-[#526071] block">مسؤول التواصل:</span>
                  <span className="font-bold text-[#163063]">
                    {selectedInquiry.contactName}{" "}
                    {selectedInquiry.contactRole
                      ? `(${selectedInquiry.contactRole})`
                      : ""}
                  </span>
                </div>
                <div className="text-left font-mono" dir="ltr">
                  <p className="font-bold text-[#2360A5]">
                    {selectedInquiry.contactPhone}
                  </p>
                  <p className="text-[11px] text-[#526071]">
                    {selectedInquiry.contactEmail}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#E2ECF5]">
              <a
                href={selectedInquiry.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>المتابعة عبر واتساب فوراً</span>
              </a>

              <button
                onClick={() => setSelectedInquiry(null)}
                className="px-4 py-2.5 rounded-xl border border-[#E2ECF5] text-xs font-bold text-[#526071] hover:bg-[#F2F8FC]"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
