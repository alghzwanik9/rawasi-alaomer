"use client";

import React, { useState, useEffect } from "react";
import {
  Users2,
  Clock,
  CalendarCheck2,
  CalendarX2,
  UserPlus,
  Plus,
  CheckCircle2,
  AlertCircle,
  FileText,
  Search,
  Filter,
  ArrowUpRight,
  ShieldCheck,
  Send,
  X,
} from "lucide-react";
import { AttendanceRecord, LeaveRecord } from "@/data/portalEnterpriseSeed";
import { SEEDED_TEAM_MEMBERS, TeamMember } from "@/data/portalSeed";
import { getCurrentUser } from "@/data/portalAuth";

export default function HRManagementPage() {
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [leaves, setLeaves] = useState<LeaveRecord[]>([]);
  const [team, setTeam] = useState<TeamMember[]>(SEEDED_TEAM_MEMBERS);
  const [activeTab, setActiveTab] = useState<"attendance" | "leaves" | "staff">("attendance");
  
  // Real-time clock & date
  const [currentTime, setCurrentTime] = useState("");
  const [todayDate, setTodayDate] = useState("");
  const [hasClockedIn, setHasClockedIn] = useState(false);
  const [isClocking, setIsClocking] = useState(false);

  // Modals
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  // Form states
  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
    roleId: "sector_manager",
    department: "المشاريع والتطوير الإنشائي",
    phone: "",
    password: "Rawasi@2026!",
  });

  const [newLeave, setNewLeave] = useState({
    leaveType: "annual",
    startDate: "",
    endDate: "",
    daysCount: 1,
    reason: "",
  });

  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    setCurrentUser(getCurrentUser());
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    setTodayDate(todayStr);
    setNewLeave(prev => ({
      ...prev,
      startDate: todayStr,
      endDate: todayStr,
    }));

    const updateClock = () => {
      const current = new Date();
      setCurrentTime(current.toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);

    fetchAttendance();
    fetchLeaves();

    return () => clearInterval(timer);
  }, []);

  const fetchAttendance = async () => {
    try {
      const res = await fetch("/api/hr/attendance");
      const data = await res.json();
      if (data.records) {
        setAttendance(data.records);
        const myRecord = data.records.find((r: AttendanceRecord) => r.staffName === currentUser?.name);
        if (myRecord) setHasClockedIn(Boolean(myRecord.checkIn));
      }
    } catch {
      // Ignored
    }
  };

  const fetchLeaves = async () => {
    try {
      const res = await fetch("/api/hr/leaves");
      const data = await res.json();
      if (data.leaves) setLeaves(data.leaves);
    } catch {
      // Ignored
    }
  };

  const handleClockAction = async (action: "check_in" | "check_out") => {
    setIsClocking(true);
    try {
      const res = await fetch("/api/hr/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          staffId: currentUser?.role || "tm_1",
          staffName: currentUser?.name || "الموظف التنفيذي",
          department: currentUser?.department || "الإدارة العامة",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setHasClockedIn(action === "check_in");
        setSuccessMsg(action === "check_in" ? "تم تسجيل حضورك اليوم بنجاح!" : "تم تسجيل انصرافك بنجاح!");
        setTimeout(() => setSuccessMsg(""), 4000);
        fetchAttendance();
      }
    } finally {
      setIsClocking(false);
    }
  };

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStaff),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`تمت إضافة الموظف (${newStaff.name}) وتفعيل حسابه الإداري بنجاح!`);
        setTimeout(() => setSuccessMsg(""), 4000);
        setIsAddStaffOpen(false);
        setTeam((prev) => [
          ...prev,
          {
            id: `tm_${Date.now()}`,
            name: newStaff.name,
            email: newStaff.email,
            role: newStaff.department,
            roleId: newStaff.roleId,
            department: newStaff.department,
            status: "نشط",
            accessScope: "صلاحيات قسم " + newStaff.department,
            lastLogin: "الآن (جديد)",
          },
        ]);
        setNewStaff({
          name: "",
          email: "",
          roleId: "sector_manager",
          department: "المشاريع والتطوير الإنشائي",
          phone: "",
          password: "Rawasi@2026!",
        });
      }
    } catch {
      // Offline
    }
  };

  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/hr/leaves", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newLeave,
          staffName: currentUser?.name || "عضو الفريق",
          department: currentUser?.department || "المشاريع",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg("تم رفع طلب الإجازة للمراجعة والاعتماد بنجاح!");
        setTimeout(() => setSuccessMsg(""), 4000);
        setIsLeaveModalOpen(false);
        fetchLeaves();
      }
    } catch {
      // Offline
    }
  };

  const handleLeaveDecision = async (id: string, status: "approved" | "rejected") => {
    try {
      const res = await fetch("/api/hr/leaves", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (data.success) {
        fetchLeaves();
      }
    } catch {
      // Offline
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E2ECF5] shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#47A3B8] mb-1">
            <Users2 className="w-4 h-4" />
            <span>نظام الموارد البشرية وشؤون الموظفين (HR Suite)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#163063]">
            سجل الحضور والانصراف والكوادر الإدارية
          </h1>
          <p className="text-xs sm:text-sm text-[#526071] mt-1">
            إدارة أوقات الدوام الرسمي، متابعة انضباط الموظفين، إضافة الكوادر، واعتماد طلبات الإجازات
          </p>
        </div>

        {/* Live Attendance Clock Card */}
        <div className="bg-[#F2F8FC] border border-[#E2ECF5] rounded-xl p-3.5 flex items-center gap-4 shrink-0">
          <div>
            <div className="text-[11px] text-[#526071] font-medium">الوقت الحالي المعتمد:</div>
            <div className="font-mono text-base font-bold text-[#163063] dir-ltr text-right">
              {currentTime || "08:30:00 ص"}
            </div>
          </div>
          <button
            onClick={() => handleClockAction(hasClockedIn ? "check_out" : "check_in")}
            disabled={isClocking}
            className={`px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs transition-all flex items-center gap-2 cursor-pointer ${
              hasClockedIn
                ? "bg-amber-600 hover:bg-amber-700"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{hasClockedIn ? "تسجيل الانصراف" : "تسجيل الحضور"}</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs sm:text-sm flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E2ECF5] shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">إجمالي الكوادر</span>
            <Users2 className="w-5 h-5 text-[#2360A5]" />
          </div>
          <div className="text-2xl font-bold text-[#163063]">{team.length}</div>
          <div className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1 font-medium">
            <span>● جميع الكوادر نشطة ومفعلة</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2ECF5] shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">الحضور اليومي</span>
            <CalendarCheck2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-[#163063]">{attendance.length} / {team.length}</div>
          <div className="text-[11px] text-[#526071] mt-1 font-medium">
            نسبة الانضباط: 92%
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2ECF5] shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">الإجازات النشطة</span>
            <CalendarX2 className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-[#163063]">{leaves.filter(l => l.status === "approved").length}</div>
          <div className="text-[11px] text-amber-700 mt-1 font-medium">
            {leaves.filter(l => l.status === "pending").length} طلبات قيد المراجعة
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2ECF5] shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">ساعات العمل المنجزة</span>
            <Clock className="w-5 h-5 text-[#47A3B8]" />
          </div>
          <div className="text-2xl font-bold text-[#163063]">
            {attendance.reduce((sum, a) => sum + (a.totalHours || 8), 0).toFixed(1)} س
          </div>
          <div className="text-[11px] text-slate-500 mt-1">تراكمي لليوم الحالي</div>
        </div>
      </div>

      {/* Main Tab Bar */}
      <div className="flex items-center justify-between border-b border-[#E2ECF5] pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("attendance")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "attendance"
                ? "bg-[#163063] text-white shadow-xs"
                : "text-[#526071] hover:bg-white hover:text-[#163063]"
            }`}
          >
            سجل الحضور والانصراف
          </button>

          <button
            onClick={() => setActiveTab("leaves")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "leaves"
                ? "bg-[#163063] text-white shadow-xs"
                : "text-[#526071] hover:bg-white hover:text-[#163063]"
            }`}
          >
            <span>طلبات الإجازات</span>
            {leaves.filter((l) => l.status === "pending").length > 0 && (
              <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                {leaves.filter((l) => l.status === "pending").length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("staff")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "staff"
                ? "bg-[#163063] text-white shadow-xs"
                : "text-[#526071] hover:bg-white hover:text-[#163063]"
            }`}
          >
            دليل الكوادر الوظيفية
          </button>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === "leaves" && (
            <button
              onClick={() => setIsLeaveModalOpen(true)}
              className="bg-[#2360A5] hover:bg-[#163063] text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>تقديم طلب إجازة</span>
            </button>
          )}

          {activeTab === "staff" && (
            <button
              onClick={() => setIsAddStaffOpen(true)}
              className="bg-[#163063] hover:bg-[#2360A5] text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>إضافة موظف جديد</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab 1: Attendance Ledger Table */}
      {activeTab === "attendance" && (
        <div className="bg-white rounded-2xl border border-[#E2ECF5] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#E2ECF5] flex flex-wrap items-center justify-between gap-3 bg-[#F2F8FC]/50">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#163063]">
              <CalendarCheck2 className="w-4 h-4 text-[#2360A5]" />
              <span>سجل حضور اليوم المعتمد {todayDate ? `(${todayDate})` : ""}</span>
            </div>
            <div className="text-xs text-[#526071]">
              يتم رصد الوقت آلياً بموجب توقيت المملكة الرسمي
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#F2F8FC] text-[#163063] font-bold border-b border-[#E2ECF5]">
                <tr>
                  <th className="py-3.5 px-4">اسم الموظف</th>
                  <th className="py-3.5 px-4">القسم / الإدارة</th>
                  <th className="py-3.5 px-4">وقت الحضور</th>
                  <th className="py-3.5 px-4">وقت الانصراف</th>
                  <th className="py-3.5 px-4">إجمالي الساعات</th>
                  <th className="py-3.5 px-4">الحالة</th>
                  <th className="py-3.5 px-4">ملاحظات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2ECF5]">
                {attendance.map((record) => (
                  <tr key={record.id} className="hover:bg-[#F2F8FC]/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#163063] flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#163063]/10 text-[#163063] flex items-center justify-center font-bold text-xs">
                        {record.staffName.charAt(2) || "م"}
                      </div>
                      <span>{record.staffName}</span>
                    </td>
                    <td className="py-3.5 px-4 text-[#526071]">{record.department}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">{record.checkIn}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700">{record.checkOut || "—"}</td>
                    <td className="py-3.5 px-4 font-mono">{record.totalHours ? `${record.totalHours} س` : "قيد الدوام"}</td>
                    <td className="py-3.5 px-4">
                      {record.status === "present" && (
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          حاضر في الموعد
                        </span>
                      )}
                      {record.status === "late" && (
                        <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          تأخر عن الموعد
                        </span>
                      )}
                      {record.status === "excused" && (
                        <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          مستأذن بعذر
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 max-w-[200px] truncate">{record.notes || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Leaves Management */}
      {activeTab === "leaves" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {leaves.map((l) => (
            <div key={l.id} className="bg-white p-5 rounded-2xl border border-[#E2ECF5] shadow-xs flex flex-col justify-between gap-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-[#163063] text-sm">{l.staffName}</h3>
                    <span className="text-[11px] text-slate-400">({l.department})</span>
                  </div>
                  <div className="text-xs font-semibold text-[#2360A5] mt-1">{l.leaveTypeName}</div>
                </div>

                <div>
                  {l.status === "approved" && (
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-[11px] font-bold">
                      معتمدة
                    </span>
                  )}
                  {l.status === "pending" && (
                    <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full text-[11px] font-bold">
                      قيد الاعتماد
                    </span>
                  )}
                  {l.status === "rejected" && (
                    <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-full text-[11px] font-bold">
                      مرفوضة
                    </span>
                  )}
                </div>
              </div>

              <div className="bg-[#F2F8FC] p-3 rounded-xl border border-[#E2ECF5] text-xs space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>الفترة:</span>
                  <span className="font-mono font-bold text-[#163063]">
                    {l.startDate} إلى {l.endDate} ({l.daysCount} أيام)
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>السبب:</span>
                  <span className="text-[#163063]">{l.reason}</span>
                </div>
                {l.approvedBy && (
                  <div className="flex justify-between text-emerald-700 font-semibold pt-1 border-t border-[#E2ECF5]">
                    <span>تم الاعتماد بواسطة:</span>
                    <span>{l.approvedBy}</span>
                  </div>
                )}
              </div>

              {/* Manager Approval Actions */}
              {l.status === "pending" && (
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => handleLeaveDecision(l.id, "approved")}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    اعتماد الإجازة
                  </button>
                  <button
                    onClick={() => handleLeaveDecision(l.id, "rejected")}
                    className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    رفض الطلب
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Staff Roster */}
      {activeTab === "staff" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {team.map((member) => (
            <div key={member.id} className="bg-white p-5 rounded-2xl border border-[#E2ECF5] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#163063] to-[#2360A5] text-white flex items-center justify-center font-bold text-sm">
                    {member.name.charAt(2) || "م"}
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {member.status}
                  </span>
                </div>
                <h3 className="font-bold text-[#163063] text-sm">{member.name}</h3>
                <p className="text-xs text-[#2360A5] font-medium mt-0.5">{member.role}</p>
                <div className="mt-3 space-y-1 text-xs text-slate-500">
                  <div>القسم: <strong className="text-slate-700">{member.department}</strong></div>
                  <div>البريد: <strong className="text-slate-700 font-mono text-[11px]">{member.email}</strong></div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>الصلاحية: {member.roleId}</span>
                <span>{member.lastLogin}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Add Employee */}
      {isAddStaffOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-[#E2ECF5] overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-[#163063] p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#47A3B8]" />
                <h3 className="font-bold text-sm">إضافة وتأهيل موظف جديد في المنظومة</h3>
              </div>
              <button onClick={() => setIsAddStaffOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEmployee} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">الاسم الكامل للموظف:</label>
                <input
                  type="text"
                  required
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  placeholder="مثال: أ. محمد بن خالد الشمري"
                  className="w-full bg-[#F2F8FC] border border-[#E2ECF5] rounded-xl p-2.5 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">البريد المؤسسي:</label>
                  <input
                    type="email"
                    required
                    value={newStaff.email}
                    onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                    placeholder="m.shammari@rawasialomar.sa"
                    className="w-full bg-[#F2F8FC] border border-[#E2ECF5] rounded-xl p-2.5 font-mono focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">رقم الجوال:</label>
                  <input
                    type="tel"
                    required
                    value={newStaff.phone}
                    onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                    placeholder="05XXXXXXXX"
                    className="w-full bg-[#F2F8FC] border border-[#E2ECF5] rounded-xl p-2.5 font-mono focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">الدور والصلاحية:</label>
                  <select
                    value={newStaff.roleId}
                    onChange={(e) => setNewStaff({ ...newStaff, roleId: e.target.value })}
                    className="w-full bg-[#F2F8FC] border border-[#E2ECF5] rounded-xl p-2.5 focus:bg-white"
                  >
                    <option value="sector_manager">مدير قطاع تنفيذي (Sector Manager)</option>
                    <option value="marjea_editor">محرر أدلة ونماذج (Maker)</option>
                    <option value="governance_reviewer">مراجع حوكمة (Checker)</option>
                    <option value="super_admin">مشرف عام وإدارة عليا (Super Admin)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">القسم / الإدارة:</label>
                  <select
                    value={newStaff.department}
                    onChange={(e) => setNewStaff({ ...newStaff, department: e.target.value })}
                    className="w-full bg-[#F2F8FC] border border-[#E2ECF5] rounded-xl p-2.5 focus:bg-white"
                  >
                    <option value="المشاريع والتطوير الإنشائي">المشاريع والتطوير الإنشائي</option>
                    <option value="التجهيز والتوريد">التجهيز والتوريد</option>
                    <option value="التقنية والحلول الذكية">التقنية والحلول الذكية</option>
                    <option value="الموارد البشرية والشؤون الإدارية">الموارد البشرية والشؤون الإدارية</option>
                    <option value="الامتثال والرقابة واللوائح">الامتثال والرقابة واللوائح</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">كلمة المرور المؤقتة للحساب:</label>
                <input
                  type="text"
                  required
                  value={newStaff.password}
                  onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                  className="w-full bg-[#F2F8FC] border border-[#E2ECF5] rounded-xl p-2.5 font-mono focus:bg-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddStaffOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-[#163063] hover:bg-[#2360A5] text-white px-5 py-2 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  حفظ وتفعيل الموظف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Apply Leave */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#E2ECF5] overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-[#2360A5] p-4 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">تقديم طلب إجازة رسمي</h3>
              <button onClick={() => setIsLeaveModalOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplyLeave} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">نوع الإجازة:</label>
                <select
                  value={newLeave.leaveType}
                  onChange={(e) => setNewLeave({ ...newLeave, leaveType: e.target.value })}
                  className="w-full bg-[#F2F8FC] border border-[#E2ECF5] rounded-xl p-2.5 focus:bg-white"
                >
                  <option value="annual">إجازة اعتيادية سنوية</option>
                  <option value="emergency">إجازة اضطرارية / استئذان رسمي</option>
                  <option value="sick">إجازة مرضية موثقة</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">تاريخ البدء:</label>
                  <input
                    type="date"
                    required
                    value={newLeave.startDate}
                    onChange={(e) => setNewLeave({ ...newLeave, startDate: e.target.value })}
                    className="w-full bg-[#F2F8FC] border border-[#E2ECF5] rounded-xl p-2.5 font-mono focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">تاريخ الانتهاء:</label>
                  <input
                    type="date"
                    required
                    value={newLeave.endDate}
                    onChange={(e) => setNewLeave({ ...newLeave, endDate: e.target.value })}
                    className="w-full bg-[#F2F8FC] border border-[#E2ECF5] rounded-xl p-2.5 font-mono focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">عدد الأيام:</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  required
                  value={newLeave.daysCount}
                  onChange={(e) => setNewLeave({ ...newLeave, daysCount: Number(e.target.value) })}
                  className="w-full bg-[#F2F8FC] border border-[#E2ECF5] rounded-xl p-2.5 font-mono focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">سبب الإجازة والملاحظات:</label>
                <textarea
                  required
                  rows={3}
                  value={newLeave.reason}
                  onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
                  placeholder="بيان سبب طلب الإجازة وترتيب المهام أثناء الغياب..."
                  className="w-full bg-[#F2F8FC] border border-[#E2ECF5] rounded-xl p-2.5 focus:bg-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLeaveModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-[#2360A5] hover:bg-[#163063] text-white px-5 py-2 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  إرسال الطلب للاعتماد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
