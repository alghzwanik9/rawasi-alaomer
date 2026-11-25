"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  History,
  FileCheck2,
  Lock,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Download,
  Filter,
  Search,
} from "lucide-react";
import { AuditLogRecord, SEEDED_AUDIT_LOGS } from "@/data/portalEnterpriseSeed";
import { getCurrentUser } from "@/data/portalAuth";

export default function GovernanceDashboard() {
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [auditLogs, setAuditLogs] = useState<AuditLogRecord[]>(SEEDED_AUDIT_LOGS);
  const [activeTab, setActiveTab] = useState<"logs" | "rbac" | "policies">("logs");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setCurrentUser(getCurrentUser());
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    try {
      const res = await fetch("/api/governance/audit");
      const data = await res.json();
      if (data.logs) setAuditLogs(data.logs);
    } catch {
      // Ignored
    }
  };

  const filteredLogs = auditLogs.filter(
    (log) =>
      log.actorName.includes(searchTerm) ||
      log.details.includes(searchTerm) ||
      log.actionType.includes(searchTerm) ||
      log.entityId.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E2ECF5] shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#47A3B8] mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>الحوكمة المؤسسية والرقابة الرشيدة (Enterprise Governance)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#163063]">
            مركز الحوكمة وسجل الرقابة والتدقيق الشامل
          </h1>
          <p className="text-xs sm:text-sm text-[#526071] mt-1">
            توثيق الحركات الحساسة، تطبيق مصفوفة الصلاحيات (RBAC)، ومواءمة اللوائح مع معايير المركز الوطني
          </p>
        </div>

        <div className="bg-[#F2F8FC] border border-[#E2ECF5] px-4 py-2.5 rounded-xl flex items-center gap-3 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <div className="text-xs">
            <div className="font-bold text-[#163063]">نظام الرقابة مفعّل</div>
            <div className="text-[10px] text-slate-500">حفظ تلقائي لكافة العمليات</div>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E2ECF5] shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">مؤشر الامتثال المؤسسي</span>
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-[#163063]">100%</div>
          <div className="text-[11px] text-emerald-700 mt-1 font-bold">
            مطابقة كاملة للأنظمة السعودية
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2ECF5] shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">العمليات الرقابية الموثقة</span>
            <History className="w-5 h-5 text-[#2360A5]" />
          </div>
          <div className="text-2xl font-bold text-[#163063]">{auditLogs.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">سجل تدقيق غير قابل للتعديل</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2ECF5] shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">مصفوفة الصلاحيات المطبقة</span>
            <Lock className="w-5 h-5 text-[#47A3B8]" />
          </div>
          <div className="text-2xl font-bold text-[#163063]">4 أدوار</div>
          <div className="text-[11px] text-[#47A3B8] font-semibold mt-1">
            صلاحيات معزولة سيرفر-سايد
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2ECF5] shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">اللوائح والسياسات المعتمدة</span>
            <FileCheck2 className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-[#163063]">6 سياسات</div>
          <div className="text-[11px] text-slate-500 mt-1">محدّثة لعام 2026</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E2ECF5] pb-2">
        <button
          onClick={() => setActiveTab("logs")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === "logs"
              ? "bg-[#163063] text-white shadow-xs"
              : "text-[#526071] hover:bg-white hover:text-[#163063]"
          }`}
        >
          سجل التدقيق والرقابة الفورية (Audit Trail)
        </button>

        <button
          onClick={() => setActiveTab("rbac")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === "rbac"
              ? "bg-[#163063] text-white shadow-xs"
              : "text-[#526071] hover:bg-white hover:text-[#163063]"
          }`}
        >
          مصفوفة الصلاحيات والاعتمادات (RBAC)
        </button>

        <button
          onClick={() => setActiveTab("policies")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === "policies"
              ? "bg-[#163063] text-white shadow-xs"
              : "text-[#526071] hover:bg-white hover:text-[#163063]"
          }`}
        >
          مستودع السياسات واللوائح المعتمدة
        </button>
      </div>

      {/* Tab 1: Audit Trail */}
      {activeTab === "logs" && (
        <div className="bg-white rounded-2xl border border-[#E2ECF5] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#E2ECF5] flex flex-wrap items-center justify-between gap-3 bg-[#F2F8FC]/50">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#163063]">
              <History className="w-4 h-4 text-[#2360A5]" />
              <span>سجل الحركات الإدارية والرقابية اللحظي</span>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
              <input
                type="text"
                placeholder="بحث في الحركات أو الموظف..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-[#E2ECF5] rounded-xl pr-9 pl-3 py-1.5 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-hidden focus:border-[#2360A5]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#F2F8FC] text-[#163063] font-bold border-b border-[#E2ECF5]">
                <tr>
                  <th className="py-3.5 px-4">الموظف القائم بالإجراء</th>
                  <th className="py-3.5 px-4">الدور الوظيفي</th>
                  <th className="py-3.5 px-4">نوع الإجراء</th>
                  <th className="py-3.5 px-4">الكيان / المعرّف</th>
                  <th className="py-3.5 px-4">تفاصيل الحركة</th>
                  <th className="py-3.5 px-4">التاريخ والوقت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2ECF5]">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#F2F8FC]/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#163063]">{log.actorName}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                        {log.actorRole}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                        {log.actionType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-600">
                      {log.entityId}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 max-w-md">{log.details}</td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                      {log.timestamp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: RBAC Matrix */}
      {activeTab === "rbac" && (
        <div className="bg-white rounded-2xl border border-[#E2ECF5] shadow-xs overflow-hidden p-6 space-y-4">
          <div>
            <h3 className="font-bold text-[#163063] text-base">مصفوفة الصلاحيات والحوكمة المزدوجة (RBAC Matrix)</h3>
            <p className="text-xs text-slate-500 mt-1">
              توزيع الصلاحيات الإدارية والرقابية المعتمدة عبر خوادم Next.js و Supabase RLS
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#163063] text-white font-bold">
                <tr>
                  <th className="py-3.5 px-4">الوحدة / الشاشة</th>
                  <th className="py-3.5 px-4 text-center">المشرف العام (super_admin)</th>
                  <th className="py-3.5 px-4 text-center">مدير القطاع (sector_manager)</th>
                  <th className="py-3.5 px-4 text-center">محرر المعرفة (marjea_editor)</th>
                  <th className="py-3.5 px-4 text-center">مراجع الحوكمة (governance_reviewer)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2ECF5]">
                {[
                  {
                    module: "طلبات المشاريع CRM",
                    sa: "كاملة (مشاهدة الكل + إسناد)",
                    sm: "طلبات قطاعه فقط",
                    me: "محجوب (403)",
                    gr: "محجوب (403)",
                  },
                  {
                    module: "إدارة ونشر أدلة مرجع الجمعيات",
                    sa: "صلاحية كاملة",
                    sm: "محجوب (403)",
                    me: "صانع (Maker) مسودات فقط",
                    gr: "مراجع معتمد (Checker) للنشر",
                  },
                  {
                    module: "الموارد البشرية والدوام",
                    sa: "إضافة موظفين واعتماد إجازات",
                    sm: "تسجيل دوامه واعتماد فريقه",
                    me: "تسجيل دوام شخصي",
                    gr: "تدقيق السجلات والامتثال",
                  },
                  {
                    module: "معرض المشاريع والمحفظة",
                    sa: "إضافة وتعديل وحذف ونشر",
                    sm: "إضافة وتعديل مشاريع قطاعه",
                    me: "قراءة فقط",
                    gr: "مراجعة جودة النشر",
                  },
                  {
                    module: "سجل التدقيق والحوكمة",
                    sa: "استعراض كامل السجل",
                    sm: "محجوب (403)",
                    me: "محجوب (403)",
                    gr: "استعراض كامل ومراجعة رقابية",
                  },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-[#F2F8FC]/50">
                    <td className="py-3.5 px-4 font-bold text-[#163063]">{row.module}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-emerald-700 bg-emerald-50/30">
                      {row.sa}
                    </td>
                    <td className="py-3.5 px-4 text-center text-[#2360A5]">{row.sm}</td>
                    <td className="py-3.5 px-4 text-center text-slate-600">{row.me}</td>
                    <td className="py-3.5 px-4 text-center font-semibold text-[#163063] bg-blue-50/20">
                      {row.gr}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Compliance Policies */}
      {activeTab === "policies" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: "ميثاق الجودة ونموذج تسليم المفتاح",
              code: "POL-QAL-01",
              dept: "المشاريع والتطوير",
              date: "معتمد 2026",
              desc: "ضوابط وضمانات استلام وتسليم المشاريع الإنشائية والتجهيز المكتبي دون تكاليف خفية.",
            },
            {
              title: "لائحة الحوكمة والرقابة المزدوجة (Maker-Checker)",
              code: "POL-GOV-02",
              dept: "الامتثال واللوائح",
              date: "معتمد 2026",
              desc: "تنظيم مسارات اعتماد الأدلة والنماذج التنموية ومنع انفراد أي موظف بالنشر دون تدقيق.",
            },
            {
              title: "سياسة تعارض المصالح والشفافية",
              code: "POL-ETH-03",
              dept: "الإدارة العامة",
              date: "معتمد 2026",
              desc: "إقرارات الشفافية للمدراء والمهندسين المشرفين على التعاقدات والمناقصات والتوريد.",
            },
            {
              title: "معايير الامتثال لمتطلبات المركز الوطني",
              code: "POL-NCNP-04",
              dept: "تمكين القطاع غير الربحي",
              date: "معتمد 2026",
              desc: "المواءمة الدورية مع تعاميم ولوائح المركز الوطني لتنمية القطاع غير الربحي والهيئة العامة للأوقاف.",
            },
          ].map((pol, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-[#E2ECF5] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold text-[#163063] bg-[#F2F8FC] px-2.5 py-1 rounded-lg border border-[#E2ECF5]">
                    {pol.code}
                  </span>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {pol.date}
                  </span>
                </div>
                <h3 className="font-bold text-[#163063] text-sm leading-snug">{pol.title}</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{pol.desc}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#2360A5] font-semibold">
                <span>الجهة الإشرافية: {pol.dept}</span>
                <span className="text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>سارية ومطبقة</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
