"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Inbox,
  Landmark,
  Building,
  BookOpenCheck,
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Phone,
  MessageCircle,
  ExternalLink,
  Users,
  TrendingUp,
} from "lucide-react";
import { InquiryRecord } from "@/app/api/inquiries/route";
import { PROCEDURES_DATA } from "@/data/marjeaSeed";
import { DEMO_USERS, getCurrentUser, UserProfile } from "@/data/portalAuth";

export default function DashboardOverviewPage() {
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserProfile>(
    DEMO_USERS.super_admin
  );

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
    try {
      const res = await fetch("/api/inquiries", { cache: "no-store" });
      if (!res.ok) {
        setInquiries([]);
        return;
      }
      const data = await res.json();
      if (data.success && Array.isArray(data.inquiries)) {
        setInquiries(data.inquiries);
      }
    } catch (e) {
      console.error("Failed to load inquiries", e);
    } finally {
      setIsLoading(false);
    }
  };

  // Compute KPI metrics dynamically
  const totalInquiries = inquiries.length;
  const nonProfitInquiries = inquiries.filter(
    (i) => i.entityType === "charity" || i.entityType === "waqf"
  ).length;
  const corporateInquiries = inquiries.filter(
    (i) => i.entityType === "private" || i.entityType === "donor"
  ).length;
  const publishedGuidesCount = PROCEDURES_DATA.length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            جديد
          </span>
        );
      case "reviewing":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-[#2360A5] border border-blue-200">
            قيد الدراسة
          </span>
        );
      case "contacted":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
            تم التواصل
          </span>
        );
      case "proposal_sent":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            تم إرسال العرض
          </span>
        );
      case "closed_won":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            مغلق بنجاح
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto">
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl border border-[#E2ECF5] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F2F8FC] border border-[#E2ECF5] text-xs font-bold text-[#2360A5] mb-2">
            <span>مرحباً، {currentUser?.name || "المسؤول"}</span>
            <span className="text-[#526071]">({currentUser?.roleTitle})</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#163063]">
            مؤشرات الأداء وتأهيل المشاريع
          </h1>
          <p className="text-xs sm:text-sm text-[#526071] mt-1">
            متابعة فورية لطلبات المشاريع الواردة، خطوط الإسناد، ومؤشرات مرجع الجمعيات.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/dashboard/leads"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#163063] hover:bg-[#2360A5] text-white text-xs font-bold shadow-sm transition-colors"
          >
            <Inbox className="w-4 h-4" />
            <span>عرض كافة طلبات الـ CRM</span>
          </Link>
          <Link
            href="/start-project"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F2F8FC] border border-[#E2ECF5] hover:border-[#2360A5] text-xs font-bold text-[#2360A5] transition-colors"
          >
            <span>اختبار نموذج تأهيل جديد</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 4 KPI CARDS (Accented with the 4 Brand Colors) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* KPI 1: Deep Royal Navy #163063 */}
        <div className="bg-white rounded-2xl border-2 border-[#163063]/20 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 left-0 h-1.5 bg-[#163063]" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-[#526071]">إجمالي الطلبات المسجلة</span>
            <div className="w-10 h-10 rounded-xl bg-[#163063]/10 text-[#163063] flex items-center justify-center">
              <Inbox className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#163063] font-mono mb-1">
            {isLoading ? "..." : totalInquiries}
          </div>
          <p className="text-[11px] text-[#526071] flex items-center gap-1">
            <span className="text-emerald-600 font-bold">100% موثقة</span>
            <span>بأرقام مرجعية معتمدة</span>
          </p>
        </div>

        {/* KPI 2: Classic Corporate Blue #2360A5 */}
        <div className="bg-white rounded-2xl border-2 border-[#2360A5]/20 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 left-0 h-1.5 bg-[#2360A5]" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-[#526071]">طلبات الجمعيات والأوقاف</span>
            <div className="w-10 h-10 rounded-xl bg-[#2360A5]/10 text-[#2360A5] flex items-center justify-center">
              <Landmark className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#2360A5] font-mono mb-1">
            {isLoading ? "..." : nonProfitInquiries}
          </div>
          <p className="text-[11px] text-[#526071]">
            تشمل الجمعيات الأهلية والأوقاف العائلية
          </p>
        </div>

        {/* KPI 3: Bright Sky Cerulean #3488C4 */}
        <div className="bg-white rounded-2xl border-2 border-[#3488C4]/20 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 left-0 h-1.5 bg-[#3488C4]" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-[#526071]">طلبات القطاع الخاص والتنموي</span>
            <div className="w-10 h-10 rounded-xl bg-[#3488C4]/10 text-[#3488C4] flex items-center justify-center">
              <Building className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#3488C4] font-mono mb-1">
            {isLoading ? "..." : corporateInquiries}
          </div>
          <p className="text-[11px] text-[#526071]">
            المقاولات والتطوير والحلول التقنية الذكية
          </p>
        </div>

        {/* KPI 4: Soft Turquoise Teal #47A3B8 */}
        <div className="bg-white rounded-2xl border-2 border-[#47A3B8]/20 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 left-0 h-1.5 bg-[#47A3B8]" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-[#526071]">أدلة المرجع المنشورة</span>
            <div className="w-10 h-10 rounded-xl bg-[#47A3B8]/10 text-[#47A3B8] flex items-center justify-center">
              <BookOpenCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#47A3B8] font-mono mb-1">
            {publishedGuidesCount}
          </div>
          <p className="text-[11px] text-[#526071]">
            معتمدة بنظام الصانع والمراجع (Maker-Checker)
          </p>
        </div>
      </div>

      {/* RECENT INQUIRIES SECTION */}
      <div className="bg-white rounded-2xl border border-[#E2ECF5] shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-[#E2ECF5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-[#163063] flex items-center gap-2">
              <Inbox className="w-5 h-5 text-[#2360A5]" />
              <span>أحدث طلبات التأهيل الواردة (CRM Leads)</span>
            </h3>
            <p className="text-xs text-[#526071] mt-0.5">
              تصل الطلبات مباشرة من معالج /start-project مع رقم مرجعي رسمي ورابط واتساب مباشر.
            </p>
          </div>
          <Link
            href="/dashboard/leads"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2360A5] hover:text-[#163063]"
          >
            <span>إدارة ومعالجة كافة الطلبات</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-xs text-[#526071]">
            جاري تحميل الطلبات...
          </div>
        ) : inquiries.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#526071]">
            لا توجد طلبات مسجلة حالياً.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#F2F8FC] border-b border-[#E2ECF5] text-[#163063] font-bold">
                <tr>
                  <th className="py-3 px-4">الرقم المرجعي</th>
                  <th className="py-3 px-4">الجهة والنوع</th>
                  <th className="py-3 px-4">المسارات والقطاعات</th>
                  <th className="py-3 px-4">المدينة</th>
                  <th className="py-3 px-4">المسؤول</th>
                  <th className="py-3 px-4">الحالة</th>
                  <th className="py-3 px-4 text-center">الإجراء السريع</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2ECF5]">
                {inquiries.slice(0, 5).map((inq) => (
                  <tr key={inq.id} className="hover:bg-[#F2F8FC]/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#163063]">
                      {inq.refId}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-[#163063]">
                        {inq.entityName || inq.entityTypeName}
                      </p>
                      <span className="text-[11px] text-[#526071]">
                        {inq.entityTypeName}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-[200px]">
                      <span className="line-clamp-1 text-[#526071]">
                        {inq.serviceNames.join("، ")}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#526071]">{inq.city}</td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-[#163063]">{inq.contactName}</p>
                      <span className="text-[11px] text-[#526071]" dir="ltr">
                        {inq.contactPhone}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">{getStatusBadge(inq.status)}</td>
                    <td className="py-3.5 px-4 text-center">
                      <a
                        href={inq.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors font-bold text-[11px]"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>واتساب</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* QUICK WORKFLOW CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/dashboard/leads"
          className="p-5 rounded-2xl bg-white border border-[#E2ECF5] hover:border-[#2360A5] hover:shadow-md transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#2360A5]/10 text-[#2360A5] flex items-center justify-center mb-3">
              <Inbox className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-[#163063] group-hover:text-[#2360A5] transition-colors mb-1">
              متابعة مسار الـ CRM والعروض
            </h4>
            <p className="text-xs text-[#526071] leading-relaxed">
              تحديث حالات الطلبات من جديد إلى إرسال العروض وإغلاق المشاريع بنجاح.
            </p>
          </div>
          <span className="mt-4 text-xs font-bold text-[#2360A5] flex items-center gap-1">
            <span>فتح شاشة الطلبات</span>
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          </span>
        </Link>

        <Link
          href="/dashboard/marjea-cms"
          className="p-5 rounded-2xl bg-white border border-[#E2ECF5] hover:border-[#47A3B8] hover:shadow-md transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#47A3B8]/10 text-[#47A3B8] flex items-center justify-center mb-3">
              <BookOpenCheck className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-[#163063] group-hover:text-[#47A3B8] transition-colors mb-1">
              حوكمة مرجع الجمعيات (CMS)
            </h4>
            <p className="text-xs text-[#526071] leading-relaxed">
              إدارة مسار الصانع والمراجع (Maker-Checker) للأدلة الإجرائية والنماذج.
            </p>
          </div>
          <span className="mt-4 text-xs font-bold text-[#47A3B8] flex items-center gap-1">
            <span>إدارة المحتوى المعرفي</span>
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          </span>
        </Link>

        <Link
          href="/dashboard/team"
          className="p-5 rounded-2xl bg-white border border-[#E2ECF5] hover:border-[#163063] hover:shadow-md transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#163063]/10 text-[#163063] flex items-center justify-center mb-3">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-[#163063] transition-colors mb-1">
              فريق العمل ومصفوفة الصلاحيات
            </h4>
            <p className="text-xs text-[#526071] leading-relaxed">
              استعراض مصفوفة الصلاحيات (RBAC) لمديري القطاعات والمراجعين.
            </p>
          </div>
          <span className="mt-4 text-xs font-bold text-[#163063] flex items-center gap-1">
            <span>عرض الفريق والصلاحيات</span>
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          </span>
        </Link>
      </div>
    </div>
  );
}
