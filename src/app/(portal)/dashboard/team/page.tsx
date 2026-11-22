"use client";

import React, { useState, useEffect } from "react";
import {
  Users2,
  ShieldCheck,
  UserPlus,
  KeyRound,
  CheckCircle2,
  Lock,
  Mail,
  Building,
  Briefcase,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { SEEDED_TEAM_MEMBERS, TeamMember } from "@/data/portalSeed";
import {
  DEMO_USERS,
  RoleId,
  UserProfile,
  getCurrentUser,
  signInAsRole,
} from "@/data/portalAuth";
import { useRouter } from "next/navigation";

export default function TeamPage() {
  const router = useRouter();
  const [members, setMembers] = useState<TeamMember[]>(SEEDED_TEAM_MEMBERS);
  const [currentUser, setCurrentUser] = useState<UserProfile>(
    DEMO_USERS.super_admin
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("sector_manager");
  const [newDept, setNewDept] = useState("المشاريع والتطوير");

  const [isSaving, setIsSaving] = useState(false);

  const fetchStaffMembers = async () => {
    try {
      const res = await fetch("/api/staff", { cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.members)) {
        setMembers(data.members);
      }
    } catch (e) {
      console.error("Failed to fetch staff profiles:", e);
    }
  };

  useEffect(() => {
    setCurrentUser(getCurrentUser());
    fetchStaffMembers();
    const onRoleChange = () => {
      setCurrentUser(getCurrentUser());
      fetchStaffMembers();
    };
    window.addEventListener("rao-role-changed", onRoleChange);
    return () => window.removeEventListener("rao-role-changed", onRoleChange);
  }, []);

  const handleImpersonate = async (roleId: string) => {
    if (roleId in DEMO_USERS) {
      const res = await signInAsRole(roleId as RoleId);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        router.refresh();
      }
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          email: newEmail,
          roleId: newRole,
          department: newDept,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.member) {
        setMembers((prev) => [...prev, data.member]);
        setShowAddModal(false);
        setNewName("");
        setNewEmail("");
      }
    } catch (err) {
      console.error("Failed to create staff member:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-[#163063] flex items-center gap-2">
              <Users2 className="w-6 h-6 text-[#163063]" />
              <span>فريق العمل ومصفوفة الصلاحيات (RBAC Team Matrix)</span>
            </h1>
            <span className="text-xs font-mono font-bold bg-[#163063] text-white px-2 py-0.5 rounded-full">
              {members.length} أعضاء
            </span>
          </div>
          <p className="text-xs text-[#526071]">
            إدارة صلاحيات الوصول المعتمدة لمديري القطاعات، صانعي المعرفة، ومراجعي الحوكمة.
          </p>
        </div>

        {currentUser.role === "super_admin" && (
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#163063] hover:bg-[#2360A5] text-white text-xs font-bold shadow-sm transition-colors self-start md:self-auto"
          >
            <UserPlus className="w-4 h-4" />
            <span>إضافة عضو جديد للفريق</span>
          </button>
        )}
      </div>

      {/* ROLES MATRIX SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#E2ECF5] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#163063]">المدير العام</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#163063] text-white">
              super_admin
            </span>
          </div>
          <p className="text-[11px] text-[#526071] leading-relaxed">
            صلاحيات شاملة 360° لكافة خطوط الـ CRM، إدارة الأدوار، ومصادقة اللوائح.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E2ECF5] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#2360A5]">مديرو القطاعات</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#2360A5] text-white">
              sector_manager
            </span>
          </div>
          <p className="text-[11px] text-[#526071] leading-relaxed">
            عزل الصلاحيات لمشاهدة ومتابعة طلبات قطاعهم المحدد وتقديم عروض الأسعار.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E2ECF5] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#3488C4]">محررو المعرفة</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#3488C4] text-white">
              marjea_editor (Maker)
            </span>
          </div>
          <p className="text-[11px] text-[#526071] leading-relaxed">
            صانع الأدلة الإجرائية: صياغة المسودات وتحديث النماذج ورفعها للتدقيق.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E2ECF5] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#47A3B8]">مراجعو الحوكمة</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#47A3B8] text-white">
              governance_reviewer (Checker)
            </span>
          </div>
          <p className="text-[11px] text-[#526071] leading-relaxed">
            الرقابة والامتثال: فحص المسودات واعتماد النشر الرسمي بمرجع الجمعيات.
          </p>
        </div>
      </div>

      {/* TEAM MEMBERS TABLE */}
      <div className="bg-white rounded-2xl border border-[#E2ECF5] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-[#F2F8FC] border-b border-[#E2ECF5] text-[#163063] font-bold">
              <tr>
                <th className="py-3.5 px-4">العضو</th>
                <th className="py-3.5 px-4">البريد المؤسسي</th>
                <th className="py-3.5 px-4">الدور الوظيفي والصلاحية</th>
                <th className="py-3.5 px-4">القسم</th>
                <th className="py-3.5 px-4">نطاق الوصول المعتمد</th>
                <th className="py-3.5 px-4">الحالة</th>
                <th className="py-3.5 px-4 text-center">التبديل الفوري</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2ECF5]">
              {members.map((m) => {
                const isCurrent = currentUser.email === m.email;
                return (
                  <tr
                    key={m.id}
                    className={`transition-colors ${
                      isCurrent ? "bg-[#2360A5]/5" : "hover:bg-[#F2F8FC]/50"
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#163063] text-white flex items-center justify-center font-bold text-[11px]">
                          {m.name.split(" ")[0][0]}
                        </div>
                        <div>
                          <p className="font-bold text-[#163063]">{m.name}</p>
                          <span className="text-[10px] text-[#526071]">
                            {m.lastLogin}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[#526071]" dir="ltr">
                      {m.email}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-[#163063] block">
                        {m.role}
                      </span>
                      <span className="font-mono text-[10px] text-[#2360A5]">
                        ({m.roleId})
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-[#526071]">{m.department}</td>

                    <td className="py-3.5 px-4 max-w-[240px] text-[#526071] leading-relaxed">
                      {m.accessScope}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>{m.status}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {isCurrent ? (
                        <span className="text-xs font-bold text-[#2360A5]">
                          أنت هنا
                        </span>
                      ) : (
                        <button
                          onClick={() => handleImpersonate(m.roleId)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F2F8FC] hover:bg-[#2360A5] hover:text-white text-[#2360A5] font-bold text-[11px] transition-colors border border-[#E2ECF5]"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>اختبار الدور</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD MEMBER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E2ECF5] max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-[#163063]">
              إضافة عضو جديد لمنظومة العمل
            </h3>

            <form onSubmit={handleAddMember} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#163063] mb-1">
                  الاسم الكامل:
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="مثال: أ. أحمد السبيعي"
                  className="w-full p-2.5 rounded-xl border border-[#E2ECF5]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#163063] mb-1">
                  البريد الإلكتروني المهني:
                </label>
                <input
                  type="email"
                  dir="ltr"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="name@rawasialomar.sa"
                  className="w-full p-2.5 rounded-xl border border-[#E2ECF5] text-right"
                />
              </div>

              <div>
                <label className="block font-bold text-[#163063] mb-1">
                  الدور والصلاحيات (RBAC Role):
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E2ECF5] bg-white"
                >
                  <option value="sector_manager">مدير قطاع / مبيعات</option>
                  <option value="marjea_editor">محرر المعرفة (Maker)</option>
                  <option value="governance_reviewer">مراجع الحوكمة (Checker)</option>
                  <option value="super_admin">المدير العام (صلاحيات كاملة)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#163063] mb-1">
                  القسم التابع له:
                </label>
                <input
                  type="text"
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E2ECF5]"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#E2ECF5]">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#163063] hover:bg-[#2360A5] text-white font-bold"
                >
                  حفظ العضو وتفعيل الصلاحية
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#E2ECF5] text-[#526071]"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
